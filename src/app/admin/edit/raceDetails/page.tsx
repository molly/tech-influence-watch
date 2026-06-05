"use client";

import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { useState } from "react";

import { STATES_BY_ABBR } from "@/app/data/states";
import { db } from "@/app/lib/db";
import { Party, RaceType } from "@/app/types/Elections";

import styles from "../../admin.module.css";
import { markRaceSummariesStale } from "./invalidatePipeline";

interface CandidateFormData {
  name: string;
  party?: Party;
  incumbent?: boolean;
  declared?: boolean;
  declined?: boolean;
  declineReason?: string;
  withdrew?: boolean;
  withdrewRaceType?: string;
  withdrewRaceParty?: Party;
  won?: boolean;
}

interface RaceFormData {
  type: string;
  party?: Party;
  date?: string;
  candidates: CandidateFormData[];
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

export default function RaceDetailsEditor() {
  const [selectedState, setSelectedState] = useState<string>("");
  const [raceId, setRaceId] = useState<string>("");
  const [isCustomRaceId, setIsCustomRaceId] = useState<boolean>(false);
  const [existingRaceIds, setExistingRaceIds] = useState<string[]>([]);
  const [existingManualRaces, setExistingManualRaces] = useState<RaceFormData[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // null = adding new, number = editing existing
  const [saveState, setSaveState] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [raceForm, setRaceForm] = useState<RaceFormData>({
    type: "",
    party: undefined,
    date: "",
    candidates: [],
  });

  const stateAbbrs = Object.keys(STATES_BY_ABBR).sort();

  const addCandidate = () => {
    setRaceForm({
      ...raceForm,
      candidates: [
        ...raceForm.candidates,
        {
          name: "",
          party: raceForm.party,
          incumbent: false,
          declared: true,
          declined: false,
          declineReason: "",
          withdrew: false,
          withdrewRaceType: "",
          withdrewRaceParty: undefined,
        },
      ],
    });
  };

  const updateCandidate = (index: number, field: keyof CandidateFormData, value: any) => {
    const updatedCandidates = [...raceForm.candidates];
    updatedCandidates[index] = {
      ...updatedCandidates[index],
      [field]: value,
    };
    setRaceForm({
      ...raceForm,
      candidates: updatedCandidates,
    });
  };

  const removeCandidate = (index: number) => {
    const updatedCandidates = raceForm.candidates.filter((_, i) => i !== index);
    setRaceForm({
      ...raceForm,
      candidates: updatedCandidates,
    });
  };

  // Set a candidate's result: won (won: true), lost (won: false), or undecided
  // (won field removed). A race can have multiple winners (top-two primaries,
  // races that advance to a runoff), and those winners may be called at
  // different times. So marking a candidate as won does not force every other
  // candidate to lost — it only defaults the candidates who are still undecided
  // to lost. Candidates already set to won or lost are left untouched, which
  // lets you mark one called winner while leaving an as-yet-uncalled co-winner
  // undecided (set them back to undecided after marking the first winner).
  const setCandidateResult = (
    index: number,
    result: "won" | "lost" | "undecided",
  ) => {
    const wonValue =
      result === "won" ? true : result === "lost" ? false : undefined;
    let updated = raceForm.candidates.map((c, i) => {
      if (i !== index) {
        return c;
      }
      if (wonValue === undefined) {
        const { won: _won, ...rest } = c;
        return rest as CandidateFormData;
      }
      return { ...c, won: wonValue };
    });
    if (wonValue === true) {
      updated = updated.map((c, i) => {
        if (i === index || c.won !== undefined) {
          return c;
        }
        return { ...c, won: false };
      });
    }
    setRaceForm({ ...raceForm, candidates: updated });
  };

  const fetchExistingRaces = async (state: string) => {
    try {
      const allRaceIds: string[] = [];
      for (let i = 0; i < 10; i++) {
        const docRef = doc(db, "raceDetails", `${state}_${i}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          allRaceIds.push(...Object.keys(docSnap.data()));
        }
      }
      setExistingRaceIds(allRaceIds.sort());
    } catch (err) {
      console.error("Error fetching existing races:", err);
      setExistingRaceIds([]);
    }
  };

  const fetchManualRacesForRaceId = async (state: string, raceIdToFetch: string) => {
    try {
      const docRef = doc(db, "raceDetails", shardDocName(state, raceIdToFetch));
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const existingData = docSnap.data();
        const raceGroup = existingData[raceIdToFetch];
        if (raceGroup?.manualRaces && raceGroup.manualRaces.length > 0) {
          setExistingManualRaces(raceGroup.manualRaces);
          // Auto-select the first manual race for editing if there's only one
          if (raceGroup.manualRaces.length === 1) {
            setEditingIndex(0);
            populateFormFromRace(raceGroup.manualRaces[0]);
          }
        } else {
          setExistingManualRaces([]);
          setEditingIndex(null);
        }
      } else {
        setExistingManualRaces([]);
        setEditingIndex(null);
      }
    } catch (err) {
      console.error("Error fetching manual races:", err);
      setExistingManualRaces([]);
      setEditingIndex(null);
    }
  };

  const populateFormFromRace = (race: RaceFormData) => {
    setRaceForm({
      type: race.type || "",
      party: race.party,
      date: race.date || "",
      candidates: race.candidates.map((c: any) => ({
        name: c.name,
        party: c.party,
        incumbent: c.incumbent,
        declared: c.declared !== false,
        declined: c.declined,
        declineReason: c.declineReason,
        withdrew: c.withdrew,
        withdrewRaceType: c.withdrew_race?.type || "",
        withdrewRaceParty: c.withdrew_race?.party,
        won: c.won,
      })),
    });
  };

  const resetForm = () => {
    setRaceForm({
      type: "",
      party: undefined,
      date: "",
      candidates: [],
    });
    setEditingIndex(null);
  };

  const selectManualRaceToEdit = (index: number | null) => {
    setEditingIndex(index);
    if (index !== null && existingManualRaces[index]) {
      populateFormFromRace(existingManualRaces[index]);
    } else {
      resetForm();
    }
  };

  const saveRace = async () => {
    if (!selectedState || !raceId || !raceForm.type || raceForm.candidates.length === 0 || saveState === "pending") {
      return;
    }

    setSaveState("pending");

    try {
      // Fetch existing raceDetails for the state (correct shard)
      const docRef = doc(db, "raceDetails", shardDocName(selectedState, raceId));
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};

      // Build race object with conditional fields
      const race: any = {
        type: raceForm.type,
        candidates: raceForm.candidates.map((candidate) => {
          const candidateData: any = {
            name: candidate.name,
          };

          // Only include party if it's set
          if (candidate.party) {
            candidateData.party = candidate.party;
          }

          // Only include incumbent if true
          if (candidate.incumbent) {
            candidateData.incumbent = true;
          }

          // Only include declared if false
          if (candidate.declared === false) {
            candidateData.declared = false;
          }

          // Only include declined if true
          if (candidate.declined) {
            candidateData.declined = true;
          }

          // Only include declineReason if declined is true and reason is provided
          if (candidate.declined && candidate.declineReason) {
            candidateData.declineReason = candidate.declineReason;
          }

          // Only include won if explicitly set
          if (candidate.won !== undefined) {
            candidateData.won = candidate.won;
          }

          // Only include withdrew if true
          if (candidate.withdrew) {
            candidateData.withdrew = true;
            // Build withdrew_race object
            const withdrewRace: any = {};
            if (candidate.withdrewRaceType) {
              withdrewRace.type = candidate.withdrewRaceType;
            }
            if (candidate.withdrewRaceParty) {
              withdrewRace.party = candidate.withdrewRaceParty;
            }
            if (Object.keys(withdrewRace).length > 0) {
              candidateData.withdrew_race = withdrewRace;
            }
          }

          return candidateData;
        }),
      };

      // Add optional race-level fields
      if (raceForm.party) {
        race.party = raceForm.party;
      }
      if (raceForm.date) {
        race.date = raceForm.date;
      }

      // Get or create the race group for the specified race ID
      const raceGroup = existingData[raceId] || { races: [], manualRaces: [], candidates: {}, spending: {} };

      // Save to manualRaces instead of races (races is for scraper)
      if (!raceGroup.manualRaces) {
        raceGroup.manualRaces = [];
      }

      if (editingIndex !== null) {
        // Update existing manual race
        raceGroup.manualRaces[editingIndex] = race;
      } else {
        // Add new manual race
        raceGroup.manualRaces.push(race);
      }
      raceGroup.manualRacesUpdated = Date.now(); // eslint-disable-line react-hooks/purity

      // Note: we deliberately do not touch raceGroup.candidates here. The
      // candidate "won" flags saved above are the source of truth; the backend
      // (race_summary.py) derives each candidate's defeated/defeated_race from
      // them once the race is reviewed/merged into `races`, and it rewrites the
      // whole candidates map on every run. Writing defeated state here would be
      // redundant and would get overwritten.
      await setDoc(docRef, { [raceId]: raceGroup }, { merge: true });

      // The roster changed, so the backend's race summaries (spending totals,
      // expenditure subraces) are now stale. Force summarize_races to re-run.
      await markRaceSummariesStale();

      setSaveState("success");

      // Remember the index we were editing (or the new index if adding)
      const savedIndex = editingIndex !== null ? editingIndex : raceGroup.manualRaces.length - 1;

      // Refresh the existing race IDs
      await fetchExistingRaces(selectedState);

      // Refresh the manual races list and stay on the saved entry
      const docSnapAfter = await getDoc(docRef);
      if (docSnapAfter.exists()) {
        const updatedData = docSnapAfter.data();
        const updatedRaceGroup = updatedData[raceId];
        if (updatedRaceGroup?.manualRaces) {
          setExistingManualRaces(updatedRaceGroup.manualRaces);
          setEditingIndex(savedIndex);
          populateFormFromRace(updatedRaceGroup.manualRaces[savedIndex]);
        }
      }

      setTimeout(() => setSaveState("idle"), 2000);
    } catch (err) {
      console.error("Error saving race:", err);
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 3000);
    }
  };

  return (
    <>
      <h1>Race Details Editor</h1>
      <section className={styles.editorCard}>
        {/* State Selection */}
        <div className={styles.editorInputGroup}>
          <label htmlFor="state-select">Select State</label>
          <select
            id="state-select"
            className={styles.editorSelect}
            onChange={(e) => {
              const state = e.target.value;
              setSelectedState(state);
              setRaceId("");
              setIsCustomRaceId(false);
              resetForm();
              setExistingManualRaces([]);
              if (state) {
                fetchExistingRaces(state);
              } else {
                setExistingRaceIds([]);
              }
            }}
            value={selectedState}
          >
            <option value="">Select a state</option>
            {stateAbbrs.map((abbr) => (
              <option key={abbr} value={abbr}>
                {STATES_BY_ABBR[abbr]} ({abbr})
              </option>
            ))}
          </select>
        </div>

        {selectedState && (
          <>
            <h2>{editingIndex !== null ? "Edit" : "Add New"} Race for {STATES_BY_ABBR[selectedState]}</h2>

            {/* Race ID Selection/Input */}
            <div className={styles.editorInputGroup}>
              <label htmlFor="race-id">Race ID *</label>
              <div className={styles.raceIdRow}>
                <select
                  id="race-id"
                  className={`${styles.editorSelect} ${styles.minWidth200}`}
                  value={isCustomRaceId ? "__custom" : raceId}
                  onChange={(e) => {
                    const newRaceId = e.target.value;
                    resetForm();
                    setExistingManualRaces([]);
                    if (newRaceId === "__custom") {
                      setIsCustomRaceId(true);
                      setRaceId("");
                    } else {
                      setIsCustomRaceId(false);
                      setRaceId(newRaceId);
                      if (newRaceId) {
                        fetchManualRacesForRaceId(selectedState, newRaceId);
                      }
                    }
                  }}
                >
                  <option value="">Select or enter race ID</option>
                  <option value="__custom">Enter custom race ID...</option>
                  {existingRaceIds.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
                {isCustomRaceId && (
                  <input
                    type="text"
                    className={`${styles.editorInput} ${styles.minWidth150}`}
                    placeholder="e.g., H-01, S, P"
                    value={raceId}
                    onChange={(e) => setRaceId(e.target.value)}
                    autoFocus
                  />
                )}
              </div>
              <small className={styles.helpText}>
                Examples: H-01 (House District 1), S (Senate), P (President), G (Governor)
              </small>
            </div>

            {/* Existing Manual Races Selector */}
            {existingManualRaces.length > 0 && (
              <div className={`${styles.editorInputGroup} ${styles.existingRacesPanel}`}>
                <label>Existing Manual Entries</label>
                <p className={styles.existingRacesNote}>
                  This race has {existingManualRaces.length} existing manual {existingManualRaces.length === 1 ? "entry" : "entries"}. Select one to edit or add a new one.
                </p>
                <div className={styles.flexColumnHalfGap}>
                  {existingManualRaces.map((race, idx) => (
                    <button
                      key={idx}
                      onClick={() => selectManualRaceToEdit(idx)}
                      className={`${styles.manualRaceButton}${editingIndex === idx ? ` ${styles.manualRaceButtonActive}` : ""}`}
                    >
                      {race.type}{race.party ? ` (${race.party})` : ""}{race.date ? ` - ${race.date}` : ""} — {race.candidates.length} candidate{race.candidates.length !== 1 ? "s" : ""}
                    </button>
                  ))}
                  <button
                    onClick={() => selectManualRaceToEdit(null)}
                    className={`${styles.manualRaceButton}${editingIndex === null ? ` ${styles.manualRaceButtonActive}` : ""}`}
                  >
                    + Add New Race
                  </button>
                </div>
              </div>
            )}

            {/* Race Type */}
            <div className={styles.editorInputGroup}>
              <label htmlFor="race-type">Race Type *</label>
              <select
                id="race-type"
                className={styles.editorSelect}
                value={raceForm.type}
                onChange={(e) => {
                  const nextType = e.target.value;
                  const nextForm: RaceFormData = { ...raceForm, type: nextType };
                  if (nextType === RaceType.General && editingIndex === null && raceForm.date === "") {
                    nextForm.date = "2026-11-03";
                  }
                  setRaceForm(nextForm);
                }}
              >
                <option value="">Select type</option>
                <option value={RaceType.General}>General</option>
                <option value={RaceType.GeneralRunoff}>General Runoff</option>
                <option value={RaceType.Primary}>Primary</option>
                <option value={RaceType.PrimaryRunoff}>Primary Runoff</option>
                <option value={RaceType.Convention}>Convention</option>
                <option value={RaceType.Special}>Special</option>
              </select>
            </div>

            {/* Race Party */}
            <div className={styles.editorInputGroup}>
              <label htmlFor="race-party">Party (optional)</label>
              <select
                id="race-party"
                className={styles.editorSelect}
                value={raceForm.party || ""}
                onChange={(e) => setRaceForm({ ...raceForm, party: e.target.value as Party || undefined })}
              >
                <option value="">None</option>
                <option value={Party.Republican}>Republican (R)</option>
                <option value={Party.Democratic}>Democratic (D)</option>
                <option value={Party.Libertarian}>Libertarian (L)</option>
                <option value={Party.Green}>Green (G)</option>
                <option value={Party.Independent}>Independent (I)</option>
                <option value={Party.Nonpartisan}>Non-Partisan (N)</option>
              </select>
            </div>

            {/* Race Date */}
            <div className={styles.editorInputGroup}>
              <label htmlFor="race-date">Date (optional)</label>
              <input
                type="text"
                id="race-date"
                className={styles.editorInput}
                value={raceForm.date}
                onChange={(e) => setRaceForm({ ...raceForm, date: e.target.value })}
                placeholder="e.g., 2026-11-03"
              />
            </div>

            <h3>Candidates</h3>
            <small className={styles.helpText}>
              Marking a candidate as won defaults any still-undecided candidates
              to lost. For a multi-winner race where only one winner has been
              called, mark that winner, then set any uncalled co-winners back to
              undecided.
            </small>

            {raceForm.candidates.map((candidate, index) => (
              <div key={index} className={styles.candidateCard}>
                <div className={styles.candidateCardHeader}>
                  <h4 className={styles.marginZero}>Candidate {index + 1}</h4>
                  <button onClick={() => removeCandidate(index)} className={styles.colorRed}>
                    Remove
                  </button>
                </div>

                {/* Candidate Name */}
                <div className={styles.editorInputGroup}>
                  <label htmlFor={`candidate-name-${index}`}>Name *</label>
                  <input
                    type="text"
                    id={`candidate-name-${index}`}
                    className={styles.editorInput}
                    value={candidate.name}
                    onChange={(e) => updateCandidate(index, "name", e.target.value)}
                  />
                </div>

                {/* Candidate Party */}
                <div className={styles.editorInputGroup}>
                  <label htmlFor={`candidate-party-${index}`}>Party</label>
                  <select
                    id={`candidate-party-${index}`}
                    className={styles.editorSelect}
                    value={candidate.party || ""}
                    onChange={(e) => updateCandidate(index, "party", e.target.value as Party || undefined)}
                  >
                    <option value="">None</option>
                    <option value={Party.Republican}>Republican (R)</option>
                    <option value={Party.Democratic}>Democratic (D)</option>
                    <option value={Party.Libertarian}>Libertarian (L)</option>
                    <option value={Party.Green}>Green (G)</option>
                    <option value={Party.Independent}>Independent (I)</option>
                    <option value={Party.Nonpartisan}>Non-Partisan (N)</option>
                  </select>
                </div>

                {/* Incumbent Checkbox */}
                <div className={styles.editorInputGroup}>
                  <label>
                    <input
                      type="checkbox"
                      checked={candidate.incumbent || false}
                      onChange={(e) => updateCandidate(index, "incumbent", e.target.checked)}
                    />
                    {" "}Incumbent
                  </label>
                </div>

                {/* Declared Checkbox */}
                <div className={styles.editorInputGroup}>
                  <label>
                    <input
                      type="checkbox"
                      checked={candidate.declared !== false}
                      onChange={(e) => updateCandidate(index, "declared", e.target.checked)}
                    />
                    {" "}Declared (uncheck if not declared)
                  </label>
                </div>

                {/* Declined Checkbox */}
                <div className={styles.editorInputGroup}>
                  <label>
                    <input
                      type="checkbox"
                      checked={candidate.declined || false}
                      onChange={(e) => updateCandidate(index, "declined", e.target.checked)}
                    />
                    {" "}Declined
                  </label>
                </div>

                {/* Decline Reason (only if declined) */}
                {candidate.declined && (
                  <div className={styles.editorInputGroup}>
                    <label htmlFor={`candidate-decline-reason-${index}`}>Decline Reason</label>
                    <input
                      type="text"
                      id={`candidate-decline-reason-${index}`}
                      className={styles.editorInput}
                      value={candidate.declineReason || ""}
                      onChange={(e) => updateCandidate(index, "declineReason", e.target.value)}
                    />
                  </div>
                )}

                {/* Withdrew Checkbox */}
                <div className={styles.editorInputGroup}>
                  <label>
                    <input
                      type="checkbox"
                      checked={candidate.withdrew || false}
                      onChange={(e) => {
                        const isWithdrew = e.target.checked;
                        const updatedCandidates = [...raceForm.candidates];
                        updatedCandidates[index] = {
                          ...updatedCandidates[index],
                          withdrew: isWithdrew,
                          // Auto-fill from current race when checking
                          withdrewRaceType: isWithdrew ? raceForm.type : "",
                          withdrewRaceParty: isWithdrew ? raceForm.party : undefined,
                        };
                        setRaceForm({ ...raceForm, candidates: updatedCandidates });
                      }}
                    />
                    {" "}Withdrew
                    {candidate.withdrew && (
                      <span className={styles.withdrewNote}>
                        (from {raceForm.type}{raceForm.party ? ` ${raceForm.party}` : ""})
                      </span>
                    )}
                  </label>
                </div>

                {/* Result */}
                <div className={styles.editorInputGroup}>
                  <label htmlFor={`candidate-result-${index}-undecided`}>Result</label>
                  <div className={styles.resultOptions}>
                    {(["undecided", "won", "lost"] as const).map((result) => {
                      const current =
                        candidate.won === true
                          ? "won"
                          : candidate.won === false
                            ? "lost"
                            : "undecided";
                      const labelClass =
                        result === "won"
                          ? styles.colorGreen
                          : result === "lost"
                            ? styles.colorRed
                            : undefined;
                      return (
                        <label
                          key={result}
                          htmlFor={`candidate-result-${index}-${result}`}
                          className={labelClass}
                        >
                          <input
                            type="radio"
                            id={`candidate-result-${index}-${result}`}
                            name={`candidate-result-${index}`}
                            checked={current === result}
                            onChange={() => setCandidateResult(index, result)}
                          />
                          {result === "undecided"
                            ? "Undecided"
                            : result === "won"
                              ? "Won"
                              : "Lost"}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}

            <button onClick={addCandidate} className={styles.marginBottom1}>
              Add Candidate
            </button>

            <div>
              <button
                onClick={saveRace}
                disabled={saveState === "pending" || !raceId || !raceForm.type || raceForm.candidates.length === 0}
                className={styles.primaryButton}
              >
                {saveState === "pending" ? "Saving..." : editingIndex !== null ? "Update Race" : "Save Race"}
              </button>
              {saveState === "success" && (
                <span className={styles.saveSuccessInline}>
                  {editingIndex !== null ? "Updated" : "Saved"} successfully to {selectedState}/{raceId}!
                </span>
              )}
              {saveState === "error" && (
                <span className={styles.saveErrorInline}>Error saving race</span>
              )}
            </div>
          </>
        )}
      </section>
    </>
  );
}
