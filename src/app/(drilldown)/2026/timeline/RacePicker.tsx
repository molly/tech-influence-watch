import { STATES_BY_ABBR } from "@/app/data/states";
import { formatCompact } from "@/app/utils/humanize";

import { RankingRow } from "./RaceRanking";
import styles from "./SpendingFlow.module.css";
import { getRaceLabel } from "./spendingFlowUtils";

// A dropdown of every race on the map, for screens where the circles are too
// small to tap reliably.
export default function RacePicker({
  rows,
  selectedId,
  onSelect,
}: {
  rows: RankingRow[];
  selectedId: string | null;
  onSelect: (raceId: string | null) => void;
}) {
  const byState = new Map<string, RankingRow[]>();
  for (const row of rows) {
    const state = STATES_BY_ABBR[row.race.state] ?? row.race.state;
    const list = byState.get(state);
    if (list) {
      list.push(row);
    } else {
      byState.set(state, [row]);
    }
  }
  // States alphabetically; within a state, the Senate race first, then House
  // races by spending.
  const groups = [...byState.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([state, stateRows]) => ({
      state,
      rows: stateRows.sort(
        (a, b) =>
          Number(b.race.office === "S") - Number(a.race.office === "S") ||
          b.total - a.total,
      ),
    }));
  const value =
    selectedId && rows.some((row) => row.race.id === selectedId)
      ? selectedId
      : "";

  return (
    <label className={styles.racePicker}>
      <span className={styles.filterLabel}>Or pick a race</span>
      <select
        className={styles.racePickerSelect}
        value={value}
        onChange={(e) => onSelect(e.target.value || null)}
      >
        <option value="">
          {rows.length} {rows.length === 1 ? "race" : "races"} with spending
        </option>
        {groups.map((group) => (
          <optgroup key={group.state} label={group.state}>
            {group.rows.map((row) => (
              <option key={row.race.id} value={row.race.id}>
                {getRaceLabel(row.race)} · {formatCompact(Math.round(row.total))}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  );
}
