import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import Breadcrumbs from "@/app/components/Breadcrumbs";
import Skeleton from "@/app/components/skeletons/Skeleton";
import { STATES_BY_ABBR } from "@/app/data/states";
import sharedStyles from "@/app/shared.module.css";
import { Sector } from "@/app/types/Sector";
import { customMetadata } from "@/app/utils/metadata";
import { getRaceName } from "@/app/utils/races";
import { range } from "@/app/utils/range";
import { humanizeSector, sectorHref } from "@/app/utils/sector";

import Ads from "./Ads";
import CommitteeSpending from "./CommitteeSpending";
import Elections, { ElectionsSkeleton } from "./Elections";
import OtherSupport from "./OtherSupport";
import styles from "./page.module.css";
import { SpendingSkeleton } from "./Spending";
import SpendingCard from "./SpendingCard";

export function raceDetailMetadata(raceId: string, sector: Sector): Metadata {
  const humanizedSector = humanizeSector(sector, { context: "industry" });
  if (raceId.toUpperCase() === "PRESIDENT") {
    return customMetadata({
      title: "Presidential election",
      description: `${humanizedSector} spending to influence the United States Presidential election.`,
    });
  }
  const state = raceId.split("-")[0];
  const raceName = `${STATES_BY_ABBR[state]} ${getRaceName(raceId)}`;
  return customMetadata({
    title: `${raceName} election`,
    description: `${humanizedSector} spending to influence the ${raceName} election.`,
  });
}

function SkeletonRows({
  numRows = 3,
  key,
}: {
  numRows?: number;
  key?: string;
}) {
  return range(numRows).map((i) => (
    <Skeleton key={`${key}-${i}`} width="100%" />
  ));
}

export default async function RaceDetailView({
  raceId,
  sector,
}: {
  raceId: string;
  sector: Sector;
}) {
  const raceIdSplit = raceId.split("-");
  const raceName = getRaceName(raceId);
  const stateAbbr = raceIdSplit[0];
  const stateSlug = STATES_BY_ABBR[stateAbbr]
    .replaceAll(" ", "-")
    .toLowerCase();
  const fullStateName = STATES_BY_ABBR[stateAbbr];
  const isPres = raceId.toUpperCase() === "PRESIDENT";

  return (
    <>
      <div className={sharedStyles.fullWidthHeader}>
        <section className={sharedStyles.header}>
          <Breadcrumbs
            crumbs={[
              { name: "Elections", href: sectorHref("/2026/elections", sector) },
              {
                name: fullStateName,
                href: sectorHref(`/2026/states/${stateSlug}`, sector),
              },
              getRaceName(raceId),
            ]}
          />
          <h1 className={sharedStyles.title}>
            {isPres ? "" : `${fullStateName} ${raceName} election`}
          </h1>
        </section>
      </div>
      <div className={styles.columns}>
        <div className={styles.electionsColumn}>
          <span className={styles.electionSubtitle}>
            Spending by{" "}
            {humanizeSector(sector, {
              hyphen: true,
              lowercase: true,
            })}
            focused PACs
          </span>
          <Suspense fallback={<ElectionsSkeleton />}>
            <Elections raceId={raceId} sector={sector} />
          </Suspense>
        </div>
        <div className={styles.rightColumn}>
          <div>
            <h2 className={sharedStyles.sectionTitle} id="spending-label">
              Money involved in this election
            </h2>
            <Suspense fallback={<SpendingSkeleton />}>
              <SpendingCard sector={sector} raceId={raceId} />
            </Suspense>
          </div>
          <div className={sharedStyles.section}>
            <h2 className={sharedStyles.sectionTitle}>
              Spending by{" "}
              {humanizeSector(sector, {
                hyphen: true,
                abbrev: true,
                lowercase: true,
              })}
              focused committees
            </h2>
            <Suspense fallback={<SkeletonRows key="committee-spending" />}>
              <CommitteeSpending sector={sector} raceId={raceId} />
            </Suspense>
          </div>
          <div className={styles.otherSupportCard}>
            <h2 className={sharedStyles.sectionTitle}>
              Other spending from the industry
            </h2>
            <Suspense fallback={<SkeletonRows key="other-support" />}>
              <OtherSupport raceId={raceId} sector={sector} />
            </Suspense>
          </div>
          <div>
            <h2 className={sharedStyles.sectionTitle}>Ads</h2>
            <Suspense fallback={<SkeletonRows key="ads" />}>
              <Ads raceId={raceId} sector={sector} />
            </Suspense>
            <div className={styles.adSubtitle}>
              These are mostly tracked by hand, and so some advertisements may
              be missing. Have you seen a{" "}
              {humanizeSector(sector, { lowercase: true, or: true })} PAC-funded
              advertisement pertaining to this election?{" "}
              <Link href="/about/contact">Send it in!</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
