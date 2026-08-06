import "@testing-library/jest-dom";

import { Ad, AdVideo, GoogleAd } from "@/app/types/Ads";
import { getStateFromGeoTargeting, mergeAdVariants } from "@/app/utils/ads";

const ad = (id: string, overrides: Partial<GoogleAd> = {}): GoogleAd =>
  ({
    ad_id: id,
    type: "google",
    race: "GA-H-07",
    spend_range_min_usd: 100,
    spend_range_max_usd: 200,
    impressions: "1000-2000",
    date_range_start: "2026-05-10",
    date_range_end: "2026-05-20",
    ...overrides,
  }) as GoogleAd;

describe("getStateFromGeoTargeting", () => {
  test("reads the state from a zip code list", () => {
    expect(
      getStateFromGeoTargeting(
        "60104,Illinois,United States, 60126,Illinois,United States",
      ),
    ).toBe("IL");
  });

  test("reads the state from a statewide buy", () => {
    expect(getStateFromGeoTargeting("Illinois,United States")).toBe("IL");
  });

  test("ignores foreign entries from colliding postcodes", () => {
    expect(
      getStateFromGeoTargeting(
        "60104,Illinois,United States, 60141,Hauts-de-France,France, " +
          "60154,Illinois,United States",
      ),
    ).toBe("IL");
  });

  test("returns empty for missing or unrecognizable targeting", () => {
    expect(getStateFromGeoTargeting("")).toBe("");
    expect(getStateFromGeoTargeting(null)).toBe("");
    expect(getStateFromGeoTargeting("Somewhere,Nowhere")).toBe("");
  });
});

describe("mergeAdVariants", () => {
  test("sums spend and impressions and spans the date range", () => {
    const merged = mergeAdVariants([
      ad("A"),
      ad("B", {
        variantOf: "A",
        date_range_start: "2026-05-01",
        date_range_end: "2026-06-01",
        spend_range_min_usd: 50,
        spend_range_max_usd: 75,
        impressions: "500-900",
      }),
    ]) as GoogleAd[];

    expect(merged).toHaveLength(1);
    expect(merged[0].ad_id).toBe("A");
    expect(merged[0].spend_range_min_usd).toBe(150);
    expect(merged[0].spend_range_max_usd).toBe(275);
    expect(merged[0].impressions).toBe("1500-2900");
    expect(merged[0].date_range_start).toBe("2026-05-01");
    expect(merged[0].date_range_end).toBe("2026-06-01");
    expect(merged[0].variantCount).toBe(2);
  });

  test("shows the longest cut, not the primary's", () => {
    const merged = mergeAdVariants([
      ad("A", { video: { mp4: "short.mp4", duration: 6 } as AdVideo }),
      ad("B", {
        variantOf: "A",
        video: { mp4: "long.mp4", duration: 30 } as AdVideo,
      }),
      ad("C", {
        variantOf: "A",
        video: { mp4: "mid.mp4", duration: 15 } as AdVideo,
      }),
    ]) as GoogleAd[];

    expect(merged).toHaveLength(1);
    expect(merged[0].ad_id).toBe("A");
    expect(merged[0].video?.mp4).toBe("long.mp4");
  });

  test("ignores variants that aren't archived yet", () => {
    const merged = mergeAdVariants([
      ad("A", { video: { mp4: "short.mp4", duration: 6 } as AdVideo }),
      ad("B", { variantOf: "A" }),
    ]) as GoogleAd[];

    expect(merged[0].video?.mp4).toBe("short.mp4");
  });

  test("leaves video undefined when nothing in the group is archived", () => {
    const merged = mergeAdVariants([
      ad("A"),
      ad("B", { variantOf: "A" }),
    ]) as GoogleAd[];

    expect(merged[0].video).toBeUndefined();
  });

  test("leaves unmerged ads untouched", () => {
    const merged = mergeAdVariants([ad("A"), ad("B")]) as GoogleAd[];

    expect(merged).toHaveLength(2);
    expect(merged[0].variantCount).toBeUndefined();
    expect(merged[0].spend_range_min_usd).toBe(100);
  });

  test("follows a chain of variants to the root", () => {
    const merged = mergeAdVariants([
      ad("A"),
      ad("B", { variantOf: "A" }),
      ad("C", { variantOf: "B" }),
    ]) as GoogleAd[];

    expect(merged).toHaveLength(1);
    expect(merged[0].ad_id).toBe("A");
    expect(merged[0].variantCount).toBe(3);
    expect(merged[0].spend_range_min_usd).toBe(300);
  });

  test("survives a cycle rather than hanging", () => {
    const merged = mergeAdVariants([
      ad("A", { variantOf: "B" }),
      ad("B", { variantOf: "A" }),
    ]) as GoogleAd[];

    expect(merged).toHaveLength(1);
  });

  test("ignores a variantOf pointing at an ad that isn't there", () => {
    const merged = mergeAdVariants([
      ad("A", { variantOf: "NOT_A_REAL_AD" }),
    ]) as GoogleAd[];

    expect(merged).toHaveLength(1);
    expect(merged[0].ad_id).toBe("A");
    expect(merged[0].variantCount).toBeUndefined();
  });

  test("passes image ads through", () => {
    const image = {
      type: "image",
      src: "example.webp",
      committee_id: "C00123456",
    } as unknown as Ad;

    expect(mergeAdVariants([ad("A"), image])).toHaveLength(2);
  });
});
