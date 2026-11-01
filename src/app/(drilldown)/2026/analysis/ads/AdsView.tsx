import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import {
  AdVideoCard,
  NetworkLink,
} from "@/app/components/analysis/ads/AdCardParts";
import adStyles from "@/app/components/analysis/ads/Ads.module.css";
import IndustryStances, {
  StanceColumn,
} from "@/app/components/analysis/ads/IndustryStances";
import NetworkArms, {
  getNetworkArmPairs,
} from "@/app/components/analysis/ads/NetworkArms";
import TagHeatmap from "@/app/components/analysis/ads/TagHeatmap";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import Skeleton from "@/app/components/skeletons/Skeleton";
import sharedStyles from "@/app/shared.module.css";
import { AdSector, CodebookEntry, TaggedAd } from "@/app/types/AdAnalysis";
import { Party } from "@/app/types/Elections";
import { Sector } from "@/app/types/Sector";
import {
  AD_SECTOR_LABELS,
  adLibraryHref,
  adMatchesSector,
  adSectorsForView,
  CommitteeAds,
  entryForSector,
  formatAdDateRange,
  getSpanExcerpts,
  groupByCommittee,
  hasTag,
  INDUSTRY_WORD,
  LEANING_LABELS,
  LEANING_ORDER,
  leaningPosition,
  mentionsIndustry,
  mentionsTech,
  STANCE_LEANINGS,
  stanceEntries,
  stanceLeanings,
  themeEntries,
} from "@/app/utils/adAnalysis";
import { getCodebook, getTaggedAds } from "@/app/utils/adAnalysisData";
import {
  humanizeList,
  humanizeNumber,
  humanizeOneIn,
  humanizePercentage,
  pluralize,
} from "@/app/utils/humanize";
import { customMetadata } from "@/app/utils/metadata";
import { humanizeSector, sectorHref } from "@/app/utils/sector";
import { sentenceCase } from "@/app/utils/titlecase";

import styles from "./page.module.css";

// How the sectors are named in the metadata description, written out and
// abbreviated.
const SECTOR_NAMES: Record<AdSector, { long: string; short: string }> = {
  crypto: { long: "crypto", short: "crypto" },
  ai: { long: "artificial intelligence", short: "AI" },
};

export async function adsMetadata(sector: Sector): Promise<Metadata> {
  const ads = (await getTaggedAds()).filter((ad) =>
    adMatchesSector(ad.sector, sector),
  );
  const committees = groupByCommittee(ads).length;
  const races = new Set(ads.map((ad) => ad.race)).size;
  const names = adSectorsForView(sector).map((s) => SECTOR_NAMES[s]);
  return customMetadata({
    title: `${humanizeSector(sector, { abbrev: true })} super PAC ads`,
    description: `Tech Influence Watch has transcribed and tagged ${pluralize(
      ads.length,
      "ad",
      { includeValue: true },
    )} from ${humanizeNumber(committees)} ${names
      .map((n) => n.long)
      .join(" and ")} ${pluralize(committees, "PAC")} across ${pluralize(
      races,
      "race",
      { includeValue: true },
    )}. ${sentenceCase(
      humanizeOneIn(count(ads, mentionsIndustry), ads.length),
    )} ads from ${names
      .map((n) => n.short)
      .join(" or ")} PACs mention the industry paying for them.`,
  });
}

function count(ads: TaggedAd[], predicate: (ad: TaggedAd) => boolean) {
  return ads.filter(predicate).length;
}

// A committee's name, linked to its page when it's among the committees with
// tagged ads.
function CommitteeLink({
  committees,
  name,
}: {
  committees: CommitteeAds[];
  name: string;
}) {
  const committee = committees.find((c) => c.name === name);
  if (!committee) {
    return <>{name}</>;
  }
  return <Link href={`/2026/committees/${committee.id}`}>{name}</Link>;
}

