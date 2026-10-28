"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import MoneyCard from "@/app/components/MoneyCard";
import sharedStyles from "@/app/shared.module.css";
import { Sector } from "@/app/types/Sector";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";
import { humanizeSectorShort } from "@/app/utils/sector";
import { sentenceCase } from "@/app/utils/titlecase";

import DirectionBreakdown, { DirectionSwatch } from "./DirectionBreakdown";
import RacePanel from "./RacePanel";
import RacePicker from "./RacePicker";
import RaceRanking, { RankingRow } from "./RaceRanking";
import SegmentedControl from "./SegmentedControl";
import styles from "./SpendingFlow.module.css";
import {
  DIRECTIONS,
  DirectionTotals,
  FlowExpenditure,
  formatShortDate,
  getThroughDate,
  matchesFilters,
  OfficeFilter,
  PartyDirection,
  ShowFilter,
  SpendingFlowData,
  StageFilter,
  sumByDirection,
  weekStart,
} from "./spendingFlowUtils";
import SpendingMap, { MapItem, PING_MS, PingBatch } from "./SpendingMap";
import Timeline, { CompactTimeline } from "./Timeline";
import { emptyBucket, WeekBucket } from "./WeeklyBars";

const STEP_MS = 900;

const STAGE_OPTIONS: { value: StageFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "primary", label: "Primaries" },
  { value: "general", label: "General" },
];
const OFFICE_OPTIONS: { value: OfficeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "H", label: "House" },
  { value: "S", label: "Senate" },
];
const SHOW_OPTIONS: { value: ShowFilter; label: string }[] = [
  { value: "all", label: "All spending" },
  { value: "D", label: "Favoring Democrats" },
  { value: "R", label: "Favoring Republicans" },
];

