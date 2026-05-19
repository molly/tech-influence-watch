"use client";

import { doc, setDoc } from "firebase/firestore";
import { Fragment, useEffect, useState } from "react";

import { fetchConstant, fetchGoogleAds } from "@/app/actions/fetch";
import { db } from "@/app/lib/db";
import { Ad, AdConstants, AdGroup, GoogleAdConstant } from "@/app/types/Ads";
import { isError } from "@/app/utils/errors";

import styles from "../../admin.module.css";

async function saveAdConstants(adsConstants: Record<string, GoogleAdConstant>) {
  const docRef = doc(db, "constants", "ads");
  await setDoc(docRef, { google: adsConstants }, { merge: true });
}

export default function AdsEditor() {
  const [ads, setAds] = useState<Record<string, AdGroup> | null>(null);
  const [loadingState, setLoadingState] = useState("loading");
  const [adConstants, setAdConstants] = useState<
    Record<string, GoogleAdConstant>
  >({});

  useEffect(() => {
    (async () => {
      const [adsData, adsConstantData] = await Promise.all([
        fetchGoogleAds(),
        fetchConstant<Record<string, AdConstants>>("ads"),
      ]);
      if (isError(adsData)) {
        setLoadingState("error");
      } else {
        setAds(adsData as Record<string, AdGroup>);
        const ads = adsConstantData ? adsConstantData.google : {};
        setAdConstants(ads);
        setLoadingState("loaded");
      }
    })();
  }, []);

  if (loadingState === "loading") {
    return <div>Loading...</div>;
  } else if (loadingState === "error") {
    return <div>Something went wrong when fetching ads.</div>;
  }

  const flattenedAds = Object.values(ads as Record<string, AdGroup>).reduce(
    (acc, adGroup) => [...acc, ...Object.values(adGroup.ads)],
    [] as Ad[],
  );
  return (
    <div className={styles.adGrid}>
      {flattenedAds.map((ad) => {
        if (ad.type === "google") {
          return (
            <Fragment key={ad.ad_id}>
              <div className={styles.adCard} key={ad.ad_id}>
                <div>
                  <b>ID</b>: {ad.ad_id}
                </div>
                <div>
                  <b>URL</b>: <a href={ad.ad_url}>URL</a>
                </div>
                <div>
                  <b>Region</b>: {ad.geo_targeting_included}
                </div>
              </div>
              <div className={styles.adRegion}>
                <div>
                  <label htmlFor={`race-${ad.ad_id}`}>Race</label>
                  <input
                    type="text"
                    id={`race-${ad.ad_id}`}
                    value={
                      ad.ad_id in adConstants
                        ? adConstants[ad.ad_id]["race"]
                        : ""
                    }
                    onChange={(e) => {
                      setAdConstants({
                        ...adConstants,
                        [ad.ad_id]: {
                          ...adConstants[ad.ad_id],
                          race: e.target.value,
                        },
                      });
                    }}
                  />
                </div>
                <div>
                  <label htmlFor={`url-${ad.ad_id}`}>Video URL</label>
                  <input
                    type="text"
                    id={`url-${ad.ad_id}`}
                    value={
                      ad.ad_id in adConstants
                        ? adConstants[ad.ad_id]["videoUrl"]
                        : ""
                    }
                    onChange={(e) => {
                      setAdConstants({
                        ...adConstants,
                        [ad.ad_id]: {
                          ...adConstants[ad.ad_id],
                          videoUrl: e.target.value,
                        },
                      });
                    }}
                  />
                </div>
              </div>
            </Fragment>
          );
        }
      })}
      <button onClick={() => saveAdConstants(adConstants)}>Save</button>
    </div>
  );
}
