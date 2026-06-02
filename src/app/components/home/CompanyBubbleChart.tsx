import { hierarchy, pack } from "d3-hierarchy";
import Link from "next/link";
import { Suspense } from "react";

import { fetchCompanyTotalSpending, fetchConstant } from "@/app/actions/fetch";
import sharedStyles from "@/app/shared.module.css";
import { CompanyConstant, CompanyTotals } from "@/app/types/Companies";
import { BESector, Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import { formatCompact } from "@/app/utils/humanize";
import { matchesSector } from "@/app/utils/sector";

import styles from "./CompanyBubbleChart.module.css";

const SIZE = 400;

type LeafDatum = {
  id: string;
  name: string;
  total: number;
  companySector: BESector | undefined;
};

type RootDatum = {
  children: LeafDatum[];
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

async function CompanyBubbleChartContent({ sector }: { sector: Sector }) {
  const [allData, companiesData] = await Promise.all([
    fetchCompanyTotalSpending("all"),
    fetchConstant<Record<string, CompanyConstant>>("companies"),
  ]);

  if (isError(allData) || !companiesData) {
    return null;
  }

  const allTotals = allData as CompanyTotals;
  const companies = companiesData as Record<string, CompanyConstant>;

  const entries: LeafDatum[] = Object.entries(allTotals.by_company)
    .map(([id, data]) => ({
      id,
      name: companies[id]?.name ?? id,
      total: data.total,
      companySector: companies[id]?.sector,
    }))
    .filter((e) => {
      if (e.total <= 0) {
        return false;
      }
      if (sector === "all") {
        return true;
      }
      return matchesSector(e.companySector, sector);
    })
    .sort((a, b) => b.total - a.total);

  if (entries.length === 0) {
    return null;
  }

  const maxTotal = entries[0].total;
  const minValue = maxTotal * 0.004;

  const root = hierarchy<RootDatum | LeafDatum>({
    children: entries,
  } as RootDatum).sum((d) => ("total" in d ? Math.max(d.total, minValue) : 0));

  const packed = pack<RootDatum | LeafDatum>().size([SIZE, SIZE]).padding(2)(
    root,
  );

  const leaves = packed.leaves();

  return (
    <>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width="100%"
        className={styles.svg}
        aria-label="Company contributions bubble chart"
      >
        {leaves.map((leaf) => {
          const d = leaf.data as LeafDatum;
          const r = leaf.r;
          const fontSize = Math.min(11, r * 0.32);
          const showLabel = r >= 10;
          const showAmount = r >= 30;
          const maxChars = Math.floor((1.7 * r) / (fontSize * 0.6));
          const label =
            d.name.length <= maxChars
              ? d.name
              : d.name.slice(0, maxChars) + "…";
          const darkText = d.companySector === "ai";
          return (
            <Link
              key={d.id}
              href={`/2026/companies/${d.id}`}
              className={styles.bubbleLink}
            >
              <circle
                cx={leaf.x}
                cy={leaf.y}
                r={r}
                className={`${styles.bubble} ${sectorClass(d.companySector)}`}
              >
                <title>{`${d.name}: ${formatCompact(d.total)}`}</title>
              </circle>
              {showLabel && (
                <text
                  x={leaf.x}
                  y={showAmount ? leaf.y - fontSize * 0.6 : leaf.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={fontSize}
                  className={`${styles.bubbleLabel} ${darkText ? styles.bubbleLabelDark : ""}`}
                  pointerEvents="none"
                >
                  {label}
                </text>
              )}
              {showAmount && (
                <text
                  x={leaf.x}
                  y={leaf.y + fontSize * 1.2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={fontSize * 0.85}
                  className={`${styles.bubbleAmount} ${darkText ? styles.bubbleAmountDark : ""}`}
                  pointerEvents="none"
                >
                  {formatCompact(d.total)}
                </text>
              )}
            </Link>
          );
        })}
      </svg>
      <div className={styles.legend}>
        {(sector === "all" || sector === "crypto") && (
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.legendDotCrypto}`} />
            Crypto
          </div>
        )}
        {(sector === "all" || sector === "ai") && (
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.legendDotAi}`} />
            AI
          </div>
        )}
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendDotBoth}`} />
          Crypto &amp; AI
        </div>
      </div>
    </>
  );
}

export default function CompanyBubbleChart({ sector }: { sector: Sector }) {
  return (
    <section className={sharedStyles.section}>
      <h2 className={sharedStyles.sectionTitle}>Contributions by company</h2>
      <Suspense fallback={null}>
        <CompanyBubbleChartContent sector={sector} />
      </Suspense>
    </section>
  );
}
