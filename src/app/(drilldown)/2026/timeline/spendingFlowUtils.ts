import { DateTime } from "luxon";

import { STATES_BY_ABBR } from "@/app/data/states";
import type { Party } from "@/app/types/Elections";
import type { BESector } from "@/app/types/Sector";

// The timeline runs in 7-day bins from the start of the 2026 election year.
export const FLOW_START_DATE = "2026-01-01";

// Which party a dollar helps. Support for a candidate helps their party;
// opposition helps whichever party the oppositionSpending constant says it
// benefits. Opposition with no known beneficiary, and support for third-party
// candidates, is "U" (unassigned).
export type FlowDirection = "R" | "D" | "U";

export type FlowStage = "primary" | "general";

export interface FlowExpenditure {
  uid: string;
  raceId: string;
  date: string;
  week: number;
  amount: number;
  direction: FlowDirection;
  stage: FlowStage;
  sector: BESector;
  committeeId: string;
  candidate: string;
  candidateParty?: string;
  supportOppose: "S" | "O";
  // The candidate this spending is meant to help: the named candidate for
  // support, or the oppositionSpending beneficiary for opposition.
  beneficiary: string | null;
  description?: string;
}

// Sparse weekly sums for weeks with any spending: [week index, amount,
// election stage].
export type WeeklyAmounts = [number, number, FlowStage][];

export interface FlowCandidate {
  name: string;
  party?: Party;
  incumbent: boolean;
  // Whether they're in the current field (the general, if one is set). Others
  // are listed only when they drew tech spending, with a status like "Lost Jun
  // 23 Democratic primary".
  inField: boolean;
  status: string | null;
  raised: number;
  // Receipts by filing period, keyed by the week the period ends.
  raisedReports: { week: number; date: string; receipts: number }[];
  // Independent expenditures for and against this candidate by all outside
  // groups, tech or not.
  outsideFor: WeeklyAmounts;
  outsideAgainst: WeeklyAmounts;
}

export interface FlowRace {
  id: string;
  state: string;
  office: "S" | "H";
  special: boolean;
  // House races are placed at their district's Census internal point. Senate
  // races are placed at the state's centroid, computed client-side from the
  // same topology the map draws.
  latLon: [number, number] | null;
  candidates: FlowCandidate[];
  // All outside spending in the race, for or against any candidate.
  outsideTotal: WeeklyAmounts;
  generalDate: string | null;
}

export interface SpendingFlowData {
  numWeeks: number;
  today: string;
  races: Record<string, FlowRace>;
  expenditures: FlowExpenditure[];
  committees: Record<string, string>;
}

export type StageFilter = "all" | FlowStage;
export type OfficeFilter = "all" | "S" | "H";
export type ShowFilter = "all" | PartyDirection;

export interface FlowFilters {
  stage: StageFilter;
  office: OfficeFilter;
}

export interface DirectionTotals {
  R: number;
  D: number;
  U: number;
  total: number;
}

// The directions the page shows. "U" stays in the data model as a fallback
// for spending that can't be assigned to a party (support for a third-party
// candidate, or opposition missing from the oppositionSpending constant), but
// none of today's spending lands there, so it isn't shown.
export type PartyDirection = "R" | "D";

export const DIRECTIONS: {
  key: PartyDirection;
  label: string;
  phrase: string;
}[] = [
  { key: "R", label: "Favoring Republicans", phrase: "favoring Republicans" },
  { key: "D", label: "Favoring Democrats", phrase: "favoring Democrats" },
];

export function weekStart(week: number): DateTime {
  return DateTime.fromISO(FLOW_START_DATE, { zone: "utc" }).plus({
    weeks: week,
  });
}

export function getWeekIndex(date: string): number {
  const start = DateTime.fromISO(FLOW_START_DATE, { zone: "utc" });
  const day = DateTime.fromISO(date, { zone: "utc" });
  return Math.floor(day.diff(start, "days").days / 7);
}

export function formatShortDate(date: DateTime): string {
  return date.toFormat("LLL d");
}

