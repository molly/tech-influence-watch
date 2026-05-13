import { humanizeApproximateRounded } from "@/app/utils/humanize";
import { getFullPartyName } from "@/app/utils/party";
import { formatCurrency } from "@/app/utils/utils";
import styles from "./HorizontalBars.module.css";

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

  const max = Math.max(...Object.values(partySummary));

  return (
    <ul className={styles.bars}>
      {parties.map((party) => {
        const pct = max > 0 ? (partySummary[party] / max) * 100 : 0;
        const label = getPartyLabel(party);
        return (
          <li key={party} className={styles.barRow}>
            <div className={styles.labelRow}>
              <span className={styles.label}>{label}</span>
              <span className={styles.value}>
                {`$${humanizeApproximateRounded(partySummary[party])}`}
              </span>
            </div>
            <div
              className={styles.track}
              role="img"
              aria-label={`${label}: ${formatCurrency(partySummary[party], true)}`}
            >
              <div className={styles.fill} style={{ width: `${pct}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
