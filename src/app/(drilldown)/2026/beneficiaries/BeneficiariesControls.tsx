"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Fragment } from "react";

import sharedStyles from "@/app/shared.module.css";

import styles from "./beneficiaries.module.css";

const SORT_OPTIONS = [
  { value: "total", label: "Total" },
  { value: "name", label: "Name" },
  { value: "recent", label: "Recent" },
];

const TYPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "candidates", label: "Candidates" },
  { value: "pacs", label: "PACs" },
  { value: "party", label: "Party" },
];

export default function BeneficiariesControls({
  sort,
  type,
  total,
  page,
  pageSize,
}: {
  sort: string;
  type: string;
  total: number;
  page: number;
  pageSize: number;
}) {
  const searchParams = useSearchParams();

  function buildHref(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (
      (key === "sort" && value === "total") ||
      (key === "type" && value === "all")
    ) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    return `?${params.toString()}`;
  }

  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const rangeText =
    total === 0
      ? "0 results"
      : `${start.toLocaleString()}–${end.toLocaleString()} of ${total.toLocaleString()}`;

  return (
    <div className={styles.controls}>
      <div className={styles.sortFilterGroup}>
        <div className={styles.sortGroup}>
          <span className={sharedStyles.inlineSortLabel}>Sort by</span>
          {SORT_OPTIONS.map(({ value, label }, i) => (
            <Fragment key={value}>
              {i > 0 && (
                <span className={sharedStyles.inlineSortSeparator}>·</span>
              )}
              <Link
                href={buildHref("sort", value)}
                className={
                  sort === value
                    ? sharedStyles.inlineSortOptionActive
                    : sharedStyles.inlineSortOption
                }
              >
                {label}
                {sort === value && (
                  <>
                    {" "}
                    <span className={sharedStyles.inlineSortArrow}>↓</span>
                  </>
                )}
              </Link>
            </Fragment>
          ))}
        </div>
        <div className={styles.filterGroup}>
          <span className={sharedStyles.inlineSortLabel}>Type</span>
          {TYPE_OPTIONS.map(({ value, label }, i) => (
            <Fragment key={value}>
              {i > 0 && (
                <span className={sharedStyles.inlineSortSeparator}>·</span>
              )}
              <Link
                href={buildHref("type", value)}
                className={
                  type === value
                    ? sharedStyles.inlineSortOptionActive
                    : sharedStyles.inlineSortOption
                }
              >
                {label}
              </Link>
            </Fragment>
          ))}
        </div>
      </div>
      <span className={styles.showingCount}>{rangeText}</span>
    </div>
  );
}
