"use client";

import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

import { db } from "@/app/lib/db";
import {
  AllCommitteesSummary,
  CommitteeDetails,
} from "@/app/types/Committee";
import {
  RecentContribution,
  RecipientDetails,
} from "@/app/types/Contributions";
import { isSuperOrHybridPac } from "@/app/utils/committees";

import styles from "../../admin.module.css";

type AffiliationType = "party" | "candidate_ids" | "sponsor_candidate_ids";
type PartyValue = "DEM" | "REP" | "LIB" | "UNK";

type Affiliation =
  | { party: PartyValue }
  | { candidate_ids: string[] }
  | { sponsor_candidate_ids: string[] };

type CommitteeEntry = {
  committeeId: string;
  description: string;
  hasAffiliation: boolean;
  affiliationType: AffiliationType;
  party: PartyValue;
  candidateIds: string;
  sponsorCandidateIds: string;
};

type SaveState = "idle" | "pending" | "success" | "error";

function buildEntry(
  committeeId: string,
  description: string,
  affiliation: Affiliation | null,
): CommitteeEntry {
  const base: CommitteeEntry = {
    committeeId,
    description,
    hasAffiliation: affiliation !== null,
    affiliationType: "party",
    party: "UNK",
    candidateIds: "",
    sponsorCandidateIds: "",
  };
  if (!affiliation) return base;
  if ("party" in affiliation) {
    return { ...base, affiliationType: "party", party: affiliation.party };
  } else if ("candidate_ids" in affiliation) {
    return {
      ...base,
      affiliationType: "candidate_ids",
      candidateIds: affiliation.candidate_ids.join(", "),
    };
  } else {
    return {
      ...base,
      affiliationType: "sponsor_candidate_ids",
      sponsorCandidateIds: affiliation.sponsor_candidate_ids.join(", "),
    };
  }
}

