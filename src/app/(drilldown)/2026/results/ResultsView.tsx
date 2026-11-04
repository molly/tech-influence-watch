import type { Metadata } from "next";
import { Suspense } from "react";

import Breadcrumbs from "@/app/components/Breadcrumbs";
import ElectionResults, {
  ElectionResultsSkeleton,
} from "@/app/components/results/ElectionResults";
import sharedStyles from "@/app/shared.module.css";
import { Sector } from "@/app/types/Sector";
import { customMetadata } from "@/app/utils/metadata";
import { humanizeSector, sectorHref } from "@/app/utils/sector";

export function resultsMetadata(sector: Sector): Metadata {
  return customMetadata({
    title: "Election results",
    description: `Results from the latest federal elections, and how candidates backed or opposed by ${humanizeSector(
      sector,
      { hyphen: true, abbrev: true, lowercase: true },
    )}focused super PACs and donors fared`,
  });
}

export default function ResultsView({ sector }: { sector: Sector }) {
  return (
    <>
      <div className={sharedStyles.fullWidthHeader}>
        <section className={sharedStyles.header}>
          <Breadcrumbs
            crumbs={[
              { name: "Elections", href: sectorHref("/2026/elections", sector) },
              "Results",
            ]}
          />
          <h1 className={sharedStyles.title}>Election results</h1>
        </section>
      </div>
      <div className={sharedStyles.main}>
        <Suspense fallback={<ElectionResultsSkeleton />}>
          <ElectionResults sector={sector} />
        </Suspense>
      </div>
    </>
  );
}
