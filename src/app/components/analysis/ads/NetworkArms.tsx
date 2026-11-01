import Link from "next/link";

import { FEATURED_ARM_ADS, FeaturedAd } from "@/app/data/featuredAds";
import { getNetworkIdByName, NETWORKS } from "@/app/data/networks";
import sharedStyles from "@/app/shared.module.css";
import { CodebookEntry, TaggedAd } from "@/app/types/AdAnalysis";
import { Sector } from "@/app/types/Sector";
import {
  AD_SECTOR_LABELS,
  CommitteeAds,
  mergeRanges,
} from "@/app/utils/adAnalysis";
import { humanizePercentage, pluralize } from "@/app/utils/humanize";

import { AdVideoCard } from "./AdCardParts";
import styles from "./Ads.module.css";

// Themes that directly contradict each other, as [Democratic arm's tag,
// Republican arm's tag]. When each arm runs its side of a pair, the pair gets
// a row with each arm's share of its own side.
const CONTRADICTIONS: [string, string][] = [
  ["anti_maga", "anti_left"],
  ["anti_maga", "trump_endorsed"],
  ["ice", "border_immigration"],
];

function runLength(ad: TaggedAd): number {
  return Date.parse(ad.end) - Date.parse(ad.start);
}

// The themes each arm's featured ad should show, and quote from.
const ARM_TAGS = {
  dem: ["anti_maga", "stand_up_to_trump"],
  rep: ["trump_endorsed", "trump_aligned"],
};

// The ad handpicked in data/featuredAds, or else the longest-running ad with
// one of the tags, or else the longest-running ad.
function pickAd(
  committee: CommitteeAds,
  tags: string[],
  featured: FeaturedAd | undefined,
): TaggedAd {
  if (featured) {
    const ad = committee.ads.find((ad) => ad.id === featured.id);
    if (!ad) {
      throw new Error(
        `Featured ad ${featured.id} in data/featuredAds isn't one of ${committee.name}'s tagged ads`,
      );
    }
    return ad;
  }
  const byRun = [...committee.ads].sort((a, b) => runLength(b) - runLength(a));
  return (
    byRun.find((ad) => tags.some((tag) => ad.tags.includes(tag))) ?? byRun[0]
  );
}

// The passages to quote: those tagged with the tags chosen in
// data/featuredAds, or else with any of the arm's tags.
function quoteSpans(
  ad: TaggedAd,
  armTags: string[],
  featured: FeaturedAd | undefined,
): [number, number][] {
  const chosen = featured?.tags;
  const missing = chosen?.filter((tag) => !ad.spans[tag]?.length);
  if (missing?.length) {
    throw new Error(
      `Featured ad ${ad.id} in data/featuredAds has no tagged passages for ${missing.join(", ")}`,
    );
  }
  return mergeRanges((chosen ?? armTags).flatMap((tag) => ad.spans[tag] ?? []));
}

// Tags counted as another tag in this chart: Trump-aligned joins Trump
// endorsed, and Stand up to Trump joins Anti-MAGA. An ad with both tags of a
// group counts once.
const TAG_ALIASES: Record<string, string> = {
  trump_aligned: "trump_endorsed",
  stand_up_to_trump: "anti_maga",
};

// On the Republican side, ICE also counts as border security: the ICE tag
// applies to mentions in either direction, and a Republican ad that names ICE
// counts as border security.
const REP_TAG_ALIASES: Record<string, string> = {
  ...TAG_ALIASES,
  ice: "border_immigration",
};

// Labels for tags that stand for more than themselves in this chart, or that
// take a side here. The codebook's ICE tag covers mentions in either
// direction, but only Democratic ads count as ICE here (see REP_TAG_ALIASES).
const LABELS: Record<string, string> = {
  trump_endorsed: "Trump-aligned",
  anti_maga: "Anti-Trump",
  ice: "Anti-ICE",
  border_immigration: "Anti-immigration",
};

// tagShare with each ad's tags mapped through `aliases`.
function aliasedShare(
  ads: TaggedAd[],
  tag: string,
  aliases: Record<string, string>,
): number {
  if (ads.length === 0) {
    return 0;
  }
  return (
    ads.filter((ad) => ad.tags.some((t) => (aliases[t] ?? t) === tag)).length /
    ads.length
  );
}

function pct(share: number) {
  return humanizePercentage(share, 1);
}

