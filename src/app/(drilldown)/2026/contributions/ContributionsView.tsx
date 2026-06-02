import type { Metadata } from "next";
import { Suspense } from "react";

import Breadcrumbs from "@/app/components/Breadcrumbs";
import AllRecentContributions from "@/app/components/home/AllRecentContributions";
import sharedStyles from "@/app/shared.module.css";
import { Sector } from "@/app/types/Sector";
import { customMetadata } from "@/app/utils/metadata";
import { humanizeSector } from "@/app/utils/sector";

export function contributionsMetadata(sector: Sector): Metadata {
  return customMetadata({
    title: "Recent contributions",
    description: `Recent political contributions from ${humanizeSector(sector, { hyphen: true, lowercase: true })}focused companies and individuals.`,
  });
}

export default async function ContributionsView({ sector }: { sector: Sector }) {
  return (
    <>
      <div className={sharedStyles.fullWidthHeader}>
        <section className={sharedStyles.header}>
          <Breadcrumbs crumbs={["Recent", "Contributions"]} />
          <h1 className={sharedStyles.title}>Recent contributions</h1>
          <Suspense
            fallback={
              <p className={sharedStyles.headerSubtitle}>
                Contributions from tracked companies and individuals.
              </p>
            }
          >
            <p className={sharedStyles.headerSubtitle}>
              Contributions from
              {` tracked ${humanizeSector(sector, { context: "industry", lowercase: true })} companies and individuals.`}
            </p>
          </Suspense>
        </section>
      </div>
      <div className={sharedStyles.main}>
        <div className="single-column-page">
          <h2 className={sharedStyles.sectionTitle}>Contributions</h2>
          <div className={sharedStyles.subtitle}>
            Grouped by date of receipt. Depending on committee filing schedules,
            recent contributions may not yet appear here.
          </div>
          <AllRecentContributions fullPage={true} sector={sector} />
        </div>
      </div>
    </>
  );
}
