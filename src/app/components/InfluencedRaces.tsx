"use client";

import Link from "next/link";

import styles from "@/app/components/tables.module.css";
import sharedStyles from "@/app/shared.module.css";
import { type Sector } from "@/app/types/Sector";
import { humanizeSector, sectorHref } from "@/app/utils/sector";

import { useBreakpoint } from "../hooks/useBreakpoint";
import InfluencedRacesContents from "./InfluencedRacesContents";

export default function InfluencedRaces({
  sector,
  fullPage = false,
}: {
  sector: Sector;
  fullPage?: boolean;
}) {
  const useCompact = useBreakpoint(650);
  const sectorText = humanizeSector(sector, {
    context: "industry",
    abbrev: true,
    lowercase: true,
  });
  return (
    <div className={styles.influencedCard}>
      <h2
        className={sharedStyles.sectionTitle}
      >{`${fullPage ? "R" : "Top r"}aces influenced by ${sectorText} super PAC money`}</h2>
      <InfluencedRacesContents
        small={useCompact}
        fullPage={fullPage}
        sector={sector}
      />
      {!fullPage && (
        <div className={styles.viewMoreLinks}>
          <Link
            href={sectorHref("/2026/elections", sector)}
            className={styles.viewMoreLink}
          >
            &raquo; All races with {sectorText} spending
          </Link>
        </div>
      )}
    </div>
  );
}
