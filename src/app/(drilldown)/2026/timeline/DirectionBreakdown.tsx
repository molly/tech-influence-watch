import barStyles from "@/app/components/home/HorizontalBars.module.css";
import {
  humanizePercentage,
  humanizeRoundedCurrency,
} from "@/app/utils/humanize";

import styles from "./SpendingFlow.module.css";
import { DIRECTIONS, DirectionTotals, FlowDirection } from "./spendingFlowUtils";

export const DIRECTION_FILL: Record<FlowDirection, string> = {
  R: barStyles.colorRepublican,
  D: barStyles.colorDemocrat,
  U: barStyles.colorUnknownParty,
};

export function DirectionSwatch({ direction }: { direction: FlowDirection }) {
  return (
    <span
      className={`${barStyles.legendSwatch} ${DIRECTION_FILL[direction]}`}
      aria-hidden={true}
    />
  );
}

export default function DirectionBreakdown({
  totals,
}: {
  totals: DirectionTotals;
}) {
  return (
    <div className={styles.directionBreakdown}>
      <div
        className={barStyles.track}
        role="img"
        aria-label={DIRECTIONS.map(
          ({ key, label }) =>
            `${label}: ${humanizeRoundedCurrency(totals[key], true, 1)}`,
        ).join(", ")}
      >
        {totals.total > 0 &&
          DIRECTIONS.map(({ key }) =>
            totals[key] > 0 ? (
              <div
                key={key}
                className={`${barStyles.segment} ${DIRECTION_FILL[key]}`}
                style={{ width: `${(totals[key] / totals.total) * 100}%` }}
              />
            ) : null,
          )}
      </div>
      <div className={styles.directionLegend}>
        {DIRECTIONS.map(({ key, label }) => (
          <div key={key}>
            <div className={styles.directionValue}>
              <DirectionSwatch direction={key} />
              <span className="bold">
                {humanizeRoundedCurrency(totals[key], true, 1)}
              </span>
              <span className={styles.directionPct}>
                {humanizePercentage(totals[key], totals.total)}
              </span>
            </div>
            <div className={styles.directionLabel}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
