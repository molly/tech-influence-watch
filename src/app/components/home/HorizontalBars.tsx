import { humanizeApproximateRounded } from "@/app/utils/humanize";
import { getFullPartyName } from "@/app/utils/party";
import { range } from "@/app/utils/range";

import Skeleton from "../skeletons/Skeleton";
import styles from "./HorizontalBars.module.css";

export interface HorizontalBarItem {
  key: string;
  label: string;
  labelNode?: React.ReactNode;
  subtitle?: React.ReactNode;
  value: number;
  displayValue?: string;
  ariaLabel?: string;
}

export function HorizontalBars({
  items,
  max: maxProp,
  showPct,
}: {
  items: HorizontalBarItem[];
  max?: number;
  showPct?: boolean;
}) {
  const max = maxProp ?? Math.max(...items.map((i) => i.value), 0);
  return (
    <ul className={styles.bars}>
      {items.map((item) => {
        const pct = max > 0 ? (item.value / max) * 100 : 0;
        return (
          <li key={item.key} className={styles.barRow}>
            <div className={styles.labelRow}>
              <span className={styles.label}>
                {item.labelNode ?? item.label}
              </span>
              <span className={styles.value}>
                {item.displayValue}
                {showPct && max > 0 && (
                  <span className={styles.pct}> ({Math.round(pct)}%)</span>
                )}
              </span>
            </div>
            {item.subtitle && (
              <div className={styles.subtitle}>{item.subtitle}</div>
            )}
            <div
              className={styles.track}
              role="img"
              aria-label={
                item.ariaLabel ?? `${item.label}: ${item.displayValue}`
              }
            >
              {item.value > 0 && (
                <div className={styles.fill} style={{ width: `${pct}%` }} />
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

const PARTY_ORDER: Record<string, number> = {
  DEM: 0,
  REP: 1,
  LIB: 2,
  IND: 3,
};

const getPartyOrder = (party: string): number => {
  if (PARTY_ORDER[party] !== undefined) {
    return PARTY_ORDER[party];
  }
  if (party === "UNK") {
    return 10000;
  }
  if (party === "OTH") {
    return 10001;
  }
  return 999;
};

const getPartyLabel = (party: string): string => {
  if (party === "UNK") {
    return "Non-partisan / unknown";
  }
  const name = getFullPartyName(party[0]);
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const LABEL_WIDTHS = ["7rem", "5rem", "8rem", "6rem", "4rem", "9rem"];
const VALUE_WIDTHS = ["2.5rem", "3rem", "2rem", "2.5rem", "3rem", "2rem"];

export function HorizontalBarsSkeleton({ numBars = 1 }: { numBars?: number }) {
  return (
    <ul className={styles.bars}>
      {range(numBars).map((i) => (
        <li key={`skeleton-bar-${i}`} className={styles.barRow}>
          <div className={styles.labelRow}>
            <Skeleton width={LABEL_WIDTHS[i % LABEL_WIDTHS.length]} />
            <Skeleton width={VALUE_WIDTHS[i % VALUE_WIDTHS.length]} />
          </div>
          <div className={styles.track} />
        </li>
      ))}
    </ul>
  );
}

export function HorizontalPartyBars({
  partySummary,
  max,
}: {
  partySummary: Record<string, number>;
  max?: number;
}) {
  const parties = Object.keys(partySummary)
    .filter((p) => partySummary[p] > 0)
    .sort((a, b) => {
      const diff = getPartyOrder(a) - getPartyOrder(b);
      if (diff !== 0) {
        return diff;
      }
      return a.localeCompare(b);
    });

  const items: HorizontalBarItem[] = parties.map((party) => ({
    key: party,
    label: getPartyLabel(party),
    value: partySummary[party],
    displayValue: `$${humanizeApproximateRounded(partySummary[party])}`,
  }));

  return <HorizontalBars items={items} max={max} showPct={max !== undefined} />;
}

export default HorizontalBars;
