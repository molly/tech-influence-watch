"use client";

import * as d3 from "d3";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import * as topojson from "topojson-client";
import { Objects, Topology } from "topojson-specification";

import { sectorFromPathname, sectorHref } from "@/app/utils/sector";
import { formatCurrency } from "@/app/utils/utils";

import { getFillClassNames } from "./chloroplethConstants";
import styles from "./chloroplethMap.module.css";
import Legend from "./Legend";

function getFill(
  value: number | undefined,
  colorScale: d3.ScaleThreshold<number, string>,
): string {
  if (value) {
    return styles[colorScale(value)];
  }
  return styles.stateFill0;
}

export default function ChloroplethMap({
  stateValues,
  domain,
  ariaLabel,
  labelId,
}: {
  stateValues: Record<string, number>;
  domain: number[];
  ariaLabel?: string;
  labelId?: string;
}) {
  const sector = sectorFromPathname(usePathname());
  const [activeState, setActiveState] = useState<string | null>(null);
  const activeStateValue = useMemo(() => {
    return activeState ? stateValues[activeState] : undefined;
  }, [activeState, stateValues]);
  const us: Topology<
    Objects<GeoJsonProperties>
  > = require("@/app/data/counties-albers-10m.json");

  const collection: FeatureCollection<Geometry, GeoJsonProperties> =
    topojson.feature(us, us.objects.states) as FeatureCollection<
      Geometry,
      GeoJsonProperties
    >;
  const data = collection.features;
  const FILL_CLASS_NAMES = getFillClassNames(domain);

  const colorScale = d3
    .scaleThreshold<number, string>()
    .domain(domain)
    .range(FILL_CLASS_NAMES);

  const path = d3.geoPath();

  return (
    <div className={styles.mapWrapper}>
      <svg
        className={styles.svg}
        viewBox="0 0 1000 620"
        role="group"
        {...(ariaLabel ? { "aria-label": ariaLabel } : {})}
        {...(labelId ? { "aria-labelledby": labelId } : {})}
      >
        <Legend fillClassNames={FILL_CLASS_NAMES} domain={domain} />
        {data.map((d) => {
          const stateFullName = d.properties?.name;
          const value = stateValues[stateFullName];
          if (!value) {
            return (
              <path
                key={d.id}
                aria-label={`${value !== undefined ? formatCurrency(value, true) : "$0"} spent in ${stateFullName}`}
                d={path(d) as string}
                className={getFill(value, colorScale)}
              />
            );
          }
          return (
            <Link
              href={sectorHref(
                `/2026/states/${stateFullName.toLowerCase().replace(" ", "-")}`,
                sector,
              )}
              key={d.id}
              onMouseEnter={() => setActiveState(stateFullName)}
              onMouseLeave={() => setActiveState(null)}
              onFocus={() => setActiveState(stateFullName)}
              onBlur={() => setActiveState(null)}
              className={styles.stateLink}
            >
              <path
                aria-label={`${formatCurrency(value, true)} spent in ${stateFullName}`}
                d={path(d) as string}
                className={getFill(value, colorScale)}
              />
            </Link>
          );
        })}
        {activeState && activeStateValue && (
          <foreignObject x={849} y={400} width={150} height={200}>
            <div className={styles.activeState}>{activeState}: </div>
            <span>{formatCurrency(activeStateValue, true)}</span>
          </foreignObject>
        )}
      </svg>
    </div>
  );
}
