import type { Metadata } from "next";
import { Suspense } from "react";

import Breadcrumbs from "@/app/components/Breadcrumbs";
import AllRecentExpenditures from "@/app/components/home/AllRecentExpenditures";
import sharedStyles from "@/app/shared.module.css";
import { customMetadata } from "@/app/utils/metadata";
import { humanizeSector, parseSector } from "@/app/utils/sector";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string }>;
}): Promise<Metadata> {
  const { sector: rawSector } = await searchParams;
  const sector = parseSector(rawSector);
  return customMetadata({
    title: "Recent expenditures",
    description: `Recent expenditures by ${humanizeSector(sector, { hyphen: true, lowercase: true })}focused committees.`,
  });
}

export default async function ExpendituresList({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string }>;
}) {
  const { sector: rawSector } = await searchParams;
  const sector = parseSector(rawSector);

  return (
    <>
      <div className={sharedStyles.fullWidthHeader}>
        <section className={sharedStyles.header}>
          <Breadcrumbs crumbs={["Recent", "Expenditures"]} />
          <h1 className={sharedStyles.title}>Recent expenditures</h1>
          <Suspense
            fallback={
              <p className={sharedStyles.headerSubtitle}>
                Expenditures by tracked committees.
              </p>
            }
          >
            <p className={sharedStyles.headerSubtitle}>
              Expenditures by
              {` tracked ${humanizeSector(sector, { context: "industry", lowercase: true })} committees.`}
            </p>
          </Suspense>
        </section>
      </div>
      <div className={sharedStyles.main}>
        <div className="single-column-page">
          <h2 className={sharedStyles.sectionTitle}>Expenditures</h2>
          <div className={sharedStyles.subtitle}>
            Grouped by expenditure date. Depending on committee filing
            schedules, recent expenditures may not yet appear here.
          </div>
          <AllRecentExpenditures fullPage={true} sector={sector} />
        </div>
      </div>
    </>
  );
}
