"use client";

import { ReactNode, useState } from "react";

import styles from "./ElectionResults.module.css";

const BATCH_SIZE = 25;

// Shows the race cards a batch at a time. The cards are all on one URL rather
// than paginated, since each election-night purge clears that one URL. Cards
// past the visible batch aren't mounted, so their candidate photos don't load.
export default function ResultRaceList({ cards }: { cards: ReactNode[] }) {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const hiddenCount = cards.length - visibleCount;
  return (
    <>
      <div className={styles.raceList}>{cards.slice(0, visibleCount)}</div>
      {hiddenCount > 0 && (
        <button
          type="button"
          className={styles.showMore}
          onClick={() => setVisibleCount((count) => count + BATCH_SIZE)}
        >
          <span className={styles.showMoreCaret} aria-hidden="true" />
          Show {Math.min(hiddenCount, BATCH_SIZE)} more of {hiddenCount}{" "}
          remaining {hiddenCount === 1 ? "race" : "races"}
        </button>
      )}
    </>
  );
}
