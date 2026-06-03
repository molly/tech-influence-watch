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

// A publicly-reported contribution RECEIVED by this org. Used for dark-money
// groups (501(c)(4)s) that don't disclose donors in FEC filings but whose
// funding has surfaced through reporting. Hand-curated in the company constant;
// always shown with a "reported" treatment and a source citation.
export interface KnownDonor {
  // Display name of the donor, e.g. "Anthropic"
  name: string;
  // Slug of the donor if it's a tracked company/individual, for linking
  id?: string;
  // Whether `id` points at a company or an individual page (defaults company)
  idType?: "company" | "individual";
  amount: number;
  // ISO date of the gift, when known
  date?: string;
  // Short citation label for where this was reported, e.g. "The New York Times"
  source?: string;
  // URL backing the citation
  sourceUrl?: string;
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
  // Tax-exempt classification, e.g. "501(c)(4)", "501(c)(3)"
  type?: string;
  // Name of the PAC network this org is affiliated with; matches the `key`
  // of a NetworkConstant in data/networks.ts
  network?: string;
  // Position within its network: "parent" (lead org), or the "dem"/"rep" arm
  role?: "parent" | "dem" | "rep";
  // Publicly-reported donors to this org (for non-disclosing dark-money groups)
  knownDonors?: KnownDonor[];
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
  // Portion of `total` that went to committees the site tracks
  // (recipients present in constants/committees).
  to_tracked: number;
};

export type CompanyTotals = {
  total: number;
  // Portion of `total` that went to committees the site tracks
  // (recipients present in constants/committees).
  to_tracked: number;
  by_party: Record<string, number>;
  by_company: Record<string, CompanyTotalByCompany>;
};

export type AllCompanyTotals = {
  all: CompanyTotals;
  crypto: CompanyTotals;
  ai: CompanyTotals;
};
