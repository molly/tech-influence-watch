"use client";

import { useSearchParams } from "next/navigation";
import { ReactNode } from "react";

import Pagination from "./Pagination";
import styles from "./tables.module.css";

export default function PaginatedTable({
  header,
  rows,
  pageSize,
  pageParam,
  itemLabel,
  sortLabel,
}: {
  header: ReactNode;
  rows: ReactNode[];
  pageSize: number;
  pageParam: string;
  itemLabel: string;
  sortLabel?: string;
}) {
  const searchParams = useSearchParams();
  const page = Math.max(1, parseInt(searchParams.get(pageParam) ?? "1", 10) || 1);
  const totalPages = Math.ceil(rows.length / pageSize);
  const clampedPage = Math.min(page, Math.max(1, totalPages));
  const slice = rows.slice(
    (clampedPage - 1) * pageSize,
    clampedPage * pageSize,
  );

  function buildPageHref(p: number) {
    const sp = new URLSearchParams(searchParams.toString());
    if (p > 1) {
      sp.set(pageParam, String(p));
    } else {
      sp.delete(pageParam);
    }
    const query = sp.toString();
    return query ? `?${query}` : "?";
  }

  return (
    <>
      <table className={styles.influencedTable}>
        {header}
        <tbody className={styles.inheritBorderRadius}>{slice}</tbody>
      </table>
      <Pagination
        page={clampedPage}
        totalPages={totalPages}
        totalItems={rows.length}
        pageSize={pageSize}
        itemLabel={itemLabel}
        sortLabel={sortLabel}
        hrefs={Array.from({ length: totalPages }, (_, i) =>
          buildPageHref(i + 1),
        )}
      />
    </>
  );
}
