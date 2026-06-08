import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import {
  fetchConstant,
  fetchIndividual,
  fetchIndividualTotalSpending,
  fetchNonCandidateCommittees,
} from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import {
  HorizontalBarsSkeleton,
  HorizontalPartyBars,
} from "@/app/components/home/HorizontalBars";
import SpendingScope from "@/app/components/individualOrCompany/SpendingScope";
import Skeleton from "@/app/components/skeletons/Skeleton";
import sharedStyles from "@/app/shared.module.css";
import { CompanyConstant } from "@/app/types/Companies";
import { IndividualOrCompanyContributionGroup } from "@/app/types/Contributions";
import {
  IndividualConstant,
  IndividualContributions,
  IndividualTotals,
} from "@/app/types/Individuals";
import { classifyGroup } from "@/app/utils/committees";
import { is4xx, isError } from "@/app/utils/errors";
import { humanizeApproximateRounded } from "@/app/utils/humanize";
import { customMetadata } from "@/app/utils/metadata";
import { titlecase } from "@/app/utils/titlecase";

import { hydrateIndividualConstant } from "../individuals.utils";
import ContributionsCardContent, {
  ContributionsCardSkeleton,
} from "./ContributionsCardContent";
import IndividualHeader from "./IndividualHeader";
import styles from "./page.module.css";
import RelatedIndividuals from "./RelatedIndividuals";

// Render on demand for slugs not captured at build time. Individual data lives
// in Firestore and updates continuously between deploys, so the prebuilt param
// set can lag (or come back empty if the build-time fetch hiccups). dynamicParams
// keeps real pages serving in those cases; genuinely-missing slugs still 404 via
// notFound() below. Prebuilt params are unaffected — they stay statically cached.
export const dynamicParams = true;

export async function generateStaticParams() {
  const data =
    await fetchConstant<Record<string, IndividualConstant>>("individuals");
  if (isError(data) || !data) {
    // Fail the build rather than silently shipping a site with zero prerendered
    // individual pages. dynamicParams keeps real pages serving if anything slips
    // through, but a build that can't read Firestore should not deploy.
    throw new Error(
      "generateStaticParams: individuals constant unavailable at build time",
    );
  }
  return Object.keys(data).map((individual) => ({ individual }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ individual: string }>;
}): Promise<Metadata> {
  const { individual } = await params;
  const individualName = titlecase(individual.replaceAll("-", " "));
  return customMetadata({
    title: individualName,
    description: `Election spending by ${individualName}.`,
  });
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

export default async function IndividualPage({
  params,
}: {
  params: Promise<{ individual: string }>;
}) {
  const { individual: individualParam } = await params;
  const [
    individualData,
    contributionsData,
    companyConstantsData,
    totalsData,
    nonCandidateCommittees,
  ] = await Promise.all([
    fetchConstant("individuals"),
    fetchIndividual(individualParam),
    fetchConstant<Record<string, CompanyConstant> | null>("companies"),
    fetchIndividualTotalSpending(),
    fetchNonCandidateCommittees(),
  ]);
  // A genuinely missing individual — no contributions doc, or absent from the
  // constant — is a real 404. Other failures (e.g. a transient Firestore error)
  // fall through to the error message so they aren't cached as "not found".
  if (
    is4xx(contributionsData) ||
    (individualData !== null &&
      !(
        individualParam in
        (individualData as Record<string, IndividualConstant>)
      ))
  ) {
    notFound();
  }
  if (
    [contributionsData, totalsData].some(isError) ||
    [individualData, companyConstantsData].some((d) => d === null)
  ) {
    return (
      <div className={sharedStyles.main}>
        <ErrorText subject="information about this individual" />
      </div>
    );
  }
  const individual = (individualData as Record<string, IndividualConstant>)[
    individualParam
  ];
  const { contributions, party_summary } =
    contributionsData as IndividualContributions;
  const companyConstants = companyConstantsData as Record<
    string,
    CompanyConstant
  >;

  const totals = totalsData as IndividualTotals;
  let individualTotalsArray: Record<string, { total: number }> = {};
  if (!isError(totalsData)) {
    individualTotalsArray = totals.by_individual;
  }

  const individualListData = hydrateIndividualConstant(
    individual,
    individualTotalsArray,
    companyConstants,
  );

  const superPacGroups: IndividualOrCompanyContributionGroup[] = [];
  const partyGroups: IndividualOrCompanyContributionGroup[] = [];
  const candidateGroups: IndividualOrCompanyContributionGroup[] = [];

  for (const group of contributions) {
    const category = classifyGroup(group, nonCandidateCommittees);
    if (category === "superPac") {
      superPacGroups.push(group);
    } else if (category === "party") {
      partyGroups.push(group);
    } else {
      candidateGroups.push(group);
    }
  }

  return (
    <div className={styles.main}>
      <IndividualHeader
        individual={individualListData}
        numRecipients={contributions.length}
      />
      <div className={`${sharedStyles.main} ${sharedStyles.columns}`}>
        <Suspense fallback={<ContributionsCardSkeleton />}>
          <ContributionsCardContent
            individual={contributionsData as IndividualContributions}
            nonCandidateCommittees={Array.from(nonCandidateCommittees)}
            totalContributionAmount={individualListData.total}
          />
        </Suspense>
        <div
          className={`${sharedStyles.sideColumn} ${sharedStyles.constrainedColumn}`}
        >
          <Suspense fallback={null}>
            <SpendingScope
              name={individual.name}
              superPacGroups={superPacGroups}
              partyGroups={partyGroups}
              candidateGroups={candidateGroups}
              hasMap={false}
            />
          </Suspense>
          <Suspense fallback={<ContributionsByPartySkeleton />}>
            <section className={sharedStyles.section}>
              <h2 className={sharedStyles.sectionTitle} id="spending-by-party">
                <span>Contributions by party</span>
                <span className={sharedStyles.sectionTitleAmount}>
                  of{" "}
                  <span className={sharedStyles.highlightFigure}>
                    ${humanizeApproximateRounded(individualListData.total, 1)}
                  </span>
                </span>
              </h2>
              {party_summary && (
                <HorizontalPartyBars
                  partySummary={party_summary}
                  max={Object.values(party_summary).reduce((a, b) => a + b, 0)}
                />
              )}
            </section>
          </Suspense>
          <Suspense fallback={null}>
            <RelatedIndividuals
              individualId={individual.id}
              companyIds={individualListData.companyDetails.map((c) => c.id)}
              companyConstants={companyConstants}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
