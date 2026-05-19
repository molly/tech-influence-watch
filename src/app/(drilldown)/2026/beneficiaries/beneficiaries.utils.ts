import COMMITTEES from "@/app/data/committees";
import { SINGLE_MEMBER_STATES, STATES_BY_ABBR } from "@/app/data/states";
import { Beneficiary, CandidateBeneficiary } from "@/app/types/Beneficiaries";
import { getPartyAbbreviation } from "@/app/utils/party";
import { getRaceName } from "@/app/utils/races";
import { titlecaseCommittee, titlecaseLastFirst } from "@/app/utils/titlecase";
import styles from "./beneficiaries.module.css";

export type DisplayType = "candidate" | "pac" | "party";

export function getDisplayType(beneficiary: Beneficiary): DisplayType {
  if (beneficiary.type === "candidate") {
    return "candidate";
  }
  const typeFull =
    beneficiary.committee_details?.committee_type_full?.toLowerCase() ?? "";
  if (typeFull.includes("party")) {
    return "party";
  }
  return "pac";
}

export function getDisplayName(id: string, beneficiary: Beneficiary): string {
  if (beneficiary.type === "candidate") {
    return titlecaseLastFirst(beneficiary.candidate_details?.name ?? id);
  }
  return beneficiary.committee_details?.committee_name
    ? titlecaseCommittee(beneficiary.committee_details.committee_name)
    : id;
}

export function getPartyCode(beneficiary: Beneficiary): string {
  if (beneficiary.type === "candidate") {
    return beneficiary.candidate_details.party ?? "";
  }
  return beneficiary.committee_details?.party ?? "";
}

export function getPartyBorderClass(
  partyCode: string,
  prefix = "partyBorder",
): string {
  const className = `${prefix}${getPartyAbbreviation(partyCode)}`;
  if (className in styles) {
    return styles[className as keyof typeof styles];
  }
  const fallback = `${prefix}Unk`;
  return fallback in styles ? styles[fallback as keyof typeof styles] : "";
}

export function getCandidateDescription(
  beneficiary: CandidateBeneficiary,
): string {
  const { state, office, district, isRunningThisCycle, name } =
    beneficiary.candidate_details;
  let raceId = `${office}`;
  if (office === "H" && !SINGLE_MEMBER_STATES.includes(state)) {
    raceId += `-${district}`;
  }
  if (!isRunningThisCycle) {
    if (office === "P") {
      return name.toUpperCase().includes("TRUMP")
        ? "President"
        : "ran for President";
    }
    return `${STATES_BY_ABBR[state]} ${getRaceName(raceId)}`;
  }
  if (office === "P") {
    return "candidate for President";
  }
  return `candidate for ${STATES_BY_ABBR[state]} ${getRaceName(raceId)}`;
}

export function getDescription(beneficiary: Beneficiary): string {
  if (beneficiary.type === "candidate") {
    return getCandidateDescription(beneficiary);
  }
  if (beneficiary.committee_details?.description) {
    return beneficiary.committee_details.description as string;
  }
  return "";
}

export function isCryptoTracked(id: string, beneficiary: Beneficiary): boolean {
  if (id in COMMITTEES) {
    return true;
  }
  if (beneficiary.by_committee) {
    return Object.keys(beneficiary.by_committee).some(
      (cId) => cId in COMMITTEES,
    );
  }
  return false;
}

export function getNewestDate(beneficiary: Beneficiary): string {
  let newest = "";
  for (const group of beneficiary.contributions) {
    for (const contrib of group.contributions) {
      if (contrib.newest > newest) {
        newest = contrib.newest;
      }
    }
  }
  return newest;
}

export function findTopByType(
  order: string[],
  beneficiaries: Record<string, Beneficiary>,
  displayType: DisplayType,
): { id: string; beneficiary: Beneficiary } | null {
  for (const id of order) {
    const b = beneficiaries[id];
    if (b && getDisplayType(b) === displayType) {
      return { id, beneficiary: b };
    }
  }
  return null;
}

