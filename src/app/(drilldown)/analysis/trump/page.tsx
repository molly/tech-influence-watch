import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { fetchTrumpBeneficiaries } from "@/app/actions/fetch";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import ErrorText from "@/app/components/ErrorText";
import HorizontalBars, {
  HorizontalBarsSkeleton,
} from "@/app/components/home/HorizontalBars";
import MoneyCard, { MoneyCardSkeleton } from "@/app/components/MoneyCard";
import Skeleton from "@/app/components/skeletons/Skeleton";
import COMMITTEES from "@/app/data/committees";
import { TRUMP_CANDIDATE_ID } from "@/app/data/trump";
import sharedStyles from "@/app/shared.module.css";
import {
  type Beneficiary,
  type CompanyContributionGroup,
} from "@/app/types/Beneficiaries";
import { isError } from "@/app/utils/errors";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";
import { customMetadata } from "@/app/utils/metadata";
import { titlecaseCommittee } from "@/app/utils/titlecase";
import { formatCurrency } from "@/app/utils/utils";

import styles from "./page.module.css";

export const metadata: Metadata = customMetadata({
  title:
    "Cryptocurrency and AI industry campaign contributions to President Trump",
  description:
    "Cryptocurrency and artificial intelligence industry contributions to Donald Trump's campaign committees",
});

function TrumpContributionsSkeleton() {
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
          <section className={styles.card}>
            <HorizontalBarsSkeleton numBars={12} />
          </section>
        </div>
        <div className={sharedStyles.sideColumn}>
          <h2 className={sharedStyles.sectionTitle}>By committee</h2>
          <section className={styles.card}>
            <Skeleton width="100%" />
            <Skeleton width="100%" />
          </section>
        </div>
      </div>
    </>
  );
}

async function TrumpContributionsData() {
  const trumpData = await fetchTrumpBeneficiaries();

  if (isError(trumpData)) {
    return <ErrorText subject="contributions data" />;
  }

  const {
    beneficiaries: trumpBeneficiaries,
    grandTotal,
    committeeNames: trumpCommitteeNames,
  } = trumpData as {
    beneficiaries: Record<string, Beneficiary>;
    grandTotal: number;
    committeeNames: Record<string, string>;
  };

  const byDonorMap = new Map<string, { company_name: string; total: number }>();
  for (const beneficiary of Object.values(trumpBeneficiaries)) {
    for (const group of beneficiary.contributions as CompanyContributionGroup[]) {
      const existing = byDonorMap.get(group.company_id);
      if (existing) {
        existing.total += group.total;
      } else {
        byDonorMap.set(group.company_id, {
          company_name: group.company_name,
          total: group.total,
        });
      }
    }
  }
  const sortedDonors = [...byDonorMap.entries()].sort(
    (a, b) => b[1].total - a[1].total,
  );

  const trumpBeneficiary = trumpBeneficiaries[TRUMP_CANDIDATE_ID];
  const byCommitteeEntries = trumpBeneficiary?.by_committee
    ? Object.entries(trumpBeneficiary.by_committee)
    : [];
  const byCommittee = byCommitteeEntries
    .map(([id, total]) => ({
      id,
      name:
        trumpCommitteeNames[id] ??
        trumpBeneficiary?.committee_details?.committee_name ??
        id,
      total,
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <>
      <section className={styles.heroWithStat}>
        <div>
          <p className={sharedStyles.headerSubtitle}>
            Cryptocurrency and artificial intelligence industry contributions to
            President Donald Trump&rsquo;s campaign committees and affiliated
            organizations
          </p>
          <div className={sharedStyles.noteCard}>
            <span className={sharedStyles.noteLabel}>Note:</span> This page
            tracks direct, FEC-reported campaign contributions only. Business
            partnerships and other financial arrangements&nbsp;&mdash; such as
            World Liberty Financial and the $TRUMP memecoin&nbsp;&mdash; are
            tracked separately on the{" "}
            <Link href="/analysis/quidproquo" className="bold">
              quid pro quo
            </Link>{" "}
            page.
          </div>
        </div>
        <MoneyCard
          topText="Total from tracked crypto companies & individuals"
          amount={humanizeRoundedCurrency(grandTotal, true, 1)}
          bottomText="across all affiliated Trump committees"
        />
      </section>

      <div className={sharedStyles.columns}>
        <div className={sharedStyles.mainColumn}>
          <section className={styles.card}>
            <h2 className={sharedStyles.sectionTitle}>
              By donor
              <span className={sharedStyles.sectionTitleAmount}>
                <span className={sharedStyles.sectionTitleAmountValue}>
                  {formatCurrency(grandTotal, true)}
                </span>
                {" total · "}
                <span className={sharedStyles.sectionTitleAmountValue}>
                  {sortedDonors.length}
                </span>
                {" donors"}
              </span>
            </h2>
            {sortedDonors.length === 0 ? (
              <p className={styles.emptyMessage}>No contributions found.</p>
            ) : (
              <HorizontalBars
                max={grandTotal}
                items={sortedDonors.map(([companyId, donor]) => ({
                  key: companyId,
                  label: donor.company_name,
                  labelNode:
                    companyId in COMMITTEES ? (
                      <Link href={`/2026/committees/${companyId}`}>
                        {donor.company_name}
                      </Link>
                    ) : (
                      <Link href={`/2026/companies/${companyId}`}>
                        {donor.company_name}
                      </Link>
                    ),
                  value: donor.total,
                  displayValue: formatCurrency(donor.total, true),
                }))}
              />
            )}
          </section>
        </div>

        <div className={sharedStyles.sideColumn}>
          <div className={styles.committeeSection}>
            <h2 className={sharedStyles.sectionTitle}>By committee</h2>
            {byCommittee.length === 0 ? (
              <p className={styles.emptyMessage}>No contributions found.</p>
            ) : (
              <table className={styles.byCommitteeTable}>
                <tbody>
                  {byCommittee.map(({ id, name, total }) => (
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
                      <td className="number-cell">
                        {formatCurrency(total, true)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function TrumpContributionsPage() {
  return (
    <>
      <div className={sharedStyles.fullWidthHeader}>
        <section className={sharedStyles.header}>
          <Breadcrumbs crumbs={["Analysis", "Donald Trump"]} />
          <h1 className={sharedStyles.title}>Contributions to Donald Trump</h1>
        </section>
      </div>
      <div className={sharedStyles.main}>
        <Suspense fallback={<TrumpContributionsSkeleton />}>
          <TrumpContributionsData />
        </Suspense>
      </div>
    </>
  );
}
