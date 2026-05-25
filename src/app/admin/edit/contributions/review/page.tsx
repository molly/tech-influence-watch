"use client";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

import { uncachedFetchCommittees } from "@/app/actions/fetch";
import ReviewStatusBadge from "@/app/components/ReviewStatusBadge";
import { db } from "@/app/lib/db";
import { CommitteeConstant } from "@/app/types/Committee";
import {
  Contribution,
  Contributions,
  ManualReview,
  RollupContribution,
  SingleContribution,
} from "@/app/types/Contributions";
import { isError } from "@/app/utils/errors";

import styles from "../../../admin.module.css";

// Helper to check if contribution is a rollup
function isRollup(
  contribution: Contribution,
): contribution is RollupContribution {
  return "total" in contribution && "oldest" in contribution;
}

// Generate contribution ID matching Python backend logic
function getContributionId(contribution: Contribution): string {
  if (isRollup(contribution)) {
    // Rollup: rollup_{name}_{amount}_{date}
    const name = contribution.contributor_name || "";
    const amount = contribution.total_receipt_amount || 0;
    const date = contribution.oldest || "";
    return `rollup_${name}_${amount}_${date}`;
  } else {
    // Single contribution: txn_{transaction_id}
    const single = contribution as SingleContribution;
    return `txn_${single.transaction_id}`;
  }
}

// Format currency
function formatCurrency(amount?: number): string {
  if (amount === undefined) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date - parse as local date to avoid timezone issues
function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  try {
    // Parse YYYY-MM-DD as local date (not UTC) to avoid timezone conversion
    const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const [, year, month, day] = match;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (isNaN(date.getTime())) {
        return `Invalid: ${dateStr}`;
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }

    // Fallback for other formats
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return `Invalid: ${dateStr}`;
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return `Invalid: ${dateStr}`;
  }
}

type ContributionWithGroup = Contribution & {
  groupName?: string;
  _groupIndex: number;
  _contribIndex: number;
};

function getUniqueKey(contribution: ContributionWithGroup): string {
  return `${getContributionId(contribution)}_${contribution._groupIndex}_${contribution._contribIndex}`;
}

