import type { Metadata } from "next";
import { Suspense } from "react";

import AllCompanySpendingMap from "@/app/components/home/AllCompanySpendingMap";
import SuperPacSpendingMapWrapper from "@/app/components/home/SuperPacSpendingMapWrapper";
import USMapSkeleton from "@/app/components/skeletons/USMapSkeleton";
import { Sector } from "@/app/types/Sector";
import { customMetadata } from "@/app/utils/metadata";
import { parseSector } from "@/app/utils/sector";

import styles from "./page.module.css";
import StateExpenditures, {
  StateExpendituresSkeleton,
} from "./StateExpenditures";
import StateNonPacExpenditures from "./StateNonPacExpenditures";

export const metadata: Metadata = customMetadata({
  title: "Spending by State",
  description:
    "States in which cryptocurrency-focused political action committees have been spending to influence 2026 elections.",
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string }>;
}) {
  const { sector: rawSector } = await searchParams;
  const sector: Sector = parseSector(rawSector);

  return (
    <div className={styles.page}>
      <section className={styles.mapRow}>
        <div className={styles.mapContainer}>
          <Suspense fallback={<USMapSkeleton />}>
            <SuperPacSpendingMapWrapper sector={sector} />
          </Suspense>
        </div>
        <section className={styles.statesTableCard}>
          <h2 className={styles.statesTableHeader}>
            Cryptocurrency PAC spending by state
          </h2>
          <table className={styles.statesTable}>
            <thead>
              <tr>
                <th className="text-cell" colSpan={2}>
                  State
                </th>
                <th className="number-cell">Expenditures</th>
              </tr>
            </thead>
            <Suspense fallback={<StateExpendituresSkeleton />}>
              <StateExpenditures sector={sector} />
            </Suspense>
          </table>
        </section>
      </section>
      <section className={styles.mapRow}>
        <div className={styles.mapContainer}>
          <Suspense fallback={<USMapSkeleton />}>
            <AllCompanySpendingMap sector={sector} />
          </Suspense>
        </div>
        <section className={styles.statesTableCard}>
          <h2 className={styles.statesTableHeader}>
            Elections with spending by cryptocurrency industry-associated
            companies or individuals
          </h2>
          <table className={styles.statesTable}>
            <thead>
              <tr>
                <th className="text-cell" colSpan={2}>
                  State
                </th>
                <th className="number-cell">Expenditures</th>
              </tr>
            </thead>
            <Suspense fallback={<StateExpendituresSkeleton />}>
              <StateNonPacExpenditures sector={sector} />
            </Suspense>
          </table>
        </section>
      </section>
    </div>
  );
}
