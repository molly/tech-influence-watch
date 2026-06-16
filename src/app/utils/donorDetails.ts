import { Contribution } from "../types/Contributions";
import {
  titlecase,
  titlecaseCompany,
  titlecaseLastFirst,
  titlecaseOccupation,
  titlecaseSuffix,
} from "./titlecase";

export type DonorType = IndividualDonorType | CompanyDonorType;

export type IndividualDonorType = {
  name: string;
  company?: string;
  companyAlias?: string;
  occupation?: string;
  isIndividual: true;
};

type CompanyDonorType = {
  company?: string;
  companyAlias?: string;
  entityType?: string | undefined;
  isIndividual: false;
};

function getClaimedDonorName(donor: Contribution): IndividualDonorType {
  return {
    name: donor.contributor_name
      ? titlecaseLastFirst(donor.contributor_name)
      : "",
    occupation: donor.contributor_occupation
      ? titlecaseOccupation(donor.contributor_occupation)
      : undefined,
    isIndividual: true,
  };
}

function getIndividualDonorName(donor: Contribution): IndividualDonorType {
  let occupation;
  let name = [
    donor.contributor_first_name,
    donor.contributor_middle_name,
    donor.contributor_last_name,
  ]
    .filter((x) => !!x && x.toUpperCase() !== "N/A")
    .map((x) => titlecase(x as string))
    .join(" ");
  if (donor.contributor_suffix) {
    name += `, ${titlecaseSuffix(donor.contributor_suffix)}`;
  }
  if (donor.contributor_occupation) {
    occupation = titlecaseOccupation(donor.contributor_occupation);
  }
  return { name, occupation, isIndividual: true };
}

function getDonorCompanyDetails(
  donor: Contribution,
  COMPANY_ALIASES: Record<string, string>,
  INDIVIDUAL_EMPLOYERS: string[],
  isIndividual: boolean,
): {
  company: string | undefined;
  companyAlias: string | undefined;
  entityType: string | undefined;
} {
  let result: {
    company: string | undefined;
    companyAlias: string | undefined;
    entityType: string | undefined;
  } = {
    company: undefined,
    companyAlias: undefined,
    entityType: donor.entity_type || undefined,
  };
  let company;
  if (donor.contributor_employer && donor.contributor_employer !== "N/A") {
    company = donor.contributor_employer;
  } else if (
    !isIndividual &&
    donor.contributor_name &&
    donor.contributor_name.toUpperCase() !== "N/A"
  ) {
    company = donor.contributor_name;
  }
  if (company && !INDIVIDUAL_EMPLOYERS.includes(company)) {
    result.company = titlecaseCompany(company);
    if (company in COMPANY_ALIASES) {
      result.companyAlias = COMPANY_ALIASES[company];
    }
  }
  return result;
}

export function getDonorDetails(
  donor: Contribution,
  COMPANY_ALIASES: Record<string, string> = {},
  INDIVIDUAL_EMPLOYERS: string[] = [],
): IndividualDonorType | CompanyDonorType {
  // COM/PAC/ORG entities are organizations, never individuals. Classify them as
  // companies regardless of alias membership so their names render through
  // titlecaseCompany. The FEC sometimes duplicates the org name into
  // contributor_last_name, which would otherwise route them through the
  // individual-name path (and plain titlecase).
  if (new Set(["COM", "PAC", "ORG"]).has(donor.entity_type || "")) {
    return {
      ...getDonorCompanyDetails(
        donor,
        COMPANY_ALIASES,
        INDIVIDUAL_EMPLOYERS,
        false,
      ),
      isIndividual: false,
    };
  }
  const hasRealFirstName =
    !!donor.contributor_first_name &&
    donor.contributor_first_name.toUpperCase() !== "N/A";
  const hasRealLastName =
    !!donor.contributor_last_name &&
    donor.contributor_last_name.toUpperCase() !== "N/A";
  if (hasRealFirstName || hasRealLastName) {
    return {
      ...getIndividualDonorName(donor),
      ...getDonorCompanyDetails(
        donor,
        COMPANY_ALIASES,
        INDIVIDUAL_EMPLOYERS,
        true,
      ),
      isIndividual: true,
    };
  } else if (donor.claimed) {
    return {
      ...getClaimedDonorName(donor),
      ...getDonorCompanyDetails(
        donor,
        COMPANY_ALIASES,
        INDIVIDUAL_EMPLOYERS,
        true,
      ),
      isIndividual: true,
    };
  } else if (donor.contributor_name) {
    return {
      ...getDonorCompanyDetails(
        donor,
        COMPANY_ALIASES,
        INDIVIDUAL_EMPLOYERS,
        false,
      ),
      isIndividual: false,
    };
  }
  return { company: "", isIndividual: false };
}
