import { DateTime } from "luxon";
import Link from "next/link";

import sharedStyles from "@/app/shared.module.css";
import { Sector } from "@/app/types/Sector";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";
import { sectorHref } from "@/app/utils/sector";

import HelpsBars from "./HelpsBars";
import styles from "./SpendingFlow.module.css";
import {
  FlowExpenditure,
  FlowRace,
  getHelpsLines,
  getRaceLabel,
} from "./spendingFlowUtils";

const MAX_ROWS = 10;
const MAX_LINES = 3;

export interface RankingRow {
  race: FlowRace;
  expenditures: FlowExpenditure[];
  total: number;
  thisWeek: number;
}

function RaceTags({ row, today }: { row: RankingRow; today: string }) {
  const generalOnly = row.expenditures.every((e) => e.stage === "general");
  const primaryOnly = row.expenditures.every((e) => e.stage === "primary");
  const upcomingGeneral =
    row.race.generalDate && row.race.generalDate >= today
      ? DateTime.fromISO(row.race.generalDate).toFormat("LLL d")
      : null;
  return (
    <div className={styles.tags}>
      {primaryOnly && <span className={`${styles.tag} ${styles.tagOutline}`}>Primary</span>}
      {generalOnly && (
        <span className={styles.tag}>
          General{upcomingGeneral ? ` · ${upcomingGeneral}` : ""}
        </span>
      )}
      {row.thisWeek > 0 && (
        <span className={`${styles.tag} ${styles.tagWeek}`}>
          +{humanizeRoundedCurrency(row.thisWeek, true, 1)} this week
        </span>
      )}
    </div>
  );
}

export default function RaceRanking({
  rows,
  selectedId,
  onSelect,
  throughLabel,
  sector,
  today,
}: {
  rows: RankingRow[];
  selectedId: string | null;
  onSelect: (raceId: string) => void;
  throughLabel: string;
  sector: Sector;
  today: string;
}) {
  const top = rows.slice(0, MAX_ROWS).map((row) => ({
    ...row,
    lines: getHelpsLines(row.expenditures).slice(0, MAX_LINES),
  }));
  const max = Math.max(
    0,
    ...top.flatMap((row) => row.lines.map((line) => line.total)),
  );

  return (
    <section className={styles.ranking}>
      <h2 className={sharedStyles.sectionTitle}>
        Races drawing the most tech money
        <span className={sharedStyles.sectionTitleAmount}>{throughLabel}</span>
      </h2>
      {top.length === 0 ? (
        <p className={sharedStyles.subtitle}>
          No tech spending yet in races matching these filters.
        </p>
      ) : (
        <table className={styles.rankingTable}>
          <thead>
            <tr>
              <th>#</th>
              <th>Race</th>
              <th className={styles.helpsColumn}>Who the money helps</th>
              <th className="number-cell">Total</th>
            </tr>
          </thead>
          <tbody>
            {top.map((row, i) => (
              <tr
                key={row.race.id}
                className={
                  row.race.id === selectedId
                    ? `${styles.rankingRow} ${styles.rankingRowActive}`
                    : styles.rankingRow
                }
                onClick={() => onSelect(row.race.id)}
              >
                <td className={styles.rank}>
                  {String(i + 1).padStart(2, "0")}
                </td>
                <td>
                  <button
                    type="button"
                    className={styles.rankingRaceName}
                    aria-pressed={row.race.id === selectedId}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(row.race.id);
                    }}
                  >
                    {getRaceLabel(row.race)}
                  </button>
                  <RaceTags row={row} today={today} />
                </td>
                <td>
                  <HelpsBars lines={row.lines} max={max} />
                </td>
                <td className={styles.rankingTotal}>
                  {humanizeRoundedCurrency(row.total, true, 1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className={styles.rankingFoot}>
        <span>
          {top.length > 0 &&
            `Top ${top.length} of ${rows.length} races with tech spending`}
        </span>
        <Link href={sectorHref("/2026/elections", sector)}>
          See all races &rarr;
        </Link>
      </div>
    </section>
  );
}
