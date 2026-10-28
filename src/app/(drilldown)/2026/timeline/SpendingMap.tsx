"use client";

import * as d3 from "d3";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { useMemo, useState } from "react";
import * as topojson from "topojson-client";
import { GeometryObject, Objects, Topology } from "topojson-specification";

import { STATES_BY_ABBR } from "@/app/data/states";
import { formatCompact } from "@/app/utils/humanize";

import styles from "./SpendingFlow.module.css";
import {
  DIRECTIONS,
  DirectionTotals,
  FlowDirection,
  FlowExpenditure,
  FlowRace,
  getRaceLabel,
} from "./spendingFlowUtils";

const WIDTH = 975;
const HEIGHT = 610;
const MAX_RADIUS = 56;
const MIN_RADIUS = 4;
const MIN_PING_RADIUS = 2.5;
// A tap or click on the map this close to a circle's edge, in screen pixels,
// selects it, so small circles can be picked on a phone.
const TAP_SLOP_PX = 20;
// How long a ping animates. Batches older than this are dropped.
export const PING_MS = 1800;

export interface MapItem {
  race: FlowRace;
  totals: DirectionTotals;
  value: number;
  direction: FlowDirection;
}

// One week's expenditures, pinged together as playback reaches that week.
export interface PingBatch {
  id: number;
  time: number;
  expenditures: FlowExpenditure[];
}

const FILL_CLASS: Record<FlowDirection, string> = {
  R: styles.fillR,
  D: styles.fillD,
  U: styles.fillU,
};

const ABBR_BY_NAME = Object.fromEntries(
  Object.entries(STATES_BY_ABBR).map(([abbr, name]) => [name, abbr]),
);

// The topology is pre-projected with this same Albers USA projection, so
// district lat/lons land in the right place on the drawn states.
const projection = d3.geoAlbersUsa().scale(1300).translate([487.5, 305]);

function useStateShapes() {
  return useMemo(() => {
    const us: Topology<
      Objects<GeoJsonProperties>
    > = require("@/app/data/counties-albers-10m.json");
    const collection = topojson.feature(
      us,
      us.objects.states,
    ) as FeatureCollection<Geometry, GeoJsonProperties>;
    const path = d3.geoPath();
    const states = collection.features.map((feature) => ({
      abbr: ABBR_BY_NAME[feature.properties?.name] ?? "",
      d: path(feature) ?? "",
      centroid: path.centroid(feature),
    }));
    const mesh =
      path(
        topojson.mesh(
          us,
          us.objects.states as GeometryObject,
          (a, b) => a !== b,
        ),
      ) ?? "";
    return { states, mesh };
  }, []);
}

