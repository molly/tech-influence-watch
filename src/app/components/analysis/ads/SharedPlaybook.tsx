import { HorizontalBars } from "@/app/components/home/HorizontalBars";
import barStyles from "@/app/components/home/HorizontalBars.module.css";
import { CodebookEntry, TaggedAd } from "@/app/types/AdAnalysis";
import { tagShare } from "@/app/utils/adAnalysis";
import { humanizePercentage, pluralize } from "@/app/utils/humanize";

import styles from "./Ads.module.css";

type ThemeRow = { tag: string; label: string; a: number; b: number };

function ThemeGroups({
  title,
  description,
  rows,
  nameA,
  nameB,
}: {
  title: string;
  description: string;
  rows: ThemeRow[];
  nameA: string;
  nameB: string;
}) {
  return (
    <div>
      <h4 className={styles.playbookTitle}>{title}</h4>
      <p className={styles.note}>{description}</p>
      <div className={barStyles.groups}>
        {rows.map((row) => (
          <div key={row.tag} className={barStyles.group}>
            <div className={barStyles.groupHeader}>{row.label}</div>
            <HorizontalBars
              max={1}
              items={[
                { key: "a", label: nameA, share: row.a },
                { key: "b", label: nameB, share: row.b },
              ].map(({ key, label, share }) => ({
                key,
                label,
                value: share,
                displayValue: humanizePercentage(share, 1),
              }))}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SharedPlaybook({
  adsA,
  adsB,
  nameA,
  nameB,
  themes,
}: {
  adsA: TaggedAd[];
  adsB: TaggedAd[];
  nameA: string;
  nameB: string;
  themes: CodebookEntry[];
}) {
  const rows = themes
    .map(({ tag, label }) => ({
      tag,
      label,
      a: tagShare(adsA, tag),
      b: tagShare(adsB, tag),
    }))
    .filter((row) => row.a || row.b);
  const shared = rows
    .filter(
      (row) => Math.min(row.a, row.b) >= 0.12 && Math.abs(row.a - row.b) < 0.1,
    )
    .sort((x, y) => y.a + y.b - (x.a + x.b))
    .slice(0, 6);
  const different = rows
    .filter((row) => Math.abs(row.a - row.b) >= 0.15)
    .sort((x, y) => Math.abs(y.a - y.b) - Math.abs(x.a - x.b))
    .slice(0, 6);

  const labelA = `${nameA} (${pluralize(adsA.length, "ad", { includeValue: true })})`;
  const labelB = `${nameB} (${pluralize(adsB.length, "ad", { includeValue: true })})`;
  return (
    <div className={styles.playbookTables}>
      <ThemeGroups
        title="Shared messages"
        description="Similar rates in both networks"
        rows={shared}
        nameA={labelA}
        nameB={labelB}
      />
      <ThemeGroups
        title="Different emphases"
        description="Gap of 15 points or more"
        rows={different}
        nameA={labelA}
        nameB={labelB}
      />
    </div>
  );
}
