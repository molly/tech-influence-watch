"use client";

import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import styles from "./header.module.css";
import SectorButtons from "./SectorButtons";

const SECTOR_PATHS = [
  "/",
  "/2026/beneficiaries",
  "/2026/contributions",
  "/2026/elections",
  "/2026/expenditures",
  "/2026/spending",
  "/2026/states",
];

function formatLastRun(isoString: string, compact: boolean): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    ...(compact
      ? {}
      : { year: "numeric", timeZoneName: "short" }),
  }).format(date);
}

export default function SectorWrapper({ lastRun }: { lastRun: string | null }) {
  const pathname = usePathname();
  // Format in the browser so the timestamp reflects the visitor's local zone;
  // rendering nothing until mount avoids an SSR/client hydration mismatch.
  const [formatted, setFormatted] = useState<{
    full: string;
    compact: string;
  } | null>(null);
  useEffect(() => {
    if (lastRun) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormatted({
        full: formatLastRun(lastRun, false),
        compact: formatLastRun(lastRun, true),
      });
    }
  }, [lastRun]);
  const isExactTopLevelPath =
    /^\/2026\/(committees|companies|individuals)\/?$/.test(pathname);
  const showSector =
    isExactTopLevelPath ||
    SECTOR_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
  if (!showSector) {
    return null;
  }
  return (
    <div className={styles.sectorWrapper}>
      <div className={styles.sectorContents}>
        <span>
          Showing:
          <Suspense fallback={null}>
            <SectorButtons />
          </Suspense>
        </span>
        {formatted && (
          <span className={styles.lastUpdated}>
            Updated{" "}
            <span className={styles.lastUpdatedFull}>{formatted.full}</span>
            <span className={styles.lastUpdatedCompact}>
              {formatted.compact}
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
