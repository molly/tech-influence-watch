"use client";

import {
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  runTransaction,
  setDoc,
} from "firebase/firestore";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  COOK_RATING_LABELS,
  COOK_RATING_SCALE,
  CookRating,
  CookRatings,
} from "@/app/data/cookRatings";
import { STATES_BY_ABBR } from "@/app/data/states";
import { db } from "@/app/lib/db";
import { ElectionGroup, ElectionsByState, Race } from "@/app/types/Elections";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";
import {
  applyCandidateResult,
  CandidateResult,
  getCandidateResult,
  getRaceCallStatus,
  getRaceHeadline,
  getShardDocName,
  getSubraceName,
  sortRaces,
  withCalledAt,
} from "@/app/utils/races";

import styles from "../../admin.module.css";

// One subrace held on the selected date, e.g. the PA-H-07 general.
interface ResultRow {
  key: string;
  state: string;
  raceId: string; // Short ID within the state doc, e.g. "H-07"
  race: Race;
  spendingTotal: number;
}

interface RaceDetailsSnapshot {
  rows: Omit<ResultRow, "key">[];
  dates: string[];
  ratings: CookRatings;
}

const cookRatingsRef = doc(db, "constants", "cookRatings");

const RESULT_OPTIONS: { value: CandidateResult; label: string }[] = [
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
  { value: "undecided", label: "Undecided" },
];

const rowKey = (state: string, raceId: string, race: Race) =>
  `${state}-${raceId}-${race.type}-${race.party || "none"}-${race.date}`;

const isSameSubrace = (a: Race, b: Race) =>
  a.type === b.type && a.party === b.party && a.date === b.date;

async function fetchRaceDetails(): Promise<RaceDetailsSnapshot> {
  const [snapshot, ratingsSnap] = await Promise.all([
    getDocs(collection(db, "raceDetails")),
    getDoc(cookRatingsRef),
  ]);
  const rows: Omit<ResultRow, "key">[] = [];
  const dates = new Set<string>();

  snapshot.forEach((stateDoc) => {
    const docId = stateDoc.id;
    const lastUnderscore = docId.lastIndexOf("_");
    const state =
      lastUnderscore !== -1 && /^\d$/.test(docId.slice(lastUnderscore + 1))
        ? docId.slice(0, lastUnderscore)
        : docId;
    const stateData = stateDoc.data() as ElectionsByState;

    Object.entries(stateData).forEach(([raceId, group]) => {
      const spendingTotal = Object.values(group.spending || {}).reduce(
        (sum, committee) => sum + (committee.total || 0),
        0,
      );
      (group.races || []).forEach((race) => {
        if (!race.date || race.canceled) {
          return;
        }
        dates.add(race.date);
        rows.push({ state, raceId, race, spendingTotal });
      });
    });
  });

  return {
    rows,
    dates: Array.from(dates).sort().reverse(),
    ratings: (ratingsSnap.data() as CookRatings | undefined) || {},
  };
}

// The most recent election date that has already arrived, so tonight's races
// load by default without having to pick a date.
const getDefaultDate = (dates: string[]) => {
  const today = new Date().toISOString().slice(0, 10);
  return dates.find((d) => d <= today) || dates[dates.length - 1] || "";
};

