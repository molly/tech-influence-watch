import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import {
  fetchCommitteesWithContributions,
  fetchCommitteeTotalReceipts,
} from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import { HorizontalBarsSkeleton } from "@/app/components/home/HorizontalBars";
import Skeleton from "@/app/components/skeletons/Skeleton";
import sharedStyles from "@/app/shared.module.css";
import type {
  CommitteeConstantWithContributions,
  CommitteeTotalsSnapshot,
} from "@/app/types/Committee";
import { Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import {
  humanizeApproximateRounded,
  humanizeRoundedCurrency,
} from "@/app/utils/humanize";
import { customMetadata } from "@/app/utils/metadata";
import { range } from "@/app/utils/range";
import { humanizeSector, parseSector } from "@/app/utils/sector";

import listStyles from "../listStyles.module.css";
import CommitteeHeader from "./CommitteeHeader";
import styles from "./CommitteeList.module.css";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string }>;
}): Promise<Metadata> {
  const { sector: rawSector } = await searchParams;
  const sector = parseSector(rawSector);
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
      <HorizontalBarsSkeleton />
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
  maxTotal,
  sector = "all",
  indented = false,
  prominentTotal = false,
}: {
  committee: CommitteeConstantWithContributions;
  maxTotal: number;
  sector?: Sector;
  indented?: boolean;
  prominentTotal?: boolean;
}) {
  const spent = committee.independent_expenditures || 0;
  const totalRaised = committee.total;
  const spentBarPct = maxTotal > 0 ? (spent / maxTotal) * 100 : 0;
  const cashBarPct =
    maxTotal > 0 ? (Math.max(0, totalRaised - spent) / maxTotal) * 100 : 0;
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
      <div className={listStyles.barTrack}>
        {spent > 0 && (
          <div
            className={listStyles.bar}
            style={{ width: `${spentBarPct}%` }}
          />
        )}
        {cashBarPct > 0 && (
          <div
            className={listStyles.barRaised}
            style={{ width: `${cashBarPct}%` }}
          />
        )}
      </div>
      <div
        className={spent > 0 ? styles.amountSpent : styles.amountPlaceholder}
      >
        {spent > 0 ? `$${humanizeApproximateRounded(spent, 1)}` : "—"}
        {spent > totalRaised && <sup title={FOOTNOTE}>†</sup>}
      </div>
      <div
        className={prominentTotal ? styles.networkTotal : styles.amountRaised}
      >
        ${humanizeApproximateRounded(totalRaised, 1)}
      </div>
    </div>
  );
}

function CommitteeGroup({
  title,
  committees,
  maxTotal,
  sector = "all",
}: {
  title: string;
  committees: CommitteeConstantWithContributions[];
  maxTotal: number;
  sector?: Sector;
}) {
  if (committees.length === 0) {
    return null;
  }

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
      <h3 className={styles.groupHeading}>
        {title}
        <span className={styles.groupCount}>
          {committees.length}{" "}
          {committees.length === 1 ? "committee" : "committees"}
        </span>
      </h3>
      <div className={styles.columnHeaders}>
        <div className={styles.columnHeaderLabel}>Committee</div>
        <div className={styles.barColumnHeaderInner}>
          <span className={styles.columnHeaderLabel}>
            Spent vs. cash on hand
          </span>
          <div className={styles.legendInline}>
            <div className={styles.legendItem}>
              <div
                className={`${styles.legendSwatch} ${styles.legendSwatchSpent}`}
              />
              <span>Spent</span>
            </div>
            <div className={styles.legendItem}>
              <div
                className={`${styles.legendSwatch} ${styles.legendSwatchRaised}`}
              />
              <span>Cash on hand</span>
            </div>
          </div>
        </div>
        <div className={styles.columnHeaderLabelRight}>Spent</div>
        <div className={styles.columnHeaderLabelRight}>Raised</div>
      </div>
      {slots.map((slot) => {
        if (slot.kind === "network") {
          const networkTotal = slot.members.reduce(
            (sum, c) => sum + c.total,
            0,
          );
          const networkSector = slot.members.some((c) => c.sector === "tech")
            ? "tech"
            : slot.members.some((c) => c.sector === "crypto") &&
                slot.members.some((c) => c.sector === "ai")
              ? "tech"
              : slot.members.find((c) => c.sector)?.sector;
          return (
            <div key={slot.name} className={styles.networkGroup}>
              <div className={styles.networkLabel}>
                <div className={styles.networkLabelLeft}>
                  <span className={styles.networkLabelName}>
                    {slot.name} network
                  </span>
                  {networkSector && (
                    <span className={sharedStyles.sectorBadge}>
                      {networkSector}
                    </span>
                  )}
                </div>
                <span className={styles.networkTotal}>
                  ${humanizeApproximateRounded(networkTotal, 1)}
                </span>
              </div>
              {slot.members.map((committee) => (
                <CommitteeRow
                  key={committee.id}
                  committee={committee}
                  maxTotal={maxTotal}
                  sector={sector}
                  indented
                />
              ))}
            </div>
          );
        }
        return (
          <CommitteeRow
            key={slot.committee.id}
            committee={slot.committee}
            maxTotal={maxTotal}
            sector={sector}
            prominentTotal
          />
        );
      })}
    </div>
  );
}

export default async function CommitteesPage({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string }>;
}) {
  const { sector: rawSector } = await searchParams;
  const sector = parseSector(rawSector);

  const [data, receiptsData] = await Promise.all([
    fetchCommitteesWithContributions(sector),
    fetchCommitteeTotalReceipts(sector),
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

  const maxTotal = Math.max(...committees.map((c) => c.total), 1);

  let cardAmount: string;
  if (!isError(receiptsData)) {
    const totals = receiptsData as CommitteeTotalsSnapshot;
    const confirmedCash =
      (totals.net_receipts ?? totals.receipts) + totals.cash_on_hand;
    cardAmount = humanizeRoundedCurrency(confirmedCash, true);
  } else {
    cardAmount = humanizeRoundedCurrency(
      committees.reduce((sum, c) => sum + c.total, 0),
      true,
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
          <Suspense fallback={<CommitteeListSkeleton />}>
            {PAC_GROUP_ORDER.map((group) => (
              <CommitteeGroup
                key={group}
                title={PAC_GROUP_LABELS[group]}
                committees={grouped[group]}
                maxTotal={maxTotal}
                sector={sector}
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
