import { DateTime } from "luxon";

import { NETWORKS } from "@/app/data/networks";
import {
  AdParty,
  AdSector,
  CodebookEntry,
  TaggedAd,
} from "@/app/types/AdAnalysis";
import { Sector } from "@/app/types/Sector";

import { sectorHref } from "./sector";

export const AD_SECTOR_LABELS: Record<AdSector, string> = {
  crypto: "Crypto",
  ai: "AI",
};

export const AD_PARTY_LABELS: Record<AdParty, string> = {
  dem: "Democratic",
  rep: "Republican",
  both: "Both parties",
};

export const AD_PARTY_SHORT_LABELS: Record<AdParty, string> = {
  dem: "Dem.",
  rep: "Rep.",
  both: "Both",
};

// Label for committees outside any network. Not "Unaffiliated", which can
// read as a statement about party.
export const NO_NETWORK_LABEL = "No network";

// Where the sponsoring committee sits, e.g. "Rep. arm of" the FairShake
// network, so the committee's side isn't mistaken for the candidate's.
// Network leads go without, since the network shares their name.
export function describeCommittee(
  ad: TaggedAd,
): { role: string; network: string | null } | null {
  if (ad.party === "both") {
    return null;
  }
  if (ad.network) {
    return {
      role: ad.party ? `${AD_PARTY_SHORT_LABELS[ad.party]} arm of` : "Part of",
      network: ad.network,
    };
  }
  return ad.party
    ? {
        role: `${AD_PARTY_SHORT_LABELS[ad.party]} PAC`,
        network: null,
      }
    : null;
}

export function adMatchesSector(adSector: AdSector, sector: Sector): boolean {
  return sector === "all" || adSector === sector;
}

export function adSectorsForView(sector: Sector): AdSector[] {
  return sector === "all" ? ["crypto", "ai"] : [sector];
}

// What "mentions industry" means for each sector's ads.
export const INDUSTRY_WORD: Record<AdSector, string> = {
  crypto: "crypto",
  ai: "AI",
};

export function hasTag(ad: TaggedAd, tag: string): boolean {
  return ad.tags.includes(tag);
}

export function hasRollup(ad: TaggedAd, rollup: string): boolean {
  return ad.rollups.includes(rollup);
}

// The ad library's tag filter, which takes either a tag or a rollup name.
export function matchesTagFilter(ad: TaggedAd, filter: string): boolean {
  return hasTag(ad, filter) || hasRollup(ad, filter);
}

// Every rollup the entries count toward, in order of first appearance.
export function getRollups(codebook: CodebookEntry[]): string[] {
  return [...new Set(codebook.flatMap((entry) => entry.rollups))];
}

export function mentionsIndustry(ad: TaggedAd): boolean {
  return hasTag(ad, "mentions_industry");
}

// A tech company, figure or topic other than the sponsor's own industry.
// Mutually exclusive with mentionsIndustry.
export function mentionsTech(ad: TaggedAd): boolean {
  return hasTag(ad, "mentions_tech");
}

export function tagShare(ads: TaggedAd[], tag: string): number {
  if (ads.length === 0) {
    return 0;
  }
  return ads.filter((ad) => hasTag(ad, tag)).length / ads.length;
}

// Codebook groups
export const STANCE_GROUP = "industry stance";
export const TECH_GROUP = "tech";
export const FORMAT_GROUP = "format";

// Format tags describe what kind of ad it is rather than what it's about, so
// they're left out of theme comparisons, along with the stances.
const NON_THEME_GROUPS = ["format", STANCE_GROUP];

export function themeEntries(codebook: CodebookEntry[]): CodebookEntry[] {
  return codebook.filter((entry) => !NON_THEME_GROUPS.includes(entry.group));
}

export function stanceEntries(codebook: CodebookEntry[]): CodebookEntry[] {
  return codebook.filter((entry) => entry.group === STANCE_GROUP);
}

// Whether each stance tag is good, bad or mixed news for the sponsor's
// industry. Every stance tag in the codebook needs one.
export type StanceLeaning = "favorable" | "mixed" | "critical";

export const STANCE_LEANINGS: Record<string, StanceLeaning> = {
  stance_promote: "favorable",
  stance_lead: "favorable",
  stance_safeguards: "mixed",
  stance_villain: "critical",
  stance_tainted: "critical",
};

// Stances worded differently for each sector's ads. Views that span both
// sectors keep the codebook's wording.
const SECTOR_STANCE_TEXT: Record<
  string,
  Record<AdSector, Pick<CodebookEntry, "label" | "definition">>
> = {
  stance_promote: {
    crypto: {
      label: "Promotes crypto",
      definition: "Crypto and digital assets are innovative and worth backing.",
    },
    ai: {
      label: "Promotes AI",
      definition: "AI is powerful or beneficial.",
    },
  },
};

export function entryForSector(
  entry: CodebookEntry,
  sector: Sector,
): CodebookEntry {
  if (sector === "all") {
    return entry;
  }
  return { ...entry, ...SECTOR_STANCE_TEXT[entry.tag]?.[sector] };
}

export const LEANING_ORDER: StanceLeaning[] = [
  "favorable",
  "mixed",
  "critical",
];

export const LEANING_LABELS: Record<StanceLeaning, string> = {
  favorable: "Favorable to the industry",
  mixed: "Mixed",
  critical: "Critical of the industry",
};

export const LEANING_SHORT_LABELS: Record<StanceLeaning, string> = {
  favorable: "Favorable",
  mixed: "Mixed",
  critical: "Critical",
};

