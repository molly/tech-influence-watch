"use client";

import Link from "next/link";
import { useState } from "react";

import SectorBadge from "@/app/components/SectorBadge";
import COMMITTEES from "@/app/data/committees";
import { type CombinedDonor } from "@/app/utils/trumpCombinedDonors";
import { formatCurrency } from "@/app/utils/utils";

import styles from "./TrumpCombinedDonors.module.css";

const VISIBLE_LIMIT = 20;

function sectorLabel(sector?: string | null) {
  if (!sector || sector === "tech") {
    return null;
  }
  return sector === "ai" ? "AI" : sector;
}

function donorHref(donor: CombinedDonor): string | null {
  if (!donor.id) {
    return null;
  }
  if (donor.id in COMMITTEES) {
    return `/2026/committees/${donor.id}`;
  }
  return donor.isIndividual
    ? `/2026/individuals/${donor.id}`
    : `/2026/companies/${donor.id}`;
}

export default function TrumpDonorList({
  donors,
}: {
  donors: CombinedDonor[];
}) {
  const [expanded, setExpanded] = useState(false);

  if (donors.length === 0) {
    return <p>No contributions found.</p>;
  }

  const isCollapsible = donors.length > VISIBLE_LIMIT;
  const visibleDonors =
    isCollapsible && !expanded ? donors.slice(0, VISIBLE_LIMIT) : donors;
  const hiddenCount = donors.length - VISIBLE_LIMIT;
  const hasUntracked = donors.some((donor) => !donor.tracked);

  return (
    <div>
      {visibleDonors.map((donor) => {
        const href = donorHref(donor);
        return (
          <div key={donor.id ?? donor.name} className={styles.donorRow}>
            <span className={styles.donorName}>
              {href ? <Link href={href}>{donor.name}</Link> : donor.name}
              {sectorLabel(donor.sector) && (
                <SectorBadge>{sectorLabel(donor.sector)}</SectorBadge>
              )}
              {!donor.tracked && (
                <span className={styles.untrackedTag}>not tracked</span>
              )}
            </span>
            <span className={styles.donorAmount}>
              {formatCurrency(donor.total, true)}
            </span>
          </div>
        );
      })}
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
          {expanded ? "Show fewer" : `${hiddenCount} more`}
        </button>
      )}
      {hasUntracked && (
        <p className={styles.donorNote}>
          <span className={styles.untrackedTag}>not tracked</span> are donors
          this site doesn&rsquo;t otherwise follow. Apart from backing Trump,
          they haven&rsquo;t made campaign contributions at a scale worth
          tracking.
        </p>
      )}
    </div>
  );
}
