"use client";

import { useReducedMotion } from "framer-motion";
import { DateTime } from "luxon";
import { useEffect, useMemo, useRef, useState } from "react";

import barStyles from "@/app/components/home/HorizontalBars.module.css";
import MoneyCard from "@/app/components/MoneyCard";
import sharedStyles from "@/app/shared.module.css";
import { Sector } from "@/app/types/Sector";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";

import DirectionBreakdown, { DIRECTION_FILL } from "./DirectionBreakdown";
import RacePanel from "./RacePanel";
import RaceRanking, { RankingRow } from "./RaceRanking";
import SegmentedControl from "./SegmentedControl";
import styles from "./SpendingFlow.module.css";
import {
  DirectionTotals,
  FlowDirection,
  FlowExpenditure,
  formatShortDate,
  getPeriodLabel,
  getPeriodWeeks,
  getWeekIndex,
  inWeeks,
  matchesFilters,
  OfficeFilter,
  PeriodFilter,
  ShowFilter,
  SpendingFlowData,
  StageFilter,
  sumByDirection,
  weekStart,
} from "./spendingFlowUtils";
import SpendingMap, { MapItem, PING_MS, PingBatch } from "./SpendingMap";
import WeeklyBars, {
  BarMode,
  emptyBucket,
  getMonthTicks,
  WeekBucket,
} from "./WeeklyBars";

const STEP_MS = 900;
const SPEEDS = [1, 2, 4];

const TIMELINE_EVENTS = [
  { date: "2026-03-03", label: "First primaries" },
  { date: "2026-09-15", label: "Last primaries" },
  { date: "2026-11-03", label: "General election" },
];

const BAR_LEGENDS: Record<BarMode, { label: string; className: string }[]> = {
  total: [{ label: "All tech", className: styles.swatchTotal }],
  direction: [
    { label: "Favoring Republicans", className: DIRECTION_FILL.R },
    { label: "Favoring Democrats", className: DIRECTION_FILL.D },
    { label: "Unassigned / unclear", className: DIRECTION_FILL.U },
  ],
  sector: [
    { label: "Crypto", className: styles.swatchCrypto },
    { label: "AI", className: styles.swatchAi },
    { label: "Crypto and AI", className: styles.swatchTech },
  ],
};

function dominantDirection(totals: DirectionTotals): FlowDirection {
  if (totals.R >= totals.D && totals.R >= totals.U) {
    return "R";
  }
  return totals.D >= totals.U ? "D" : "U";
}

function directionValue(totals: DirectionTotals, show: ShowFilter): number {
  return show === "all" ? totals.total : totals[show];
}

function weeklySeries(
  expenditures: FlowExpenditure[],
  numWeeks: number,
  throughWeek: number,
): WeekBucket[] {
  const series = Array.from({ length: numWeeks }, emptyBucket);
  for (const e of expenditures) {
    if (e.week > throughWeek || e.week < 0) {
      continue;
    }
    const bucket = series[e.week];
    bucket[e.direction] += e.amount;
    bucket[e.sector] += e.amount;
    bucket.total += e.amount;
  }
  return series;
}

function groupByRace(expenditures: FlowExpenditure[]) {
  const byRace = new Map<string, FlowExpenditure[]>();
  for (const e of expenditures) {
    const list = byRace.get(e.raceId);
    if (list) {
      list.push(e);
    } else {
      byRace.set(e.raceId, [e]);
    }
  }
  return byRace;
}

function Change({ current, previous }: { current: number; previous: number }) {
  if (!previous) {
    return <>No spending in the previous 14 days</>;
  }
  const change = (current - previous) / previous;
  const up = change >= 0;
  return (
    <span className={up ? styles.changeUp : styles.changeDown}>
      <span className="bold">
        {up ? "↑" : "↓"} {Math.abs(Math.round(change * 100))}%
      </span>{" "}
      vs. previous 14 days
    </span>
  );
}

