import { STATES_BY_FULL } from "@/app/data/states";
import { Ad, AdVideo, GoogleAd } from "@/app/types/Ads";

// The pipeline stores object keys rather than full URLs for rehosted ad media,
// so the origin is decided here. Point this at a CDN path instead of the bucket
// and every ad image, video and poster follows without a data migration.
const MEDIA_BASE_URL = "https://storage.googleapis.com/follow-the-crypto-ads";

export function mediaUrl(key: string): string {
  return `${MEDIA_BASE_URL}/${key}`;
}

/**
 * Best-effort state abbreviation for an ad, from Google's geo targeting.
 *
 * The field is a comma-separated list of "<zip>,<State>,<Country>" triples, or
 * "<State>,<Country>" for statewide buys. ZIP prefixes collide with foreign
 * postcodes, so a single Illinois buy can carry a stray "Hauts-de-France,
 * France" — hence taking the most-mentioned US state rather than the first one.
 *
 * Only the state is inferred. The district isn't derivable: the same Chicago
 * ZIP list appears on ads tagged IL-H-07 and on ads tagged IL-S, because a
 * House and a Senate ad can target identical ground.
 */
export function getStateFromGeoTargeting(geoTargeting?: string | null): string {
  if (!geoTargeting) {
    return "";
  }
  const counts = new Map<string, number>();
  for (const entry of geoTargeting.split(",")) {
    const abbreviation = STATES_BY_FULL[entry.trim()];
    if (abbreviation) {
      counts.set(abbreviation, (counts.get(abbreviation) || 0) + 1);
    }
  }
  let best = "";
  let bestCount = 0;
  for (const [abbreviation, count] of counts) {
    if (count > bestCount) {
      best = abbreviation;
      bestCount = count;
    }
  }
  return best;
}

function sumImpressionRanges(ranges: string[]): string {
  let low = 0;
  let high = 0;
  for (const range of ranges) {
    const [rangeLow, rangeHigh] = range.split("-");
    low += parseInt(rangeLow) || 0;
    high += parseInt(rangeHigh) || 0;
  }
  return `${low}-${high}`;
}

// Walk variantOf up to the ad nobody points at. An editing mistake shouldn't
// take the page down, so a cycle resolves rather than hanging.
function resolvePrimaryId(adId: string, ads: Map<string, GoogleAd>): string {
  const seen = new Set<string>([adId]);
  let current = adId;
  while (true) {
    const parent = ads.get(current)?.variantOf;
    if (!parent || !ads.has(parent)) {
      return current;
    }
    if (seen.has(parent)) {
      // Every ad in a cycle has to agree on the same primary. Returning the
      // nearest unvisited ad instead would have each one naming a different
      // neighbour, so none would be its own primary and the whole group would
      // drop out of the list. Pick a stable representative instead.
      const cycle: string[] = [];
      let node = parent;
      do {
        cycle.push(node);
        node = ads.get(node)?.variantOf as string;
      } while (node !== parent);
      return cycle.sort()[0];
    }
    seen.add(parent);
    current = parent;
  }
}

/**
 * Fold ads marked as variants into the ad they point at.
 *
 * Advertisers routinely run the same creative as several cuts — a 5-second and
 * a 15-second version of one message — which Google reports as separate ads.
 * They're one buy, so merging sums spend and impressions and spans the date
 * range, rather than showing near-identical entries with fragmented numbers.
 *
 * Non-Google ads pass through untouched.
 */
export function mergeAdVariants(ads: Ad[]): Ad[] {
  const googleAds = new Map<string, GoogleAd>();
  for (const ad of ads) {
    if (ad.type === "google") {
      googleAds.set(ad.ad_id, ad);
    }
  }

  const groups = new Map<string, GoogleAd[]>();
  for (const ad of googleAds.values()) {
    const primaryId = resolvePrimaryId(ad.ad_id, googleAds);
    const group = groups.get(primaryId);
    if (group) {
      group.push(ad);
    } else {
      groups.set(primaryId, [ad]);
    }
  }

  return ads.flatMap((ad): Ad[] => {
    if (ad.type !== "google") {
      return [ad];
    }
    // Variants are represented by their primary, so drop them here.
    if (resolvePrimaryId(ad.ad_id, googleAds) !== ad.ad_id) {
      return [];
    }
    const group = groups.get(ad.ad_id) as GoogleAd[];
    if (group.length === 1) {
      return [ad];
    }
    // Show the longest cut available. The primary is whichever ad ran first,
    // which is often the shorter teaser, and the fuller version is the more
    // informative one to put in front of a reader.
    const longestVideo = group
      .map((variant) => variant.video)
      .filter((video): video is AdVideo => Boolean(video))
      .sort((a, b) => (b.duration ?? 0) - (a.duration ?? 0))[0];
    return [
      {
        ...ad,
        video: longestVideo,
        spend_range_min_usd: group.reduce(
          (sum, variant) => sum + (variant.spend_range_min_usd || 0),
          0,
        ),
        spend_range_max_usd: group.reduce(
          (sum, variant) => sum + (variant.spend_range_max_usd || 0),
          0,
        ),
        impressions: sumImpressionRanges(
          group.map((variant) => variant.impressions).filter(Boolean),
        ),
        date_range_start: group
          .map((variant) => variant.date_range_start)
          .filter(Boolean)
          .sort()[0],
        date_range_end: group
          .map((variant) => variant.date_range_end)
          .filter(Boolean)
          .sort()
          .reverse()[0],
        variantCount: group.length,
      },
    ];
  });
}

export function getAdDate(ad: Ad): string {
  if (ad.type === "google") {
    return ad.date_range_start;
  } else if (ad.type === "image") {
    return ad.date;
  }
  return "1970";
}
