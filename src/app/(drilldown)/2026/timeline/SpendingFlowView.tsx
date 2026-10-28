import type { Metadata } from "next";
import { Suspense } from "react";

import Breadcrumbs from "@/app/components/Breadcrumbs";
import ErrorText from "@/app/components/ErrorText";
import USMapSkeleton from "@/app/components/skeletons/USMapSkeleton";
import sharedStyles from "@/app/shared.module.css";
import { Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import { customMetadata } from "@/app/utils/metadata";
import { humanizeSector } from "@/app/utils/sector";

import SpendingFlow from "./SpendingFlow";
import styles from "./SpendingFlow.module.css";
import { fetchSpendingFlowData } from "./spendingFlowData";
import { SpendingFlowData } from "./spendingFlowUtils";

export function spendingFlowMetadata(sector: Sector): Metadata {
  return customMetadata({
    title: "Spending over time",
    description: `Where ${humanizeSector(sector, { hyphen: true, lowercase: true })}focused super PAC spending in the 2026 elections, week by week.`,
  });
}

async function SpendingFlowContent({ sector }: { sector: Sector }) {
  const data = await fetchSpendingFlowData(sector);
  if (isError(data)) {
    return <ErrorText subject="spending data" />;
  }
  return <SpendingFlow data={data as SpendingFlowData} sector={sector} />;
}

export default function SpendingFlowView({ sector }: { sector: Sector }) {
  return (
    <>
      <div className={sharedStyles.fullWidthHeaderNoBorder}>
        <section className={sharedStyles.header}>
          <Breadcrumbs crumbs={["Spending", "Spending over time"]} />
          <div className={styles.mast}>
            <div>
              <h1 className={sharedStyles.title}>Spending over time</h1>
              <p className={sharedStyles.headerSubtitle}>
                Track{" "}
                {humanizeSector(sector, { context: "industry", lowercase: true })}{" "}
                spending in federal elections, and see which races are drawing
                attention — and when.
              </p>
            </div>
            <div className={styles.mastMeta}>2026 election cycle</div>
          </div>
        </section>
      </div>
      <div className={sharedStyles.main}>
        <Suspense fallback={<USMapSkeleton />}>
          <SpendingFlowContent sector={sector} />
        </Suspense>
      </div>
    </>
  );
}
