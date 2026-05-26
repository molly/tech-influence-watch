"use client";

import Link from "next/link";

import styles from "./Pagination.module.css";

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const delta = 2;
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);
  const result: (number | "...")[] = [1];
  if (left > 2) {
    result.push("...");
  }
  for (let i = left; i <= right; i++) {
    result.push(i);
  }
  if (right < total - 1) {
    result.push("...");
  }
  result.push(total);
  return result;
}

type PaginationProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  itemLabel: string;
  sortLabel?: string;
} & (
  | { hrefs: string[]; onPageChange?: never }
  | { onPageChange: (page: number) => void; hrefs?: never }
);

export default function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  itemLabel,
  sortLabel,
  ...rest
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const start = ((page - 1) * pageSize + 1).toLocaleString("en-US");
  const end = Math.min(page * pageSize, totalItems).toLocaleString("en-US");
  const totalFormatted = totalItems.toLocaleString("en-US");
  const pageNumbers = getPageNumbers(page, totalPages);

  function navTo(p: number) {
    if ("onPageChange" in rest && rest.onPageChange) {
      rest.onPageChange(p);
    }
  }

  function renderNav(
    label: string,
    targetPage: number,
    disabled: boolean,
  ) {
    if (disabled) {
      return (
        <span className={`${styles.pageBtn} ${styles.pageBtnDisabled}`}>
          {label}
        </span>
      );
    }
    if ("hrefs" in rest && rest.hrefs) {
      return (
        <Link href={rest.hrefs[targetPage - 1]} className={styles.pageBtn}>
          {label}
        </Link>
      );
    }
    return (
      <button className={styles.pageBtn} onClick={() => navTo(targetPage)}>
        {label}
      </button>
    );
  }

  function renderPageButton(p: number | "...", i: number) {
    if (p === "...") {
      return (
        <span key={`ellipsis-${i}`} className={styles.ellipsis}>
          &hellip;
        </span>
      );
    }
    if (p === page) {
      return (
        <span key={p} className={`${styles.pageBtn} ${styles.pageBtnActive}`}>
          {p}
        </span>
      );
    }
    if ("hrefs" in rest && rest.hrefs) {
      return (
        <Link key={p} href={rest.hrefs[p - 1]} className={styles.pageBtn}>
          {p}
        </Link>
      );
    }
    return (
      <button key={p} className={styles.pageBtn} onClick={() => navTo(p)}>
        {p}
      </button>
    );
  }

  return (
    <div className={styles.paginationBar}>
      <p className={styles.info}>
        Showing <strong>{start}–{end}</strong>{" "}
        of <strong>{totalFormatted}</strong> {itemLabel}
        {sortLabel && <> &middot; sorted by {sortLabel}</>}
      </p>
      <div className={styles.pageButtons}>
        {renderNav("← Prev", page - 1, page === 1)}
        {pageNumbers.map((p, i) => renderPageButton(p, i))}
        {renderNav("Next →", page + 1, page === totalPages)}
      </div>
    </div>
  );
}
