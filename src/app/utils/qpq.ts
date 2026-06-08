import { fetchBeneficiaries, fetchConstant } from "@/app/actions/fetch";
import {
  type Beneficiary,
  type CompanyContributionGroup,
} from "@/app/types/Beneficiaries";
import { QPQ } from "@/app/types/Qpq";
import { type ErrorType, isError } from "@/app/utils/errors";
import {
  getTrumpCombinedDonors,
  type TrumpCombinedDonorsData,
} from "@/app/utils/trumpCombinedDonors";

const companyIdAliases: Record<string, string> = {
  "winklevoss-capital-management": "gemini",
};

export function resolveCompanyId(id: string): string {
  return companyIdAliases[id] ?? id;
}

// Normalizes a display name into a merge key, matching the convention used for untracked donors in
// trumpCombinedDonors so a quid pro quo entry with no company page can still be matched to its
// untracked 2024 curated donor by name (e.g. ConsenSys, Yuga Labs).
function nameKey(name: string): string {
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, " ")
    .replace(/\b(INC|LLC|LP|CORP|CORPORATION|CO|COMPANY|THE)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getQpqCompanyId(entry: QPQ): string | null {
  if (!entry.link) {
    return null;
  }
  const match = entry.link.match(/^\/2026\/companies\/(.+)$/);
  return match ? match[1] : null;
}

export interface QpqContribMaps {
  trump: Map<string, number>;
  // Trump totals for untracked donors (no entity id / company page), keyed by normalized name.
  trumpByName: Map<string, number>;
  crypto: Map<string, number>;
  senate: Map<string, number>;
  house: Map<string, number>;
}

// Builds the FEC contribution totals shown alongside each tracked entity, keyed by company id.
// Trump-and-family totals come from the Trump contributions tracker's combined donor figures
// (live 2026 cycle + curated 2024 campaign/inauguration/PAC gifts) so the quid pro quo views match
// the per-donor totals there. Crypto/Senate/House super PAC totals come from the live beneficiaries.
export async function getQpqContribMaps(): Promise<QpqContribMaps | ErrorType> {
  const [
    beneficiariesResult,
    combinedDonors,
    committeesConstant,
    senateConstant,
    houseConstant,
  ] = await Promise.all([
    fetchBeneficiaries(),
    getTrumpCombinedDonors(),
    fetchConstant<Record<string, { id: string; name: string }>>("committees"),
    fetchConstant<{ ids: string[] }>("senateCommittees"),
    fetchConstant<{ ids: string[] }>("houseCommittees"),
  ]);

  if (isError(beneficiariesResult)) {
    return beneficiariesResult as ErrorType;
  }

  const cryptoCommitteeIds = new Set(
    committeesConstant ? Object.keys(committeesConstant) : [],
  );
  const senateCommitteeIds = new Set(senateConstant?.ids ?? []);
  const houseCommitteeIds = new Set(houseConstant?.ids ?? []);

  const beneficiaries = beneficiariesResult as Record<string, Beneficiary>;
  const trump = new Map<string, number>();
  const trumpByName = new Map<string, number>();
  const crypto = new Map<string, number>();
  const senate = new Map<string, number>();
  const house = new Map<string, number>();

  if (!isError(combinedDonors)) {
    for (const donor of (combinedDonors as TrumpCombinedDonorsData).donors) {
      if (donor.id) {
        const companyId = resolveCompanyId(donor.id);
        trump.set(companyId, (trump.get(companyId) || 0) + donor.total);
      } else {
        const key = nameKey(donor.name);
        trumpByName.set(key, (trumpByName.get(key) || 0) + donor.total);
      }
    }
  }

  for (const [id, beneficiary] of Object.entries(beneficiaries)) {
    const targetMap = cryptoCommitteeIds.has(id)
      ? crypto
      : senateCommitteeIds.has(id)
        ? senate
        : houseCommitteeIds.has(id)
          ? house
          : null;

    if (targetMap) {
      for (const group of beneficiary.contributions as CompanyContributionGroup[]) {
        const companyId = resolveCompanyId(group.company_id);
        targetMap.set(companyId, (targetMap.get(companyId) || 0) + group.total);
      }
    }
  }

  return { trump, trumpByName, crypto, senate, house };
}

// The Trump-and-family total matched to a quid pro quo entry: by company id when it has a company
// page, otherwise by normalized name so untracked entries still merge with their 2024 curated donor.
export function getQpqTrumpTotal(entry: QPQ, maps: QpqContribMaps): number {
  const companyId = getQpqCompanyId(entry);
  if (companyId !== null) {
    return maps.trump.get(companyId) ?? 0;
  }
  return maps.trumpByName.get(nameKey(entry.name)) ?? 0;
}

export function getQpqManualAmount(entry: QPQ): number {
  if (!("contributions" in entry) || !entry.contributions) {
    return 0;
  }
  return entry.contributions.reduce(
    (acc, curr) => acc + ("amount" in curr ? curr.amount || 0 : 0),
    0,
  );
}

// The combined "to Trump & family" total for one entity: its manually tracked contributions plus
// the FEC totals matched to its company id.
export function getQpqEntryTotal(entry: QPQ, maps: QpqContribMaps): number {
  const manualAmount = getQpqManualAmount(entry);
  const trumpTotal = getQpqTrumpTotal(entry, maps);
  const companyId = getQpqCompanyId(entry);
  if (companyId === null) {
    return manualAmount + trumpTotal;
  }
  return (
    manualAmount +
    trumpTotal +
    (maps.crypto.get(companyId) ?? 0) +
    (maps.senate.get(companyId) ?? 0) +
    (maps.house.get(companyId) ?? 0)
  );
}

export function getQpqGrandTotal(entries: QPQ[], maps: QpqContribMaps): number {
  return entries.reduce((sum, entry) => sum + getQpqEntryTotal(entry, maps), 0);
}
