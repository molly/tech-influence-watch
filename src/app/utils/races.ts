import {
  CandidateSummary,
  ElectionGroup,
  ElectionsByState,
  Race,
  RaceType,
} from "@/app/types/Elections";
import { humanizeList } from "@/app/utils/humanize";
import { getFullPartyName } from "@/app/utils/party";

import { SINGLE_MEMBER_STATES } from "../data/states";
import { ExpenditureCandidateSummary } from "../types/Expenditures";
import { isUpcomingDate } from "./utils";

/**
 * Direct contributions are attributed to a candidate by candidate_id, which is
 * not race-specific. So a candidate who declined to run in THIS race but is
 * actively running in another race in the same state would otherwise have their
 * (other-race) money shown here. This returns the candidate_ids that declined in
 * `shortRaceId` but are active (not declined/withdrew) in another race, so
 * callers can suppress their contributions for this race. A candidate who
 * declined and is NOT running elsewhere is not included (their money still
 * belongs here).
 *
 * The same person is matched across races by name, and also by candidate_id via
 * the `candidateAliases` map — FEC ids are office-specific, so someone who
 * declined a House race to run for Senate has a different id in each, and the
 * alias map links the two (e.g. H2LA05126 -> S6LA00664).
 */
export function getDeclinedElsewhereCandidateIds(
  elections: ElectionsByState,
  shortRaceId: string,
  candidateAliases: Record<string, string> = {},
): Set<string> {
  const current = elections[shortRaceId];
  if (!current) {
    return new Set();
  }
  // An id plus its alias, if any, so the same person's office-specific ids match.
  const idWithAlias = (id: string | undefined): string[] => {
    if (!id) {
      return [];
    }
    const alias = candidateAliases[id];
    return alias ? [id, alias] : [id];
  };
  // A candidate's id within a group, by race-candidate name, falling back to a
  // summary whose common_name matches (the candidates map key isn't always name).
  const idForName = (
    group: ElectionGroup,
    name: string,
  ): string | undefined => {
    const direct = group.candidates[name]?.candidate_id;
    if (direct) {
      return direct;
    }
    for (const summary of Object.values(group.candidates)) {
      if (summary.common_name === name && summary.candidate_id) {
        return summary.candidate_id;
      }
    }
    return undefined;
  };

  // Names and (alias-expanded) ids of candidates active in some OTHER race.
  const activeNames = new Set<string>();
  const activeIds = new Set<string>();
  for (const [otherRaceId, group] of Object.entries(elections)) {
    if (otherRaceId === shortRaceId) {
      continue;
    }
    for (const race of group.races) {
      for (const candidate of race.candidates) {
        if (candidate.declined || candidate.withdrew) {
          continue;
        }
        activeNames.add(candidate.name);
        for (const id of idWithAlias(idForName(group, candidate.name))) {
          activeIds.add(id);
        }
      }
    }
  }

  // Current-race candidate_ids declined here whose person runs elsewhere.
  const suppressed = new Set<string>();
  for (const race of current.races) {
    for (const candidate of race.candidates) {
      if (!candidate.declined) {
        continue;
      }
      const id = idForName(current, candidate.name);
      const runsElsewhere =
        activeNames.has(candidate.name) ||
        idWithAlias(id).some((i) => activeIds.has(i));
      if (runsElsewhere && id) {
        suppressed.add(id);
      }
    }
  }
  return suppressed;
}

// Senate race first, then house races ordered by district
export const sortRaces = (a: string, b: string) => {
  const raceA = a.split("-");
  const raceB = b.split("-");
  if (raceA[1] === "S") {
    return -1;
  } else if (raceB[1] === "S") {
    return 1;
  } else {
    return raceA[2].localeCompare(raceB[2]);
  }
};

export const getRaceName = (
  raceId: string,
  year: string = "",
  parens: boolean = false,
) => {
  if (!raceId) {
    return "";
  }
  const raceIdCaps = raceId.toUpperCase();
  if (raceIdCaps === "PRESIDENT") {
    return "Presidential";
  }

  const raceParts = raceIdCaps.split("-");
  let state, office, district;
  let raceName = "";

  if (raceParts[0].length == 1) {
    // ShortID
    office = raceParts[0];
    district = raceParts.length > 1 ? raceParts[1] : null;
  } else {
    // Full ID with state
    state = raceParts[0];
    office = raceParts[1];
    district = raceParts.length > 2 ? raceParts[2] : null;
  }
  if (office === "P") {
    return "President";
  } else if (office === "S") {
    raceName = "Senate";
  } else if (office === "H") {
    if (!district || (state && SINGLE_MEMBER_STATES.includes(state))) {
      raceName = "House";
    } else {
      raceName = `House District ${parseInt(district, 10)}`;
    }
  }
  if (raceParts[raceParts.length - 1] === "SPECIAL") {
    if (parens) {
      raceName += ` (${year ? `${year} ` : ""}special)`;
    } else {
      raceName += ` ${year ? `${year} ` : ""}special`;
    }
  }
  return raceName;
};

