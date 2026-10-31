"use client";

import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  safePolygon,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import Link from "next/link";
import { useRef, useState } from "react";

import tooltipStyles from "@/app/components/informationalTooltip.module.css";
import { AdSector } from "@/app/types/AdAnalysis";
import { Sector } from "@/app/types/Sector";
import {
  adLibraryHref,
  LEANING_SHORT_LABELS,
  leaningPosition,
  StanceLeaning,
  TranscriptExcerpt,
} from "@/app/utils/adAnalysis";
import {
  humanizeList,
  humanizePercentage,
  pluralize,
} from "@/app/utils/humanize";
import { sectorHref } from "@/app/utils/sector";
import { sentenceCase } from "@/app/utils/titlecase";

import { TranscriptExcerpts } from "./AdCardParts";
import styles from "./Ads.module.css";

type StanceDot = {
  id: string;
  stances: string[];
  // The distinct leanings of the ad's stances, which set the square's color.
  leanings: StanceLeaning[];
  // "industry" for ads that name the sponsor's industry, "tech" for ads that
  // only mention tech more broadly (Palantir, Big Tech, Sam Bankman-Fried).
  mention: "industry" | "tech" | null;
  // The spans tagged mentions_industry or mentions_tech, if any are marked.
  quote: { transcript: string; excerpts: TranscriptExcerpt[] } | null;
  // Who the ad supports and opposes, e.g. "Supports Jim Kingston".
  candidates: string | null;
  committee: string;
  committeeId: string;
  race: string;
  stanceLabels: string[];
};

export type StanceColumn = {
  key: AdSector;
  title: string;
  word: string;
  total: number;
  // A finding about the column's industry mentions, shown under the legend.
  note: React.ReactNode;
  dots: StanceDot[];
  // The leanings with at least one ad, in order from favorable to critical.
  groups: {
    leaning: StanceLeaning;
    label: string;
    // Ads with any of the group's stances, each counted once.
    count: number;
    rows: {
      stance: string;
      label: string;
      description: string | null;
      count: number;
      // Ads per network, or per committee for committees outside one.
      sponsors: [string, number][];
    }[];
  }[];
};

// Square fill for each combination of leanings an ad can have.
const LEANING_CLASSES: Record<string, string> = {
  favorable: styles.dotFavorable,
  mixed: styles.dotMixed,
  critical: styles.dotCritical,
  "favorable mixed": styles.dotFavorableMixed,
  "mixed critical": styles.dotMixedCritical,
  "favorable critical": styles.dotFavorableCritical,
  "favorable mixed critical": styles.dotFavorableMixedCritical,
};

function leaningClass(leanings: StanceLeaning[]): string {
  return LEANING_CLASSES[leanings.join(" ")] ?? "";
}

// "Favorable", or "Mixed and critical" for an ad whose stances lean two ways.
function leaningLegendLabel(leanings: StanceLeaning[]): string {
  if (leanings.length === 0) {
    return "No mention";
  }
  return sentenceCase(
    humanizeList(
      leanings.map((leaning) => LEANING_SHORT_LABELS[leaning]),
    ) as string,
  );
}

const GROUP_CLASSES: Record<StanceLeaning, string> = {
  favorable: styles.stanceGroupFavorable,
  mixed: styles.stanceGroupMixed,
  critical: styles.stanceGroupCritical,
};

// A square that links to its ad. Hovering it with a mouse shows the passage
// that mentions the industry, in a tooltip the pointer can move into to follow
// its link. On touch screens the first tap opens the tooltip instead of
// following the square's link.
function Dot({
  dot,
  sector,
  className,
}: {
  dot: StanceDot;
  sector: Sector;
  className: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const tapped = useRef(false);
  const href = adLibraryHref(sector, { id: dot.id });
  const label = [dot.committee, dot.race, dot.candidates, ...dot.stanceLabels]
    .filter(Boolean)
    .join(" · ");

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "top",
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        fallbackAxisSideDirection: "start",
      }),
      shift({ padding: 8 }),
    ],
  });

  const hover = useHover(context, {
    mouseOnly: true,
    handleClose: safePolygon(),
  });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  return (
    <>
      <Link
        href={href}
        aria-label={label}
        className={className}
        ref={refs.setReference}
        {...getReferenceProps()}
        // None of the interactions above handle these two. A tap fires
        // touchstart before click; a mouse never fires it.
        onTouchStart={() => {
          tapped.current = true;
        }}
        onClick={(e) => {
          if (tapped.current && !isOpen) {
            e.preventDefault();
            setIsOpen(true);
          }
          tapped.current = false;
        }}
      />
      <FloatingPortal>
        {isOpen && (
          <div
            className={`${tooltipStyles.tooltip} ${styles.dotTooltip}`}
            ref={refs.setFloating} // eslint-disable-line react-hooks/refs
            style={floatingStyles}
            {...getFloatingProps()}
          >
            <div className={styles.meta}>
              <Link href={`/2026/committees/${dot.committeeId}`}>
                {dot.committee}
              </Link>{" "}
              ·{" "}
              <Link href={sectorHref(`/2026/elections/${dot.race}`, sector)}>
                {dot.race}
              </Link>
              {dot.stanceLabels.map((stance) => ` · ${stance}`)}
            </div>
            {dot.candidates && <div>{dot.candidates}</div>}
            {dot.quote && (
              <p className={styles.transcript}>
                <TranscriptExcerpts
                  transcript={dot.quote.transcript}
                  excerpts={dot.quote.excerpts}
                  search={null}
                />
              </p>
            )}
            <Link className={styles.smallLink} href={href}>
              Read in the ad library →
            </Link>
          </div>
        )}
      </FloatingPortal>
    </>
  );
}

