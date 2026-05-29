import { AllCommitteesSummary } from "./Committee";
import {
  IndividualOrCompanyContribution,
  RecipientCandidateDetails,
} from "./Contributions";
import { BESector } from "./Sector";

export type BeneficiaryCommitteeRef = {
  name: string;
  committee_type_full?: string | null;
};

export type BeneficiaryContribution = {
  total: number;
  oldest: string;
  newest: string;
  committees: BeneficiaryCommitteeRef[];
  individual_employer?: string;
} & Pick<
  IndividualOrCompanyContribution,
  "individual" | "contributor_name" | "contributor_occupation" | "isIndividual"
>;

export type CompanyContributionGroup = {
  company_id: string;
  company_name: string;
  individual_id?: string;
  sector?: BESector;
  total: number;
  contributions: BeneficiaryContribution[];
};

export type BeneficiaryCommittee = { designation_full?: string; party?: string } & Pick<
  AllCommitteesSummary,
  "committee_type_full" | "description" | "committee_name" | "committee_id"
>;

export interface CommitteeBeneficiary {
  contributions: CompanyContributionGroup[];
  total: number;
  type: "committee";
  committee_details?: BeneficiaryCommittee;
  by_committee?: Record<string, number>;
}

export interface CandidateBeneficiary {
  contributions: CompanyContributionGroup[];
  total: number;
  type: "candidate";
  committee_details?: BeneficiaryCommittee;
  candidate_details: RecipientCandidateDetails & {
    isRunningThisCycle: boolean;
  };
  by_committee?: Record<string, number>;
}

export type Beneficiary = CommitteeBeneficiary | CandidateBeneficiary;
