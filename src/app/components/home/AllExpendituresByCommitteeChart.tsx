import Link from "next/link";

import SectorBadge from "@/app/components/SectorBadge";
import { getNetworkId } from "@/app/data/networks";
import { CommitteeConstant } from "@/app/types/Committee";
import { Sector } from "@/app/types/Sector";
import { formatCompact } from "@/app/utils/humanize";
import { formatCurrency } from "@/app/utils/utils";

import styles from "./HorizontalBars.module.css";

export default function SpendingByCommittee({
  expenditures,
  committeeConstants,
  labelId: _labelId,
  sector,
  max: maxProp,
}: {
  expenditures: Record<string, number>;
  committeeConstants: Record<string, CommitteeConstant>;
  labelId: string;
  sector: Sector;
  max?: number;
}) {
  const committees = Object.keys(expenditures)
    .sort((a, b) => expenditures[b] - expenditures[a])
    .slice(0, 6);

  const max =
    maxProp ?? Math.max(...committees.map((id) => expenditures[id]), 0);

  return (
    <ul className={styles.bars}>
      {committees.map((id) => {
        const spending = expenditures[id];
        const name = committeeConstants[id]?.name ?? id;
        const pct = max > 0 ? (spending / max) * 100 : 0;

        return (
          <li key={id} className={styles.barRow}>
            <div className={styles.labelRow}>
              <span>
                <Link
                  href={`/2026/committees/${id}`}
                  className={`${styles.label} secondaryLink`}
                >
                  {name}
                </Link>
                {sector === "all" && committeeConstants[id]?.sector && (
                  <SectorBadge>{committeeConstants[id].sector}</SectorBadge>
                )}
                {committeeConstants[id]?.network &&
                  (getNetworkId(committeeConstants[id].network!) ? (
                    <>
                      {" "}
                      <Link
                        href={`/2026/networks/${getNetworkId(committeeConstants[id].network!)}`}
                        className={styles.networkLabel}
                      >
                        {committeeConstants[id].network} network
                      </Link>
                    </>
                  ) : (
                    <span className={styles.networkLabel}>
                      {" "}
                      {committeeConstants[id].network} network
                    </span>
                  ))}
              </span>
              <span className={styles.value}>
                {formatCompact(spending)}
                <span className={styles.pct}> ({Math.round(pct)}%)</span>
              </span>
            </div>
            <div
              className={styles.track}
              role="img"
              aria-label={`${name}: ${formatCurrency(spending, true)}`}
            >
              <div className={styles.fill} style={{ width: `${pct}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
