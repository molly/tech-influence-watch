import {
  fetchAllExpenditures,
  fetchCommitteeDetails,
  fetchCommitteeDonors,
  fetchCommitteesWithContributions,
  fetchConstant,
} from "@/app/actions/fetch";
import { NetworkConstant } from "@/app/data/networks";
import { STATES_BY_ABBR } from "@/app/data/states";
import type {
  CommitteeConstantWithContributions,
  CommitteeDetails,
} from "@/app/types/Committee";
import { CompanyCategory, CompanyConstant } from "@/app/types/Companies";
import type {
  Contribution,
  Contributions,
  ContributionsGroup,
} from "@/app/types/Contributions";
import type {
  Expenditure,
  ExpendituresByPartySnapshot,
} from "@/app/types/Expenditures";
import { getDonorDetails } from "@/app/utils/donorDetails";
import { isError } from "@/app/utils/errors";
import { getRaceName } from "@/app/utils/races";
import {
  titlecaseCompany,
  titlecaseIndividualName,
} from "@/app/utils/titlecase";

export type NetworkRole = "parent" | "dem" | "rep";

export type NetworkMember = CommitteeConstantWithContributions;

export interface NetworkAffiliatedOrgResolved {
  id: string;
  name: string;
  type?: string;
  href?: string;
  role?: NetworkRole;
  // Short network-context blurb, sourced from the company constant's
  // description (or a hardcoded org's own description).
  description?: TrustedHTML;
  // Publicly-reported funding for non-disclosing orgs (sum of knownDonors), with
  // the reporting donor names, when any exist.
  reportedTotal?: number;
  reportedDonors?: string[];
}

// A single contribution within a merged donor's gift history.
export interface DonorGift {
  // Sub-line shown left of the amount, e.g. "Ben Horowitz · Partner · Dec 10, 2025"
  date?: string;
  // Entity/individual label when it differs from the donor group name
  attribution?: string;
  amount: number;
  note?: string;
}

// A donor aggregated across every committee in the network.
export interface MergedDonor {
  key: string;
  name: string;
  href?: string;
  isIndividual: boolean;
  // For individuals/orgs whose role is worth showing in the flat list
  role?: string;
  total: number;
  gifts: DonorGift[];
}

export interface RelatedCompany {
  id: string;
  name: string;
  href: string;
  role?: string;
  total: number;
}

export interface CandidateTarget {
  key: string;
  name: string;
  party: string;
  state: string;
  stateName: string;
  raceId: string;
  raceName: string;
  prefix: "Support" | "Oppose";
  total: number;
  // Names of the member committee(s) responsible for the spending, in network
  // order (lead first).
  committees: string[];
}

export interface NetworkData {
  network: NetworkConstant;
  members: NetworkMember[];
  affiliatedOrgs: NetworkAffiliatedOrgResolved[];
  raised: number;
  spent: number;
  cashOnHand: number;
  byParty: ExpendituresByPartySnapshot | null;
  donors: MergedDonor[];
  donorCount: number;
  relatedCompanies: RelatedCompany[];
  candidates: CandidateTarget[];
  raceCount: number;
  expenditureCount: number;
}

const PARTY_KEYS: (keyof ExpendituresByPartySnapshot)[] = [
  "dem_oppose",
  "dem_support",
  "rep_oppose",
  "rep_support",
  "oppose_benefit_dem",
  "oppose_benefit_rep",
  "oppose_benefit_mix",
  "oppose_benefit_unk",
];

// True if the committee leads its network.
function isParent(committee: NetworkMember): boolean {
  return committee.role === "parent";
}

function sumByParty(
  snapshots: (ExpendituresByPartySnapshot | undefined)[],
): ExpendituresByPartySnapshot | null {
  let hasAny = false;
  const total: ExpendituresByPartySnapshot = {
    dem_oppose: 0,
    dem_support: 0,
    rep_oppose: 0,
    rep_support: 0,
    oppose_benefit_dem: 0,
    oppose_benefit_rep: 0,
    oppose_benefit_mix: 0,
    oppose_benefit_unk: 0,
  };
  for (const snapshot of snapshots) {
    if (!snapshot) {
      continue;
    }
    hasAny = true;
    for (const key of PARTY_KEYS) {
      total[key] += snapshot[key] ?? 0;
    }
  }
  return hasAny ? total : null;
}

