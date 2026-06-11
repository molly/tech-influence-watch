import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import { db } from "@/app/lib/db";

/**
 * Backend pipeline tasks that read the race roster from raceDetails and must
 * re-run after an admin roster edit.
 *
 * `summarize_races` cascades to its dependents (prune_race_details,
 * compute_race_insights, and onward). `update_outside_spending` does NOT sit on
 * that cascade — it depends on update_race_details, not summarize_races — so a
 * roster edit that adds candidates would otherwise leave their Schedule E
 * (independent expenditure) totals unfetched. Both must be invalidated directly.
 */
const STALE_TASKS = ["summarize_races", "update_outside_spending"];

/**
 * Mark the backend's raceDetails-consuming pipeline tasks stale so they re-run on
 * the next pipeline invocation.
 *
 * Why this is needed: these tasks read the race roster from raceDetails, but the
 * pipeline's change-detection checks each input collection for docs with an
 * `updated_at` field newer than the task's last completion. raceDetails docs
 * have no `updated_at`, so an admin roster edit is invisible to that check and
 * the tasks get skipped — leaving candidate spending totals and e-filed
 * expenditure subraces stale (which hides outside spending on race pages).
 * Flipping each task's status off "completed" forces the orchestrator to re-run
 * it regardless.
 *
 * Best-effort: a failure here (e.g. Firestore rules disallowing the write) must
 * not block the admin's save. If it fails, the fix is a manual
 * `pipeline.py --tasks summarize_races,update_outside_spending --force`.
 */
export async function markRaceSummariesStale(): Promise<void> {
  await Promise.all(
    STALE_TASKS.map(async (task) => {
      try {
        await setDoc(
          doc(db, "_pipeline_state", task),
          {
            status: "stale",
            staleReason: "raceDetails edited via admin UI",
            staleAt: serverTimestamp(),
          },
          { merge: true },
        );
      } catch (err) {
        console.warn(`Could not mark ${task} stale:`, err);
      }
    }),
  );
}