export default function SpendingMap({
  items,
  radiusReference,
  selectedId,
  onSelect,
  pings,
  label,
  techLabel,
}: {
  items: MapItem[];
  radiusReference: number;
  selectedId: string | null;
  onSelect: (raceId: string) => void;
  pings: PingBatch[];
  label: string;
  techLabel: string;
}) {
  const { states, mesh } = useStateShapes();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const positions = useMemo(() => {
    const byState = Object.fromEntries(states.map((s) => [s.abbr, s.centroid]));
    const result: Record<string, [number, number]> = {};
    for (const { race } of items) {
      const point =
        race.office === "S"
          ? byState[race.state]
          : race.latLon
            ? projection([race.latLon[1], race.latLon[0]])
            : null;
      // Rounded so server and browser floating-point math agree on hydration.
      if (point && !isNaN(point[0])) {
        result[race.id] = [
          Math.round(point[0] * 100) / 100,
          Math.round(point[1] * 100) / 100,
        ];
      }
    }
    return result;
  }, [items, states]);

  const radius = (value: number) =>
    Math.max(
      MIN_RADIUS,
      Math.min(
        MAX_RADIUS * 1.4,
        (Math.sqrt(value) / Math.sqrt(radiusReference || 1)) * MAX_RADIUS,
      ),
    );

  const placed = items
    .filter((item) => item.value > 0 && positions[item.race.id])
    .sort((a, b) => b.value - a.value)
    .map((item) => ({
      ...item,
      x: positions[item.race.id][0],
      y: positions[item.race.id][1],
      r: radius(item.value),
    }));
  const placedById = Object.fromEntries(placed.map((p) => [p.race.id, p]));

  // Pings use the same area scale as the circles, so a ping shows how much one
  // expenditure adds to its race's circle.
  const pingRadius = (amount: number) =>
    Math.max(
      MIN_PING_RADIUS,
      (Math.sqrt(amount) / Math.sqrt(radiusReference || 1)) * MAX_RADIUS,
    );
  const activePings = pings.flatMap((batch) =>
    batch.expenditures.flatMap((expenditure) => {
      const target = placedById[expenditure.raceId];
      if (!target) {
        return [];
      }
      const r = pingRadius(expenditure.amount);
      return [
        {
          id: `${batch.id}-${expenditure.uid}`,
          x: target.x,
          y: target.y,
          r,
          ring: r * 2 + 6,
          direction: expenditure.direction,
        },
      ];
    }),
  );

  // Clicks on a circle are handled by the circle; this catches the ones that
  // land on the map near one.
  const selectNearest = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const matrix = svg.getScreenCTM();
    if (!matrix || placed.length === 0) {
      return;
    }
    const point = new DOMPoint(e.clientX, e.clientY).matrixTransform(
      matrix.inverse(),
    );
    const slop = TAP_SLOP_PX * (WIDTH / svg.getBoundingClientRect().width);
    const nearest =
      placed[
        d3.Delaunay.from(
          placed,
          (p) => p.x,
          (p) => p.y,
        ).find(point.x, point.y)
      ];
    const distance = Math.hypot(nearest.x - point.x, nearest.y - point.y);
    if (distance - nearest.r <= slop) {
      onSelect(nearest.race.id);
    }
  };

  const hovered = hoveredId ? placedById[hoveredId] : null;
  const siblingIds = new Set(
    hovered
      ? placed
          .filter(
            (p) => p.race.state === hovered.race.state && p.race.id !== hovered.race.id,
          )
          .map((p) => p.race.id)
      : [],
  );

  return (
    <div className={styles.map}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className={styles.mapSvg}
        role="group"
        aria-label={`Map of races with ${techLabel} spending, ${label}`}
        onClick={selectNearest}
      >
        <g>
          {states.map((state) => (
            <path
              key={state.abbr || state.d.slice(0, 20)}
              d={state.d}
              className={
                hovered && hovered.race.state === state.abbr
                  ? `${styles.stateShape} ${styles.stateShapeActive}`
                  : styles.stateShape
              }
            />
          ))}
          <path d={mesh} className={styles.stateMesh} />
        </g>
        <g>
          {placed.map((p) => {
            const label = getRaceLabel(p.race);
            const classNames = [styles.race, FILL_CLASS[p.direction]];
            if (siblingIds.has(p.race.id)) {
              classNames.push(styles.raceSibling);
            }
            return (
              <g
                key={p.race.id}
                className={classNames.join(" ")}
                role="button"
                tabIndex={0}
                aria-label={`${label}: ${formatCompact(Math.round(p.value))}`}
                aria-pressed={p.race.id === selectedId}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(p.race.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(p.race.id);
                  }
                }}
                onMouseEnter={() => setHoveredId(p.race.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(p.race.id)}
                onBlur={() => setHoveredId(null)}
              >
                <circle className={styles.raceCircle} cx={p.x} cy={p.y} r={p.r} />
                {p.race.id === selectedId && (
                  <circle
                    className={styles.raceSelected}
                    cx={p.x}
                    cy={p.y}
                    r={p.r + 4}
                  />
                )}
              </g>
            );
          })}
        </g>
        <g className={styles.pings} aria-hidden={true}>
          {activePings.map((ping) => (
            <g key={ping.id} className={FILL_CLASS[ping.direction]}>
              <circle className={styles.pingRing} cx={ping.x} cy={ping.y} r={ping.ring} />
              <circle className={styles.pingDot} cx={ping.x} cy={ping.y} r={ping.r} />
            </g>
          ))}
        </g>
      </svg>
      {hovered && (
        <div
          className={styles.mapTooltip}
          style={{
            left: `${(hovered.x / WIDTH) * 100}%`,
            top: `${(hovered.y / HEIGHT) * 100}%`,
          }}
        >
          <div className={styles.mapTooltipTitle}>{getRaceLabel(hovered.race)}</div>
          <div className={styles.mapTooltipSub}>
            U.S. {hovered.race.office === "S" ? "Senate" : "House"} ·{" "}
            {formatCompact(Math.round(hovered.totals.total))} in {label}
          </div>
          {DIRECTIONS.map(({ key, phrase }) => (
            <div key={key} className={styles.mapTooltipRow}>
              <span className={`${styles.mapTooltipSwatch} ${FILL_CLASS[key]}`} />
              {formatCompact(Math.round(hovered.totals[key]))} {phrase}
            </div>
          ))}
          {siblingIds.size > 0 && (
            <div className={styles.mapTooltipSiblings}>
              Also in {STATES_BY_ABBR[hovered.race.state]}:{" "}
              {[...siblingIds]
                .map((id) => getRaceLabel(placedById[id].race))
                .join(", ")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
