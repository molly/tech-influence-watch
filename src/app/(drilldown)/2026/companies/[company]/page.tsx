import { Metadata } from "next";
import { Suspense } from "react";

import {
  fetchCompany,
  fetchConstant,
  fetchNonCandidateCommittees,
} from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import {
  HorizontalBarsSkeleton,
  HorizontalPartyBars,
} from "@/app/components/home/HorizontalBars";
import ContributionsGroup, {
  ContributionsGroupSkeleton,
} from "@/app/components/individualOrCompany/ContributionsGroup";
import KnownDonors from "@/app/components/individualOrCompany/KnownDonors";
import ReportedContributions, {
  ReportedContribution,
} from "@/app/components/individualOrCompany/ReportedContributions";
import SpendingScope from "@/app/components/individualOrCompany/SpendingScope";
import Skeleton from "@/app/components/skeletons/Skeleton";
import USMapSkeleton from "@/app/components/skeletons/USMapSkeleton";
import sharedStyles from "@/app/shared.module.css";
import { Company, CompanyConstant } from "@/app/types/Companies";
import { IndividualOrCompanyContributionGroup } from "@/app/types/Contributions";
import { classifyGroup } from "@/app/utils/committees";
import { isError } from "@/app/utils/errors";
import { humanizeApproximateRounded } from "@/app/utils/humanize";
import { customMetadata } from "@/app/utils/metadata";
import { formatCompanyName } from "@/app/utils/names";
import { range } from "@/app/utils/range";
import { titlecase } from "@/app/utils/titlecase";

import CompanyHeader, { CompanyHeaderSkeleton } from "./CompanyHeader";
import CompanySpendingMap from "./CompanySpendingMap";
import styles from "./page.module.css";

export const dynamicParams = false;

export async function generateStaticParams() {
  const data =
    await fetchConstant<Record<string, CompanyConstant>>("companies");
  if (isError(data) || !data) {
    return [];
  }
  return Object.keys(data).map((company) => ({ company }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ company: string }>;
}): Promise<Metadata> {
  const { company } = await params;
  const companyData = await fetchCompany(company);
  let companyName;
  if (isError(companyData)) {
    companyName = formatCompanyName(titlecase(company.replaceAll("-", " ")));
  } else {
    companyName = (companyData as Company).name;
  }
  return customMetadata({
    title: companyName,
    description: `Election spending by ${companyName} and related individuals.`,
  });
}

function ContributionsSectionSkeleton() {
  return (
    <section className={styles.contributionSection}>
      <h2 className={sharedStyles.sectionTitle}>
        <span>Contributions</span>
        <span className={sharedStyles.sectionTitleAmount}>
          <Skeleton width="11rem" />
        </span>
      </h2>
      {range(5).map((i) => (
        <ContributionsGroupSkeleton key={`cg-skeleton-${i}`} />
      ))}
    </section>
  );
}

