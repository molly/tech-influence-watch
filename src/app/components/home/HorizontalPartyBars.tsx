import { humanizeApproximateRounded } from "@/app/utils/humanize";
import { getFullPartyName } from "@/app/utils/party";
import { range } from "@/app/utils/range";

import Skeleton from "../skeletons/Skeleton";
import styles from "./HorizontalBars.module.css";

export interface HorizontalBarItem {
  key: string;
  label: string;
  value: number;
  displayValue: string;
}

export function HorizontalBars({ items }: { items: HorizontalBarItem[] }) {
  const max = Math.max(...items.map((i) => i.value), 0);
  return (
    <ul className={styles.bars}>
      {items.map((item) => {
        const pct = max > 0 ? (item.value / max) * 100 : 0;
        return (
          <li key={item.key} className={styles.barRow}>
            <div className={styles.labelRow}>
              <span className={styles.label}>{item.label}</span>
              <span className={styles.value}>{item.displayValue}</span>
            </div>
            <div
              className={styles.track}
              role="img"
              aria-label={`${item.label}: ${item.displayValue}`}
            >
              <div className={styles.fill} style={{ width: `${pct}%` }} />
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

export function HorizontalPartyBarsSkeleton({
  numBars = 1,
}: {
  numBars?: number;
}) {
  return (
    <ul className={styles.bars}>
      {range(numBars).map((i) => (
        <li key={`skeleton-bar-${i}`} className={styles.barRow}>
          <div className={styles.labelRow}>
            <Skeleton randWidth={[3, 8]} />
            <Skeleton randWidth={[1, 3]} />
          </div>
          <div className={styles.track} />
        </li>
      ))}
    </ul>
  );
}

export default function HorizontalPartyBars({
  partySummary,
}: {
  partySummary: Record<string, number>;
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

  return <HorizontalBars items={items} />;
}
