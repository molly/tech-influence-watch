import Link from "next/link";

import sharedStyles from "@/app/shared.module.css";
import type {
  CommitteeConstantWithContributions,
  TransferEdge,
} from "@/app/types/Committee";
import { Sector } from "@/app/types/Sector";
import {
  humanizeApproximateRounded,
  humanizeList,
  humanizeNumber,
  humanizeRoundedCurrency,
} from "@/app/utils/humanize";
import { humanizeSector } from "@/app/utils/sector";

import styles from "./SankeyDiagram.module.css";

// SVG layout constants
const VIEW_W = 1000;
const VIEW_H = 540;
const CHART_TOP = 50;
const CHART_H = 440;
const NODE_W = 28;
const NODE_GAP = 2;
const COL_LEFT_X = 70;
const COL_MID_X = 460;
const COL_RIGHT_X = 830;

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

// Vertical layout constants (top-to-bottom flow for mobile)
const VIEW_W_V = 560;
const VIEW_H_V = 650;
const CHART_LEFT_V = 10;
const CHART_W_V = 540;
const ROW_H_V = 30;
const NODE_GAP_V = 2;
const ROW_TOP_Y_V = 65;
const ROW_MID_Y_V = 290;
const ROW_BOT_Y_V = 570;

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

type MidNode = {
  id: string;
  name: string;
  contributed: number;
  carryover: number;
  h: number;
  carryoverH: number;
  y: number;
};

type RightNode = {
  id: string;
  name: string;
  contributed: number;
  transferred: number;
  sentOut: number;
  carryover: number;
  totalH: number;
  transferH: number;
  directH: number;
  y: number;
};