// The distinct leanings of an ad's stances, in LEANING_ORDER.
export function stanceLeanings(stances: string[]): StanceLeaning[] {
  const leanings = new Set(stances.map((stance) => STANCE_LEANINGS[stance]));
  return LEANING_ORDER.filter((leaning) => leanings.has(leaning));
}

// Where a set of leanings falls from favorable (0) to critical (2), so that
// an ad that's both favorable and mixed sorts between the two.
export function leaningPosition(leanings: StanceLeaning[]): number {
  if (leanings.length === 0) {
    return LEANING_ORDER.length;
  }
  const sum = leanings.reduce(
    (total, leaning) => total + LEANING_ORDER.indexOf(leaning),
    0,
  );
  return sum / leanings.length;
}

/**
 * "May 8–20", or "May 28 – Jun 3" when the range crosses a month.
 */
export function formatAdDateRange(start: string, end: string): string {
  const s = DateTime.fromISO(start, { zone: "utc" });
  const e = DateTime.fromISO(end, { zone: "utc" });
  if (start === end) {
    return s.toFormat("LLL d");
  }
  if (s.hasSame(e, "month")) {
    return `${s.toFormat("LLL d")}–${e.toFormat("d")}`;
  }
  return `${s.toFormat("LLL d")} – ${e.toFormat("LLL d")}`;
}

const SENTENCE_BREAK = /(?<=[.!?])\s+/g;

export function splitSentences(text: string): string[] {
  return text.split(SENTENCE_BREAK);
}

// Where the sentence containing `index` begins.
function sentenceStart(text: string, index: number): number {
  let start = 0;
  for (const match of text.matchAll(SENTENCE_BREAK)) {
    const end = (match.index ?? 0) + match[0].length;
    if (end > index) {
      break;
    }
    start = end;
  }
  return start;
}

// Spans for the ad library's tag filter: the tag's own, or for a rollup,
// those of each of the ad's tags that count toward it, merged.
export function getFilterSpans(
  ad: TaggedAd,
  filter: string,
  codebook: CodebookEntry[],
): [number, number][] {
  if (ad.spans[filter]) {
    return ad.spans[filter];
  }
  return mergeRanges(
    codebook
      .filter((entry) => entry.rollups.includes(filter))
      .flatMap((entry) => ad.spans[entry.tag] ?? []),
  );
}

// Sort [start, end) ranges and combine the ones that overlap.
export function mergeRanges(ranges: [number, number][]): [number, number][] {
  const merged: [number, number][] = [];
  for (const range of [...ranges].sort((a, b) => a[0] - b[0])) {
    const last = merged[merged.length - 1];
    if (last && range[0] <= last[1]) {
      last[1] = Math.max(last[1], range[1]);
    } else {
      merged.push([...range]);
    }
  }
  return merged;
}

// A stretch of transcript to quote, with the spans inside it to highlight.
export type TranscriptExcerpt = {
  start: number;
  end: number;
  highlights: [number, number][];
};

// Each span is quoted from the start of its sentence, so a span that starts
// mid-sentence keeps the words that lead into it, through the end of the
// span. Spans that land in the same stretch share one excerpt.
export function getSpanExcerpts(
  transcript: string,
  spans: [number, number][],
): TranscriptExcerpt[] {
  const excerpts: TranscriptExcerpt[] = [];
  for (const [start, end] of spans) {
    const from = sentenceStart(transcript, start);
    const last = excerpts[excerpts.length - 1];
    if (last && from <= last.end) {
      last.end = Math.max(last.end, end);
      last.highlights.push([start, end]);
    } else {
      excerpts.push({ start: from, end, highlights: [[start, end]] });
    }
  }
  return excerpts;
}

const NETWORK_ORDER = NETWORKS.map((network) => network.name);

export type CommitteeAds = {
  name: string;
  id: string;
  sector: AdSector;
  party: AdParty | null;
  network: string | null;
  ads: TaggedAd[];
};

const SECTOR_ORDER: AdSector[] = ["crypto", "ai"];
const PARTY_ORDER: (AdParty | null)[] = ["both", "rep", "dem", null];

function networkRank(network: string | null): number {
  if (network === null) {
    return NETWORK_ORDER.length;
  }
  const index = NETWORK_ORDER.indexOf(network);
  return index === -1 ? NETWORK_ORDER.length - 1 : index;
}

/**
 * Group ads by committee, ordered by network, then sector, then lead/Rep./Dem.
 * arm, then size.
 */
export function groupByCommittee(ads: TaggedAd[]): CommitteeAds[] {
  const byId = new Map<string, CommitteeAds>();
  for (const ad of ads) {
    const existing = byId.get(ad.committeeId);
    if (existing) {
      existing.ads.push(ad);
    } else {
      byId.set(ad.committeeId, {
        name: ad.committee,
        id: ad.committeeId,
        sector: ad.sector,
        party: ad.party,
        network: ad.network,
        ads: [ad],
      });
    }
  }
  return [...byId.values()].sort(
    (a, b) =>
      networkRank(a.network) - networkRank(b.network) ||
      SECTOR_ORDER.indexOf(a.sector) - SECTOR_ORDER.indexOf(b.sector) ||
      PARTY_ORDER.indexOf(a.party) - PARTY_ORDER.indexOf(b.party) ||
      b.ads.length - a.ads.length,
  );
}

export type AdLibraryParams = {
  id?: string;
  cm?: string;
  tag?: string;
  net?: string;
  party?: string;
  q?: string;
};

export function adLibraryHref(
  sector: Sector,
  params: AdLibraryParams = {},
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      search.set(key, value);
    }
  }
  const query = search.toString();
  return (
    sectorHref("/2026/analysis/ads/library", sector) +
    (query ? `?${query}` : "")
  );
}
