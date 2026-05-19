"use client";

import * as d3 from "d3";
import { useMemo } from "react";

import { useComponentSize } from "@/app/hooks/useComponentSize";
import { getFullPartyName } from "@/app/utils/party";

import styles from "./individualOrCompany.module.css";

const MARGIN_BOTTOM = 40;
const MARGIN_TOP = 15;
const MARGIN_LEFT = 45;

const PARTY_ORDER: Record<string, number> = {
  DEM: 0,
  REP: 1,
  LIB: 2,
  IND: 3,
};

const sortParties = (partySummary: Record<string, number>): string[] => {
  const keys = Object.keys(partySummary).filter(
    (party) => partySummary[party] > 0,
  );
  return keys.sort((a, b) => {
    const [partyA, partyB] = [a, b];
    const getOrder = (party: string): number => {
      if (PARTY_ORDER[party] !== undefined) {
        return PARTY_ORDER[party];
      }
      if (party === "OTH") {
        return 10001;
      }
      if (party === "UNK") {
        return 10000;
      }
      return 999;
    };
    const orderA = getOrder(partyA);
    const orderB = getOrder(partyB);

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    // If not in PARTY_ORDER and not "UNK" or "OTH", sort alphabetically
    return partyA.localeCompare(partyB);
  });
};

export function SpendingByPartySkeleton() {
  const DUMMY_DATA: Record<string, number> = {
    DEM: 1000000,
    REP: 2000000,
    UNK: 10000000,
  };

  const maxExpenditure = 10000000;
  const yDomain = [0, maxExpenditure + maxExpenditure * 0.05]; // Add a little breathing room to the chart
  const x = d3.scaleBand().domain(["DEM", "REP", "UNK"]).range([0, 340]);
  const y = d3.scaleLinear().domain(yDomain).range([260, 0]);
  const xRange = x.range();
  const yRange = y.range();

  return (
    <div className={styles.svgWrapper}>
      <svg
        viewBox={`0 0 400 300`}
        preserveAspectRatio="none"
        className={styles.svg}
        role="group"
      >
        <g transform={`translate(0, ${MARGIN_TOP})`}>
          {y.ticks(5).map((tick) => (
            <g
              key={`xTick-${tick}`}
              transform={`translate(0,${y(tick)})`}
              aria-hidden={true}
              role="presentation"
            >
              <line
                key={tick}
                x1={MARGIN_LEFT - 5}
                x2={MARGIN_LEFT}
                stroke="currentColor"
              />
            </g>
          ))}
          <g
            transform={`translate(${MARGIN_LEFT}, 0)`}
            role="list"
            aria-label="bar graph"
          >
            {["DEM", "REP", "UNK"].map((party) => {
              const spending = DUMMY_DATA[party] || 0;
              const height = y(0) - y(spending);
              const xBandwidth = x.bandwidth();
              return (
                <rect
                  key={`bar-${party}`}
                  x={x(party)}
                  y={y(spending)}
                  width={xBandwidth}
                  height={height}
                  className={styles.skeletonBar}
                />
              );
            })}
            <g
              transform="translate(0, 260)"
              role="presentation"
              aria-hidden={true}
            >
              <path
                className={styles.axis}
                d={["M", xRange[0], 0, "L", xRange[1], 0].join(" ")}
                fill="none"
                stroke="currentColor"
              />
            </g>
            <path
              className={styles.axis}
              d={["M", 0, yRange[0], "L", 0, yRange[1]].join(" ")}
              fill="none"
              stroke="currentColor"
              role="presentation"
              aria-hidden={true}
            />
          </g>
        </g>
      </svg>
    </div>
  );
}

export default function SpendingByParty({
  partySummary,
  labelId,
}: {
  partySummary: Record<string, number>;
  labelId: string;
}) {
  const { ref, width, height } = useComponentSize({ width: 400, height: 300 });

  const CHART_WIDTH = width;
  const CHART_HEIGHT = height;
  const BOUNDS_WIDTH = CHART_WIDTH - MARGIN_LEFT;
  const BOUNDS_HEIGHT = CHART_HEIGHT - MARGIN_BOTTOM - MARGIN_TOP;

  const sortedParties = useMemo(
    () => sortParties(partySummary),
    [partySummary],
  );
  const maxExpenditure = d3.max(Object.values(partySummary)) || 0;
  const yDomain = [0, maxExpenditure + maxExpenditure * 0.05]; // Add a little breathing room to the chart
  const x = d3.scaleBand().domain(sortedParties).range([0, BOUNDS_WIDTH]);
  const y = d3.scaleLinear().domain(yDomain).range([BOUNDS_HEIGHT, 0]);
  const xRange = x.range();
  const yRange = y.range();
  const gridLabelFormatter = (d: number) => d3.format("$.3s")(Math.abs(d));

  return (
    <div className={styles.svgWrapper}>
      <svg
        ref={ref}
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        preserveAspectRatio="none"
        className={styles.svg}
        role="group"
        aria-labelledby={labelId}
      >
        <g transform={`translate(0, ${MARGIN_TOP})`}>
          {y.ticks(5).map((tick) => (
            <g
              key={`xTick-${tick}`}
              transform={`translate(0,${y(tick)})`}
              aria-hidden={true}
              role="presentation"
            >
              <line
                key={tick}
                x1={MARGIN_LEFT - 5}
                x2={MARGIN_LEFT}
                stroke="currentColor"
              />
              <text
                x={MARGIN_LEFT - 8}
                fontSize={12}
                textAnchor="end"
                alignmentBaseline="middle"
              >
                {gridLabelFormatter(tick)}
              </text>
            </g>
          ))}
          <g
            transform={`translate(${MARGIN_LEFT}, 0)`}
            role="list"
            aria-label="bar graph"
          >
            {sortedParties.map((party) => {
              const spending = partySummary[party] || 0;
              const height = y(0) - y(spending);
              const xBandwidth = x.bandwidth();
              return (
                <g key={`bar-${party}`} role="listitem">
                  <rect
                    x={x(party)}
                    y={y(spending)}
                    width={xBandwidth}
                    height={height}
                    className={party.toLowerCase()}
                    aria-label={`~${gridLabelFormatter(spending)} contributed to ${getFullPartyName(party[0])} committees.`}
                  />
                  <text
                    x={(x(party) || 0) + xBandwidth / 2}
                    fontSize={14}
                    y={y(spending) - 5}
                    textAnchor="middle"
                    aria-hidden={true}
                  >
                    {gridLabelFormatter(spending)}
                  </text>
                  <foreignObject
                    x={x(party) || 0}
                    width={xBandwidth}
                    height={40}
                    y={BOUNDS_HEIGHT}
                    role="presentation"
                    aria-hidden={true}
                  >
                    <div className={styles.partyLabel}>
                      {party == "UNK"
                        ? "Non-partisan / unknown"
                        : getFullPartyName(party[0], false)}
                    </div>
                  </foreignObject>
                </g>
              );
            })}
            <g
              transform={`translate(0, ${BOUNDS_HEIGHT})`}
              role="presentation"
              aria-hidden={true}
            >
              <path
                className={styles.axis}
                d={["M", xRange[0], 0, "L", xRange[1], 0].join(" ")}
                fill="none"
                stroke="currentColor"
              />
            </g>
            <path
              className={styles.axis}
              d={["M", 0, yRange[0], "L", 0, yRange[1]].join(" ")}
              fill="none"
              stroke="currentColor"
              role="presentation"
              aria-hidden={true}
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
