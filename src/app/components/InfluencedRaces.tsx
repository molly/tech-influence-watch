import Link from "next/link";
import { Suspense } from "react";

import styles from "@/app/components/tables.module.css";
import sharedStyles from "@/app/shared.module.css";
import { type Sector } from "@/app/types/Sector";
import { humanizeSector, sectorHref } from "@/app/utils/sector";

import InfluencedRacesContents, {
  InfluencedRacesContentsSkeleton,
} from "./InfluencedRacesContents";

export default function InfluencedRaces({
  sector,
  fullPage = false,
  page = 1,
  rawSector,
}: {
  sector: Sector;
  fullPage?: boolean;
  page?: number;
  rawSector?: string;
}) {
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
      <Suspense fallback={<InfluencedRacesContentsSkeleton fullPage={fullPage} />}>
        <InfluencedRacesContents
          fullPage={fullPage}
          sector={sector}
          page={page}
          rawSector={rawSector}
        />
      </Suspense>
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
