import type { Metadata } from "next";
import { Suspense } from "react";

import Breadcrumbs from "@/app/components/Breadcrumbs";
import InfluencedRaces from "@/app/components/InfluencedRaces";
import sharedStyles from "@/app/shared.module.css";
import { customMetadata } from "@/app/utils/metadata";
import { humanizeSector, parseSector } from "@/app/utils/sector";

import OtherSupportedRaces from "./OtherSupportedRaces";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string }>;
}): Promise<Metadata> {
  const { sector: rawSector } = await searchParams;
  const sector = parseSector(rawSector);
  return customMetadata({
    title: "Influenced Elections",
    description: `Congressional spending by ${humanizeSector(sector, { hyphen: true, lowercase: true })}focused political action committees`,
  });
}

export default async function RacesList({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string; electionsPage?: string }>;
}) {
  const { sector: rawSector, electionsPage: rawElectionsPage } =
    await searchParams;
  const sector = parseSector(rawSector);
  const electionsPage = Math.max(1, parseInt(rawElectionsPage ?? "1", 10) || 1);
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
          <InfluencedRaces
            sector={sector}
            fullPage={true}
            page={electionsPage}
            rawSector={rawSector}
          />
          <OtherSupportedRaces page={electionsPage} rawSector={rawSector} />
        </div>
      </div>
    </>
  );
}
