import Link from "next/link";

import { getNetworkIdByName, NETWORKS } from "@/app/data/networks";
import sharedStyles from "@/app/shared.module.css";
import { CodebookEntry, TaggedAd } from "@/app/types/AdAnalysis";
import { Sector } from "@/app/types/Sector";
import {
  AD_SECTOR_LABELS,
  CommitteeAds,
  splitSentences,
  tagShare,
} from "@/app/utils/adAnalysis";
import { humanizePercentage, pluralize } from "@/app/utils/humanize";

import { AdVideoCard, PartySwatch } from "./AdCardParts";
import styles from "./Ads.module.css";

// A gap this large between the arms is bolded.
const NOTABLE_GAP = 0.2;

function runLength(ad: TaggedAd): number {
  return Date.parse(ad.end) - Date.parse(ad.start);
}

// The longest-running ad with one of the tags, or the longest-running ad.
function pickAd(committee: CommitteeAds, tags: string[]): TaggedAd {
  const byRun = [...committee.ads].sort((a, b) => runLength(b) - runLength(a));
  return (
    byRun.find((ad) => tags.some((tag) => ad.tags.includes(tag))) ?? byRun[0]
  );
}

function quoteMatching(ad: TaggedAd, pattern: RegExp): string {
  const sentences = splitSentences(ad.transcript);
  return sentences.find((sentence) => pattern.test(sentence)) ?? sentences[0];
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
  const rows = themes
    .map(({ tag, label }) => ({
      tag,
      label,
      dem: tagShare(dem.ads, tag),
      rep: tagShare(rep.ads, tag),
    }))
    .filter((row) => row.dem || row.rep)
    .sort((a, b) => Math.max(b.dem, b.rep) - Math.max(a.dem, a.rep))
    .slice(0, 8);
  const max = Math.max(...rows.map((row) => Math.max(row.dem, row.rep)), 0.01);

  const head = (committee: CommitteeAds) => (
    <>
      <span className={styles.inlineWho}>
        <PartySwatch party={committee.party} />
        <Link href={`/2026/committees/${committee.id}`}>{committee.name}</Link>
      </span>
      <span className={styles.divergeHeadCount}>
        {pluralize(committee.ads.length, "ad", { includeValue: true })}
      </span>
    </>
  );

  return (
    <div className={styles.diverge}>
      <div className={styles.divergeHeadRow}>
        <span className={`${styles.divergeHead} ${styles.divergeHeadLeft}`}>
          {head(dem)}
        </span>
        <span className={`${styles.divergeHead} ${styles.divergeHeadRight}`}>
          {head(rep)}
        </span>
      </div>
      {rows.map((row) => (
        <div key={row.tag} className={styles.divergeRow}>
          <span
            className={`${styles.divergeValue} ${
              row.dem - row.rep >= NOTABLE_GAP ? styles.divergeValueNotable : ""
            }`}
          >
            {pct(row.dem)}
          </span>
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
            className={`${styles.divergeValue} ${styles.divergeValueRight} ${
              row.rep - row.dem >= NOTABLE_GAP ? styles.divergeValueNotable : ""
            }`}
          >
            {pct(row.rep)}
          </span>
        </div>
      ))}
    </div>
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
        const demAd = pickAd(dem, ["anti_maga", "stand_up_to_trump"]);
        const repAd = pickAd(rep, ["trump_endorsed", "trump_aligned"]);
        const networkId = getNetworkIdByName(network);
        return (
          <div key={network}>
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
              <AdVideoCard
                ad={demAd}
                sector={sector}
                quote={quoteMatching(demAd, /MAGA|Trump|extrem/i)}
              />
              <AdVideoCard
                ad={repAd}
                sector={sector}
                quote={quoteMatching(repAd, /Trump/i)}
              />
            </div>
            <DivergingThemes dem={dem} rep={rep} themes={themes} />
          </div>
        );
      })}
    </div>
  );
}
