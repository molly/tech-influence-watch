import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import AdLibrary from "@/app/components/analysis/ads/AdLibrary";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import Skeleton from "@/app/components/skeletons/Skeleton";
import sharedStyles from "@/app/shared.module.css";
import { Sector } from "@/app/types/Sector";
import {
  AdLibraryParams,
  adMatchesSector,
  adSectorsForView,
} from "@/app/utils/adAnalysis";
import { getCodebook, getTaggedAds } from "@/app/utils/adAnalysisData";
import { humanizeList, humanizeNumber } from "@/app/utils/humanize";
import { customMetadata } from "@/app/utils/metadata";
import { humanizeSector, sectorHref } from "@/app/utils/sector";

import { AdsSourceNote } from "../AdsView";
import styles from "../page.module.css";

const SECTOR_WORDS = { crypto: "crypto", ai: "AI" };

export function adLibraryMetadata(sector: Sector): Metadata {
  return customMetadata({
    title: `${humanizeSector(sector, { abbrev: true })} super PAC ad library`,
    description: `Searchable transcripts of Google ads run by ${humanizeSector(
      sector,
      { hyphen: true, abbrev: true, lowercase: true },
    )}focused super PACs, tagged by theme`,
  });
}

async function AdLibraryContent({
  sector,
  params,
}: {
  sector: Sector;
  params: AdLibraryParams;
}) {
  const ads = (await getTaggedAds()).filter((ad) =>
    adMatchesSector(ad.sector, sector),
  );
  const committees = new Set(ads.map((ad) => ad.committeeId)).size;
  const races = new Set(ads.map((ad) => ad.race)).size;
  const sectors = adSectorsForView(sector).map((s) => SECTOR_WORDS[s]);
  return (
    <>
      <p className={styles.libraryLede}>
        Every Google ad we&rsquo;ve tagged: {ads.length} ads from{" "}
        {humanizeNumber(committees)} {humanizeList(sectors)} super PACs across{" "}
        {races} races. Filter by network, party, committee or theme, or search
        the transcripts.{" "}
        <Link href={sectorHref("/2026/analysis/ads", sector)}>
          Read the analysis →
        </Link>
      </p>
      <AdLibrary
        ads={ads}
        codebook={getCodebook()}
        sector={sector}
        initial={params}
      />
      <AdsSourceNote />
    </>
  );
}

export default function AdLibraryView({
  sector,
  params,
}: {
  sector: Sector;
  params: AdLibraryParams;
}) {
  return (
    <>
      <div className={sharedStyles.fullWidthHeader}>
        <section className={sharedStyles.header}>
          <Breadcrumbs
            crumbs={[
              "Analysis",
              {
                name: "Political ads",
                href: sectorHref("/2026/analysis/ads", sector),
              },
              "Ad library",
            ]}
          />
          <h1 className={sharedStyles.title}>Ad library</h1>
        </section>
      </div>
      <div className={sharedStyles.main}>
        <Suspense
          fallback={
            <>
              <Skeleton height="1.1rem" width="70%" />
              <Skeleton height="20rem" width="100%" />
            </>
          }
        >
          <AdLibraryContent sector={sector} params={params} />
        </Suspense>
      </div>
    </>
  );
}
