import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { MoneyCardSkeleton } from "@/app/components/MoneyCard";
import { STATES_BY_FULL } from "@/app/data/states";
import sharedStyles from "@/app/shared.module.css";
import { customMetadata } from "@/app/utils/metadata";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state: stateParam } = await params;
  const state = stateNameFromUrl(stateParam);
  return customMetadata({
    title: state,
    description: `Cryptocurrency-focused political action committee spending on 2026 elections in ${state}.`,
  });
}

export default async function CommitteePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: stateParam } = await params;
  const titlecasedState = stateNameFromUrl(stateParam);
  if (!(titlecasedState in STATES_BY_FULL)) {
    notFound();
  }

  const stateAbbr = STATES_BY_FULL[titlecasedState];

  return (
    <div className={styles.page}>
      <h1 className={sharedStyles.titleH2}>{titlecasedState}</h1>
      <div className={styles.spendingCards}>
        <Suspense fallback={<MoneyCardSkeleton />}>
          <TotalSpending
            stateAbbr={stateAbbr}
            titlecasedState={titlecasedState}
          />
        </Suspense>
        <Suspense fallback={<MoneyCardSkeleton />}>
          <CompanySpending
            stateAbbr={stateAbbr}
            titlecasedState={titlecasedState}
          />
        </Suspense>
      </div>
      <div className={styles.raceAndCommitteeSection}>
        <div className={styles.raceCard}>
          <h2>By race</h2>
          <Suspense fallback={<RaceCardContentsSkeleton />}>
            <ByRace stateAbbr={stateAbbr} />
          </Suspense>
        </div>
        <div className={styles.sideColumn}>
          <div className={styles.committeeCard}>
            <h2>By crypto-focused PACs</h2>
            <Suspense fallback={<CommitteeCardContentsSkeleton />}>
              <ByCommittee stateAbbr={stateAbbr} />
            </Suspense>
          </div>
          <Suspense>
            <PriorCycleContributions stateAbbr={stateAbbr} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