// "All stages · Senate · All spending", for the collapsed filters on mobile.
function summarizeFilters(
  stage: StageFilter,
  office: OfficeFilter,
  show: ShowFilter,
): string {
  const label = <T extends string>(
    options: { value: T; label: string }[],
    value: T,
  ) => options.find((option) => option.value === value)?.label ?? value;
  return [
    stage === "all" ? "All stages" : label(STAGE_OPTIONS, stage),
    office === "all" ? "All offices" : label(OFFICE_OPTIONS, office),
    label(SHOW_OPTIONS, show),
  ].join(" · ");
}
function dominantDirection(totals: DirectionTotals): PartyDirection {
  return totals.R >= totals.D ? "R" : "D";
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

export default function SpendingFlow({
  data,
  sector,
}: {
  data: SpendingFlowData;
  sector: Sector;
}) {
  const lastWeek = data.numWeeks - 1;
  const techLabel = humanizeSectorShort(sector);
  const [stage, setStage] = useState<StageFilter>("all");
  const [office, setOffice] = useState<OfficeFilter>("all");
  const [show, setShow] = useState<ShowFilter>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [week, setWeek] = useState(lastWeek);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [pings, setPings] = useState<PingBatch[]>([]);
  const reducedMotion = useReducedMotion();

  const filtered = useMemo(
    () => data.expenditures.filter((e) => matchesFilters(e, { stage, office })),
    [data.expenditures, stage, office],
  );
  // Everything on the page is cumulative: 2026 spending through the
  // scrubber's week, so scrubbing or playing shows the year building up.
  const throughDate = getThroughDate(week, data.dataThrough, data.today);
  const throughLabel = `Through ${throughDate}`;
  const weekLabel = formatShortDate(weekStart(week));
  const cumulative = filtered.filter((e) => e.week >= 0 && e.week <= week);
  const byRace = groupByRace(cumulative);
  const totals = sumByDirection(cumulative);
  const thisWeek = filtered.filter((e) => e.week === week);
  const thisWeekTotal = sumByDirection(thisWeek).total;
  const thisWeekRaces = groupByRace(thisWeek).size;

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
  // Escape closes the race panel, which covers the page as a bottom sheet on
  // narrow screens.
  useEffect(() => {
    if (!selectedId) {
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedId]);

  const mapItems: MapItem[] = rankingRows.map((row) => {
    const raceTotals = sumByDirection(row.expenditures);
    return {
      race: row.race,
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

  const nationalSeries = weeklySeries(filtered, data.numWeeks, lastWeek);

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

  // Once the main timeline scrolls off the top of the screen, a compact copy
  // sticks there so the selected week stays visible.
  const timelineRef = useRef<HTMLDivElement>(null);
  const [pastTimeline, setPastTimeline] = useState(false);
  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) {
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      setPastTimeline(
        !entry.isIntersecting && entry.boundingClientRect.top < 0,
      );
    });
    observer.observe(timeline);
    return () => observer.disconnect();
  }, []);

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


  // Shown at the top of the screen once the main timeline scrolls away, and
  // in the race panel when it covers the timeline on narrow screens.
  const compactTimeline = (
    <CompactTimeline
      week={week}
      lastWeek={lastWeek}
      onWeekChange={setWeek}
      playing={playing}
      onTogglePlay={togglePlay}
      throughDate={throughDate}
    />
  );

  return (
    <>
      <div className={styles.stickyScrubber}>
        {pastTimeline && compactTimeline}
      </div>
      {/* On mobile the filters collapse behind a toggle, and the map filter
          joins them here instead of sitting above the map. */}
      <div className={styles.filters} data-open={filtersOpen || undefined}>
        <button
          type="button"
          className={styles.filtersToggle}
          aria-expanded={filtersOpen}
          aria-controls="spending-filters"
          onClick={() => setFiltersOpen((open) => !open)}
        >
          <span className="bold">Filters</span>
          <span className={styles.filtersSummary}>
            {summarizeFilters(stage, office, show)}
          </span>
          <span
            className={
              filtersOpen
                ? `${styles.chevron} ${styles.chevronOpen}`
                : styles.chevron
            }
          />
        </button>
        <div id="spending-filters" className={styles.filterControls}>
          <SegmentedControl
            label="Election stage"
            value={stage}
            onChange={setStage}
            options={STAGE_OPTIONS}
          />
          <SegmentedControl
            label="Office"
            value={office}
            onChange={setOffice}
            options={OFFICE_OPTIONS}
          />
          <div className={styles.showFilterMobile}>
            <SegmentedControl
              label="Show on map"
              value={show}
              onChange={setShow}
              options={SHOW_OPTIONS}
            />
          </div>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.left}>
          <div className={styles.mapBar}>
            <SegmentedControl
              label="Show on map"
              value={show}
              onChange={setShow}
              options={SHOW_OPTIONS}
            />
          </div>
          <div className={styles.mapBox}>
            {/* The date sits on the map itself so it stays in view while
                playing, even when the timeline is off screen. */}
            <div className={styles.mapStage}>
              <SpendingMap
                items={mapItems}
                radiusReference={radiusReference}
                selectedId={selectedId}
                onSelect={setSelectedId}
                pings={pings}
                label={throughLabel}
                techLabel={techLabel}
              />
              <div className={styles.mapDate}>
                <div className={styles.annotation}>Through</div>
                <div className={styles.weekOfValue}>{throughDate}</div>
              </div>
            </div>
            {!playing && (
              <button
                type="button"
                className={styles.mapPlay}
                onClick={togglePlay}
              >
                <span className={styles.playIcon} />
                Play 2026 week by week
              </button>
            )}
            <div className={styles.mapLegend}>
              {DIRECTIONS.map(({ key, label }) => (
                <div key={key} className={styles.mapLegendItem}>
                  <DirectionSwatch direction={key} />
                  {label}
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
          <RacePicker
            rows={rankingRows}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />

          <Timeline
            ref={timelineRef}
            series={nationalSeries}
            week={week}
            lastWeek={lastWeek}
            onWeekChange={setWeek}
            playing={playing}
            onTogglePlay={togglePlay}
            speed={speed}
            onSpeedChange={setSpeed}
            techLabel={techLabel}
            throughDate={throughDate}
          />

          <section>
            <h2 className={sharedStyles.sectionTitle}>
              {sentenceCase(`${techLabel} spending nationwide`, false)}
              <span className={sharedStyles.sectionTitleAmount}>
                {throughLabel}
              </span>
            </h2>
            <div className={styles.activity}>
              <div className={styles.activityCards}>
                <MoneyCard
                  topText={`Total ${techLabel} spending`}
                  amount={humanizeRoundedCurrency(totals.total, true, 1)}
                  bottomText={
                    <span className={styles.thisWeek}>
                      <span className="bold">
                        +{humanizeRoundedCurrency(thisWeekTotal, true, 1)}
                      </span>{" "}
                      during the week of {weekLabel}
                    </span>
                  }
                />
                <MoneyCard
                  topText="Races with spending"
                  amount={String(byRace.size)}
                  bottomText={
                    <span className={styles.thisWeek}>
                      <span className="bold">{thisWeekRaces}</span> with
                      spending during the week of {weekLabel}
                    </span>
                  }
                />
              </div>
              <DirectionBreakdown totals={totals} />
            </div>
          </section>

          <RaceRanking
            rows={rankingRows}
            selectedId={selectedId}
            onSelect={setSelectedId}
            throughLabel={throughLabel}
            weekLabel={weekLabel}
            sector={sector}
            today={data.today}
          />
        </div>
        <RacePanel
          race={selectedRace}
          expenditures={selectedExpenditures}
          yearExpenditures={filtered.filter((e) => e.raceId === selectedId)}
          totals={sumByDirection(selectedExpenditures)}
          series={selectedSeries}
          throughDate={throughDate}
          scrubber={compactTimeline}
          week={week}
          stage={stage}
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
