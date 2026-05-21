import { CandidateSummary, Race } from "@/app/types/Elections";
import { ExpenditureCandidateSummary } from "@/app/types/Expenditures";
import { getSubraceName, getUpcomingRaceForCandidate } from "@/app/utils/races";
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
  if (candidate.defeated) {
    const defeatedRace = races.find(
      (r) =>
        r.type === candidate.defeated_race &&
        r.candidates.some((c) => c.name === candidate.common_name),
    );
    return (
      <>
        {`${inSentence ? " was d" : "D"}efeated in the `}
        {getSubraceName(defeatedRace)}
      </>
    );
  } else if (candidate.withdrew) {
    return `${inSentence ? " w" : "W"}ithdrew from the election`;
  } else {
    const nextRace = getUpcomingRaceForCandidate(races, candidate);
    if (nextRace) {
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
      return `${inSentence ? " w" : "W"}on the general election`;
    }
  }
  return null;
}
