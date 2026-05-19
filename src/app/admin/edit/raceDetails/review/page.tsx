"use client";

import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import { STATES_BY_ABBR } from "@/app/data/states";
import { db } from "@/app/lib/db";
import { ElectionsByState, Race } from "@/app/types/Elections";

import styles from "../../../admin.module.css";

interface RaceConflict {
  state: string;
  raceId: string;
  manualRaces: Race[];
  scrapedRaces: Race[];
  currentRaces: Race[];
}

interface ConflictGroup {
  state: string;
  raceId: string;
}

function shardIndex(raceId: string): number {
  const parts = raceId.split("-");
  if (parts[0] === "H" && parts.length > 1) {
    const district = parseInt(parts[1], 10);
    if (!isNaN(district)) {
      return district % 10;
    }
  }
  return 0;
}

function shardDocName(state: string, raceId: string): string {
  return `${state}_${shardIndex(raceId)}`;
}

export default function RaceReviewPage() {
  const [conflicts, setConflicts] = useState<RaceConflict[]>([]);
  const [selectedConflict, setSelectedConflict] = useState<RaceConflict | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [draftRace, setDraftRace] = useState<Race | null>(null);
  const [draftCandidatesEnabled, setDraftCandidatesEnabled] = useState<
    boolean[]
  >([]);

  useEffect(() => {
    loadConflicts();
  }, []);

  const generateRaceKey = (race: Race): string => {
    const raceType = race.type || "";
    const party = race.party || "none";
    const date = race.date || "";
    return `${raceType}-${party}-${date}`;
  };

  const loadConflicts = async () => {
    setLoading(true);
    try {
      const raceDetailsCollection = collection(db, "raceDetails");
      const snapshot = await getDocs(raceDetailsCollection);

      const foundConflicts: RaceConflict[] = [];

      snapshot.forEach((stateDoc) => {
        const docId = stateDoc.id;
        const lastUnderscore = docId.lastIndexOf("_");
        const state =
          lastUnderscore !== -1 && /^\d$/.test(docId.slice(lastUnderscore + 1))
            ? docId.slice(0, lastUnderscore)
            : docId;
        const stateData = stateDoc.data() as ElectionsByState;

        Object.entries(stateData).forEach(([raceId, raceGroup]) => {
          const manualRaces = raceGroup.manualRaces || [];
          const scrapedRaces = raceGroup.scrapedRaces || [];
          const currentRaces = raceGroup.races || [];
          const lastReviewed = raceGroup.lastReviewed || 0;
          const manualRacesUpdated = raceGroup.manualRacesUpdated || 0;
          const scrapedRacesUpdated = raceGroup.scrapedRacesUpdated || 0;

          // Check if there are new changes since last review.
          // If lastReviewed is 0 the race has never been reviewed, so show it
          // regardless of whether the update timestamp is set (covers scraped
          // races that were written before the timestamp field was introduced).
          const neverReviewed = lastReviewed === 0;
          const hasUnreviewedManual =
            manualRaces.length > 0 &&
            (neverReviewed || manualRacesUpdated > lastReviewed);
          const hasUnreviewedScraped =
            scrapedRaces.length > 0 &&
            (neverReviewed || scrapedRacesUpdated > lastReviewed);

          if (hasUnreviewedManual || hasUnreviewedScraped) {
            foundConflicts.push({
              state,
              raceId,
              manualRaces,
              scrapedRaces,
              currentRaces,
            });
          }
        });
      });

      foundConflicts.sort((a, b) => {
        if (a.state !== b.state) {
          return a.state.localeCompare(b.state);
        }
        return a.raceId.localeCompare(b.raceId);
      });
      setConflicts(foundConflicts);
    } catch (error) {
      console.error("Error loading conflicts:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyScrapedToManual = (race: Race) => {
    setDraftRace({ ...race, candidates: [...race.candidates] });
    setDraftCandidatesEnabled(race.candidates.map(() => true));
  };

  const toggleDraftCandidate = (idx: number) => {
    setDraftCandidatesEnabled((prev) =>
      prev.map((enabled, i) => (i === idx ? !enabled : enabled)),
    );
  };

  const saveDraftToManual = async () => {
    if (!draftRace || !selectedConflict) {
      return;
    }

    const filteredCandidates = draftRace.candidates.filter(
      (_, i) => draftCandidatesEnabled[i],
    );
    const raceToSave = { ...draftRace, candidates: filteredCandidates };

    setSaveState("pending");
    try {
      const docRef = doc(db, "raceDetails", shardDocName(selectedConflict.state, selectedConflict.raceId));
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};
      const raceGroup = existingData[selectedConflict.raceId] || {};
      const existingManualRaces = raceGroup.manualRaces || [];

      await updateDoc(docRef, {
        [`${selectedConflict.raceId}.manualRaces`]: [
          ...existingManualRaces,
          raceToSave,
        ],
        [`${selectedConflict.raceId}.manualRacesUpdated`]: Date.now(),
      });

      setSaveState("success");
      setDraftRace(null);
      setDraftCandidatesEnabled([]);
      setTimeout(() => setSaveState("idle"), 2000);
      await loadConflicts();
    } catch (error) {
      console.error("Error saving draft to manual:", error);
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 3000);
    }
  };

  const applyMerge = async (
    conflict: RaceConflict,
    action: "use_manual" | "use_scraped" | "use_both" | "keep_current",
  ) => {
    setSaveState("pending");
    try {
      let newRaces: Race[] = [];

      switch (action) {
        case "use_manual":
          newRaces = conflict.manualRaces;
          break;
        case "use_scraped":
          newRaces = conflict.scrapedRaces;
          break;
        case "use_both":
          // Combine both, removing duplicates based on race key
          const raceMap = new Map<string, Race>();
          conflict.scrapedRaces.forEach((race) => {
            raceMap.set(generateRaceKey(race), race);
          });
          conflict.manualRaces.forEach((race) => {
            raceMap.set(generateRaceKey(race), race);
          });
          newRaces = Array.from(raceMap.values());
          break;
        case "keep_current":
          newRaces = conflict.currentRaces;
          break;
      }

      const docRef = doc(db, "raceDetails", shardDocName(conflict.state, conflict.raceId));
      await updateDoc(docRef, {
        [`${conflict.raceId}.races`]: newRaces,
        [`${conflict.raceId}.lastReviewed`]: Date.now(),
      });

      setSaveState("success");
      setTimeout(() => setSaveState("idle"), 2000);

      // Reload conflicts to update the list
      await loadConflicts();
      setSelectedConflict(null);
    } catch (error) {
      console.error("Error applying merge:", error);
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 3000);
    }
  };

  const formatRace = (race: Race): string => {
    const type = race.type || "Unknown";
    const party = race.party ? ` (${race.party})` : "";
    const date = race.date ? ` - ${race.date}` : "";
    return `${type}${party}${date}`;
  };

  const formatCandidate = (candidate: any): string => {
    const name = candidate.name;
    const party = candidate.party ? ` (${candidate.party})` : "";
    const incumbent = candidate.incumbent ? " [Incumbent]" : "";
    const won =
      candidate.won === true ? " ✓ Won" : candidate.won === false ? " ✗" : "";
    return `${name}${party}${incumbent}${won}`;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h1>Race Review & Merge</h1>
        <p>Loading conflicts...</p>
      </div>
    );
  }

  if (selectedConflict) {
    const conflict = selectedConflict;
    const manualKeys = new Set(conflict.manualRaces.map(generateRaceKey));
    const scrapedKeys = new Set(conflict.scrapedRaces.map(generateRaceKey));
    const bothKeys = new Set(
      [...conflict.manualRaces, ...conflict.scrapedRaces].map(generateRaceKey),
    );

    return (
      <div className={styles.container}>
        <div className={styles.marginBottom20}>
          <button onClick={() => setSelectedConflict(null)}>
            ← Back to List
          </button>
          <h1>
            {STATES_BY_ABBR[conflict.state]} - {conflict.raceId}
          </h1>
        </div>

        <div className={styles.conflictGrid}>
          {/* Manual Races Column */}
          <div className={styles.conflictColumn}>
            <h2>Manual Races ({conflict.manualRaces.length})</h2>
            <p className={styles.hintText}>
              From admin entry UI
            </p>
            {conflict.manualRaces.length === 0 ? (
              <p>No manual races</p>
            ) : (
              conflict.manualRaces.map((race, idx) => (
                <div
                  key={idx}
                  className={scrapedKeys.has(generateRaceKey(race)) ? `${styles.raceItem} ${styles.raceItemConflict}` : `${styles.raceItem} ${styles.raceItemManual}`}
                >
                  <strong>{formatRace(race)}</strong>
                  {scrapedKeys.has(generateRaceKey(race)) && (
                    <span className={styles.conflictMark}>
                      ⚠ Conflict
                    </span>
                  )}
                  <ul className={styles.raceUl}>
                    {race.candidates.map((candidate, cidx) => (
                      <li key={cidx} className={styles.raceLi}>
                        {formatCandidate(candidate)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
            {conflict.manualRaces.length > 0 && (
              <button
                onClick={() => applyMerge(conflict, "use_manual")}
                disabled={saveState === "pending"}
                className={styles.fullWidthButton}
              >
                Use Manual Races
              </button>
            )}
          </div>

          {/* Scraped Races Column */}
          <div className={styles.conflictColumn}>
            <h2>Scraped Races ({conflict.scrapedRaces.length})</h2>
            <p className={styles.hintText}>
              From Python scraper
            </p>
            {conflict.scrapedRaces.length === 0 ? (
              <p>No scraped races</p>
            ) : (
              conflict.scrapedRaces.map((race, idx) => (
                <div
                  key={idx}
                  className={manualKeys.has(generateRaceKey(race)) ? `${styles.raceItem} ${styles.raceItemConflict}` : `${styles.raceItem} ${styles.raceItemNew}`}
                >
                  <strong>{formatRace(race)}</strong>
                  {manualKeys.has(generateRaceKey(race)) && (
                    <span className={styles.conflictMark}>
                      ⚠ Conflict
                    </span>
                  )}
                  {!manualKeys.has(generateRaceKey(race)) && (
                    <span className={styles.newMark}>
                      ✓ New
                    </span>
                  )}
                  <ul className={styles.raceUl}>
                    {race.candidates.map((candidate, cidx) => (
                      <li key={cidx} className={styles.raceLi}>
                        {formatCandidate(candidate)}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => copyScrapedToManual(race)}
                    className={styles.copyButton}
                  >
                    Copy to Manual
                  </button>
                </div>
              ))
            )}
            {conflict.scrapedRaces.length > 0 && (
              <button
                onClick={() => applyMerge(conflict, "use_scraped")}
                disabled={saveState === "pending"}
                className={styles.fullWidthButton}
              >
                Use Scraped Races
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtonsRow}>
          <button
            onClick={() => applyMerge(conflict, "use_both")}
            disabled={saveState === "pending"}
            className={styles.actionButtonLarge}
          >
            Use Both (Merge All Unique Races)
          </button>
          <button
            onClick={() => applyMerge(conflict, "keep_current")}
            disabled={saveState === "pending"}
            className={styles.actionButtonGray}
          >
            Keep Current (Mark Reviewed)
          </button>
        </div>

        {saveState === "success" && (
          <p className={styles.saveFeedbackSuccess}>
            ✓ Successfully saved!
          </p>
        )}
        {saveState === "error" && (
          <p className={styles.saveFeedbackError}>
            ✗ Error saving changes
          </p>
        )}

        {/* Draft Manual Race Editor */}
        {draftRace && (
          <div className={styles.draftEditor}>
            <h2 className={styles.draftEditorTitle}>
              Draft Manual Race: {formatRace(draftRace)}
            </h2>
            <p className={styles.hintText}>
              Uncheck candidates to exclude them before saving.
            </p>
            <ul className={styles.draftList}>
              {draftRace.candidates.map((candidate, idx) => (
                <li
                  key={idx}
                  className={`${styles.draftCandidateRow}${!draftCandidatesEnabled[idx] ? ` ${styles.draftCandidateDisabled}` : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={draftCandidatesEnabled[idx] ?? true}
                    onChange={() => toggleDraftCandidate(idx)}
                  />
                  <span
                    className={`${styles.draftCandidateText}${!draftCandidatesEnabled[idx] ? ` ${styles.draftCandidateStrikethrough}` : ""}`}
                  >
                    {formatCandidate(candidate)}
                  </span>
                </li>
              ))}
            </ul>
            <div className={styles.draftActionsRow}>
              <button
                onClick={saveDraftToManual}
                disabled={
                  saveState === "pending" ||
                  draftCandidatesEnabled.every((e) => !e)
                }
                className={styles.draftSaveButton}
              >
                {saveState === "pending"
                  ? "Saving..."
                  : "Save to Manual Races"}
              </button>
              <button
                onClick={() => {
                  setDraftRace(null);
                  setDraftCandidatesEnabled([]);
                }}
                className={styles.draftCancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Race Review & Merge</h1>
      <p>Review and merge manual and scraped race data</p>

      {conflicts.length === 0 ? (
        <div className={styles.marginTop20}>
          <p>✓ No conflicts or unreviewed changes found!</p>
          <button onClick={loadConflicts} className={styles.marginTop10}>
            Refresh
          </button>
        </div>
      ) : (
        <>
          <p className={`${styles.marginBottom20} ${styles.detailLabel}`}>
            Found {conflicts.length} race{conflicts.length !== 1 ? "s" : ""}{" "}
            with differences to review
          </p>
          <div className={styles.conflictList}>
            {conflicts.map((conflict, idx) => (
              <div
                key={idx}
                className={styles.conflictListItem}
                onClick={() => setSelectedConflict(conflict)}
              >
                <h3 className={styles.conflictTitle}>
                  {STATES_BY_ABBR[conflict.state]} - {conflict.raceId}
                </h3>
                <p className={styles.conflictSubtitle}>
                  Manual: {conflict.manualRaces.length} race
                  {conflict.manualRaces.length !== 1 ? "s" : ""} | Scraped:{" "}
                  {conflict.scrapedRaces.length} race
                  {conflict.scrapedRaces.length !== 1 ? "s" : ""} | Current:{" "}
                  {conflict.currentRaces.length} race
                  {conflict.currentRaces.length !== 1 ? "s" : ""}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
