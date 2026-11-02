import { fetchAdsByRace, fetchConstant } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import sharedStyles from "@/app/shared.module.css";
import { Ad, GoogleAd as GoogleAdType } from "@/app/types/Ads";
import { CommitteeConstant } from "@/app/types/Committee";
import { Sector } from "@/app/types/Sector";
import { adLibraryHref, adMatchesSector } from "@/app/utils/adAnalysis";
import { getTaggedAds } from "@/app/utils/adAnalysisData";
import { isError } from "@/app/utils/errors";
import { getCommitteeIdsForSector, humanizeSector } from "@/app/utils/sector";

import GoogleAd from "./GoogleAd";
import ImageAd from "./ImageAd";
import styles from "./page.module.css";

export default async function Ads({
  raceId,
  sector,
}: {
  raceId: string;
  sector: Sector;
}) {
  const [adsData, committeeConstantData, taggedAds] = await Promise.all([
    fetchAdsByRace(raceId),
    fetchConstant("committees"),
    getTaggedAds(),
  ]);

  if (isError(adsData)) {
    return (
      <span className={sharedStyles.subtitle}>
        <ErrorText subject="ads related to this election" />
      </span>
    );
  }

  const committees = (committeeConstantData || {}) as Record<
    string,
    CommitteeConstant
  >;
  const sectorCommitteeIds = getCommitteeIdsForSector(sector, committees);
  const ads = (adsData as Ad[]).filter((ad) => {
    if (sectorCommitteeIds === null) {
      return true;
    }
    const committeeId = ad.type === "google" ? ad.fec_id : ad.committee_id;
    return sectorCommitteeIds.has(committeeId);
  });

  if (ads.length === 0) {
    return (
      <div className={sharedStyles.subtitle}>
        No {humanizeSector(sector, { lowercase: true, hyphen: true, or: true })}
        focused PACs have run any known ads related to this election.
      </div>
    );
  }
  const hasMergedAds = ads.some(
    (ad) => ad.type === "google" && ad.variantCount,
  );

  // Only reviewed ads are in the library, and a merged group's entry is
  // keyed by whichever cut is longest, so check every id in the group.
  const libraryIds = new Set(
    taggedAds
      .filter((tagged) => adMatchesSector(tagged.sector, sector))
      .map((tagged) => tagged.id),
  );
  const getLibraryHref = (ad: GoogleAdType) => {
    const id = (ad.variantIds ?? [ad.ad_id]).find((variantId) =>
      libraryIds.has(variantId),
    );
    return id ? adLibraryHref(sector, { id }) : undefined;
  };

  return (
    <>
      {ads.map((ad) => {
        if (ad.type === "google") {
          return (
            <GoogleAd
              ad={ad}
              committees={committees}
              libraryHref={getLibraryHref(ad)}
              key={ad.ad_id}
            />
          );
        }
        return <ImageAd ad={ad} committees={committees} key={ad.src} />;
      })}
      {hasMergedAds && (
        <p className={styles.adMergeExplainer}>
          Advertisers often run one ad as several variants, usually cuts of
          different lengths, which Google&rsquo;s Ad Transparency Center lists
          separately. Where an ad above notes that it combines multiple entries,
          the longest version is the one shown, and the dates, cost and
          impressions are totals across every variant.
        </p>
      )}
    </>
  );
}
