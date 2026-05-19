"use client";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

import ReviewStatusBadge from "@/app/components/ReviewStatusBadge";
import { db } from "@/app/lib/db";
import { CompanyConstant } from "@/app/types/Companies";
import {
  IndividualOrCompanyContribution,
  IndividualOrCompanyContributionGroup,
  ManualReview,
} from "@/app/types/Contributions";

import styles from "../../../../admin/admin.module.css";

type CompanyData = {
  contributions?: IndividualOrCompanyContributionGroup[];
  [key: string]: unknown;
};

type ContributionWithCommittee = IndividualOrCompanyContribution & {
  _committeeId: string;
  _committeeName?: string;
  _groupIndex: number;
  _contribIndex: number;
};

function getUniqueKey(contribution: ContributionWithCommittee): string {
  return `${getContributionId(contribution)}_${contribution._groupIndex}_${contribution._contribIndex}`;
}

// Generate contribution ID matching Python backend logic
function getContributionId(contribution: IndividualOrCompanyContribution): string {
  if (contribution.total !== undefined && contribution.oldest !== undefined) {
    // Rollup
    const name = contribution.contributor_name || "";
    const amount = contribution.total_receipt_amount || 0;
    const date = contribution.oldest || "";
    return `rollup_${name}_${amount}_${date}`;
  } else {
    return `txn_${contribution.transaction_id}`;
  }
}