function Column({ column, sector }: { column: StanceColumn; sector: Sector }) {
  // Which stance's squares to pick out.
  const [active, setActive] = useState<string | null>(null);
  const mentioned = column.dots.filter(
    (dot) => dot.mention === "industry",
  ).length;
  const techOnly = column.dots.filter((dot) => dot.mention === "tech").length;

  // One legend entry per combination of leanings, in the squares' order.
  const legend = [
    ...Map.groupBy(column.dots, (dot) => dot.leanings.join(" ")).values(),
  ]
    .map((dots) => ({ leanings: dots[0].leanings, count: dots.length }))
    .sort(
      (a, b) =>
        leaningPosition(a.leanings) - leaningPosition(b.leanings) ||
        a.leanings.length - b.leanings.length,
    );

  const highlight = (key: string) => ({
    onMouseEnter: () => setActive(key),
    onMouseLeave: () => setActive(null),
    onFocus: () => setActive(key),
    onBlur: () => setActive(null),
  });

  return (
    <div className={styles.stanceColumn}>
      <h3 className={styles.stanceTitle}>{column.title}</h3>
      <div className={styles.stanceBig}>
        <span className={styles.stanceBigNumber}>
          {mentioned}
          <span className={styles.stanceBigOf}> / {column.total}</span>
        </span>
        <span className={styles.stanceBigLabel}>
          ads mention {column.word} ({humanizePercentage(mentioned, column.total)})
        </span>
      </div>
      {techOnly > 0 && (
        <p className={styles.stanceBigTech}>
          +{techOnly} more{" "}
          {pluralize(techOnly, "mentions", { plural: "mention" })} tech without
          naming {column.word}
        </p>
      )}
      <div
        className={`${styles.dots} ${active ? styles.dotsHighlighting : ""}`}
      >
        {column.dots.map((dot) => {
          const isActive = active !== null && dot.stances.includes(active);
          const activeClass = isActive ? styles.dotActive : "";
          // Ads that don't mention tech have nothing to show in a tooltip.
          if (!dot.mention) {
            return (
              <span
                key={dot.id}
                className={`${styles.dot} ${activeClass}`}
                aria-hidden
              />
            );
          }
          return (
            <Dot
              key={dot.id}
              dot={dot}
              sector={sector}
              className={`${styles.dot} ${styles.dotLink} ${leaningClass(
                dot.leanings,
              )} ${activeClass}`}
            />
          );
        })}
      </div>
      <ul className={styles.stanceLegend}>
        {legend.map(({ leanings, count }) => (
          <li key={leanings.join(" ")} className={styles.stanceLegendItem}>
            <span className={`${styles.dot} ${leaningClass(leanings)}`} />
            {leaningLegendLabel(leanings)}
            <span className="bold">{count}</span>
          </li>
        ))}
      </ul>
      {column.note && <p className={styles.stanceNote}>{column.note}</p>}
      {column.groups.map((group) => (
        <div
          key={group.leaning}
          className={`${styles.stanceGroup} ${GROUP_CLASSES[group.leaning]}`}
        >
          <h4 className={styles.stanceGroupHeader}>
            <span className={styles.stanceGroupLabel}>{group.label}</span>
            <span className={styles.stanceGroupCount}>
              {pluralize(group.count, "ad", { includeValue: true })}
            </span>
          </h4>
          {group.rows.map((row) => (
            // Limited to the column's industry, so the library shows just the
            // ads this row counts.
            <Link
              key={row.stance}
              href={adLibraryHref(column.key, { tag: row.stance })}
              className={styles.stanceRow}
              {...highlight(row.stance)}
            >
              <div>
                <span className={styles.stanceRowLabel}>{row.label}</span>
                {row.description && (
                  <span className={styles.stanceRowDescription}>
                    {row.description}
                  </span>
                )}
                <span className={styles.stanceRowCommittees}>
                  {row.sponsors.map(([name, count]) => (
                    <span key={name}>
                      {name}{" "}
                      <span className={styles.stanceRowCommitteeCount}>
                        {count}
                      </span>
                    </span>
                  ))}
                </span>
              </div>
              <span className={styles.stanceRowCount}>{row.count}</span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}

// Children fill the grid cells after the columns, e.g. a panel beside the
// single column of a sector's own page.
export default function IndustryStances({
  columns,
  sector,
  children,
}: {
  columns: StanceColumn[];
  sector: Sector;
  children?: React.ReactNode;
}) {
  return (
    <div className={styles.stanceColumns}>
      {columns.map((column) => (
        <Column key={column.key} column={column} sector={sector} />
      ))}
      {children}
    </div>
  );
}
