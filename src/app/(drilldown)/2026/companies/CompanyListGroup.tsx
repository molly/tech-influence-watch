"use client";

import Link from "next/link";
import { useState } from "react";

import SectorBadge from "@/app/components/SectorBadge";
import sharedStyles from "@/app/shared.module.css";
import { CompanyCategory, CompanyConstant } from "@/app/types/Companies";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";

import listStyles from "../listStyles.module.css";
import styles from "./page.module.css";

type CompanyGroup = {
  id: string;
  total: number;
};

const COLLAPSE_THRESHOLD = 8;

export default function CompanyListGroup({
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
  const [expanded, setExpanded] = useState(false);

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

  const isCollapsible = groups.length > COLLAPSE_THRESHOLD;
  const visibleGroups =
    isCollapsible && !expanded ? groups.slice(0, COLLAPSE_THRESHOLD) : groups;
  const hiddenCount = groups.length - COLLAPSE_THRESHOLD;

  return (
    <div className={styles.companyGroup}>
      <h3 className={listStyles.groupHeadingSpaceBetween}>
        <span className={listStyles.groupHeadingSubGroup}>{title}</span>
        {hasTotals && (
          <span className={sharedStyles.sectionTitleAmount}>
            <span className={sharedStyles.highlightFigure}>
              {humanizeRoundedCurrency(sectionTotal, true)}
            </span>{" "}
            contributed by{" "}
            <span className={sharedStyles.highlightFigure}>
              {groups.length}
            </span>{" "}
            {groups.length === 1 ? "company" : "companies"}
          </span>
        )}
      </h3>
      {subtitle && <p className={listStyles.groupSubtitle}>{subtitle}</p>}
      <div className={styles.table}>
        {hasTotals && (
          <div className={styles.columnHeaders}>
            <div className={listStyles.columnHeaderLabel}>Company</div>
            <div className={listStyles.columnHeaderLabelRight}>Amount</div>
          </div>
        )}
        {visibleGroups.map(({ id, total }) => {
          const rounded = roundGroup(total);
          const pctDisplay =
            sectionTotal > 0 ? Math.round((rounded / sectionTotal) * 100) : 0;
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
                {showCryptoBadge && <SectorBadge>crypto</SectorBadge>}
                {showAiBadge && <SectorBadge>AI</SectorBadge>}
              </div>
              {hasTotals && (
                <div className={listStyles.amount}>
                  {humanizeRoundedCurrency(total, true, 2)}
                  {pctDisplay > 0 && (
                    <span className={listStyles.pct}> ({pctDisplay}%)</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {isCollapsible && (
        <button
          type="button"
          className={styles.showMore}
          onClick={() => setExpanded((prev) => !prev)}
        >
          <span
            className={`${styles.showMoreCaret} ${expanded ? styles.showMoreCaretExpanded : ""}`}
            aria-hidden="true"
          />
          {expanded
            ? "Show fewer"
            : `${hiddenCount} more ${hiddenCount === 1 ? "company" : "companies"}`}
        </button>
      )}
    </div>
  );
}
