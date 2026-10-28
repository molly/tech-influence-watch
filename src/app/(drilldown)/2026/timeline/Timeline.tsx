"use client";

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
];

// Stacked bottom to top.
const SEGMENTS: { key: FlowDirection; className: string }[] = [
  { key: "D", className: styles.fillD },
  { key: "R", className: styles.fillR },
];

const PLOT_HEIGHT = 100;
const BAR_STEP = 10;
const BAR_WIDTH = 7;

export default function Timeline({
  ref,
  series,
  week,
  lastWeek,
  onWeekChange,
  playing,
  onTogglePlay,
  speed,
  onSpeedChange,
  techLabel,
  throughDate,
}: {
  ref?: React.Ref<HTMLDivElement>;
  series: WeekBucket[];
  week: number;
  lastWeek: number;
  onWeekChange: (week: number) => void;
  playing: boolean;
  onTogglePlay: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  techLabel: string;
  // The last day included at the selected week, e.g. "Oct 31, 2026".
  throughDate: string;
}) {
  const [hoverWeek, setHoverWeek] = useState<number | null>(null);
  const span = Math.max(lastWeek, 1);
  // Week positions line up with the slider thumb's center, which travels the
  // inner track (the track minus half a thumb on each side).
  const position = (w: number) => (w / span) * 100;
  const weeks = series.slice(0, lastWeek + 1);
  const max = Math.max(0, ...weeks.map((bucket) => bucket.total));

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
    <div className={styles.timeline} ref={ref}>
      <div className={styles.playGroup}>
        <PlayButton playing={playing} onTogglePlay={onTogglePlay} />
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
      <WeekOf throughDate={throughDate} />
      <div className={styles.timelineTrack}>
        <div className={styles.timelineEvents} aria-hidden={true}>
          {EVENTS.map((event) => {
            const eventWeek = getWeekIndex(event.date);
            if (eventWeek > lastWeek) {
              return null;
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
              aria-label={`Weekly ${techLabel} spending nationwide in 2026`}
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
          <WeekSlider
            week={week}
            lastWeek={lastWeek}
            onWeekChange={onWeekChange}
            throughDate={throughDate}
          />
        </div>
        <MonthTicks lastWeek={lastWeek} />
      </div>
    </div>
  );
}

// The play button, date, and slider in one slim row, for places the main
// timeline is out of view: the bar that sticks to the top of the page, and the
// race panel's bottom sheet. It drives the same week as the main timeline.
export function CompactTimeline({
  week,
  lastWeek,
  onWeekChange,
  playing,
  onTogglePlay,
  throughDate,
}: {
  week: number;
  lastWeek: number;
  onWeekChange: (week: number) => void;
  playing: boolean;
  onTogglePlay: () => void;
  throughDate: string;
}) {
  return (
    <div className={styles.timelineCompact}>
      <PlayButton playing={playing} onTogglePlay={onTogglePlay} />
      <div className={styles.compactDate}>
        <span className={styles.annotation}>Through</span>{" "}
        <span className="bold">{throughDate}</span>
      </div>
      <div className={styles.compactTrack}>
        <WeekSlider
          week={week}
          lastWeek={lastWeek}
          onWeekChange={onWeekChange}
          throughDate={throughDate}
        />
      </div>
    </div>
  );
}

function PlayButton({
  playing,
  onTogglePlay,
}: {
  playing: boolean;
  onTogglePlay: () => void;
}) {
  return (
    <button
      type="button"
      className={styles.playButton}
      onClick={onTogglePlay}
      aria-label={playing ? "Pause" : "Play"}
    >
      <span className={playing ? styles.pauseIcon : styles.playIcon} />
    </button>
  );
}

function WeekOf({ throughDate }: { throughDate: string }) {
  return (
    <div className={styles.weekOf}>
      <div className={styles.annotation}>Through</div>
      <div className={styles.weekOfValue}>{throughDate}</div>
    </div>
  );
}

function WeekSlider({
  week,
  lastWeek,
  onWeekChange,
  throughDate,
}: {
  week: number;
  lastWeek: number;
  onWeekChange: (week: number) => void;
  throughDate: string;
}) {
  return (
    <div className={styles.rangeWrapper}>
      <div
        className={styles.rangeFill}
        style={{
          width: `calc(0.375rem + (100% - 0.75rem) * ${week / Math.max(lastWeek, 1)})`,
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
        aria-valuetext={`Through ${throughDate}`}
        onChange={(e) => onWeekChange(Number(e.target.value))}
      />
    </div>
  );
}

function MonthTicks({ lastWeek }: { lastWeek: number }) {
  return (
    <div className={styles.timelineTicks} aria-hidden={true}>
      {getMonthTicks(lastWeek + 1, 1).map((tick) => (
        <span
          key={tick.week}
          style={{ left: `${(tick.week / Math.max(lastWeek, 1)) * 100}%` }}
        >
          {tick.label}
        </span>
      ))}
    </div>
  );
}