export function applySort(
  order: string[],
  beneficiaries: Record<string, Beneficiary>,
  sort: string,
): string[] {
  if (sort === "name") {
    return [...order].sort((a, b) => {
      const bA = beneficiaries[a];
      const bB = beneficiaries[b];
      if (!bA) {
        return 1;
      }
      if (!bB) {
        return -1;
      }
      const nameA = getDisplayName(a, bA).toLowerCase();
      const nameB = getDisplayName(b, bB).toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }
  if (sort === "recent") {
    return [...order].sort((a, b) => {
      const bA = beneficiaries[a];
      const bB = beneficiaries[b];
      if (!bA) {
        return 1;
      }
      if (!bB) {
        return -1;
      }
      const dateA = getNewestDate(bA);
      const dateB = getNewestDate(bB);
      return dateB.localeCompare(dateA);
    });
  }
  return order;
}

export function applyTypeFilter(
  order: string[],
  beneficiaries: Record<string, Beneficiary>,
  type: string,
): string[] {
  if (type === "candidates") {
    return order.filter(
      (id) => getDisplayType(beneficiaries[id]) === "candidate",
    );
  }
  if (type === "pacs") {
    return order.filter((id) => getDisplayType(beneficiaries[id]) === "pac");
  }
  if (type === "party") {
    return order.filter((id) => getDisplayType(beneficiaries[id]) === "party");
  }
  return order;
}

export function formatCardAmount(total: number): {
  number: string;
  unit: string;
} {
  if (total >= 1_000_000_000) {
    return {
      number: `$${parseFloat((total / 1_000_000_000).toPrecision(3))}`,
      unit: "B",
    };
  }
  if (total >= 1_000_000) {
    return {
      number: `$${parseFloat((total / 1_000_000).toPrecision(3))}`,
      unit: "M",
    };
  }
  if (total >= 1_000) {
    return {
      number: `$${parseFloat((total / 1_000).toPrecision(3))}`,
      unit: "K",
    };
  }
  return { number: `$${total}`, unit: "" };
}

export function getCompactRace(
  details: CandidateBeneficiary["candidate_details"],
): string {
  const { state, office, district } = details;
  if (office === "P") {
    return "President";
  }
  if (office === "S") {
    return `${state} · Senate`;
  }
  if (SINGLE_MEMBER_STATES.includes(state)) {
    return `${state} · House`;
  }
  return `${state}-${district} · House`;
}

export type TypeBreakdown = Record<DisplayType, number>;

export function getTypeBreakdown(
  order: string[],
  beneficiaries: Record<string, Beneficiary>,
): TypeBreakdown {
  const result: TypeBreakdown = { candidate: 0, pac: 0, party: 0 };
  for (const id of order) {
    const b = beneficiaries[id];
    if (b) {
      result[getDisplayType(b)] += b.total;
    }
  }
  return result;
}

export type OfficeBreakdownEntry = { total: number; count: number };

export function getOfficeBreakdown(
  order: string[],
  beneficiaries: Record<string, Beneficiary>,
): Record<string, OfficeBreakdownEntry> {
  const result: Record<string, OfficeBreakdownEntry> = {};
  for (const id of order) {
    const b = beneficiaries[id];
    if (b?.type === "candidate" && b.candidate_details) {
      const office = b.candidate_details.office;
      if (!result[office]) {
        result[office] = { total: 0, count: 0 };
      }
      result[office].total += b.total;
      result[office].count += 1;
    }
  }
  return result;
}

export function getTopCandidates(
  order: string[],
  beneficiaries: Record<string, Beneficiary>,
  limit = 10,
): Array<{ id: string; beneficiary: CandidateBeneficiary }> {
  return order
    .filter((id) => {
      const b = beneficiaries[id];
      return b?.type === "candidate" && b.candidate_details;
    })
    .slice(0, limit)
    .map((id) => ({
      id,
      beneficiary: beneficiaries[id] as CandidateBeneficiary,
    }));
}
