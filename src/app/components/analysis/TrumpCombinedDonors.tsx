import Link from "next/link";

import { fetchConstant, fetchTrumpBeneficiaries } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import HorizontalBars, {
  HorizontalBarsSkeleton,
} from "@/app/components/home/HorizontalBars";
import MoneyCard, { MoneyCardSkeleton } from "@/app/components/MoneyCard";
import Skeleton from "@/app/components/skeletons/Skeleton";
import COMMITTEES from "@/app/data/committees";
import { TRUMP_CANDIDATE_ID } from "@/app/data/trump";
import curated from "@/app/data/trumpLargeDonors2024.json";
import sharedStyles from "@/app/shared.module.css";
import {
  type Beneficiary,
  type CompanyContributionGroup,
} from "@/app/types/Beneficiaries";
import { isError } from "@/app/utils/errors";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";
import { titlecaseCommittee } from "@/app/utils/titlecase";
import { formatCurrency, formatDateFromString } from "@/app/utils/utils";

import styles from "./TrumpCombinedDonors.module.css";

interface CuratedContribution {
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

interface CombinedDonor {
  id?: string;
  name: string;
  total: number;
  tracked: boolean;
  isIndividual: boolean;
  sector?: string | null;
  contributions: CuratedContribution[];
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

function sectorLabel(sector?: string | null) {
  if (!sector || sector === "tech") {
    return null;
  }
  return sector === "ai" ? "AI" : sector;
}

function donorHref(donor: CombinedDonor): string | null {
  if (!donor.id) {
    return null;
  }
  if (donor.id in COMMITTEES) {
    return `/2026/committees/${donor.id}`;
  }
  return donor.isIndividual
    ? `/2026/individuals/${donor.id}`
    : `/2026/companies/${donor.id}`;
}

export function TrumpCombinedDonorsSkeleton() {
  return (
    <>
      <section className={styles.heroWithStat}>
        <div>
          <Skeleton height="1.1rem" width="80%" />
          <Skeleton height="1.1rem" width="55%" />
        </div>
        <MoneyCardSkeleton />
      </section>
      <div className={sharedStyles.columns}>
        <div className={sharedStyles.mainColumn}>
          <h2 className={sharedStyles.sectionTitle}>By donor</h2>
          <HorizontalBarsSkeleton numBars={14} />
        </div>
        <div className={sharedStyles.sideColumn}>
          <h2 className={sharedStyles.sectionTitle}>By committee</h2>
          <Skeleton width="100%" />
          <Skeleton width="100%" />
        </div>
      </div>
    </>
  );
}

export default async function TrumpCombinedDonors() {
  const [trumpData, individualsConstant] = await Promise.all([
    fetchTrumpBeneficiaries(),
    fetchConstant<Record<string, unknown>>("individuals"),
  ]);
  if (isError(trumpData)) {
    return <ErrorText subject="contributions data" />;
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
    .map(([id, total]) => ({ id, name: committeeName(id), total }))
    .sort((a, b) => b.total - a.total);
  allContributions.sort((a, b) => b.amount - a.amount);

  return (
    <>
      <section className={styles.heroWithStat}>
        <div>
          <p className={sharedStyles.headerSubtitle}>
            Cryptocurrency, AI, and broader tech-industry money behind Donald
            Trump &mdash; campaign committees, leadership PACs, the 2025
            inauguration, and Elon Musk&rsquo;s pro-Trump America PAC.
          </p>
          <div className={sharedStyles.noteCard}>
            <span className={sharedStyles.noteLabel}>Note:</span> Tracked crypto
            and AI donors reflect all FEC-reported contributions for the current
            cycle. Donors marked{" "}
            <span className={styles.untrackedTag}>not tracked</span> are
            large-dollar gifts we record specifically for this analysis &mdash;
            the 2024 campaign, the inauguration, and big-tech companies we
            don&rsquo;t otherwise follow. Business arrangements like World
            Liberty Financial and the $TRUMP memecoin are tracked on the{" "}
            <Link href="/analysis/quidproquo" className="bold">
              quid pro quo
            </Link>{" "}
            page.
          </div>
        </div>
        <MoneyCard
          topText="Total tech money to Trump"
          amount={humanizeRoundedCurrency(grandTotal, true, 1)}
          bottomText="across all affiliated committees"
        />
      </section>

      <div className={sharedStyles.columns}>
        <div className={sharedStyles.mainColumn}>
          <h2 className={sharedStyles.sectionTitle}>
            By donor
            <span className={sharedStyles.sectionTitleAmount}>
              <span className={sharedStyles.sectionTitleAmountValue}>
                {formatCurrency(grandTotal, true)}
              </span>
              {" total · "}
              <span className={sharedStyles.sectionTitleAmountValue}>
                {donors.length}
              </span>
              {" donors"}
            </span>
          </h2>
          {donors.length === 0 ? (
            <p>No contributions found.</p>
          ) : (
            <HorizontalBars
              max={donors[0].total}
              items={donors.map((donor) => {
                const href = donorHref(donor);
                return {
                  key: donor.id ?? donor.name,
                  label: donor.name,
                  labelNode: (
                    <span>
                      {href ? <Link href={href}>{donor.name}</Link> : donor.name}
                      {sectorLabel(donor.sector) && (
                        <span className={sharedStyles.sectorBadge}>
                          {sectorLabel(donor.sector)}
                        </span>
                      )}
                      {!donor.tracked && (
                        <span className={styles.untrackedTag}>not tracked</span>
                      )}
                    </span>
                  ),
                  value: donor.total,
                  displayValue: formatCurrency(donor.total, true),
                };
              })}
            />
          )}
        </div>

        <div className={sharedStyles.sideColumn}>
          <h2 className={sharedStyles.sectionTitle}>By committee</h2>
          {committeeRows.length === 0 ? (
            <p>No contributions found.</p>
          ) : (
            <table className={styles.committeeTable}>
              <tbody>
                {committeeRows.map(({ id, name, total }) => (
                  <tr key={id} className={styles.committeeRow}>
                    <td>
                      {id in COMMITTEES ? (
                        <Link href={`/2026/committees/${id}`}>
                          {titlecaseCommittee(name)}
                        </Link>
                      ) : (
                        titlecaseCommittee(name)
                      )}
                    </td>
                    <td className="number-cell">{formatCurrency(total, true)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {allContributions.length > 0 && (
        <>
          <h2 className={sharedStyles.sectionTitle}>
            Large itemized contributions
          </h2>
          <p className={styles.tableNote}>
            Individual gifts of $100,000 or more to the 2024 campaign, the
            inauguration, and Trump-supporting PACs. Tracked crypto and AI
            donors&rsquo; current-cycle totals are summarized in the chart above.
          </p>
          <table className={styles.contributionsTable}>
            <thead>
              <tr>
                <th>Donor</th>
                <th>Recipient</th>
                <th>Date</th>
                <th className="number-cell">Amount</th>
              </tr>
            </thead>
            <tbody>
              {allContributions.map((c, i) => (
                <tr key={`${c.donor}-${c.committee_id}-${c.date}-${i}`}>
                  <td>
                    {c.donor}
                    {c.note && (
                      <span className={styles.inKind}> ({c.note})</span>
                    )}
                  </td>
                  <td>{titlecaseCommittee(c.committee_name)}</td>
                  <td className={styles.dateCell}>
                    {formatDateFromString(c.date)}
                  </td>
                  <td className="number-cell">{formatCurrency(c.amount, true)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}
