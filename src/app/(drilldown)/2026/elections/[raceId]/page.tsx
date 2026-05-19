import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { STATES_BY_ABBR } from "@/app/data/states";
import { customMetadata } from "@/app/utils/metadata";
import { getRaceName } from "@/app/utils/races";

import Ads from "./Ads";
import CommitteeSpending from "./CommitteeSpending";
import Elections, { ElectionsSkeleton } from "./Elections";
import OtherSupport from "./OtherSupport";
import styles from "./page.module.css";
import { SpendingSkeleton } from "./Spending";
import SpendingCard from "./SpendingCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ raceId: string }>;
}): Promise<Metadata> {
  const { raceId } = await params;
  if (raceId.toUpperCase() === "PRESIDENT") {
    return customMetadata({
      title: "Presidential election",
      description:
        "Cryptocurrency industry spending to influence the United States Presidential election.",
    });
  }
  const state = raceId.split("-")[0];
  const raceName = `${STATES_BY_ABBR[state]} ${getRaceName(raceId)}`;
  return customMetadata({
    title: `${raceName} election`,
    description: `Cryptocurrency industry spending to influence the ${raceName} election.`,
  });
}

export default async function RacePage({
  params,
}: {
  params: Promise<{ raceId: string }>;
}) {
  const { raceId } = await params;
  const raceIdSplit = raceId.split("-");
  const stateAbbr = raceIdSplit[0];
  const isPres = raceId.toUpperCase() === "PRESIDENT";

  return (
    <>
      <div className={styles.columns}>
        <div className={styles.headerWrapper}>
          <h1 className="no-margin">{`${isPres ? "" : `${STATES_BY_ABBR[stateAbbr]} `}${getRaceName(raceId)} election`}</h1>
          {!isPres && (
            <Link
              href={`/2026/states/${STATES_BY_ABBR[stateAbbr].replaceAll(" ", "-").toLowerCase()}`}
            >
              &raquo; Other elections in {STATES_BY_ABBR[stateAbbr]}
            </Link>
          )}
        </div>
        <div className={styles.electionsColumn}>
          <h2 className={styles.electionsColumnHeader}>Elections</h2>
          <Suspense fallback={<ElectionsSkeleton />}>
            <Elections raceId={raceId} />
          </Suspense>
        </div>
        <div className={styles.rightColumn}>
          <div className={styles.spendingCard}>
            <h2 id="spending-label">Money involved in this election</h2>
            <Suspense fallback={<SpendingSkeleton />}>
              <SpendingCard raceId={raceId} />
            </Suspense>
          </div>
          <div className={styles.committeeCard}>
            <h2>Spending by cryptocurrency-focused committees</h2>
            <Suspense fallback={<div>Loading...</div>}>
              <CommitteeSpending raceId={raceId} />
            </Suspense>
          </div>
          <div className={styles.otherSupportCard}>
            <p>
              Cryptocurrency-related companies or individuals associated with
              the industry have also supported candidates in this race more
              directly, without going through the cryptocurrency-focused PACs.
            </p>
            <h2>Other spending from the industry</h2>
            <Suspense fallback={<div>Loading...</div>}>
              <OtherSupport raceId={raceId} />
            </Suspense>
          </div>
          <div className={styles.adsCard}>
            <h2 className="no-margin">Ads</h2>
            <Ads raceId={raceId} />
            <div className="secondary small">
              These are mostly tracked by hand, and so some advertisements may
              be missing. Have you seen a cryptocurrency PAC-funded
              advertisement pertaining to this election?{" "}
              <Link href="/about/contact">Send it in!</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
