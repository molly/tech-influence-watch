import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { fetchStateExpenditures } from "@/app/actions/fetch";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import { MoneyCardSkeleton } from "@/app/components/MoneyCard";
import TotalsRow from "@/app/components/TotalsRow";
import { STATES_BY_FULL } from "@/app/data/states";
import sharedStyles from "@/app/shared.module.css";
import { PopulatedStateExpenditures } from "@/app/types/Expenditures";
import { Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import {
  humanizeNumber,
  humanizeRoundedCurrency,
  pluralize,
} from "@/app/utils/humanize";
import { customMetadata } from "@/app/utils/metadata";
import { humanizeSector, sectorHref } from "@/app/utils/sector";
import { titlecase } from "@/app/utils/titlecase";

import ByCommittee, { CommitteeCardContentsSkeleton } from "./ByCommittee";
import ByRace, { RaceCardContentsSkeleton } from "./ByRace";
import CompanySpending from "./CompanySpending";
import styles from "./page.module.css";
import PriorCycleContributions from "./PriorCycleContributions";
import TotalSpending from "./TotalSpending";

function stateNameFromUrl(urlName: string) {
  const stateName = decodeURIComponent(urlName).split("-").join(" ");
  return titlecase(stateName);
}

export function stateDetailMetadata(
  stateParam: string,
  sector: Sector,
): Metadata {
  const state = stateNameFromUrl(stateParam);
  return customMetadata({
    title: state,
    description: `${humanizeSector(sector, { hyphen: true })}-focused political action committee spending on 2026 elections in ${state}.`,
  });
}

async function StateSubtitle({
  stateAbbr,
  sector,
  titlecasedState,
}: {
  stateAbbr: string;
  sector: Sector;
  titlecasedState: string;
}) {
  const expendituresData = await fetchStateExpenditures(stateAbbr, sector);
  if (!isError(expendituresData)) {
    const raceCount = isError(expendituresData)
      ? 0
      : Object.keys((expendituresData as PopulatedStateExpenditures).by_race)
          .length;
    return (
      <span className={sharedStyles.headerSubtitle}>
        {`${humanizeSector(sector, { hyphen: true, or: true })}focused PACs have made
            expenditures in `}
        <span className="bold">{humanizeNumber(raceCount)}</span>
        {` ${pluralize(raceCount, "race")} in ${titlecasedState}.`}
      </span>
    );
  }
  return null;
}

async function ByCommitteeTotalLabel({
  stateAbbr,
  sector,
}: {
  stateAbbr: string;
  sector: Sector;
}) {
  const expendituresData = await fetchStateExpenditures(stateAbbr, sector);
  if (isError(expendituresData)) {
    return null;
  }
  const totalSpending = (expendituresData as PopulatedStateExpenditures).total;
  if (!totalSpending) {
    return null;
  }
  return (
    <span className={sharedStyles.sectionTitleAmount}>
      of{" "}
      <span className={sharedStyles.sectionTitleAmountValue}>
        {humanizeRoundedCurrency(totalSpending, true, 1)}
      </span>{" "}
      total PAC spending
    </span>
  );
}

export default async function StateDetailView({
  stateParam,
  sector,
}: {
  stateParam: string;
  sector: Sector;
}) {
  const titlecasedState = stateNameFromUrl(stateParam);
  if (!(titlecasedState in STATES_BY_FULL)) {
    notFound();
  }

  const stateAbbr = STATES_BY_FULL[titlecasedState];

  return (
    <>
      <div className={sharedStyles.fullWidthHeader}>
        <section className={sharedStyles.header}>
          <Breadcrumbs
            crumbs={[
              "Elections",
              { name: "By state", href: sectorHref("/2026/states", sector) },
              titlecasedState,
            ]}
          />
          <h1 className={sharedStyles.title}>{titlecasedState}</h1>
          <Suspense>
            <StateSubtitle
              stateAbbr={stateAbbr}
              sector={sector}
              titlecasedState={titlecasedState}
            />
          </Suspense>
        </section>
      </div>
      <div className={`${sharedStyles.main}`}>
        <TotalsRow>
          <Suspense fallback={<MoneyCardSkeleton />}>
            <TotalSpending
              sector={sector}
              stateAbbr={stateAbbr}
              titlecasedState={titlecasedState}
            />
          </Suspense>
          <Suspense fallback={<MoneyCardSkeleton />}>
            <CompanySpending
              sector={sector}
              stateAbbr={stateAbbr}
              titlecasedState={titlecasedState}
            />
          </Suspense>
        </TotalsRow>
        <div className={sharedStyles.columns}>
          <div className={sharedStyles.mainColumn}>
            <h2 className={sharedStyles.sectionTitle}>By race</h2>
            <Suspense fallback={<RaceCardContentsSkeleton />}>
              <ByRace stateAbbr={stateAbbr} sector={sector} />
            </Suspense>
          </div>
          <div className={sharedStyles.sideColumn}>
            <h2 className={styles.sectionTitle}>
              By{" "}
              {humanizeSector(sector, {
                lowercase: true,
                abbrev: true,
                hyphen: true,
              })}
              focused PACs
              <Suspense>
                <ByCommitteeTotalLabel stateAbbr={stateAbbr} sector={sector} />
              </Suspense>
            </h2>
            <Suspense fallback={<CommitteeCardContentsSkeleton />}>
              <ByCommittee stateAbbr={stateAbbr} sector={sector} />
            </Suspense>
          </div>
          <Suspense>
            <PriorCycleContributions stateAbbr={stateAbbr} sector={sector} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
