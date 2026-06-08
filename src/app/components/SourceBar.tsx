import Skeleton from "@/app/components/skeletons/Skeleton";
import { humanizeList, humanizeNumber } from "@/app/utils/humanize";

import styles from "./SourceBar.module.css";

export interface SourceBarItem {
  key: string;
  // Short label shown inside the bar segment (e.g. last name).
  segmentLabel: string;
  // Full label used in the prose caption and accessibility text.
  captionLabel: string;
  total: number;
}

// Items above this share of the combined total get their own labeled segment;
// everyone else is grouped into a single grey "next N" segment.
const SEGMENT_THRESHOLD_PCT = 10;
const NAMED_SEGMENT_COLORS = [
  styles.seg0,
  styles.seg1,
  styles.seg2,
  styles.seg3,
];

export function SourceBarSkeleton() {
  return (
    <div className={styles.sourceBlock}>
      <Skeleton width="100%" height="2.75rem" />
    </div>
  );
}

export default function SourceBar({
  items,
  combinedTotal,
  noun,
  totalLabel,
  className,
}: {
  items: SourceBarItem[];
  combinedTotal: number;
  noun: { singular: string; plural: string };
  totalLabel: string;
  className?: string;
}) {
  if (combinedTotal <= 0 || items.length === 0) {
    return null;
  }

  const named = items.filter(
    (i) => (i.total / combinedTotal) * 100 > SEGMENT_THRESHOLD_PCT,
  );
  const rest = items.filter(
    (i) => (i.total / combinedTotal) * 100 <= SEGMENT_THRESHOLD_PCT,
  );
  const restTotal = rest.reduce((sum, i) => sum + i.total, 0);
  const namedPct = Math.round(
    (named.reduce((sum, i) => sum + i.total, 0) / combinedTotal) * 100,
  );
  const restPct = 100 - namedPct;
  const restNoun = rest.length === 1 ? noun.singular : noun.plural;

  const ariaLabel = `Share of ${totalLabel}: ${named
    .map((i) => `${i.captionLabel} ${Math.round((i.total / combinedTotal) * 100)}%`)
    .join("; ")}${
    rest.length > 0 ? `; ${rest.length} other ${restNoun} ${restPct}%` : ""
  }`;

  return (
    <div className={`${styles.sourceBlock} ${className ?? ""}`}>
      <div className={styles.sourceBar} role="img" aria-label={ariaLabel}>
        {named.map((item, i) => {
          const pct = Math.round((item.total / combinedTotal) * 100);
          return (
            <div
              key={item.key}
              className={`${styles.sourceSegment} ${
                NAMED_SEGMENT_COLORS[Math.min(i, NAMED_SEGMENT_COLORS.length - 1)]
              }`}
              style={{ flexGrow: item.total }}
            >
              <span className={styles.sourceSegmentLabel}>
                {item.segmentLabel} {pct}%
              </span>
            </div>
          );
        })}
        {rest.length > 0 && (
          <div
            className={`${styles.sourceSegment} ${styles.segRest}`}
            style={{ flexGrow: restTotal }}
          >
            <span className={styles.sourceSegmentLabel}>
              next {rest.length} {restPct}%
            </span>
          </div>
        )}
      </div>
      {named.length > 0 && (
        <p className={styles.sourceCaption}>
          {humanizeList(
            named.map((i) => (
              <span key={i.key} className="bold">
                {i.captionLabel}
              </span>
            )),
          )}{" "}
          {named.length === 1 ? "accounts" : "account"} for {namedPct}% of{" "}
          {totalLabel}.
          {rest.length > 0 && (
            <>
              {" "}
              The other {humanizeNumber(rest.length)} {restNoun} share the
              remaining {restPct}%.
            </>
          )}
        </p>
      )}
    </div>
  );
}