export default function ContributionReviewPage() {
  const [committees, setCommittees] = useState<Record<
    string,
    CommitteeConstant
  > | null>(null);
  const [selectedCommitteeId, setSelectedCommitteeId] = useState<string>("");
  const [contributions, setContributions] = useState<Contributions | null>(
    null,
  );
  const [loadingState, setLoadingState] = useState<
    "idle" | "loading" | "loaded" | "error"
  >("idle");
  const [saveStates, setSaveStates] = useState<Record<string, string>>({});
  const [editingContribution, setEditingContribution] = useState<string | null>(
    null,
  );
  const [editDescription, setEditDescription] = useState("");
  const [reviewCounts, setReviewCounts] = useState<
    Record<string, { total: number; unreviewed: number }>
  >({});
  const [bulkSaveState, setBulkSaveState] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [bulkOmitState, setBulkOmitState] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");

  // Count unreviewed contributions for a committee's data
  function countUnreviewed(data: Contributions): {
    total: number;
    unreviewed: number;
  } {
    let total = 0;
    let unreviewed = 0;
    for (const group of data.groups) {
      for (const c of group.contributions) {
        total++;
        if (!c.manualReview) unreviewed++;
      }
    }
    return { total, unreviewed };
  }

  // Load committees and review counts on mount
  useEffect(() => {
    (async () => {
      const data = await uncachedFetchCommittees();
      if (isError(data)) {
        console.error("Error loading committees");
        return;
      }
      setCommittees(data as Record<string, CommitteeConstant>);

      // Fetch all contributions to compute per-committee review counts
      try {
        const snapshot = await getDocs(collection(db, "contributions"));
        const counts: Record<string, { total: number; unreviewed: number }> =
          {};
        snapshot.forEach((doc) => {
          const contribs = doc.data() as Contributions;
          if (!contribs.groups) return;
          counts[doc.id] = countUnreviewed(contribs);
        });
        setReviewCounts(counts);
      } catch (error) {
        console.error("Error loading review counts:", error);
      }
    })();
  }, []);

  // Load contributions when committee is selected
  useEffect(() => {
    if (!selectedCommitteeId) {
      setContributions(null); // eslint-disable-line react-hooks/set-state-in-effect
      return;
    }

    (async () => {
      setLoadingState("loading");
      try {
        const docRef = doc(db, "contributions", selectedCommitteeId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setContributions(snapshot.data() as Contributions);
          setLoadingState("loaded");
        } else {
          setLoadingState("error");
        }
      } catch (error) {
        console.error("Error loading contributions:", error);
        setLoadingState("error");
      }
    })();
  }, [selectedCommitteeId]);

  const updateContributionReview = async (
    contribution: ContributionWithGroup,
    status: "verified" | "omit",
    description: string,
  ) => {
    if (!selectedCommitteeId || !contributions) return;

    const uniqueKey = getUniqueKey(contribution);
    const contributionId = getContributionId(contribution);
    setSaveStates({ ...saveStates, [uniqueKey]: "pending" });

    const manualReview: ManualReview = {
      reviewed: true,
      status,
      reviewed_at: new Date().toISOString(),
    };

    try {
      const updatedContributions = { ...contributions };

      // Update in by_date by ID (denormalized view, ID-based is fine here)
      updatedContributions.by_date = updatedContributions.by_date.map((c) =>
        getContributionId(c) === contributionId
          ? { ...c, manualReview, ...(description && { description }) }
          : c,
      );

      // Update in groups by index to handle duplicate IDs
      updatedContributions.groups = updatedContributions.groups.map(
        (group, gi) => ({
          ...group,
          contributions: group.contributions.map((c, ci) =>
            gi === contribution._groupIndex && ci === contribution._contribIndex
              ? { ...c, manualReview, ...(description && { description }) }
              : c,
          ),
        }),
      );

      const docRef = doc(db, "contributions", selectedCommitteeId);
      await updateDoc(docRef, updatedContributions);

      setContributions(updatedContributions);
      if (!contribution.manualReview && selectedCommitteeId) {
        setReviewCounts((prev) => ({
          ...prev,
          [selectedCommitteeId]: {
            total: prev[selectedCommitteeId]?.total || 0,
            unreviewed: Math.max(
              0,
              (prev[selectedCommitteeId]?.unreviewed || 0) - 1,
            ),
          },
        }));
      }
      setSaveStates({ ...saveStates, [uniqueKey]: "success" });
      setEditingContribution(null);
      setEditDescription("");

      setTimeout(() => {
        setSaveStates((prev) => {
          const updated = { ...prev };
          delete updated[uniqueKey];
          return updated;
        });
      }, 2000);
    } catch (error) {
      console.error("Error updating contribution:", error);
      setSaveStates({ ...saveStates, [uniqueKey]: "error" });

      setTimeout(() => {
        setSaveStates((prev) => {
          const updated = { ...prev };
          delete updated[uniqueKey];
          return updated;
        });
      }, 3000);
    }
  };

  const markAllAsVerified = async () => {
    if (!selectedCommitteeId || !contributions) return;
    if (
      !window.confirm(
        "Mark all unreviewed contributions for this committee as verified?",
      )
    )
      return;

    setBulkSaveState("pending");

    const manualReview: ManualReview = {
      reviewed: true,
      status: "verified",
      reviewed_at: new Date().toISOString(),
    };

    try {
      const updatedContributions = { ...contributions };

      updatedContributions.by_date = updatedContributions.by_date.map((c) =>
        c.manualReview ? c : { ...c, manualReview },
      );

      updatedContributions.groups = updatedContributions.groups.map(
        (group) => ({
          ...group,
          contributions: group.contributions.map((c) =>
            c.manualReview ? c : { ...c, manualReview },
          ),
        }),
      );

      const docRef = doc(db, "contributions", selectedCommitteeId);
      await updateDoc(docRef, updatedContributions);

      setContributions(updatedContributions);
      setReviewCounts((prev) => ({
        ...prev,
        [selectedCommitteeId]: {
          total: prev[selectedCommitteeId]?.total || 0,
          unreviewed: 0,
        },
      }));
      setBulkSaveState("success");
      setTimeout(() => setBulkSaveState("idle"), 2000);
    } catch (error) {
      console.error("Error marking all as verified:", error);
      setBulkSaveState("error");
      setTimeout(() => setBulkSaveState("idle"), 3000);
    }
  };

  const markAllAsOmit = async () => {
    if (!selectedCommitteeId || !contributions) return;
    if (
      !window.confirm(
        "Mark all unreviewed contributions for this committee as omit?",
      )
    )
      return;

    setBulkOmitState("pending");

    const manualReview: ManualReview = {
      reviewed: true,
      status: "omit",
      reviewed_at: new Date().toISOString(),
    };

    try {
      const updatedContributions = { ...contributions };

      updatedContributions.by_date = updatedContributions.by_date.map((c) =>
        c.manualReview ? c : { ...c, manualReview },
      );

      updatedContributions.groups = updatedContributions.groups.map(
        (group) => ({
          ...group,
          contributions: group.contributions.map((c) =>
            c.manualReview ? c : { ...c, manualReview },
          ),
        }),
      );

      const docRef = doc(db, "contributions", selectedCommitteeId);
      await updateDoc(docRef, updatedContributions);

      setContributions(updatedContributions);
      setReviewCounts((prev) => ({
        ...prev,
        [selectedCommitteeId]: {
          total: prev[selectedCommitteeId]?.total || 0,
          unreviewed: 0,
        },
      }));
      setBulkOmitState("success");
      setTimeout(() => setBulkOmitState("idle"), 2000);
    } catch (error) {
      console.error("Error marking all as omit:", error);
      setBulkOmitState("error");
      setTimeout(() => setBulkOmitState("idle"), 3000);
    }
  };

  // Flatten contributions with group info (including omitted for review)
  const getFlattenedContributions = (): ContributionWithGroup[] => {
    if (!contributions) return [];

    const flattened: ContributionWithGroup[] = [];
    contributions.groups.forEach((group, gi) => {
      group.contributions.forEach((c, ci) => {
        flattened.push({
          ...c,
          groupName: group.company === "OMITTED" ? "Omitted" : group.company,
          _groupIndex: gi,
          _contribIndex: ci,
        });
      });
    });

    flattened.sort((a, b) => {
      if (!a.manualReview && b.manualReview) return -1;
      if (a.manualReview && !b.manualReview) return 1;
      return 0;
    });

    return flattened;
  };

  const renderContributionRow = (contribution: ContributionWithGroup) => {
    const contributionId = getUniqueKey(contribution);
    const isEditing = editingContribution === contributionId;
    const saveState = saveStates[contributionId];
    const rollup = isRollup(contribution);
    const single = !rollup ? (contribution as SingleContribution) : null;

    // Build full name from components
    const fullName = contribution.redacted
      ? "REDACTED"
      : [
          contribution.contributor_first_name,
          contribution.contributor_middle_name,
          contribution.contributor_last_name,
          contribution.contributor_suffix,
        ]
          .filter(Boolean)
          .join(" ") ||
        contribution.contributor_name ||
        "Unknown";

    return (
      <div key={contributionId} className={styles.contributionCard}>
        <div className={styles.flexRowSpaceBetween}>
          <div className={styles.flex1}>
            {/* Header with name and status */}
            <div className={styles.contributorNameRow}>
              <strong className={styles.contributorNameText}>{fullName}</strong>
              <div className={styles.marginLeftAuto}>
                <ReviewStatusBadge manualReview={contribution.manualReview} />
              </div>
            </div>

            {/* Primary details */}
            <div className={styles.detailsGrid}>
              {rollup && (
                <>
                  <span className={styles.detailLabel}>Type:</span>
                  <span className={styles.rollupTypeValue}>
                    Rollup ({contribution.total} contributions)
                  </span>
                </>
              )}

              {contribution.entity_type && (
                <>
                  <span className={styles.detailLabel}>Entity Type:</span>
                  <span>{contribution.entity_type}</span>
                </>
              )}

              {contribution.contributor_occupation && (
                <>
                  <span className={styles.detailLabel}>Occupation:</span>
                  <span>{contribution.contributor_occupation}</span>
                </>
              )}

              {contribution.contributor_employer && (
                <>
                  <span className={styles.detailLabel}>Employer:</span>
                  <span>{contribution.contributor_employer}</span>
                </>
              )}

              {contribution.groupName && (
                <>
                  <span className={styles.detailLabel}>Group:</span>
                  <span>{contribution.groupName}</span>
                </>
              )}

              {rollup ? (
                <>
                  <span className={styles.detailLabel}>Date Range:</span>
                  <span>
                    {formatDate(contribution.oldest)} -{" "}
                    {formatDate(contribution.newest)}
                  </span>
                  <span className={styles.detailLabel}>Total Amount:</span>
                  <span className={styles.boldValue}>
                    {formatCurrency(contribution.total_receipt_amount)}
                  </span>
                </>
              ) : (
                <>
                  <span className={styles.detailLabel}>Date:</span>
                  <span>{formatDate(single?.contribution_receipt_date)}</span>
                  <span className={styles.detailLabel}>Amount:</span>
                  <span className={styles.boldValue}>
                    {formatCurrency(single?.contribution_receipt_amount)}
                  </span>
                </>
              )}

              {contribution.contributor_aggregate_ytd && (
                <>
                  <span className={styles.detailLabel}>Aggregate YTD:</span>
                  <span>
                    {formatCurrency(contribution.contributor_aggregate_ytd)}
                  </span>
                </>
              )}

              {single?.receipt_type && (
                <>
                  <span className={styles.detailLabel}>Line Number:</span>
                  <span className={styles.monoValue}>
                    {single.receipt_type}
                  </span>
                </>
              )}

              {single?.transaction_id && (
                <>
                  <span className={styles.detailLabel}>Transaction ID:</span>
                  <span className={styles.monoValue}>
                    {single.transaction_id}
                  </span>
                </>
              )}

              {single?.receipt_type_full && (
                <>
                  <span className={styles.detailLabel}>Receipt Type:</span>
                  <span>
                    {single.receipt_type_full}
                    {single.receipt_type && ` (${single.receipt_type})`}
                  </span>
                </>
              )}

              {single?.pdf_url && (
                <>
                  <span className={styles.detailLabel}>FEC Filing:</span>
                  <span>
                    <a
                      href={single.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.adminLink}
                    >
                      View PDF
                    </a>
                  </span>
                </>
              )}

              {contribution.link && (
                <>
                  <span className={styles.detailLabel}>Link:</span>
                  <span>
                    <a href={contribution.link} className={styles.adminLink}>
                      {contribution.link}
                    </a>
                  </span>
                </>
              )}
            </div>

            {/* Flags */}
            <div className={styles.flagsRow}>
              {contribution.claimed && (
                <span className={styles.claimedBadge}>Claimed</span>
              )}
              {contribution.redacted && (
                <span className={styles.redactedBadge}>Redacted</span>
              )}
            </div>

            {/* Current review description */}
            {contribution.description && !isEditing && (
              <div className={styles.reviewNote}>
                <strong>Review Note:</strong> {contribution.description}
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className={styles.editSection}>
            <div className={styles.editDescriptionRow}>
              <label className={styles.editLabel}>
                Description (optional):
              </label>
              <textarea
                className={styles.editorTextArea}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                placeholder="Add a note about this contribution..."
              />
            </div>
            <div className={styles.editButtonRow}>
              <button
                onClick={() =>
                  updateContributionReview(
                    contribution,
                    "verified",
                    editDescription,
                  )
                }
                disabled={saveState === "pending"}
                className={styles.buttonVerifyLarge}
              >
                Mark as Verified
              </button>
              <button
                onClick={() =>
                  updateContributionReview(
                    contribution,
                    "omit",
                    editDescription,
                  )
                }
                disabled={saveState === "pending"}
                className={styles.buttonOmitLarge}
              >
                Mark as Omit
              </button>
              <button
                onClick={() => {
                  setEditingContribution(null);
                  setEditDescription("");
                }}
                disabled={saveState === "pending"}
                className={styles.buttonCancelLarge}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {!isEditing && (
          <div className={styles.actionButtonRow}>
            <button
              onClick={() => updateContributionReview(contribution, "verified", "")}
              disabled={saveState === "pending"}
              className={styles.buttonVerifySmall}
            >
              Verify
            </button>
            <button
              onClick={() => updateContributionReview(contribution, "omit", "")}
              disabled={saveState === "pending"}
              className={styles.buttonOmitSmall}
            >
              Omit
            </button>
            <button
              onClick={() => {
                setEditingContribution(contributionId);
                setEditDescription(contribution.description || "");
              }}
              className={styles.buttonCancelSmall}
            >
              Edit / Add Note
            </button>
          </div>
        )}

        {saveState === "success" && (
          <div className={styles.saveSuccessMsg}>✓ Saved successfully</div>
        )}
        {saveState === "error" && (
          <div className={styles.saveErrorMsg}>✗ Error saving</div>
        )}
      </div>
    );
  };

  if (!committees) {
    return <div className={styles.container}>Loading committees...</div>;
  }

  // Sort: committees with unreviewed contributions first, then alphabetical
  const committeeKeys = Object.keys(committees).sort((a, b) => {
    const aUnreviewed = reviewCounts[a]?.unreviewed || 0;
    const bUnreviewed = reviewCounts[b]?.unreviewed || 0;
    if (aUnreviewed > 0 && bUnreviewed === 0) return -1;
    if (aUnreviewed === 0 && bUnreviewed > 0) return 1;
    return committees[a].name.localeCompare(committees[b].name);
  });

  return (
    <div className={styles.container}>
      <h1>Review Contributions</h1>
      <p>Review and mark contributions as verified or omitted</p>

      <section className={styles.editorCard}>
        <select
          className={styles.editorSelect}
          value={selectedCommitteeId}
          onChange={(e) => setSelectedCommitteeId(e.target.value)}
        >
          <option value="">Select a committee</option>
          {committeeKeys.map((key) => {
            const counts = reviewCounts[key];
            const unreviewed = counts?.unreviewed || 0;
            return (
              <option key={key} value={key}>
                {unreviewed > 0
                  ? `* ${committees[key].name} (${unreviewed} unreviewed)`
                  : committees[key].name}
              </option>
            );
          })}
        </select>

        {loadingState === "loading" && <p>Loading contributions...</p>}
        {loadingState === "error" && <p>Error loading contributions.</p>}
        {loadingState === "loaded" && contributions && (
          <div className={styles.loadedSection}>
            <div className={styles.statsRow}>
              <p className={styles.statsText}>
                Total contributions: {getFlattenedContributions().length}
              </p>
              {getFlattenedContributions().some((c) => !c.manualReview) && (
                <button
                  onClick={markAllAsVerified}
                  disabled={bulkSaveState === "pending"}
                  className={`${styles.bulkVerifyButton}${bulkSaveState === "success" ? ` ${styles.bulkVerifyButtonSuccess}` : ""}`}
                >
                  {bulkSaveState === "pending"
                    ? "Saving..."
                    : bulkSaveState === "success"
                      ? "All verified!"
                      : "Mark all unreviewed as verified"}
                </button>
              )}
              {bulkSaveState === "error" && (
                <span className={styles.errorText}>
                  Error saving — please try again
                </span>
              )}
              {getFlattenedContributions().some((c) => !c.manualReview) && (
                <button
                  onClick={markAllAsOmit}
                  disabled={bulkOmitState === "pending"}
                  className={`${styles.bulkOmitButton}${bulkOmitState === "success" ? ` ${styles.bulkOmitButtonSuccess}` : ""}`}
                >
                  {bulkOmitState === "pending"
                    ? "Saving..."
                    : bulkOmitState === "success"
                      ? "All omitted!"
                      : "Omit all unreviewed"}
                </button>
              )}
              {bulkOmitState === "error" && (
                <span className={styles.errorText}>
                  Error saving — please try again
                </span>
              )}
            </div>
            <div>
              {getFlattenedContributions().map((contribution) =>
                renderContributionRow(contribution),
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
