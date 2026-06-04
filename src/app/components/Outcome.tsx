import { CandidateSummary, Race } from "@/app/types/Elections";
import { ExpenditureCandidateSummary } from "@/app/types/Expenditures";
import {
  getMostRecentRace,
  getMostRecentRaceResult,
  getSubraceName,
  getUpcomingRaceForCandidate,
} from "@/app/utils/races";
import { sentenceCase } from "@/app/utils/titlecase";
import { formatDateFromString, isUpcomingDate } from "@/app/utils/utils";

export default function Outcome({
  candidate,
  races,
  inSentence = false,
}: {
  candidate: ExpenditureCandidateSummary | CandidateSummary;
  races: Race[];
  inSentence?: boolean;
}) {
  if (candidate.declined) {
    return `${inSentence ? " d" : "D"}eclined to run${candidate.declinedReason ? ` (${candidate.declinedReason})` : ""}`;
  }
  if (candidate.withdrew) {
    return `${inSentence ? " w" : "W"}ithdrew from the election`;
  } else {
    const nextRace = getUpcomingRaceForCandidate(races, candidate);
    if (nextRace) {
      if (!nextRace.date) {
        // No date scheduled yet for this upcoming race — just say the candidate
        // is running in it, rather than a dangling "... on ." with an empty date.
        return `${inSentence ? " is r" : "R"}unning in the ${getSubraceName(nextRace)}`;
      }
      if (isUpcomingDate(nextRace.date, { inclusive: true })) {
        if (inSentence) {
          return (
            <>
              {` has a ${getSubraceName(nextRace)} on `}
              <span className="no-wrap">
                {formatDateFromString(nextRace.date)}
              </span>
            </>
          );
        }
        return (
          <>
            {`${sentenceCase(getSubraceName(nextRace), false)} on `}
            <span className="no-wrap">
              {formatDateFromString(nextRace.date)}
            </span>
          </>
        );
      } else {
        // Edge case where election date may have passed, but results have not yet become available.
        return (
          <>
            {`${inSentence ? " is a" : "A"}waiting results from the ${getSubraceName(nextRace)} on `}
            <span className="no-wrap">
              {formatDateFromString(nextRace.date)}
            </span>
          </>
        );
      }
    } else {
      const mostRecentResult = getMostRecentRaceResult(races, candidate);
      const mostRecentRace = getMostRecentRace(races, candidate);
      if (mostRecentResult === true && mostRecentRace) {
        // Name the race they actually won — it isn't necessarily the general
        // (e.g. a primary winner with no general race in the data yet).
        return `${inSentence ? " w" : "W"}on the ${getSubraceName(mostRecentRace)}`;
      }
      if (mostRecentResult === false && mostRecentRace) {
        // Their most recent race recorded a loss. The summary's `defeated` flag
        // isn't reliably maintained (the pipeline doesn't sync it from manual
        // race edits), so derive the result from the race itself here.
        return (
          <>
            {`${inSentence ? " was d" : "D"}efeated in the `}
            {getSubraceName(mostRecentRace)}
          </>
        );
      }
      // The candidate's most recent race has happened but has no recorded
      // result for them yet (e.g. an uncalled co-winner in a multi-winner
      // primary), so we can't say they won or lost.
      if (mostRecentRace) {
        if (!mostRecentRace.date) {
          // No date on record for this race — say the candidate is running in
          // it rather than showing a dangling "... on ." with an empty date.
          return `${inSentence ? " is r" : "R"}unning in the ${getSubraceName(mostRecentRace)}`;
        }
        return (
          <>
            {`${inSentence ? " is a" : "A"}waiting results from the ${getSubraceName(mostRecentRace)} on `}
            <span className="no-wrap">
              {formatDateFromString(mostRecentRace.date)}
            </span>
          </>
        );
      }
      return `${inSentence ? " is a" : "A"}waiting results`;
    }
  }
  return null;
}
