import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import {
  fetchCommitteesWithContributions,
  fetchCommitteeTotalReceipts,
  fetchCommitteeTransferGraph,
} from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import Skeleton from "@/app/components/skeletons/Skeleton";
import sharedStyles from "@/app/shared.module.css";
import type {
  CommitteeConstantWithContributions,
  CommitteeTotalsSnapshot,
  TransferEdge,
} from "@/app/types/Committee";
import { Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import {
  humanizeApproximateRounded,
  humanizeRoundedCurrency,
} from "@/app/utils/humanize";
import { customMetadata } from "@/app/utils/metadata";
import { range } from "@/app/utils/range";
import { humanizeSector } from "@/app/utils/sector";

import listStyles from "../listStyles.module.css";
import CommitteeHeader from "./CommitteeHeader";
import styles from "./CommitteeList.module.css";
import SankeyDiagram from "./SankeyDiagram";

export function committeesMetadata(sector: Sector): Metadata {
  return customMetadata({
    title: `${humanizeSector(sector, { abbrev: true })} PACs`,
    description: `Political action committees that focus on ${humanizeSector(sector, { context: "industry", lowercase: true })} advocacy.`,
  });
}

type PacGroup = "super" | "hybrid" | "connected" | "other";

const FOOTNOTE =
  "Due to different reporting frequencies for receipts and expenditures, committees sometimes appear to have spent more than they have raised.";

function getPacGroup(committee: CommitteeConstantWithContributions): PacGroup {
  if (committee.committee_type === "O") {
    return "super";
  }
  if (committee.committee_type === "V" || committee.committee_type === "W") {
    return "hybrid";
  }
  if (committee.designation === "B" || committee.organization_type === "C") {
    return "connected";
  }
  return "other";
}

const PAC_GROUP_LABELS: Record<PacGroup, string> = {
  super: "Super PACs",
  hybrid: "Hybrid PACs",
  connected: "Corporation or lobbyist PACs",
  other: "Other PACs",
};

const PAC_GROUP_ORDER: PacGroup[] = ["super", "hybrid", "connected", "other"];

function CommitteeListSkeleton() {
  return range(10).map((x) => (
    <div key={`skeleton-row-${x}`} className={styles.committeeRow}>
      <div className={styles.committeeName}>
        <Skeleton randWidth={[10, 30]} />
      </div>
      <div className={styles.amountPlaceholder}>
        <Skeleton randWidth={[5, 10]} />
      </div>
      <div className={styles.amountRaised}>
        <Skeleton randWidth={[5, 10]} />
      </div>
    </div>
  ));
}

function CommitteeRow({
  committee,
  sector = "all",
  indented = false,
  prominentTotal = false,
  transferredOut = 0,
}: {
  committee: CommitteeConstantWithContributions;
  sector?: Sector;
  indented?: boolean;
  prominentTotal?: boolean;
  transferredOut?: number;
}) {
  const spent = committee.independent_expenditures || 0;
  const fundsThisCycle = committee.total;
  const remaining = Math.max(0, committee.total - transferredOut - spent);
  return (
    <div
      className={`${styles.committeeRow}${indented ? ` ${styles.committeeRowIndented}` : ""}`}
    >
      <div className={styles.committeeName} title={committee.name}>
        <span className={styles.committeeNameText}>
          <Link href={`/2026/committees/${committee.id}`}>
            {committee.name}
          </Link>
        </span>
        {!indented && sector === "all" && committee.sector && (
          <span className={sharedStyles.sectorBadge}>{committee.sector}</span>
        )}
      </div>
      <div className={styles.amountFunds}>
        <span className={styles.amountFundsLabel}>Funds this cycle </span>$
        {humanizeApproximateRounded(fundsThisCycle, 1)}
      </div>
      <div
        className={
          transferredOut > 0
            ? styles.amountTransferred
            : styles.transferredPlaceholder
        }
      >
        <span className={styles.amountTransferredLabel}>Transferred out </span>
        {transferredOut > 0
          ? `$${humanizeApproximateRounded(transferredOut, 1)}`
          : "—"}
      </div>
      <div
        className={spent > 0 ? styles.amountSpent : styles.amountPlaceholder}
      >
        <span className={styles.amountSpentLabel}>Spent </span>
        {spent > 0 ? `$${humanizeApproximateRounded(spent, 1)}` : "—"}
        {spent > fundsThisCycle && <sup title={FOOTNOTE}>†</sup>}
      </div>
      <div className={styles.amountRaised}>
        <span className={styles.amountRaisedLabel}>Remaining </span>$
        {humanizeApproximateRounded(remaining, 1)}
      </div>
    </div>
  );
}

function CommitteeGroup({
  title,
  committees,
  sector = "all",
  transferEdges = [],
}: {
  title: string;
  committees: CommitteeConstantWithContributions[];
  sector?: Sector;
  transferEdges?: TransferEdge[];
}) {
  if (committees.length === 0) {
    return null;
  }

  const sentOutById = new Map<string, number>();
  for (const edge of transferEdges) {
    sentOutById.set(
      edge.fromId,
      (sentOutById.get(edge.fromId) ?? 0) + edge.amount,
    );
  }

  const totalSpent = committees.reduce(
    (sum, c) => sum + (c.independent_expenditures || 0),
    0,
  );
  const totalPooled = committees.reduce(
    (sum, c) => sum + c.total_contributed + c.last_cash_on_hand_end_period,
    0,
  );
  const totalRemaining = Math.max(0, totalPooled - totalSpent);

  // Split into network subgroups and standalone committees
  const networkMap = new Map<string, CommitteeConstantWithContributions[]>();
  const standalone: CommitteeConstantWithContributions[] = [];

  for (const committee of committees) {
    if (committee.network) {
      const existing = networkMap.get(committee.network) ?? [];
      existing.push(committee);
      networkMap.set(committee.network, existing);
    } else {
      standalone.push(committee);
    }
  }

  // Interleave networks and standalones sorted by their max total descending
  type Slot =
    | {
        kind: "network";
        name: string;
        members: CommitteeConstantWithContributions[];
      }
    | { kind: "standalone"; committee: CommitteeConstantWithContributions };

  const slots: Slot[] = [];
  for (const [name, members] of networkMap) {
    slots.push({ kind: "network", name, members });
  }
  for (const committee of standalone) {
    slots.push({ kind: "standalone", committee });
  }
  slots.sort((a, b) => {
    const aTotal =
      a.kind === "network"
        ? Math.max(...a.members.map((c) => c.total))
        : a.committee.total;
    const bTotal =
      b.kind === "network"
        ? Math.max(...b.members.map((c) => c.total))
        : b.committee.total;
    return bTotal - aTotal;
  });

  return (
    <div className={styles.committeeGroup}>
      <h3 className={listStyles.groupHeadingSpaceBetween}>
        <span className={listStyles.groupHeadingSubGroup}>{title}</span>
        <span className={sharedStyles.sectionTitleAmount}>
          <span className={sharedStyles.sectionTitleAmountValue}>
            {committees.length}
          </span>{" "}
          {committees.length === 1 ? "committee has" : "committees have"} spent{" "}
          <span className={sharedStyles.sectionTitleAmountValue}>
            {humanizeRoundedCurrency(totalSpent, true)}
          </span>{" "}
          and {committees.length === 1 ? "has" : "have"}{" "}
          <span className={sharedStyles.sectionTitleAmountValue}>
            {humanizeRoundedCurrency(totalRemaining, true)}
          </span>{" "}
          remaining
        </span>
      </h3>
      <div className={styles.columnHeaders}>
        <div className={styles.columnHeaderLabel}>Committee</div>
        <div className={styles.columnHeaderLabelRight}>Funds this cycle</div>
        <div className={styles.columnHeaderLabelRight}>Transferred out</div>
        <div className={styles.columnHeaderLabelRight}>Spent</div>
        <div className={styles.columnHeaderLabelRight}>Remaining</div>
      </div>
      {slots.map((slot) => {
        if (slot.kind === "network") {
          const networkSector = slot.members.some((c) => c.sector === "tech")
            ? "tech"
            : slot.members.some((c) => c.sector === "crypto") &&
                slot.members.some((c) => c.sector === "ai")
              ? "tech"
              : slot.members.find((c) => c.sector)?.sector;
          return (
            <div key={slot.name} className={styles.networkGroup}>
              <div className={styles.networkLabel}>
                <span className={styles.networkLabelName}>
                  {slot.name} network
                </span>
                {networkSector && sector === "all" && (
                  <span className={sharedStyles.sectorBadge}>
                    {networkSector}
                  </span>
                )}
              </div>
              {slot.members.map((committee) => (
                <CommitteeRow
                  key={committee.id}
                  committee={committee}
                  sector={sector}
                  indented
                  transferredOut={sentOutById.get(committee.id) ?? 0}
                />
              ))}
            </div>
          );
        }
        return (
          <CommitteeRow
            key={slot.committee.id}
            committee={slot.committee}
            sector={sector}
            prominentTotal
            transferredOut={sentOutById.get(slot.committee.id) ?? 0}
          />
        );
      })}
    </div>
  );
}

export default async function CommitteesView({ sector }: { sector: Sector }) {
  const [data, receiptsData, transferData] = await Promise.all([
    fetchCommitteesWithContributions(sector),
    fetchCommitteeTotalReceipts(sector),
    fetchCommitteeTransferGraph(sector),
  ]);

  if (isError(data)) {
    return (
      <>
        <CommitteeHeader sector={sector} />
        <div className={sharedStyles.main}>
          <ErrorText subject="the list of committees" />
        </div>
      </>
    );
  }

  const committees = data as CommitteeConstantWithContributions[];

  const grouped: Record<PacGroup, CommitteeConstantWithContributions[]> = {
    super: [],
    hybrid: [],
    connected: [],
    other: [],
  };
  for (const committee of committees) {
    grouped[getPacGroup(committee)].push(committee);
  }

  let cardAmount: string;
  if (!isError(receiptsData)) {
    const totals = receiptsData as CommitteeTotalsSnapshot;
    const confirmedCash =
      (totals.net_receipts ?? totals.receipts) + totals.cash_on_hand;
    cardAmount = humanizeRoundedCurrency(confirmedCash, true, 1);
  } else {
    cardAmount = humanizeRoundedCurrency(
      committees.reduce((sum, c) => sum + c.total, 0),
      true,
      1,
    );
  }

  return (
    <>
      <CommitteeHeader
        numCommittees={committees.length}
        total={cardAmount}
        sector={sector}
      />
      <div className={sharedStyles.main}>
        <div className="single-column-page">
          {transferData !== null &&
            !isError(transferData) &&
            !isError(data) && (
              <SankeyDiagram
                sector={sector}
                committees={committees}
                totalFunds={cardAmount}
                transferEdges={transferData as TransferEdge[]}
              />
            )}
          <Suspense fallback={<CommitteeListSkeleton />}>
            {PAC_GROUP_ORDER.map((group) => (
              <CommitteeGroup
                key={group}
                title={PAC_GROUP_LABELS[group]}
                committees={grouped[group]}
                sector={sector}
                transferEdges={
                  transferData !== null && !isError(transferData)
                    ? (transferData as TransferEdge[])
                    : []
                }
              />
            ))}
          </Suspense>
          <div className={styles.footnoteSection}>
            <sup>†</sup>
            <span className={styles.footnote}>{FOOTNOTE}</span>
          </div>
        </div>
      </div>
    </>
  );
}
