import { Candidate, ScheduleE } from "./FECTypes";
import { BESector } from "./Sector";

export enum Party {
  Democratic = "D",
  Republican = "R",
  Libertarian = "L",
  Green = "G",
  Independent = "I",
  Nonpartisan = "N",
}

export interface RaceCandidate {
  name: string;
  party?: Party;
  percentage?: number;
  won?: boolean;
  withdrew?: boolean;
  died?: boolean;
  declined?: boolean;
  declineReason?: string;
  writeIn?: boolean;
  incumbent?: boolean;
  // A stand-in for a nominee who isn't known yet — set by hand in the race
  // editor when a primary winner leaves the race (withdrew or died) and their
  // party has yet to name a replacement. Placeholders are presentation-only:
  // they are not real people, so the backend gives them no CandidateSummary and
  // never looks them up at the FEC. Render them as an UnknownCandidate.
  placeholder?: boolean;
}

export enum RaceType {
  General = "general",
  GeneralRunoff = "general_runoff",
  Primary = "primary",
  // A stand-alone primary held to fill a nomination the regular primary didn't
  // settle — e.g. South Carolina replacing a nominee who died after the primary.
  // Sits between the primary and any primary runoff.
  SpecialPrimary = "special_primary",
  PrimaryRunoff = "primary_runoff",
  Convention = "convention",
  Special = "special",
}

// One independent expenditure for or against a candidate, as stored by the
// backend's outside_spending.py (SCHEDULE_E_FIELDS).
export type OutsideSpendingRow = Pick<
  ScheduleE,
  | "expenditure_amount"
  | "expenditure_date"
  | "dissemination_date"
  | "expenditure_description"
  | "support_oppose_indicator"
  | "candidate_id"
  | "category_code"
  | "category_code_full"
  | "committee_id"
  | "pdf_url"
  | "transaction_id"
> & {
  subrace?: string;
  source?: "electioneering";
};

type OutsideSpending = {
  support_total: number;
  oppose_total: number;
  crypto_support_total?: number;
  ai_support_total?: number;
  crypto_oppose_total?: number;
  ai_oppose_total?: number;
  support: OutsideSpendingRow[];
  oppose: OutsideSpendingRow[];
};

export type CandidateSummary = {
  common_name: string;
  oppose_total: number;
  support_total: number;
  crypto_support_total?: number;
  ai_support_total?: number;
  crypto_oppose_total?: number;
  ai_oppose_total?: number;
  races: RaceType[];
  // Win/loss is derived from per-race `RaceCandidate.won` (see isDefeated /
  // getMostRecentRaceResult in utils/races), not stored on the summary — the
  // backend's summary-level defeated/won flags lag manual race edits.
  withdrew?: boolean;
  withdrew_race?: RaceType;
  died?: boolean;
  declined?: boolean;
  declinedReason?: string;

  FEC_name: string;
  candidate_id?: string;
  incumbent_challenge?: string;
  party?: Party;

  expenditure_races?: RaceType[];
  expenditure_committees?: string[];

  raised_total?: number;
  spent_total?: number;
  // Receipts by FEC filing period (coverage end date), from the candidate's
  // principal campaign committees. Used to show raised_total as of an earlier
  // date.
  raised_reports?: { date: string; receipts: number }[];

  outside_spending?: OutsideSpending;
  opposition_details?: OppositionConstant;
  has_non_pac_support?: boolean;
} & Pick<Candidate, "candidate_id" | "incumbent_challenge" | "party">;

export interface Race {
  candidates: RaceCandidate[];
  type: RaceType;
  party?: Party;
  date: string;
  canceled?: boolean;
}

type SubraceSpending = {
  candidates: {
    [candidate: string]: {
      support: number;
      oppose: number;
    };
  };
  total: number;
};

export type RaceSpending = {
  subraces: {
    [subrace: string]: {
      candidates: {
        [candidate: string]: {
          support: number;
          oppose: number;
        };
      };
      total: number;
    };
  };
  total: number;
};

export interface ElectionGroup {
  races: Race[]; // Final reviewed/merged races
  manualRaces?: Race[]; // Races added via admin UI
  scrapedRaces?: Race[]; // Races from Python scraper
  lastReviewed?: number; // Timestamp when races were last reviewed
  dataSource?: "manual" | "scraped" | "merged"; // Which source the reviewed races came from
  manualRacesUpdated?: number; // Timestamp when manualRaces were last updated
  createdManually?: boolean; // Race group was created in the admin UI, not by the pipeline
  scrapedRacesUpdated?: number; // Timestamp when scrapedRaces were last updated
  candidates: Record<string, CandidateSummary>;
  spending: Record<string, RaceSpending>;
  year: string;
}

export interface ElectionsByState {
  [raceId: string]: ElectionGroup;
}

// A committee's support/oppose amounts toward one candidate within a race.
export type RaceInsightCandidate = {
  candidate: string;
  support: number;
  oppose: number;
};

export type RaceInsightCommittee = {
  id: string;
  name: string;
  sector: BESector;
  total: number;
  support_total: number;
  oppose_total: number;
  candidates: RaceInsightCandidate[];
};

// A reference to a committee taking a position on a candidate, with the amount.
export type RaceInsightPositionCommittee = {
  id: string;
  name: string;
  sector: BESector;
  amount: number;
};

// Per-candidate view of which PACs are supporting vs. opposing them.
export type RaceInsightPosition = {
  candidate: string;
  support_total: number;
  oppose_total: number;
  supporting_committees: RaceInsightPositionCommittee[];
  opposing_committees: RaceInsightPositionCommittee[];
  contested: boolean;
};

export type AdversarialReason = "contested_candidate" | "rival_candidates";

export type RaceInsight = {
  race_id: string;
  total: number;
  crypto_total: number;
  ai_total: number;
  pac_count: number;
  is_cross_sector: boolean;
  is_multi_pac: boolean;
  is_adversarial: boolean;
  adversarial_reasons: AdversarialReason[];
  is_coordinated: boolean;
  candidate_positions: RaceInsightPosition[];
  committees: RaceInsightCommittee[];
};

export interface OppositionConstant {
  benefitsCandidate?: string;
  benefitsParty?: string;
  supportedBeneficiary?: boolean;
}