// Builds a compact "Active in ..." phrase from a set of raceIds, collapsing all
// House district races into a single "House Districts <list>" clause rather than
// naming each district separately.
export const humanizeActiveRaces = (raceIds: string[]): string => {
  let hasSenate = false;
  let hasAtLargeHouse = false;
  const districts: number[] = [];

  for (const raceId of raceIds) {
    const raceParts = raceId.toUpperCase().split("-");
    const office = raceParts[0].length === 1 ? raceParts[0] : raceParts[1];
    const state = raceParts[0].length === 1 ? undefined : raceParts[0];
    const district = raceParts[0].length === 1 ? raceParts[1] : raceParts[2];

    if (office === "S") {
      hasSenate = true;
    } else if (office === "H") {
      if (!district || (state && SINGLE_MEMBER_STATES.includes(state))) {
        hasAtLargeHouse = true;
      } else {
        districts.push(parseInt(district, 10));
      }
    }
  }

  const clauses: string[] = [];
  if (hasSenate) {
    clauses.push("Senate");
  }
  if (districts.length === 1) {
    clauses.push(`House District ${districts[0]}`);
  } else if (districts.length > 1) {
    const sorted = districts.sort((a, b) => a - b).map((d) => d.toString());
    clauses.push(`House Districts ${humanizeList(sorted) as string}`);
  } else if (hasAtLargeHouse) {
    clauses.push("House");
  }

  return clauses.join(" and ");
};

export const getStateFromRaceId = (raceId?: string) => {
  if (!raceId) {
    return "";
  }
  const raceIdCaps = raceId.toUpperCase();
  if (raceIdCaps === "PRESIDENT") {
    return "";
  }

  const raceParts = raceIdCaps.split("-");

  if (raceParts[0].length == 1) {
    // Short ID, does not have state
    return "";
  } else {
    // Full ID with state
    return raceParts[0];
  }
};

type SubraceArg = {
  type?: RaceType;
  party?: string | null;
  [key: string]: any;
};

export const getSubraceName = (race?: SubraceArg) => {
  if (!race || !race.type) {
    return "";
  }
  if (race.type === "general") {
    return "general election";
  } else {
    const party = race.party ? getFullPartyName(race.party) : null;
    const raceName = race.type.replace("_", " ");
    if (party) {
      return `${party} ${raceName}`;
    }
    return raceName;
  }
};

export const isUpcomingRace = (
  race: Race,
  defaultValue?: boolean,
): boolean | null => {
  if (!("date" in race)) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    return null;
  } else if (isUpcomingDate(race.date)) {
    return true;
  }
  // Edge case where election date may have passed, but results have not yet become available.
  // In this case, we consider it to be an upcoming race.
  return !race.candidates.some((c) => "won" in c);
};

export const getUpcomingRaceForCandidate = (
  races: Race[],
  candidate: CandidateSummary | ExpenditureCandidateSummary,
): Race | undefined => {
  let nextRace;
  const involvedRaces = races.filter((r) =>
    r.candidates.some((c) => c.name === candidate.common_name),
  );
  for (const r of involvedRaces) {
    if (isUpcomingRace(r)) {
      nextRace = r;
      break;
    }
  }
  return nextRace;
};

// The most recent race the candidate was in, or undefined if they were in none.
export const getMostRecentRace = (
  races: Race[],
  candidate: CandidateSummary | ExpenditureCandidateSummary,
): Race | undefined => {
  const involvedRaces = races.filter((r) =>
    r.candidates.some((c) => c.name === candidate.common_name),
  );
  if (involvedRaces.length === 0) {
    return undefined;
  }
  return [...involvedRaces].sort((a, b) =>
    (b.date || "").localeCompare(a.date || ""),
  )[0];
};

// The candidate's recorded result (won true/false) in the most recent race they
// were in, or undefined if that race has no recorded result yet. Used to tell
// apart a candidate who won their final race from one whose latest race has
// happened but hasn't been called for them — e.g. an as-yet-uncalled co-winner
// in a multi-winner primary.
export const getMostRecentRaceResult = (
  races: Race[],
  candidate: CandidateSummary | ExpenditureCandidateSummary,
): boolean | undefined => {
  const mostRecent = getMostRecentRace(races, candidate);
  const entry = mostRecent?.candidates.find(
    (c) => c.name === candidate.common_name,
  );
  return entry?.won;
};

// Whether the candidate lost their race, derived from the recorded race result
// rather than the summary's `defeated` flag (which the pipeline doesn't keep in
// sync with manual race edits). A candidate with an upcoming race isn't defeated,
// and an uncalled most-recent race (no recorded result) isn't a loss yet.
export const isDefeated = (
  races: Race[],
  candidate: CandidateSummary | ExpenditureCandidateSummary,
): boolean => {
  if (getUpcomingRaceForCandidate(races, candidate)) {
    return false;
  }
  return getMostRecentRaceResult(races, candidate) === false;
};
