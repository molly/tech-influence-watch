import { IndividualOrCompanyContributionGroup } from "./Contributions";
import { IndividualConstant } from "./Individuals";
import { BESector } from "./Sector";

export enum CompanyCategory {
  advocacy = "advocacy",
  capital = "capital",
  crypto = "crypto",
  ai = "ai",
  tech = "tech",
}

export interface CompanyConstant {
  name: string;
  os_id: string;
  id: string;
  description: TrustedHTML;
  country?: string;
  aliases?: string[];
  category: CompanyCategory[];
  sector?: BESector;
}

export interface CompanyOpenSecrets {
  cycle: string;
  dems: string;
  gave_to_527: string;
  gave_to_cand: string;
  gave_to_pac: string;
  gave_to_party: string;
  indivs: string;
  lobbying: string;
  mems_invested: string;
  orgid: string;
  orgname: string;
  outside: string;
  pacs: string;
  repubs: string;
  soft: string;
  source: string;
  tot527: string;
  total: string;
}

export type Company = CompanyConstant & {
  openSecrets: CompanyOpenSecrets;
  relatedIndividuals: IndividualConstant[];
  contributions: IndividualOrCompanyContributionGroup[];
  party_summary: Record<string, number>;
};

export type CompanyTotalByCompany = {
  by_party: Record<string, number>;
  total: number;
};

export type CompanyTotals = {
  total: number;
  by_party: Record<string, number>;
  by_company: Record<string, CompanyTotalByCompany>;
};

export type AllCompanyTotals = {
  all: CompanyTotals;
  crypto: CompanyTotals;
  ai: CompanyTotals;
};
