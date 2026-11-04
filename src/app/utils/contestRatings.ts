import { CookRatings } from "@/app/data/cookRatings";
import competitiveness from "@/app/data/raceCompetitiveness.json";

// Hand-marked contests that Cook's general election ratings can't classify:
// primaries, and generals between two candidates of the same party. Generated
// and marked by the backend's commands/race_competitiveness.py, which exports
// the marks from its (uncommitted) review file to raceCompetitiveness.json.
export interface ReviewedContest {
  key: string;
  race_id: string;
  type: string;
  party: string;
  // true, "likely" (a clear favorite, but a real contest), false (a safe bet),
  // or null if not reviewed yet
  competitive: boolean | "likely" | null;
  // Who the safe bet was, for a contest without results yet
  favorite: string;
  candidates: { name: string; won: boolean | null }[];
}

// Index the reviewed contests by race, round, and candidate, since that's how
// spending is keyed
export const REVIEWED_CONTESTS = new Map<string, ReviewedContest>();
for (const contest of competitiveness.contests as ReviewedContest[]) {
  for (const candidate of contest.candidates) {
    REVIEWED_CONTESTS.set(
      `${contest.race_id}|${contest.type}|${candidate.name}`,
      contest,
    );
  }
}

// How close a contest was expected to be, regardless of which side the money
// took: Toss-up and Lean are competitive, Likely has a clear favorite, and
// Solid is safe
type ContestRating = "competitive" | "likely" | "safe";

// Where a dollar went: into a genuinely competitive contest, behind a clear
// but not certain favorite (a Likely seat), behind the candidate who was the
// safe bet, behind the underdog, or into a contest that hasn't been reviewed
export type Category =
  | "competitive"
  | "likely"
  | "safe"
  | "underdog"
  | "unclassified";

function getCookContestRating(
  ratings: CookRatings,
  raceId: string,
): ContestRating | null {
  const rating = ratings[raceId];
  if (!rating) {
    return null;
  }
  if (rating === "tossup" || rating.startsWith("lean")) {
    return "competitive";
  }
  return rating.startsWith("likely") ? "likely" : "safe";
}

// Cook's rating settles general elections between the parties: Toss-up and
// Lean are competitive, and money helping the favored party backs a likely
// winner in a Likely seat and the safe bet in a Solid one.
function classifyGeneral(
  ratings: CookRatings,
  raceId: string,
  candidateParty: string | undefined,
  kind: "support" | "oppose",
): Category {
  const rating = getCookContestRating(ratings, raceId);
  if (!rating) {
    return "unclassified";
  }
  if (rating === "competitive") {
    return "competitive";
  }
  const favoredParty = ratings[raceId].endsWith("-d") ? "D" : "R";
  const helpsFavorite =
    kind === "support"
      ? candidateParty === favoredParty
      : candidateParty !== favoredParty;
  if (!helpsFavorite) {
    return "underdog";
  }
  return rating;
}

// For a reviewed contest marked "likely" or not competitive, the winner (or
// the hand-marked favorite, before there are results) is the favorite
function classifyReviewed(
  contest: ReviewedContest,
  candidate: string,
  kind: "support" | "oppose",
): Category {
  if (contest.competitive === null) {
    return "unclassified";
  }
  if (contest.competitive === true) {
    return "competitive";
  }
  const favorites = contest.favorite
    ? [contest.favorite]
    : contest.candidates.filter((c) => c.won === true).map((c) => c.name);
  if (!favorites.length) {
    return "unclassified";
  }
  const isFavorite = favorites.includes(candidate);
  if ((kind === "support") !== isFavorite) {
    return "underdog";
  }
  return contest.competitive === "likely" ? "likely" : "safe";
}

// Classify one support or oppose amount toward a candidate in one round of a
// race: from the hand review when the contest has been reviewed, otherwise from
// Cook's rating for a general
export function classifySpending(
  ratings: CookRatings,
  raceId: string,
  type: string,
  candidate: string,
  candidateParty: string | undefined,
  kind: "support" | "oppose",
): Category {
  const reviewed = REVIEWED_CONTESTS.get(`${raceId}|${type}|${candidate}`);
  if (reviewed) {
    return classifyReviewed(reviewed, candidate, kind);
  }
  if (type === "general") {
    return classifyGeneral(ratings, raceId, candidateParty, kind);
  }
  // Primary spending the review file doesn't have yet
  return "unclassified";
}