// The last day a week covers, capped at today so the current week doesn't
// claim days that haven't happened yet.
export function weekEnd(week: number, today: string): DateTime {
  const end = weekStart(week).plus({ days: 6 });
  const todayDate = DateTime.fromISO(today, { zone: "utc" });
  return end < todayDate ? end : todayDate;
}

export function getThroughLabel(week: number, today: string): string {
  return `Through ${weekEnd(week, today).toFormat("LLL d, yyyy")}`;
}

export function getRaceOffice(raceId: string): "S" | "H" {
  return raceId.split("-")[1] === "S" ? "S" : "H";
}

export function matchesFilters(
  expenditure: FlowExpenditure,
  filters: Pick<FlowFilters, "stage" | "office">,
): boolean {
  if (filters.stage !== "all" && expenditure.stage !== filters.stage) {
    return false;
  }
  if (
    filters.office !== "all" &&
    getRaceOffice(expenditure.raceId) !== filters.office
  ) {
    return false;
  }
  return true;
}

export function emptyTotals(): DirectionTotals {
  return { R: 0, D: 0, U: 0, total: 0 };
}

export function sumByDirection(
  expenditures: FlowExpenditure[],
): DirectionTotals {
  const totals = emptyTotals();
  for (const e of expenditures) {
    totals[e.direction] += e.amount;
    totals.total += e.amount;
  }
  return totals;
}

export function getRaceDistrict(race: FlowRace): string | null {
  return race.id.split("-")[2]?.replace(/^special$/, "") || null;
}

// Compact race name for tables, chips, and the map: "Ohio Senate special",
// "CA-11", "AK-AL".
export function getRaceLabel(race: FlowRace): string {
  const special = race.special ? " special" : "";
  if (race.office === "S") {
    return `${STATES_BY_ABBR[race.state] ?? race.state} Senate${special}`;
  }
  const district = getRaceDistrict(race);
  return `${race.state}-${district ?? "AL"}${special}`;
}

export interface HelpsPart {
  kind: "for" | "against";
  candidate: string;
  amount: number;
}

// Spending grouped by the candidate it's meant to help, with the support and
// opposition that make it up.
export interface HelpsLine {
  key: string;
  direction: FlowDirection;
  beneficiary: string | null;
  party?: string;
  total: number;
  parts: HelpsPart[];
}

export function getHelpsLines(expenditures: FlowExpenditure[]): HelpsLine[] {
  const lines = new Map<string, HelpsLine>();
  for (const e of expenditures) {
    const key = `${e.direction}|${e.beneficiary ?? ""}`;
    let line = lines.get(key);
    if (!line) {
      line = {
        key,
        direction: e.direction,
        beneficiary: e.beneficiary,
        party:
          e.supportOppose === "S"
            ? e.candidateParty
            : e.direction === "U"
              ? undefined
              : e.direction,
        total: 0,
        parts: [],
      };
      lines.set(key, line);
    }
    line.total += e.amount;
    const kind = e.supportOppose === "S" ? "for" : "against";
    const part = line.parts.find(
      (p) => p.kind === kind && p.candidate === e.candidate,
    );
    if (part) {
      part.amount += e.amount;
    } else {
      line.parts.push({ kind, candidate: e.candidate, amount: e.amount });
    }
  }
  return [...lines.values()]
    .map((line) => ({
      ...line,
      parts: line.parts.sort((a, b) => b.amount - a.amount),
    }))
    .sort((a, b) => b.total - a.total);
}

export function sumThroughWeek(
  amounts: WeeklyAmounts,
  week: number,
  stage: StageFilter,
): number {
  let total = 0;
  for (const [w, amount, s] of amounts) {
    if (w <= week && (stage === "all" || s === stage)) {
      total += amount;
    }
  }
  return total;
}

// A candidate's fundraising as of a week: the current total, less whatever
// was reported for periods ending after it. Stepping back from the current
// total keeps the latest week equal to the FEC's candidate total.
export function raisedThroughWeek(
  candidate: FlowCandidate,
  week: number,
): { amount: number; through: string | null } {
  let amount = candidate.raised;
  let through: string | null = null;
  for (const report of candidate.raisedReports) {
    if (report.week > week) {
      amount -= report.receipts;
    } else {
      through = report.date;
    }
  }
  return { amount: Math.max(0, amount), through };
}
