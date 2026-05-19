import { fetchAdsByRace, fetchConstant } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import { Ad } from "@/app/types/Ads";
import { CommitteeConstant } from "@/app/types/Committee";
import { isError } from "@/app/utils/errors";

import GoogleAd from "./GoogleAd";
import ImageAd from "./ImageAd";
import styles from "./page.module.css";

export default async function Ads({ raceId }: { raceId: string }) {
  const [adsData, committeeConstantData] = await Promise.all([
    fetchAdsByRace(raceId),
    fetchConstant("committees"),
  ]);

  if (isError(adsData)) {
    return <ErrorText subject="ads related to this election" />;
  }

  const ads = adsData as Ad[];
  const committees = (committeeConstantData || {}) as Record<
    string,
    CommitteeConstant
  >;

  if (ads.length === 0) {
    return (
      <div className={styles.adsEmpty}>
        No known ads related to this election.
      </div>
    );
  }
  return ads.map((ad) => {
    if (ad.type === "google") {
      return <GoogleAd ad={ad} committees={committees} key={ad.ad_id} />;
    }
    return <ImageAd ad={ad} committees={committees} key={ad.src} />;
  });
}
