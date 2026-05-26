import { CompanyConstant } from "./Companies";
import {
  IndividualOrCompanyContribution,
  IndividualOrCompanyContributionGroup,
} from "./Contributions";
import { BESector } from "./Sector";

export interface IndividualConstant {
  name: string;
  id: string;
  company?: string[];
  title?: string;
  photoCredit?: string;
  sector?: import("./Sector").BESector;
}

export type IndividualListData = IndividualConstant & {
  total: number;
  companyDetails: CompanyConstant[];
  allSectors: BESector[];
};

export type IndividualTotalByIndividual = {
  by_party: Record<string, number>;
  total: number;
};

export type IndividualTotals = {
  total: number;
  by_party: Record<string, number>;
  by_individual: Record<string, IndividualTotalByIndividual>;
};

export type IndividualContributions = {
  associatedCompany: string[];
  party_summary: Record<string, number>;
  contributions: IndividualOrCompanyContributionGroup[];
  contributions_by_date?: IndividualOrCompanyContribution[];
};
