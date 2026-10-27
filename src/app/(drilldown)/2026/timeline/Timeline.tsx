"use client";

import { DateTime } from "luxon";
import { useState } from "react";

import { humanizeRoundedCurrency } from "@/app/utils/humanize";

import styles from "./SpendingFlow.module.css";
import {
  FlowDirection,
  formatShortDate,
  getWeekIndex,
  weekStart,
} from "./spendingFlowUtils";
import { getMonthTicks, WeekBucket } from "./WeeklyBars";

const SPEEDS = [1, 2, 4];

const EVENTS = [
  { date: "2026-03-03", label: "First primaries" },
  { date: "2026-09-15", label: "Last primaries" },
  { date: "2026-11-03", label: "General election" },
];

// Stacked bottom to top.
const SEGMENTS: { key: FlowDirection; className: string }[] = [
  { key: "U", className: styles.fillU },
  { key: "D", className: styles.fillD },
  { key: "R", className: styles.fillR },
];

const PLOT_HEIGHT = 100;
const BAR_STEP = 10;
const BAR_WIDTH = 7;

export default function Timeline({
  series,
  week,
  lastWeek,
  onWeekChange,
  playing,
  onTogglePlay,
  speed,
  onSpeedChange,
}: {
  series: WeekBucket[];
  week: number;
  lastWeek: number;
  onWeekChange: (week: number) => void;
  playing: boolean;
  onTogglePlay: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
}) {
  const [hoverWeek, setHoverWeek] = useState<number | null>(null);
  const span = Math.max(lastWeek, 1);
  // Week positions line up with the slider thumb's center, which travels the
  // inner track (the track minus half a thumb on each side).
  const position = (w: number) => (w / span) * 100;
  const weeks = series.slice(0, lastWeek + 1);
  const max = Math.max(0, ...weeks.map((bucket) => bucket.total));
  const weekLabel = weekStart(week).toFormat("LLL d, yyyy");

  const weekAt = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const fraction = (e.clientX - rect.left) / rect.width;
    return Math.min(lastWeek, Math.max(0, Math.round(fraction * span)));
  };

  // Weeks after the selected one are faded.
  const bars = weeks.flatMap((bucket, w) => {
    const state = w > week ? styles.histogramFuture : "";
    let y = PLOT_HEIGHT;
    return SEGMENTS.map(({ key, className }) => {
      const height = max > 0 ? (bucket[key] / max) * PLOT_HEIGHT : 0;
      y -= height;
      if (height <= 0) {
        return null;
      }
      return (
        <rect
          key={`${w}-${key}`}
          x={w * BAR_STEP - BAR_WIDTH / 2}
          y={y}
          width={BAR_WIDTH}
          height={height}
          className={`${className} ${state}`}
        />
      );
    });
  });

  const hovered = hoverWeek !== null ? weeks[hoverWeek] : null;

  return (
    <div className={styles.timeline}>
      <div className={styles.playGroup}>
        <button
          type="button"
          className={styles.playButton}
          onClick={onTogglePlay}
          aria-label={playing ? "Pause" : "Play"}
        >
          <span className={playing ? styles.pauseIcon : styles.playIcon} />
        </button>
        <button
          type="button"
          className={styles.speedButton}
          title="Playback speed"
          aria-label={`Playback speed ${speed}×`}
          onClick={() =>
            onSpeedChange(SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length])
          }
        >
          {speed}×
        </button>
      </div>
      <div className={styles.weekOf}>
        <div className={styles.annotation}>Week of</div>
        <div className={styles.weekOfValue}>{weekLabel}</div>
      </div>
      <div className={styles.timelineTrack}>
        <div className={styles.timelineEvents} aria-hidden={true}>
          {EVENTS.map((event) => {
            const eventWeek = getWeekIndex(event.date);
            if (eventWeek > lastWeek) {
              const date = formatShortDate(DateTime.fromISO(event.date));
              return (
                <span key={event.date} className={styles.eventEnd}>
                  {event.label} · {date}
                </span>
              );
            }
            // Labels in the right half hang left of their tick.
            const left = position(eventWeek);
            return (
              <span
                key={event.date}
                className={left > 50 ? styles.eventRight : undefined}
                style={{ left: `${left}%` }}
              >
                {event.label}
              </span>
            );
          })}
        </div>
        <div className={styles.timelineChart}>
          <div
            className={styles.histogram}
            onMouseMove={(e) => setHoverWeek(weekAt(e))}
            onMouseLeave={() => setHoverWeek(null)}
            onClick={(e) => onWeekChange(weekAt(e))}
          >
            <svg
              viewBox={`0 0 ${span * BAR_STEP} ${PLOT_HEIGHT}`}
              preserveAspectRatio="none"
              role="img"
              aria-label="Weekly tech spending nationwide in 2026"
            >
              {bars}
            </svg>
            {hovered && hoverWeek !== null && (
              <div
                className={styles.histogramTooltip}
                style={{ left: `${position(hoverWeek)}%` }}
              >
                Week of {formatShortDate(weekStart(hoverWeek))}
                <span className="bold">
                  {humanizeRoundedCurrency(hovered.total, true, 1)}
                </span>
              </div>
            )}
          </div>
          <div className={styles.eventTicks} aria-hidden={true}>
            {EVENTS.map((event) => {
              const eventWeek = getWeekIndex(event.date);
              return eventWeek > lastWeek ? null : (
                <span
                  key={event.date}
                  style={{ left: `${position(eventWeek)}%` }}
                />
              );
            })}
          </div>
          <div className={styles.rangeWrapper}>
            <div
              className={styles.rangeFill}
              style={{
                width: `calc(0.375rem + (100% - 0.75rem) * ${week / span})`,
              }}
            />
            <input
              type="range"
              className={styles.range}
              min={0}
              max={lastWeek}
              step={1}
              value={week}
              aria-label="Week"
              aria-valuetext={`Week of ${weekLabel}`}
              onChange={(e) => onWeekChange(Number(e.target.value))}
            />
          </div>
        </div>
        <div className={styles.timelineTicks} aria-hidden={true}>
          {getMonthTicks(lastWeek + 1, 1).map((tick) => (
            <span key={tick.week} style={{ left: `${position(tick.week)}%` }}>
              {tick.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
