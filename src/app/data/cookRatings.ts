// The Cook Political Report race rating scale. The ratings themselves were
// parsed from cookpolitical.com/ratings/senate-race-ratings and
// .../house-race-ratings, and only races we track are included. Cook's ratings
// are for the 2026 regular elections, so specials that finished in 2025 have
// none.

export type CookRating =
  | "solid-d"
  | "likely-d"
  | "lean-d"
  | "tossup"
  | "lean-r"
  | "likely-r"
  | "solid-r";

// Left (Democratic) to right (Republican), the order the scale is drawn in
export const COOK_RATING_SCALE: CookRating[] = [
  "solid-d",
  "likely-d",
  "lean-d",
  "tossup",
  "lean-r",
  "likely-r",
  "solid-r",
];

export const COOK_RATING_LABELS: Record<
  CookRating,
  { short: string; full: string }
> = {
  "solid-d": { short: "Solid D", full: "Solid Democratic" },
  "likely-d": { short: "Likely D", full: "Likely Democratic" },
  "lean-d": { short: "Lean D", full: "Lean Democratic" },
  tossup: { short: "Toss-up", full: "Toss-up" },
  "lean-r": { short: "Lean R", full: "Lean Republican" },
  "likely-r": { short: "Likely R", full: "Likely Republican" },
  "solid-r": { short: "Solid R", full: "Solid Republican" },
};

// Cook updates the two chambers separately
export const COOK_RATINGS_AS_OF = {
  senate: "2026-10-30",
  house: "2026-10-30",
};

// Ratings by full race ID. Stored in Firestore (constants/cookRatings) so
// races Cook's snapshot missed can be filled in from the results admin page
// without a deploy; load them with fetchCookRatings.
export type CookRatings = Record<string, CookRating>;
