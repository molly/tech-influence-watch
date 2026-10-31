import fs from "fs";
import path from "path";
import { cache } from "react";

import {
  fetchAllStateElections,
  fetchConstant,
  fetchGoogleAds,
} from "@/app/actions/fetch";
import { NETWORKS } from "@/app/data/networks";
import {
  AdParty,
  AdSector,
  CodebookEntry,
  TaggedAd,
} from "@/app/types/AdAnalysis";
import { Ad, AdGroup, AdVideo } from "@/app/types/Ads";
import { CommitteeConstant } from "@/app/types/Committee";
import { ElectionsByState, Party } from "@/app/types/Elections";

import {
  getRollups,
  mergeRanges,
  STANCE_GROUP,
  STANCE_LEANINGS,
} from "./adAnalysis";
import { mergeAdVariants } from "./ads";
import { isError } from "./errors";
import { getStateFromRaceId } from "./races";

const DATA_DIR = path.join(process.cwd(), "src/app/data");

// RFC 4180: quoted fields may contain commas, newlines and doubled quotes.
function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") {
        i++;
      }
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const [header, ...body] = rows;
  return body
    .filter((cells) => cells.some((cell) => cell !== ""))
    .map((cells) =>
      Object.fromEntries(header.map((key, i) => [key, cells[i] ?? ""])),
    );
}

function readCsv(filename: string): Record<string, string>[] {
  return parseCsv(fs.readFileSync(path.join(DATA_DIR, filename), "utf8"));
}

export const getCodebook = cache((): CodebookEntry[] => {
  const codebook = readCsv("codebook.csv").map((row) => ({
    tag: row.tag,
    label: row.label,
    group: row.group,
    definition: row.definition || null,
    rollups: row.rollups ? row.rollups.split(";") : [],
  }));
  // The ad library's tag filter takes either a tag or a rollup name, so the
  // two can't overlap.
  const tags = new Set(codebook.map((entry) => entry.tag));
  const clash = getRollups(codebook).find((rollup) => tags.has(rollup));
  if (clash) {
    throw new Error(`codebook.csv: "${clash}" is both a tag and a rollup`);
  }
  const unclassified = codebook.find(
    (entry) => entry.group === STANCE_GROUP && !STANCE_LEANINGS[entry.tag],
  );
  if (unclassified) {
    throw new Error(
      `codebook.csv: stance tag "${unclassified.tag}" needs a leaning in STANCE_LEANINGS`,
    );
  }
  return codebook;
});

// Committees outside a network have no role to derive a party from, so the
// CSV's committee_party column gives theirs.
function getParty(
  committee: CommitteeConstant | undefined,
  row: Record<string, string>,
): AdParty | null {
  if (committee?.role === "dem" || committee?.role === "rep") {
    return committee.role;
  }
  if (committee?.role === "parent") {
    return "both";
  }
  if (row.committee_party === "dem" || row.committee_party === "rep") {
    return row.committee_party;
  }
  return null;
}

// The transcript CSV names candidates as the race data does.
function getCandidateParty(
  elections: Record<string, ElectionsByState>,
  raceId: string,
  name: string | null,
): Party | null {
  if (!name) {
    return null;
  }
  const state = getStateFromRaceId(raceId);
  const group = elections[state]?.[raceId.slice(state.length + 1)];
  const candidate = group?.races
    .flatMap((race) => race.candidates)
    .find((c) => c.name === name);
  return candidate?.party ?? null;
}

function getNetworkName(committee: CommitteeConstant | undefined) {
  if (!committee?.network) {
    return null;
  }
  return (
    NETWORKS.find((network) => network.key === committee.network)?.name ??
    committee.network
  );
}

// Rehosted videos from the ads collection, keyed by ad id. Variants map to the
// longest cut in their group, matching what race pages show.
async function getAdVideos(): Promise<Map<string, AdVideo>> {
  const videos = new Map<string, AdVideo>();
  const data = await fetchGoogleAds();
  if (isError(data)) {
    return videos;
  }
  const ads = Object.values(data as Record<string, AdGroup>).flatMap(
    (group) => Object.values(group.ads) as Ad[],
  );
  for (const ad of ads) {
    if (ad.type === "google" && ad.video) {
      videos.set(ad.ad_id, ad.video);
    }
  }
  for (const ad of mergeAdVariants(ads)) {
    if (ad.type === "google" && ad.video) {
      videos.set(ad.ad_id, ad.video);
    }
  }
  return videos;
}

function parseSector(row: Record<string, string>): AdSector {
  if (row.sector === "crypto" || row.sector === "ai") {
    return row.sector;
  }
  throw new Error(
    `transcripts_enriched.csv: ad ${row.ad_id} (${row.committee}) has sector "${row.sector}"; expected "crypto" or "ai"`,
  );
}

