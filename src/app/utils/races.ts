import { CandidateSummary, Race, RaceType } from "@/app/types/Elections";
import { getFullPartyName } from "@/app/utils/party";

import { SINGLE_MEMBER_STATES } from "../data/states";
import { ExpenditureCandidateSummary } from "../types/Expenditures";
import { isUpcomingDate } from "./utils";

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
