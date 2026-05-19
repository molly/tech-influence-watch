"use client";

import * as d3 from "d3";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import Candidate, { CandidateImage } from "@/app/components/Candidate";
import Skeleton from "@/app/components/skeletons/Skeleton";
import { useBreakpoint } from "@/app/hooks/useBreakpoint";
import { Beneficiary } from "@/app/types/Beneficiaries";
import { CandidateSummary, ElectionGroup } from "@/app/types/Elections";

import styles from "./page.module.css";

const CHART_WIDTH = 300;
const GRIDLINE_WIDTH = 0.5;
const HATCH_SIZE = 2;
const MARGIN_RIGHT = 20;
const LEGEND_Y = 5;
const LEGEND_HEIGHT = 30;
const CANDIDATE_LABEL_WIDTH = 100;
const GRID_LABEL_HEIGHT = 15;
const BAR_LABEL_MIN_WIDTH = 16;

function getTotalSpending(candidate: CandidateSummary) {
  return (
    (candidate.outside_spending?.support_total || 0) +
    (candidate.outside_spending?.oppose_total || 0) +
    (candidate.raised_total || 0)
  );
}

function BarLabel({
  x,
  width,
  y,
  height,
  label,
  shouldUseXLFont,
  negative,
  backgroundClass,
}: {
  x: number;
  width: number;
  y: number;
  height: number;
  label: string;
  shouldUseXLFont?: boolean;
  negative?: boolean;
  backgroundClass?: string;
}) {
  let textStart, hug;
  const minWidth = shouldUseXLFont
    ? BAR_LABEL_MIN_WIDTH * 1.5
    : BAR_LABEL_MIN_WIDTH;
  if (negative) {
    textStart = width > minWidth ? x + 1 : x - minWidth - 1;
    hug = width > minWidth ? "hugLeft" : "hugRight";
  } else {
    textStart = width > minWidth ? x - minWidth - 1 : x + 1;
    hug = width > minWidth ? "hugRight" : "hugLeft";
  }

  return (
    <motion.foreignObject
      x={textStart}
      y={y}
      width={minWidth}
      height={height}
      className={styles.barLabelForeignObject}
      initial={{
        opacity: 0,
      }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`${styles.barLabelContainer} ${styles.barLabel} ${styles[hug]} ${shouldUseXLFont ? styles.xlFont : ""}`}
      >
        <div className={width > minWidth ? backgroundClass : ""}>{label}</div>
      </div>
    </motion.foreignObject>
  );
}

type SpendingHoverState = {
  candidate: string;
  bar:
    | "raised"
    | "industry_direct"
    | "outside_support"
    | "outside_oppose"
    | "crypto_support"
    | "crypto_oppose";
};

type DummyData = {
  raised: number;
  outside_oppose: number;
};

