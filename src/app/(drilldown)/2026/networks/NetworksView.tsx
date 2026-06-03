import type { Metadata } from "next";
import Link from "next/link";

import {
  fetchCommitteeDetails,
  fetchCommitteesWithContributions,
  fetchCommitteeTransferGraph,
  fetchConstant,
} from "@/app/actions/fetch";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import ErrorText from "@/app/components/ErrorText";
import MoneyCard from "@/app/components/MoneyCard";
import SpendingByPartyWithOpposition from "@/app/components/SpendingByPartyWithOpposition";
import { NETWORKS } from "@/app/data/networks";
import sharedStyles from "@/app/shared.module.css";
import type {
  CommitteeConstantWithContributions,
  CommitteeDetails,
  TransferEdge,
} from "@/app/types/Committee";
import type { CompanyConstant } from "@/app/types/Companies";
import { ExpendituresByPartySnapshot } from "@/app/types/Expenditures";
import { Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import { formatCompact, pluralize } from "@/app/utils/humanize";
import { customMetadata } from "@/app/utils/metadata";
import { humanizeSector, matchesSector } from "@/app/utils/sector";

import listStyles from "../listStyles.module.css";
import styles from "./NetworksList.module.css";

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

function pacTypeLabel(committee: CommitteeConstantWithContributions): string {
  if (committee.committee_type === "O") {
    return "Super PAC";
  }
  if (committee.committee_type === "V" || committee.committee_type === "W") {
    return "Hybrid PAC";
  }
  if (committee.designation === "B" || committee.organization_type === "C") {
    return "Corporation PAC";
  }
  return "PAC";
}

type NetworkRole = "parent" | "dem" | "rep";

// True if the committee leads its network. Falls back to the network's
// leadCommitteeId when no explicit role is set on the committee.
function isParent(
  committee: CommitteeConstantWithContributions,
  leadCommitteeId: string,
): boolean {
  if (committee.role) {
    return committee.role === "parent";
  }
  return committee.id === leadCommitteeId;
}

// Display label for the partisan arm of a network member.
function partisanLabel(role: NetworkRole | undefined): string | null {
  if (role === "dem") {
    return "Democratic";
  }
  if (role === "rep") {
    return "Republican";
  }
  return null;
}

// Role label for affiliated orgs (companies), which can also be a "parent".
function orgRoleLabel(role: NetworkRole | undefined): string | null {
  if (role === "parent") {
    return "Parent";
  }
  return partisanLabel(role);
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

function NetworksHeader() {
  return (
    <div className={sharedStyles.fullWidthHeader}>
      <section className={sharedStyles.header}>
        <Breadcrumbs
          crumbs={[
            "Spending",
            { name: "Committees", href: "/2026/committees" },
            "Networks",
          ]}
        />
        <h1 className={sharedStyles.title}>Networks</h1>
        <p className={sharedStyles.headerSubtitle}>
          Several PACs in this tracker operate as coordinated networks: a lead
          committee raises and distributes funds to affiliated PACs and, in some
          cases, to dark money groups tracked here as companies. These networks
          were identified from FEC filings, transfer records, and public
          reporting.
        </p>
      </section>
    </div>
  );
}

type AffiliatedOrg = {
  id: string;
  name: string;
  type?: string;
  href?: string;
  role?: NetworkRole;
};

// Merge orgs defined in networks.ts with companies tagged with the network,
// keyed by id. Fetched company data wins per field.
function mergeAffiliatedOrgs(
  hardcoded: AffiliatedOrg[] | undefined,
  fetched: AffiliatedOrg[],
): AffiliatedOrg[] {
  const orgsById = new Map<string, AffiliatedOrg>();
  for (const org of hardcoded ?? []) {
    orgsById.set(org.id, org);
  }
  for (const org of fetched) {
    const existing = orgsById.get(org.id);
    orgsById.set(org.id, {
      id: org.id,
      name: org.name || existing?.name || org.id,
      type: org.type ?? existing?.type,
      href: org.href ?? existing?.href,
      role: org.role ?? existing?.role,
    });
  }
  return Array.from(orgsById.values());
}

export function networksMetadata(sector: Sector): Metadata {
  return customMetadata({
    title: `${humanizeSector(sector, { abbrev: true })} PAC networks`,
    description: `Coordinated ${humanizeSector(sector, {
      context: "industry",
      lowercase: true,
    })} PAC networks, in which a lead committee raises and distributes funds to affiliated PACs and dark money groups.`,
  });
}

export default async function NetworksView({
  sector = "all",
}: {
  sector?: Sector;
}) {
  const [data, companiesData, transferData] = await Promise.all([
    fetchCommitteesWithContributions("all"),
    fetchConstant<Record<string, CompanyConstant>>("companies"),
    fetchCommitteeTransferGraph("all"),
  ]);

  const transferEdges: TransferEdge[] =
    transferData && !isError(transferData)
      ? (transferData as TransferEdge[])
      : [];

  if (isError(data)) {
    return (
      <>
        <NetworksHeader />
        <div className={sharedStyles.main}>
          <ErrorText subject="the list of networks" />
        </div>
      </>
    );
  }

  const committees = data as CommitteeConstantWithContributions[];

  // Affiliated organizations (e.g. dark money 501(c)(4)s) are tracked as
  // companies and tagged with the network they belong to.
  const orgsByNetwork = new Map<string, AffiliatedOrg[]>();
  if (companiesData) {
    for (const [id, company] of Object.entries(companiesData)) {
      if (!company.network) {
        continue;
      }
      const list = orgsByNetwork.get(company.network) ?? [];
      list.push({
        id,
        name: company.name,
        type: company.type,
        href: `/2026/companies/${id}`,
        role: company.role,
      });
      orgsByNetwork.set(company.network, list);
    }
  }

  const entries = NETWORKS.map((network) => {
    const members = committees
      .filter((committee) => committee.network === network.key)
      .sort((a, b) => {
        const aParent = isParent(a, network.leadCommitteeId);
        const bParent = isParent(b, network.leadCommitteeId);
        if (aParent !== bParent) {
          return aParent ? -1 : 1;
        }
        return b.total - a.total;
      });
    // Each member's `total` already includes contributions, transfers in, and
    // cash on hand. Subtract transfers between members (which the transfer graph
    // detects from contribution records, however they were filed) so dollars the
    // lead raised and passed to its affiliates aren't counted twice.
    const memberIds = new Set(members.map((c) => c.id));
    const intraNetworkTransfers = transferEdges
      .filter((edge) => memberIds.has(edge.fromId) && memberIds.has(edge.toId))
      .reduce((sum, edge) => sum + edge.amount, 0);
    const raised = Math.max(
      0,
      members.reduce((sum, c) => sum + c.total, 0) - intraNetworkTransfers,
    );
    const spent = members.reduce(
      (sum, c) => sum + (c.independent_expenditures || 0),
      0,
    );
    const remaining = Math.max(0, raised - spent);
    const affiliatedOrgs = mergeAffiliatedOrgs(
      network.affiliatedOrgs,
      orgsByNetwork.get(network.key) ?? [],
    );
    return { network, members, affiliatedOrgs, raised, spent, remaining };
  })
    // A network can consist of only companies (no tracked committees).
    .filter(
      (entry) =>
        (sector === "all" || matchesSector(entry.network.sector, sector)) &&
        (entry.members.length > 0 || entry.affiliatedOrgs.length > 0),
    )
    .sort((a, b) => b.raised - a.raised);

  // Aggregate per-committee partisan spending into a per-network breakdown.
  const memberIds = entries.flatMap((entry) =>
    entry.members.map((member) => member.id),
  );
  const detailResults = await Promise.all(
    memberIds.map((id) => fetchCommitteeDetails(id)),
  );
  const byPartyById = new Map<
    string,
    ExpendituresByPartySnapshot | undefined
  >();
  memberIds.forEach((id, index) => {
    const result = detailResults[index];
    byPartyById.set(
      id,
      isError(result) ? undefined : (result as CommitteeDetails).by_party,
    );
  });

  return (
    <>
      <NetworksHeader />
      <div className={sharedStyles.main}>
        <div className="single-column-page">
          {entries.length === 0 && (
            <p className="secondary italic">No networks to show.</p>
          )}
          {entries.map(
            ({
              network,
              members,
              affiliatedOrgs,
              raised,
              spent,
              remaining,
            }) => {
              const networkByParty = sumByParty(
                members.map((member) => byPartyById.get(member.id)),
              );
              const hasMembers = members.length > 0;
              return (
                <article
                  key={network.key}
                  className={`${styles.networkRow}${hasMembers ? "" : ` ${styles.networkRowSingle}`}`}
                >
                  <div className={styles.netLeft}>
                    <div className={styles.netTitleRow}>
                      <h2 className={styles.netTitle}>
                        <Link href={`/2026/networks/${network.id}`}>
                          {network.name}
                        </Link>
                      </h2>
                      <span className={sharedStyles.sectorBadge}>
                        {network.sector === "ai" ? "AI" : network.sector}
                      </span>
                    </div>
                    <div
                      className={styles.netDesc}
                      dangerouslySetInnerHTML={{ __html: network.description }}
                    ></div>

                    <div className={styles.netMembers}>
                      {hasMembers && (
                        <>
                          <div className={listStyles.subhead}>PACs</div>
                          {members.map((member) => {
                            const isLead = isParent(
                              member,
                              network.leadCommitteeId,
                            );
                            // role drives the partisan arm; fall back to memberNotes
                            // (which also covers non-partisan notes like "Bipartisan")
                            // when no role is set on the committee.
                            const partisan =
                              partisanLabel(member.role) ??
                              (member.role == null
                                ? (network.memberNotes?.[member.id] ?? null)
                                : null);
                            const typeLabel = [
                              isLead ? "Lead PAC" : null,
                              pacTypeLabel(member),
                              isLead ? null : partisan,
                            ]
                              .filter(Boolean)
                              .join(" · ");
                            return (
                              <div
                                key={member.id}
                                className={styles.memberItem}
                              >
                                <span className={styles.miName}>
                                  <Link href={`/2026/committees/${member.id}`}>
                                    {member.name}
                                  </Link>
                                </span>
                                <span className={styles.miType}>
                                  {typeLabel}
                                </span>
                              </div>
                            );
                          })}
                        </>
                      )}

                      {affiliatedOrgs.length > 0 && (
                        <>
                          <div className={listStyles.subhead}>
                            Affiliated organizations
                          </div>
                          {affiliatedOrgs.map((org) => (
                            <div key={org.id} className={styles.memberItem}>
                              <span className={styles.miName}>
                                {org.href ? (
                                  <Link href={org.href}>{org.name}</Link>
                                ) : (
                                  org.name
                                )}
                              </span>
                              <span className={styles.miType}>
                                {[
                                  orgRoleLabel(org.role),
                                  org.type,
                                  org.type === "501(c)(4)"
                                    ? "Dark money"
                                    : null,
                                ]
                                  .filter(Boolean)
                                  .join(" · ")}
                              </span>
                              <span
                                className={`${styles.miAmt} ${styles.miAmtUndisclosed}`}
                              >
                                Undisclosed
                              </span>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>

                  {hasMembers && (
                    <div className={styles.netRight}>
                      <div className={styles.netStats}>
                        <MoneyCard
                          amount={formatCompact(raised)}
                          topText="Combined raised"
                          bottomText={`Across ${pluralize(members.length, "member PAC", { includeValue: true })}`}
                        />
                        <MoneyCard
                          amount={formatCompact(spent)}
                          topText="Total spent"
                          bottomText="In independent expenditures"
                        />
                        <MoneyCard
                          amount={formatCompact(remaining)}
                          topText="Remaining"
                          bottomText="Available this cycle"
                        />
                      </div>

                      {networkByParty && (
                        <section className={styles.netSpending}>
                          <h3 className={sharedStyles.sectionTitle}>
                            Spending by party
                          </h3>
                          <SpendingByPartyWithOpposition
                            expenditures={networkByParty}
                            labelId={`net-spend-${network.key}`}
                            max={spent || undefined}
                          />
                        </section>
                      )}
                    </div>
                  )}
                </article>
              );
            },
          )}
        </div>
      </div>
    </>
  );
}
