"use client";

import { doc, setDoc } from "firebase/firestore";
import { Fragment, useEffect, useState } from "react";

import { fetchConstant, fetchGoogleAds } from "@/app/actions/fetch";
import { STATES_BY_ABBR } from "@/app/data/states";
import { db } from "@/app/lib/db";
import {
  Ad,
  AdConstants,
  AdGroup,
  GoogleAd,
  GoogleAdConstant,
} from "@/app/types/Ads";
import { getStateFromGeoTargeting, mediaUrl } from "@/app/utils/ads";
import { isError } from "@/app/utils/errors";
import { getStateFromRaceId, sortRaces } from "@/app/utils/races";

import styles from "../../admin.module.css";

const NO_RACE = "";
const UNKNOWN_STATE = "";

async function saveAdConstants(adsConstants: Record<string, GoogleAdConstant>) {
  const docRef = doc(db, "constants", "ads");
  await setDoc(docRef, { google: adsConstants }, { merge: true });
}

function ArchiveStatus({ ad }: { ad: GoogleAd }) {
  if (ad.video) {
    return (
      <span className={`${styles.dataSourceBadge} ${styles.archiveStatusOk}`}>
        Archived
      </span>
    );
  }
  if ((ad.video_attempts || 0) >= 3) {
    return (
      <span className={`${styles.dataSourceBadge} ${styles.archiveStatusFail}`}>
        Archiving failed
      </span>
    );
  }
  return (
    <span className={`${styles.dataSourceBadge} ${styles.dataSourceScraped}`}>
      Not archived yet
    </span>
  );
}

