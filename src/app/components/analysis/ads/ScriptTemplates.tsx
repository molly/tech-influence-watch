import { TaggedAd } from "@/app/types/AdAnalysis";

import { AdVideoBox, PartySwatch } from "./AdCardParts";
import styles from "./Ads.module.css";

// A script reused this many times is worth showing.
const MIN_FAMILY_SIZE = 3;

export function getScriptFamilies(ads: TaggedAd[]): TaggedAd[][] {
  const families = new Map<string, TaggedAd[]>();
  for (const ad of ads) {
    if (ad.scriptFamily) {
      families.set(ad.scriptFamily, [
        ...(families.get(ad.scriptFamily) ?? []),
        ad,
      ]);
    }
  }
  return [...families.values()]
    .filter((family) => family.length >= MIN_FAMILY_SIZE)
    .sort((a, b) => b.length - a.length)
    .map((family) => family.sort((a, b) => a.race.localeCompare(b.race)));
}

export default function ScriptTemplates({
  families,
}: {
  families: TaggedAd[][];
}) {
  return (
    <div>
      {families.map((family) => {
        const familyId = family[0].scriptFamily as string;
        const template = family.find((ad) => ad.id === familyId) ?? family[0];
        return (
          <div key={familyId} className={styles.template}>
            <div>
              <h4 className={styles.templateCommittee}>
                <PartySwatch party={template.party} />
                {template.committee}
              </h4>
              <span className={styles.meta}>
                Same script, {family.length} races
              </span>
              {template.scriptTemplate ? (
                <p
                  className={styles.templateScript}
                  dangerouslySetInnerHTML={{
                    __html: `“${template.scriptTemplate}”`,
                  }}
                />
              ) : (
                <p className={styles.templateScript}>“{template.transcript}”</p>
              )}
            </div>
            <div className={styles.templateStrip}>
              {family.map((ad) => (
                <figure key={ad.id}>
                  <AdVideoBox ad={ad} />
                  <figcaption>
                    <span className={styles.templateName}>{ad.race}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
