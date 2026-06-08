"use client";

import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useFloating,
} from "@floating-ui/react";
import Link from "next/link";
import { useState } from "react";

import { BESector } from "@/app/types/Sector";
import { formatCompact } from "@/app/utils/humanize";

import styles from "./CompanyBubbleChart.module.css";

const SIZE = 400;

export type BubbleLine = {
  text: string;
  size: number;
  kind: "label" | "amount";
  y: number;
};

export type Bubble = {
  id: string;
  name: string;
  total: number;
  sector: BESector | undefined;
  subtitle?: string;
  rank: number;
  totalEntities: number;
  share: number;
  href: string;
  x: number;
  y: number;
  r: number;
  darkText: boolean;
  lines: BubbleLine[];
};

function sectorClass(sector: BESector | undefined): string {
  if (sector === "crypto") {
    return styles.cryptoCircle;
  }
  if (sector === "ai") {
    return styles.aiCircle;
  }
  return styles.bothCircle;
}

function sectorDotClass(sector: BESector | undefined): string {
  if (sector === "crypto") {
    return styles.legendDotCrypto;
  }
  if (sector === "ai") {
    return styles.legendDotAi;
  }
  return styles.legendDotBoth;
}

function sectorLabel(sector: BESector | undefined): string {
  if (sector === "crypto") {
    return "Crypto";
  }
  if (sector === "ai") {
    return "AI";
  }
  return "Crypto & AI";
}

export default function CompanyBubbleChartSvg({
  bubbles,
}: {
  bubbles: Bubble[];
}) {
  const [hovered, setHovered] = useState<Bubble | null>(null);

  const { refs, floatingStyles } = useFloating({
    open: hovered !== null,
    placement: "top",
    whileElementsMounted: autoUpdate,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
  });

  return (
    <>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width="100%"
        className={styles.svg}
        aria-label="Company contributions bubble chart"
      >
        {bubbles.map((b) => (
          <Link key={b.id} href={b.href} className={styles.bubbleLink}>
            <circle
              cx={b.x}
              cy={b.y}
              r={b.r}
              className={`${styles.bubble} ${sectorClass(b.sector)}`}
              onMouseEnter={(e) => {
                // Pin to where the cursor entered the bubble, not the live
                // pointer — the tooltip stays put while hovering.
                const { clientX, clientY } = e;
                refs.setPositionReference({
                  getBoundingClientRect: () => ({
                    x: clientX,
                    y: clientY,
                    width: 0,
                    height: 0,
                    top: clientY,
                    left: clientX,
                    right: clientX,
                    bottom: clientY,
                  }),
                });
                setHovered(b);
              }}
              onMouseLeave={() => setHovered(null)}
            />
            {b.lines.map((line, i) => (
              <text
                key={i}
                x={b.x}
                y={line.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={line.size}
                className={
                  line.kind === "amount"
                    ? `${styles.bubbleAmount} ${b.darkText ? styles.bubbleAmountDark : ""}`
                    : `${styles.bubbleLabel} ${b.darkText ? styles.bubbleLabelDark : ""}`
                }
                pointerEvents="none"
              >
                {line.text}
              </text>
            ))}
          </Link>
        ))}
      </svg>
      <FloatingPortal>
        {hovered && (
          <div
            ref={refs.setFloating} // eslint-disable-line react-hooks/refs
            style={floatingStyles}
            className={styles.tooltip}
            role="tooltip"
          >
            <p className={styles.tooltipName}>{hovered.name}</p>
            {hovered.subtitle && (
              <p className={styles.tooltipSubtitle}>{hovered.subtitle}</p>
            )}
            <p className={styles.tooltipAmount}>{formatCompact(hovered.total)}</p>
            <p className={styles.tooltipRank}>
              {`#${hovered.rank} of ${hovered.totalEntities} entities`}
              {hovered.share.toFixed(1) !== "0.0" &&
                ` · ${hovered.share.toFixed(1)}% of all contributions`}
            </p>
            <p className={styles.tooltipSector}>
              <span
                className={`${styles.legendDot} ${sectorDotClass(hovered.sector)}`}
              />
              {sectorLabel(hovered.sector)}
            </p>
          </div>
        )}
      </FloatingPortal>
    </>
  );
}