export default function SankeyDiagram({
  sector,
  committees,
  totalFunds,
  transferEdges,
}: {
  sector: Sector;
  committees: CommitteeConstantWithContributions[];
  totalFunds: string;
  transferEdges: TransferEdge[];
}) {
  // Aggregate totals
  const netContributions = committees.reduce(
    (sum, c) => sum + c.total_contributed,
    0,
  );
  const totalTransferred = committees.reduce(
    (sum, c) => sum + c.total_transferred,
    0,
  );
  const totalCarryover = committees.reduce(
    (sum, c) => sum + c.last_cash_on_hand_end_period,
    0,
  );
  const totalExpenditures = committees.reduce(
    (sum, c) => sum + (c.independent_expenditures ?? 0),
    0,
  );
  const totalRemaining = Math.max(
    0,
    netContributions + totalCarryover - totalExpenditures,
  );
  // How much each committee sent out to other tracked committees
  const sentOutByCommittee = new Map<string, number>();
  for (const edge of transferEdges) {
    sentOutByCommittee.set(
      edge.fromId,
      (sentOutByCommittee.get(edge.fromId) ?? 0) + edge.amount,
    );
  }

  // Scale: pixels per dollar — both left and right span netContributions + totalCarryover
  const scale = (CHART_H - 15) / (netContributions + totalCarryover);
  const MIN_H = 4;

  const effectiveThisCycle = (c: CommitteeConstantWithContributions) =>
    c.total_contributed +
    c.total_transferred -
    (sentOutByCommittee.get(c.id) ?? 0);

  const effectiveFull = (c: CommitteeConstantWithContributions) =>
    effectiveThisCycle(c) + c.last_cash_on_hand_end_period;

  // Pre-compute which committees qualify for their own right bar so we can
  // promote them into mainMid even if their own resources are below MIN_H
  // (e.g. a committee with tiny direct contributions but large transfer receipts).
  const mainRightIds = new Set(
    committees
      .filter((c) => effectiveFull(c) * scale >= MIN_H)
      .map((c) => c.id),
  );

  // -----------------------------------------------------------------------
  // Build middle nodes (sorted by total_contributed desc)
  // -----------------------------------------------------------------------
  const sortedByContrib = [...committees].sort(
    (a, b) =>
      b.total_contributed +
      b.last_cash_on_hand_end_period -
      (a.total_contributed + a.last_cash_on_hand_end_period),
  );

  const mainMid: CommitteeConstantWithContributions[] = [];
  const otherMid: CommitteeConstantWithContributions[] = [];
  for (const c of sortedByContrib) {
    const totalMidH =
      (c.total_contributed + c.last_cash_on_hand_end_period) * scale;
    if (totalMidH < MIN_H && !mainRightIds.has(c.id)) {
      otherMid.push(c);
    } else {
      mainMid.push(c);
    }
  }

  const otherMidContributed = otherMid.reduce(
    (sum, c) => sum + c.total_contributed,
    0,
  );
  const otherMidCarryover = otherMid.reduce(
    (sum, c) => sum + c.last_cash_on_hand_end_period,
    0,
  );

  // Assign y positions for middle nodes
  let midY = CHART_TOP;
  const midNodes: MidNode[] = [];
  for (const c of mainMid) {
    const h = c.total_contributed * scale;
    const carryoverH = c.last_cash_on_hand_end_period * scale;
    midNodes.push({
      id: c.id,
      name: c.name,
      contributed: c.total_contributed,
      carryover: c.last_cash_on_hand_end_period,
      h,
      carryoverH,
      y: midY,
    });
    midY += h + carryoverH + NODE_GAP;
  }

  let otherMidNode: MidNode | null = null;
  if (otherMidContributed > 0) {
    const h = Math.max(MIN_H, otherMidContributed * scale);
    const carryoverH = otherMidCarryover * scale;
    otherMidNode = {
      id: "OTHER_MID",
      name: `${otherMid.length} others`,
      contributed: otherMidContributed,
      carryover: otherMidCarryover,
      h,
      carryoverH,
      y: midY,
    };
    midNodes.push(otherMidNode);
  }

  const midNodeById = new Map<string, MidNode>(midNodes.map((n) => [n.id, n]));

  // -----------------------------------------------------------------------
  // Build right nodes (sorted by full total including carryover desc)
  // -----------------------------------------------------------------------
  // Sort right column: network groups together, transfer sender first within each group,
  // then direct recipients sorted by amount received, then remaining by total.
  // Groups and standalone committees interleaved by their max effectiveFull.
  const sortedByTotal = (() => {
    const networkMap = new Map<string, CommitteeConstantWithContributions[]>();
    const standalone: CommitteeConstantWithContributions[] = [];
    for (const c of committees) {
      if (c.network) {
        const arr = networkMap.get(c.network) ?? [];
        arr.push(c);
        networkMap.set(c.network, arr);
      } else {
        standalone.push(c);
      }
    }

    function sortGroup(
      members: CommitteeConstantWithContributions[],
    ): CommitteeConstantWithContributions[] {
      const memberIds = new Set(members.map((m) => m.id));
      const senderIds = new Set<string>();
      for (const edge of transferEdges) {
        if (memberIds.has(edge.fromId) && memberIds.has(edge.toId)) {
          senderIds.add(edge.fromId);
        }
      }
      if (senderIds.size === 0) {
        return [...members].sort((a, b) => effectiveFull(b) - effectiveFull(a));
      }
      const result: CommitteeConstantWithContributions[] = [];
      const placed = new Set<string>();
      const senders = [...members]
        .filter((m) => senderIds.has(m.id))
        .sort((a, b) => effectiveFull(b) - effectiveFull(a));
      for (const sender of senders) {
        result.push(sender);
        placed.add(sender.id);
        const recipients = members
          .filter(
            (m) =>
              !placed.has(m.id) &&
              transferEdges.some(
                (e) => e.fromId === sender.id && e.toId === m.id,
              ),
          )
          .sort((a, b) => {
            const amt = (c: CommitteeConstantWithContributions) =>
              transferEdges
                .filter((e) => e.fromId === sender.id && e.toId === c.id)
                .reduce((s, e) => s + e.amount, 0);
            return amt(b) - amt(a);
          });
        for (const r of recipients) {
          result.push(r);
          placed.add(r.id);
        }
      }
      members
        .filter((m) => !placed.has(m.id))
        .sort((a, b) => effectiveFull(b) - effectiveFull(a))
        .forEach((m) => result.push(m));
      return result;
    }

    type Slot =
      | { kind: "network"; members: CommitteeConstantWithContributions[] }
      | { kind: "standalone"; committee: CommitteeConstantWithContributions };

    const slots: Slot[] = [];
    for (const members of networkMap.values()) {
      slots.push({ kind: "network", members: sortGroup(members) });
    }
    for (const c of standalone) {
      slots.push({ kind: "standalone", committee: c });
    }
    slots.sort((a, b) => {
      const key = (s: Slot) =>
        s.kind === "network"
          ? Math.max(...s.members.map((m) => effectiveFull(m)))
          : effectiveFull(s.committee);
      return key(b) - key(a);
    });
    return slots.flatMap((s) =>
      s.kind === "network" ? s.members : [s.committee],
    );
  })();

  const mainRight: CommitteeConstantWithContributions[] = [];
  const otherRight: CommitteeConstantWithContributions[] = [];
  for (const c of sortedByTotal) {
    const h = effectiveFull(c) * scale;
    if (h < MIN_H) {
      otherRight.push(c);
    } else {
      mainRight.push(c);
    }
  }

  const otherRightContributed = otherRight.reduce(
    (sum, c) => sum + c.total_contributed,
    0,
  );
  const otherRightTransferred = otherRight.reduce(
    (sum, c) => sum + c.total_transferred,
    0,
  );
  const otherRightSentOut = otherRight.reduce(
    (sum, c) => sum + (sentOutByCommittee.get(c.id) ?? 0),
    0,
  );
  const otherRightCarryover = otherRight.reduce(
    (sum, c) => sum + c.last_cash_on_hand_end_period,
    0,
  );

  let rightY = CHART_TOP;
  const rightNodes: RightNode[] = [];
  for (const c of mainRight) {
    const sentOut = sentOutByCommittee.get(c.id) ?? 0;
    const carryover = c.last_cash_on_hand_end_period;
    // Carryover merges into the pool in the middle column; fold it into directH here
    const directH =
      Math.max(0, c.total_contributed + carryover - sentOut) * scale;
    const thisCycleH =
      Math.max(0, c.total_contributed + c.total_transferred - sentOut) * scale;
    const transferH =
      thisCycleH - Math.max(0, c.total_contributed - sentOut) * scale;
    const totalH = directH + transferH;
    rightNodes.push({
      id: c.id,
      name: c.name,
      contributed: c.total_contributed,
      transferred: c.total_transferred,
      sentOut,
      carryover,
      totalH,
      transferH,
      directH,
      y: rightY,
    });
    rightY += totalH + NODE_GAP;
  }

  let otherRightNode: RightNode | null = null;
  const otherRightThisCycle =
    otherRightContributed + otherRightTransferred - otherRightSentOut;
  const otherRightFull = otherRightThisCycle + otherRightCarryover;
  if (otherRightFull > 0) {
    const directH =
      Math.max(
        0,
        otherRightContributed + otherRightCarryover - otherRightSentOut,
      ) * scale;
    const transferH =
      Math.max(0, otherRightThisCycle) * scale -
      Math.max(0, otherRightContributed - otherRightSentOut) * scale;
    const totalH = Math.max(MIN_H, otherRightFull * scale);
    otherRightNode = {
      id: "OTHER_RIGHT",
      name: `${otherRight.length} others`,
      contributed: otherRightContributed,
      transferred: otherRightTransferred,
      sentOut: otherRightSentOut,
      carryover: otherRightCarryover,
      totalH,
      transferH,
      directH,
      y: rightY,
    };
    rightNodes.push(otherRightNode);
  }

  const rightNodeById = new Map<string, RightNode>(
    rightNodes.map((n) => [n.id, n]),
  );

  // -----------------------------------------------------------------------
  // Map transfer edges to (possibly aggregated) node ids
  // -----------------------------------------------------------------------
  const mainMidIds = new Set(mainMid.map((c) => c.id));

  function resolvedMidId(id: string): string {
    if (mainMidIds.has(id)) {
      return id;
    }
    return "OTHER_MID";
  }

  function resolvedRightId(id: string): string {
    if (mainRightIds.has(id)) {
      return id;
    }
    return "OTHER_RIGHT";
  }

  // Aggregate transfer edges by (resolvedFrom, resolvedTo)
  const transferMap = new Map<string, number>();
  for (const edge of transferEdges) {
    const from = resolvedMidId(edge.fromId);
    const to = resolvedRightId(edge.toId);
    const key = `${from}__${to}`;
    transferMap.set(key, (transferMap.get(key) ?? 0) + edge.amount);
  }

  // -----------------------------------------------------------------------
  // Flow cursor tracking
  // -----------------------------------------------------------------------
  // Left column: separate cursors for donor and carryover blocks
  let leftDonorCurY = CHART_TOP;
  const leftDonorH = netContributions * scale;
  const leftCarryoverStartY = CHART_TOP + leftDonorH + NODE_GAP;
  let leftCarryoverCurY = leftCarryoverStartY;

  // Mid nodes: outflow cursor (contributions + carryover flow out together)
  const midOutCur = new Map<string, number>(midNodes.map((n) => [n.id, n.y]));

  // Right nodes: separate cursors for transfer (top) and direct+carryover pool (bottom)
  const rightTransferCur = new Map<string, number>(
    rightNodes.map((n) => [n.id, n.y]),
  );
  const rightDirectCur = new Map<string, number>(
    rightNodes.map((n) => [n.id, n.y + n.transferH]),
  );

  // -----------------------------------------------------------------------
  // Generate flow paths
  // -----------------------------------------------------------------------
  type FlowPath = {
    d: string;
    kind: "direct" | "transfer" | "carryover";
    key: string;
  };

  const flows: FlowPath[] = [];

  for (const midNode of midNodes) {
    const selfRightId = resolvedRightId(
      midNode.id === "OTHER_MID" ? (otherMid[0]?.id ?? "") : midNode.id,
    );

    // Collect transfers out of this mid node, sorted by amount desc
    const transfersOut: Array<{ toId: string; amount: number }> = [];
    for (const [key, amount] of transferMap.entries()) {
      const [fromKey, toKey] = key.split("__");
      if (fromKey === midNode.id) {
        transfersOut.push({ toId: toKey, amount });
      }
    }
    transfersOut.sort((a, b) => b.amount - a.amount);

    // 1. Direct flow from mid to self in right column (contributions + carryover combined)
    const selfRight = rightNodeById.get(
      midNode.id === "OTHER_MID" ? "OTHER_RIGHT" : selfRightId,
    );
    const totalTransferOut = transfersOut.reduce((s, t) => s + t.amount, 0);
    if (selfRight) {
      const directAmt = Math.max(
        0,
        midNode.contributed + midNode.carryover - totalTransferOut,
      );
      const flowH = directAmt * scale;
      if (flowH > 0) {
        const x0 = COL_MID_X + NODE_W;
        const y0t = midOutCur.get(midNode.id)!;
        const y0b = y0t + flowH;
        const x1 = COL_RIGHT_X;
        const y1t = rightDirectCur.get(selfRight.id)!;
        const y1b = y1t + flowH;
        flows.push({
          d: makePath(x0, y0t, y0b, x1, y1t, y1b),
          kind: "direct",
          key: `direct-${midNode.id}`,
        });
        midOutCur.set(midNode.id, y0b);
        rightDirectCur.set(selfRight.id, y1b);
      }
    }

    // 2. Transfer flows
    for (const { toId, amount } of transfersOut) {
      const toRight = rightNodeById.get(toId);
      if (!toRight) {
        continue;
      }
      const flowH = amount * scale;
      if (flowH < 0.5) {
        continue;
      }
      const x0 = COL_MID_X + NODE_W;
      const y0t = midOutCur.get(midNode.id)!;
      const y0b = y0t + flowH;
      const x1 = COL_RIGHT_X;
      const y1t = rightTransferCur.get(toId)!;
      const y1b = y1t + flowH;
      flows.push({
        d: makePath(x0, y0t, y0b, x1, y1t, y1b),
        kind: "transfer",
        key: `transfer-${midNode.id}-${toId}`,
      });
      midOutCur.set(midNode.id, y0b);
      rightTransferCur.set(toId, y1b);
    }

    // Left → Mid flow
    const leftFlowH = midNode.h;
    const x0Left = COL_LEFT_X + NODE_W;
    const y0tLeft = leftDonorCurY;
    const y0bLeft = leftDonorCurY + leftFlowH;
    const x1Left = COL_MID_X;
    const y1tLeft = midNode.y;
    const y1bLeft = midNode.y + midNode.h;
    flows.push({
      d: makePath(x0Left, y0tLeft, y0bLeft, x1Left, y1tLeft, y1bLeft),
      kind: "direct",
      key: `left-${midNode.id}`,
    });
    leftDonorCurY += leftFlowH;
  }

  // Carryover flows: left carryover block → mid carryover sections (merges into pool there)
  for (const midNode of midNodes) {
    const flowH = midNode.carryoverH;
    if (flowH < 0.5) {
      leftCarryoverCurY += flowH;
      continue;
    }
    const midCarryoverY = midNode.y + midNode.h;
    flows.push({
      d: makePath(
        COL_LEFT_X + NODE_W,
        leftCarryoverCurY,
        leftCarryoverCurY + flowH,
        COL_MID_X,
        midCarryoverY,
        midCarryoverY + flowH,
      ),
      kind: "carryover",
      key: `left-carryover-${midNode.id}`,
    });
    leftCarryoverCurY += flowH;
  }

  // -----------------------------------------------------------------------
  // Description text
  // -----------------------------------------------------------------------
  const committeeById = new Map(committees.map((c) => [c.id, c]));
  const senderNetworks = new Set<string>();
  for (const edge of transferEdges) {
    const sender = committeeById.get(edge.fromId);
    const recipient = committeeById.get(edge.toId);
    // Only count senders that passed money to an affiliated PAC in the same
    // network — not committees whose transfers went outside their network.
    if (
      sender &&
      recipient &&
      sender.network &&
      sender.network === recipient.network
    ) {
      senderNetworks.add(sender.network);
    }
  }
  const senderList = Array.from(senderNetworks);

  // -----------------------------------------------------------------------
  // Left column heights
  // -----------------------------------------------------------------------
  const leftCarryoverH = totalCarryover * scale;

  // -----------------------------------------------------------------------
  // Vertical layout (mobile, top-to-bottom flow)
  // -----------------------------------------------------------------------
  const scaleV =
    netContributions + totalCarryover > 0
      ? (CHART_W_V - 30) / (netContributions + totalCarryover)
      : 0;

  const midVById = new Map<
    string,
    { x: number; w: number; contribW: number }
  >();
  {
    let curX = CHART_LEFT_V;
    for (const node of midNodes) {
      const contribW = node.contributed * scaleV;
      const carryoverW = node.carryover * scaleV;
      const w = Math.max(NODE_GAP_V + 1, contribW + carryoverW);
      midVById.set(node.id, { x: curX, w, contribW });
      curX += w + NODE_GAP_V;
    }
  }

  const rightVById = new Map<
    string,
    { x: number; w: number; transferW: number }
  >();
  {
    let curX = CHART_LEFT_V;
    for (const node of rightNodes) {
      const transferW = Math.max(0, (node.transferH / scale) * scaleV);
      const w = Math.max(
        NODE_GAP_V + 1,
        transferW + Math.max(0, (node.directH / scale) * scaleV),
      );
      rightVById.set(node.id, { x: curX, w, transferW });
      curX += w + NODE_GAP_V;
    }
  }

  const leftDonorWV = netContributions * scaleV;
  const leftCarryoverWV = totalCarryover * scaleV;
  const leftCarryoverStartXV = CHART_LEFT_V + leftDonorWV + NODE_GAP_V;

  let leftDonorCurXV = CHART_LEFT_V;
  let leftCarryoverCurXV = leftCarryoverStartXV;

  const midOutCurXV = new Map<string, number>(
    midNodes.map((n) => [n.id, midVById.get(n.id)!.x]),
  );
  const rightTransferCurXV = new Map<string, number>(
    rightNodes.map((n) => [n.id, rightVById.get(n.id)!.x]),
  );
  const rightDirectCurXV = new Map<string, number>();
  for (const n of rightNodes) {
    const v = rightVById.get(n.id)!;
    rightDirectCurXV.set(n.id, v.x + v.transferW);
  }

  const flowsV: FlowPath[] = [];

  for (const midNode of midNodes) {
    const midV = midVById.get(midNode.id)!;
    const selfRightId = resolvedRightId(
      midNode.id === "OTHER_MID" ? (otherMid[0]?.id ?? "") : midNode.id,
    );
    const selfRightKey =
      midNode.id === "OTHER_MID" ? "OTHER_RIGHT" : selfRightId;

    const transfersOutV: Array<{ toId: string; amount: number }> = [];
    for (const [key, amount] of transferMap.entries()) {
      const [fromKey, toKey] = key.split("__");
      if (fromKey === midNode.id) {
        transfersOutV.push({ toId: toKey, amount });
      }
    }
    transfersOutV.sort((a, b) => b.amount - a.amount);
    const totalTransferOutV = transfersOutV.reduce((s, t) => s + t.amount, 0);

    const selfRightV = rightVById.get(selfRightKey);
    if (selfRightV) {
      const directAmt = Math.max(
        0,
        midNode.contributed + midNode.carryover - totalTransferOutV,
      );
      const flowW = directAmt * scaleV;
      if (flowW > 0) {
        const x0l = midOutCurXV.get(midNode.id)!;
        const x1l = rightDirectCurXV.get(selfRightKey)!;
        flowsV.push({
          d: makePathV(
            ROW_MID_Y_V + ROW_H_V,
            x0l,
            x0l + flowW,
            ROW_BOT_Y_V,
            x1l,
            x1l + flowW,
          ),
          kind: "direct",
          key: `vdirect-${midNode.id}`,
        });
        midOutCurXV.set(midNode.id, x0l + flowW);
        rightDirectCurXV.set(selfRightKey, x1l + flowW);
      }
    }

    for (const { toId, amount } of transfersOutV) {
      if (!rightVById.has(toId)) {
        continue;
      }
      const flowW = amount * scaleV;
      if (flowW < 0.5) {
        continue;
      }
      const x0l = midOutCurXV.get(midNode.id)!;
      const x1l = rightTransferCurXV.get(toId)!;
      flowsV.push({
        d: makePathV(
          ROW_MID_Y_V + ROW_H_V,
          x0l,
          x0l + flowW,
          ROW_BOT_Y_V,
          x1l,
          x1l + flowW,
        ),
        kind: "transfer",
        key: `vtransfer-${midNode.id}-${toId}`,
      });
      midOutCurXV.set(midNode.id, x0l + flowW);
      rightTransferCurXV.set(toId, x1l + flowW);
    }

    // Top donor block → mid: contributions
    const contribFlowW = midNode.contributed * scaleV;
    if (contribFlowW > 0.5) {
      flowsV.push({
        d: makePathV(
          ROW_TOP_Y_V + ROW_H_V,
          leftDonorCurXV,
          leftDonorCurXV + contribFlowW,
          ROW_MID_Y_V,
          midV.x,
          midV.x + midV.contribW,
        ),
        kind: "direct",
        key: `vleft-${midNode.id}`,
      });
    }
    leftDonorCurXV += contribFlowW;
  }

  // Top carryover block → mid: carryover portions
  for (const midNode of midNodes) {
    const flowW = midNode.carryover * scaleV;
    if (flowW < 0.5) {
      leftCarryoverCurXV += flowW;
      continue;
    }
    const midV = midVById.get(midNode.id)!;
    const midCarryoverStartX = midV.x + midV.contribW;
    flowsV.push({
      d: makePathV(
        ROW_TOP_Y_V + ROW_H_V,
        leftCarryoverCurXV,
        leftCarryoverCurXV + flowW,
        ROW_MID_Y_V,
        midCarryoverStartX,
        midCarryoverStartX + flowW,
      ),
      kind: "carryover",
      key: `vleft-carryover-${midNode.id}`,
    });
    leftCarryoverCurXV += flowW;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Tracing {totalFunds}</h2>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={styles.legendSwatchDirect} />
            <span>Direct contributions</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendSwatchTransfer} />
            <span>Inter-committee transfers</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendSwatchCarryover} />
            <span>Funds from last cycle</span>
          </div>
        </div>
      </div>
      {senderList.length > 0 && (
        <div className={styles.description}>
          <p>
            Donors put{" "}
            <span className={sharedStyles.highlightFigure}>
              {humanizeRoundedCurrency(netContributions, true, 1)}
            </span>{" "}
            into the {committees.length} tracked{" "}
            {humanizeSector(sector, { lowercase: true })} committees this cycle,
            alongside {humanizeRoundedCurrency(totalCarryover, true, 1)} in
            funds carried over from last cycle. From there,{" "}
            {humanizeNumber(senderList.length)} committee
            {senderList.length > 1 && "s"}&nbsp;&mdash;{" "}
            {humanizeList(senderList)}
            &nbsp;&mdash; passed money to affiliated PACs{" "}
            <Link href="/2026/networks">in their networks</Link>. Each
            committee&rsquo;s <span className="italic">funds this cycle</span>{" "}
            combines direct contributions, cash on hand from last cycle, and any
            transfers received from other tracked PACs.
          </p>
          <p>
            About{" "}
            <span className={sharedStyles.highlightFigure}>
              {humanizeRoundedCurrency(totalExpenditures, true, 1)}
            </span>{" "}
            of those funds have already gone to independent expenditures,
            leaving tracked committees with about{" "}
            <span className={sharedStyles.highlightFigure}>
              {humanizeRoundedCurrency(totalRemaining, true, 1)}
            </span>{" "}
            remaining to spend in the midterms.
          </p>
        </div>
      )}
      <svg
        className={styles.svgHorizontal}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="committeeSankeyHatch"
            patternUnits="userSpaceOnUse"
            width="8"
            height="8"
            patternTransform="rotate(45)"
          >
            <rect width="8" height="8" fill="var(--color-lime-200)" />
            <rect width="4" height="8" fill="var(--color-lime-700)" />
          </pattern>
        </defs>

        {/* Column headers */}
        <text
          x={COL_LEFT_X + NODE_W / 2}
          y={CHART_TOP - 12}
          textAnchor="middle"
          className={styles.colHeader}
        >
          Money in
        </text>
        <text
          x={COL_MID_X + NODE_W / 2}
          y={CHART_TOP - 12}
          textAnchor="middle"
          className={styles.colHeader}
        >
          Per committee
        </text>
        <text
          x={COL_RIGHT_X + NODE_W / 2}
          y={CHART_TOP - 12}
          textAnchor="middle"
          className={styles.colHeader}
        >
          Funds this cycle
        </text>

        {/* Flows (rendered behind nodes) */}
        {flows.map((flow) => (
          <path
            key={flow.key}
            d={flow.d}
            fill={
              flow.kind === "transfer"
                ? "url(#committeeSankeyHatch)"
                : flow.kind === "carryover"
                  ? "var(--color-neutral-400)"
                  : "var(--color-lime-500)"
            }
            opacity={
              flow.kind === "transfer"
                ? 0.85
                : flow.kind === "carryover"
                  ? 0.35
                  : 0.45
            }
          />
        ))}

        {/* Left column: donors block */}
        <rect
          x={COL_LEFT_X}
          y={CHART_TOP}
          width={NODE_W}
          height={leftDonorH}
          fill="var(--color-lime-600)"
        />
        <text
          x={COL_LEFT_X - 6}
          y={CHART_TOP + leftDonorH / 2}
          textAnchor="end"
          dominantBaseline="middle"
          className={styles.nodeAmount}
        >
          ${humanizeApproximateRounded(netContributions, 1)}
        </text>
        <text
          x={COL_LEFT_X - 6}
          textAnchor="end"
          className={styles.nodeCaption}
        >
          <tspan x={COL_LEFT_X - 6} y={CHART_TOP + leftDonorH / 2 + 15}>
            from outside
          </tspan>
          <tspan x={COL_LEFT_X - 6} dy="12">
            donors
          </tspan>
        </text>

        {/* Left column: previous cycle carryover block */}
        {leftCarryoverH > 0 && (
          <>
            <rect
              x={COL_LEFT_X}
              y={leftCarryoverStartY}
              width={NODE_W}
              height={leftCarryoverH}
              fill="var(--color-neutral-500)"
            />
            <text
              x={COL_LEFT_X - 6}
              y={leftCarryoverStartY + leftCarryoverH / 2}
              textAnchor="end"
              dominantBaseline="middle"
              className={styles.nodeAmount}
            >
              ${humanizeApproximateRounded(totalCarryover, 1)}
            </text>
            <text
              x={COL_LEFT_X - 6}
              textAnchor="end"
              className={styles.nodeCaption}
            >
              <tspan
                x={COL_LEFT_X - 6}
                y={leftCarryoverStartY + leftCarryoverH / 2 + 15}
              >
                carried over
              </tspan>
              <tspan x={COL_LEFT_X - 6} dy="12">
                from last cycle
              </tspan>
            </text>
          </>
        )}

        {/* Middle nodes */}
        {midNodes.map((node) => {
          const totalH = node.h + node.carryoverH;
          return (
            <g key={`mid-${node.id}`}>
              <rect
                x={COL_MID_X}
                y={node.y}
                width={NODE_W}
                height={totalH}
                fill="var(--color-lime-600)"
              />
              {totalH >= 14 && (
                <>
                  <text
                    x={COL_MID_X + NODE_W + 6}
                    y={node.y + totalH / 2 - 5}
                    dominantBaseline="middle"
                    className={styles.nodeName}
                  >
                    {node.name}
                  </text>
                  <text
                    x={COL_MID_X + NODE_W + 6}
                    y={node.y + totalH / 2 + 7}
                    dominantBaseline="middle"
                    className={styles.nodeCaption}
                  >
                    ${humanizeApproximateRounded(node.contributed, 1)} from
                    donors
                    {node.carryover > 0 && (
                      <>
                        {" "}
                        (+ ${humanizeApproximateRounded(node.carryover, 1)}{" "}
                        carryover)
                      </>
                    )}
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* Right nodes */}
        {rightNodes.map((node) => (
          <g key={`right-${node.id}`}>
            {/* Hatched top: transfers received */}
            {node.transferH > 0 && (
              <rect
                x={COL_RIGHT_X}
                y={node.y}
                width={NODE_W}
                height={node.transferH}
                fill="url(#committeeSankeyHatch)"
              />
            )}
            {/* Solid bottom: direct contributions + carryover pool */}
            <rect
              x={COL_RIGHT_X}
              y={node.y + node.transferH}
              width={NODE_W}
              height={node.directH}
              fill="var(--color-lime-600)"
            />
            {node.totalH >= 9 &&
              (node.id === "OTHER_RIGHT" ? (
                <text
                  x={COL_RIGHT_X + NODE_W + 6}
                  y={node.y + node.totalH / 2}
                  dominantBaseline="middle"
                  className={styles.nodeName}
                >
                  {node.name}
                </text>
              ) : (
                <a href={`/2026/committees/${node.id}`}>
                  <text
                    x={COL_RIGHT_X + NODE_W + 6}
                    y={node.y + node.totalH / 2}
                    dominantBaseline="middle"
                    className={styles.nodeNameLink}
                  >
                    {node.name}
                  </text>
                </a>
              ))}
          </g>
        ))}
      </svg>

      {/* Vertical SVG: mobile (top-to-bottom flow) */}
      <svg
        className={styles.svgVertical}
        viewBox={`0 0 ${VIEW_W_V} ${VIEW_H_V}`}
        overflow="visible"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="sankeyHatchV"
            patternUnits="userSpaceOnUse"
            width="8"
            height="8"
            patternTransform="rotate(45)"
          >
            <rect width="8" height="8" fill="var(--color-lime-200)" />
            <rect width="4" height="8" fill="var(--color-lime-700)" />
          </pattern>
        </defs>

        {/* Row headers */}
        <text
          x={CHART_LEFT_V + CHART_W_V / 2}
          y={14}
          textAnchor="middle"
          className={styles.colHeader}
        >
          Money in
        </text>
        <text
          x={CHART_LEFT_V + CHART_W_V / 2}
          y={ROW_MID_Y_V - 10}
          textAnchor="middle"
          className={styles.colHeader}
        >
          Per committee
        </text>
        <text
          x={CHART_LEFT_V + CHART_W_V / 2}
          y={ROW_BOT_Y_V - 10}
          textAnchor="middle"
          className={styles.colHeader}
        >
          Funds this cycle
        </text>

        {/* Flows */}
        {flowsV.map((flow) => (
          <path
            key={flow.key}
            d={flow.d}
            fill={
              flow.kind === "transfer"
                ? "url(#sankeyHatchV)"
                : flow.kind === "carryover"
                  ? "var(--color-neutral-400)"
                  : "var(--color-lime-500)"
            }
            opacity={
              flow.kind === "transfer"
                ? 0.85
                : flow.kind === "carryover"
                  ? 0.35
                  : 0.45
            }
          />
        ))}

        {/* Top row: donor block */}
        <text
          x={CHART_LEFT_V + leftDonorWV / 2}
          y={ROW_TOP_Y_V - 28}
          textAnchor="middle"
          className={styles.nodeAmount}
        >
          ${humanizeApproximateRounded(netContributions, 1)}
        </text>
        <text
          x={CHART_LEFT_V + leftDonorWV / 2}
          y={ROW_TOP_Y_V - 14}
          textAnchor="middle"
          className={styles.nodeCaption}
        >
          from outside donors
        </text>
        <rect
          x={CHART_LEFT_V}
          y={ROW_TOP_Y_V}
          width={leftDonorWV}
          height={ROW_H_V}
          fill="var(--color-lime-600)"
        />

        {/* Top row: carryover block */}
        {leftCarryoverWV > 0 && (
          <>
            <text
              x={leftCarryoverStartXV + leftCarryoverWV / 2}
              y={ROW_TOP_Y_V - 28}
              textAnchor="middle"
              className={styles.nodeAmount}
            >
              ${humanizeApproximateRounded(totalCarryover, 1)}
            </text>
            <text
              x={leftCarryoverStartXV + leftCarryoverWV / 2}
              y={ROW_TOP_Y_V - 14}
              textAnchor="middle"
              className={styles.nodeCaption}
            >
              carried over from last cycle
            </text>
            <rect
              x={leftCarryoverStartXV}
              y={ROW_TOP_Y_V}
              width={leftCarryoverWV}
              height={ROW_H_V}
              fill="var(--color-neutral-500)"
            />
          </>
        )}

        {/* Mid row: per-committee bars */}
        {midNodes.map((node) => {
          const v = midVById.get(node.id)!;
          return (
            <g key={`vmid-${node.id}`}>
              <rect
                x={v.x}
                y={ROW_MID_Y_V}
                width={v.w}
                height={ROW_H_V}
                fill="var(--color-lime-600)"
              />
              {v.w >= 20 && (
                <text
                  x={v.x + v.w / 2}
                  y={ROW_MID_Y_V + ROW_H_V + 10}
                  className={styles.nodeName}
                  transform={`rotate(45, ${v.x + v.w / 2}, ${ROW_MID_Y_V + ROW_H_V + 10})`}
                  textAnchor="start"
                >
                  {node.name.length > 18
                    ? `${node.name.slice(0, 17)}…`
                    : node.name}
                </text>
              )}
            </g>
          );
        })}

        {/* Bottom row: funds-this-cycle bars */}
        {rightNodes.map((node) => {
          const v = rightVById.get(node.id)!;
          const directW = v.w - v.transferW;
          return (
            <g key={`vright-${node.id}`}>
              {v.transferW > 0 && (
                <rect
                  x={v.x}
                  y={ROW_BOT_Y_V}
                  width={v.transferW}
                  height={ROW_H_V}
                  fill="url(#sankeyHatchV)"
                />
              )}
              {directW > 0 && (
                <rect
                  x={v.x + v.transferW}
                  y={ROW_BOT_Y_V}
                  width={directW}
                  height={ROW_H_V}
                  fill="var(--color-lime-600)"
                />
              )}
              {v.w >= 20 &&
                (node.id === "OTHER_RIGHT" ? (
                  <text
                    x={v.x + v.w / 2}
                    y={ROW_BOT_Y_V + ROW_H_V + 10}
                    className={styles.nodeName}
                    transform={`rotate(45, ${v.x + v.w / 2}, ${ROW_BOT_Y_V + ROW_H_V + 10})`}
                    textAnchor="start"
                  >
                    {node.name}
                  </text>
                ) : (
                  <a href={`/2026/committees/${node.id}`}>
                    <text
                      x={v.x + v.w / 2}
                      y={ROW_BOT_Y_V + ROW_H_V + 10}
                      className={styles.nodeNameLink}
                      transform={`rotate(45, ${v.x + v.w / 2}, ${ROW_BOT_Y_V + ROW_H_V + 10})`}
                      textAnchor="start"
                    >
                      {node.name.length > 18
                        ? `${node.name.slice(0, 17)}…`
                        : node.name}
                    </text>
                  </a>
                ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
