import { cache } from "react";

import { fetchConstant, fetchTrumpBeneficiaries } from "@/app/actions/fetch";
import { TRUMP_CANDIDATE_ID, TRUMP_COMMITTEE_TYPES } from "@/app/data/trump";
import curated from "@/app/data/trumpLargeDonors2024.json";
import {
  type Beneficiary,
  type CompanyContributionGroup,
} from "@/app/types/Beneficiaries";
import { ErrorType, isError } from "@/app/utils/errors";

export interface CuratedContribution {
  amount: number;
  date: string;
  committee_id: string;
  committee_name: string;
  source: string;
  note: string | null;
  donor: string;
}

interface CuratedDonor {
  id: string | null;
  label: string;
  sector: string | null;
  total: number;
  donor_names: string[];
  contributions: CuratedContribution[];
}

interface CuratedData {
  grand_total: number;
  donor_count: number;
  committee_names: Record<string, string>;
  donors: CuratedDonor[];
}

export interface CombinedDonor {
  id?: string;
  name: string;
  total: number;
  tracked: boolean;
  isIndividual: boolean;
  sector?: string | null;
  contributions: CuratedContribution[];
}

export interface CommitteeRow {
  id: string;
  name: string;
  total: number;
  description: string;
  pacType: string;
}

export interface TrumpCombinedDonorsData {
  donors: CombinedDonor[];
  grandTotal: number;
  committeeRows: CommitteeRow[];
  allContributions: CuratedContribution[];
  committeeNames: Record<string, string>;
}

const curatedData = curated as CuratedData;

// Fallback merge key for UNTRACKED curated donors (no id): collapse trivial name variants.
function nameKey(name: string) {
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, " ")
    .replace(/\b(INC|LLC|LP|CORP|CORPORATION|CO|COMPANY|THE)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const getTrumpCombinedDonors = cache(
  async (): Promise<TrumpCombinedDonorsData | ErrorType> => {
    const [trumpData, individualsConstant, committeeDescriptions] =
      await Promise.all([
        fetchTrumpBeneficiaries(),
        fetchConstant<Record<string, unknown>>("individuals"),
        fetchConstant<Record<string, string>>("allCommittees"),
      ]);
    if (isError(trumpData)) {
      return trumpData as ErrorType;
    }
    const { beneficiaries, committeeNames: liveCommitteeNames } = trumpData as {
      beneficiaries: Record<string, Beneficiary>;
      grandTotal: number;
      committeeNames: Record<string, string>;
    };
    const individualIds = new Set(Object.keys(individualsConstant ?? {}));

    // Keyed by tracked entity id (company_id, which == individual_id for tracked individuals) for
    // live + tracked-curated donors; by `name:<nameKey>` for untracked curated donors (no id).
    const combined = new Map<string, CombinedDonor>();

    // 1. Live donors (tracked crypto/AI, 2026 cycle), aggregated by entity id.
    for (const beneficiary of Object.values(beneficiaries)) {
      for (const group of beneficiary.contributions as CompanyContributionGroup[]) {
        const id = group.company_id;
        const existing = combined.get(id);
        if (existing) {
          existing.total += group.total;
        } else {
          combined.set(id, {
            id,
            name: group.company_name,
            total: group.total,
            tracked: true,
            isIndividual: Boolean(group.individual_id),
            sector: group.sector,
            contributions: [],
          });
        }
      }
    }

    // A curated contribution duplicates the live tracker only if it is Schedule A, in the live
    // (2026) cycle, AND to a committee the live data actually has. The live data is candidate-
    // aggregated (most gifts sit under the P80001571 doc with a by_committee breakdown; individual
    // committees like MAGA Inc have no top-level doc), so the set of covered committees is the union
    // of every beneficiary's by_committee keys plus any committee that has its own doc. America PAC
    // has no live data at all, so it's absent here and its gifts are never dropped.
    const liveCommitteeIds = new Set<string>();
    for (const id of Object.keys(beneficiaries)) {
      if (id !== TRUMP_CANDIDATE_ID) {
        liveCommitteeIds.add(id);
      }
    }
    for (const b of Object.values(beneficiaries)) {
      for (const cid of Object.keys(b.by_committee ?? {})) {
        liveCommitteeIds.add(cid);
      }
    }
    const isLiveDupe = (c: CuratedContribution) =>
      c.source === "schedule_a" &&
      (c.date ?? "") >= "2025-01-01" &&
      liveCommitteeIds.has(c.committee_id);

    // 2. Curated donors. Tracked donors carry an `id`: if it matches a live entry, their overlapping
    //    2025-26 gifts are dropped and the rest added; otherwise they're added as their own tracked
    //    (linkable) row. Donors with no id are untracked (no link, "not tracked" badge).
    for (const donor of curatedData.donors) {
      const id = (donor.id ?? "").trim();
      const liveMatch = id ? combined.get(id) : undefined;
      if (liveMatch) {
        const extra = donor.contributions.filter((c) => !isLiveDupe(c));
        liveMatch.total += extra.reduce((sum, c) => sum + c.amount, 0);
        liveMatch.contributions.push(...extra);
        if (!liveMatch.sector) {
          liveMatch.sector = donor.sector;
        }
        continue;
      }
      const key = id || `name:${nameKey(donor.label)}`;
      const existing = combined.get(key);
      if (existing) {
        existing.total += donor.total;
        existing.contributions.push(...donor.contributions);
      } else {
        combined.set(key, {
          id: id || undefined,
          name: donor.label,
          total: donor.total,
          tracked: Boolean(id),
          isIndividual: id ? individualIds.has(id) : false,
          sector: donor.sector,
          contributions: [...donor.contributions],
        });
      }
    }

    const donors = [...combined.values()].sort((a, b) => b.total - a.total);
    const grandTotal = donors.reduce((sum, d) => sum + d.total, 0);

    // By committee: live tracked totals + curated contributions, summed per recipient committee.
    const byCommittee = new Map<string, number>();
    const trumpBeneficiary = beneficiaries[TRUMP_CANDIDATE_ID];
    if (trumpBeneficiary?.by_committee) {
      for (const [id, total] of Object.entries(trumpBeneficiary.by_committee)) {
        byCommittee.set(id, (byCommittee.get(id) ?? 0) + total);
      }
    }
    const allContributions: CuratedContribution[] = [];
    for (const donor of donors) {
      for (const c of donor.contributions) {
        byCommittee.set(c.committee_id, (byCommittee.get(c.committee_id) ?? 0) + c.amount);
        allContributions.push(c);
      }
    }
    const committeeName = (id: string) =>
      curatedData.committee_names[id] ?? liveCommitteeNames[id] ?? id;
    const committeeRows = [...byCommittee.entries()]
      .map(([id, total]) => ({
        id,
        name: committeeName(id),
        total,
        description: committeeDescriptions?.[id] ?? "",
        pacType: TRUMP_COMMITTEE_TYPES[id] ?? "",
      }))
      .sort((a, b) => b.total - a.total);
    allContributions.sort((a, b) => b.amount - a.amount);

    return {
      donors,
      grandTotal,
      committeeRows,
      allContributions,
      committeeNames: { ...liveCommitteeNames, ...curatedData.committee_names },
    };
  },
);
