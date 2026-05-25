import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { fetchCompany, fetchNonCandidateCommittees } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import ContributionsGroup from "@/app/components/individualOrCompany/ContributionsGroup";
import SpendingByParty from "@/app/components/individualOrCompany/SpendingByParty";
import InformationalTooltip from "@/app/components/InformationalTooltip";
import USMapSkeleton from "@/app/components/skeletons/USMapSkeleton";
import sharedStyles from "@/app/shared.module.css";
import { Company } from "@/app/types/Companies";
import { IndividualOrCompanyContributionGroup } from "@/app/types/Contributions";
import { isError } from "@/app/utils/errors";
import { customMetadata } from "@/app/utils/metadata";
import { formatCompanyName } from "@/app/utils/names";
import { titlecase } from "@/app/utils/titlecase";
import { formatCurrency } from "@/app/utils/utils";

import CompanyHeader from "./CompanyHeader";
import CompanySpendingMap from "./CompanySpendingMap";
import styles from "./page.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ company: string }>;
}): Promise<Metadata> {
  const { company } = await params;
  const companyName = formatCompanyName(
    titlecase(company.replaceAll("-", " ")),
  );
  return customMetadata({
    title: companyName,
    description: `Election spending by ${companyName} and related individuals.`,
  });
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company: companyParam } = await params;
  const [companyData, nonCandidateCommittees] = await Promise.all([
    fetchCompany(companyParam),
    fetchNonCandidateCommittees(),
  ]);
  if (isError(companyData)) {
    return <ErrorText subject="company data" />;
  }
  const company = companyData as Company;

  // Filter out omitted contributions and recompute group totals
  const visibleContributions = (company.contributions ?? [])
    .map((group) => {
      const visibleContribs = group.contributions.filter(
        (c) => c.manualReview?.status !== "omit",
      );
      const visibleTotal = visibleContribs.reduce(
        (sum, c) =>
          sum + (c.contribution_receipt_amount ?? c.total_receipt_amount ?? 0),
        0,
      );
      return { ...group, contributions: visibleContribs, total: visibleTotal };
    })
    .filter((group) => group.contributions.length > 0);

  const companyTotal = visibleContributions.reduce(
    (sum, group) => sum + group.total,
    0,
  );

  return (
    <>
      <CompanyHeader company={company} companyParam={companyParam} />
      <div className={`${sharedStyles.main} ${sharedStyles.columns}`}>
        <section className={styles.contributionSection}>
          <h2 className={sharedStyles.sectionTitle}>
            <span>Contributions</span>
            <span>{formatCurrency(companyTotal, true)}</span>
          </h2>
          {visibleContributions.length > 0 ? (
            visibleContributions.map(
              (
                contributionGroup: IndividualOrCompanyContributionGroup,
                ind: number,
              ) => {
                return (
                  <ContributionsGroup
                    key={`contrib-group-${ind}`}
                    contributionsGroup={contributionGroup}
                    recipient={contributionGroup.recipient}
                    company={company.name}
                    relatedIndividuals={company.relatedIndividuals}
                    nonCandidateCommittees={nonCandidateCommittees}
                  />
                );
              },
            )
          ) : (
            <div className={`secondary ${styles.contributionRow}`}>
              No contributions yet.
            </div>
          )}
        </section>
        <div className={sharedStyles.sideColumn}>
          <section
            className={`${styles.spendingByStateSection} ${sharedStyles.constrainWidth}`}
          >
            <div className={sharedStyles.card}>
              <h2 id="company-spending-by-state">
                <span>
                  Approximate
                  <InformationalTooltip>
                    <p>
                      Some committees (particularly super PACs) spend
                      cross-state or are not associated with a specific
                      candidate, and contributions to them are omitted from this
                      chart.
                    </p>
                    <p>
                      This relies on manual classification and so represents a
                      conservative estimate of industry spending.
                    </p>
                  </InformationalTooltip>{" "}
                  spending by state
                </span>
              </h2>
              <Suspense fallback={<USMapSkeleton />}>
                <CompanySpendingMap
                  companyId={companyParam}
                  labelId="company-spending-by-state"
                />
              </Suspense>
            </div>
          </section>
          <section
            className={`${styles.spendingByPartySection} ${sharedStyles.constrainWidth}`}
          >
            <h2 id="spending-by-party">Contributions by party</h2>
            {company.party_summary && (
              <SpendingByParty
                partySummary={company.party_summary}
                labelId="spending-by-party"
              />
            )}
          </section>
        </div>
      </div>
    </>
  );
}