function DivergingThemes({
  dem,
  rep,
  themes,
}: {
  dem: CommitteeAds;
  rep: CommitteeAds;
  themes: CodebookEntry[];
}) {
  const demShare = (tag: string) => aliasedShare(dem.ads, tag, TAG_ALIASES);
  const repShare = (tag: string) => aliasedShare(rep.ads, tag, REP_TAG_ALIASES);
  const labelFor = (tag: string) =>
    LABELS[tag] ?? themes.find((theme) => theme.tag === tag)?.label ?? tag;
  const rows = CONTRADICTIONS.filter(
    ([demTag, repTag]) => demShare(demTag) > 0 && repShare(repTag) > 0,
  ).map(([demTag, repTag]) => ({
    key: `${demTag}-${repTag}`,
    label: `${labelFor(demTag)} vs. ${labelFor(repTag)}`,
    dem: demShare(demTag),
    rep: repShare(repTag),
  }));
  if (rows.length === 0) {
    return null;
  }
  const max = Math.max(...rows.map((row) => Math.max(row.dem, row.rep)), 0.01);

  const head = (committee: CommitteeAds) => (
    <>
      <Link href={`/2026/committees/${committee.id}`}>{committee.name}</Link>
      <span className={styles.divergeHeadCount}>
        {pluralize(committee.ads.length, "ad", { includeValue: true })}
      </span>
    </>
  );

  // Two cells, the header and the rows, so each lines up with the other
  // networks' in NetworkArms' grid.
  return (
    <>
      <div className={styles.divergeHeadRow}>
        <span className={`${styles.divergeHead} ${styles.divergeHeadLeft}`}>
          {head(dem)}
        </span>
        <span className={`${styles.divergeHead} ${styles.divergeHeadRight}`}>
          {head(rep)}
        </span>
      </div>
      <div>
        {rows.map((row) => (
          <div key={row.key} className={styles.divergeRow}>
            <span className={styles.divergeValue}>{pct(row.dem)}</span>
            <span className={`${styles.divergeBar} ${styles.divergeBarLeft}`}>
              <i
                className={styles.swatchDem}
                style={{ width: `${(row.dem / max) * 100}%` }}
              />
            </span>
            <span className={styles.divergeLabel}>{row.label}</span>
            <span className={styles.divergeBar}>
              <i
                className={styles.swatchRep}
                style={{ width: `${(row.rep / max) * 100}%` }}
              />
            </span>
            <span
              className={`${styles.divergeValue} ${styles.divergeValueRight}`}
            >
              {pct(row.rep)}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

export type NetworkArmPair = {
  network: string;
  dem: CommitteeAds;
  rep: CommitteeAds;
};

/**
 * Networks with both a Democratic and a Republican arm that ran tagged ads,
 * in the order the networks are listed in data/networks.
 */
export function getNetworkArmPairs(
  committees: CommitteeAds[],
): NetworkArmPair[] {
  return NETWORKS.flatMap((network) => {
    const arms = committees.filter((c) => c.network === network.name);
    const dem = arms.find((c) => c.party === "dem");
    const rep = arms.find((c) => c.party === "rep");
    return dem && rep ? [{ network: network.name, dem, rep }] : [];
  });
}

export default function NetworkArms({
  pairs,
  themes,
  sector,
}: {
  pairs: NetworkArmPair[];
  themes: CodebookEntry[];
  sector: Sector;
}) {
  return (
    <div className={styles.networkArms}>
      {pairs.map(({ network, dem, rep }) => {
        const featured = FEATURED_ARM_ADS[network] ?? {};
        const demAd = pickAd(dem, ARM_TAGS.dem, featured.dem);
        const repAd = pickAd(rep, ARM_TAGS.rep, featured.rep);
        const demSpans = quoteSpans(demAd, ARM_TAGS.dem, featured.dem);
        const repSpans = quoteSpans(repAd, ARM_TAGS.rep, featured.rep);
        const networkId = getNetworkIdByName(network);
        return (
          <div key={network} className={styles.networkArm}>
            <h3 className={styles.subheading}>
              {networkId ? (
                <Link
                  className="unstyled-no-underline"
                  href={`/2026/networks/${networkId}`}
                >
                  {network}
                </Link>
              ) : (
                network
              )}
              <span className={sharedStyles.sectorBadge}>
                {AD_SECTOR_LABELS[dem.sector]}
              </span>
            </h3>
            <div className={styles.adPair}>
              <AdVideoCard ad={demAd} sector={sector} spans={demSpans} />
              <AdVideoCard ad={repAd} sector={sector} spans={repSpans} />
            </div>
            <DivergingThemes dem={dem} rep={rep} themes={themes} />
          </div>
        );
      })}
    </div>
  );
}
