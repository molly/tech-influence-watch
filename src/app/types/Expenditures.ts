import { CandidateSummary } from "./Elections";
import { ScheduleE } from "./FECTypes";

enum CandidateOffice {
  President = "P",
  Senate = "S",
  House = "H",
}

export type Expenditure = {
  committee_id: number;
  subrace: string;
  uid: string;
} & Pick<
  ScheduleE,
  | "expenditure_amount"
  | "candidate_office_state"
  | "expenditure_date"
  | "expenditure_description"
  | "candidate_id"
  | "candidate_first_name"
  | "candidate_last_name"
  | "candidate_middle_name"
  | "candidate_suffix"
  | "candidate_name"
  | "candidate_office"
  | "candidate_office_state"
  | "candidate_office_district"
  | "candidate_party"
  | "category_code"
  | "category_code_full"
  | "dissemination_date"
  | "election_type"
  | "payee_name"
  | "support_oppose_indicator"
  | "transaction_id"
>;

export type ExpenditureId = string;

export type CommitteeTotalExpenditures = {
  expenditures: number | null;
  disbursements: number | null;
};

interface ExpenditureGroup {
  expenditures: ExpenditureId[];
  total: number;
}

interface PopulatedExpenditureGroup {
  expenditures: Expenditure[];
  total: number;
}

interface RaceDetails {
  candidate_office: CandidateOffice;
  candidate_office_district: string;
}

export interface RaceExpenditureGroup extends ExpenditureGroup {
  details: RaceDetails;
}

export interface PopulatedRaceExpenditureGroup
  extends PopulatedExpenditureGroup {
  details: RaceDetails;
}

export interface PriorCycleCandidate {
  name: string;
  office: string;
  election_years: number[];
}

export interface PriorCycleDetail {
  company_id: string;
  company_name: string;
  committee_id: string;
  committee_name: string;
  amount: number;
  candidates: PriorCycleCandidate[];
}

export interface StateExpenditures {
  by_committee: Record<string, ExpenditureGroup>;
  by_race: Record<string, RaceExpenditureGroup>;
  by_companies?: Record<string, number>;
  companies_total?: number;
  by_race_companies?: Record<string, Record<string, number>>;
  prior_cycle_details?: PriorCycleDetail[];
  prior_cycle_companies_total?: number;
  total: number;
}

export interface PopulatedStateExpenditures {
  by_committee: Record<string, PopulatedExpenditureGroup>;
  by_race: Record<string, PopulatedRaceExpenditureGroup>;
  by_companies?: Record<string, number>;
  companies_total?: number;
  by_race_companies_total?: Record<string, number>;
  prior_cycle_details?: PriorCycleDetail[];
  prior_cycle_companies_total?: number;
  total: number;
}

export interface RecentExpendituresSnapshot {
  all: ExpenditureId[];
  by_committee?: Record<string, ExpenditureId[]>;
}

export interface RecentExpenditures {
  all: RecentExpendituresSnapshot;
  crypto: RecentExpendituresSnapshot;
  ai: RecentExpendituresSnapshot;
}

export interface ExpendituresByPartySnapshot {
  dem_oppose: number;
  dem_support: number;
  rep_oppose: number;
  rep_support: number;
  oppose_benefit_dem: number;
  oppose_benefit_rep: number;
  oppose_benefit_mix: number;
  oppose_benefit_unk: number;
}

export interface ExpendituresByParty {
  all: ExpendituresByPartySnapshot;
  crypto: ExpendituresByPartySnapshot;
  ai: ExpendituresByPartySnapshot;
}

export interface ExpenditureTotalsSnapshot {
  total: number;
  by_committee: Record<string, number>;
}

export interface ExpenditureTotals {
  all: ExpenditureTotalsSnapshot;
  crypto: ExpenditureTotalsSnapshot;
  ai: ExpenditureTotalsSnapshot;
}

export interface Expenditures {
  all: Expenditure[];
  recent: RecentExpenditures;
  states: StateExpenditures;
  by_party: ExpendituresByPartySnapshot;
  total: ExpenditureTotals;
}

export type ExpenditureCandidateSummary = {
  state: string;
  race: string;
} & CandidateSummary;

export interface ExpendituresByCandidate {
  order: string[];
  candidates: Record<string, ExpenditureCandidateSummary>;
}
