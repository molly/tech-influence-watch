import { AdVideo } from "./Ads";
import { Party } from "./Elections";
import { Sector } from "./Sector";

// Every super PAC whose ads we tag is either a crypto or an AI committee.
export type AdSector = Exclude<Sector, "all">;

// The side a committee spends for. Network lead committees ("both") spend for
// both parties.
export type AdParty = "dem" | "rep" | "both";

// One row of transcripts_enriched.csv: a Google ad that has been transcribed
// and hand-tagged against the codebook.
export type TaggedAd = {
  id: string;
  race: string;
  committee: string;
  committeeId: string;
  sector: AdSector;
  start: string;
  end: string;
  duration: string;
  url: string;
  tags: string[];
  // Codebook rollups (e.g. "attack", "economy") that any of the ad's tags
  // count toward.
  rollups: string[];
  transcript: string;
  // The parts of the transcript that earned each tag, as [start, end)
  // character offsets in transcript order. Optional per tag: tags that come
  // from visuals or on-screen text have none.
  spans: Record<string, [number, number][]>;
  // The candidate the ad backs and the one it attacks, as named in the
  // race's data. A contrast ad has both; an issue ad may have neither.
  supports: string | null;
  opposes: string | null;
  // The parties of those candidates, from the race data.
  supportsParty: Party | null;
  opposesParty: Party | null;
  // The ad's "industry stance" tags, in codebook order. At least one on ads
  // that mention tech, none otherwise.
  stances: string[];
  // Display name of the committee's network, or null for committees
  // outside a network.
  network: string | null;
  party: AdParty | null;
  video: AdVideo | null;
};

export type CodebookEntry = {
  tag: string;
  label: string;
  group: string;
  // Optional: some labels, like "Trump endorsed", explain themselves.
  definition: string | null;
  // Broader categories this tag counts toward. One tag can be in several, e.g.
  // drug_prices is in both "economy" and "health".
  rollups: string[];
};
