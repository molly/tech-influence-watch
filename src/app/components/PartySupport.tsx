"use client";

import * as d3 from "d3";

import styles from "@/app/components/expenditures.module.css";
import { useComponentSize } from "@/app/hooks/useComponentSize";
import { ExpendituresByPartySnapshot } from "@/app/types/Expenditures";

const MARGIN_BOTTOM = 20;
const MARGIN_TOP = 15;
const MARGIN_LEFT = 40;

type Support = {
  dem: number;
  rep: number;
  mix?: number;
  unk?: number;
};

type PartyKey = "dem" | "rep" | "mix" | "unk";

const PARTIES = {
  dem: "Democratic",
  rep: "Republican",
  mix: "Mix",
  unk: "Unknown",
};

export function PartySupportSkeleton() {
  const DUMMY_DATA: Record<string, number> = {
    DEM: 1000000,
    REP: 2000000,
  };

  const maxExpenditure = 2000000;
  const yDomain = [0, maxExpenditure + maxExpenditure * 0.05]; // Add a little breathing room to the chart
  const x = d3.scaleBand().domain(["DEM", "REP"]).range([0, 340]).padding(0.1);
  const y = d3.scaleLinear().domain(yDomain).range([260, 0]);
  const xRange = x.range();
  const yRange = y.range();

  return (
    <div className={`${styles.svgWrapper} ${styles.growWrapper}`}>
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
            {["DEM", "REP"].map((party) => {
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

export default function PartySupport({
  expenditures,
  labelId,
}: {
  expenditures: ExpendituresByPartySnapshot;
  labelId: string;
}) {
  const { ref, width, height } = useComponentSize({ width: 400, height: 300 });

  const CHART_WIDTH = width;
  const CHART_HEIGHT = height;
  const BOUNDS_WIDTH = CHART_WIDTH - MARGIN_LEFT;
  const BOUNDS_HEIGHT = CHART_HEIGHT - MARGIN_BOTTOM - MARGIN_TOP;

  const keys: PartyKey[] = ["dem", "rep"];
  const support: Support = {
    dem: expenditures.dem_support + expenditures.oppose_benefit_dem,
    rep: expenditures.rep_support + expenditures.oppose_benefit_rep,
  };
  if (expenditures.oppose_benefit_mix) {
    support.mix = expenditures.oppose_benefit_mix;
    keys.push("mix");
  }
  if (expenditures.oppose_benefit_unk) {
    support.unk = expenditures.oppose_benefit_unk;
    keys.push("unk");
  }

  const maxExpenditure = d3.max(Object.values(support)) || 0;
  const yDomain = [0, maxExpenditure + maxExpenditure * 0.05]; // Add a little breathing room to the chart
  const x = d3
    .scaleBand()
    .domain(keys)
    .range([0, BOUNDS_WIDTH])
    .paddingInner(0.1);
  const y = d3.scaleLinear().domain(yDomain).range([BOUNDS_HEIGHT, 0]);
  const xRange = x.range();
  const yRange = y.range();
  const gridLabelFormatter = (d: number) => d3.format("$.2s")(Math.abs(d));
  const barLabelFormatter = (d: number) => d3.format("$.3s")(Math.abs(d));

  return (
    <div className={`${styles.svgWrapper} ${styles.growWrapper}`}>
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
            {keys.map((party) => {
              const spending = support[party] || 0;
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
                    aria-label={`~${barLabelFormatter(spending)} in support of ${PARTIES[party]} candidates.`}
                  />
                  <text
                    x={(x(party) || 0) + xBandwidth / 2}
                    fontSize={14}
                    y={y(spending) - 5}
                    textAnchor="middle"
                    aria-hidden={true}
                  >
                    {barLabelFormatter(spending)}
                  </text>
                  <foreignObject
                    x={x(party) || 0}
                    width={xBandwidth}
                    height={40}
                    y={BOUNDS_HEIGHT}
                    role="presentation"
                    aria-hidden={true}
                  >
                    <div className={styles.partyLabel}>{PARTIES[party]}</div>
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
