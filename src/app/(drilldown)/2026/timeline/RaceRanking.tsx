import { DateTime } from "luxon";
import Link from "next/link";
import { useState } from "react";

import Pagination from "@/app/components/Pagination";
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

const PAGE_SIZE = 10;
const MAX_LINES = 3;

export interface RankingRow {
  race: FlowRace;
  expenditures: FlowExpenditure[];
  total: number;
  thisWeek: number;
}

function RaceTags({
  row,
  today,
  weekLabel,
}: {
  row: RankingRow;
  today: string;
  weekLabel: string;
}) {
  const byStage = { primary: 0, general: 0 };
  for (const e of row.expenditures) {
    byStage[e.stage] += e.amount;
  }
  const upcomingGeneral =
    row.race.generalDate && row.race.generalDate >= today
      ? DateTime.fromISO(row.race.generalDate).toFormat("LLL d")
      : null;
  return (
    <div className={styles.tags}>
      {byStage.primary > 0 && (
        <span className={`${styles.tag} ${styles.tagOutline}`}>
          Primary · {humanizeRoundedCurrency(byStage.primary, true, 1)}
        </span>
      )}
      {byStage.general > 0 && (
        <span className={styles.tag}>
          General{upcomingGeneral ? ` · ${upcomingGeneral}` : ""} ·{" "}
          {humanizeRoundedCurrency(byStage.general, true, 1)}
        </span>
      )}
      {row.thisWeek > 0 && (
        <span className={`${styles.tag} ${styles.tagWeek}`}>
          +{humanizeRoundedCurrency(row.thisWeek, true, 1)} week of {weekLabel}
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
  weekLabel,
  sector,
  today,
}: {
  rows: RankingRow[];
  selectedId: string | null;
  onSelect: (raceId: string) => void;
  throughLabel: string;
  weekLabel: string;
  sector: Sector;
  today: string;
}) {
  const [page, setPage] = useState(1);
  const withLines = rows.map((row) => ({
    ...row,
    lines: getHelpsLines(row.expenditures).slice(0, MAX_LINES),
  }));
  // One scale across every page, so bars compare between pages.
  const max = Math.max(
    0,
    ...withLines.flatMap((row) => row.lines.map((line) => line.total)),
  );
  // The row count changes as the week and filters change; stay on a page that
  // exists.
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = withLines.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <section className={styles.ranking}>
      <h2 className={sharedStyles.sectionTitle}>
        Races drawing the most tech money
        <span className={sharedStyles.sectionTitleAmount}>{throughLabel}</span>
      </h2>
      {rows.length === 0 ? (
        <p className={sharedStyles.subtitle}>
          No tech spending yet in races matching these filters.
        </p>
      ) : (
        <table className={styles.rankingTable}>
          <thead>
            <tr>
              <th>Race</th>
              <th className={styles.helpsColumn}>Who the money helps</th>
              <th className="number-cell">Total</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr
                key={row.race.id}
                className={
                  row.race.id === selectedId
                    ? `${styles.rankingRow} ${styles.rankingRowActive}`
                    : styles.rankingRow
                }
                onClick={() => onSelect(row.race.id)}
              >
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
                  <RaceTags row={row} today={today} weekLabel={weekLabel} />
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
      <Pagination
        page={currentPage}
        totalPages={totalPages}
        totalItems={rows.length}
        pageSize={PAGE_SIZE}
        itemLabel="races with tech spending"
        onPageChange={setPage}
      />
      <div className={styles.rankingFoot}>
        <Link href={sectorHref("/2026/elections", sector)}>
          See all races &rarr;
        </Link>
      </div>
    </section>
  );
}