function entryToAffiliation(entry: CommitteeEntry): Affiliation | null {
  if (!entry.hasAffiliation) return null;
  switch (entry.affiliationType) {
    case "party":
      return { party: entry.party };
    case "candidate_ids":
      return {
        candidate_ids: entry.candidateIds
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
    case "sponsor_candidate_ids":
      return {
        sponsor_candidate_ids: entry.sponsorCandidateIds
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
  }
}

// A committee is considered complete (and so not flagged for attention) if it
// has FEC-linked candidate or sponsor candidate IDs, or it has any of a
// description, a party, candidate IDs, or sponsor candidate IDs set in the
// constants.
function isCommitteeComplete(
  committeeId: string,
  fecLinkedIds: Set<string>,
  entryMap: Map<string, CommitteeEntry>,
): boolean {
  if (fecLinkedIds.has(committeeId)) {
    return true;
  }
  const entry = entryMap.get(committeeId);
  if (!entry) {
    return false;
  }
  if (entry.description.trim()) {
    return true;
  }
  if (!entry.hasAffiliation) {
    return false;
  }
  switch (entry.affiliationType) {
    case "party":
      return true;
    case "candidate_ids":
      return !!entry.candidateIds.trim();
    case "sponsor_candidate_ids":
      return !!entry.sponsorCandidateIds.trim();
  }
}

export default function ConstantsEditor() {
  const [loadingState, setLoadingState] = useState("loading");
  const [entries, setEntries] = useState<CommitteeEntry[]>([]);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [incompleteCommittees, setIncompleteCommittees] = useState<
    Array<[string, string]>
  >([]);

  useEffect(() => {
    (async () => {
      try {
        const shardIds = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        const [
          committeesSnap,
          affiliationsSnap,
          allPacsSnap,
          superPacsSnap,
          recentSnap,
          committeeDocs,
          ...recipientShards
        ] = await Promise.all([
          getDoc(doc(db, "constants", "allCommittees")),
          getDoc(doc(db, "constants", "committeeAffiliations")),
          getDoc(doc(db, "allCommittees", "allPacs")),
          getDoc(doc(db, "allCommittees", "superPacs")),
          getDoc(doc(db, "contributions", "recent")),
          getDocs(collection(db, "committees")),
          ...shardIds.map((d) =>
            getDoc(doc(db, "allRecipients", `recipients_${d}`)),
          ),
        ]);

        const descriptions: Record<string, string> = committeesSnap.exists()
          ? (committeesSnap.data() as Record<string, string>)
          : {};
        const affiliations: Record<string, Affiliation> =
          affiliationsSnap.exists()
            ? (affiliationsSnap.data() as Record<string, Affiliation>)
            : {};

        // Collect every committee that is named anywhere on the site, along
        // with a display name, plus the set of committees that have
        // FEC-linked candidate or sponsor candidate IDs (which exempts them
        // from needing metadata).
        const names: Record<string, string> = {};
        const fecLinkedIds = new Set<string>();

        const addName = (
          id: string | null | undefined,
          name?: string | null,
        ) => {
          if (!id) {
            return;
          }
          const cleaned = (name ?? "").trim();
          if (!names[id] || names[id] === id) {
            names[id] = cleaned || id;
          }
        };
        const addFecIds = (
          id: string | null | undefined,
          candidateIds?: string[] | null,
          sponsorCandidateIds?: string[] | null,
        ) => {
          if (!id) {
            return;
          }
          if (candidateIds?.length || sponsorCandidateIds?.length) {
            fecLinkedIds.add(id);
          }
        };

        // Recipients in company/individual/committee drilldown pages
        const recipients: Record<string, RecipientDetails> = {};
        for (const shard of recipientShards) {
          if (shard.exists()) {
            Object.assign(
              recipients,
              shard.data() as Record<string, RecipientDetails>,
            );
          }
        }
        for (const [id, details] of Object.entries(recipients)) {
          addName(id, details.committee_name);
          addFecIds(id, details.candidate_ids, details.sponsor_candidate_ids);
        }

        // Rankings lists (all PACs and super PACs by receipts)
        for (const snap of [allPacsSnap, superPacsSnap]) {
          if (!snap.exists()) {
            continue;
          }
          const summaries = (snap.data().by_receipts ??
            []) as AllCommitteesSummary[];
          for (const summary of summaries) {
            addName(summary.committee_id, summary.committee_name);
          }
        }

        // Recent contributions list (across all sectors)
        if (recentSnap.exists()) {
          const recentData = recentSnap.data() as Record<
            string,
            { all?: RecentContribution[] }
          >;
          for (const sectorData of Object.values(recentData)) {
            for (const contribution of sectorData?.all ?? []) {
              addName(contribution.committee_id, contribution.committee_name);
              addFecIds(
                contribution.committee_id,
                contribution.candidate_ids,
                contribution.sponsor_candidate_ids,
              );
            }
          }
        }

        // Transfer recipients in committee pages for non-super/hybrid PACs
        for (const committeeDoc of committeeDocs.docs) {
          const committee = committeeDoc.data() as CommitteeDetails;
          addFecIds(
            committeeDoc.id,
            committee.candidate_ids,
            committee.sponsor_candidate_ids,
          );
          if (isSuperOrHybridPac(committee.committee_type)) {
            continue;
          }
          const transfers = committee.disbursements_by_committee ?? {};
          for (const [recipientId, group] of Object.entries(transfers)) {
            addName(recipientId, group.recipient_name);
          }
        }

        // Build editable entries for every committee with existing metadata
        // plus every committee named anywhere, so each can be filled in.
        const entryIds = new Set([
          ...Object.keys(descriptions),
          ...Object.keys(affiliations),
          ...Object.keys(names),
        ]);
        const entryList = [...entryIds]
          .sort((a, b) => a.localeCompare(b))
          .map((id) =>
            buildEntry(id, descriptions[id] ?? "", affiliations[id] ?? null),
          );
        setEntries(entryList);

        const initialEntryMap = new Map(
          entryList.map((e) => [e.committeeId, e]),
        );
        setIncompleteCommittees(
          Object.entries(names)
            .filter(
              ([id]) =>
                !isCommitteeComplete(id, fecLinkedIds, initialEntryMap),
            )
            .sort((a, b) => a[1].localeCompare(b[1])),
        );

        setLoadingState("loaded");
      } catch {
        setLoadingState("error");
      }
    })();
  }, []);

  const entryIndexMap = useMemo(
    () => new Map(entries.map((e, i) => [e.committeeId, i])),
    [entries],
  );

  const updateEntry = (
    index: number,
    field: keyof CommitteeEntry,
    value: string | boolean,
  ) => {
    setEntries((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addEntry = () => {
    setEntries((prev) => [
      ...prev,
      {
        committeeId: "",
        description: "",
        hasAffiliation: false,
        affiliationType: "party" as AffiliationType,
        party: "UNK" as PartyValue,
        candidateIds: "",
        sponsorCandidateIds: "",
      },
    ]);
  };

  const removeEntry = (index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const save = async () => {
    setSaveState("pending");
    try {
      const committeeData: Record<string, string> = {};
      const affiliationData: Record<string, Affiliation> = {};
      for (const entry of entries) {
        if (!entry.committeeId) continue;
        if (entry.description) {
          committeeData[entry.committeeId] = entry.description;
        }
        const aff = entryToAffiliation(entry);
        if (aff) {
          affiliationData[entry.committeeId] = aff;
        }
      }
      await Promise.all([
        setDoc(doc(db, "constants", "allCommittees"), committeeData),
        setDoc(doc(db, "constants", "committeeAffiliations"), affiliationData),
      ]);
      setSaveState("success");
    } catch {
      setSaveState("error");
    }
  };

  if (loadingState === "loading") {
    return <div>Loading...</div>;
  } else if (loadingState === "error") {
    return <div>Something went wrong when fetching data.</div>;
  }

  return (
    <>
      <h1>Committee Constants</h1>
      {incompleteCommittees.length > 0 && (
        <section className={styles.editorCard}>
          <h2>
            Needs attention ({incompleteCommittees.length})
          </h2>
          <p className={styles.marginBottom05}>
            These committees are named somewhere on the site but have no
            FEC-linked candidate IDs and no description, party, candidate IDs,
            or sponsor candidate IDs set in the constants:
          </p>
          <table className={styles.constantsTable}>
            <thead>
              <tr>
                <th>Committee ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Affiliation</th>
              </tr>
            </thead>
            <tbody>
              {incompleteCommittees.map(([id, name]) => {
                const i = entryIndexMap.get(id);
                if (i === undefined) {
                  return null;
                }
                const entry = entries[i];
                return (
                  <tr key={id} className={styles.verticalAlignTop}>
                    <td>
                      <code>{id}</code>
                    </td>
                    <td>{name}</td>
                    <td>
                      <input
                        type="text"
                        className={`${styles.editorInput} ${styles.minWidth250}`}
                        value={entry.description}
                        onChange={(e) =>
                          updateEntry(i, "description", e.target.value)
                        }
                        placeholder="Description (optional)"
                      />
                    </td>
                    <td>
                      <div className={styles.affiliationCell}>
                        <label className={styles.smallLabel}>
                          <input
                            type="checkbox"
                            checked={entry.hasAffiliation}
                            onChange={(e) =>
                              updateEntry(i, "hasAffiliation", e.target.checked)
                            }
                          />{" "}
                          Has affiliation
                        </label>
                        {entry.hasAffiliation && (
                          <div className={styles.affiliationTypeRow}>
                            <select
                              className={styles.editorSelect}
                              value={entry.affiliationType}
                              onChange={(e) =>
                                updateEntry(
                                  i,
                                  "affiliationType",
                                  e.target.value,
                                )
                              }
                            >
                              <option value="party">Party</option>
                              <option value="candidate_ids">
                                Candidate IDs
                              </option>
                              <option value="sponsor_candidate_ids">
                                Sponsor Candidate IDs
                              </option>
                            </select>
                            {entry.affiliationType === "party" && (
                              <select
                                className={styles.editorSelect}
                                value={entry.party}
                                onChange={(e) =>
                                  updateEntry(i, "party", e.target.value)
                                }
                              >
                                <option value="DEM">DEM</option>
                                <option value="REP">REP</option>
                                <option value="LIB">LIB</option>
                                <option value="UNK">UNK</option>
                              </select>
                            )}
                            {entry.affiliationType === "candidate_ids" && (
                              <input
                                type="text"
                                className={`${styles.editorInput} ${styles.minWidth250}`}
                                value={entry.candidateIds}
                                onChange={(e) =>
                                  updateEntry(
                                    i,
                                    "candidateIds",
                                    e.target.value,
                                  )
                                }
                                placeholder="Comma-separated candidate IDs"
                              />
                            )}
                            {entry.affiliationType ===
                              "sponsor_candidate_ids" && (
                              <input
                                type="text"
                                className={`${styles.editorInput} ${styles.minWidth250}`}
                                value={entry.sponsorCandidateIds}
                                onChange={(e) =>
                                  updateEntry(
                                    i,
                                    "sponsorCandidateIds",
                                    e.target.value,
                                  )
                                }
                                placeholder="Comma-separated sponsor candidate IDs"
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}
      <section className={styles.editorCard}>
        <table className={styles.constantsTable}>
          <thead>
            <tr>
              <th>Committee ID</th>
              <th>Description</th>
              <th>Affiliation</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => (
              <tr key={i} className={styles.verticalAlignTop}>
                <td>
                  <input
                    type="text"
                    className={styles.editorInput}
                    value={entry.committeeId}
                    onChange={(e) =>
                      updateEntry(i, "committeeId", e.target.value)
                    }
                    placeholder="Committee ID"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className={`${styles.editorInput} ${styles.minWidth250}`}
                    value={entry.description}
                    onChange={(e) =>
                      updateEntry(i, "description", e.target.value)
                    }
                    placeholder="Description (optional)"
                  />
                </td>
                <td>
                  <div className={styles.affiliationCell}>
                    <label className={styles.smallLabel}>
                      <input
                        type="checkbox"
                        checked={entry.hasAffiliation}
                        onChange={(e) =>
                          updateEntry(i, "hasAffiliation", e.target.checked)
                        }
                      />{" "}
                      Has affiliation
                    </label>
                    {entry.hasAffiliation && (
                      <div className={styles.affiliationTypeRow}>
                        <select
                          className={styles.editorSelect}
                          value={entry.affiliationType}
                          onChange={(e) =>
                            updateEntry(i, "affiliationType", e.target.value)
                          }
                        >
                          <option value="party">Party</option>
                          <option value="candidate_ids">Candidate IDs</option>
                          <option value="sponsor_candidate_ids">
                            Sponsor Candidate IDs
                          </option>
                        </select>
                        {entry.affiliationType === "party" && (
                          <select
                            className={styles.editorSelect}
                            value={entry.party}
                            onChange={(e) =>
                              updateEntry(i, "party", e.target.value)
                            }
                          >
                            <option value="DEM">DEM</option>
                            <option value="REP">REP</option>
                            <option value="LIB">LIB</option>
                            <option value="UNK">UNK</option>
                          </select>
                        )}
                        {entry.affiliationType === "candidate_ids" && (
                          <input
                            type="text"
                            className={`${styles.editorInput} ${styles.minWidth250}`}
                            value={entry.candidateIds}
                            onChange={(e) =>
                              updateEntry(i, "candidateIds", e.target.value)
                            }
                            placeholder="Comma-separated candidate IDs"
                          />
                        )}
                        {entry.affiliationType === "sponsor_candidate_ids" && (
                          <input
                            type="text"
                            className={`${styles.editorInput} ${styles.minWidth250}`}
                            value={entry.sponsorCandidateIds}
                            onChange={(e) =>
                              updateEntry(
                                i,
                                "sponsorCandidateIds",
                                e.target.value,
                              )
                            }
                            placeholder="Comma-separated sponsor candidate IDs"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <button onClick={() => removeEntry(i)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.saveRow}>
          <button onClick={addEntry}>Add entry</button>
          <button onClick={save} disabled={saveState === "pending"}>
            {saveState === "pending" ? "Saving..." : "Save"}
          </button>
          {saveState === "success" && <span>Saved!</span>}
          {saveState === "error" && <span>Error saving.</span>}
        </div>
      </section>
    </>
  );
}
