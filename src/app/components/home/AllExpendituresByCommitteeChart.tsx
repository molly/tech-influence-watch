import sharedStyles from "@/app/shared.module.css";
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
}: {
  expenditures: Record<string, number>;
  committeeConstants: Record<string, CommitteeConstant>;
  labelId: string;
  sector: Sector;
}) {
  const committees = Object.keys(expenditures)
    .sort((a, b) => expenditures[b] - expenditures[a])
    .slice(0, 6);

  const max = Math.max(...committees.map((id) => expenditures[id]), 0);

  return (
    <ul className={styles.bars}>
      {committees.map((id) => {
        const spending = expenditures[id];
        const name = committeeConstants[id]?.name ?? id;
        const pct = max > 0 ? (spending / max) * 100 : 0;

        return (
          <li key={id} className={styles.barRow}>
            <div className={styles.labelRow}>
              <a href={`/2026/committees/${id}`} className={`${styles.label} secondaryLink`}>
                {name}
                {sector === "all" && committeeConstants[id]?.sector && (
                  <span className={sharedStyles.sectorBadge}>
                    {committeeConstants[id].sector}
                  </span>
                )}
              </a>
              <span className={styles.value}>{formatCompact(spending)}</span>
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
