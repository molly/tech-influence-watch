import { formatCompact } from "@/app/utils/humanize";

import styles from "./SpendingFlow.module.css";
import { weekStart } from "./spendingFlowUtils";

export interface WeekBucket {
  R: number;
  D: number;
  U: number;
  total: number;
}

export function emptyBucket(): WeekBucket {
  return { R: 0, D: 0, U: 0, total: 0 };
}

// Stacked bottom to top.
const SEGMENTS: { key: keyof WeekBucket; className: string }[] = [
  { key: "U", className: styles.fillU },
  { key: "D", className: styles.fillD },
  { key: "R", className: styles.fillR },
];

const PLOT_HEIGHT = 100;
const BAR_WIDTH = 10;

// Round a gridline step up to 1, 2, 2.5, or 5 times a power of ten.
function niceStep(value: number): number {
  const power = Math.pow(10, Math.floor(Math.log10(value)));
  const m = value / power;
  if (m <= 1) {
    return power;
  }
  if (m <= 2) {
    return 2 * power;
  }
  if (m <= 2.5) {
    return 2.5 * power;
  }
  if (m <= 5) {
    return 5 * power;
  }
  return 10 * power;
}

// Month starts within the first numWeeks weeks, as fractional week offsets.
export function getMonthTicks(numWeeks: number, monthStep: number) {
  const ticks: { label: string; week: number }[] = [];
  const first = weekStart(0);
  const last = weekStart(numWeeks);
  let month = first.startOf("month");
  let i = 0;
  while (month < last) {
    if (i % monthStep === 0) {
      const weeks = month.diff(first, "days").days / 7;
      ticks.push({
        label: month.month === 1 ? month.toFormat("LLL yyyy") : month.toFormat("LLL"),
        week: weeks,
      });
    }
    month = month.plus({ months: 1 });
    i++;
  }
  return ticks;
}

export default function WeeklyBars({
  series,
  small,
  label,
}: {
  series: WeekBucket[];
  small?: boolean;
  label: string;
}) {
  const n = series.length;
  const max = Math.max(...series.map((s) => s.total), 0);
  const step = max > 0 ? niceStep(max / 4) : 1000;
  const top = step * 4;

  const bars = series.flatMap((bucket, week) => {
    let y = PLOT_HEIGHT;
    return SEGMENTS.map(({ key, className }) => {
      const height = (bucket[key] / top) * PLOT_HEIGHT;
      y -= height;
      if (height <= 0) {
        return null;
      }
      return (
        <rect
          key={`${week}-${key}`}
          x={week * BAR_WIDTH + 1.5}
          y={y}
          width={BAR_WIDTH - 3}
          height={height}
          className={className}
        />
      );
    });
  });

  return (
    <div className={small ? `${styles.barChart} ${styles.barChartSmall}` : styles.barChart}>
      <div className={styles.barChartY} aria-hidden={true}>
        {[4, 3, 2, 1, 0].map((k) => (
          <span key={k}>{k ? formatCompact(step * k) : "$0"}</span>
        ))}
      </div>
      <div className={styles.barChartPlot}>
        <svg
          viewBox={`0 0 ${n * BAR_WIDTH} ${PLOT_HEIGHT}`}
          preserveAspectRatio="none"
          role="img"
          aria-label={label}
        >
          {[1, 2, 3].map((k) => (
            <line
              key={k}
              x1={0}
              x2={n * BAR_WIDTH}
              y1={PLOT_HEIGHT - (k / 4) * PLOT_HEIGHT}
              y2={PLOT_HEIGHT - (k / 4) * PLOT_HEIGHT}
              className={styles.gridline}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {bars}
          <line
            x1={0}
            x2={n * BAR_WIDTH}
            y1={PLOT_HEIGHT}
            y2={PLOT_HEIGHT}
            className={styles.baseline}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
      <div />
      <div className={styles.barChartX} aria-hidden={true}>
        {getMonthTicks(n, small ? 3 : 2).map((tick) => (
          <span key={tick.week} style={{ left: `${(tick.week / n) * 100}%` }}>
            {tick.label}
          </span>
        ))}
      </div>
    </div>
  );
}
