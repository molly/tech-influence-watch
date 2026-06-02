import type { Metadata } from "next";
import { Suspense } from "react";

import Breadcrumbs from "@/app/components/Breadcrumbs";
import InfluencedRaces from "@/app/components/InfluencedRaces";
import sharedStyles from "@/app/shared.module.css";
import { Sector } from "@/app/types/Sector";
import { customMetadata } from "@/app/utils/metadata";
import { humanizeSector } from "@/app/utils/sector";

import OtherSupportedRaces from "./OtherSupportedRaces";

export function racesListMetadata(sector: Sector): Metadata {
  return customMetadata({
    title: "Influenced Elections",
    description: `Congressional spending by ${humanizeSector(sector, { hyphen: true, lowercase: true })}focused political action committees`,
  });
}

export default async function RacesListView({ sector }: { sector: Sector }) {
  return (
    <>
      <div className={sharedStyles.fullWidthHeader}>
        <section className={sharedStyles.header}>
          <Breadcrumbs crumbs={["Elections", "All"]} />
          <h1 className={sharedStyles.title}>Elections</h1>
          <Suspense
            fallback={
              <p className={sharedStyles.headerSubtitle}>
                Contributions from tracked companies and individuals.
              </p>
            }
          >
            <p className={sharedStyles.headerSubtitle}>
              Every federal race where tracked{" "}
              {humanizeSector(sector, { hyphen: true, lowercase: true })}aligned
              super PACs have spent to support or oppose candidates, or where
              candidates have received direct contributions from industry-linked
              donors.
            </p>
          </Suspense>
        </section>
      </div>
      <div className={sharedStyles.main}>
        <div className="single-column-page">
          <InfluencedRaces sector={sector} fullPage={true} />
          <OtherSupportedRaces sector={sector} />
        </div>
      </div>
    </>
  );
}
