import { Metadata } from "next";
import { Suspense } from "react";

import { fetchCompany, fetchNonCandidateCommittees } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import {
  HorizontalBarsSkeleton,
  HorizontalPartyBars,
} from "@/app/components/home/HorizontalBars";
import ContributionsGroup, {
  ContributionsGroupSkeleton,
} from "@/app/components/individualOrCompany/ContributionsGroup";
import Skeleton from "@/app/components/skeletons/Skeleton";
import USMapSkeleton from "@/app/components/skeletons/USMapSkeleton";
import sharedStyles from "@/app/shared.module.css";
import { Company } from "@/app/types/Companies";
import { IndividualOrCompanyContributionGroup } from "@/app/types/Contributions";
import {
  isMultiCandidateCommittee,
  isSingleCandidateCommittee,
} from "@/app/utils/committees";
import { isError } from "@/app/utils/errors";
import { humanizeApproximateRounded } from "@/app/utils/humanize";
import { customMetadata } from "@/app/utils/metadata";
import { formatCompanyName } from "@/app/utils/names";
import { range } from "@/app/utils/range";
import { titlecase } from "@/app/utils/titlecase";

import CompanyHeader, { CompanyHeaderSkeleton } from "./CompanyHeader";
import CompanySpendingBreakdown from "./CompanySpendingBreakdown";
import CompanySpendingMap from "./CompanySpendingMap";
import styles from "./page.module.css";

type SpendingCategory = "superPac" | "party" | "candidate";

function classifyGroup(
  group: IndividualOrCompanyContributionGroup,
  nonCandidateCommittees: Set<string>,
): SpendingCategory {
  const { recipient } = group;
  const committeeType = group.contributions[0]?.committee_type;

  // Check party first — party committees (DSCC, NRSC, NRCC, etc.) can have
  // candidate_ids, so checking candidate committees first would misclassify them.
  if (
    recipient?.committee_type_full?.toLowerCase().includes("party") ||
    (committeeType && committeeType === "Y")
  ) {
    return "party";
  }
  if (!recipient) {
    return "superPac";
  }
  const hasBeneficiaries = Object.keys(recipient.candidate_details).length > 0;
  if (
    hasBeneficiaries &&
    (isSingleCandidateCommittee(recipient, nonCandidateCommittees) ||
      isMultiCandidateCommittee(recipient, nonCandidateCommittees))
  ) {
    return "candidate";
  }
  return "superPac";
}

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
        <Suspense fallback={<ContributionsSectionSkeleton />}>
          <section className={styles.contributionSection}>
            <h2 className={sharedStyles.sectionTitle}>
              <span>Contributions</span>
              <span className={sharedStyles.sectionTitleAmount}>
                <span className={sharedStyles.sectionTitleAmountValue}>
                  ${humanizeApproximateRounded(companyTotal, 1)}
                </span>{" "}
                across{" "}
                <span className={sharedStyles.sectionTitleAmountValue}>
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
              <div className={`secondary ${styles.contributionRow}`}>
                No contributions yet.
              </div>
            )}
          </section>
        </Suspense>
        <div
          className={`${sharedStyles.sideColumn} ${sharedStyles.constrainedColumn}`}
        >
          <Suspense fallback={null}>
            <CompanySpendingBreakdown
              companyName={company.name}
              superPacGroups={superPacGroups}
              partyGroups={partyGroups}
              candidateGroups={candidateGroups}
            />
          </Suspense>
          <Suspense fallback={<ContributionsByPartySkeleton />}>
            <section className={sharedStyles.section}>
              <h2 className={sharedStyles.sectionTitle} id="spending-by-party">
                <span>Contributions by party</span>
                <span className={sharedStyles.sectionTitleAmount}>
                  of{" "}
                  <span className={sharedStyles.sectionTitleAmountValue}>
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
          </Suspense>
          <section className={sharedStyles.section}>
            <h2
              className={sharedStyles.sectionTitle}
              id="company-spending-by-state"
            >
              <span>Spending by state</span>
              <Suspense fallback={<Skeleton width="10rem" />}>
                <span className={sharedStyles.sectionTitleAmount}>
                  of{" "}
                  <span className={sharedStyles.sectionTitleAmountValue}>
                    ${humanizeApproximateRounded(candidateTotal, 1)}
                  </span>{" "}
                  directly benefitting candidates
                </span>
              </Suspense>
            </h2>
            <div className={sharedStyles.subtitle}>
              Approximate. Some committee spending is cross-state or not tied to
              a specific candidate, and is omitted here.
            </div>
            <Suspense fallback={<USMapSkeleton />}>
              <CompanySpendingMap
                companyId={companyParam}
                labelId="company-spending-by-state"
              />
            </Suspense>
          </section>
        </div>
      </div>
    </>
  );
}
