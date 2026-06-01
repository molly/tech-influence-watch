import type { Metadata } from "next";
import { Suspense } from "react";

import {
  fetchConstant,
  fetchIndividualTotalSpending,
} from "@/app/actions/fetch";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import ErrorText from "@/app/components/ErrorText";
import MoneyCard, { MoneyCardSkeleton } from "@/app/components/MoneyCard";
import Skeleton from "@/app/components/skeletons/Skeleton";
import sharedStyles from "@/app/shared.module.css";
import { CompanyConstant } from "@/app/types/Companies";
import {
  IndividualConstant,
  IndividualListData,
  IndividualTotals,
} from "@/app/types/Individuals";
import { isError } from "@/app/utils/errors";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";
import { customMetadata } from "@/app/utils/metadata";
import { humanizeSector, parseSector } from "@/app/utils/sector";

import { hydrateIndividualConstant } from "./individuals.utils";
import IndividualsList, { IndividualsListSkeleton } from "./IndividualsList";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string }>;
}): Promise<Metadata> {
  const { sector: rawSector } = await searchParams;
  const sector = parseSector(rawSector);
  return customMetadata({
    title: "Companies",
    description: `${humanizeSector(sector, { hyphen: true, or: true })}related individuals active in election spending.`,
  });
}

function SubtitleSkeleton() {
  return (
    <p className={sharedStyles.headerSubtitle}>
      <Skeleton width="3rem" inline={true} />
      {` tracked individuals have contributed to candidates and political action committees this cycle.`}
    </p>
  );
}

export default async function IndividualsPage({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string }>;
}) {
  const { sector: rawSector } = await searchParams;
  const sector = parseSector(rawSector);

  const [data, companyConstantsData, totalsData] = await Promise.all([
    fetchConstant<Record<string, IndividualConstant> | null>("individuals"),
    fetchConstant<Record<string, CompanyConstant> | null>("companies"),
    fetchIndividualTotalSpending(),
  ]);

  if (data === null || companyConstantsData === null || isError(totalsData)) {
    return (
      <>
        <div className={sharedStyles.fullWidthHeader}>
          <section className={sharedStyles.header}>
            <Breadcrumbs crumbs={["Spending", "Individuals"]} />
            <h1 className={sharedStyles.title}>Individuals</h1>
          </section>
        </div>
        <div className={sharedStyles.main}>
          <div className="single-column-page">
            <ErrorText subject="the list of individuals" />
          </div>
        </div>
      </>
    );
  }

  const companyConstants = companyConstantsData as Record<
    string,
    CompanyConstant
  >;

  const totals = totalsData as IndividualTotals;
  let individualTotalsArray: Record<string, { total: number }> = {};
  if (!isError(totalsData)) {
    individualTotalsArray = totals.by_individual;
  }

  const individuals: IndividualListData[] = Object.values(
    data as Record<string, IndividualConstant>,
  )
    .map((i) =>
      hydrateIndividualConstant(i, individualTotalsArray, companyConstants),
    )
    .filter(
      (individual) =>
        individual.total > 0 &&
        individual.allSectors.some(
          (sectorString) =>
            sectorString === "tech" ||
            sector === "all" ||
            sectorString === sector,
        ),
    )
    .sort((a, b) => b.total - a.total);

  const combinedTotal = individuals.reduce((acc, ind) => acc + ind.total, 0);

  return (
    <>
      <div className={sharedStyles.fullWidthHeader}>
        <section className={sharedStyles.header}>
          <Breadcrumbs crumbs={["Spending", "Individuals"]} />
          <h1 className={sharedStyles.title}>Individuals</h1>
        </section>
      </div>
      <div className={sharedStyles.main}>
        <div className="single-column-page">
          <div className={sharedStyles.heroWithStat}>
            <Suspense fallback={<SubtitleSkeleton />}>
              <p className={sharedStyles.headerSubtitle}>
                <span className="bold">{individuals.length}</span>
                {` tracked individuals in the ${humanizeSector(sector, { lowercase: true })} ${sector === "all" ? "industries" : "industry"} have contributed to candidates and political action committees this cycle.`}
              </p>
            </Suspense>
            <Suspense fallback={<MoneyCardSkeleton />}>
              {!isError(totalsData) && (
                <MoneyCard
                  topText="Personal contributions to candidates & PACs"
                  amount={humanizeRoundedCurrency(combinedTotal, true)}
                  bottomText={`by ${individuals.length} tracked individuals associated with the ${humanizeSector(sector, { lowercase: true })} ${sector === "all" ? "industries" : "industry"}`}
                />
              )}
            </Suspense>
          </div>
          <Suspense fallback={<IndividualsListSkeleton />}>
            <IndividualsList individuals={individuals} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