export default function AdsEditor() {
  const [ads, setAds] = useState<Record<string, AdGroup> | null>(null);
  const [loadingState, setLoadingState] = useState("loading");
  const [adConstants, setAdConstants] = useState<
    Record<string, GoogleAdConstant>
  >({});
  // Which ads were already tagged when the page loaded. Filtering on the live
  // edit state instead would make a card vanish the moment you typed a race
  // into it, and move it between groups as you typed.
  const [taggedOnLoad, setTaggedOnLoad] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saveState, setSaveState] = useState("");
  const [activeState, setActiveState] = useState("");
  const [bulkRace, setBulkRace] = useState("");

  useEffect(() => {
    (async () => {
      const [adsData, adsConstantData] = await Promise.all([
        fetchGoogleAds(),
        fetchConstant<AdConstants>("ads"),
      ]);
      if (isError(adsData)) {
        setLoadingState("error");
      } else {
        setAds(adsData as Record<string, AdGroup>);
        const constants = adsConstantData ? adsConstantData.google : {};
        setAdConstants(constants);
        setTaggedOnLoad(
          new Set(
            Object.entries(constants)
              .filter(([, constant]) => constant.race)
              .map(([adId]) => adId),
          ),
        );
        setLoadingState("loaded");
      }
    })();
  }, []);

  if (loadingState === "loading") {
    return <div>Loading...</div>;
  } else if (loadingState === "error") {
    return <div>Something went wrong when fetching ads.</div>;
  }

  const googleAds = Object.values(ads as Record<string, AdGroup>)
    .reduce((acc, adGroup) => [...acc, ...Object.values(adGroup.ads)], [] as Ad[])
    .filter((ad): ad is GoogleAd => ad.type === "google");

  const untaggedCount = googleAds.filter(
    (ad) => !taggedOnLoad.has(ad.ad_id),
  ).length;
  const visibleAds = showAll
    ? googleAds
    : googleAds.filter((ad) => !taggedOnLoad.has(ad.ad_id));

  // Race as of page load, for grouping — see taggedOnLoad above.
  const raceOnLoad = (adId: string) =>
    taggedOnLoad.has(adId) ? adConstants[adId]?.race || NO_RACE : NO_RACE;

  // Fall back to the geo targeting when there's no race yet. Only the state is
  // inferable from it; the district isn't.
  const stateOf = (ad: GoogleAd) =>
    getStateFromRaceId(raceOnLoad(ad.ad_id)) ||
    getStateFromGeoTargeting(ad.geo_targeting_included) ||
    UNKNOWN_STATE;

  const byState = new Map<string, Map<string, GoogleAd[]>>();
  for (const ad of visibleAds) {
    const state = stateOf(ad);
    const race = raceOnLoad(ad.ad_id);
    const races = byState.get(state) || new Map<string, GoogleAd[]>();
    races.set(race, [...(races.get(race) || []), ad]);
    byState.set(state, races);
  }
  const sortedStates = [...byState.keys()].sort((a, b) => {
    // Ads whose state couldn't be determined go last rather than sorting to
    // the top on an empty string.
    if (!a || !b) {
      return !a ? 1 : -1;
    }
    return a.localeCompare(b);
  });
  // Show one state at a time. Derive the current one rather than syncing it in
  // an effect, so toggling "show all" can't strand us on a state that no
  // longer has any visible ads.
  const currentState = byState.has(activeState)
    ? activeState
    : (sortedStates[0] ?? "");
  const currentRaces =
    byState.get(currentState) || new Map<string, GoogleAd[]>();
  const countIn = (state: string) =>
    [...(byState.get(state)?.values() || [])].reduce(
      (total, group) => total + group.length,
      0,
    );

  const updateConstant = (adId: string, changes: Partial<GoogleAdConstant>) => {
    setAdConstants({
      ...adConstants,
      [adId]: { ...adConstants[adId], ...changes },
    });
    setSaveState("");
  };

  const toggleSelected = (adId: string) => {
    const next = new Set(selected);
    if (next.has(adId)) {
      next.delete(adId);
    } else {
      next.add(adId);
    }
    setSelected(next);
  };

  // Merge the selected ads into whichever of them started running first, on the
  // assumption that the original cut precedes its variations.
  const mergeSelected = () => {
    const group = googleAds
      .filter((ad) => selected.has(ad.ad_id))
      .sort((a, b) => a.date_range_start.localeCompare(b.date_range_start));
    if (group.length < 2) {
      return;
    }
    const [primary, ...variants] = group;
    const updated = { ...adConstants };
    // Whatever becomes the primary can't also be somebody's variant. Rebuild
    // the entry rather than deleting the key, since a shallow copy still
    // shares the nested objects with state.
    if (updated[primary.ad_id]?.variantOf) {
      const { variantOf, ...rest } = updated[primary.ad_id];
      updated[primary.ad_id] = rest as GoogleAdConstant;
    }
    // Carry a race across the whole group, so merging a tagged ad with
    // untagged ones doesn't leave the variants stranded under "No race
    // assigned". Whatever's typed in the bulk field wins, then the primary's
    // own race, then any variant that already had one.
    const race =
      bulkRace.trim() ||
      updated[primary.ad_id]?.race ||
      group.map((ad) => updated[ad.ad_id]?.race).find(Boolean) ||
      "";
    if (race) {
      updated[primary.ad_id] = { ...updated[primary.ad_id], race };
    }
    for (const variant of variants) {
      updated[variant.ad_id] = {
        ...updated[variant.ad_id],
        variantOf: primary.ad_id,
        ...(race ? { race } : {}),
      };
    }
    setAdConstants(updated);
    setSelected(new Set());
    setSaveState("");
  };

  // Select-all acts on what's actually on screen — the current state's ads —
  // rather than every ad everywhere, which would sweep in ads you can't see.
  // Selections made under other state tabs are left alone.
  const adsInView = [...currentRaces.values()].flat();
  const allInViewSelected =
    adsInView.length > 0 && adsInView.every((ad) => selected.has(ad.ad_id));
  const someInViewSelected =
    !allInViewSelected && adsInView.some((ad) => selected.has(ad.ad_id));

  const toggleSelectAllInView = () => {
    const next = new Set(selected);
    for (const ad of adsInView) {
      if (allInViewSelected) {
        next.delete(ad.ad_id);
      } else {
        next.add(ad.ad_id);
      }
    }
    setSelected(next);
  };

  const toggleSelectAllInGroup = (raceId: string) => {
    const group = currentRaces.get(raceId) || [];
    const allSelected = group.every((ad) => selected.has(ad.ad_id));
    const next = new Set(selected);
    for (const ad of group) {
      if (allSelected) {
        next.delete(ad.ad_id);
      } else {
        next.add(ad.ad_id);
      }
    }
    setSelected(next);
  };

  const applyRaceToSelected = () => {
    const race = bulkRace.trim();
    if (!race || !selected.size) {
      return;
    }
    const updated = { ...adConstants };
    for (const adId of selected) {
      updated[adId] = { ...updated[adId], race };
    }
    setAdConstants(updated);
    setSaveState("");
  };

  const unmerge = (adId: string) => {
    const { variantOf, ...rest } = adConstants[adId] || {};
    setAdConstants({ ...adConstants, [adId]: rest as GoogleAdConstant });
    setSaveState("");
  };

  const save = async () => {
    setSaveState("saving");
    try {
      await saveAdConstants(adConstants);
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  };

  // Rendered at both ends of a long list, so the input needs a unique id per
  // instance to keep each label bound to the input beside it.
  const renderControls = (position: string) => (
    <div className={styles.statsRow}>
      <button onClick={save} disabled={saveState === "saving"}>
        {saveState === "saving" ? "Saving..." : "Save"}
      </button>
      <label>
        <input
          type="checkbox"
          checked={allInViewSelected}
          // Indeterminate has no HTML attribute — it can only be set on the
          // DOM node — so it's applied through a ref.
          ref={(input) => {
            if (input) {
              input.indeterminate = someInViewSelected;
            }
          }}
          onChange={toggleSelectAllInView}
          disabled={adsInView.length === 0}
        />{" "}
        Select all {adsInView.length} shown
      </label>
      <span className={styles.bulkRaceGroup}>
        <label htmlFor={`bulk-race-${position}`}>Race for selected</label>
        <input
          type="text"
          id={`bulk-race-${position}`}
          value={bulkRace}
          onChange={(e) => setBulkRace(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              applyRaceToSelected();
            }
          }}
        />
        <button
          onClick={applyRaceToSelected}
          disabled={!bulkRace.trim() || selected.size === 0}
        >
          Apply to {selected.size || "selected"}
        </button>
      </span>
      <button onClick={mergeSelected} disabled={selected.size < 2}>
        Merge {selected.size > 1 ? `${selected.size} selected` : "selected"}
      </button>
      <label>
        <input
          type="checkbox"
          checked={showAll}
          onChange={(e) => setShowAll(e.target.checked)}
        />{" "}
        Show all ads
      </label>
      <p className={styles.statsText}>
        {untaggedCount} of {googleAds.length} ads have no race assigned
        {" · "}
        {visibleAds.filter((ad) => ad.video).length} of {visibleAds.length} shown
        are archived
      </p>
      {saveState === "saved" && (
        <span className={styles.saveSuccessInline}>Saved</span>
      )}
      {saveState === "error" && (
        <span className={styles.saveErrorInline}>Save failed</span>
      )}
    </div>
  );

  const sortedRaceIds = [...currentRaces.keys()].sort((a, b) => {
    if (!a || !b) {
      return !a ? 1 : -1;
    }
    return sortRaces(a, b);
  });

  return (
    <>
      {renderControls("top")}
      <nav className={styles.stateTabs}>
        {sortedStates.map((state) => (
          <button
            key={state || "unknown-state"}
            className={`${styles.stateTab} ${
              state === currentState ? styles.stateTabActive : ""
            }`}
            aria-current={state === currentState ? "true" : undefined}
            onClick={() => setActiveState(state)}
          >
            {STATES_BY_ABBR[state] || "State unknown"} ({countIn(state)})
          </button>
        ))}
      </nav>
      <section className={styles.adSection}>
        <h2 className={styles.adSectionHeading}>
          {STATES_BY_ABBR[currentState] || "State unknown"}
        </h2>
        {sortedRaceIds.map((raceId) => (
          <Fragment key={raceId || "unassigned"}>
            <h3 className={styles.adSectionSubheading}>
              <label>
                <input
                  type="checkbox"
                  checked={(currentRaces.get(raceId) as GoogleAd[]).every((ad) =>
                    selected.has(ad.ad_id),
                  )}
                  onChange={() => toggleSelectAllInGroup(raceId)}
                />{" "}
                {raceId || "No race assigned"}
              </label>{" "}
              <span className={styles.statsText}>
                ({currentRaces.get(raceId)?.length})
              </span>
            </h3>
            <div className={styles.adGrid}>
              {(currentRaces.get(raceId) as GoogleAd[]).map((ad) => {
                const constant =
                  adConstants[ad.ad_id] || ({} as GoogleAdConstant);
                const isSelected = selected.has(ad.ad_id);
                return (
                  <div
                    key={ad.ad_id}
                    className={`${styles.adCard} ${
                      isSelected ? styles.adCardSelected : ""
                    }`}
                  >
                    <label>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelected(ad.ad_id)}
                      />{" "}
                      <span className={styles.adCardId}>{ad.ad_id}</span>
                    </label>
                    {ad.video ? (
                      <video
                        className={styles.adVideo}
                        src={mediaUrl(ad.video.mp4)}
                        poster={mediaUrl(ad.video.poster)}
                        width={ad.video.width ?? undefined}
                        height={ad.video.height ?? undefined}
                        aria-label={`Ad ${ad.ad_id}`}
                        controls
                        preload="none"
                        playsInline
                      />
                    ) : (
                      <ArchiveStatus ad={ad} />
                    )}
                    <div>
                      <label htmlFor={`race-${ad.ad_id}`}>Race</label>{" "}
                      <input
                        type="text"
                        id={`race-${ad.ad_id}`}
                        value={constant.race ?? ""}
                        onChange={(e) =>
                          updateConstant(ad.ad_id, { race: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <a href={ad.ad_url}>Ad Transparency Center</a>
                      {constant.variantOf && (
                        <>
                          {" "}
                          <span
                            className={`${styles.dataSourceBadge} ${styles.dataSourceManual}`}
                          >
                            Merged into {constant.variantOf}
                          </span>{" "}
                          <button onClick={() => unmerge(ad.ad_id)}>
                            Unmerge
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Fragment>
        ))}
      </section>
      {renderControls("bottom")}
    </>
  );
}
