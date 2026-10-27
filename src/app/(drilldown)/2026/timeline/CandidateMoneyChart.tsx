"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

import { formatCompact } from "@/app/utils/humanize";

import styles from "./SpendingFlow.module.css";
import { niceStep } from "./WeeklyBars";

// Past this share of the axis, the value label sits inside the bar's end.
const LABEL_INSIDE_AT = 70;
// An inside label's text color depends on the segment it mostly sits over,
// which can only be known after layout: the bar's last segment can be a sliver
// narrower than the label. Sets data-on on each inside label.
function markLabelSegments(plot: HTMLElement) {
  for (const label of plot.querySelectorAll<HTMLElement>("[data-inside]")) {
    const labelRect = label.getBoundingClientRect();
    let best: { key: string; overlap: number } | null = null;
    const segments = label.parentElement?.querySelectorAll<HTMLElement>(
      "[data-segment]",
    );
    for (const segment of segments ?? []) {
      const rect = segment.getBoundingClientRect();
      const overlap =
        Math.min(rect.right, labelRect.right) -
        Math.max(rect.left, labelRect.left);
      if (overlap > 0 && (!best || overlap > best.overlap)) {
        best = { key: segment.dataset.segment ?? "", overlap };
      }
    }
    if (best) {
      label.dataset.on = best.key;
    } else {
      delete label.dataset.on;
    }
  }
}

export interface MoneyBar {
  key: string;
  label: string;
  note?: string | null;
  segments: { key: string; value: number; className: string }[];
}

// Gridline ticks for an axis from $0 that covers max. Every candidate chart in
// a race uses the same max so their bars share one scale.
export function getMoneyAxis(max: number): { top: number; ticks: number[] } {
  if (max <= 0) {
    return { top: 1, ticks: [0] };
  }
  const step = niceStep(max / 3);
  const top = Math.ceil(max / step) * step;
  const ticks = [];
  for (let value = 0; value <= top; value += step) {
    ticks.push(value);
  }
  return { top, ticks };
}

function formatAmount(value: number): string {
  return formatCompact(Math.round(value));
}

export default function CandidateMoneyChart({
  bars,
  top,
  ticks,
}: {
  bars: MoneyBar[];
  top: number;
  ticks: number[];
}) {
  const position = (value: number) => (value / top) * 100;
  const plotRef = useRef<HTMLDivElement>(null);

  // Re-mark after every render (bars change as the week changes) and whenever
  // the chart's width changes.
  useLayoutEffect(() => {
    if (plotRef.current) {
      markLabelSegments(plotRef.current);
    }
  });
  useEffect(() => {
    const plot = plotRef.current;
    if (!plot) {
      return;
    }
    const observer = new ResizeObserver(() => markLabelSegments(plot));
    observer.observe(plot);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.moneyChart}>
      <div className={styles.moneyChartPlot} ref={plotRef}>
        {ticks.map((tick) => (
          <span
            key={tick}
            className={styles.moneyChartGridline}
            style={{ left: `${position(tick)}%` }}
            aria-hidden={true}
          />
        ))}
        {bars.map((bar) => {
          const total = bar.segments.reduce((sum, s) => sum + s.value, 0);
          const width = position(total);
          const inside = width > LABEL_INSIDE_AT;
          return (
            <div key={bar.key} className={styles.moneyChartRow}>
              <div className={styles.moneyChartLabel}>
                <span className="bold">{bar.label}</span>
                {bar.note && (
                  <span className={styles.moneyChartNote}>{bar.note}</span>
                )}
              </div>
              <div
                className={styles.moneyChartBar}
                role="img"
                aria-label={`${bar.label}: ${formatAmount(total)}${bar.note ? `, ${bar.note}` : ""}`}
              >
                {bar.segments.map((segment) =>
                  segment.value > 0 ? (
                    <span
                      key={segment.key}
                      data-segment={segment.key}
                      className={segment.className}
                      style={{ width: `${position(segment.value)}%` }}
                    />
                  ) : null,
                )}
                <span
                  data-inside={inside || undefined}
                  className={
                    inside
                      ? `${styles.moneyChartValue} ${styles.moneyChartValueInside}`
                      : styles.moneyChartValue
                  }
                  style={
                    inside
                      ? { right: `calc(${100 - width}% + 0.375rem)` }
                      : { left: `calc(${width}% + 0.375rem)` }
                  }
                >
                  {formatAmount(total)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.moneyChartTicks} aria-hidden={true}>
        {ticks.map((tick) => (
          <span key={tick} style={{ left: `${position(tick)}%` }}>
            {formatAmount(tick)}
          </span>
        ))}
      </div>
    </div>
  );
}
