import { fetchCookRatings } from "@/app/actions/fetch";
import {
  COOK_RATING_LABELS,
  COOK_RATING_SCALE,
  COOK_RATINGS_AS_OF,
  CookRating,
} from "@/app/data/cookRatings";
import { formatDateFromString } from "@/app/utils/utils";

import InformationalTooltip from "./InformationalTooltip";
import styles from "./RaceRating.module.css";

// Compact chip for tables, e.g. "Lean R", shaded like its step on the scale
export function RaceRatingChip({
  rating,
  className,
  prefix,
}: {
  rating?: CookRating;
  className?: string;
  // Text before the rating, e.g. "Projected"
  prefix?: string;
}) {
  if (!rating) {
    return null;
  }
  return (
    <span
      className={`${styles.chip} ${styles[rating]}${className ? ` ${className}` : ""}`}
      title="Cook Political Report rating"
    >
      {prefix && `${prefix} `}
      {COOK_RATING_LABELS[rating].short}
    </span>
  );
}

// Column header for the rating column in race tables. `note` is appended to
// the tooltip, e.g. to explain the rating in a table of primaries.
export function RatingHeader({
  label = "Rating",
  note,
}: {
  label?: string;
  note?: string;
}) {
  return (
    <th className="center-cell">
      <span className="no-wrap">
        {label}
        <InformationalTooltip>
          <span>
            Cook Political Report rating, as of{" "}
            {formatDateFromString(COOK_RATINGS_AS_OF.senate)} for Senate races
            and {formatDateFromString(COOK_RATINGS_AS_OF.house)} for House
            races.{note && ` ${note}`}
          </span>
        </InformationalTooltip>
      </span>
    </th>
  );
}

export default async function RaceRating({ raceId }: { raceId: string }) {
  const rating = (await fetchCookRatings())[raceId];
  if (!rating) {
    return null;
  }
  const isSenate = raceId.split("-")[1] === "S";
  const asOf = isSenate ? COOK_RATINGS_AS_OF.senate : COOK_RATINGS_AS_OF.house;

  return (
    <div className={styles.rating}>
      <span>
        Cook rating:{" "}
        <span className="bold">{COOK_RATING_LABELS[rating].full}</span>
      </span>
      {/* The label above carries the rating for screen readers */}
      <ol className={styles.scale} aria-hidden="true">
        {COOK_RATING_SCALE.map((step) => (
          <li
            key={step}
            className={`${styles.step} ${styles[step]}${step === rating ? ` ${styles.current}` : ""}`}
          />
        ))}
      </ol>
      <span className={styles.source}>as of {formatDateFromString(asOf)}</span>
    </div>
  );
}
