import { ExpendituresByPartySnapshot } from "./Expenditures";
import { CommitteeDetail, CommitteeTotals, ScheduleB } from "./FECTypes";
import { BESector } from "./Sector";

export type CommitteeConstant = {
  id: string;
  name: string;
  description?: TrustedHTML;
  claimedCommitted?: number;
  network?: string;
  // Position within its network: "parent" (lead org), or the "dem"/"rep" arm
  role?: "parent" | "dem" | "rep";
  sector?: BESector;
};

export type CommitteeConstantWithContributions = CommitteeConstant & {
  total_contributed: number;
  total_transferred: number;
  last_cash_on_hand_end_period: number;
  total: number;
  committee_type?: string | null;
  designation?: string | null;
  organization_type?: string | null;
  independent_expenditures?: number | null;
};

export type CommitteeDisbursement = Pick<
  ScheduleB,
  "disbursement_amount" | "disbursement_date" | "pdf_url" | "recipient_name"
>;

export type CommitteeDisbursementGroup = {
  disbursements: CommitteeDisbursement[];
  total: number;
  recipient_name: string;
};

export type DisbursementsByCommittee = {
  [committee_id: string]: CommitteeDisbursementGroup;
};

export type CommitteeDetails = CommitteeConstant & {
  by_party?: ExpendituresByPartySnapshot;
  disbursements_by_committee: DisbursementsByCommittee;
  transfers_by_party?: Record<string, number>;
} & Pick<
    CommitteeDetail,
    | "affiliated_committee_name"
    | "candidate_ids"
    | "committee_type"
    | "committee_type_full"
    | "cycles"
    | "designation"
    | "designation_full"
    | "first_f1_date"
    | "leadership_pac"
    | "name"
    | "organization_type"
    | "organization_type_full"
    | "party"
    | "party_full"
    | "party_type"
    | "party_type_full"
    | "sponsor_candidate_ids"
    | "website"
  > &
  Pick<
    CommitteeTotals,
    | "contributions"
    | "contribution_refunds"
    | "disbursements"
    | "last_cash_on_hand_end_period"
    | "net_contributions"
    | "receipts"
    | "independent_expenditures"
  >;

export type AllCommitteesSummary = {
  is_tracked: boolean;
  sector: BESector | null;
  description?: string;
} & Pick<
  CommitteeTotals,
  | "committee_id"
  | "committee_name"
  | "committee_type"
  | "committee_type_full"
  | "committee_designation"
  | "committee_designation_full"
  | "receipts"
  | "disbursements"
  | "independent_expenditures"
  | "last_cash_on_hand_end_period"
>;

export type CommitteeTotalsSnapshot = {
  cash_on_hand: number;
  claimed_committed: number;
  disbursements: number;
  expenditures: number;
  receipts: number;
  net_receipts?: number;
};

export type TotalsForCommittees = {
  all: CommitteeTotalsSnapshot;
  crypto: CommitteeTotalsSnapshot;
  ai: CommitteeTotalsSnapshot;
};

export type TransferEdge = {
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  amount: number;
};

export type SpendingCategory = "superPac" | "party" | "candidate";
