import Link from "next/link";

import InformationalTooltip from "@/app/components/InformationalTooltip";
import { GoogleAd as GoogleAdType } from "@/app/types/Ads";
import { CommitteeConstant } from "@/app/types/Committee";
import { humanizeApproximateRounded } from "@/app/utils/humanize";
import { formatCurrency, formatDateFromString } from "@/app/utils/utils";

import styles from "./page.module.css";

function formatImpressions(impressions: string) {
  const [lower, upper] = impressions.split("-");
  return `${humanizeApproximateRounded(parseInt(lower))} – ${humanizeApproximateRounded(parseInt(upper))}`;
}

function Embed({ url }: { url: string }) {
  if (url === "TAKEDOWN") {
    return (
      <div className={styles.adTakedown}>
        <div className={styles.adTakedownWarning}>⚠</div>
        <span>
          This ad was taken down by Google for violations of their{" "}
          <a href="https://support.google.com/adspolicy/answer/6008942">
            advertising policies
          </a>
          .
        </span>
      </div>
    );
  }
  return (
    <iframe
      className={styles.adEmbed}
      width="560"
      height="315"
      src={url}
      title="YouTube video player"
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    ></iframe>
  );
}

export default function GoogleAd({
  ad,
  committees,
}: {
  ad: GoogleAdType;
  committees: Record<string, CommitteeConstant>;
}) {
  const name = ad.fec_id in committees ? committees[ad.fec_id].name : ad.fec_id;

  let cost;
  if (ad.spend_usd) {
    cost = `${ad.spend_usd}`;
  } else if (ad.spend_range_min_usd && ad.spend_range_max_usd) {
    cost = `${formatCurrency(ad.spend_range_min_usd, true)} – ${formatCurrency(
      ad.spend_range_max_usd,
      true,
    )}`;
  } else if (ad.spend_range_min_usd) {
    cost = `More than ${formatCurrency(ad.spend_range_min_usd, true)}`;
  } else if (ad.spend_range_max_usd) {
    cost = `Up to ${formatCurrency(ad.spend_range_max_usd, true)}`;
  }
  return (
    <div className={styles.adGroup}>
      <h3 className="no-margin">
        <Link href={`/2026/committees/${ad.fec_id}`}>{name}</Link>
      </h3>
      <div>
        {ad.date_range_start && ad.date_range_end && (
          <div>
            <b>Shown:</b> {formatDateFromString(ad.date_range_start)} &ndash;{" "}
            {formatDateFromString(ad.date_range_end)}
          </div>
        )}
        {ad.videoUrl && <Embed url={ad.videoUrl} />}
        {(ad.extraDetails || ad.coverage) && (
          <div className={styles.adDetailsWrapper}>
            {ad.extraDetails && (
              <span
                className={styles.adDetails}
                dangerouslySetInnerHTML={{ __html: ad.extraDetails }}
              />
            )}{" "}
            {ad.coverage && ad.coverage.length && (
              <span className={styles.adDetails}>
                News coverage:{" "}
                {ad.coverage.map((source) => (
                  <a key={source.href} href={source.href}>
                    <i>{source.publisher}</i>
                  </a>
                ))}
              </span>
            )}
          </div>
        )}
        {(cost || ad.impressions) && (
          <div className={styles.adDetailsWrapper}>
            {cost && (
              <span className={styles.adDetails}>
                <b>
                  Cost to run:
                  <InformationalTooltip>
                    <span>
                      This is the amount paid to Google to serve the ad, but
                      does not include other costs (such as production costs).
                    </span>
                  </InformationalTooltip>
                </b>{" "}
                {cost}
              </span>
            )}
            {ad.impressions && (
              <span className={styles.adDetails}>
                <b>Impressions:</b> {formatImpressions(ad.impressions)}
              </span>
            )}
          </div>
        )}
      </div>
      <a href={ad.ad_url}>
        <span>More details in Google&rsquo;s Ad Transparency Center</span>
      </a>
    </div>
  );
}