// Stance tags classify how an ad talks about tech, so an ad that mentions it
// gets at least one and an ad that doesn't gets none. mentions_industry (the
// sponsor's own industry) and mentions_tech (any other tech) are mutually
// exclusive.
function parseStances(
  row: Record<string, string>,
  stanceTags: string[],
): string[] {
  const industry = row.mentions_industry === "1";
  const tech = row.mentions_tech === "1";
  if (industry && tech) {
    throw new Error(
      `transcripts_enriched.csv: ad ${row.ad_id} is tagged both mentions_industry and mentions_tech; it needs at most one`,
    );
  }
  const stances = stanceTags.filter((tag) => row[tag] === "1");
  if ((industry || tech) !== stances.length > 0) {
    throw new Error(
      `transcripts_enriched.csv: ad ${row.ad_id} has ${stances.length} stance tags (${stances.join(", ") || "none"}); ads tagged mentions_industry or mentions_tech need at least one, others need none`,
    );
  }
  return stances;
}

// The spans column quotes the transcript, {tag: [excerpt, ...]}, so that
// copyediting one part of a transcript doesn't shift highlights elsewhere.
// An excerpt that appears more than once highlights its first appearance.
// review_transcripts.py unmarks an ad as reviewed when an edit takes an
// excerpt out of its transcript.
function parseSpans(
  row: Record<string, string>,
  adTags: string[],
): Record<string, [number, number][]> {
  if (!row.spans) {
    return {};
  }
  const where = `transcripts_enriched.csv: ad ${row.ad_id}`;
  let parsed: unknown;
  try {
    parsed = JSON.parse(row.spans);
  } catch {
    throw new Error(`${where} has a spans value that isn't valid JSON`);
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error(`${where} has spans that aren't a {tag: [excerpt]} object`);
  }
  const spans: Record<string, [number, number][]> = {};
  for (const [tag, excerpts] of Object.entries(parsed)) {
    if (!adTags.includes(tag)) {
      throw new Error(`${where} has spans for ${tag} but isn't tagged ${tag}`);
    }
    if (
      !Array.isArray(excerpts) ||
      !excerpts.every((e) => typeof e === "string" && e)
    ) {
      throw new Error(
        `${where} has ${tag} spans that aren't non-empty strings`,
      );
    }
    // Overlapping excerpts for one tag highlight as one.
    spans[tag] = mergeRanges(
      excerpts.map((excerpt: string): [number, number] => {
        const start = row.transcript.indexOf(excerpt);
        if (start === -1) {
          throw new Error(
            `${where} has a ${tag} span "${excerpt}" that isn't in the transcript`,
          );
        }
        return [start, start + excerpt.length];
      }),
    );
  }
  return spans;
}

export const getTaggedAds = cache(async (): Promise<TaggedAd[]> => {
  const [committeeData, electionsData, videos] = await Promise.all([
    fetchConstant<Record<string, CommitteeConstant>>("committees"),
    fetchAllStateElections(),
    getAdVideos(),
  ]);
  const committees = committeeData ?? {};
  const elections = isError(electionsData)
    ? {}
    : (electionsData as Record<string, ElectionsByState>);
  const codebook = getCodebook();
  const tags = codebook.map((entry) => entry.tag);
  const stanceTags = codebook
    .filter((entry) => entry.group === STANCE_GROUP)
    .map((entry) => entry.tag);

  // Newly imported ads stay hidden until they've been tagged and marked
  // reviewed in the backend's review_transcripts.py.
  const reviewed = readCsv("transcripts_enriched.csv").filter(
    (row) => row.reviewed === "1",
  );
  return reviewed.map((row) => {
    const committee = committees[row.committee_id];
    const adTags = tags.filter((tag) => row[tag] === "1");
    return {
      id: row.ad_id,
      race: row.race,
      committee: row.committee,
      committeeId: row.committee_id,
      sector: parseSector(row),
      start: row.date_range_start,
      end: row.date_range_end,
      duration: row.duration,
      url: row.ad_url,
      tags: adTags,
      rollups: getRollups(
        codebook.filter((entry) => adTags.includes(entry.tag)),
      ),
      transcript: row.transcript,
      spans: parseSpans(row, adTags),
      supports: row.supports || null,
      opposes: row.opposes || null,
      supportsParty: getCandidateParty(elections, row.race, row.supports),
      opposesParty: getCandidateParty(elections, row.race, row.opposes),
      stances: parseStances(row, stanceTags),
      scriptFamily: row.script_family || null,
      scriptTemplate: row.script_template || null,
      network: getNetworkName(committee),
      party: getParty(committee, row),
      video: videos.get(row.ad_id) ?? null,
    };
  });
});
