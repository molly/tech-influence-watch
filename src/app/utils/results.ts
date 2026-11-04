import { DateTime } from "luxon";

import { CookRating, CookRatings } from "@/app/data/cookRatings";
import { Beneficiary } from "@/app/types/Beneficiaries";
import { CommitteeConstant } from "@/app/types/Committee";
import {
  CandidateSummary,
  ElectionGroup,
  ElectionsByState,
  Race,
  RaceCandidate,
} from "@/app/types/Elections";
import { Sector } from "@/app/types/Sector";
import { classifySpending } from "@/app/utils/contestRatings";
import {
  getCandidateResult,
  getDeclinedElsewhereCandidateIds,
  getRaceCallStatus,
  getSubraceName,
  needsResult,
  RaceCallStatus,
} from "@/app/utils/races";
import {
  getSectorOpposeTotal,
  getSectorSupportTotal,
  matchesSector,
} from "@/app/utils/sector";

export interface ResultCandidate {
  candidate: RaceCandidate;
  summary?: CandidateSummary;
  // Cycle totals, primaries included, as on the race page
  support: number;
  oppose: number;
  contributions: number;
  // Super PAC money spent in this round of the race. This is what the results
  // are scored on: money spent in a primary was decided by the primary.
  current: { support: number; oppose: number };
  // The part of support and oppose spent in other rounds of the race (usually
  // the primary), and which rounds those were, e.g. ["primary"]
  earlier: { support: number; oppose: number; rounds: string[] };
}

// What a contest's super PAC money did: went into a competitive contest, backed
// the favorite in a Likely or Solid one, backed the underdog, or a mix of the
// last two
export type RaceTag = "competitive" | "likely" | "safe" | "underdog" | "mixed";

// Both sides count as significant once the smaller one has this share of the
// money backing the favorite or the underdog
const MIXED_THRESHOLD = 0.2;

// Classify the contest's money the way the battlegrounds analysis does, one
// support or oppose amount at a time, and tag the contest by where it went.
// Only money spent in this round counts: primary money is classified with the
// primary.
function getRaceTag(
  group: ElectionGroup,
  committees: Record<string, CommitteeConstant>,
  cookRatings: CookRatings,
  sector: Sector,
  raceId: string,
  type: string,
): RaceTag | null {
  const amounts = { competitive: 0, likely: 0, safe: 0, underdog: 0 };
  for (const [committeeId, spending] of Object.entries(group.spending || {})) {
    if (
      sector !== "all" &&
      !matchesSector(committees[committeeId]?.sector, sector)
    ) {
      continue;
    }
    const subrace = spending.subraces?.[type];
    for (const [candidate, money] of Object.entries(subrace?.candidates || {})) {
      for (const kind of ["support", "oppose"] as const) {
        if (!money[kind]) {
          continue;
        }
        const category = classifySpending(
          cookRatings,
          raceId,
          type,
          candidate,
          group.candidates?.[candidate]?.party,
          kind,
        );
        if (category !== "unclassified") {
          amounts[category] += money[kind];
        }
      }
    }
  }
  if (amounts.competitive > 0) {
    return "competitive";
  }
  const favorite = amounts.likely + amounts.safe;
  const total = favorite + amounts.underdog;
  if (total === 0) {
    return null;
  }
  if (Math.min(favorite, amounts.underdog) / total >= MIXED_THRESHOLD) {
    return "mixed";
  }
  if (amounts.underdog > favorite) {
    return "underdog";
  }
  return amounts.likely >= amounts.safe ? "likely" : "safe";
}

// Super PAC money for or against a candidate from the sector's PACs, split
// into the round being decided (`type`) and the race's other rounds
function getSpendingByRound(
  group: ElectionGroup,
  committees: Record<string, CommitteeConstant>,
  sector: Sector,
  candidate: string,
  type: string,
): Pick<ResultCandidate, "current" | "earlier"> {
  const current = { support: 0, oppose: 0 };
  const earlier = { support: 0, oppose: 0, rounds: new Set<string>() };
  for (const [committeeId, spending] of Object.entries(group.spending || {})) {
    if (
      sector !== "all" &&
      !matchesSector(committees[committeeId]?.sector, sector)
    ) {
      continue;
    }
    for (const [round, subrace] of Object.entries(spending.subraces || {})) {
      const amounts = subrace.candidates?.[candidate];
      if (!amounts || !(amounts.support || amounts.oppose)) {
        continue;
      }
      if (round === type) {
        current.support += amounts.support;
        current.oppose += amounts.oppose;
      } else {
        earlier.support += amounts.support;
        earlier.oppose += amounts.oppose;
        earlier.rounds.add(round);
      }
    }
  }
  return {
    current,
    earlier: { ...earlier, rounds: [...earlier.rounds].sort() },
  };
}

