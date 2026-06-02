import { humanizeRoundedCurrency } from "@/app/utils/humanize";

import styles from "./FlowSankey.module.css";

// ---------------------------------------------------------------------------
// Horizontal (desktop) layout constants
// ---------------------------------------------------------------------------
const VIEW_W = 1000;
const VIEW_H = 560;
const CHART_TOP = 60;
const CHART_H = 440;
const NODE_W = 26;
const NODE_GAP = 14;
const COL_LEFT_X = 200;
const COL_MID_X = 500;
const COL_RIGHT_X = 800;
// Where the residual band forks into its two arms — placed to the right of the
// PACs so the arms can reach the recipients without crossing the to_tracked band.
const FORK_X = COL_MID_X + NODE_W + 90;

// The residual ($ that left the sources but didn't go to tracked PACs) splits an
// unknown way between candidates, party committees, and other PACs. We can't
// measure the split, so the two arms are drawn at an indicative, unlabeled size;
// this fraction only sets how the (unknowable) residual is apportioned visually.
const DIRECT_ARM_FRACTION = 0.5;

// Left → right ribbon (horizontal flow)
function makePath(
  x0: number,
  y0t: number,
  y0b: number,
  x1: number,
  y1t: number,
  y1b: number,
): string {
  const cx = (x0 + x1) / 2;
  return (
    `M ${x0} ${y0t} C ${cx} ${y0t} ${cx} ${y1t} ${x1} ${y1t} ` +
    `L ${x1} ${y1b} C ${cx} ${y1b} ${cx} ${y0b} ${x0} ${y0b} Z`
  );
}

// ---------------------------------------------------------------------------
// Vertical (mobile) layout constants
// ---------------------------------------------------------------------------
const VIEW_W_V = 560;
const VIEW_H_V = 720;
const CHART_LEFT_V = 80;
const CHART_W_V = 340;
const ROW_H_V = 26;
const ROW_TOP_Y_V = 70;
const ROW_MID_Y_V = 360;
const ROW_BOT_Y_V = 650;
const FORK_Y_V = ROW_MID_Y_V + ROW_H_V + 70;

// Top → bottom ribbon (vertical flow)
function makePathV(
  y0: number,
  x0l: number,
  x0r: number,
  y1: number,
  x1l: number,
  x1r: number,
): string {
  const cy = (y0 + y1) / 2;
  return (
    `M ${x0l} ${y0} C ${x0l} ${cy} ${x1l} ${cy} ${x1l} ${y1} ` +
    `L ${x1r} ${y1} C ${x1r} ${cy} ${x0r} ${cy} ${x0r} ${y0} Z`
  );
}

function money(amount: number): string {
  return humanizeRoundedCurrency(amount, true, 1);
}