function Lede({
  sector,
  ads,
  committees,
}: {
  sector: Sector;
  ads: TaggedAd[];
  committees: CommitteeAds[];
}) {
  const crypto = ads.filter((ad) => ad.sector === "crypto");
  const cryptoMentions = count(crypto, mentionsIndustry);

  if (sector === "crypto") {
    const crossParty = crossPartyMention(crypto);
    const fairShake = crypto.filter((ad) => ad.network === "FairShake");
    const all = crossParty && humanizeNumber(crossParty.mentioned.length);
    return (
      <p className={styles.lede}>
        <span className="bold">
          Only {humanizeNumber(cryptoMentions)} of the {crypto.length} ads run
          by crypto super PACs this cycle{" "}
          {pluralize(cryptoMentions, "mentions", { plural: "mention" })} crypto.
        </span>
        {crossParty && (
          <>
            {" "}
            All {all} come from{" "}
            <Link href={`/2026/committees/${crossParty.committeeId}`}>
              {crossParty.committee}
            </Link>
            , a Republican-aligned group, and all {all} back Democrats.
          </>
        )}
        {fairShake.length > 0 && !fairShake.some(mentionsIndustry) && (
          <>
            {" "}
            <NetworkLink name="FairShake" />, the biggest crypto PAC network,
            never mentions crypto at all. Its two partisan arms run nearly
            opposite campaigns: Trump endorsements and anti-immigration messages
            for Republicans, anti-MAGA and anti-ICE messages for Democrats.
          </>
        )}
      </p>
    );
  }

  if (sector === "ai") {
    const ai = ads.filter((ad) => ad.sector === "ai");
    const ltf = ads.filter((ad) => ad.network === "Leading the Future");
    const ltfMentions = count(ltf, mentionsIndustry);
    const publicFirstIssueAds = count(
      ads.filter((ad) => ad.network === "Public First"),
      (ad) => hasTag(ad, "issue_ad"),
    );
    return (
      <p className={styles.lede}>
        Tech Influence Watch tracks {ai.length} ads from AI super PACs.{" "}
        <span className="bold">
          <NetworkLink name="Leading the Future" /> mentions AI in{" "}
          {ltfMentions === 1
            ? `just one of its ${ltf.length} ads: an attack on a candidate for taking AI money`
            : `${humanizeNumber(ltfMentions)} of its ${ltf.length} ads`}
          .
        </span>{" "}
        Nearly all the AI mentions come from the{" "}
        <NetworkLink name="Public First" /> network, which is funded chiefly by
        Anthropic and says it wants stronger AI safety rules. Those include{" "}
        {humanizeNumber(publicFirstIssueAds)} &ldquo;call your
        representative&rdquo; issue {pluralize(publicFirstIssueAds, "ad")} and a
        campaign for Alex Bores in{" "}
        <Link href={sectorHref("/2026/elections/NY-H-12", sector)}>NY-12</Link>
        .{" "}
      </p>
    );
  }

  const races = new Set(ads.map((ad) => ad.race)).size;
  return (
    <p className={styles.lede}>
      Tech Influence Watch has transcribed and tagged {ads.length} ads from{" "}
      {humanizeNumber(committees.length)} crypto and artificial intelligence{" "}
      {pluralize(committees.length, "PAC")} across {races} races.{" "}
      <span className="bold">
        {sentenceCase(humanizeOneIn(count(ads, mentionsIndustry), ads.length))}{" "}
        ads from crypto or AI PACs mention the industry paying for them.
      </span>{" "}
      Instead, ads for Republican candidates feature Trump endorsements and
      promise tax cuts; ads for Democratic candidates promise lower costs and
      standing up to MAGA. Crypto PACs mention crypto in only{" "}
      <span className="bold">
        {cryptoMentions} of {crypto.length}
      </span>{" "}
      ads. AI PACs mention AI more often, but almost entirely the ones pushing
      for AI regulation.
    </p>
  );
}

// "3 of 11" and "27%" cells for a row of the stat card.
function StatCells({ ads }: { ads: TaggedAd[] }) {
  const mentions = count(ads, mentionsIndustry);
  return (
    <>
      <td className="number-cell bold">
        {mentions} of {ads.length}
      </td>
      <td className={`number-cell ${styles.statPct}`}>
        {humanizePercentage(mentions, ads.length)}
      </td>
    </>
  );
}