// One subrace held on the election date, e.g. the PA-H-07 general
export interface ResultRace {
  key: string;
  raceId: string; // Full race ID, e.g. "PA-H-07"
  state: string;
  shortRaceId: string; // ID within the state, e.g. "H-07"
  race: Race;
  status: RaceCallStatus;
  rating?: CookRating;
  // What the contest's money did, or null if none of it could be classified
  tag: RaceTag | null;
  // The seat's earlier rounds this cycle, like the primary, scored against
  // their own results. Null if the sector's super PACs didn't spend in them.
  earlierRounds: EarlierRounds | null;
  candidates: ResultCandidate[];
  // Super PAC spending and direct contributions across the candidates
  total: number;
}

// The most recent election date that has arrived in US Eastern time, so the
// page keeps showing the night's races after midnight UTC (and after midnight
// Eastern, until the next election date arrives).
export function getLatestElectionDate(
  elections: Record<string, ElectionsByState>,
): string | null {
  const today = DateTime.now().setZone("America/New_York").toISODate();
  let latest: string | null = null;
  for (const stateElections of Object.values(elections)) {
    for (const group of Object.values(stateElections)) {
      for (const race of group.races || []) {
        if (
          race.date &&
          !race.canceled &&
          today &&
          race.date <= today &&
          (!latest || race.date > latest)
        ) {
          latest = race.date;
        }
      }
    }
  }
  return latest;
}

// Called races come first, most recent call first. Races called before call
// times were recorded have no time, so they follow. Then partly called and
// uncalled races, by how much money is in them.
function compareResultRaces(a: ResultRace, b: ResultRace) {
  const rank = (r: ResultRace) => {
    if (r.status === "called") {
      return r.race.calledAt !== undefined ? 0 : 1;
    }
    return r.status === "partial" ? 2 : 3;
  };
  return (
    rank(a) - rank(b) ||
    (b.race.calledAt ?? 0) - (a.race.calledAt ?? 0) ||
    b.total - a.total ||
    a.raceId.localeCompare(b.raceId)
  );
}

// Every subrace on the date where a candidate received super PAC spending or
// direct contributions from the sector, sorted for the results page
export function getResultRaces(
  elections: Record<string, ElectionsByState>,
  beneficiaries: Record<string, Beneficiary>,
  committees: Record<string, CommitteeConstant>,
  candidateAliases: Record<string, string>,
  cookRatings: CookRatings,
  sector: Sector,
  date: string,
): ResultRace[] {
  const results: ResultRace[] = [];
  for (const [state, stateElections] of Object.entries(elections)) {
    for (const [shortRaceId, group] of Object.entries(stateElections)) {
      const races = (group.races || []).filter(
        (race) => race.date === date && !race.canceled,
      );
      if (!races.length) {
        continue;
      }
      // Contributions to a candidate who declined here but is running in
      // another race belong to that other race
      const suppressedIds = getDeclinedElsewhereCandidateIds(
        stateElections,
        shortRaceId,
        candidateAliases,
      );
      for (const race of races) {
        const candidates = race.candidates.map((candidate) => {
          const summary = candidate.placeholder
            ? undefined
            : group.candidates?.[candidate.name];
          const candidateId = summary?.candidate_id;
          const contributions =
            candidateId && !suppressedIds.has(candidateId)
              ? (beneficiaries[candidateId]?.total ?? 0)
              : 0;
          return {
            candidate,
            summary,
            support: summary ? getSectorSupportTotal(summary, sector) : 0,
            oppose: summary ? getSectorOpposeTotal(summary, sector) : 0,
            contributions,
            ...getSpendingByRound(
              group,
              committees,
              sector,
              candidate.name,
              race.type,
            ),
          };
        });
        const total = candidates.reduce(
          (sum, c) => sum + c.support + c.oppose + c.contributions,
          0,
        );
        if (total === 0) {
          continue;
        }
        results.push({
          key: `${state}-${shortRaceId}-${race.type}-${race.party || "none"}`,
          raceId: `${state}-${shortRaceId}`,
          state,
          shortRaceId,
          race,
          status: getRaceCallStatus(race),
          rating: cookRatings[`${state}-${shortRaceId}`],
          tag: getRaceTag(
            group,
            committees,
            cookRatings,
            sector,
            `${state}-${shortRaceId}`,
            race.type,
          ),
          earlierRounds: getEarlierRounds(
            group,
            committees,
            sector,
            race.type,
            date,
          ),
          candidates,
          total,
        });
      }
    }
  }
  return results.sort(compareResultRaces);
}

