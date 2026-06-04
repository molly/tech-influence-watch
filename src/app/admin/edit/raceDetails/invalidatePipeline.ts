import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import { db } from "@/app/lib/db";

/**
 * Mark the backend's `summarize_races` pipeline task stale so it re-runs on the
 * next pipeline invocation (and cascades to its dependents, prune_race_details
 * and compute_race_insights).
 *
 * Why this is needed: summarize_races reads the race roster from raceDetails,
 * but the pipeline's change-detection checks each input collection for docs with
 * an `updated_at` field newer than the task's last completion. raceDetails docs
 * have no `updated_at`, so an admin roster edit is invisible to that check and
 * summarize_races gets skipped — leaving candidate spending totals and e-filed
 * expenditure subraces stale (which hides outside spending on race pages).
 * Flipping the task's status off "completed" forces the orchestrator to re-run
 * it regardless.
 *
 * Best-effort: a failure here (e.g. Firestore rules disallowing the write) must
 * not block the admin's save. If it fails, the fix is a manual
 * `pipeline.py --tasks summarize_races --force`.
 */
export async function markRaceSummariesStale(): Promise<void> {
  try {
    await setDoc(
      doc(db, "_pipeline_state", "summarize_races"),
      {
        status: "stale",
        staleReason: "raceDetails edited via admin UI",
        staleAt: serverTimestamp(),
      },
      { merge: true },
    );
  } catch (err) {
    console.warn("Could not mark summarize_races stale:", err);
  }
}