export default function ResultsEditor() {
  const [rows, setRows] = useState<ResultRow[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [search, setSearch] = useState("");
  const [hideCalled, setHideCalled] = useState(false);
  const [onlyWithSpending, setOnlyWithSpending] = useState(true);
  // Races edited this session stay visible when "hide called" is on, so a
  // misclick can be fixed without the race vanishing out from under you.
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ratings, setRatings] = useState<CookRatings>({});
  // Races whose rating was set this session keep the picker, so a misclick
  // can be fixed. Races Cook already rated show the rating as text.
  const [ratingEdited, setRatingEdited] = useState<Set<string>>(new Set());

  const applySnapshot = (snapshot: RaceDetailsSnapshot, keepDate: boolean) => {
    setRows(
      snapshot.rows.map((row) => ({
        ...row,
        key: rowKey(row.state, row.raceId, row.race),
      })),
    );
    setDates(snapshot.dates);
    setRatings(snapshot.ratings);
    if (!keepDate) {
      setSelectedDate(getDefaultDate(snapshot.dates));
    }
  };

  useEffect(() => {
    fetchRaceDetails()
      .then((snapshot) => applySnapshot(snapshot, false))
      .catch((err) => {
        console.error("Error loading races:", err);
        setLoadError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const reload = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      applySnapshot(await fetchRaceDetails(), true);
    } catch (err) {
      console.error("Error loading races:", err);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  const rowsForDate = useMemo(
    () =>
      rows
        .filter((row) => row.race.date === selectedDate)
        .sort(
          (a, b) =>
            b.spendingTotal - a.spendingTotal ||
            a.state.localeCompare(b.state) ||
            a.raceId.localeCompare(b.raceId),
        ),
    [rows, selectedDate],
  );

  const visibleRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    const matchesState = (state: string) =>
      query.length >= 2 &&
      (state.toLowerCase() === query ||
        (STATES_BY_ABBR[state] || "").toLowerCase().startsWith(query));
    const filtered = rowsForDate.filter((row) => {
      if (onlyWithSpending && row.spendingTotal === 0) {
        return false;
      }
      if (
        hideCalled &&
        !touched.has(row.key) &&
        getRaceCallStatus(row.race) === "called"
      ) {
        return false;
      }
      if (!query) {
        return true;
      }
      const fullRaceId = `${row.state}-${row.raceId}`;
      return (
        fullRaceId.toLowerCase().includes(query) ||
        getRaceHeadline(fullRaceId).toLowerCase().includes(query) ||
        row.race.candidates.some((c) => c.name.toLowerCase().includes(query))
      );
    });

    // Searching by state lists that state's races in district order, the way
    // the state page does, ahead of any other matches (e.g. a candidate whose
    // name contains the query). Everything else keeps the spending order.
    return filtered.sort((a, b) => {
      const aMatches = matchesState(a.state);
      const bMatches = matchesState(b.state);
      if (aMatches !== bMatches) {
        return aMatches ? -1 : 1;
      }
      if (!aMatches) {
        return 0;
      }
      return (
        a.state.localeCompare(b.state) ||
        sortRaces(`${a.state}-${a.raceId}`, `${b.state}-${b.raceId}`)
      );
    });
  }, [rowsForDate, search, hideCalled, onlyWithSpending, touched]);

  const progressRows = onlyWithSpending
    ? rowsForDate.filter((row) => row.spendingTotal > 0)
    : rowsForDate;
  const calledCount = progressRows.filter(
    (row) => getRaceCallStatus(row.race) === "called",
  ).length;

  const saveResult = async (
    row: ResultRow,
    candidateName: string,
    result: CandidateResult,
  ) => {
    if (saving.has(row.key)) {
      return;
    }
    setSaving((prev) => new Set(prev).add(row.key));
    setTouched((prev) => new Set(prev).add(row.key));
    setErrors((prev) => {
      const { [row.key]: _removed, ...rest } = prev;
      return rest;
    });

    const docRef = doc(db, "raceDetails", getShardDocName(row.state, row.raceId));
    try {
      // Read-modify-write in a transaction so a result marked from another tab
      // (or a concurrent edit in the race editor) isn't silently overwritten.
      const updatedRace = await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(docRef);
        const group = snap.data()?.[row.raceId] as ElectionGroup | undefined;
        if (!group) {
          throw new Error("Race no longer exists");
        }
        const raceIndex = group.races.findIndex((r) => isSameSubrace(r, row.race));
        if (raceIndex === -1) {
          throw new Error("Subrace no longer exists");
        }
        const race = group.races[raceIndex];
        const candidateIndex = race.candidates.findIndex(
          (c) => c.name === candidateName,
        );
        if (candidateIndex === -1) {
          throw new Error(`${candidateName} is no longer in this race`);
        }

        const candidates = applyCandidateResult(race.candidates, candidateIndex, result);
        const newRace = withCalledAt(race, { ...race, candidates }, Date.now());
        const updates: Record<string, unknown> = {
          [`${row.raceId}.races`]: group.races.map((r, i) =>
            i === raceIndex ? newRace : r,
          ),
        };

        // `races` is what the site reads, but the race review page can rebuild
        // `races` from `manualRaces`. Copy the results onto the matching manual
        // entry (matched by type and party, as the backend merge does) so a
        // later "use manual" review doesn't wipe them, along with the call time
        // the results page sorts by. manualRacesUpdated is
        // left alone: `races` already has these results, so nothing new needs
        // review.
        const manualRaces = group.manualRaces || [];
        const manualIndex = manualRaces.findIndex(
          (r) => r.type === race.type && r.party === race.party,
        );
        if (manualIndex !== -1) {
          const resultsByName = new Map(candidates.map((c) => [c.name, c]));
          updates[`${row.raceId}.manualRaces`] = manualRaces.map((r, i) => {
            if (i !== manualIndex) {
              return r;
            }
            const { calledAt: _calledAt, ...manualRace } = r;
            return {
              ...manualRace,
              ...(newRace.calledAt !== undefined && { calledAt: newRace.calledAt }),
              candidates: r.candidates.map((c) => {
                const updated = resultsByName.get(c.name);
                if (!updated) {
                  return c;
                }
                const { won: _won, ...rest } = c;
                return updated.won === undefined ? rest : { ...rest, won: updated.won };
              }),
            };
          });
        }

        transaction.update(docRef, updates);
        return newRace;
      });

      setRows((prev) =>
        prev.map((r) => (r.key === row.key ? { ...r, race: updatedRace } : r)),
      );
    } catch (err) {
      console.error("Error saving result:", err);
      setErrors((prev) => ({
        ...prev,
        [row.key]: err instanceof Error ? err.message : "Error saving result",
      }));
    } finally {
      setSaving((prev) => {
        const next = new Set(prev);
        next.delete(row.key);
        return next;
      });
    }
  };

  // An empty value clears the rating
  const saveRating = async (row: ResultRow, value: CookRating | "") => {
    const fullRaceId = `${row.state}-${row.raceId}`;
    setRatingEdited((prev) => new Set(prev).add(fullRaceId));
    setErrors((prev) => {
      const { [row.key]: _removed, ...rest } = prev;
      return rest;
    });
    try {
      await setDoc(
        cookRatingsRef,
        { [fullRaceId]: value || deleteField() },
        { merge: true },
      );
      setRatings((prev) => {
        const { [fullRaceId]: _removed, ...rest } = prev;
        return value ? { ...rest, [fullRaceId]: value } : rest;
      });
    } catch (err) {
      console.error("Error saving rating:", err);
      setErrors((prev) => ({ ...prev, [row.key]: "Error saving rating" }));
    }
  };

  return (
    <>
      <h1>Election Results</h1>
      <section className={styles.editorCard}>
        <div className={styles.resultsToolbar}>
          <label className={styles.resultsToolbarField}>
            Election date
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              {dates.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.resultsToolbarField}>
            Search
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="State, district, or candidate"
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={hideCalled}
              onChange={(e) => setHideCalled(e.target.checked)}
            />{" "}
            Hide called races
          </label>
          <label>
            <input
              type="checkbox"
              checked={onlyWithSpending}
              onChange={(e) => setOnlyWithSpending(e.target.checked)}
            />{" "}
            Only races with tracked spending
          </label>
          <button onClick={reload} disabled={loading}>
            {loading ? "Loading..." : "Reload"}
          </button>
        </div>
        {!loading && !loadError && (
          <p className={styles.helpText}>
            {calledCount} of {progressRows.length} races called. Marking a
            candidate as won sets everyone still undecided to lost. For a race
            with more than one winner, set any uncalled co-winners back to
            undecided.
          </p>
        )}
        {loadError && (
          <p className={styles.colorRed}>Couldn&rsquo;t load races.</p>
        )}
      </section>

      {!loading && visibleRows.length === 0 && !loadError && (
        <p>No races match.</p>
      )}

      {visibleRows.map((row) => {
        const fullRaceId = `${row.state}-${row.raceId}`;
        const status = getRaceCallStatus(row.race);
        const isSaving = saving.has(row.key);
        const rating = ratings[fullRaceId];
        return (
          <section key={row.key} className={styles.resultsRaceCard}>
            <div className={styles.resultsRaceHeader}>
              <h2 className={styles.resultsRaceTitle}>
                {getRaceHeadline(fullRaceId)}{" "}
                <span className={styles.resultsRaceMeta}>
                  {getSubraceName(row.race)}
                  {row.spendingTotal > 0 &&
                    ` · ${humanizeRoundedCurrency(row.spendingTotal, true, 1)} tracked spending`}
                </span>
              </h2>
              <span className={styles.resultsRaceStatus}>
                {isSaving
                  ? "Saving..."
                  : status === "called"
                    ? "Called"
                    : status === "partial"
                      ? "Partly called"
                      : "Uncalled"}
              </span>
              <Link
                href={`/2026/elections/${fullRaceId}`}
                target="_blank"
                className={styles.adminLink}
              >
                View race
              </Link>
            </div>
            {errors[row.key] && (
              <p className={styles.colorRed}>{errors[row.key]}</p>
            )}
            {row.race.type === "general" && (
              <div className={styles.resultsRatingRow}>
                {rating && !ratingEdited.has(fullRaceId) ? (
                  <>Cook rating: {COOK_RATING_LABELS[rating].full}</>
                ) : (
                  <label>
                    Cook rating{" "}
                    <select
                      value={rating || ""}
                      onChange={(e) =>
                        saveRating(row, e.target.value as CookRating | "")
                      }
                    >
                      <option value="">Not rated</option>
                      {COOK_RATING_SCALE.map((step) => (
                        <option key={step} value={step}>
                          {COOK_RATING_LABELS[step].full}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
            )}
            <ul className={styles.resultsCandidateList}>
              {row.race.candidates.map((candidate) => {
                const current = getCandidateResult(candidate);
                const leftNote = candidate.died
                  ? "died"
                  : candidate.withdrew
                    ? "withdrew"
                    : candidate.declined
                      ? "declined"
                      : null;
                return (
                  <li key={candidate.name} className={styles.resultsCandidateRow}>
                    <span className={styles.flex1}>
                      {candidate.name}
                      {candidate.party && ` (${candidate.party})`}
                      {candidate.incumbent && (
                        <span className={styles.resultsCandidateNote}>incumbent</span>
                      )}
                      {leftNote && (
                        <span className={styles.resultsCandidateNote}>{leftNote}</span>
                      )}
                    </span>
                    {!candidate.placeholder && (
                      <span
                        className={styles.resultsButtonGroup}
                        role="group"
                        aria-label={`Result for ${candidate.name}`}
                      >
                        {RESULT_OPTIONS.map((option) => {
                          const active = current === option.value;
                          const activeClass = !active
                            ? ""
                            : option.value === "won"
                              ? styles.resultsButtonWon
                              : option.value === "lost"
                                ? styles.resultsButtonLost
                                : styles.resultsButtonUndecided;
                          return (
                            <button
                              key={option.value}
                              className={`${styles.resultsButton} ${activeClass}`}
                              aria-pressed={active}
                              disabled={isSaving}
                              onClick={() => {
                                if (!active) {
                                  saveResult(row, candidate.name, option.value);
                                }
                              }}
                            >
                              {option.label}
                            </button>
                          );
                        })}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </>
  );
}
