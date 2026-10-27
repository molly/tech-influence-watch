import { DateTime } from "luxon";

import {
  fetchAllExpenditures,
  fetchAllStateElections,
  fetchConstant,
} from "@/app/actions/fetch";
import districtCentroids from "@/app/data/districtCentroids.json";
import type { CommitteeConstant } from "@/app/types/Committee";
import {
  ElectionsByState,
  OppositionConstant,
  RaceType,
} from "@/app/types/Elections";
import type { Expenditure } from "@/app/types/Expenditures";
import type { Sector } from "@/app/types/Sector";
import { ErrorType, isError } from "@/app/utils/errors";
import { getCandidateName } from "@/app/utils/expenditures";
import { hasLeftRace } from "@/app/utils/races";
import { matchesSector } from "@/app/utils/sector";

import {
  FLOW_START_DATE,
  FlowCandidate,
  FlowDirection,
  FlowExpenditure,
  FlowRace,
  getWeekIndex,
  SpendingFlowData,
} from "./spendingFlowUtils";

const CENTROIDS: Record<string, number[]> = districtCentroids;

function partyLetter(party?: string | null): string | undefined {
  if (!party) {
    return undefined;
  }
  return party.charAt(0).toUpperCase();
}

function getDirection(
  expenditure: Expenditure,
  opposition: Record<string, OppositionConstant>,
): { direction: FlowDirection; beneficiary: string | null } {
  const name = getCandidateName(expenditure);
  if (expenditure.support_oppose_indicator === "S") {
    const party = partyLetter(expenditure.candidate_party);
    return {
      direction: party === "R" || party === "D" ? party : "U",
      beneficiary: name,
    };
  }
  const details = expenditure.candidate_id
    ? opposition[expenditure.candidate_id]
    : undefined;
  // "–" in the constant means the opposition helps a party but no particular
  // candidate.
  const beneficiary =
    details?.benefitsCandidate && details.benefitsCandidate !== "–"
      ? details.benefitsCandidate
      : null;
  if (details?.benefitsParty === "REP") {
    return { direction: "R", beneficiary };
  }
  if (details?.benefitsParty === "DEM") {
    return { direction: "D", beneficiary };
  }
  return { direction: "U", beneficiary };
}

// The candidates shown on a race's panel: the general-election field if one is
// set, otherwise the most recent contest, minus anyone who has left the race.
function getRaceCandidates(
  elections: Record<string, ElectionsByState>,
  raceId: string,
): { candidates: FlowCandidate[]; generalDate: string | null } {
  const [state, ...rest] = raceId.split("-");
  const group = elections[state]?.[rest.join("-")];
  if (!group) {
    return { candidates: [], generalDate: null };
  }
  const races = group.races.filter((race) => !race.canceled);
  const general = races.find((race) => race.type === RaceType.General);
  const race = general ?? races[races.length - 1];
  if (!race) {
    return { candidates: [], generalDate: null };
  }
  const candidates = race.candidates
    .filter((c) => !c.placeholder && !hasLeftRace(c) && c.won !== false)
    .map((c) => ({
      name: c.name,
      party: c.party,
      incumbent: Boolean(c.incumbent),
      raised: group.candidates[c.name]?.raised_total ?? 0,
    }))
    .sort((a, b) => (a.party ?? "Z").localeCompare(b.party ?? "Z"));
  return { candidates, generalDate: general?.date ?? null };
}

export async function fetchSpendingFlowData(
  sector: Sector,
): Promise<SpendingFlowData | ErrorType> {
  const [expendituresData, electionsData, committees, opposition] =
    await Promise.all([
      fetchAllExpenditures(),
      fetchAllStateElections(),
      fetchConstant<Record<string, CommitteeConstant>>("committees"),
      fetchConstant<Record<string, OppositionConstant>>("oppositionSpending"),
    ]);
  if (isError(expendituresData)) {
    return expendituresData as ErrorType;
  }
  if (isError(electionsData)) {
    return electionsData as ErrorType;
  }
  const allExpenditures = expendituresData as Record<string, Expenditure>;
  const elections = electionsData as Record<string, ElectionsByState>;

  const expenditures: FlowExpenditure[] = [];
  const committeeNames: Record<string, string> = {};
  for (const expenditure of Object.values(allExpenditures)) {
    const date =
      expenditure.expenditure_date ?? expenditure.dissemination_date ?? null;
    const committee = committees?.[expenditure.committee_id];
    if (
      !expenditure.expenditure_amount ||
      !expenditure.race_id ||
      !date ||
      date < FLOW_START_DATE ||
      !committee?.sector ||
      (sector !== "all" && !matchesSector(committee.sector, sector))
    ) {
      continue;
    }
    const { direction, beneficiary } = getDirection(
      expenditure,
      opposition ?? {},
    );
    committeeNames[expenditure.committee_id] = committee.name;
    expenditures.push({
      uid: expenditure.uid,
      raceId: expenditure.race_id,
      date,
      week: getWeekIndex(date),
      amount: expenditure.expenditure_amount,
      direction,
      stage: expenditure.subrace === "general" ? "general" : "primary",
      committeeId: expenditure.committee_id,
      candidate: getCandidateName(expenditure),
      candidateParty: partyLetter(expenditure.candidate_party),
      supportOppose: expenditure.support_oppose_indicator === "O" ? "O" : "S",
      beneficiary,
      description: expenditure.expenditure_description ?? undefined,
    });
  }
  expenditures.sort((a, b) => b.date.localeCompare(a.date));

  const races: Record<string, FlowRace> = {};
  for (const raceId of new Set(expenditures.map((e) => e.raceId))) {
    const [state, office] = raceId.split("-");
    const special = raceId.endsWith("-special");
    const districtKey = raceId.replace(/-special$/, "");
    races[raceId] = {
      id: raceId,
      state,
      office: office === "S" ? "S" : "H",
      special,
      latLon:
        office === "H" && CENTROIDS[districtKey]
          ? [CENTROIDS[districtKey][0], CENTROIDS[districtKey][1]]
          : null,
      ...getRaceCandidates(elections, raceId),
    };
  }

  // Run through the current week, or further if anything is dated ahead of
  // today (e.g. a scheduled dissemination date).
  const today = DateTime.utc().toISODate() ?? FLOW_START_DATE;
  const lastWeek = Math.max(
    getWeekIndex(today),
    ...expenditures.map((e) => e.week),
  );
  return {
    numWeeks: lastWeek + 1,
    today,
    races,
    expenditures,
    committees: committeeNames,
  };
}
