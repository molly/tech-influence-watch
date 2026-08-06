import Link from "next/link";

import InformationalTooltip from "@/app/components/InformationalTooltip";
import { AdVideo, GoogleAd as GoogleAdType } from "@/app/types/Ads";
import { CommitteeConstant } from "@/app/types/Committee";
import { mediaUrl } from "@/app/utils/ads";
import { humanizeApproximateRounded } from "@/app/utils/humanize";
import { formatCurrency, formatDateFromString } from "@/app/utils/utils";

import styles from "./page.module.css";

function formatImpressions(impressions: string) {
  const [lower, upper] = impressions.split("-");
  const low = humanizeApproximateRounded(parseInt(lower));
  const high = humanizeApproximateRounded(parseInt(upper));
  // Compare the rounded values, not the raw ones: a 1,000,000–1,050,000 range
  // renders as "1M – 1M" too, and reads just as oddly as an exact tie.
  if (low === high) {
    return `~${low}`;
  }
  return `${low} – ${high}`;
}

// Our own copy of the ad. `preload="none"` means nothing but the poster image
// transfers until a reader actually presses play, and the width/height
// attributes give the browser the aspect ratio up front so the page doesn't
// shift once the video loads.
function RehostedVideo({ video, name }: { video: AdVideo; name: string }) {
  return (
    <video
      className={styles.adVideo}
      src={mediaUrl(video.mp4)}
      poster={mediaUrl(video.poster)}
      width={video.width ?? undefined}
      height={video.height ?? undefined}
      aria-label={`Video advertisement from ${name}`}
      controls
      preload="none"
      playsInline
    />
  );
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
      width="160"
      height="100"
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
      <span className={styles.adHeaderName}>
        <Link href={`/2026/committees/${ad.fec_id}`}>{name}</Link>
      </span>
      <div className={styles.adContent}>
        {/* Prefer our archived copy; fall back to a hand-added YouTube embed
            for ads captured before the pipeline started rehosting them. */}
        {(ad.video || ad.videoUrl) && (
          <div className={styles.adEmbedGroup}>
            {ad.video ? (
              <RehostedVideo video={ad.video} name={name} />
            ) : (
              <Embed url={ad.videoUrl as string} />
            )}
          </div>
        )}
        <div className={styles.adDetailsGroup}>
          {/* TEMPORARY: ad IDs, for finding duplicates to merge in
              /admin/edit/ads. Delete this block (and .adDebugId) when done. */}
          <div className={styles.adDebugId}>
            {ad.ad_id}
            {ad.variantCount && ` (merged: ${ad.variantCount})`}
          </div>
          {ad.date_range_start && ad.date_range_end && (
            <div>
              <b>Shown:</b> {formatDateFromString(ad.date_range_start)} &ndash;{" "}
              {formatDateFromString(ad.date_range_end)}
            </div>
          )}
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
      </div>
      <div className={styles.moreDetails}>
        <a href={ad.ad_url}>
          More details in Google&rsquo;s Ad Transparency Center
        </a>
        {/* Just the count here; the explanation sits once below the list. */}
        {ad.variantCount && <> &middot; Combines {ad.variantCount} ad entries</>}
      </div>
    </div>
  );
}
