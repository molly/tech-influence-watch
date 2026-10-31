"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import sharedStyles from "@/app/shared.module.css";
import { AdParty, CodebookEntry, TaggedAd } from "@/app/types/AdAnalysis";
import { Sector } from "@/app/types/Sector";
import {
  AD_PARTY_LABELS,
  AD_SECTOR_LABELS,
  AdLibraryParams,
  describeCommittee,
  entryForSector,
  getFilterSpans,
  getRollups,
  getSpanExcerpts,
  groupByCommittee,
  hasRollup,
  hasTag,
  matchesTagFilter,
  NO_NETWORK_LABEL,
} from "@/app/utils/adAnalysis";
import { pluralize } from "@/app/utils/humanize";
import { getRaceHeadline } from "@/app/utils/races";

import {
  AdMeta,
  AdVideoBox,
  CandidatePartyTag,
  highlightRanges,
  NetworkLink,
  TranscriptExcerpts,
} from "./AdCardParts";
import styles from "./Ads.module.css";

const PAGE_SIZE = 24;
// Transcripts longer than this are clamped until expanded.
const LONG_TRANSCRIPT = 420;

type Sort = "new" | "race";

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function AdLibrary({
  ads,
  codebook,
  sector,
  initial,
}: {
  ads: TaggedAd[];
  codebook: CodebookEntry[];
  sector: Sector;
  initial: AdLibraryParams;
}) {
  const [network, setNetwork] = useState(initial.net ?? "");
  const [party, setParty] = useState(initial.party ?? "");
  const [committee, setCommittee] = useState(initial.cm ?? "");
  const [tag, setTag] = useState(initial.tag ?? "");
  const [query, setQuery] = useState(initial.q ?? "");
  const [sort, setSort] = useState<Sort>("new");
  const [shown, setShown] = useState(PAGE_SIZE);
  const [open, setOpen] = useState<Set<string>>(
    new Set(initial.id ? [initial.id] : []),
  );
  const [preview, setPreview] = useState<{ id: string; tag: string } | null>(
    null,
  );
  const linkedAd = useRef<HTMLElement>(null);

  const committees = useMemo(() => groupByCommittee(ads), [ads]);
  // Tag labels as worded for the page's sector, and for each ad's own.
  const labelsBySector = useMemo(
    () =>
      Object.fromEntries(
        (["all", "crypto", "ai"] as Sector[]).map((s) => [
          s,
          Object.fromEntries(
            codebook.map((entry) => [
              entry.tag,
              entryForSector(entry, s).label,
            ]),
          ),
        ]),
      ) as Record<Sector, Record<string, string>>,
    [codebook],
  );
  const labelsFor = (s: Sector) => labelsBySector[s];
  const labels = labelsFor(sector);
  const networks = [...new Set(committees.map((c) => c.network))];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = ads.filter(
      (ad) =>
        (!network || (ad.network ?? "none") === network) &&
        (!party || ad.party === party) &&
        (!committee || ad.committeeId === committee) &&
        (!tag || matchesTagFilter(ad, tag)) &&
        (!q ||
          `${ad.transcript} ${ad.race} ${ad.committee}`
            .toLowerCase()
            .includes(q)),
    );
    if (sort === "new") {
      list.sort((a, b) => b.end.localeCompare(a.end));
    } else {
      list.sort(
        (a, b) =>
          a.race.localeCompare(b.race) || a.start.localeCompare(b.start),
      );
    }
    return list;
  }, [ads, network, party, committee, tag, query, sort]);

  // Make sure an ad linked to by id is on the page, then bring it into view.
  const linkedIndex = initial.id
    ? filtered.findIndex((ad) => ad.id === initial.id)
    : -1;
  const visible = filtered.slice(0, Math.max(shown, linkedIndex + 1));
  useEffect(() => {
    linkedAd.current?.scrollIntoView({ block: "start" });
  }, []);

  const highlight =
    query.trim().length > 1
      ? new RegExp(escapeRegExp(query.trim()), "gi")
      : null;

  const reset = () => setShown(PAGE_SIZE);
  const toggleOpen = (id: string) => {
    const next = new Set(open);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setOpen(next);
  };

  return (
    <section>
      <div className={styles.libraryControls}>
        <label>
          <span className={styles.controlLabel}>Network</span>
          <select
            value={network}
            onChange={(e) => {
              setNetwork(e.target.value);
              reset();
            }}
          >
            <option value="">All networks</option>
            {networks.map((n) => (
              <option key={n ?? "none"} value={n ?? "none"}>
                {n ?? NO_NETWORK_LABEL}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className={styles.controlLabel}>Committee party</span>
          <select
            value={party}
            onChange={(e) => {
              setParty(e.target.value);
              reset();
            }}
          >
            <option value="">All parties</option>
            {(["rep", "dem", "both"] as AdParty[]).map((p) => (
              <option key={p} value={p}>
                {AD_PARTY_LABELS[p]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className={styles.controlLabel}>Committee</span>
          <select
            value={committee}
            onChange={(e) => {
              setCommittee(e.target.value);
              reset();
            }}
          >
            <option value="">All committees</option>
            {committees.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className={styles.controlLabel}>Tag</span>
          <select
            value={tag}
            onChange={(e) => {
              setTag(e.target.value);
              reset();
            }}
          >
            <option value="">Any tag</option>
            <optgroup label="Combined">
              {getRollups(codebook).map((rollup) => {
                const count = ads.filter((ad) => hasRollup(ad, rollup)).length;
                return count ? (
                  <option key={rollup} value={rollup}>
                    Any {rollup} ({count})
                  </option>
                ) : null;
              })}
            </optgroup>
            {[...new Set(codebook.map((entry) => entry.group))].map((group) => {
              const entries = codebook
                .filter((entry) => entry.group === group)
                .map((entry) => ({
                  ...entryForSector(entry, sector),
                  count: ads.filter((ad) => hasTag(ad, entry.tag)).length,
                }))
                .filter((entry) => entry.count);
              if (!entries.length) {
                return null;
              }
              return (
                <optgroup key={group} label={group}>
                  {entries.map((entry) => (
                    <option key={entry.tag} value={entry.tag}>
                      {entry.label} ({entry.count})
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>
        </label>
        <label>
          <span className={styles.controlLabel}>Search</span>
          <input
            type="search"
            value={query}
            placeholder="Candidate, word…"
            onChange={(e) => {
              setQuery(e.target.value);
              reset();
            }}
          />
        </label>
        <label>
          <span className={styles.controlLabel}>Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
          >
            <option value="new">Newest first</option>
            <option value="race">Race</option>
          </select>
        </label>
        <span className={styles.libraryCount}>
          {pluralize(filtered.length, "ad", { includeValue: true })}
        </span>
      </div>

      {visible.length === 0 ? (
        <p className={styles.note}>No ads match these filters.</p>
      ) : (
        <div className={styles.libraryAds}>
          {visible.map((ad) => {
            const isOpen = open.has(ad.id);
            const isLong = ad.transcript.length > LONG_TRANSCRIPT;
            const filterSpans = tag ? getFilterSpans(ad, tag, codebook) : [];
            const role = describeCommittee(ad);
            // Filtering by a tag the ad has spans for shows just those parts
            // until it's expanded.
            const showExcerpts = filterSpans.length > 0 && !isOpen;
            // Hovering or focusing a tag highlights its spans in the full
            // transcript. Highlighting doesn't change the layout, so the tag
            // stays under the pointer; swapping excerpts in would move it.
            const highlights =
              preview?.id === ad.id && !showExcerpts
                ? ad.spans[preview.tag]
                : filterSpans;
            return (
              <article
                key={ad.id}
                id={`ad-${ad.id}`}
                className={styles.libraryAd}
                ref={ad.id === initial.id ? linkedAd : undefined}
              >
                <div className={styles.libraryAdMedia}>
                  <AdVideoBox ad={ad} />
                  <div className={styles.meta}>
                    <AdMeta ad={ad} />
                  </div>
                </div>
                <div className={styles.libraryAdBody}>
                  <div className={styles.libraryAdHeader}>
                    <div className={styles.libraryAdHead}>
                      <span className={styles.race}>
                        {getRaceHeadline(ad.race)}
                      </span>
                      {(
                        [
                          ["Supports", ad.supports, ad.supportsParty],
                          ["Opposes", ad.opposes, ad.opposesParty],
                        ] as const
                      ).map(
                        ([verb, name, party]) =>
                          name && (
                            <span
                              key={verb}
                              className={styles.libraryAdCandidate}
                            >
                              {verb}{" "}
                              <Link
                                className="bold"
                                href={`/2026/elections/${ad.race}`}
                              >
                                {name}
                              </Link>{" "}
                              <CandidatePartyTag party={party} />
                            </span>
                          ),
                      )}
                    </div>
                    <div className={styles.libraryAdBy}>
                      <span className={styles.libraryAdByLabel}>Ad by</span>
                      <Link
                        className={styles.libraryAdCommittee}
                        href={`/2026/committees/${ad.committeeId}`}
                      >
                        {ad.committee}
                      </Link>
                      <span className={styles.libraryAdCommitteeMeta}>
                        {role && (
                          <span className={styles.libraryAdCommitteeRole}>
                            ({role.role}
                            {role.network && (
                              <>
                                {" "}
                                <NetworkLink name={role.network} />
                              </>
                            )}
                            )
                          </span>
                        )}
                        <span
                          className={`${sharedStyles.sectorBadge} ${styles.libraryAdBadge}`}
                        >
                          {AD_SECTOR_LABELS[ad.sector]}
                        </span>
                      </span>
                    </div>
                  </div>
                  {showExcerpts ? (
                    <div className={styles.excerpts}>
                      <span className={styles.excerptLabel}>
                        On {labels[tag] ?? tag}
                      </span>
                      <p className={styles.transcript}>
                        <TranscriptExcerpts
                          transcript={ad.transcript}
                          excerpts={getSpanExcerpts(ad.transcript, filterSpans)}
                          search={highlight}
                        />
                      </p>
                    </div>
                  ) : (
                    <p
                      className={`${styles.transcript} ${
                        isLong && !isOpen ? styles.transcriptClamped : ""
                      }`}
                    >
                      “
                      {highlightRanges(
                        ad.transcript,
                        0,
                        ad.transcript.length,
                        highlights,
                        highlight,
                      )}
                      ”
                    </p>
                  )}
                  <div className={styles.libraryAdTags}>
                    {ad.stances.length > 0 && (
                      <span className={styles.stanceLabel}>
                        {ad.stances
                          .map((s) => labelsFor(ad.sector)[s])
                          .join(", ")}{" "}
                        ·
                      </span>
                    )}
                    {ad.tags
                      .filter((t) => !ad.stances.includes(t))
                      .map((t) => {
                        const hasSpans = Boolean(ad.spans[t]);
                        const showPreview = () => {
                          if (hasSpans) {
                            setPreview({ id: ad.id, tag: t });
                          }
                        };
                        return (
                          <button
                            key={t}
                            type="button"
                            aria-pressed={t === tag}
                            className={`${styles.tag} ${
                              t === tag ? styles.tagActive : ""
                            } ${t === "mentions_industry" ? styles.tagIndustry : ""} ${
                              hasSpans ? styles.tagHasSpans : ""
                            }`}
                            onClick={() => {
                              setTag(t === tag ? "" : t);
                              reset();
                            }}
                            onMouseEnter={showPreview}
                            onFocus={showPreview}
                            onMouseLeave={() => setPreview(null)}
                            onBlur={() => setPreview(null)}
                          >
                            {labelsFor(ad.sector)[t]}
                          </button>
                        );
                      })}
                  </div>
                  <div className={styles.libraryAdLinks}>
                    {(isLong || filterSpans.length > 0) && (
                      <button
                        type="button"
                        className={styles.textButton}
                        onClick={() => toggleOpen(ad.id)}
                        aria-expanded={isOpen}
                      >
                        {isOpen ? "Show less" : "Full transcript"}
                      </button>
                    )}
                    <a href={ad.url} target="_blank" rel="noopener noreferrer">
                      View on Google →
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
      {filtered.length > visible.length && (
        <div className={styles.more}>
          <button
            type="button"
            className={styles.moreButton}
            onClick={() => setShown(visible.length + PAGE_SIZE)}
          >
            Show {Math.min(PAGE_SIZE, filtered.length - visible.length)} more of{" "}
            {filtered.length - visible.length}
          </button>
        </div>
      )}
    </section>
  );
}
