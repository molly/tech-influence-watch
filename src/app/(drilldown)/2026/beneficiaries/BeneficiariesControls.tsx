"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
    if ((key === "sort" && value === "total") || (key === "type" && value === "all")) {
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
      <div className={styles.controlsLeft}>
        <span className={styles.controlLabel}>Sort</span>
        <div className={styles.controlGroup}>
          {SORT_OPTIONS.map(({ value, label }) => (
            <Link
              key={value}
              href={buildHref("sort", value)}
              className={sort === value ? styles.controlBtnActive : styles.controlBtn}
            >
              {sort === value ? (
                <>{label} <span className={styles.sortArrow}>↓</span></>
              ) : label}
            </Link>
          ))}
        </div>
      </div>
      <div className={styles.controlsRight}>
        <span className={styles.controlLabel}>Type</span>
        <div className={styles.controlGroup}>
          {TYPE_OPTIONS.map(({ value, label }) => (
            <Link
              key={value}
              href={buildHref("type", value)}
              className={type === value ? styles.controlBtnActive : styles.controlBtn}
            >
              {label}
            </Link>
          ))}
        </div>
        <span className={styles.showingCount}>{rangeText}</span>
      </div>
    </div>
  );
}
