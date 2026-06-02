"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import sharedStyles from "@/app/shared.module.css";

export function TopDonorsSortLinks({ isDate }: { isDate: boolean }) {
  return (
    <div className={sharedStyles.inlineSortControls}>
      <span className={sharedStyles.inlineSortLabel}>Sort by</span>
      <Link
        href="?"
        className={
          !isDate
            ? sharedStyles.inlineSortOptionActive
            : sharedStyles.inlineSortOption
        }
      >
        Amount
        {!isDate && (
          <>
            {" "}
            <span className={sharedStyles.inlineSortArrow}>↓</span>
          </>
        )}
      </Link>
      <span className={sharedStyles.inlineSortSeparator}>·</span>
      <Link
        href="?sort=date"
        className={
          isDate
            ? sharedStyles.inlineSortOptionActive
            : sharedStyles.inlineSortOption
        }
      >
        Date
        {isDate && (
          <>
            {" "}
            <span className={sharedStyles.inlineSortArrow}>↓</span>
          </>
        )}
      </Link>
    </div>
  );
}

export default function TopDonorsSortControl() {
  const isDate = useSearchParams().get("sort") === "date";
  return <TopDonorsSortLinks isDate={isDate} />;
}
