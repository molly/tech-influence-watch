import { ExpendituresByPartySnapshot } from "../types/Expenditures";
import { formatCompact } from "../utils/humanize";
import { formatCurrency } from "../utils/utils";
import { HorizontalBarItem, HorizontalBars } from "./home/HorizontalBars";
import styles from "./home/HorizontalBars.module.css";

const GROUPS = [
  {
    header: "Support",
    rows: [
      { key: "dem_support" as const, label: "Democrat" },
      { key: "rep_support" as const, label: "Republican" },
    ],
  },
  {
    header: "Oppose",
    rows: [
      { key: "dem_oppose" as const, label: "Democrat" },
      { key: "rep_oppose" as const, label: "Republican" },
    ],
  },
];

export function SpendingByPartySkeleton() {
  return (
    <div className={styles.groups}>
      {GROUPS.map((group) => {
        const items: HorizontalBarItem[] = group.rows.map(({ key, label }) => ({
          key,
          label,
          value: 0,
        }));

        return (
          <div key={group.header} className={styles.group}>
            <div className={styles.groupHeader}>{group.header}</div>
            <HorizontalBars items={items} />
          </div>
        );
      })}
    </div>
  );
}

export default function SpendingByPartyWithOpposition({
  expenditures,
  labelId: _labelId,
  max,
}: {
  expenditures: ExpendituresByPartySnapshot;
  labelId: string;
  max?: number;
}) {
  const allKeys = GROUPS.flatMap((g) => g.rows.map((r) => r.key));
  const globalMax = max ?? allKeys.reduce((sum, k) => sum + expenditures[k], 0);

  return (
    <div className={styles.groups}>
      {GROUPS.map((group) => {
        const items: HorizontalBarItem[] = group.rows.map(({ key, label }) => ({
          key,
          label,
          value: expenditures[key],
          displayValue: formatCompact(expenditures[key]),
          ariaLabel: `${label}: ${formatCurrency(expenditures[key], true)}`,
        }));

        return (
          <div key={group.header} className={styles.group}>
            <div className={styles.groupHeader}>{group.header}</div>
            <HorizontalBars items={items} max={globalMax} />
          </div>
        );
      })}
    </div>
  );
}
