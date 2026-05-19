"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import SectorButtons from "./SectorButtons";
import styles from "./header.module.css";

const SECTOR_PATHS = [
  "/",
  "/2026/beneficiaries",
  "/2026/contributions",
  "/2026/elections",
  "/2026/expenditures",
  "/2026/individuals",
  "/2026/quidproquo",
  "/2026/spending",
  "/2026/states",
  "/2026/companies",
];

export default function SectorWrapper() {
  const pathname = usePathname();
  // /2026/committees/[id] yes, /2026/committees/ranking/[type] no
  const isCommitteesPath =
    pathname === "/2026/committees" ||
    /^\/2026\/committees\/(?!ranking)[^/]+/.test(pathname);
  const showSector =
    isCommitteesPath ||
    SECTOR_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
  if (!showSector) {
    return null;
  }
  return (
    <div className={styles.sectorWrapper}>
      <div className={styles.sectorContents}>
        Showing:
        <Suspense fallback={null}>
          <SectorButtons />
        </Suspense>
      </div>
    </div>
  );
}
