"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import MoneyCard from "@/app/components/MoneyCard";
import sharedStyles from "@/app/shared.module.css";
import { Sector } from "@/app/types/Sector";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";

import DirectionBreakdown, { DirectionSwatch } from "./DirectionBreakdown";
import RacePanel from "./RacePanel";
import RaceRanking, { RankingRow } from "./RaceRanking";
import SegmentedControl from "./SegmentedControl";
import styles from "./SpendingFlow.module.css";
import {
  DIRECTIONS,
  DirectionTotals,
  FlowDirection,
  FlowExpenditure,
  getThroughLabel,
  matchesFilters,
  OfficeFilter,
  ShowFilter,
  SpendingFlowData,
  StageFilter,
  sumByDirection,
} from "./spendingFlowUtils";
import SpendingMap, { MapItem, PING_MS, PingBatch } from "./SpendingMap";
import Timeline from "./Timeline";
import { emptyBucket, WeekBucket } from "./WeeklyBars";

const STEP_MS = 900;
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
  const [stage, setStage] = useState<StageFilter>("all");
  const [office, setOffice] = useState<OfficeFilter>("all");
  const [show, setShow] = useState<ShowFilter>("all");
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
  const throughLabel = getThroughLabel(week, data.today);
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
      </div>
      <div className={styles.body}>
        <div className={styles.left}>
          <div className={styles.mapBar}>
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
              label={throughLabel}
            />
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

          <Timeline
            series={nationalSeries}
            week={week}
            lastWeek={lastWeek}
            onWeekChange={setWeek}
            playing={playing}
            onTogglePlay={togglePlay}
            speed={speed}
            onSpeedChange={setSpeed}
          />

          <section>
            <h2 className={sharedStyles.sectionTitle}>
              Tech spending so far
              <span className={sharedStyles.sectionTitleAmount}>
                {throughLabel} · Nationwide
              </span>
            </h2>
            <div className={styles.activity}>
              <div className={styles.activityCards}>
                <MoneyCard
                  topText="Total tech spending"
                  amount={humanizeRoundedCurrency(totals.total, true, 1)}
                  bottomText={
                    <span className={styles.thisWeek}>
                      <span className="bold">
                        +{humanizeRoundedCurrency(thisWeekTotal, true, 1)}
                      </span>{" "}
                      this week
                    </span>
                  }
                />
                <MoneyCard
                  topText="Races with spending"
                  amount={String(byRace.size)}
                  bottomText={
                    <span className={styles.thisWeek}>
                      <span className="bold">{thisWeekRaces}</span> with
                      spending this week
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
            sector={sector}
            today={data.today}
          />
        </div>
        <RacePanel
          race={selectedRace}
          expenditures={selectedExpenditures}
          series={selectedSeries}
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
