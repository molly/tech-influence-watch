import Link from "next/link";

import { fetchQpq } from "@/app/actions/fetch";
import Skeleton from "@/app/components/skeletons/Skeleton";
import { QPQ } from "@/app/types/Qpq";
import { isError } from "@/app/utils/errors";
import { formatCompact, humanizeRoundedCurrency } from "@/app/utils/humanize";
import {
  getQpqContribMaps,
  getQpqEntryTotal,
  getQpqManualAmount,
  type QpqContribMaps,
} from "@/app/utils/qpq";
import { range } from "@/app/utils/range";

import styles from "./FeaturedTracker.module.css";

const SKELETON_NAME_WIDTHS = ["8rem", "6rem", "9rem", "7rem"];

export function FeaturedTrackerSkeleton() {
  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <Skeleton width="7rem" />
        <Skeleton height="3rem" width="80%" />
        <Skeleton height="3rem" width="65%" />
        {range(3).map((i) => (
          <Skeleton key={i} />
        ))}
        <div className={styles.divider} />
        <Skeleton height="2.5rem" width="6rem" />
        <Skeleton width="14rem" />
        <div className={styles.divider} />
        <ul className={styles.entries}>
          {SKELETON_NAME_WIDTHS.map((width, i) => (
            <li key={i} className={styles.entry}>
              <div className={styles.skeletonEntryTop}>
                <Skeleton width={width} margin="0" />
                <Skeleton width="3rem" margin="0" />
              </div>
              <Skeleton width="90%" />
            </li>
          ))}
        </ul>
        <Skeleton height="2.75rem" />
      </div>
    </section>
  );
}

export default async function FeaturedTracker() {
  const [qpqData, maps] = await Promise.all([
    fetchQpq(),
    getQpqContribMaps(),
  ]);
  if (!qpqData) {
    return null;
  }

  const entries = Object.values(qpqData) as QPQ[];

  // Combined "to Trump & family" total per entity: manual contributions plus the matched FEC
  // figures, identical to the quid pro quo drilldown. Falls back to manual-only if the FEC data
  // is unavailable so the card still renders.
  const safeMaps = isError(maps) ? null : (maps as QpqContribMaps);
  const entryTotal = (entry: QPQ): number => {
    return safeMaps
      ? getQpqEntryTotal(entry, safeMaps)
      : getQpqManualAmount(entry);
  };

  const grandTotal = entries.reduce((sum, entry) => sum + entryTotal(entry), 0);

  const featuredEntries = entries
    .filter((entry) => entry.benefitSummary !== undefined)
    .sort((a, b) => entryTotal(b) - entryTotal(a));

  if (featuredEntries.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <div className={styles.label}>Featured Tracker</div>
        <h2 className={styles.title}>Quid pro quo</h2>
        <p className={styles.subtitle}>
          Besides their Congressional election spending, companies have poured
          billions into Trump and his family. Enforcement cases were dropped,
          investigations were closed, and industries were invited to write their
          own regulations.
        </p>
        <div className={styles.total}>
          {humanizeRoundedCurrency(grandTotal, true, 1)}+
        </div>
        <div className={styles.totalLabel}>
          to Trump &amp; family by tracked entities
        </div>
        <div className={styles.divider} />
        <ul className={styles.entries}>
          {featuredEntries.map((entry) => (
            <li key={entry.name} className={styles.entry}>
              <div className={styles.entryTop}>
                <span className={styles.entryName}>{entry.name}</span>
                <span className={styles.entryAmount}>
                  {formatCompact(entryTotal(entry))}
                </span>
              </div>
              <div className={styles.entrySummary}>{entry.benefitSummary}</div>
            </li>
          ))}
        </ul>
        <Link href="/analysis/quidproquo" className={styles.button}>
          View full tracker →
        </Link>
      </div>
    </section>
  );
}
