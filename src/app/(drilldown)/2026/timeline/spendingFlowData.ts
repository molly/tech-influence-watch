import { DateTime } from "luxon";

import {
  fetchAllExpenditures,
  fetchAllStateElections,
  fetchConstant,
  fetchPipelineLastRun,
} from "@/app/actions/fetch";
import districtCentroids from "@/app/data/districtCentroids.json";
import type { CommitteeConstant } from "@/app/types/Committee";
import {
  ElectionsByState,
  OppositionConstant,
  OutsideSpendingRow,
  Race,
  RaceType,
} from "@/app/types/Elections";
import type { Expenditure } from "@/app/types/Expenditures";
import type { Sector } from "@/app/types/Sector";
import { ErrorType, isError } from "@/app/utils/errors";
import { getCandidateName } from "@/app/utils/expenditures";
import { getSubraceName, hasLeftRace } from "@/app/utils/races";
import { matchesSector } from "@/app/utils/sector";

import {
  FLOW_END_DATE,
  FLOW_START_DATE,
  FlowCandidate,
  FlowDirection,
  FlowExpenditure,
  FlowRace,
  getWeekIndex,
  SpendingFlowData,
  WeeklyAmounts,
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

// Bin independent expenditures by week, keeping only those dated within the
// timeline. E-filed reports often carry only a dissemination date.
function weeklyAmounts(rows: OutsideSpendingRow[]): WeeklyAmounts {
  const byWeek = new Map<string, WeeklyAmounts[number]>();
  for (const row of rows) {
    const date = row.expenditure_date ?? row.dissemination_date;
    if (
      !date ||
      date < FLOW_START_DATE ||
      date > FLOW_END_DATE ||
      !row.expenditure_amount
    ) {
      continue;
    }
    const week = getWeekIndex(date);
    const stage = row.subrace === "general" ? "general" : "primary";
    const key = `${week}-${stage}`;
    const entry = byWeek.get(key) ?? [week, 0, stage];
    entry[1] += row.expenditure_amount;
    byWeek.set(key, entry);
  }
  return [...byWeek.values()].sort((a, b) => a[0] - b[0]);
}

// Why a candidate is no longer running, from the latest contest they entered:
// "Lost Jun 23 Democratic primary", "Withdrew", and so on. Null if they're
// still in the race.
function getOutOfRaceStatus(races: Race[], name: string): string | null {
  const entries = races
    .flatMap((race) =>
      race.candidates
        .filter((c) => c.name === name)
        .map((candidate) => ({ race, candidate })),
    )
    .sort((a, b) => a.race.date.localeCompare(b.race.date));
  const last = entries[entries.length - 1];
  if (!last) {
    return null;
  }
  if (last.candidate.withdrew) {
    return "Withdrew";
  }
  if (last.candidate.died) {
    return "Died";
  }
  if (last.candidate.declined) {
    return "Declined to run";
  }
  if (last.candidate.won === false) {
    const date = DateTime.fromISO(last.race.date).toFormat("LLL d");
    return `Lost ${date} ${getSubraceName(last.race)}`;
  }
  return null;
}

// The candidates for a race's panel and the race's outside spending across
// every candidate who drew any. The panel lists the general-election field
// (or the most recent contest, if no general is set), plus anyone else who
// drew tech spending, such as a primary loser targeted by a tech PAC.
function getRaceCandidates(
  elections: Record<string, ElectionsByState>,
  raceId: string,
  techCandidates: Set<string>,
): Pick<FlowRace, "candidates" | "outsideTotal" | "generalDate"> {
  const [state, ...rest] = raceId.split("-");
  const group = elections[state]?.[rest.join("-")];
  if (!group) {
    return { candidates: [], outsideTotal: [], generalDate: null };
  }
  const outsideTotal = weeklyAmounts(
    Object.values(group.candidates).flatMap((summary) => [
      ...(summary.outside_spending?.support ?? []),
      ...(summary.outside_spending?.oppose ?? []),
    ]),
  );
  const races = group.races.filter((race) => !race.canceled);
  const general = races.find((race) => race.type === RaceType.General);
  const current = general ?? races[races.length - 1];
  const field = new Set(
    (current?.candidates ?? [])
      .filter((c) => !c.placeholder && !hasLeftRace(c) && c.won !== false)
      .map((c) => c.name),
  );

  const seen = new Set<string>();
  const candidates: FlowCandidate[] = [];
  for (const race of races) {
    for (const c of race.candidates) {
      const inField = field.has(c.name);
      if (
        seen.has(c.name) ||
        c.placeholder ||
        (!inField && !techCandidates.has(c.name))
      ) {
        continue;
      }
      seen.add(c.name);
      const summary = group.candidates[c.name];
      candidates.push({
        name: c.name,
        party: c.party,
        incumbent: Boolean(c.incumbent),
        inField,
        status: inField ? null : getOutOfRaceStatus(races, c.name),
        raised: summary?.raised_total ?? 0,
        raisedReports: (summary?.raised_reports ?? []).map((report) => ({
          week: getWeekIndex(report.date),
          date: report.date,
          receipts: report.receipts,
        })),
        outsideFor: weeklyAmounts(summary?.outside_spending?.support ?? []),
        outsideAgainst: weeklyAmounts(
          summary?.outside_spending?.oppose ?? [],
        ),
      });
    }
  }
  // Candidates still running first, then by party.
  candidates.sort(
    (a, b) =>
      Number(b.inField) - Number(a.inField) ||
      (a.party ?? "Z").localeCompare(b.party ?? "Z"),
  );
  return { candidates, outsideTotal, generalDate: general?.date ?? null };
}

export async function fetchSpendingFlowData(
  sector: Sector,
): Promise<SpendingFlowData | ErrorType> {
  const [expendituresData, electionsData, committees, opposition, lastRun] =
    await Promise.all([
      fetchAllExpenditures(),
      fetchAllStateElections(),
      fetchConstant<Record<string, CommitteeConstant>>("committees"),
      fetchConstant<Record<string, OppositionConstant>>("oppositionSpending"),
      fetchPipelineLastRun(),
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
      date > FLOW_END_DATE ||
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
      sector: committee.sector,
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
  const techCandidates = new Map<string, Set<string>>();
  for (const e of expenditures) {
    const names = techCandidates.get(e.raceId) ?? new Set<string>();
    names.add(e.candidate);
    techCandidates.set(e.raceId, names);
  }
  for (const [raceId, names] of techCandidates) {
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
      ...getRaceCandidates(elections, raceId, names),
    };
  }

  // Run through the current week, or further if anything is dated ahead of
  // today (e.g. a scheduled dissemination date), but not past election day.
  const today = DateTime.utc().toISODate() ?? FLOW_START_DATE;
  const lastWeek = Math.min(
    Math.max(getWeekIndex(today), ...expenditures.map((e) => e.week)),
    getWeekIndex(FLOW_END_DATE),
  );
  // Formatted the same way as the page header's "Data through" date.
  const dataThrough =
    (lastRun && DateTime.fromISO(lastRun).toISODate()) || today;
  return {
    numWeeks: lastWeek + 1,
    today,
    dataThrough,
    races,
    expenditures,
    committees: committeeNames,
  };
}
