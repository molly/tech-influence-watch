export type Source = {
  href: string;
  publisher: string;
};

export type AdConstants = {
  google: Record<string, GoogleAdConstant>;
  images: ImageAd[];
};

export type GoogleAdConstant = {
  race: string;
  videoUrl?: string;
  extraDetails?: React.ReactNode;
  coverage?: Source[];
  // Set on the duplicates when several ads are the same creative — typically
  // cuts of different lengths. Holds the ad_id they were merged into. The
  // primary is simply whichever ad nobody points at.
  variantOf?: string;
};

// A copy of the ad's video that the pipeline downloaded and rehosted, so the
// page doesn't depend on a YouTube embed that may never have existed or may
// since have been taken down. These are storage keys, not URLs — see mediaUrl.
export type AdVideo = {
  mp4: string;
  poster: string;
  original: string;
  duration: number | null;
  width: number | null;
  height: number | null;
};

export type GoogleAd = {
  ad_id: string;
  ad_type: string;
  ad_url: string;
  advertiser_id: string;
  age_targeting: string;
  date_range_end: string;
  date_range_start: string;
  fec_id: string;
  gender_targeting: string;
  geo_targeting_excluded: string | null;
  geo_targeting_included: string | null;
  impressions: string;
  spend_range_max_usd: number;
  spend_range_min_usd: number;
  spend_usd: string | null;
  type: "google";
  video?: AdVideo;
  // Set by the pipeline when rehosting failed; it stops trying after 3.
  video_attempts?: number;
  // Number of ads folded into this one by mergeAdVariants, counting itself.
  // Absent on unmerged ads.
  variantCount?: number;
} & GoogleAdConstant;

export type ImageAd = {
  alt?: string;
  committee_id: string;
  coverage?: Source[];
  date: string;
  extraDetails?: string;
  humanDate?: string;
  race: string;
  source: string;
  src: string;
  type: "image";
};

export type Ad = GoogleAd | ImageAd;

export type AdGroup = {
  GATC_id: string;
  ads: Ad[];
};