// What to call the round being decided, e.g. "general election", or just
// "election" when the date mixes rounds
export function getRoundName(races: ResultRace[]): string {
  const types = new Set(races.map((r) => r.race.type));
  if (types.size !== 1) {
    return "election";
  }
  return getSubraceName({ type: [...types][0] });
}

export interface MoneyByOutcome {
  won: number;
  lost: number;
  uncalled: number;
}

// Whether tracked money ended up on the side that won
export type Goal = "achieved" | "failed" | "mixed";

const emptyMoney = (): MoneyByOutcome => ({ won: 0, lost: 0, uncalled: 0 });

// Add super PAC money for or against a candidate to the side it ended up on,
// given the candidate's result in the round it was spent in. Money on a
// candidate who left the race isn't decided by the result, so it's skipped.
function addMoneyByResult(
  money: MoneyByOutcome,
  candidate: RaceCandidate,
  support: number,
  oppose: number,
) {
  if (!needsResult(candidate)) {
    return;
  }
  const result = getCandidateResult(candidate);
  if (result === "won") {
    money.won += support;
    money.lost += oppose;
  } else if (result === "lost") {
    money.won += oppose;
    money.lost += support;
  } else {
    money.uncalled += support + oppose;
  }
}

// This round's super PAC money for or against a candidate
function addSuperPacMoney(money: MoneyByOutcome, c: ResultCandidate) {
  addMoneyByResult(money, c.candidate, c.current.support, c.current.oppose);
}

// Whether money landed on the winning side, the losing side, or both. Null
// until some of it has a result.
function getGoal(money: MoneyByOutcome): Goal | null {
  if (money.won > 0 && money.lost > 0) {
    return "mixed";
  }
  if (money.won > 0) {
    return "achieved";
  }
  if (money.lost > 0) {
    return "failed";
  }
  return null;
}

// Candidates in this round whose campaigns the sector's super PACs supported
// in an earlier round. With two or more, the PACs backed more than one of the
// candidates facing each other here, so a candidate they'd backed wins either
// way.
export function getCandidatesBackedEarlier(
  race: ResultRace,
): ResultCandidate[] {
  return race.candidates.filter(
    (c) => needsResult(c.candidate) && c.earlier.support > 0,
  );
}

export interface EarlierRounds {
  // The round types the money was spent in, e.g. ["primary"]
  rounds: string[];
  superPac: MoneyByOutcome;
  goal: Goal | null;
}

// The sector's super PAC money in the seat's rounds before this one (its
// primaries and runoffs), with each candidate's money scored against their
// result in that round. This includes candidates who lost a primary and
// aren't in the round being decided.
function getEarlierRounds(
  group: ElectionGroup,
  committees: Record<string, CommitteeConstant>,
  sector: Sector,
  type: string,
  date: string,
): EarlierRounds | null {
  const money = emptyMoney();
  const rounds = new Set<string>();
  const earlierRaces = (group.races || []).filter(
    (r) => r.type !== type && !r.canceled && r.date && r.date < date,
  );
  for (const race of earlierRaces) {
    for (const candidate of race.candidates) {
      let support = 0;
      let oppose = 0;
      for (const [committeeId, spending] of Object.entries(
        group.spending || {},
      )) {
        if (
          sector !== "all" &&
          !matchesSector(committees[committeeId]?.sector, sector)
        ) {
          continue;
        }
        const amounts =
          spending.subraces?.[race.type]?.candidates?.[candidate.name];
        support += amounts?.support ?? 0;
        oppose += amounts?.oppose ?? 0;
      }
      if (support + oppose === 0) {
        continue;
      }
      rounds.add(race.type);
      addMoneyByResult(money, candidate, support, oppose);
    }
  }
  if (money.won + money.lost + money.uncalled === 0) {
    return null;
  }
  return { rounds: [...rounds].sort(), superPac: money, goal: getGoal(money) };
}

