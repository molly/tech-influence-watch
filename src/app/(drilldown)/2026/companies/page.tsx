import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { fetchCompanyTotalSpending, fetchConstant } from "@/app/actions/fetch";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import ErrorText from "@/app/components/ErrorText";
import MoneyCard, { MoneyCardSkeleton } from "@/app/components/MoneyCard";
import Skeleton from "@/app/components/skeletons/Skeleton";
import sharedStyles from "@/app/shared.module.css";
import {
  CompanyCategory,
  CompanyConstant,
  CompanyTotals,
} from "@/app/types/Companies";
import { isError } from "@/app/utils/errors";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";
import { customMetadata } from "@/app/utils/metadata";
import { range } from "@/app/utils/range";
import {
  getCompanyIdsForSector,
  humanizeSector,
  parseSector,
} from "@/app/utils/sector";

import listStyles from "../listStyles.module.css";
import styles from "./page.module.css";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string }>;
}): Promise<Metadata> {
  const { sector: rawSector } = await searchParams;
  const sector = parseSector(rawSector);
  return customMetadata({
    title: "Companies",
    description: `${humanizeSector(sector, { hyphen: true })}focused companies active in election spending.`,
  });
}

type CompanyGroup = {
  id: string;
  total: number;
};

function SubtitleSkeleton() {
  return (
    <p className={sharedStyles.headerSubtitle}>
      <Skeleton width="3rem" inline={true} />
      {` tracked companies have contributed to candidates and political action committees this cycle.`}
    </p>
  );
}

function CompanyListSkeleton() {
  return range(3).map((g) => (
    <div key={`skeleton-group-${g}`} className={styles.companyGroup}>
      <div className={listStyles.groupHeadingSpaceBetween}>
        <Skeleton randWidth={[12, 20]} />
        <Skeleton width="6rem" />
      </div>
      {range(5).map((r) => (
        <div key={`skeleton-row-${r}`} className={styles.companyRow}>
          <div className={styles.companyName}>
            <Skeleton randWidth={[8, 16]} />
          </div>
          <Skeleton />
          <Skeleton width="5rem" />
        </div>
      ))}
    </div>
  ));
}

