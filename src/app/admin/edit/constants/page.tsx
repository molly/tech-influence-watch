"use client";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

import { db } from "@/app/lib/db";
import { RecipientDetails } from "@/app/types/Contributions";

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
        const [committeesSnap, affiliationsSnap, ...recipientShards] =
          await Promise.all([
            getDoc(doc(db, "constants", "allCommittees")),
            getDoc(doc(db, "constants", "committeeAffiliations")),
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

        const allIds = new Set([
          ...Object.keys(descriptions),
          ...Object.keys(affiliations),
        ]);

        const recipients: Record<string, RecipientDetails> = {};
        for (const shard of recipientShards) {
          if (shard.exists()) {
            Object.assign(recipients, shard.data() as Record<string, RecipientDetails>);
          }
        }
        const names: Record<string, string> = {};
        for (const [id, details] of Object.entries(recipients)) {
          names[id] = details.committee_name ?? id;
        }
        const entryList = [...allIds]
          .sort((a, b) => a.localeCompare(b))
          .map((id) =>
            buildEntry(id, descriptions[id] ?? "", affiliations[id] ?? null),
          );
        for (const id of Object.keys(recipients)) {
          if (!allIds.has(id)) {
            entryList.push(buildEntry(id, "", null));
          }
        }
        entryList.sort((a, b) => a.committeeId.localeCompare(b.committeeId));
        setEntries(entryList);

        const initialEntryMap = new Map(entryList.map((e) => [e.committeeId, e]));
        setIncompleteCommittees(
          Object.entries(names).filter(([id]) => {
            const recipient = recipients[id];
            if (recipient?.candidate_ids?.length) {
              return false;
            }
            if (recipient?.sponsor_candidate_ids?.length) {
              return false;
            }
            const entry = initialEntryMap.get(id);
            if (!entry) {
              return true;
            }
            const hasDescription = !!entry.description.trim();
            const hasCandidateIds =
              entry.affiliationType === "candidate_ids" &&
              !!entry.candidateIds.trim();
            const hasSponsorCandidateIds =
              entry.affiliationType === "sponsor_candidate_ids" &&
              !!entry.sponsorCandidateIds.trim();
            return !hasDescription && !hasCandidateIds && !hasSponsorCandidateIds;
          }),
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
            These committees have received contributions but are missing a
            description, candidate IDs, and sponsor candidate IDs:
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
