"use client";

import * as d3 from "d3";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import Candidate, { CandidateImage } from "@/app/components/Candidate";
import Skeleton from "@/app/components/skeletons/Skeleton";
import { useBreakpoint } from "@/app/hooks/useBreakpoint";
import sharedStyles from "@/app/shared.module.css";
import { Beneficiary } from "@/app/types/Beneficiaries";
import { CandidateSummary, ElectionGroup } from "@/app/types/Elections";
import { Sector } from "@/app/types/Sector";
import { matchesSector } from "@/app/utils/sector";

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
const CHART_IMAGE_HEIGHT = 20;

function getTotalSpending(candidate: CandidateSummary) {
  return (
    (candidate.outside_spending?.support_total || 0) +
    (candidate.outside_spending?.oppose_total || 0) +
    (candidate.raised_total || 0)
  );
}

function BarLabel({
  x,
  y,
  height,
  label,
  shouldUseXLFont,
  negative,
  backgroundClass,
}: {
  x: number;
  y: number;
  height: number;
  label: string;
  shouldUseXLFont?: boolean;
  negative?: boolean;
  backgroundClass?: string;
}) {
  const minWidth = shouldUseXLFont
    ? BAR_LABEL_MIN_WIDTH * 1.5
    : BAR_LABEL_MIN_WIDTH;
  // x is the left edge for negative (oppose) bars, right edge for positive (support) bars
  const textStart = negative ? x : x - minWidth;
  const hug = negative ? "hugLeft" : "hugRight";
  const LABEL_HEIGHT = 10;

  return (
    <motion.foreignObject
      x={textStart}
      y={y + height}
      width={minWidth}
      height={LABEL_HEIGHT}
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
        {label}
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
    | "crypto_oppose"
    | "ai_support"
    | "ai_oppose";
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
    .padding(0.7);
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
                height={y.bandwidth()}
                className={styles.raisedBar}
              />
              {outside_oppose && (
                <rect
                  x={xOutsideOpposeStart}
                  y={yCandidate}
                  height={y.bandwidth()}
                  className={styles.raisedBar}
                />
              )}

              <foreignObject
                x={0}
                width={CANDIDATE_LABEL_WIDTH - 25}
                y={yCandidate + y.bandwidth() / 2 - CHART_IMAGE_HEIGHT / 2}
                height={CHART_IMAGE_HEIGHT}
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
  sector,
  beneficiaries,
}: {
  election: ElectionGroup;
  labelId: string;
  sector: Sector;
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
    () => Math.max(150, candidateNames.length * 30),
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
          crypto_industry_super_pac: 0,
          ai_industry_super_pac: 0,
          outside_support: 0,
          outside_oppose: 0,
          crypto_support: 0,
          crypto_oppose: 0,
          ai_support: 0,
          ai_oppose: 0,
        };
        if (!summary) {
          return candidateData;
        }
        candidateData.raised = summary.raised_total || 0;
        candidateData.crypto_support = summary.crypto_support_total || 0;
        candidateData.crypto_oppose = summary.crypto_oppose_total || 0;
        candidateData.ai_support = summary.ai_support_total || 0;
        candidateData.ai_oppose = summary.ai_oppose_total || 0;
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
            const groupSector = companyGroup.sector;
            const isCrypto =
              groupSector != null && matchesSector(groupSector, "crypto");
            const isAI =
              groupSector != null && matchesSector(groupSector, "ai");
            for (const contribution of companyGroup.contributions) {
              const isSuperPAC = contribution.committees.some(
                (c) =>
                  c.committee_type_full?.startsWith("Super") ||
                  c.committee_type_full?.startsWith("Hybrid"),
              );
              if (!isSuperPAC) {
                const inCurrentSector =
                  sector === "all" ||
                  (sector === "crypto" && isCrypto) ||
                  (sector === "ai" && isAI);
                if (inCurrentSector) {
                  candidateData.industry_direct += contribution.total;
                }
              } else {
                candidateData.industry_super_pac += contribution.total;
                if (isCrypto) {
                  candidateData.crypto_industry_super_pac += contribution.total;
                }
                if (isAI) {
                  candidateData.ai_industry_super_pac += contribution.total;
                }
              }
            }
          }
        }
        return candidateData;
      }),
    [candidateNames, election.candidates, beneficiaries, sector],
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
        .padding(0.7),
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
        ai_support,
        outside_oppose,
        crypto_oppose,
        ai_oppose,
      } = data[ind];
      const parts: string[] = [];
      if (raised) {
        let raisedStr = `Raised ${altFormatter(raised)}`;
        if (industry_direct > 0) {
          raisedStr += ` (${altFormatter(industry_direct)} from industry donors)`;
        }
        parts.push(raisedStr);
      }
      if (outside_support) {
        let supportStr = `${altFormatter(outside_support)} in outside spending to support`;
        const sectorParts: string[] = [];
        if (sector !== "ai" && crypto_support > 0) {
          sectorParts.push(`${altFormatter(crypto_support)} from crypto PACs`);
        }
        if (sector !== "crypto" && ai_support > 0) {
          sectorParts.push(`${altFormatter(ai_support)} from AI PACs`);
        }
        if (sectorParts.length > 0) {
          supportStr += ` (${sectorParts.join(", ")})`;
        }
        parts.push(supportStr);
      }
      if (outside_oppose) {
        let opposeStr = `${altFormatter(outside_oppose)} in outside spending to oppose`;
        const sectorParts: string[] = [];
        if (sector !== "ai" && crypto_oppose > 0) {
          sectorParts.push(`${altFormatter(crypto_oppose)} from crypto PACs`);
        }
        if (sector !== "crypto" && ai_oppose > 0) {
          sectorParts.push(`${altFormatter(ai_oppose)} from AI PACs`);
        }
        if (sectorParts.length > 0) {
          opposeStr += ` (${sectorParts.join(", ")})`;
        }
        parts.push(opposeStr);
      }
      const nameWithParty = summary?.party
        ? `${candidate} (${summary.party})`
        : candidate;
      lines.push(`${nameWithParty}: ${parts.join(", ")}`);
    });
    return lines.join("\n");
  }, [candidateNames, election.candidates, data, sector]);

  const legendItems = useMemo(
    () => [
      { label: "Raised by candidate", type: "raised" as const },
      { label: "Outside spending to support", type: "support" as const },
      { label: "Outside spending to oppose", type: "oppose" as const },
      ...(sector !== "ai"
        ? [{ label: "Crypto spending", type: "crypto" as const }]
        : []),
      ...(sector !== "crypto"
        ? [{ label: "AI spending", type: "ai" as const }]
        : []),
    ],
    [sector],
  );

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
          <pattern
            id="dots"
            width={5}
            height={5}
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0,0 L5,5 M5,0 L0,5"
              stroke="#0f172a"
              strokeWidth={0.75}
            />
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
            crypto_industry_super_pac,
            ai_industry_super_pac,
            outside_support,
            outside_oppose,
            crypto_support,
            crypto_oppose,
            ai_support,
            ai_oppose,
          } = data[ind];
          const yCandidate = y(candidate) || 0;
          const x0 = x(0);
          const xRaised = x(raised);
          const xRaisedWidth = Math.max(1, xRaised - x0);
          const xIndustryDirectWidth =
            Math.max(1, x(industry_direct) - x0) - GRIDLINE_WIDTH / 2;
          const xOutsideSupport = x(outside_support) - x0;
          const xOutsideSupportWidth = Math.max(1, xOutsideSupport);
          const combinedCryptoSupport =
            crypto_support + crypto_industry_super_pac;
          const xCryptoSupportWidth = Math.max(
            1,
            x(combinedCryptoSupport) - x0,
          );
          const combinedAiSupport = ai_support + ai_industry_super_pac;
          const xAiSupportWidth = Math.max(1, x(combinedAiSupport) - x0);
          const xOutsideOpposeStart = Math.min(x0 - 1, x(-outside_oppose));
          const xOutsideOpposeWidth =
            Math.max(1, x(outside_oppose) - x0) - GRIDLINE_WIDTH / 2;
          const xCryptoOpposeStart = Math.min(x0 - 1, x(-crypto_oppose));
          const xCryptoOpposeWidth =
            Math.max(1, x(crypto_oppose) - x0) - GRIDLINE_WIDTH / 2;
          const xAiOpposeStart = Math.min(x0 - 1, x(-ai_oppose));
          const xAiOpposeWidth =
            Math.max(1, x(ai_oppose) - x0) - GRIDLINE_WIDTH / 2;
          // When both sectors are visible, stack AI after crypto instead of overlapping
          const aiSupportX =
            sector !== "ai" && combinedCryptoSupport > 0
              ? xRaised + xCryptoSupportWidth
              : xRaised;
          const aiOpposeX =
            sector !== "ai" && crypto_oppose > 0
              ? xCryptoOpposeStart - xAiOpposeWidth
              : xAiOpposeStart;
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
                  {sector !== "ai" && combinedCryptoSupport > 0 && (
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
                            y={yCandidate}
                            height={y.bandwidth()}
                            label={gridLabelFormatter(combinedCryptoSupport)}
                            shouldUseXLFont={shouldUseXLFont}
                            backgroundClass={styles.barLabelSupport}
                          />
                        )}
                    </g>
                  )}
                  {sector !== "crypto" && combinedAiSupport > 0 && (
                    <g
                      onMouseEnter={() =>
                        setHovered({ candidate, bar: "ai_support" })
                      }
                      onMouseLeave={() => setHovered(null)}
                    >
                      <motion.rect
                        x={aiSupportX}
                        y={yCandidate}
                        width={xAiSupportWidth}
                        height={y.bandwidth()}
                        fill="url(#dots)"
                        className={styles.spendingBar}
                        initial={false}
                        animate={{
                          strokeOpacity:
                            hovered !== null &&
                            hovered.candidate === candidate &&
                            hovered.bar === "ai_support"
                              ? 1
                              : 0,
                        }}
                      />
                      {hovered !== null &&
                        hovered.candidate === candidate &&
                        hovered.bar === "ai_support" && (
                          <BarLabel
                            x={aiSupportX + xAiSupportWidth}
                            y={yCandidate}
                            height={y.bandwidth()}
                            label={gridLabelFormatter(combinedAiSupport)}
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
                  {sector !== "ai" && crypto_oppose > 0 && (
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
                  {sector !== "crypto" && ai_oppose > 0 && (
                    <g
                      onMouseEnter={() =>
                        setHovered({ candidate, bar: "ai_oppose" })
                      }
                      onMouseLeave={() => setHovered(null)}
                    >
                      <motion.rect
                        x={aiOpposeX}
                        y={yCandidate}
                        width={xAiOpposeWidth}
                        height={y.bandwidth()}
                        fill="url(#dots)"
                        className={styles.spendingBar}
                        initial={false}
                        animate={{
                          strokeOpacity:
                            hovered !== null &&
                            hovered.candidate === candidate &&
                            hovered.bar === "ai_oppose"
                              ? 1
                              : 0,
                        }}
                      />
                      {hovered !== null &&
                        hovered.candidate === candidate &&
                        hovered.bar === "ai_oppose" && (
                          <BarLabel
                            x={aiOpposeX}
                            y={yCandidate}
                            height={y.bandwidth()}
                            label={gridLabelFormatter(ai_oppose)}
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
                y={yCandidate + y.bandwidth() / 2 - CHART_IMAGE_HEIGHT / 2}
                height={CHART_IMAGE_HEIGHT}
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
          {legendItems.map((item, i) => {
            const spacing = CHART_WIDTH / legendItems.length;
            return (
              <g key={item.type} transform={`translate(${spacing * i}, 0)`}>
                {item.type === "raised" && (
                  <rect
                    x={0}
                    y={LEGEND_Y}
                    width={5}
                    height={5}
                    className={styles.raisedBar}
                  />
                )}
                {item.type === "support" && (
                  <rect
                    x={0}
                    y={LEGEND_Y}
                    width={5}
                    height={5}
                    className={styles.outside_supportBar}
                  />
                )}
                {item.type === "oppose" && (
                  <rect
                    x={0}
                    y={LEGEND_Y}
                    width={5}
                    height={5}
                    className={styles.outside_opposeBar}
                  />
                )}
                {item.type === "crypto" && (
                  <>
                    <rect
                      x={0}
                      y={LEGEND_Y}
                      width={5}
                      height={5}
                      className={styles.cryptoSpendingLabel}
                    />
                    <rect
                      x={0}
                      y={LEGEND_Y}
                      width={5}
                      height={5}
                      fill="url(#hatch)"
                    />
                  </>
                )}
                {item.type === "ai" && (
                  <>
                    <rect
                      x={0}
                      y={LEGEND_Y}
                      width={5}
                      height={5}
                      className={styles.aiSpendingLabel}
                    />
                    <rect
                      x={0}
                      y={LEGEND_Y}
                      width={5}
                      height={5}
                      fill="url(#dots)"
                    />
                  </>
                )}
                <foreignObject
                  x={7}
                  y={LEGEND_Y - 3.5}
                  width={spacing - 9}
                  height={12}
                >
                  <div
                    className={`${styles.spendingLegend} ${shouldUseXLFont ? styles.xlFont : ""}`}
                  >
                    {item.label}
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </g>
      </svg>
      {data.some((d) => d.industry_super_pac > 0) && (
        <div className={sharedStyles.subtitle}>
          Outside spending bars show money already spent by super PACs. Hatching
          shows industry contributions to super PACs regardless of whether the
          super PAC has deployed the funds. Because super PACs can hold unspent
          cash, the hatched amount may exceed outside spending to date.
        </div>
      )}
    </div>
  );
}