function StatCard({
  sector,
  ads,
  committees,
}: {
  sector: Sector;
  ads: TaggedAd[];
  committees: CommitteeAds[];
}) {
  const what =
    sector === "crypto" ? "crypto" : sector === "ai" ? "AI" : "their industry";
  // One group per sector in the combined view. On a sector's page, the
  // committees grouped under their networks, which groupByCommittee already
  // keeps together; committees outside a network go last, with no header.
  const groups: {
    key: string;
    label: React.ReactNode;
    rows: { key: string; label: string; href?: string; ads: TaggedAd[] }[];
  }[] =
    sector === "all"
      ? [
          {
            key: "all",
            label: null,
            rows: adSectorsForView(sector).map((s) => ({
              key: s,
              label: `${AD_SECTOR_LABELS[s]} PACs`,
              ads: ads.filter((ad) => ad.sector === s),
            })),
          },
        ]
      : [...new Set(committees.map((c) => c.network))].map((network) => ({
          key: network ?? "none",
          label: network && (
            <NetworkLink name={network} className="unstyled-no-underline" />
          ),
          rows: committees
            .filter((c) => c.network === network)
            .map((c) => ({
              key: c.id,
              label: c.name,
              href: `/2026/committees/${c.id}`,
              ads: c.ads,
            })),
        }));
  return (
    <div className={`${sharedStyles.smallCard} ${styles.statCard}`}>
      <div className={sharedStyles.moneyCardHeader}>
        Ads that mention {what}
      </div>
      <div className={styles.statValue}>
        {count(ads, mentionsIndustry)}{" "}
        <span className={styles.statOf}>of {ads.length}</span>
      </div>
      <table className={styles.statTable}>
        {groups.map((group) => (
          <tbody
            key={group.key}
            className={group.label ? undefined : styles.statUngrouped}
          >
            {group.label && (
              <tr className={styles.statGroupRow}>
                <th scope="rowgroup">{group.label}</th>
                <StatCells ads={group.rows.flatMap((row) => row.ads)} />
              </tr>
            )}
            {group.rows.map((row) => (
              <tr key={row.key}>
                <td className={group.label ? styles.statIndented : undefined}>
                  {row.href ? (
                    <Link href={row.href} className="unstyled-no-underline">
                      {row.label}
                    </Link>
                  ) : (
                    row.label
                  )}
                </td>
                <StatCells ads={row.ads} />
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}

// "Jim Kingston (R)", or just the name when the race data has no party.
function withParty(name: string, party: Party | null): string {
  return party ? `${name} (${party})` : name;
}

// "Supports X (R)", "Opposes Y (D)" or "Supports X (R), opposes Y (D)".
function describeCandidates(ad: TaggedAd): string | null {
  const supports = ad.supports && withParty(ad.supports, ad.supportsParty);
  const opposes = ad.opposes && withParty(ad.opposes, ad.opposesParty);
  if (supports && opposes) {
    return `Supports ${supports}, opposes ${opposes}`;
  }
  if (supports) {
    return `Supports ${supports}`;
  }
  if (opposes) {
    return `Opposes ${opposes}`;
  }
  return null;
}

// When every ad that names the industry comes from one Republican committee's
// ads for Democrats, and none of its ads for Republicans do, that committee
// and its ads.
function crossPartyMention(sectorAds: TaggedAd[]) {
  const mentioned = sectorAds.filter(mentionsIndustry);
  const committees = new Set(mentioned.map((ad) => ad.committee));
  if (mentioned.length < 2 || committees.size !== 1) {
    return null;
  }
  const committee = mentioned[0].committee;
  const forRepublicans = sectorAds.filter(
    (ad) => ad.committee === committee && ad.supportsParty === Party.Republican,
  );
  if (
    mentioned[0].party !== "rep" ||
    !mentioned.every((ad) => ad.supportsParty === Party.Democratic) ||
    forRepublicans.length === 0 ||
    forRepublicans.some(mentionsIndustry)
  ) {
    return null;
  }
  return {
    committee,
    committeeId: mentioned[0].committeeId,
    mentioned,
    forRepublicans,
  };
}

// The stance column's note on crossPartyMention, if it applies.
function crossPartyMentionNote(
  sectorAds: TaggedAd[],
  sector: AdSector,
): React.ReactNode {
  const crossParty = crossPartyMention(sectorAds);
  if (!crossParty) {
    return null;
  }
  const { committee, committeeId, mentioned, forRepublicans } = crossParty;
  const all = humanizeNumber(mentioned.length);
  return (
    <>
      <span className="bold">
        All {all} ads that mention crypto come from{" "}
        <Link href={`/2026/committees/${committeeId}`}>{committee}</Link>, a
        Republican-aligned group, but all {all} back Democrats.
      </span>{" "}
      {committee}&rsquo;s{" "}
      {pluralize(forRepublicans.length, "ad", {
        includeValue: true,
        humanize: true,
      })}{" "}
      for Republicans never{" "}
      {pluralize(forRepublicans.length, "mentions", { plural: "mention" })}{" "}
      {INDUSTRY_WORD[sector]}.
    </>
  );
}

function stanceColumns(
  ads: TaggedAd[],
  sector: Sector,
  stances: CodebookEntry[],
): StanceColumn[] {
  const stanceOrder = stances.map((stance) => stance.tag);
  return adSectorsForView(sector)
    .map((s) => {
      const sectorAds = ads.filter((ad) => ad.sector === s);
      const sectorStances = stances.map((stance) => entryForSector(stance, s));
      const mention = (
        ad: TaggedAd,
      ): StanceColumn["dots"][number]["mention"] =>
        mentionsIndustry(ad) ? "industry" : mentionsTech(ad) ? "tech" : null;
      // From favorable to critical, with an ad whose stances lean two ways
      // sorted between them, then ads that don't mention tech at all. Within
      // each, ads with the same stance sit together, so hovering a stance
      // lights up one run of squares; industry mentions come before ads that
      // only mention tech.
      const mentionOrder = ["industry", "tech", null];
      const position = (ad: TaggedAd) =>
        leaningPosition(stanceLeanings(ad.stances));
      const sorted = [...sectorAds].sort(
        (a, b) =>
          position(a) - position(b) ||
          stanceLeanings(a.stances).length - stanceLeanings(b.stances).length ||
          stanceOrder.indexOf(a.stances[0] ?? "") -
            stanceOrder.indexOf(b.stances[0] ?? "") ||
          mentionOrder.indexOf(mention(a)) - mentionOrder.indexOf(mention(b)),
      );
      const stanceLabels = Object.fromEntries(
        sectorStances.map((stance) => [stance.tag, stance.label]),
      );
      return {
        key: s,
        title: `${AD_SECTOR_LABELS[s]} PACs`,
        word: INDUSTRY_WORD[s],
        total: sectorAds.length,
        note: crossPartyMentionNote(sectorAds, s),
        dots: sorted.map((ad) => {
          const spans = mentionsIndustry(ad)
            ? ad.spans.mentions_industry
            : mentionsTech(ad)
              ? ad.spans.mentions_tech
              : undefined;
          return {
            id: ad.id,
            stances: ad.stances,
            leanings: stanceLeanings(ad.stances),
            mention: mention(ad),
            quote: spans
              ? {
                  transcript: ad.transcript,
                  excerpts: getSpanExcerpts(ad.transcript, spans),
                }
              : null,
            candidates: describeCandidates(ad),
            committee: ad.committee,
            committeeId: ad.committeeId,
            race: ad.race,
            stanceLabels: ad.stances.map((stance) => stanceLabels[stance]),
          };
        }),
        groups: LEANING_ORDER.map((leaning) => {
          const groupStances = sectorStances.filter(
            (stance) => STANCE_LEANINGS[stance.tag] === leaning,
          );
          return {
            leaning,
            label: LEANING_LABELS[leaning],
            count: sectorAds.filter((ad) =>
              groupStances.some((stance) => ad.stances.includes(stance.tag)),
            ).length,
            rows: groupStances
              .map((stance) => {
                const stanceAds = sectorAds.filter((ad) =>
                  ad.stances.includes(stance.tag),
                );
                // Counted by network, or by committee for committees
                // outside one.
                const bySponsor = new Map<string, number>();
                for (const ad of stanceAds) {
                  const sponsor = ad.network ?? ad.committee;
                  bySponsor.set(sponsor, (bySponsor.get(sponsor) ?? 0) + 1);
                }
                return {
                  stance: stance.tag,
                  label: stance.label,
                  description: stance.definition,
                  count: stanceAds.length,
                  sponsors: [...bySponsor.entries()].sort(
                    (a, b) => b[1] - a[1],
                  ),
                };
              })
              .filter((row) => row.count > 0),
          };
        }).filter((group) => group.count > 0),
      };
    })
    .filter((column) => column.total > 0);
}

function IndustryMentions({
  ads,
  sector,
}: {
  ads: TaggedAd[];
  sector: Sector;
}) {
  // Only on a sector's own page, beside its single stance column. The AI view
  // looks at Leading the Future, the network that doesn't run issue ads about
  // AI.
  if (sector === "all") {
    return null;
  }
  const mentioned =
    sector === "ai"
      ? ads.filter(
          (ad) => ad.network === "Leading the Future" && mentionsIndustry(ad),
        )
      : ads.filter((ad) => mentionsIndustry(ad));
  if (mentioned.length === 0) {
    return null;
  }
  const committees = [...new Set(mentioned.map((ad) => ad.committee))];

  let heading;
  let note;
  if (sector === "ai") {
    const ltfCount = ads.filter(
      (ad) => ad.network === "Leading the Future",
    ).length;
    heading =
      mentioned.length === 1
        ? "The one time Leading the Future mentioned AI"
        : "Every time Leading the Future mentioned AI";

    note = (
      <>
        Of{" "}
        <Link href="/2026/networks/leading-the-future">
          Leading the Future&rsquo;s
        </Link>{" "}
        {ltfCount} ads, {humanizeNumber(mentioned.length)}{" "}
        {pluralize(mentioned.length, "mentions", { plural: "mention" })} AI or
        heavily AI-linked companies Palantir, whose surveillance software is
        built on AI. All {humanizeNumber(mentioned.length)} cast the industry
        negatively, even though Palantir co-founder{" "}
        <Link href="/2026/individuals/joe-lonsdale">Joe Lonsdale</Link> is among
        Leading the Future&rsquo;s backers.
      </>
    );
  } else {
    heading = "Every time crypto came up";
    note = (
      <>
        {mentioned.length === 1
          ? "The only crypto-PAC ad that mentions the industry, "
          : `All ${humanizeNumber(mentioned.length)} crypto-PAC ads that mention the industry, ${committees.length === 1 ? "all " : ""}`}
        from {humanizeList(committees)}.{" "}
        {mentioned.length === 1 ? "It gives" : "Each one gives"} it a single
        line near the end.
      </>
    );
  }

  // A grid cell styled like the stance column beside it.
  return (
    <div className={adStyles.stanceColumn}>
      <h3 className={adStyles.stanceTitle}>{heading}</h3>
      <p className={styles.sectionCopy}>{note}</p>
      <div className={adStyles.videoRow}>
        {mentioned.map((ad) => (
          <AdVideoCard
            key={ad.id}
            ad={ad}
            sector={sector}
            spans={ad.spans.mentions_industry}
          />
        ))}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className={sharedStyles.sectionTitle}>{children}</h2>;
}

async function AdsAnalysis({ sector }: { sector: Sector }) {
  const allAds = await getTaggedAds();
  const codebook = getCodebook();
  const themes = themeEntries(codebook);
  const ads = allAds.filter((ad) => adMatchesSector(ad.sector, sector));
  const committees = groupByCommittee(ads);
  const pairs = getNetworkArmPairs(committees);

  return (
    <>
      <section className={styles.hero}>
        <div>
          <Lede sector={sector} ads={ads} committees={committees} />
          <AdsScopeNote ads={allAds} codebookSize={codebook.length} />
        </div>
        <div>
          <StatCard sector={sector} ads={ads} committees={committees} />
          <Link className={styles.statLink} href={adLibraryHref(sector)}>
            Browse all {pluralize(ads.length, "ad", { includeValue: true })} and
            transcripts →
          </Link>
        </div>
      </section>

      <section className={styles.section}>
        <SectionTitle>Do the ads mention the industry?</SectionTitle>
        <IndustryStances
          columns={stanceColumns(ads, sector, stanceEntries(codebook))}
          sector={sector}
        >
          <IndustryMentions ads={ads} sector={sector} />
        </IndustryStances>
      </section>

      {pairs.length > 0 && (
        <section className={styles.section}>
          <SectionTitle>Telling each side what it wants to hear</SectionTitle>
          <p className={styles.sectionCopy}>
            The super PAC networks will run whatever message they think will win
            the race. Their Republican arms run ads about Trump&rsquo;s
            endorsement and &ldquo;illegals&rdquo;. The Democratic arms, funded
            by the same networks, run ads against MAGA and ICE.{" "}
            {humanizeSector(sector)} {sector === "all" ? "are" : "is"} rarely
            mentioned.
          </p>
          <NetworkArms pairs={pairs} themes={themes} sector={sector} />
        </section>
      )}

      <section className={styles.section}>
        <SectionTitle>What they talk about instead</SectionTitle>
        <p className={adStyles.note}>
          Each cell counts a committee&rsquo;s ads that carry the tag, shaded by
          share of that committee&rsquo;s ads. Hover a column label for its
          definition. Click any cell to open those ads in the ad library.
        </p>
        <TagHeatmap
          committees={committees}
          codebook={codebook}
          sector={sector}
        />
      </section>

      <section className={styles.section}>
        <SectionTitle>Read the ads</SectionTitle>
        <div className={styles.libraryCta}>
          <p className={adStyles.note}>
            Search and filter every tagged ad by network, party, committee, or
            theme.
          </p>
          <Link className={styles.libraryButton} href={adLibraryHref(sector)}>
            Open the ad library →
          </Link>
        </div>
      </section>
    </>
  );
}

// What the tracked ads cover. Pass every tagged ad, not just the sector's, so
// the date range matches across views.
export function AdsScopeNote({
  ads,
  codebookSize,
}: {
  ads: TaggedAd[];
  codebookSize: number;
}) {
  const firstDate = ads.map((ad) => ad.start).sort()[0];
  const lastDate = ads
    .map((ad) => ad.end)
    .sort()
    .reverse()[0];
  return (
    <div className={sharedStyles.noteCard}>
      <p>
        <span className={sharedStyles.noteLabel}>
          Not every ad these PACs ran is tracked.
        </span>{" "}
        These are ads from Google&rsquo;s Ads Transparency Center (YouTube,
        Search, display), {formatAdDateRange(firstDate, lastDate)},{" "}
        {lastDate.slice(0, 4)}. TV, streaming, mail, and other social platforms
        aren&rsquo;t included.
      </p>
      <p>
        Each ad is hand-tagged against a {codebookSize}
        -code{" "}
        <a
          href="https://github.com/molly/tech-influence-watch/blob/main/src/app/data/codebook.csv"
          target="_blank"
          rel="noopener noreferrer"
        >
          codebook
        </a>{" "}
        and can carry several tags. Ads are automatically transcribed and then
        hand-corrected, but some misspellings or errors may remain.
      </p>
    </div>
  );
}

function AdsAnalysisSkeleton() {
  return (
    <section className={styles.hero}>
      <div>
        <Skeleton height="1.1rem" width="90%" />
        <Skeleton height="1.1rem" width="80%" />
        <Skeleton height="1.1rem" width="60%" />
      </div>
      <Skeleton height="10rem" width="100%" />
    </section>
  );
}

export default function AdsView({ sector }: { sector: Sector }) {
  return (
    <>
      <div className={sharedStyles.fullWidthHeader}>
        <section className={sharedStyles.header}>
          <Breadcrumbs crumbs={["Analysis", "Political ads"]} />
          <h1 className={sharedStyles.title}>Political ads</h1>
        </section>
      </div>
      <div className={sharedStyles.main}>
        <Suspense fallback={<AdsAnalysisSkeleton />}>
          <AdsAnalysis sector={sector} />
        </Suspense>
      </div>
    </>
  );
}