function formatCurrency(amount?: number | null): string {
  if (amount === undefined || amount === null) {
    return "$0";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) {
    return "";
  }
  try {
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

function countUnreviewed(groups: IndividualOrCompanyContributionGroup[]): {
  total: number;
  unreviewed: number;
} {
  let total = 0;
  let unreviewed = 0;
  for (const group of groups) {
    for (const c of group.contributions) {
      total++;
      if (!c.manualReview) {
        unreviewed++;
      }
    }
  }
  return { total, unreviewed };
}

export default function CompanyContributionReviewPage() {
  const [companies, setCompanies] = useState<Record<
    string,
    CompanyConstant
  > | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [loadingState, setLoadingState] = useState<
    "idle" | "loading" | "loaded" | "error"
  >("idle");
  const [saveStates, setSaveStates] = useState<Record<string, string>>({});
  const [editingContribution, setEditingContribution] = useState<string | null>(null);
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

  // Load company constants and review counts on mount
  useEffect(() => {
    (async () => {
      try {
        const constantsDoc = await getDoc(doc(db, "constants", "companies"));
        if (!constantsDoc.exists()) {
          console.error("No company constants found");
          return;
        }
        setCompanies(constantsDoc.data() as Record<string, CompanyConstant>);
      } catch (error) {
        console.error("Error loading company constants:", error);
        return;
      }

      // Fetch all company docs to compute per-company review counts
      try {
        const snapshot = await getDocs(collection(db, "companies"));
        const counts: Record<string, { total: number; unreviewed: number }> = {};
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as CompanyData;
          if (data.contributions) {
            counts[docSnap.id] = countUnreviewed(data.contributions);
          } else {
            counts[docSnap.id] = { total: 0, unreviewed: 0 };
          }
        });
        setReviewCounts(counts);
      } catch (error) {
        console.error("Error loading review counts:", error);
      }
    })();
  }, []);

  // Load company data when a company is selected
  useEffect(() => {
    if (!selectedCompanyId) {
      setCompanyData(null); // eslint-disable-line react-hooks/set-state-in-effect
      return;
    }

    (async () => {
      setLoadingState("loading");
      try {
        const docRef = doc(db, "companies", selectedCompanyId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setCompanyData(snapshot.data() as CompanyData);
          setLoadingState("loaded");
        } else {
          setLoadingState("error");
        }
      } catch (error) {
        console.error("Error loading company:", error);
        setLoadingState("error");
      }
    })();
  }, [selectedCompanyId]);

  const updateContributionReview = async (
    contribution: ContributionWithCommittee,
    status: "verified" | "omit",
    description: string,
  ) => {
    if (!selectedCompanyId || !companyData?.contributions) {
      return;
    }

    const uniqueKey = getUniqueKey(contribution);
    setSaveStates({ ...saveStates, [uniqueKey]: "pending" });

    const manualReview: ManualReview = {
      reviewed: true,
      status,
      reviewed_at: new Date().toISOString(),
    };

    try {
      const updatedGroups: IndividualOrCompanyContributionGroup[] =
        companyData.contributions.map((group, gi) => ({
          ...group,
          contributions: group.contributions.map((c, ci) => {
            if (gi === contribution._groupIndex && ci === contribution._contribIndex) {
              return {
                ...c,
                manualReview,
                ...(description && { description }),
              };
            }
            return c;
          }),
        }));

      const docRef = doc(db, "companies", selectedCompanyId);
      await updateDoc(docRef, { contributions: updatedGroups });

      setCompanyData({ ...companyData, contributions: updatedGroups });

      if (!contribution.manualReview) {
        setReviewCounts((prev) => ({
          ...prev,
          [selectedCompanyId]: {
            total: prev[selectedCompanyId]?.total || 0,
            unreviewed: Math.max(0, (prev[selectedCompanyId]?.unreviewed || 0) - 1),
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
    if (!selectedCompanyId || !companyData?.contributions) {
      return;
    }
    if (
      !window.confirm(
        "Mark all unreviewed contributions for this company as verified?",
      )
    ) {
      return;
    }

    setBulkSaveState("pending");

    const manualReview: ManualReview = {
      reviewed: true,
      status: "verified",
      reviewed_at: new Date().toISOString(),
    };

    try {
      const updatedGroups: IndividualOrCompanyContributionGroup[] =
        companyData.contributions.map((group) => ({
          ...group,
          contributions: group.contributions.map((c) =>
            c.manualReview ? c : { ...c, manualReview },
          ),
        }));

      const docRef = doc(db, "companies", selectedCompanyId);
      await updateDoc(docRef, { contributions: updatedGroups });

      setCompanyData({ ...companyData, contributions: updatedGroups });
      setReviewCounts((prev) => ({
        ...prev,
        [selectedCompanyId]: {
          total: prev[selectedCompanyId]?.total || 0,
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
    if (!selectedCompanyId || !companyData?.contributions) {
      return;
    }
    if (
      !window.confirm(
        "Mark all unreviewed contributions for this company as omit?",
      )
    ) {
      return;
    }

    setBulkOmitState("pending");

    const manualReview: ManualReview = {
      reviewed: true,
      status: "omit",
      reviewed_at: new Date().toISOString(),
    };

    try {
      const updatedGroups: IndividualOrCompanyContributionGroup[] =
        companyData.contributions.map((group) => ({
          ...group,
          contributions: group.contributions.map((c) =>
            c.manualReview ? c : { ...c, manualReview },
          ),
        }));

      const docRef = doc(db, "companies", selectedCompanyId);
      await updateDoc(docRef, { contributions: updatedGroups });

      setCompanyData({ ...companyData, contributions: updatedGroups });
      setReviewCounts((prev) => ({
        ...prev,
        [selectedCompanyId]: {
          total: prev[selectedCompanyId]?.total || 0,
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

  const getFlattenedContributions = (): ContributionWithCommittee[] => {
    if (!companyData?.contributions) {
      return [];
    }

    const flattened: ContributionWithCommittee[] = [];
    companyData.contributions.forEach((group, gi) => {
      group.contributions.forEach((c, ci) => {
        flattened.push({
          ...c,
          _committeeId: group.committee_id,
          _committeeName: c.committee_name,
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

  const renderContributionRow = (contribution: ContributionWithCommittee) => {
    const contributionId = getUniqueKey(contribution);
    const isEditing = editingContribution === contributionId;
    const saveState = saveStates[contributionId];
    const isRollup =
      contribution.total !== undefined && contribution.oldest !== undefined;

    const contributorLabel =
      contribution.contributor_name ||
      [contribution.contributor_first_name, contribution.contributor_last_name]
        .filter(Boolean)
        .join(" ") ||
      "Unknown";

    return (
      <div key={contributionId} className={styles.contributionCard}>
        <div className={styles.flexRowSpaceBetween}>
          <div className={styles.flex1}>
            {/* Header with name and status */}
            <div className={styles.contributorNameRow}>
              <strong className={styles.contributorNameText}>{contributorLabel}</strong>
              <div className={styles.marginLeftAuto}>
                <ReviewStatusBadge manualReview={contribution.manualReview} />
              </div>
            </div>

            {/* Details grid */}
            <div className={styles.detailsGrid}>
              {isRollup && (
                <>
                  <span className={styles.detailLabel}>Type:</span>
                  <span className={styles.rollupTypeValue}>
                    Rollup ({contribution.total} contributions)
                  </span>
                </>
              )}

              {contribution.isIndividual && contribution.individual && (
                <>
                  <span className={styles.detailLabel}>Individual:</span>
                  <span>{contribution.individual}</span>
                </>
              )}

              <span className={styles.detailLabel}>Recipient:</span>
              <span>
                {contribution._committeeName || contribution._committeeId}
              </span>

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

              {isRollup ? (
                <>
                  <span className={styles.detailLabel}>Date Range:</span>
                  <span>
                    {formatDate(contribution.oldest)} –{" "}
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
                  <span>
                    {formatDate(contribution.contribution_receipt_date)}
                  </span>
                  <span className={styles.detailLabel}>Amount:</span>
                  <span className={styles.boldValue}>
                    {formatCurrency(contribution.contribution_receipt_amount)}
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

              {contribution.receipt_type && (
                <>
                  <span className={styles.detailLabel}>Line Number:</span>
                  <span className={styles.monoValue}>
                    {contribution.receipt_type}
                  </span>
                </>
              )}

              {contribution.transaction_id && (
                <>
                  <span className={styles.detailLabel}>Transaction ID:</span>
                  <span className={styles.monoValue}>
                    {contribution.transaction_id}
                  </span>
                </>
              )}

              {contribution.receipt_type_full && (
                <>
                  <span className={styles.detailLabel}>Receipt Type:</span>
                  <span>
                    {contribution.receipt_type_full}
                    {contribution.receipt_type &&
                      ` (${contribution.receipt_type})`}
                  </span>
                </>
              )}

              {contribution.memo_text && (
                <>
                  <span className={styles.detailLabel}>Memo:</span>
                  <span>{contribution.memo_text}</span>
                </>
              )}

              {contribution.pdf_url && (
                <>
                  <span className={styles.detailLabel}>FEC Filing:</span>
                  <span>
                    <a
                      href={contribution.pdf_url}
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
              {contribution.isIndividual && (
                <span className={styles.individualBadge}>Individual</span>
              )}
            </div>

            {/* Review note */}
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
                  updateContributionReview(contribution, "verified", editDescription)
                }
                disabled={saveState === "pending"}
                className={styles.buttonVerifyLarge}
              >
                Mark as Verified
              </button>
              <button
                onClick={() =>
                  updateContributionReview(contribution, "omit", editDescription)
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

  if (!companies) {
    return <div className={styles.container}>Loading companies...</div>;
  }

  // Sort: companies with unreviewed contributions first, then alphabetical
  const companyKeys = Object.keys(companies).sort((a, b) => {
    const aUnreviewed = reviewCounts[a]?.unreviewed || 0;
    const bUnreviewed = reviewCounts[b]?.unreviewed || 0;
    if (aUnreviewed > 0 && bUnreviewed === 0) {
      return -1;
    }
    if (aUnreviewed === 0 && bUnreviewed > 0) {
      return 1;
    }
    return companies[a].name.localeCompare(companies[b].name);
  });

  const flattened = getFlattenedContributions();

  return (
    <div className={styles.container}>
      <h1>Review Company Contributions</h1>
      <p>Review and mark company contributions as verified or omitted</p>

      <section className={styles.editorCard}>
        <select
          className={styles.editorSelect}
          value={selectedCompanyId}
          onChange={(e) => setSelectedCompanyId(e.target.value)}
        >
          <option value="">Select a company</option>
          {companyKeys.map((key) => {
            const counts = reviewCounts[key];
            const unreviewed = counts?.unreviewed || 0;
            return (
              <option key={key} value={key}>
                {unreviewed > 0
                  ? `* ${companies[key].name} (${unreviewed} unreviewed)`
                  : companies[key].name}
              </option>
            );
          })}
        </select>

        {loadingState === "loading" && <p>Loading contributions...</p>}
        {loadingState === "error" && <p>Error loading company data.</p>}
        {loadingState === "loaded" && companyData && (
          <div className={styles.loadedSection}>
            <div className={styles.statsRow}>
              <p className={styles.statsText}>
                Total contributions: {flattened.length}
              </p>
              {flattened.some((c) => !c.manualReview) && (
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
              {flattened.some((c) => !c.manualReview) && (
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
              {flattened.map((contribution) =>
                renderContributionRow(contribution),
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
