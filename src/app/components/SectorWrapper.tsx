"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";

import styles from "./header.module.css";
import SectorButtons from "./SectorButtons";

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
];

export default function SectorWrapper() {
  const pathname = usePathname();
  const isExactTopLevelPath = /^\/2026\/(committees|companies)\/?$/.test(pathname);
  const showSector =
    isExactTopLevelPath ||
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
