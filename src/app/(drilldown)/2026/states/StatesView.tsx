import type { Metadata } from "next";
import { Suspense } from "react";

import Breadcrumbs from "@/app/components/Breadcrumbs";
import AllCompanySpendingMap from "@/app/components/home/AllCompanySpendingMap";
import SuperPacSpendingMapWrapper from "@/app/components/home/SuperPacSpendingMapWrapper";
import USMapSkeleton from "@/app/components/skeletons/USMapSkeleton";
import sharedStyles from "@/app/shared.module.css";
import { Sector } from "@/app/types/Sector";
import { customMetadata } from "@/app/utils/metadata";
import { humanizeSector } from "@/app/utils/sector";

import styles from "./page.module.css";
import StateExpenditures, {
  StateExpendituresSkeleton,
} from "./StateExpenditures";
import StateNonPacExpenditures from "./StateNonPacExpenditures";
import StatesStatsRow, { StatesStatsRowSkeleton } from "./StatesStatsRow";

export function statesMetadata(sector: Sector): Metadata {
  return customMetadata({
    title: `Spending by state`,
    description: `States in which  ${humanizeSector(sector, { hyphen: true, lowercase: true })}focused political action committees have been spending to influence 2026 elections.`,
  });
}

export default async function StatesView({ sector }: { sector: Sector }) {
  return (
    <>
      <div className={sharedStyles.fullWidthHeader}>
        <section className={sharedStyles.header}>
          <Breadcrumbs crumbs={["Elections", "By state"]} />
          <h1 className={sharedStyles.title}>Elections by state</h1>
          <p className={styles.headerSubtitle}>
            Where {humanizeSector(sector, { lowercase: true })} super PAC money
            is going, and where companies and executives are contributing
            directly to federal candidates.
          </p>
        </section>
      </div>
      <div className={`${sharedStyles.main}`}>
        <Suspense fallback={<StatesStatsRowSkeleton />}>
          <StatesStatsRow sector={sector} />
        </Suspense>
        <h2 className={sharedStyles.sectionTitle} id="pacs">
          {humanizeSector(sector)} PAC spending by state
        </h2>
        <section className={styles.section}>
          <div className={styles.mapContainer}>
            <Suspense fallback={<USMapSkeleton />}>
              <SuperPacSpendingMapWrapper sector={sector} />
            </Suspense>
          </div>
          <section className={styles.statesTableCard}>
            <Suspense fallback={<StateExpendituresSkeleton />}>
              <StateExpenditures sector={sector} />
            </Suspense>
          </section>
        </section>
        <h2 className={sharedStyles.sectionTitle} id="direct">
          Direct{" "}
          {humanizeSector(sector, { lowercase: true, context: "industry" })}{" "}
          spending by state
        </h2>
        <section className={styles.section}>
          <div className={styles.mapContainer}>
            <Suspense fallback={<USMapSkeleton />}>
              <AllCompanySpendingMap sector={sector} />
            </Suspense>
          </div>
          <section className={styles.statesTableCard}>
            <Suspense fallback={<StateExpendituresSkeleton />}>
              <StateNonPacExpenditures sector={sector} />
            </Suspense>
          </section>
        </section>
      </div>
    </>
  );
}