// Donor groups that carry no meaningful identity. Mirrors the OMITTED filter
// used on committee pages, and drops the backend's transaction-id fallback
// groups (used when a contributor name resolves to "N/A").
function isOmittedGroup(group: ContributionsGroup): boolean {
  if (!group.company) {
    return true;
  }
  const company = group.company.trim().toUpperCase();
  return company === "OMITTED" || company === "N/A";
}

function contributionAmount(contribution: Contribution): number {
  if (
    "contribution_receipt_amount" in contribution &&
    contribution.contribution_receipt_amount
  ) {
    return contribution.contribution_receipt_amount;
  }
  if (
    "total_receipt_amount" in contribution &&
    contribution.total_receipt_amount
  ) {
    return contribution.total_receipt_amount;
  }
  return 0;
}

const COMPANY_CATEGORY_LABELS: Record<CompanyCategory, string> = {
  [CompanyCategory.crypto]: "Cryptocurrency company",
  [CompanyCategory.ai]: "AI company",
  [CompanyCategory.capital]: "Venture capital firm",
  [CompanyCategory.advocacy]: "Advocacy organization",
  [CompanyCategory.tech]: "Technology company",
};

function companyRole(company: CompanyConstant | undefined): string | undefined {
  if (!company || !company.category?.length) {
    return undefined;
  }
  return COMPANY_CATEGORY_LABELS[company.category[0]];
}

function getExpenditureRaceId(expenditure: Expenditure): string {
  let raceId = expenditure.candidate_office ?? "";
  if (
    expenditure.candidate_office_district &&
    expenditure.candidate_office_district !== "00"
  ) {
    raceId += `-${expenditure.candidate_office_district}`;
  }
  if (
    expenditure.subrace === "special" ||
    (expenditure.election_type && expenditure.election_type[0] === "S")
  ) {
    raceId += "-special";
  }
  return raceId;
}

function getCandidateName(expenditure: Expenditure): string {
  let parts: (string | null | undefined)[];
  if ("candidate_last_name" in expenditure && expenditure.candidate_last_name) {
    const firstName = expenditure.candidate_first_name
      ? expenditure.candidate_first_name.split(" ")[0]
      : "";
    parts = [
      firstName,
      expenditure.candidate_middle_name,
      expenditure.candidate_last_name,
    ];
  } else {
    parts = [expenditure.candidate_first_name, expenditure.candidate_name];
  }
  return parts.filter(Boolean).map(titlecaseIndividualName).join(" ");
}