export default function FlowSankey({
  total,
  toTracked,
  receipts,
  expenditures,
}: {
  total: number;
  toTracked: number;
  receipts: number;
  expenditures: number;
}) {
  // Money from tracked sources that did NOT go to tracked super PACs. We know the
  // total ($ that forks below), but not how it splits between candidates, party
  // committees, and other PACs.
  const directAndOther = Math.max(0, total - toTracked);
  // Contributions to the super PACs from contributors the site doesn't track.
  const otherContrib = Math.max(0, receipts - toTracked);

  // Column heights in dollars; scale so the tallest column fills CHART_H
  const leftH = total + otherContrib;
  const midH = receipts;
  const rightH = directAndOther + expenditures;
  const maxColH = Math.max(leftH, midH, rightH, 1);
  const scale = CHART_H / maxColH;

  // -------------------------------------------------------------------------
  // Horizontal node geometry
  // -------------------------------------------------------------------------
  const companiesH = total * scale;
  const otherH = otherContrib * scale;
  const pacH = receipts * scale;
  const toTrackedH = toTracked * scale;
  const candExpH = expenditures * scale;
  const residualH = directAndOther * scale;
  const directArmH = residualH * DIRECT_ARM_FRACTION;
  const otherArmH = residualH - directArmH;

  // Sources column: Other contributors on top (so its ribbon feeds the top of the
  // PACs node without crossing the residual), Tracked companies below.
  const otherY = CHART_TOP;
  const companiesY = CHART_TOP + (otherContrib > 0 ? otherH + NODE_GAP : 0);

  // PACs node, top-anchored. Incoming: otherContrib on top, to_tracked below.
  const pacY = CHART_TOP;

  // Residual trunk: a flat band at the sources' residual level that forks at
  // FORK_X into a direct arm (→ Candidates) and an other arm (→ Other committees).
  const trunkTop = companiesY + toTrackedH;
  const trunkBot = companiesY + companiesH;

  // Recipients. Other committees is bottom-anchored; Candidates sits above it and
  // receives the expenditures ribbon (top) plus the direct arm (below).
  const otherCommH = otherArmH;
  const otherCommY = CHART_TOP + CHART_H - otherCommH;
  const candidatesH = candExpH + directArmH;
  const candidatesY = Math.max(
    CHART_TOP,
    CHART_TOP + (otherCommY - NODE_GAP - CHART_TOP - candidatesH) / 2,
  );

  // -------------------------------------------------------------------------
  // Vertical node geometry (mobile)
  // -------------------------------------------------------------------------
  const scaleV = CHART_W_V / maxColH;
  const companiesWV = total * scaleV;
  const otherWV = otherContrib * scaleV;
  const pacWV = receipts * scaleV;
  const toTrackedWV = toTracked * scaleV;
  const candExpWV = expenditures * scaleV;
  const residualWV = directAndOther * scaleV;
  const directArmWV = residualWV * DIRECT_ARM_FRACTION;
  const otherArmWV = residualWV - directArmWV;

  const otherXV = CHART_LEFT_V;
  const companiesXV =
    CHART_LEFT_V + (otherContrib > 0 ? otherWV + NODE_GAP : 0);

  const pacXV = CHART_LEFT_V;

  const trunkLeftV = companiesXV + toTrackedWV;
  const trunkRightV = companiesXV + companiesWV;

  const candidatesXV = CHART_LEFT_V;
  const otherCommWV = otherArmWV;
  const otherCommXV = CHART_LEFT_V + CHART_W_V - otherCommWV;

  return (
    <div className={styles.wrapper}>
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={styles.legendSwatchTracked} />
          <span>Tracked money</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendSwatchOther} />
          <span>Contributions from untracked sources</span>
        </div>
      </div>

      {/* Horizontal SVG: desktop (left-to-right flow) */}
      <svg
        className={styles.svgHorizontal}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        aria-label="Diagram showing how money flows from tracked companies and individuals through tracked super PACs to candidates."
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Column headers */}
        <text
          x={COL_LEFT_X + NODE_W / 2}
          y={CHART_TOP - 16}
          textAnchor="middle"
          className={styles.colHeader}
        >
          Sources
        </text>
        <text
          x={COL_MID_X + NODE_W / 2}
          y={CHART_TOP - 16}
          textAnchor="middle"
          className={styles.colHeader}
        >
          Super PACs
        </text>
        <text
          x={COL_RIGHT_X + NODE_W / 2}
          y={CHART_TOP - 16}
          textAnchor="middle"
          className={styles.colHeader}
        >
          Recipients
        </text>

        {/* Ribbons (behind nodes) */}
        {/* Companies → super PACs (to_tracked) */}
        <path
          d={makePath(
            COL_LEFT_X + NODE_W,
            companiesY,
            companiesY + toTrackedH,
            COL_MID_X,
            pacY + otherH,
            pacY + otherH + toTrackedH,
          )}
          fill="var(--color-lime-500)"
          opacity={0.45}
        >
          <title>
            {money(toTracked)} from tracked companies and individuals to tracked
            super PACs
          </title>
        </path>
        {/* Residual trunk: companies → fork (labeled, before it splits) */}
        <path
          d={makePath(
            COL_LEFT_X + NODE_W,
            trunkTop,
            trunkBot,
            FORK_X,
            trunkTop,
            trunkBot,
          )}
          fill="var(--color-lime-500)"
          opacity={0.2}
        >
          <title>
            {money(directAndOther)} from tracked companies and individuals that
            did not go to tracked super PACs
          </title>
        </path>
        {/* Direct arm: fork → candidates (indeterminate, unlabeled) */}
        <path
          d={makePath(
            FORK_X,
            trunkTop,
            trunkTop + directArmH,
            COL_RIGHT_X,
            candidatesY + candExpH,
            candidatesY + candExpH + directArmH,
          )}
          fill="var(--color-lime-500)"
          opacity={0.2}
        >
          <title>
            An unknown share of these direct contributions goes to candidates
          </title>
        </path>
        {/* Other arm: fork → other committees (indeterminate, unlabeled) */}
        <path
          d={makePath(
            FORK_X,
            trunkTop + directArmH,
            trunkBot,
            COL_RIGHT_X,
            otherCommY,
            otherCommY + otherArmH,
          )}
          fill="var(--color-lime-500)"
          opacity={0.2}
        >
          <title>
            The rest goes to party committees or other super PACs
          </title>
        </path>
        {/* Other contributors → super PACs */}
        {otherContrib > 0 && (
          <path
            d={makePath(
              COL_LEFT_X + NODE_W,
              otherY,
              otherY + otherH,
              COL_MID_X,
              pacY,
              pacY + otherH,
            )}
            fill="var(--color-neutral-400)"
            opacity={0.4}
          >
            <title>
              {money(otherContrib)} to tracked super PACs from contributors the
              site does not track
            </title>
          </path>
        )}
        {/* Super PACs → candidates (expenditures, labeled) */}
        <path
          d={makePath(
            COL_MID_X + NODE_W,
            pacY,
            pacY + candExpH,
            COL_RIGHT_X,
            candidatesY,
            candidatesY + candExpH,
          )}
          fill="var(--color-lime-500)"
          opacity={0.45}
        >
          <title>
            {money(expenditures)} spent by tracked super PACs on candidates
          </title>
        </path>
        <text
          x={(COL_MID_X + NODE_W + COL_RIGHT_X) / 2}
          y={(pacY + candExpH / 2 + candidatesY + candExpH / 2) / 2}
          textAnchor="middle"
          className={styles.ribbonAmount}
        >
          {money(expenditures)}
        </text>

        {/* Companies node */}
        <rect
          x={COL_LEFT_X}
          y={companiesY}
          width={NODE_W}
          height={companiesH}
          fill="var(--color-lime-600)"
        />
        <text
          x={COL_LEFT_X - 8}
          y={companiesY + companiesH / 2 - 6}
          textAnchor="end"
          className={styles.nodeName}
        >
          <tspan x={COL_LEFT_X - 8}>Tracked companies</tspan>
          <tspan x={COL_LEFT_X - 8} dy="14">
            &amp; individuals
          </tspan>
        </text>
        <text
          x={COL_LEFT_X - 8}
          y={companiesY + companiesH / 2 + 24}
          textAnchor="end"
          className={styles.nodeAmount}
        >
          {money(total)}
        </text>

        {/* Other contributors node */}
        {otherContrib > 0 && (
          <>
            <rect
              x={COL_LEFT_X}
              y={otherY}
              width={NODE_W}
              height={otherH}
              fill="var(--color-neutral-500)"
            />
            <text
              x={COL_LEFT_X - 8}
              y={otherY + otherH / 2 - 6}
              textAnchor="end"
              className={styles.nodeName}
            >
              Other contributors
            </text>
            <text
              x={COL_LEFT_X - 8}
              y={otherY + otherH / 2 + 10}
              textAnchor="end"
              className={styles.nodeAmount}
            >
              {money(otherContrib)}
            </text>
          </>
        )}

        {/* Super PACs node */}
        <rect
          x={COL_MID_X}
          y={pacY}
          width={NODE_W}
          height={pacH}
          fill="var(--color-lime-600)"
        />
        <text
          x={COL_MID_X + NODE_W + 8}
          y={pacY + pacH / 2 + 48}
          className={styles.nodeName}
        >
          Tracked super PACs
        </text>
        <text
          x={COL_MID_X + NODE_W + 8}
          y={pacY + pacH / 2 + 64}
          className={styles.nodeAmount}
        >
          {money(receipts)} received
        </text>

        {/* Residual trunk label (on the band, before it forks) */}
        <text
          x={(COL_LEFT_X + NODE_W + FORK_X) / 2 - 40}
          y={trunkTop + residualH / 2 - 1}
          textAnchor="middle"
          className={styles.nodeAmount}
        >
          {money(directAndOther)}
        </text>
        <text
          x={(COL_LEFT_X + NODE_W + FORK_X) / 2 - 40}
          y={trunkTop + residualH / 2 + 13}
          textAnchor="middle"
          className={styles.nodeCaption}
        >
          splits to candidates &amp; other committees
        </text>

        {/* Candidates node (no number — total is unknowable) */}
        <rect
          x={COL_RIGHT_X}
          y={candidatesY}
          width={NODE_W}
          height={candidatesH}
          fill="var(--color-lime-600)"
        />
        <text
          x={COL_RIGHT_X + NODE_W + 8}
          y={candidatesY + candidatesH / 2 + 4}
          className={styles.nodeName}
        >
          Candidates
        </text>

        {/* Other committees node (residual destination, de-emphasized) */}
        <rect
          x={COL_RIGHT_X}
          y={otherCommY}
          width={NODE_W}
          height={otherCommH}
          fill="var(--color-lime-600)"
          opacity={0.4}
        />
        <text
          x={COL_RIGHT_X + NODE_W + 8}
          y={otherCommY + otherCommH / 2 - 4}
          className={styles.nodeNameMuted}
        >
          Other committees
        </text>
        <text
          x={COL_RIGHT_X + NODE_W + 8}
          y={otherCommY + otherCommH / 2 + 11}
          className={styles.nodeCaption}
        >
          party committees &amp; other PACs
        </text>
      </svg>

      {/* Vertical SVG: mobile (top-to-bottom flow) */}
      <svg
        className={styles.svgVertical}
        viewBox={`0 0 ${VIEW_W_V} ${VIEW_H_V}`}
        aria-label="Diagram showing how money flows from tracked companies and individuals through tracked super PACs to candidates."
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Row headers */}
        <text x={10} y={ROW_TOP_Y_V - 8} className={styles.colHeader}>
          Sources
        </text>
        <text x={10} y={ROW_MID_Y_V - 8} className={styles.colHeader}>
          Super PACs
        </text>
        <text x={10} y={ROW_BOT_Y_V - 8} className={styles.colHeader}>
          Recipients
        </text>

        {/* Ribbons */}
        {/* Companies → super PACs (to_tracked) */}
        <path
          d={makePathV(
            ROW_TOP_Y_V + ROW_H_V,
            companiesXV,
            companiesXV + toTrackedWV,
            ROW_MID_Y_V,
            pacXV + otherWV,
            pacXV + otherWV + toTrackedWV,
          )}
          fill="var(--color-lime-500)"
          opacity={0.45}
        >
          <title>
            {money(toTracked)} from tracked companies and individuals to tracked
            super PACs
          </title>
        </path>
        {/* Residual trunk: companies → fork */}
        <path
          d={makePathV(
            ROW_TOP_Y_V + ROW_H_V,
            trunkLeftV,
            trunkRightV,
            FORK_Y_V,
            trunkLeftV,
            trunkRightV,
          )}
          fill="var(--color-lime-500)"
          opacity={0.2}
        >
          <title>
            {money(directAndOther)} from tracked companies and individuals that
            did not go to tracked super PACs
          </title>
        </path>
        {/* Direct arm: fork → candidates */}
        <path
          d={makePathV(
            FORK_Y_V,
            trunkLeftV,
            trunkLeftV + directArmWV,
            ROW_BOT_Y_V,
            candidatesXV + candExpWV,
            candidatesXV + candExpWV + directArmWV,
          )}
          fill="var(--color-lime-500)"
          opacity={0.2}
        >
          <title>
            An unknown share of these direct contributions goes to candidates
          </title>
        </path>
        {/* Other arm: fork → other committees */}
        <path
          d={makePathV(
            FORK_Y_V,
            trunkLeftV + directArmWV,
            trunkRightV,
            ROW_BOT_Y_V,
            otherCommXV,
            otherCommXV + otherCommWV,
          )}
          fill="var(--color-lime-500)"
          opacity={0.2}
        >
          <title>
            The rest goes to party committees or other super PACs
          </title>
        </path>
        {/* Other contributors → super PACs */}
        {otherContrib > 0 && (
          <path
            d={makePathV(
              ROW_TOP_Y_V + ROW_H_V,
              otherXV,
              otherXV + otherWV,
              ROW_MID_Y_V,
              pacXV,
              pacXV + otherWV,
            )}
            fill="var(--color-neutral-400)"
            opacity={0.4}
          >
            <title>
              {money(otherContrib)} to tracked super PACs from contributors the
              site does not track
            </title>
          </path>
        )}
        {/* Super PACs → candidates (expenditures, labeled) */}
        <path
          d={makePathV(
            ROW_MID_Y_V + ROW_H_V,
            pacXV,
            pacXV + candExpWV,
            ROW_BOT_Y_V,
            candidatesXV,
            candidatesXV + candExpWV,
          )}
          fill="var(--color-lime-500)"
          opacity={0.45}
        >
          <title>
            {money(expenditures)} spent by tracked super PACs on candidates
          </title>
        </path>
        <text
          x={pacXV + candExpWV / 2}
          y={(ROW_MID_Y_V + ROW_H_V + ROW_BOT_Y_V) / 2}
          textAnchor="middle"
          className={styles.ribbonAmount}
        >
          {money(expenditures)}
        </text>

        {/* Top row: companies node */}
        <rect
          x={companiesXV}
          y={ROW_TOP_Y_V}
          width={companiesWV}
          height={ROW_H_V}
          fill="var(--color-lime-600)"
        />
        <text x={companiesXV} y={ROW_TOP_Y_V - 22} className={styles.nodeName}>
          Tracked companies &amp; individuals
        </text>
        <text x={companiesXV} y={ROW_TOP_Y_V - 8} className={styles.nodeAmount}>
          {money(total)}
        </text>

        {/* Top row: other contributors node */}
        {otherContrib > 0 && (
          <>
            <rect
              x={otherXV}
              y={ROW_TOP_Y_V}
              width={Math.max(otherWV, 2)}
              height={ROW_H_V}
              fill="var(--color-neutral-500)"
            />
            <text
              x={otherXV}
              y={ROW_TOP_Y_V + ROW_H_V + 14}
              className={styles.nodeCaption}
            >
              Other contributors: {money(otherContrib)}
            </text>
          </>
        )}

        {/* Mid row: super PACs node */}
        <rect
          x={pacXV}
          y={ROW_MID_Y_V}
          width={pacWV}
          height={ROW_H_V}
          fill="var(--color-lime-600)"
        />
        <text x={pacXV} y={ROW_MID_Y_V - 22} className={styles.nodeName}>
          Tracked super PACs
        </text>
        <text x={pacXV} y={ROW_MID_Y_V - 8} className={styles.nodeAmount}>
          {money(receipts)} received
        </text>

        {/* Residual trunk label */}
        <text
          x={(trunkLeftV + trunkRightV) / 2}
          y={(ROW_TOP_Y_V + ROW_H_V + ROW_MID_Y_V) / 2 - 7}
          textAnchor="middle"
          className={styles.nodeAmount}
        >
          {money(directAndOther)}
        </text>
        <text
          x={(trunkLeftV + trunkRightV) / 2}
          y={(ROW_TOP_Y_V + ROW_H_V + ROW_MID_Y_V) / 2 + 7}
          textAnchor="middle"
          className={styles.nodeCaption}
        >
          splits below
        </text>

        {/* Bottom row: candidates node (no number) */}
        <rect
          x={candidatesXV}
          y={ROW_BOT_Y_V}
          width={Math.max(candExpWV + directArmWV, 2)}
          height={ROW_H_V}
          fill="var(--color-lime-600)"
        />
        <text
          x={candidatesXV}
          y={ROW_BOT_Y_V + ROW_H_V + 16}
          className={styles.nodeName}
        >
          Candidates
        </text>

        {/* Bottom row: other committees node (de-emphasized) */}
        <rect
          x={otherCommXV}
          y={ROW_BOT_Y_V}
          width={Math.max(otherCommWV, 2)}
          height={ROW_H_V}
          fill="var(--color-lime-600)"
          opacity={0.4}
        />
        <text
          x={otherCommXV}
          y={ROW_BOT_Y_V + ROW_H_V + 16}
          className={styles.nodeNameMuted}
        >
          Other committees
        </text>
        <text
          x={otherCommXV}
          y={ROW_BOT_Y_V + ROW_H_V + 30}
          className={styles.nodeCaption}
        >
          party committees &amp; other PACs
        </text>
      </svg>
    </div>
  );
}
