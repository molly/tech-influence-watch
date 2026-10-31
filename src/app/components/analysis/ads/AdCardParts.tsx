import Link from "next/link";
import { Fragment } from "react";

import RehostedAdVideo from "@/app/components/RehostedAdVideo";
import { getNetworkIdByName } from "@/app/data/networks";
import { AdParty, TaggedAd } from "@/app/types/AdAnalysis";
import { Party } from "@/app/types/Elections";
import { Sector } from "@/app/types/Sector";
import {
  AD_PARTY_LABELS,
  AD_PARTY_SHORT_LABELS,
  adLibraryHref,
  formatAdDateRange,
  getSpanExcerpts,
  splitSentences,
  TranscriptExcerpt,
} from "@/app/utils/adAnalysis";
import { getFullPartyName, getPartyAbbreviation } from "@/app/utils/party";

import styles from "./Ads.module.css";

// A network's name, linked to its page when it has one.
export function NetworkLink({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const id = getNetworkIdByName(name);
  if (!id) {
    return <>{name}</>;
  }
  return (
    <Link href={`/2026/networks/${id}`} className={className}>
      {name}
    </Link>
  );
}

const SWATCH_CLASSES: Record<AdParty, string> = {
  dem: styles.swatchDem,
  rep: styles.swatchRep,
  both: styles.swatchBoth,
};

export function PartySwatch({ party }: { party: AdParty | null }) {
  if (!party) {
    return null;
  }
  return (
    <span
      className={`${styles.swatch} ${SWATCH_CLASSES[party]}`}
      title={AD_PARTY_LABELS[party]}
    />
  );
}

export function PartyTag({ party }: { party: AdParty | null }) {
  if (!party) {
    return null;
  }
  return (
    <span className={styles.partyTag}>
      <PartySwatch party={party} />
      {AD_PARTY_SHORT_LABELS[party]}
    </span>
  );
}

const CANDIDATE_SWATCH_CLASSES: Record<Party, string> = {
  [Party.Democratic]: styles.swatchDem,
  [Party.Republican]: styles.swatchRep,
  [Party.Libertarian]: styles.swatchLib,
  [Party.Green]: styles.swatchGreen,
  [Party.Independent]: styles.swatchInd,
  [Party.Nonpartisan]: styles.swatchUnknown,
};

// A candidate's party, as "Dem.", "Rep.", "Ind." and so on.
export function CandidatePartyTag({ party }: { party: Party | null }) {
  if (!party) {
    return null;
  }
  return (
    <span className={styles.partyTag}>
      <span
        className={`${styles.swatch} ${CANDIDATE_SWATCH_CLASSES[party]}`}
        title={getFullPartyName(party, false)}
      />
      {getPartyAbbreviation(party)}.
    </span>
  );
}

/**
 * Wrap every match of `pattern` in <mark>. The pattern must be global.
 */
export function highlightMatches(
  text: string,
  pattern: RegExp | null,
): React.ReactNode {
  if (!pattern) {
    return text;
  }
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (match[0].length === 0) {
      continue;
    }
    parts.push(text.slice(last, index));
    parts.push(<mark key={index}>{match[0]}</mark>);
    last = index + match[0].length;
  }
  parts.push(text.slice(last));
  return parts;
}

/**
 * text.slice(start, end) with each [from, to) range in `highlights` in <mark>,
 * and search matches marked in the text between them.
 */
export function highlightRanges(
  text: string,
  start: number,
  end: number,
  highlights: [number, number][],
  search: RegExp | null,
): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let cursor = start;
  for (const [from, to] of highlights) {
    parts.push(
      <Fragment key={`text-${cursor}`}>
        {highlightMatches(text.slice(cursor, from), search)}
      </Fragment>,
      <mark key={from}>{text.slice(from, to)}</mark>,
    );
    cursor = to;
  }
  parts.push(
    <Fragment key={`text-${cursor}`}>
      {highlightMatches(text.slice(cursor, end), search)}
    </Fragment>,
  );
  return parts;
}

/**
 * The quoted parts of a transcript, with "…" wherever text is left out.
 */
export function TranscriptExcerpts({
  transcript,
  excerpts,
  search,
}: {
  transcript: string;
  excerpts: TranscriptExcerpt[];
  search: RegExp | null;
}) {
  const last = excerpts[excerpts.length - 1];
  return (
    <>
      “{excerpts[0].start > 0 && "… "}
      {excerpts.map((excerpt, i) => {
        const gap =
          i > 0 ? transcript.slice(excerpts[i - 1].end, excerpt.start) : "";
        return (
          <Fragment key={excerpt.start}>
            {gap.trim() ? " … " : gap}
            {highlightRanges(
              transcript,
              excerpt.start,
              excerpt.end,
              excerpt.highlights,
              search,
            )}
          </Fragment>
        );
      })}
      {transcript.slice(last.end).trim() && " …"}”
    </>
  );
}

export function AdVideoBox({
  ad,
  className,
}: {
  ad: TaggedAd;
  className?: string;
}) {
  if (ad.video) {
    return (
      <div className={`${styles.videoBox} ${className ?? ""}`}>
        <RehostedAdVideo video={ad.video} name={ad.committee} />
      </div>
    );
  }
  return (
    <div className={`${styles.videoBox} ${styles.noVideo} ${className ?? ""}`}>
      <span>{ad.duration} · video not archived</span>
    </div>
  );
}

export function AdMeta({ ad }: { ad: TaggedAd }) {
  return (
    <>
      {formatAdDateRange(ad.start, ad.end)} · {ad.duration}
    </>
  );
}

/**
 * A video with the committee and one quoted line, for showing a handful of
 * ads side by side.
 */
// Quotes the tagged `spans` when given, with the tagged words marked;
// otherwise `quote`, or the transcript's first sentence.
export function AdVideoCard({
  ad,
  sector,
  quote,
  spans,
}: {
  ad: TaggedAd;
  sector: Sector;
  quote?: string;
  spans?: [number, number][];
}) {
  return (
    <div className={styles.videoCard}>
      <AdVideoBox ad={ad} />
      <div className={styles.videoCardWho}>
        <PartySwatch party={ad.party} />
        {ad.committee}
      </div>
      {spans?.length ? (
        <span className={styles.videoCardQuote}>
          <TranscriptExcerpts
            transcript={ad.transcript}
            excerpts={getSpanExcerpts(ad.transcript, spans)}
            search={null}
          />
        </span>
      ) : (
        <q className={styles.videoCardQuote}>
          {quote ?? splitSentences(ad.transcript)[0]}
        </q>
      )}
      <div className={styles.meta}>
        {ad.race} · <AdMeta ad={ad} />
      </div>
      <Link
        className={styles.smallLink}
        href={adLibraryHref(sector, { id: ad.id })}
      >
        Transcript and tags →
      </Link>
    </div>
  );
}