export function SpendingSkeleton() {
  const CHART_HEIGHT = 150;
  const DUMMY_DATA: Record<string, DummyData> = {
    "1": {
      raised: 4500000,
      outside_oppose: 950000,
    },
    "2": {
      raised: 3000000,
      outside_oppose: 200000,
    },
    "3": {
      raised: 100000,
      outside_oppose: 0,
    },
  };

  const xDomain = [-1000000, 5000000];
  const y = d3
    .scaleBand()
    .range([LEGEND_HEIGHT, CHART_HEIGHT - GRID_LABEL_HEIGHT])
    .domain(["1", "2", "3"])
    .padding(0.5);
  const x = d3
    .scaleLinear()
    .domain(xDomain)
    .range([CANDIDATE_LABEL_WIDTH, CHART_WIDTH - MARGIN_RIGHT]);

  return (
    <div>
      <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} role="group">
        {x.ticks(5).map((value, ind) => {
          return (
            <g key={`tick-${ind}`}>
              <line
                x1={x(value)}
                x2={x(value)}
                y1={CHART_HEIGHT - GRID_LABEL_HEIGHT}
                y2={LEGEND_HEIGHT}
                strokeWidth={GRIDLINE_WIDTH}
                className={
                  value === 0 ? styles.mainLayoutLine : styles.gridLine
                }
              />
            </g>
          );
        })}
        {["1", "2", "3"].map((candidate) => {
          const { raised, outside_oppose } = DUMMY_DATA[candidate];
          const yCandidate = y(candidate) || 0;
          const x0 = x(0);
          const xRaised = x(raised);
          const xRaisedWidth = Math.max(1, xRaised - x0);
          const xOutsideOpposeStart = Math.min(x0 - 1, x(-outside_oppose));
          const xOutsideOpposeWidth =
            Math.max(1, x(outside_oppose) - x0) - GRIDLINE_WIDTH / 2;
          return (
            <g key={candidate}>
              <rect
                x={x0 + GRIDLINE_WIDTH / 2}
                y={yCandidate}
                width={xRaisedWidth - GRIDLINE_WIDTH / 2}
                height={y.bandwidth()}
                className={styles.raisedBar}
              />
              {outside_oppose && (
                <rect
                  x={xOutsideOpposeStart}
                  y={yCandidate}
                  width={xOutsideOpposeWidth}
                  height={y.bandwidth()}
                  className={styles.raisedBar}
                />
              )}

              <foreignObject
                x={0}
                width={CANDIDATE_LABEL_WIDTH - 25}
                y={yCandidate - y.bandwidth() / 2}
                height={y.bandwidth() * 2}
              >
                <div className={styles.candidateLabel}>
                  <CandidateImage chart={true} />
                  <Skeleton
                    height="8px"
                    width="5rem"
                    className={styles.skeletonNoMarginBottom}
                  />
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function Spending({
  election,
  labelId,
  beneficiaries,
}: {
  election: ElectionGroup;
  labelId: string;
  beneficiaries?: Record<string, Beneficiary>;
}) {
  const [hovered, setHovered] = useState<SpendingHoverState | null>(null);
  const shouldUseXLFont = useBreakpoint(500);

  // Get unique list of candidates, ordered by amount raised
  const candidateNames = useMemo(
    () =>
      Object.keys(election.candidates).sort(
        (a, b) =>
          getTotalSpending(election.candidates[b]) -
          getTotalSpending(election.candidates[a]),
      ),
    [election.candidates],
  );

  const CHART_HEIGHT = useMemo(
    () => Math.max(150, candidateNames.length * 40),
    [candidateNames],
  );

  const data = useMemo(
    () =>
      candidateNames.map((candidate) => {
        const summary = election.candidates[candidate];
        const candidateData = {
          raised: 0,
          industry_direct: 0,
          industry_super_pac: 0,
          outside_support: 0,
          outside_oppose: 0,
          crypto_support: 0,
          crypto_oppose: 0,
        };
        if (!summary) {
          return candidateData;
        }
        candidateData.raised = summary.raised_total || 0;
        candidateData.crypto_support = summary.support_total || 0;
        candidateData.crypto_oppose = summary.oppose_total || 0;
        if ("outside_spending" in summary && summary.outside_spending) {
          candidateData.outside_support =
            summary.outside_spending.support_total || 0;
          candidateData.outside_oppose =
            summary.outside_spending.oppose_total || 0;
        }
        const candidateId = summary.candidate_id;
        if (candidateId && beneficiaries?.[candidateId]) {
          const beneficiary = beneficiaries[candidateId];
          for (const companyGroup of beneficiary.contributions) {
            for (const contribution of companyGroup.contributions) {
              const isSuperPAC = contribution.committees.some(
                (c) =>
                  c.committee_type_full?.startsWith("Super") ||
                  c.committee_type_full?.startsWith("Hybrid"),
              );
              if (!isSuperPAC) {
                candidateData.industry_direct += contribution.total;
              } else {
                candidateData.industry_super_pac += contribution.total;
              }
            }
          }
        }
        return candidateData;
      }),
    [candidateNames, election.candidates, beneficiaries],
  );

  const xDomain = useMemo(
    () => [
      -(d3.max(data, (d) => d.outside_oppose) || 0),
      d3.max(data, (d) => d.raised + d.outside_support) || 0,
    ],
    [data],
  );
  const y = useMemo(
    () =>
      d3
        .scaleBand()
        .range([LEGEND_HEIGHT, CHART_HEIGHT - GRID_LABEL_HEIGHT])
        .domain(candidateNames)
        .padding(0.5),
    [candidateNames, CHART_HEIGHT],
  );
  const x = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain(xDomain)
        .range([CANDIDATE_LABEL_WIDTH, CHART_WIDTH - MARGIN_RIGHT]),
    [xDomain],
  );
  const gridLabelFormatter = (d: number) => d3.format("$.2s")(Math.abs(d));

  const altText = useMemo(() => {
    const altFormatter = (d: number) => d3.format("$.3~s")(Math.abs(d));
    const lines = ["Money involved in this election"];
    candidateNames.forEach((candidate, ind) => {
      const summary = election.candidates[candidate];
      const {
        raised,
        industry_direct,
        outside_support,
        crypto_support,
        outside_oppose,
        crypto_oppose,
      } = data[ind];
      const parts: string[] = [];
      if (raised) {
        let raisedStr = `Raised ${altFormatter(raised)}`;
        if (industry_direct > 0) {
          raisedStr += ` (${altFormatter(industry_direct)} from crypto donors)`;
        }
        parts.push(raisedStr);
      }
      if (outside_support) {
        let supportStr = `${altFormatter(outside_support)} in outside spending to support`;
        if (crypto_support > 0) {
          supportStr += ` (${altFormatter(crypto_support)} from crypto PACs)`;
        }
        parts.push(supportStr);
      }
      if (outside_oppose) {
        let opposeStr = `${altFormatter(outside_oppose)} in outside spending to oppose`;
        if (crypto_oppose > 0) {
          opposeStr += ` (${altFormatter(crypto_oppose)} from crypto PACs)`;
        }
        parts.push(opposeStr);
      }
      const nameWithParty = summary?.party
        ? `${candidate} (${summary.party})`
        : candidate;
      lines.push(`${nameWithParty}: ${parts.join(", ")}`);
    });
    return lines.join("\n");
  }, [candidateNames, election.candidates, data]);

  return (
    <div>
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        role="img"
        aria-labelledby={labelId}
        aria-describedby={`${labelId}-desc`}
      >
        <desc id={`${labelId}-desc`}>{altText}</desc>
        <defs>
          <pattern
            id="hatch"
            width={HATCH_SIZE}
            height={HATCH_SIZE}
            patternTransform="rotate(45)"
            patternUnits="userSpaceOnUse"
          >
            <rect width={HATCH_SIZE / 2} height={HATCH_SIZE} fill="#0f172a" />
          </pattern>
        </defs>
        {x.ticks(5).map((value, ind) => {
          return (
            <g key={`tick-${ind}`}>
              <line
                x1={x(value)}
                x2={x(value)}
                y1={CHART_HEIGHT - GRID_LABEL_HEIGHT}
                y2={LEGEND_HEIGHT}
                strokeWidth={GRIDLINE_WIDTH}
                className={
                  value === 0 ? styles.mainLayoutLine : styles.gridLine
                }
              />
              <text
                x={x(value)}
                y={CHART_HEIGHT - GRID_LABEL_HEIGHT + 10}
                textAnchor="middle"
                fontSize={shouldUseXLFont ? 10 : 7}
                className={styles.gridLabel}
              >
                {gridLabelFormatter(value)}
              </text>
            </g>
          );
        })}
        {candidateNames.map((candidate, ind) => {
          const {
            raised,
            industry_direct,
            industry_super_pac,
            outside_support,
            crypto_support,
            outside_oppose,
            crypto_oppose,
          } = data[ind];
          const yCandidate = y(candidate) || 0;
          const x0 = x(0);
          const xRaised = x(raised);
          const xRaisedWidth = Math.max(1, xRaised - x0);
          const xIndustryDirectWidth =
            Math.max(1, x(industry_direct) - x0) - GRIDLINE_WIDTH / 2;
          const xOutsideSupport = x(outside_support) - x0;
          const xOutsideSupportWidth = Math.max(1, xOutsideSupport);
          const combinedCryptoSupport = crypto_support + industry_super_pac;
          const xCryptoSupportWidth = Math.max(
            1,
            x(combinedCryptoSupport) - x0,
          );
          const xOutsideOpposeStart = Math.min(x0 - 1, x(-outside_oppose));
          const xOutsideOpposeWidth =
            Math.max(1, x(outside_oppose) - x0) - GRIDLINE_WIDTH / 2;
          const xCryptoOpposeStart = Math.min(x0 - 1, x(-crypto_oppose));
          const xCryptoOpposeWidth =
            Math.max(1, x(crypto_oppose) - x0) - GRIDLINE_WIDTH / 2;
          return (
            <g key={candidate}>
              {raised && (
                <g
                  onMouseEnter={() => setHovered({ candidate, bar: "raised" })}
                  onMouseLeave={() => setHovered(null)}
                >
                  <motion.rect
                    x={x0 + GRIDLINE_WIDTH / 2}
                    y={yCandidate}
                    width={xRaisedWidth - GRIDLINE_WIDTH / 2}
                    height={y.bandwidth()}
                    className={`${styles.raisedBar} ${styles.spendingBar}`}
                    initial={false}
                    animate={{
                      strokeOpacity:
                        hovered !== null &&
                        hovered.candidate === candidate &&
                        hovered.bar === "raised"
                          ? 1
                          : 0,
                    }}
                  />
                  {hovered !== null &&
                    hovered.candidate === candidate &&
                    hovered.bar === "raised" && (
                      <BarLabel
                        x={xRaised}
                        width={xRaisedWidth}
                        y={yCandidate}
                        height={y.bandwidth()}
                        label={gridLabelFormatter(raised)}
                        shouldUseXLFont={shouldUseXLFont}
                      />
                    )}
                </g>
              )}
              {raised && industry_direct > 0 && (
                <g
                  onMouseEnter={() =>
                    setHovered({ candidate, bar: "industry_direct" })
                  }
                  onMouseLeave={() => setHovered(null)}
                >
                  <motion.rect
                    x={x0 + GRIDLINE_WIDTH / 2}
                    y={yCandidate}
                    width={xIndustryDirectWidth}
                    height={y.bandwidth()}
                    fill="url(#hatch)"
                    className={styles.spendingBar}
                    initial={false}
                    animate={{
                      strokeOpacity:
                        hovered !== null &&
                        hovered.candidate === candidate &&
                        hovered.bar === "industry_direct"
                          ? 1
                          : 0,
                    }}
                  />
                  {hovered !== null &&
                    hovered.candidate === candidate &&
                    hovered.bar === "industry_direct" && (
                      <BarLabel
                        x={x0 + xIndustryDirectWidth}
                        width={xIndustryDirectWidth}
                        y={yCandidate}
                        height={y.bandwidth()}
                        label={gridLabelFormatter(industry_direct)}
                        shouldUseXLFont={shouldUseXLFont}
                        backgroundClass={styles.raisedBar}
                      />
                    )}
                </g>
              )}
              {outside_support && (
                <g
                  onMouseEnter={() =>
                    setHovered({ candidate, bar: "outside_support" })
                  }
                  onMouseLeave={() => setHovered(null)}
                >
                  <motion.rect
                    x={xRaised}
                    y={yCandidate}
                    width={xOutsideSupportWidth}
                    height={y.bandwidth()}
                    className={`${styles.outside_supportBar} ${styles.spendingBar}`}
                    initial={false}
                    animate={{
                      strokeOpacity:
                        hovered !== null &&
                        hovered.candidate === candidate &&
                        hovered.bar === "outside_support"
                          ? 1
                          : 0,
                    }}
                  />
                  {combinedCryptoSupport > 0 && (
                    <g
                      onMouseEnter={() =>
                        setHovered({ candidate, bar: "crypto_support" })
                      }
                      onMouseLeave={() => setHovered(null)}
                    >
                      <motion.rect
                        x={xRaised}
                        y={yCandidate}
                        width={xCryptoSupportWidth}
                        height={y.bandwidth()}
                        fill="url(#hatch)"
                        className={styles.spendingBar}
                        initial={false}
                        animate={{
                          strokeOpacity:
                            hovered !== null &&
                            hovered.candidate === candidate &&
                            hovered.bar === "crypto_support"
                              ? 1
                              : 0,
                        }}
                      />
                      {hovered !== null &&
                        hovered.candidate === candidate &&
                        hovered.bar === "crypto_support" && (
                          <BarLabel
                            x={xRaised + xCryptoSupportWidth}
                            width={xCryptoSupportWidth}
                            y={yCandidate}
                            height={y.bandwidth()}
                            label={gridLabelFormatter(combinedCryptoSupport)}
                            shouldUseXLFont={shouldUseXLFont}
                            backgroundClass={styles.barLabelSupport}
                          />
                        )}
                    </g>
                  )}
                  {hovered !== null &&
                    hovered.candidate === candidate &&
                    hovered.bar === "outside_support" && (
                      <BarLabel
                        x={xRaised + xOutsideSupportWidth}
                        width={xOutsideSupportWidth}
                        y={yCandidate}
                        height={y.bandwidth()}
                        label={gridLabelFormatter(outside_support)}
                        shouldUseXLFont={shouldUseXLFont}
                        backgroundClass={styles.barLabelSupport}
                      />
                    )}
                </g>
              )}
              {outside_oppose && (
                <g
                  onMouseEnter={() =>
                    setHovered({ candidate, bar: "outside_oppose" })
                  }
                  onMouseLeave={() => setHovered(null)}
                >
                  <motion.rect
                    x={xOutsideOpposeStart}
                    y={yCandidate}
                    width={xOutsideOpposeWidth}
                    height={y.bandwidth()}
                    className={`${styles.outside_opposeBar} ${styles.spendingBar}`}
                    initial={false}
                    animate={{
                      strokeOpacity:
                        hovered !== null &&
                        hovered.candidate === candidate &&
                        hovered.bar === "outside_oppose"
                          ? 1
                          : 0,
                    }}
                  />
                  {crypto_oppose && (
                    <g
                      onMouseEnter={() =>
                        setHovered({ candidate, bar: "crypto_oppose" })
                      }
                      onMouseLeave={() => setHovered(null)}
                    >
                      <motion.rect
                        x={xCryptoOpposeStart}
                        y={yCandidate}
                        width={xCryptoOpposeWidth}
                        height={y.bandwidth()}
                        fill="url(#hatch)"
                        className={styles.spendingBar}
                        initial={false}
                        animate={{
                          strokeOpacity:
                            hovered !== null &&
                            hovered.candidate === candidate &&
                            hovered.bar === "crypto_oppose"
                              ? 1
                              : 0,
                        }}
                      />
                      {hovered !== null &&
                        hovered.candidate === candidate &&
                        hovered.bar === "crypto_oppose" && (
                          <BarLabel
                            x={xCryptoOpposeStart}
                            width={xCryptoOpposeWidth}
                            y={yCandidate}
                            height={y.bandwidth()}
                            label={gridLabelFormatter(crypto_oppose)}
                            shouldUseXLFont={shouldUseXLFont}
                            negative={true}
                            backgroundClass={styles.barLabelOppose}
                          />
                        )}
                    </g>
                  )}
                  {hovered !== null &&
                    hovered.candidate === candidate &&
                    hovered.bar === "outside_oppose" && (
                      <BarLabel
                        x={xOutsideOpposeStart}
                        width={xOutsideOpposeWidth}
                        y={yCandidate}
                        height={y.bandwidth()}
                        shouldUseXLFont={shouldUseXLFont}
                        negative={true}
                        label={gridLabelFormatter(outside_oppose)}
                        backgroundClass={styles.barLabelOppose}
                      />
                    )}
                </g>
              )}
              <foreignObject
                x={0}
                width={CANDIDATE_LABEL_WIDTH - 25}
                y={yCandidate - y.bandwidth() / 2}
                height={y.bandwidth() * 2}
              >
                <div
                  className={`${styles.candidateLabel} ${shouldUseXLFont ? styles.xlFont : ""}`}
                >
                  <Candidate
                    candidateSummary={
                      candidate in election.candidates
                        ? election.candidates[candidate]
                        : undefined
                    }
                    chart={true}
                  />
                  <div className={styles.candidateLabelName}>{candidate}</div>
                </div>
              </foreignObject>
            </g>
          );
        })}
        <g>
          <g>
            <rect
              x={0}
              y={LEGEND_Y}
              width={10}
              height={10}
              className={styles.raisedBar}
            />
            <foreignObject x={12} y={LEGEND_Y - 5} width={65} height={20}>
              <div
                className={`${styles.spendingLegend} ${shouldUseXLFont ? styles.xlFont : ""}`}
              >
                Raised by candidate
              </div>
            </foreignObject>
          </g>
          <g transform={`translate(${CHART_WIDTH / 4}, 0)`}>
            <rect
              x={0}
              y={LEGEND_Y}
              width={10}
              height={10}
              className={styles.outside_supportBar}
            />
            <foreignObject x={12} y={LEGEND_Y - 5} width={65} height={20}>
              <div
                className={`${styles.spendingLegend} ${shouldUseXLFont ? styles.xlFont : ""}`}
              >
                Outside spending to support
              </div>
            </foreignObject>
          </g>
          <g transform={`translate(${(CHART_WIDTH * 2) / 4}, 0)`}>
            <rect
              x={0}
              y={LEGEND_Y}
              width={10}
              height={10}
              className={styles.outside_opposeBar}
            />
            <foreignObject x={12} y={LEGEND_Y - 5} width={65} height={20}>
              <div
                className={`${styles.spendingLegend} ${shouldUseXLFont ? styles.xlFont : ""}`}
              >
                Outside spending to oppose
              </div>
            </foreignObject>
          </g>
          <g transform={`translate(${(CHART_WIDTH * 3) / 4}, 0)`}>
            <rect
              x={0}
              y={LEGEND_Y}
              width={10}
              height={10}
              className={styles.cryptoSpendingLabel}
            />
            <rect
              x={0}
              y={LEGEND_Y}
              width={10}
              height={10}
              fill="url(#hatch)"
            />
            <foreignObject x={12} y={LEGEND_Y - 5} width={65} height={20}>
              <div
                className={`${styles.spendingLegend} ${shouldUseXLFont ? styles.xlFont : ""}`}
              >
                Crypto spending
              </div>
            </foreignObject>
          </g>
        </g>
      </svg>
      {data.some((d) => d.industry_super_pac > 0) && (
        <div className="secondary small">
          Outside spending bars show money already spent by super PACs. Hatching
          shows crypto industry contributions to super PACs regardless of
          whether the super PAC has deployed the funds. Because super PACs can
          hold unspent cash, the hatched amount may exceed outside spending to
          date.
        </div>
      )}
    </div>
  );
}
