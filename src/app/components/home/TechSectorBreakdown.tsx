import Link from "next/link";
import { Suspense } from "react";

import { fetchCompanyTotalSpending, fetchConstant } from "@/app/actions/fetch";
import sharedStyles from "@/app/shared.module.css";
import { CompanyConstant, CompanyTotals } from "@/app/types/Companies";
import { isError } from "@/app/utils/errors";
import { formatCompact, humanizeNumber, pluralize } from "@/app/utils/humanize";

import barStyles from "./HorizontalBars.module.css";
import styles from "./TechSectorBreakdown.module.css";

const TOP_N = 3;

type DonorEntry = {
  id: string;
  name: string;
  total: number;
};

function DonorRow({
  rank,
  donor,
  sectorTotal,
}: {
  rank: number;
  donor: DonorEntry;
  sectorTotal: number;
}) {
  const pct =
    sectorTotal > 0 ? Math.round((donor.total / sectorTotal) * 100) : 0;
  return (
    <div className={styles.donorRow}>
      <span className={styles.donorRank}>{rank}</span>
      <Link href={`/2026/companies/${donor.id}`} className={styles.donorName}>
        {donor.name}
      </Link>
      <span className={styles.donorAmount}>{formatCompact(donor.total)}</span>
      <span className={styles.donorPct}>{pct}%</span>
    </div>
  );
}

function OthersRow({
  count,
  total,
  sectorTotal,
}: {
  count: number;
  total: number;
  sectorTotal: number;
}) {
  const pct = sectorTotal > 0 ? Math.round((total / sectorTotal) * 100) : 0;
  return (
    <div className={`${styles.donorRow} ${styles.othersRow}`}>
      <span className={styles.donorRank} />
      <span className={styles.othersLabel}>
        {count > 10 ? count : humanizeNumber(count)} {pluralize(count, "other")}
      </span>
      <span className={styles.donorAmount} />
      <span className={styles.donorPct}>{pct}%</span>
    </div>
  );
}

function DonorColumn({
  title,
  titleClass,
  dividerClass,
  donors,
  othersCount,
  othersTotal,
  sectorTotal,
}: {
  title: string;
  titleClass: string;
  dividerClass: string;
  donors: DonorEntry[];
  othersCount: number;
  othersTotal: number;
  sectorTotal: number;
}) {
  return (
    <div className={styles.donorColumn}>
      <div className={styles.columnHeader}>
        <span className={`${styles.columnTitle} ${titleClass}`}>{title}</span>
        <span className={styles.columnSubheader}>Top Donors</span>
      </div>
      <div className={`${styles.columnDivider} ${dividerClass}`} />
      {donors.map((donor, i) => (
        <DonorRow
          key={donor.id}
          rank={i + 1}
          donor={donor}
          sectorTotal={sectorTotal}
        />
      ))}
      {othersCount > 0 && (
        <OthersRow
          count={othersCount}
          total={othersTotal}
          sectorTotal={sectorTotal}
        />
      )}
    </div>
  );
}

