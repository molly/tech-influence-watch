import { humanizeRoundedCurrency } from "@/app/utils/humanize";
import { getRaceHeadline } from "@/app/utils/races";

import styles from "./page.module.css";

export interface SeatAmount {
  raceId: string;
  amount: number;
}

export interface CycleSeats {
  year: string;
  seats: SeatAmount[];
  // A group of seats near one amount to label on the chart
  cluster?: { amount: number; lines: string[] };
}

// Combine each seat's contests (primary, runoff, general) into one amount
export function bySeat(contests: SeatAmount[]): SeatAmount[] {
  const seats = new Map<string, number>();
  for (const { raceId, amount } of contests) {
    seats.set(raceId, (seats.get(raceId) ?? 0) + amount);
  }
  return [...seats].map(([raceId, amount]) => ({ raceId, amount }));
}

// SVG coordinates. The viewBox scales with the frame, so these are only
// relative sizes.
const WIDTH = 720;
const RADIUS = 5;
const PADDING = RADIUS + 1;
// The largest seat's label sits above its dot, clear of any neighboring
// column, with a leader line down to the dot
const LABEL_RISE = 24;
// Two lines of label, at the larger phone font size
const LABEL_ROOM = LABEL_RISE + 40;
const LINE_HEIGHT = "1.2em";

// Log scale from $10,000 to $100 million. The tick labels are spaced evenly
// in CSS, so the ticks need to be one decade apart.
const MIN_EXP = 4;
const MAX_EXP = 8;
const TICKS = [
  { exp: 4, label: "$10k" },
  { exp: 5, label: "$100k" },
  { exp: 6, label: "$1M" },
  { exp: 7, label: "$10M" },
  { exp: 8, label: "$100M" },
];

function xPct(amount: number) {
  return ((Math.log10(amount) - MIN_EXP) / (MAX_EXP - MIN_EXP)) * 100;
}

function x(amount: number) {
  return PADDING + (xPct(amount) / 100) * (WIDTH - 2 * PADDING);
}

function currency(amount: number) {
  return humanizeRoundedCurrency(amount, true, 1);
}

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2) {
    return sorted[mid];
  }
  return (sorted[mid - 1] + sorted[mid]) / 2;
}

// Beeswarm: place each dot as close to the center line as it can go without
// overlapping a dot already placed
function swarm(seats: SeatAmount[]) {
  const placed: { x: number; y: number }[] = [];
  for (const { amount } of [...seats].sort((a, b) => a.amount - b.amount)) {
    const cx = x(amount);
    const neighbors = placed.filter((p) => Math.abs(p.x - cx) < 2 * RADIUS);
    let y = 0;
    for (let step = 0; ; step++) {
      y = Math.ceil(step / 2) * (step % 2 ? -1 : 1);
      const collides = neighbors.some(
        (p) => Math.hypot(p.x - cx, p.y - y) < 2 * RADIUS + 1,
      );
      if (!collides) {
        break;
      }
    }
    placed.push({ x: cx, y });
  }
  return placed;
}

function Strip({ year, seats, cluster }: CycleSeats) {
  const amounts = seats.map((s) => s.amount);
  const dots = swarm(seats);
  const extent = Math.max(
    Math.max(...dots.map((d) => Math.abs(d.y))) + PADDING,
    LABEL_ROOM,
  );
  const height = extent * 2;
  const mid = median(amounts);
  const total = amounts.reduce((sum, a) => sum + a, 0);
  const largest = seats.reduce((a, b) => (b.amount > a.amount ? b : a));
  // The swarm is placed smallest first, so the largest seat is the last dot
  const largestDot = dots[dots.length - 1];
  // Label the cluster beside the top of its column
  const clusterTop =
    cluster &&
    dots
      .filter((d) => Math.abs(d.x - x(cluster.amount)) < 2 * RADIUS)
      .reduce((a, b) => (b.y < a.y ? b : a));
  return (
    <div className={styles.strip}>
      <h3 className={styles.panelTitle}>{year}</h3>
      <p className={styles.panelSubtitle}>
        {currency(total)} across {seats.length} seats, median {currency(mid)}
      </p>
      <svg
        className={styles.stripSvg}
        viewBox={`0 ${-extent} ${WIDTH} ${height}`}
        role="img"
        aria-label={`${year}: ${seats.length} seats, median ${currency(mid)}, largest ${getRaceHeadline(largest.raceId)} at ${currency(largest.amount)}`}
      >
        {TICKS.map((tick) => (
          <line
            key={tick.exp}
            className={styles.stripGrid}
            x1={x(10 ** tick.exp)}
            x2={x(10 ** tick.exp)}
            y1={-extent}
            y2={extent}
          />
        ))}
        {dots.map((dot, i) => (
          <circle
            key={i}
            className={styles.stripDot}
            cx={dot.x}
            cy={dot.y}
            r={RADIUS}
          />
        ))}
        <line
          className={styles.stripMedian}
          x1={x(mid)}
          x2={x(mid)}
          y1={-extent}
          y2={extent}
        />
        <text className={styles.stripLabel} x={x(mid) + 4} y={-extent + 12}>
          Median
        </text>
        <line
          className={styles.stripLeader}
          x1={largestDot.x}
          x2={largestDot.x}
          y1={largestDot.y - RADIUS - 2}
          y2={largestDot.y - LABEL_RISE - 10}
        />
        <text
          className={styles.stripLabel}
          x={largestDot.x - 4}
          y={largestDot.y - LABEL_RISE}
          textAnchor="end"
        >
          <tspan x={largestDot.x - 4} dy={`-${LINE_HEIGHT}`}>
            {getRaceHeadline(largest.raceId)}
          </tspan>
          <tspan x={largestDot.x - 4} dy={LINE_HEIGHT}>
            {currency(largest.amount)}
          </tspan>
        </text>
        {cluster && clusterTop && (
          <text
            className={styles.stripLabel}
            x={clusterTop.x - RADIUS - 6}
            y={clusterTop.y + 4}
            textAnchor="end"
          >
            {cluster.lines.map((line, i) => (
              <tspan
                key={line}
                x={clusterTop.x - RADIUS - 6}
                dy={i === 0 ? 0 : LINE_HEIGHT}
              >
                {line}
              </tspan>
            ))}
          </text>
        )}
      </svg>
    </div>
  );
}

export default function SeatDistribution({ cycles }: { cycles: CycleSeats[] }) {
  return (
    <>
      {cycles.map((cycle) => (
        <Strip key={cycle.year} {...cycle} />
      ))}
      <div className={styles.stripAxis} aria-hidden={true}>
        {TICKS.map((tick) => (
          <span key={tick.exp} className={styles.stripTick}>
            <span>{tick.label}</span>
          </span>
        ))}
      </div>
    </>
  );
}