export default function SpendingFlow({
  data,
  sector,
}: {
  data: SpendingFlowData;
  sector: Sector;
}) {
  const lastWeek = data.numWeeks - 1;
  const [stage, setStage] = useState<StageFilter>("all");
  const [office, setOffice] = useState<OfficeFilter>("all");
  const [period, setPeriod] = useState<PeriodFilter>("14d");
  const [show, setShow] = useState<ShowFilter>("all");
  const [barMode, setBarMode] = useState<BarMode>("direction");
  const [week, setWeek] = useState(lastWeek);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [pings, setPings] = useState<PingBatch[]>([]);
  const reducedMotion = useReducedMotion();

  const filtered = useMemo(
    () => data.expenditures.filter((e) => matchesFilters(e, { stage, office })),
    [data.expenditures, stage, office],
  );
  const weeks = getPeriodWeeks(period, week);
  const periodLabel = getPeriodLabel(period, week, data.today);
  const shortPeriodLabel = periodLabel.replace(/, \d{4}$/, "");
  const is14d = period === "14d";

  const inPeriod = filtered.filter((e) => inWeeks(e, weeks));
  const byRace = groupByRace(inPeriod);
  const totals = sumByDirection(inPeriod);
  const previous = filtered.filter((e) =>
    inWeeks(e, [Math.max(0, week - 3), week - 2]),
  );
  const previousTotal = week >= 2 ? sumByDirection(previous).total : 0;
  const previousCount = week >= 2 ? groupByRace(previous).size : 0;

  const rankingRows: RankingRow[] = [...byRace.entries()]
    .filter(([raceId]) => data.races[raceId])
    .map(([raceId, expenditures]) => ({
      race: data.races[raceId],
      expenditures,
      total: sumByDirection(expenditures).total,
      thisWeek: sumByDirection(expenditures.filter((e) => e.week === week))
        .total,
    }))
    .sort((a, b) => b.total - a.total);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  // The map is cumulative regardless of the period filter: each circle is a
  // race's 2026 spending through the selected week, so circles grow as
  // spending lands.
  const cumulative = filtered.filter((e) => e.week >= 0 && e.week <= week);
  const cumulativeByRace = groupByRace(cumulative);
  const cumulativeTotal = sumByDirection(cumulative).total;
  const mapLabel = getPeriodLabel("all", week, data.today);
  const mapItems: MapItem[] = [...cumulativeByRace.entries()]
    .filter(([raceId]) => data.races[raceId])
    .map(([raceId, expenditures]) => {
      const raceTotals = sumByDirection(expenditures);
      return {
        race: data.races[raceId],
        totals: raceTotals,
        value: directionValue(raceTotals, show),
        direction: show === "all" ? dominantDirection(raceTotals) : show,
      };
    });

  // Circles are scaled against the largest race's full-year total, so sizes
  // stay comparable while scrubbing or playing.
  const radiusReference = useMemo(() => {
    const byRaceTotal = new Map<string, number>();
    for (const e of filtered) {
      if (show !== "all" && e.direction !== show) {
        continue;
      }
      byRaceTotal.set(e.raceId, (byRaceTotal.get(e.raceId) ?? 0) + e.amount);
    }
    return Math.max(0, ...byRaceTotal.values());
  }, [filtered, show]);

  const nationalSeries = weeklySeries(filtered, data.numWeeks, week);

  const selectedRace = selectedId ? (data.races[selectedId] ?? null) : null;
  const selectedExpenditures = selectedId ? (byRace.get(selectedId) ?? []) : [];
  const selectedSeries = weeklySeries(
    filtered.filter((e) => e.raceId === selectedId),
    data.numWeeks,
    week,
  );
  const siblings = selectedRace
    ? rankingRows
        .filter(
          (row) =>
            row.race.state === selectedRace.state &&
            row.race.id !== selectedRace.id,
        )
        .sort(
          (a, b) =>
            Number(b.race.office === "S") - Number(a.race.office === "S") ||
            b.total - a.total,
        )
        .map((row) => ({ race: row.race, total: row.total }))
    : [];

  // Playback and pings read the latest values through refs so the intervals
  // don't restart on every render.
  const weekRef = useRef(week);
  const pingSource = useRef({ filtered, show });
  useEffect(() => {
    weekRef.current = week;
    pingSource.current = { filtered, show };
  });

  const pingCounter = useRef(0);
  const firePings = (pingWeek: number) => {
    if (reducedMotion) {
      return;
    }
    const source = pingSource.current;
    const now = Date.now();
    pingCounter.current += 1;
    const batch: PingBatch = {
      id: pingCounter.current,
      time: now,
      expenditures: source.filtered.filter(
        (e) =>
          e.week === pingWeek &&
          (source.show === "all" || e.direction === source.show),
      ),
    };
    setPings((current) => [
      ...current.filter((b) => now - b.time < PING_MS),
      batch,
    ]);
  };
  const firePingsRef = useRef(firePings);
  useEffect(() => {
    firePingsRef.current = firePings;
  });

  useEffect(() => {
    if (!playing) {
      return;
    }
    const interval = window.setInterval(() => {
      const next = Math.min(weekRef.current + 1, lastWeek);
      setWeek(next);
      firePingsRef.current(next);
      if (next >= lastWeek) {
        setPlaying(false);
      }
    }, STEP_MS / speed);
    return () => window.clearInterval(interval);
  }, [playing, speed, lastWeek]);

  const togglePlay = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (week >= lastWeek) {
      setWeek(0);
    }
    setPlaying(true);
  };

  const sliderPosition = (w: number) => (w / Math.max(lastWeek, 1)) * 100;
  const weekLabel = weekStart(week).toFormat("LLL d, yyyy");

  return (
    <>
      <div className={styles.filters}>
        <SegmentedControl
          label="Election stage"
          value={stage}
          onChange={setStage}
          options={[
            { value: "all", label: "All" },
            { value: "primary", label: "Primaries" },
            { value: "general", label: "General" },
          ]}
        />
        <SegmentedControl
          label="Office"
          value={office}
          onChange={setOffice}
          options={[
            { value: "all", label: "All" },
            { value: "H", label: "House" },
            { value: "S", label: "Senate" },
          ]}
        />
        <SegmentedControl
          label="Time period"
          value={period}
          onChange={setPeriod}
          options={[
            { value: "14d", label: "Last 14 days" },
            { value: "all", label: "All of 2026" },
          ]}
        />
      </div>
      <div className={styles.body}>
        <div className={styles.left}>
          <div className={styles.mapBar}>
            <div className={styles.mapContext}>
              <span className={sharedStyles.highlightFigure}>
                {humanizeRoundedCurrency(cumulativeTotal, true, 1)}
              </span>{" "}
              across{" "}
              <span className={sharedStyles.highlightFigure}>
                {cumulativeByRace.size}
              </span>{" "}
              {cumulativeByRace.size === 1 ? "race" : "races"} · {mapLabel}
            </div>
            <SegmentedControl
              label="Show on map"
              value={show}
              onChange={setShow}
              options={[
                { value: "all", label: "All spending" },
                { value: "D", label: "Favoring Democrats" },
                { value: "R", label: "Favoring Republicans" },
                { value: "U", label: "Unassigned" },
              ]}
            />
          </div>
          <div className={styles.mapBox}>
            <SpendingMap
              items={mapItems}
              radiusReference={radiusReference}
              selectedId={selectedId}
              onSelect={setSelectedId}
              pings={pings}
              label={mapLabel}
            />
            <div className={styles.mapLegend}>
              {BAR_LEGENDS.direction.map((item) => (
                <div key={item.label} className={styles.mapLegendItem}>
                  <span className={`${barStyles.legendSwatch} ${item.className}`} />
                  {item.label}
                </div>
              ))}
              <div className={styles.mapLegendNote}>
                <span>Circle size = 2026 spending through the selected week</span>
                {!reducedMotion && (
                  <span className={styles.mapLegendItem}>
                    <svg width="22" height="22" aria-hidden={true}>
                      <circle className={styles.legendPingDot} cx="11" cy="11" r="4" />
                      <circle className={styles.legendPingRing} cx="11" cy="11" r="9" />
                    </svg>
                    Ping = a new expenditure, sized by amount
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className={styles.timeline}>
            <div className={styles.playGroup}>
              <button
                type="button"
                className={styles.playButton}
                onClick={togglePlay}
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
                  setSpeed(SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length])
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
                {TIMELINE_EVENTS.map((event) => {
                  const eventWeek = getWeekIndex(event.date);
                  const date = formatShortDate(DateTime.fromISO(event.date));
                  if (eventWeek > lastWeek) {
                    return (
                      <span key={event.date} className={styles.eventEnd}>
                        {event.label} · {date}
                      </span>
                    );
                  }
                  // Labels in the right half hang left of their tick.
                  const position = sliderPosition(eventWeek);
                  return (
                    <span
                      key={event.date}
                      className={position > 50 ? styles.eventRight : undefined}
                      style={{ left: `${position}%` }}
                    >
                      {event.label}
                    </span>
                  );
                })}
              </div>
              <div className={styles.rangeWrapper}>
                <div
                  className={styles.rangeFill}
                  style={{ width: `${sliderPosition(week)}%` }}
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
                  onChange={(e) => setWeek(Number(e.target.value))}
                />
              </div>
              <div className={styles.timelineTicks} aria-hidden={true}>
                {getMonthTicks(lastWeek + 1, 1).map((tick) => (
                  <span
                    key={tick.week}
                    style={{ left: `${sliderPosition(tick.week)}%` }}
                  >
                    {tick.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.lower}>
            <section>
              <div className={sharedStyles.sectionTitle}>
                <h2 className={styles.sectionHeading}>Weekly spending</h2>
                <SegmentedControl
                  value={barMode}
                  onChange={setBarMode}
                  options={[
                    { value: "total", label: "Total" },
                    { value: "direction", label: "By direction" },
                    ...(sector === "all"
                      ? [{ value: "sector" as BarMode, label: "By industry" }]
                      : []),
                  ]}
                />
              </div>
              <p className={styles.chartNote}>
                Nationwide, weekly
                {is14d
                  ? " · bracketed bars are the selected period"
                  : ` · through week of ${formatShortDate(weekStart(week))}`}
              </p>
              <WeeklyBars
                series={nationalSeries}
                mode={barMode}
                highlight={weeks}
                highlightLabel={shortPeriodLabel}
                dimOutside={is14d}
                label="Weekly tech spending nationwide"
              />
              <div className={barStyles.legend}>
                {BAR_LEGENDS[barMode].map((item) => (
                  <span key={item.label} className={barStyles.legendItem}>
                    <span className={`${barStyles.legendSwatch} ${item.className}`} />
                    {item.label}
                  </span>
                ))}
              </div>
            </section>
            <section>
              <h2 className={sharedStyles.sectionTitle}>
                Activity in selected period
                <span className={sharedStyles.sectionTitleAmount}>
                  {periodLabel} · Nationwide
                </span>
              </h2>
              <div className={styles.activityCards}>
                <MoneyCard
                  topText="Total tech spending"
                  amount={humanizeRoundedCurrency(totals.total, true, 1)}
                  bottomText={
                    is14d ? (
                      <Change current={totals.total} previous={previousTotal} />
                    ) : undefined
                  }
                />
                <MoneyCard
                  topText="Races with spending"
                  amount={String(byRace.size)}
                  bottomText={
                    is14d ? (
                      <Change current={byRace.size} previous={previousCount} />
                    ) : undefined
                  }
                />
              </div>
              <DirectionBreakdown totals={totals} />
            </section>
          </div>

          <RaceRanking
            rows={rankingRows}
            selectedId={selectedId}
            onSelect={setSelectedId}
            periodLabel={periodLabel}
            sector={sector}
            today={data.today}
          />
        </div>
        <RacePanel
          race={selectedRace}
          expenditures={selectedExpenditures}
          totals={sumByDirection(selectedExpenditures)}
          series={selectedSeries}
          highlight={weeks}
          dimOutside={is14d}
          periodLabel={shortPeriodLabel}
          siblings={siblings}
          committees={data.committees}
          sector={sector}
          onSelect={setSelectedId}
          onClose={() => setSelectedId(null)}
        />
      </div>
    </>
  );
}