export async function getNetworkData(
  network: NetworkConstant,
): Promise<NetworkData | null> {
  const [committeesData, companiesData, aliasesData, employersData] =
    await Promise.all([
      fetchCommitteesWithContributions("all"),
      fetchConstant<Record<string, CompanyConstant>>("companies"),
      fetchConstant<Record<string, string>>("companyAliases"),
      fetchConstant<string[]>("individualEmployers"),
    ]);

  if (isError(committeesData)) {
    return null;
  }
  const committees = committeesData as NetworkMember[];
  const companies = companiesData ?? {};
  const aliases = aliasesData ?? {};
  const employers = employersData ?? [];

  const members = committees
    .filter((committee) => committee.network === network.key)
    .sort((a, b) => {
      const aParent = isParent(a);
      const bParent = isParent(b);
      if (aParent !== bParent) {
        return aParent ? -1 : 1;
      }
      return b.total_contributed - a.total_contributed;
    });

  // Affiliated organizations (e.g. dark money 501(c)(4)s) are tracked as
  // companies tagged with the network, merged with any hardcoded orgs.
  const orgsById = new Map<string, NetworkAffiliatedOrgResolved>();
  for (const org of network.affiliatedOrgs ?? []) {
    orgsById.set(org.id, { ...org });
  }
  for (const [id, company] of Object.entries(companies)) {
    if (company.network !== network.key) {
      continue;
    }
    const existing = orgsById.get(id);
    const knownDonors = company.knownDonors ?? [];
    orgsById.set(id, {
      id,
      name: company.name || existing?.name || id,
      type: company.type ?? existing?.type,
      href: `/2026/companies/${id}`,
      role: company.role ?? existing?.role,
      description: company.description || existing?.description,
      reportedTotal: knownDonors.length
        ? knownDonors.reduce((sum, donor) => sum + donor.amount, 0)
        : undefined,
      reportedDonors: knownDonors.length
        ? knownDonors.map((donor) => donor.name)
        : undefined,
    });
  }
  const affiliatedOrgs = Array.from(orgsById.values());

  if (members.length === 0 && affiliatedOrgs.length === 0) {
    return null;
  }

  // Direct contributions only: intra-network transfers would double-count
  // dollars the lead committee already raised and passed to its affiliates.
  const raised = members.reduce((sum, c) => sum + c.total_contributed, 0);
  const spent = members.reduce(
    (sum, c) => sum + (c.independent_expenditures || 0),
    0,
  );
  const cashOnHand = members.reduce(
    (sum, c) => sum + c.last_cash_on_hand_end_period,
    0,
  );

  const memberIds = members.map((member) => member.id);
  // Intra-network transfers (the lead committee funding its arms) surface as
  // contributions; exclude them from the network's donor roll so we don't
  // double-count dollars already attributed to the lead committee's haul.
  // Match members both by committee link and by name: the backend only resolves
  // a transfer's committee link once the recipient committee is tracked, so a
  // transfer processed earlier can arrive here with no link, and we'd otherwise
  // miss it.
  const memberCommitteeHrefs = new Set(
    memberIds.map((id) => `/2026/committees/${id}`),
  );
  const memberCommitteeNames = new Set(
    members.map((member) => member.name.trim().toUpperCase()),
  );

  const [detailResults, donorResults, expendituresData] = await Promise.all([
    Promise.all(memberIds.map((id) => fetchCommitteeDetails(id))),
    Promise.all(memberIds.map((id) => fetchCommitteeDonors(id))),
    fetchAllExpenditures(),
  ]);

  const byParty = sumByParty(
    detailResults.map((result) =>
      isError(result) ? undefined : (result as CommitteeDetails).by_party,
    ),
  );

  // ── Merge donors across every member committee ──────────────────────
  const donorMap = new Map<
    string,
    {
      key: string;
      name: string;
      href?: string;
      isIndividual: boolean;
      role?: string;
      total: number;
      contributions: Contribution[];
    }
  >();

  for (const donorResult of donorResults) {
    if (isError(donorResult)) {
      continue;
    }
    const donors = donorResult as Contributions;
    for (const group of donors.groups ?? []) {
      if (isOmittedGroup(group) || group.total <= 0) {
        continue;
      }
      const href = group.link;
      const companyName = group.company?.trim().toUpperCase();
      if (
        (href && memberCommitteeHrefs.has(href)) ||
        (companyName && memberCommitteeNames.has(companyName))
      ) {
        continue;
      }
      const key = group.link ?? group.company!.trim().toUpperCase();
      const existing = donorMap.get(key);
      if (existing) {
        existing.total += group.total;
        existing.contributions.push(...group.contributions);
        continue;
      }

      const isOrg = !!href && !href.startsWith("/2026/individuals/");
      const isIndividual = href
        ? href.startsWith("/2026/individuals/")
        : group.contributions.every(
            (c) =>
              !!c.contributor_last_name && c.contributor_name === group.company,
          );

      let name = titlecaseCompany(group.company || "");
      let role: string | undefined;
      if (isIndividual && !isOrg) {
        const details = getDonorDetails(
          group.contributions[0],
          aliases,
          employers,
        );
        if (details.isIndividual) {
          if (details.name) {
            name = details.name;
          }
          role = [details.occupation, details.company]
            .filter(Boolean)
            .join(", ");
        }
      }

      donorMap.set(key, {
        key,
        name,
        href,
        isIndividual: isIndividual && !isOrg,
        role: role || undefined,
        total: group.total,
        contributions: [...group.contributions],
      });
    }
  }

  const mergedDonors = Array.from(donorMap.values()).sort(
    (a, b) => b.total - a.total,
  );

  const donors: MergedDonor[] = mergedDonors.map((donor) => {
    const gifts: DonorGift[] = donor.contributions
      .map((contribution) => {
        const amount = contributionAmount(contribution);
        const details = getDonorDetails(contribution, aliases, employers);
        const attributionParts: string[] = [];
        // Show the contributing entity/person when it differs from the donor
        // group (e.g. partners listed under a venture firm).
        if (details.isIndividual) {
          if (details.name && details.name !== donor.name) {
            attributionParts.push(details.name);
          }
          if (details.occupation) {
            attributionParts.push(details.occupation);
          }
        } else if (details.company && details.company !== donor.name) {
          attributionParts.push(details.company);
        }
        let date: string | undefined;
        if (
          "contribution_receipt_date" in contribution &&
          contribution.contribution_receipt_date
        ) {
          date = contribution.contribution_receipt_date;
        } else if ("newest" in contribution && contribution.newest) {
          date = contribution.newest;
        }
        return {
          amount,
          attribution: attributionParts.join(" · ") || undefined,
          date,
          note: contribution.description || undefined,
        };
      })
      .sort((a, b) => b.amount - a.amount);

    return {
      key: donor.key,
      name: donor.name,
      href: donor.href,
      isIndividual: donor.isIndividual,
      role: donor.role,
      total: donor.total,
      gifts,
    };
  });

  // ── Related companies: tracked-company donors, richest first ────────
  const relatedCompanies: RelatedCompany[] = [];
  for (const donor of mergedDonors) {
    if (!donor.href?.startsWith("/2026/companies/")) {
      continue;
    }
    const id = donor.href.slice("/2026/companies/".length);
    const company = companies[id];
    relatedCompanies.push({
      id,
      name: company?.name ?? donor.name,
      href: donor.href,
      role: companyRole(company),
      total: donor.total,
    });
  }
  relatedCompanies.sort((a, b) => b.total - a.total);

  // ── Aggregate independent expenditures by candidate ─────────────────
  const memberIdSet = new Set(memberIds.map((id) => String(id)));
  // Member committee names keyed by id, plus their network order, so a target's
  // funding committees can be listed lead-first.
  const memberNameById = new Map<string, string>();
  const memberOrderById = new Map<string, number>();
  members.forEach((member, index) => {
    memberNameById.set(String(member.id), member.name);
    memberOrderById.set(String(member.id), index);
  });
  type TargetAccum = {
    key: string;
    name: string;
    party: string;
    state: string;
    raceId: string;
    support: number;
    oppose: number;
    committeeIds: Set<string>;
  };
  const targets: Record<string, TargetAccum> = {};
  let expenditureCount = 0;
  if (!isError(expendituresData)) {
    const allExpenditures = expendituresData as Record<string, Expenditure>;
    for (const expenditure of Object.values(allExpenditures)) {
      if (!memberIdSet.has(String(expenditure.committee_id))) {
        continue;
      }
      if (!expenditure.candidate_office_state) {
        continue;
      }
      const name = getCandidateName(expenditure);
      if (!name) {
        continue;
      }
      expenditureCount += 1;
      const state = expenditure.candidate_office_state;
      const raceId = getExpenditureRaceId(expenditure);
      const lastName = (
        expenditure.candidate_last_name ??
        expenditure.candidate_name ??
        ""
      ).toUpperCase();
      const key = `${state}-${raceId}-${lastName}`;
      const isSupport = expenditure.support_oppose_indicator === "S";
      const amount = expenditure.expenditure_amount ?? 0;
      const committeeId = String(expenditure.committee_id);
      if (targets[key]) {
        if (isSupport) {
          targets[key].support += amount;
        } else {
          targets[key].oppose += amount;
        }
        if (!targets[key].party && expenditure.candidate_party) {
          targets[key].party = expenditure.candidate_party;
        }
        targets[key].committeeIds.add(committeeId);
      } else {
        targets[key] = {
          key,
          name,
          party: expenditure.candidate_party ?? "",
          state,
          raceId,
          support: isSupport ? amount : 0,
          oppose: isSupport ? 0 : amount,
          committeeIds: new Set([committeeId]),
        };
      }
    }
  }

  const candidates: CandidateTarget[] = Object.values(targets)
    .map((target) => ({
      key: target.key,
      name: target.name,
      party: target.party,
      state: target.state,
      stateName: STATES_BY_ABBR[target.state] ?? target.state,
      raceId: target.raceId,
      raceName: getRaceName(target.raceId),
      prefix:
        target.support >= target.oppose
          ? ("Support" as const)
          : ("Oppose" as const),
      total: target.support + target.oppose,
      committees: Array.from(target.committeeIds)
        .sort(
          (a, b) =>
            (memberOrderById.get(a) ?? Infinity) -
            (memberOrderById.get(b) ?? Infinity),
        )
        .map((id) => memberNameById.get(id) ?? id),
    }))
    .sort((a, b) => b.total - a.total);

  const raceCount = new Set(
    candidates.map((target) => `${target.state}-${target.raceId}`),
  ).size;

  return {
    network,
    members,
    affiliatedOrgs,
    raised,
    spent,
    cashOnHand,
    byParty,
    donors,
    donorCount: donors.length,
    relatedCompanies,
    candidates,
    raceCount,
    expenditureCount,
  };
}