async function TechSectorBreakdownContent() {
  const [allData, companiesData] = await Promise.all([
    fetchCompanyTotalSpending("all"),
    fetchConstant<Record<string, CompanyConstant>>("companies"),
  ]);

  if (isError(allData) || !companiesData) {
    return null;
  }

  const allTotals = allData as CompanyTotals;
  const companies = companiesData as Record<string, CompanyConstant>;
  const grandTotal = allTotals.total;
  if (grandTotal === 0) {
    return null;
  }

  // Build three mutually exclusive donor lists from allTotals.by_company
  const cryptoDonors: DonorEntry[] = [];
  const aiDonors: DonorEntry[] = [];
  const bothDonors: DonorEntry[] = [];

  for (const [id, data] of Object.entries(allTotals.by_company)) {
    if (data.total <= 0) {
      continue;
    }
    const company = companies[id];
    const entry: DonorEntry = {
      id,
      name: company?.name ?? id,
      total: data.total,
    };
    if (company?.sector === "crypto") {
      cryptoDonors.push(entry);
    } else if (company?.sector === "ai") {
      aiDonors.push(entry);
    } else {
      bothDonors.push(entry);
    }
  }

  cryptoDonors.sort((a, b) => b.total - a.total);
  aiDonors.sort((a, b) => b.total - a.total);
  bothDonors.sort((a, b) => b.total - a.total);

  const cryptoTotal = cryptoDonors.reduce((sum, d) => sum + d.total, 0);
  const aiTotal = aiDonors.reduce((sum, d) => sum + d.total, 0);
  const bothTotal = bothDonors.reduce((sum, d) => sum + d.total, 0);

  const cryptoPct = Math.round((cryptoTotal / grandTotal) * 100);
  const aiPct = Math.round((aiTotal / grandTotal) * 100);
  const bothPct = Math.round((bothTotal / grandTotal) * 100);

  const barSegments = [
    {
      key: "crypto",
      label: "Crypto",
      total: cryptoTotal,
      pct: cryptoPct,
      colorClass: styles.bigBarCrypto,
    },
    {
      key: "ai",
      label: "AI",
      total: aiTotal,
      pct: aiPct,
      colorClass: styles.bigBarAi,
    },
    {
      key: "both",
      label: "Both",
      total: bothTotal,
      pct: bothPct,
      colorClass: styles.bigBarBoth,
    },
  ].filter((s) => s.total > 0);

  const cryptoTop = cryptoDonors.slice(0, TOP_N);
  const cryptoOthers = cryptoDonors.slice(TOP_N);
  const aiTop = aiDonors.slice(0, TOP_N);
  const aiOthers = aiDonors.slice(TOP_N);
  const bothTop = bothDonors.slice(0, TOP_N);
  const bothOthers = bothDonors.slice(TOP_N);

  return (
    <>
      <div
        className={`${barStyles.track} ${styles.bigBar}`}
        role="img"
        aria-label={`Industry contributions by sector: ${barSegments
          .map((s) => `${s.label} ${formatCompact(s.total)}, ${s.pct}%`)
          .join("; ")}`}
      >
        {barSegments.map((s) => (
          <div
            key={s.key}
            className={`${barStyles.segment} ${s.colorClass}`}
            style={{ flexGrow: s.total }}
          />
        ))}
      </div>
      <div className={styles.barLegend}>
        {barSegments.map((s) => (
          <div key={s.key} className={styles.barLegendItem}>
            <span className={`${styles.barLegendSwatch} ${s.colorClass}`} />
            <span className={styles.barLegendName}>{s.label}</span>
            <span className={styles.barLegendValue}>
              {formatCompact(s.total)} · {s.pct}%
            </span>
          </div>
        ))}
      </div>

      <div className={styles.donorColumns}>
        <DonorColumn
          title="Crypto"
          titleClass={styles.cryptoTitle}
          dividerClass={styles.cryptoDivider}
          donors={cryptoTop}
          othersCount={cryptoOthers.length}
          othersTotal={cryptoOthers.reduce((sum, d) => sum + d.total, 0)}
          sectorTotal={cryptoTotal}
        />
        <DonorColumn
          title="AI"
          titleClass={styles.aiTitle}
          dividerClass={styles.aiDivider}
          donors={aiTop}
          othersCount={aiOthers.length}
          othersTotal={aiOthers.reduce((sum, d) => sum + d.total, 0)}
          sectorTotal={aiTotal}
        />
        {bothTotal > 0 && (
          <DonorColumn
            title="Both"
            titleClass={styles.bothTitle}
            dividerClass={styles.bothDivider}
            donors={bothTop}
            othersCount={bothOthers.length}
            othersTotal={bothOthers.reduce((sum, d) => sum + d.total, 0)}
            sectorTotal={bothTotal}
          />
        )}
      </div>
    </>
  );
}

export default function TechSectorBreakdown() {
  return (
    <section className={`${sharedStyles.section} ${styles.industrySection}`}>
      <h2 className={sharedStyles.sectionTitle}>Contributions by industry</h2>
      <Suspense fallback={null}>
        <TechSectorBreakdownContent />
      </Suspense>
    </section>
  );
}