const hasCurrentSpending = (race: ResultRace) =>
  race.candidates.some((c) => c.current.support + c.current.oppose > 0);

const hasEarlierSpending = (race: ResultRace) =>
  race.candidates.some((c) => c.earlier.support + c.earlier.oppose > 0);

// Whether the race's super PAC money landed on the winning side, the losing
// side, or both. Null until some of the money has a result.
export function getRaceGoal(race: ResultRace): Goal | null {
  const money = emptyMoney();
  race.candidates.forEach((c) => addSuperPacMoney(money, c));
  return getGoal(money);
}

export interface TagTally {
  races: number;
  called: number;
  superPac: MoneyByOutcome;
  // How many races' money met its goal, missed it, or did both
  goals: Record<Goal, number>;
}

export interface ResultsTally {
  races: number;
  called: number;
  // Races where tracked super PACs spent in this round. Only their money is
  // scored.
  superPacRaces: number;
  // Races where the super PACs only spent in an earlier round, like the
  // primary. The rest are only on the page for direct contributions.
  earlierOnlyRaces: number;
  // This round's super PAC money on the winning side (supporting a winner or
  // opposing a loser), on the losing side, and on candidates without a result
  superPac: MoneyByOutcome;
  // The super PAC split for the races with each tag
  byTag: Record<RaceTag, TagTally>;
  // Races with this round's super PAC money that couldn't be tagged, because
  // the contest has no rating, so the tags add up to the total
  untagged: TagTally;
  // Super PAC money in these seats' primaries, scored against the primary
  // results, with each seat counted once
  earlier: {
    seats: number;
    superPac: MoneyByOutcome;
    goals: Record<Goal, number>;
  };
}

const emptyTagTally = (): TagTally => ({
  races: 0,
  called: 0,
  superPac: emptyMoney(),
  goals: { achieved: 0, failed: 0, mixed: 0 },
});

export function getResultsTally(races: ResultRace[]): ResultsTally {
  const tally: ResultsTally = {
    races: races.length,
    called: races.filter((r) => r.status === "called").length,
    superPacRaces: races.filter(hasCurrentSpending).length,
    earlierOnlyRaces: races.filter(
      (r) => !hasCurrentSpending(r) && hasEarlierSpending(r),
    ).length,
    superPac: emptyMoney(),
    byTag: {
      competitive: emptyTagTally(),
      likely: emptyTagTally(),
      safe: emptyTagTally(),
      underdog: emptyTagTally(),
      mixed: emptyTagTally(),
    },
    untagged: emptyTagTally(),
    earlier: {
      seats: 0,
      superPac: emptyMoney(),
      goals: { achieved: 0, failed: 0, mixed: 0 },
    },
  };
  // A seat can have more than one round on the same date, but its earlier
  // rounds are the same for each, so count them once
  const seatsWithEarlierRounds = new Set<string>();
  for (const race of races) {
    if (race.earlierRounds && !seatsWithEarlierRounds.has(race.raceId)) {
      seatsWithEarlierRounds.add(race.raceId);
      const { superPac, goal } = race.earlierRounds;
      tally.earlier.seats += 1;
      tally.earlier.superPac.won += superPac.won;
      tally.earlier.superPac.lost += superPac.lost;
      tally.earlier.superPac.uncalled += superPac.uncalled;
      if (goal) {
        tally.earlier.goals[goal] += 1;
      }
    }
    const tagTally = race.tag
      ? tally.byTag[race.tag]
      : hasCurrentSpending(race)
        ? tally.untagged
        : null;
    if (tagTally) {
      tagTally.races += 1;
      if (race.status === "called") {
        tagTally.called += 1;
      }
      const goal = getRaceGoal(race);
      if (goal) {
        tagTally.goals[goal] += 1;
      }
    }
    for (const c of race.candidates) {
      addSuperPacMoney(tally.superPac, c);
      if (tagTally) {
        addSuperPacMoney(tagTally.superPac, c);
      }
    }
  }
  return tally;
}