function ContributionsByPartySkeleton() {
  return (
    <section className={sharedStyles.section}>
      <h2 className={sharedStyles.sectionTitle} id="spending-by-party">
        <span>Contributions by party</span>
        <Skeleton width="5rem" />
      </h2>
      <HorizontalBarsSkeleton numBars={3} />
    </section>
  );
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company: companyParam } = await params;
  const [companyData, nonCandidateCommittees, companiesConst] =
    await Promise.all([
      fetchCompany(companyParam),
      fetchNonCandidateCommittees(),
      fetchConstant<Record<string, CompanyConstant>>("companies"),
    ]);
  if (isError(companyData)) {
    return (
      <div className={sharedStyles.main}>
        <ErrorText subject="information about this company" />
      </div>
    );
  }
  const company = companyData as Company;
  // Reported donors live on the curated company constant (dark-money orgs that
  // don't disclose donors in FEC data), not on the regenerated company doc.
  const knownDonors = companiesConst?.[companyParam]?.knownDonors ?? [];

  // Inverse of knownDonors: reported gifts FROM this company. Scan every org's
  // curated donor list for entries that point back at this company, so a gift
  // surfaces as the donor's spending too (kept separate from FEC contributions).
  const reportedContributions: ReportedContribution[] = Object.entries(
    companiesConst ?? {},
  ).flatMap(([recipientId, recipientConst]) =>
    (recipientConst.knownDonors ?? [])
      .filter(
        (donor) =>
          donor.id === companyParam &&
          (donor.idType ?? "company") === "company",
      )
      .map((donor) => ({
        recipientId,
        recipientName: recipientConst.name,
        amount: donor.amount,
        date: donor.date,
        source: donor.source,
        sourceUrl: donor.sourceUrl,
      })),
  );

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

  const superPacGroups: IndividualOrCompanyContributionGroup[] = [];
  const partyGroups: IndividualOrCompanyContributionGroup[] = [];
  const candidateGroups: IndividualOrCompanyContributionGroup[] = [];

  for (const group of visibleContributions) {
    const category = classifyGroup(group, nonCandidateCommittees);
    if (category === "superPac") {
      superPacGroups.push(group);
    } else if (category === "party") {
      partyGroups.push(group);
    } else {
      candidateGroups.push(group);
    }
  }

  const candidateTotal = candidateGroups.reduce((sum, g) => sum + g.total, 0);

  return (
    <>
      <Suspense fallback={<CompanyHeaderSkeleton />}>
        <CompanyHeader company={company} companyParam={companyParam} />
      </Suspense>
      <div className={`${sharedStyles.main} ${sharedStyles.columns}`}>
        <div className={sharedStyles.mainColumn}>
          {knownDonors.length > 0 && (
            <KnownDonors donors={knownDonors} orgName={company.name} />
          )}
          <Suspense fallback={<ContributionsSectionSkeleton />}>
            <section className={styles.contributionSection}>
              <h2 className={sharedStyles.sectionTitle}>
                <span>Contributions</span>
                <span className={sharedStyles.sectionTitleAmount}>
                  <span className={sharedStyles.highlightFigure}>
                    ${humanizeApproximateRounded(companyTotal, 1)}
                  </span>{" "}
                  across{" "}
                  <span className={sharedStyles.highlightFigure}>
                    {visibleContributions.length}
                  </span>{" "}
                  recipients
                </span>
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
                <div className={styles.contributionRowEmpty}>
                  No contributions yet.
                </div>
              )}
            </section>
          </Suspense>
          {reportedContributions.length > 0 && (
            <ReportedContributions
              contributions={reportedContributions}
              donorName={company.name}
            />
          )}
        </div>
        <div
          className={`${sharedStyles.sideColumn} ${sharedStyles.constrainedColumn}`}
        >
          <Suspense fallback={null}>
            <SpendingScope
              name={company.name}
              superPacGroups={superPacGroups}
              partyGroups={partyGroups}
              candidateGroups={candidateGroups}
              darkMoneyTotal={reportedContributions.reduce(
                (sum, c) => sum + c.amount,
                0,
              )}
            />
          </Suspense>
          <Suspense fallback={<ContributionsByPartySkeleton />}>
            {visibleContributions.length > 0 && (
              <section className={sharedStyles.section}>
                <h2
                  className={sharedStyles.sectionTitle}
                  id="spending-by-party"
                >
                  <span>Contributions by party</span>
                  <span className={sharedStyles.sectionTitleAmount}>
                    of{" "}
                    <span className={sharedStyles.highlightFigure}>
                      ${humanizeApproximateRounded(companyTotal, 1)}
                    </span>
                  </span>
                </h2>
                {company.party_summary && (
                  <HorizontalPartyBars
                    partySummary={company.party_summary}
                    max={Object.values(company.party_summary).reduce(
                      (a, b) => a + b,
                      0,
                    )}
                  />
                )}
              </section>
            )}
          </Suspense>
          {visibleContributions.length > 0 && (
            <section className={sharedStyles.section}>
              <h2
                className={sharedStyles.sectionTitle}
                id="company-spending-by-state"
              >
                <span>Spending by state</span>
                <Suspense fallback={<Skeleton width="10rem" />}>
                  <span className={sharedStyles.sectionTitleAmount}>
                    of{" "}
                    <span className={sharedStyles.highlightFigure}>
                      ${humanizeApproximateRounded(candidateTotal, 1)}
                    </span>{" "}
                    directly benefitting candidates
                  </span>
                </Suspense>
              </h2>
              <div className={sharedStyles.subtitle}>
                Approximate. Some committee spending is cross-state or not tied
                to a specific candidate, and is omitted here.
              </div>
              <Suspense fallback={<USMapSkeleton />}>
                <CompanySpendingMap
                  companyId={companyParam}
                  labelId="company-spending-by-state"
                />
              </Suspense>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
