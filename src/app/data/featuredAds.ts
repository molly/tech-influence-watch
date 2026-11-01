// Ads featured for each network's Democratic and Republican arms in
// "Telling each side what it wants to hear" on the ads analysis page, keyed by
// network name. `id` is the Google ad ID (the ad_id column of
// transcripts_enriched.csv). An arm left out gets its longest-running ad with
// one of the arm's themes (anti-MAGA for Democrats, Trump for Republicans).
//
// `tags` picks which tagged passages the card quotes and highlights, e.g.
// ["border_immigration"]. Left out, it quotes the arm's themes.
export type FeaturedAd = { id: string; tags?: string[] };

export const FEATURED_ARM_ADS: Record<
  string,
  { dem?: FeaturedAd; rep?: FeaturedAd }
> = {
  FairShake: {
    dem: { id: "CR07034135955208404993", tags: ["anti_maga"] }, // Protect Progress, GA-H-13
    rep: { id: "CR15891217444300128257", tags: ["anti_left"] }, // Defend American Jobs, AL-S
  },
  "Leading the Future": {
    dem: { id: "CR00897239223847878657", tags: ["anti_maga"] }, // Think Big, UT-H-01
    rep: { id: "CR13420286818624995329", tags: ["anti_left", "trump_aligned"] }, // American Mission, TX-H-19
  },
  "Public First": {
    dem: { id: "CR04269630983273185281", tags: ["ice"] }, // Jobs and Democracy PAC, TX-H-33
    rep: { id: "CR16451648622740635649", tags: ["border_immigration"] }, // Defending Our Values, TX-H-09
  },
};