function CompanyListGroup({
  title,
  subtitle,
  groups,
  companies,
  groupKey,
  hasTotals,
}: {
  title: string;
  subtitle?: string;
  groups: CompanyGroup[];
  companies: Record<string, CompanyConstant>;
  groupKey: string;
  hasTotals: boolean;
}) {
  if (groups.length === 0) {
    return null;
  }
  const roundGroup = (t: number): number => {
    if (t >= 1_000_000_000) {
      return parseFloat((t / 1_000_000_000).toFixed(2)) * 1_000_000_000;
    }
    if (t >= 1_000_000) {
      return parseFloat((t / 1_000_000).toFixed(2)) * 1_000_000;
    }
    if (t >= 1_000) {
      return Math.floor(t / 1_000) * 1_000;
    }
    return t;
  };
  const sectionTotal = groups.reduce((sum, g) => sum + roundGroup(g.total), 0);

  return (
    <div className={styles.companyGroup}>
      <h3 className={listStyles.groupHeadingSpaceBetween}>
        <span className={listStyles.groupHeadingSubGroup}>{title}</span>
        {hasTotals && (
          <span className={sharedStyles.sectionTitleAmount}>
            <span className={sharedStyles.sectionTitleAmountValue}>
              {humanizeRoundedCurrency(sectionTotal, true)}
            </span>{" "}
            contributed by{" "}
            <span className={sharedStyles.sectionTitleAmountValue}>
              {groups.length}
            </span>{" "}
            {groups.length === 1 ? "company" : "companies"}
          </span>
        )}
      </h3>
      {subtitle && <p className={listStyles.groupSubtitle}>{subtitle}</p>}
      {hasTotals && (
        <div className={styles.columnHeaders}>
          <div className={listStyles.columnHeaderLabel}>Company</div>
          <>
            <div className={listStyles.columnHeaderLabel}>
              Contribution total
            </div>
            <div className={listStyles.columnHeaderLabelRight}>Amount</div>
          </>
        </div>
      )}
      {groups.map(({ id, total }) => {
        const rounded = roundGroup(total);
        const barPct = sectionTotal > 0 ? (rounded / sectionTotal) * 100 : 0;
        const pctDisplay = Math.round(barPct);
        const category = companies[id].category;
        const showCryptoBadge =
          groupKey !== "crypto" &&
          groupKey !== "crypto-capital" &&
          groupKey !== "finance" &&
          category.includes("crypto" as CompanyCategory);
        const showAiBadge =
          groupKey !== "ai" &&
          groupKey !== "finance" &&
          category.includes("ai" as CompanyCategory);
        return (
          <div key={id} className={styles.companyRow}>
            <div className={styles.companyName} title={companies[id].name}>
              <Link className="unstyled" href={`/2026/companies/${id}`}>
                {companies[id].name}
              </Link>
              {showCryptoBadge && (
                <span className={sharedStyles.sectorBadge}>crypto</span>
              )}
              {showAiBadge && (
                <span className={sharedStyles.sectorBadge}>AI</span>
              )}
            </div>
            {hasTotals && (
              <>
                <div className={listStyles.barTrack}>
                  <div
                    className={listStyles.barRaised}
                    style={{ width: `${barPct}%` }}
                  />
                </div>
                <div className={listStyles.amount}>
                  {humanizeRoundedCurrency(total, true, 2)}
                  <span className={listStyles.pct}> ({pctDisplay}%)</span>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string }>;
}) {
  const { sector: rawSector } = await searchParams;
  const sector = parseSector(rawSector);

  const [companiesData, totalsData] = await Promise.all([
    fetchConstant<Record<string, CompanyConstant> | null>("companies"),
    fetchCompanyTotalSpending(sector),
  ]);

  if (companiesData === null) {
    return (
      <>
        <div className={sharedStyles.fullWidthHeader}>
          <section className={sharedStyles.header}>
            <Breadcrumbs crumbs={["Spending", "Companies"]} />
            <h1 className={sharedStyles.title}>Companies</h1>
          </section>
        </div>
        <div className={sharedStyles.main}>
          <div className="single-column-page">
            <ErrorText subject="the list of companies" />
          </div>
        </div>
      </>
    );
  }

  let totals: Record<string, any> = {};
  let grandTotal = 0;
  const hasTotals = !isError(totalsData);
  if (hasTotals) {
    const t = totalsData as CompanyTotals;
    totals = t.by_company;
    grandTotal = t.total;
  }

  const sectorIds = getCompanyIdsForSector(
    sector,
    companiesData as Record<string, CompanyConstant>,
  );

  const GROUP_DEFS: { key: string; title: string; subtitle?: string }[] = [
    { key: "crypto", title: "Cryptocurrency companies" },
    { key: "advocacy", title: "Advocacy groups" },
    { key: "crypto-capital", title: "Crypto-specific investment companies" },
    { key: "capital", title: "Investment companies" },
    { key: "ai", title: "Artificial intelligence companies" },
    { key: "finance", title: "Finance companies with crypto involvement" },
    { key: "prediction", title: "Prediction markets" },
    {
      key: "tech",
      title: "Technology",
      subtitle:
        "Technology or tech-related companies with substantial interests in artificial intelligence and crypto",
    },
  ];

  const companyGroupMap: Record<string, CompanyGroup[]> = Object.values(
    companiesData as Record<string, CompanyConstant>,
  )
    .filter(({ id }) => sectorIds === null || sectorIds.has(id))
    .reduce<Record<string, CompanyGroup[]>>(
      (acc, { category, id }) => {
        const companyGroup = { id, total: totals[id]?.total || 0 };
        if (category) {
          if (category.includes("capital" as CompanyCategory)) {
            if (category.includes("crypto" as CompanyCategory)) {
              acc["crypto-capital"].push(companyGroup);
            } else {
              acc["capital"].push(companyGroup);
            }
          } else if (category.includes("finance" as CompanyCategory)) {
            acc["finance"].push(companyGroup);
          } else if (category.includes("prediction" as CompanyCategory)) {
            acc["prediction"].push(companyGroup);
          } else if (category.includes("advocacy" as CompanyCategory)) {
            acc["advocacy"].push(companyGroup);
          } else if (category.includes("crypto" as CompanyCategory)) {
            acc["crypto"].push(companyGroup);
          } else if (category.includes("ai" as CompanyCategory)) {
            acc["ai"].push(companyGroup);
          } else if (category.includes("tech" as CompanyCategory)) {
            acc["tech"].push(companyGroup);
          }
        }
        return acc;
      },
      {
        ai: [],
        capital: [],
        crypto: [],
        "crypto-capital": [],
        advocacy: [],
        finance: [],
        prediction: [],
        tech: [],
      },
    );

  for (const key in companyGroupMap) {
    if (hasTotals) {
      companyGroupMap[key] = companyGroupMap[key].filter((c) => c.total > 0);
    }
    companyGroupMap[key].sort((a, b) => b.total - a.total);
  }

  const companyGroups = GROUP_DEFS.map(({ key, title, subtitle }) => ({
    key,
    title,
    subtitle,
    groups: companyGroupMap[key],
    groupTotal: companyGroupMap[key].reduce((sum, c) => sum + c.total, 0),
  })).sort((a, b) => b.groupTotal - a.groupTotal);

  const companyCount = companyGroups.reduce(
    (sum, group) => sum + group.groups.length,
    0,
  );

  const companies = companiesData as Record<string, CompanyConstant>;

  return (
    <>
      <div className={sharedStyles.fullWidthHeader}>
        <section className={sharedStyles.header}>
          <Breadcrumbs crumbs={["Spending", "Companies"]} />
          <h1 className={sharedStyles.title}>Companies</h1>
        </section>
      </div>
      <div className={sharedStyles.main}>
        <div className="single-column-page">
          <div className={sharedStyles.heroWithStat}>
            <Suspense fallback={<SubtitleSkeleton />}>
              <p className={sharedStyles.headerSubtitle}>
                <span className="bold">{companyCount}</span>
                {` tracked ${humanizeSector(sector, { hyphen: true, lowercase: true })}related companies have contributed to candidates and political action committees this cycle.`}
              </p>
            </Suspense>
            <Suspense fallback={<MoneyCardSkeleton />}>
              {hasTotals && (
                <MoneyCard
                  topText="Total contributed to candidates & PACs"
                  amount={humanizeRoundedCurrency(grandTotal, true)}
                  bottomText={`by ${companyCount} tracked ${humanizeSector(sector, { lowercase: true, abbrev: true })} companies`}
                />
              )}
            </Suspense>
          </div>
          <Suspense fallback={<CompanyListSkeleton />}>
            {companyGroups.map(({ key, title, subtitle, groups }) => (
              <CompanyListGroup
                key={key}
                groupKey={key}
                title={title}
                subtitle={subtitle}
                groups={groups}
                companies={companies}
                hasTotals={hasTotals}
              />
            ))}
          </Suspense>
        </div>
      </div>
    </>
  );
}
