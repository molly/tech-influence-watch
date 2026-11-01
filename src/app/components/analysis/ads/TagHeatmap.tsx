"use client";

import Link from "next/link";
import { Fragment, useState } from "react";

import SegmentedControl from "@/app/(drilldown)/2026/timeline/SegmentedControl";
import { AdParty, CodebookEntry, TaggedAd } from "@/app/types/AdAnalysis";
import { Sector } from "@/app/types/Sector";
import {
  AD_PARTY_LABELS,
  adLibraryHref,
  AdLibraryParams,
  CommitteeAds,
  FORMAT_GROUP,
  hasTag,
  NO_NETWORK_LABEL,
  STANCE_GROUP,
} from "@/app/utils/adAnalysis";
import { humanizePercentage } from "@/app/utils/humanize";

import { PartyTag } from "./AdCardParts";
import styles from "./Ads.module.css";

type GroupBy = "network" | "party";

type RowGroup = {
  label: string;
  committees: CommitteeAds[];
};

// Cells this dark get light text.
const DARK_CELL = 0.45;

// Tags that can't apply to some ads, and why. A row whose ads all fall under
// one gets a blank cell rather than a zero.
const NOT_APPLICABLE: Record<
  string,
  { applies: (ad: TaggedAd) => boolean; reason: string }
> = {
  cross_party: {
    applies: (ad) => ad.party !== "both",
    reason: "Doesn’t apply to committees that back both parties",
  },
};

function groupRows(committees: CommitteeAds[], groupBy: GroupBy): RowGroup[] {
  if (groupBy === "party") {
    const parties: (AdParty | null)[] = ["rep", "dem", "both", null];
    return parties
      .map((party) => ({
        label: party ? AD_PARTY_LABELS[party] : "Unknown party",
        committees: committees.filter((c) => c.party === party),
      }))
      .filter((group) => group.committees.length);
  }
  const networks = [...new Set(committees.map((c) => c.network))];
  return networks.map((network) => ({
    label: network ?? NO_NETWORK_LABEL,
    committees: committees.filter((c) => c.network === network),
  }));
}

export function shareStyle(share: number): React.CSSProperties {
  return { "--share": share } as React.CSSProperties;
}
// The body of the column whose label is hovered, in the scroll container's
// coordinates. Measured from the column's first and last body cells, in
// fractional pixels so the outline sits evenly in the gaps between cells.
type ColumnBox = { left: number; top: number; width: number; height: number };

function columnBox(label: HTMLElement): ColumnBox | null {
  const th = label.closest("th");
  const table = label.closest("table");
  const wrap = table?.parentElement;
  if (!th || !table || !wrap) {
    return null;
  }
  // Group heading rows are a single spanning cell.
  const rows = [...table.tBodies[0].rows].filter((r) => r.cells.length > 1);
  const first = rows[0]?.cells[th.cellIndex];
  const last = rows[rows.length - 1]?.cells[th.cellIndex];
  if (!first || !last) {
    return null;
  }
  const origin = wrap.getBoundingClientRect();
  const top = first.getBoundingClientRect();
  const bottom = last.getBoundingClientRect();
  return {
    left: top.left - origin.left + wrap.scrollLeft,
    top: top.top - origin.top + wrap.scrollTop,
    width: top.width,
    height: bottom.bottom - top.top,
  };
}

function columnBoxStyle(box: ColumnBox): React.CSSProperties {
  return {
    "--left": `${box.left}px`,
    "--top": `${box.top}px`,
    "--width": `${box.width}px`,
    "--height": `${box.height}px`,
  } as React.CSSProperties;
}

export default function TagHeatmap({
  committees,
  codebook,
  sector,
}: {
  committees: CommitteeAds[];
  codebook: CodebookEntry[];
  sector: Sector;
}) {
  const [groupBy, setGroupBy] = useState<GroupBy>("network");
  const [hoveredColumn, setHoveredColumn] = useState<ColumnBox | null>(null);
  const allAds = committees.flatMap((c) => c.ads);
  // Keep each codebook group's columns together, in order of first appearance.
  const groupOrder = [...new Set(codebook.map((entry) => entry.group))];
  // Stances have their own chart, so they're left out here.
  const columns = codebook
    .filter(
      (entry) =>
        ![STANCE_GROUP, FORMAT_GROUP].includes(entry.group) &&
        allAds.some((ad) => hasTag(ad, entry.tag)),
    )
    .sort((a, b) => groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group));
  const columnGroups: { name: string; count: number }[] = [];
  for (const column of columns) {
    const last = columnGroups[columnGroups.length - 1];
    if (last && last.name === column.group) {
      last.count++;
    } else {
      columnGroups.push({ name: column.group, count: 1 });
    }
  }
  const groupStarts = new Set<string>();
  let index = 0;
  for (const group of columnGroups) {
    groupStarts.add(columns[index].tag);
    index += group.count;
  }

  const row = (
    key: string,
    name: React.ReactNode,
    label: string,
    ads: TaggedAd[],
    className: string,
    params: AdLibraryParams,
  ) => (
    <tr key={key} className={className}>
      <th scope="row" className={styles.heatmapRowLabel}>
        {name}
      </th>
      <td className={styles.heatmapRowCount}>{ads.length}</td>
      {columns.map((column) => {
        const notApplicable = NOT_APPLICABLE[column.tag];
        if (notApplicable && !ads.some(notApplicable.applies)) {
          return (
            <td
              key={column.tag}
              className={`${styles.heatmapCell} ${styles.heatmapCellNotApplicable} ${
                groupStarts.has(column.tag) ? styles.heatmapGroupStart : ""
              }`}
              title={notApplicable.reason}
              aria-label={notApplicable.reason}
            />
          );
        }
        const count = ads.filter((ad) => hasTag(ad, column.tag)).length;
        const share = count / ads.length;
        const classes = [
          styles.heatmapCell,
          groupStarts.has(column.tag) ? styles.heatmapGroupStart : "",
          share > DARK_CELL ? styles.heatmapCellDark : "",
          count ? "" : styles.heatmapCellEmpty,
        ].join(" ");
        if (!count) {
          return <td key={column.tag} className={classes} />;
        }
        const title = `${label} · ${column.label}: ${count} of ${
          ads.length
        } ads (${humanizePercentage(count, ads.length)})`;
        return (
          <td key={column.tag} className={classes} style={shareStyle(share)}>
            <Link
              href={adLibraryHref(sector, { ...params, tag: column.tag })}
              title={title}
              aria-label={title}
            >
              {count}
            </Link>
          </td>
        );
      })}
    </tr>
  );

  return (
    <>
      <div className={styles.heatmapControls}>
        <SegmentedControl
          label="Group PACs by:"
          options={[
            { value: "network", label: "Network" },
            { value: "party", label: "Party" },
          ]}
          value={groupBy}
          onChange={setGroupBy}
        />
      </div>
      <div className={styles.heatmapWrap}>
        <table className={styles.heatmap}>
          <thead>
            <tr className={styles.heatmapColumnTags}>
              <th />
              <th />
              {columns.map((column) => (
                <th
                  key={column.tag}
                  scope="col"
                  className={
                    groupStarts.has(column.tag)
                      ? styles.heatmapLaneGroupStart
                      : undefined
                  }
                >
                  <div>
                    <span
                      title={column.definition ?? undefined}
                      onMouseEnter={(e) =>
                        setHoveredColumn(columnBox(e.currentTarget))
                      }
                      onMouseLeave={() => setHoveredColumn(null)}
                    >
                      {column.label}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
            <tr className={styles.heatmapColumnGroups}>
              <th />
              <th />
              {columnGroups.map((group) => (
                <th key={group.name} colSpan={group.count} scope="colgroup">
                  <div title={group.name}>{group.name}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groupRows(committees, groupBy).map((group) => (
              <Fragment key={group.label}>
                <tr className={styles.heatmapGroupRow}>
                  <th colSpan={columns.length + 2} scope="rowgroup">
                    {group.label}
                  </th>
                </tr>
                {group.committees.map((committee) =>
                  row(
                    committee.id,
                    <>
                      {committee.name}
                      {groupBy === "network" ? (
                        <PartyTag party={committee.party} />
                      ) : (
                        committee.network && (
                          <span className={styles.partyTag}>
                            {committee.network}
                          </span>
                        )
                      )}
                    </>,
                    committee.name,
                    committee.ads,
                    "",
                    { cm: committee.id },
                  ),
                )}
              </Fragment>
            ))}
            {row(
              "all",
              "All committees",
              "All committees",
              allAds,
              styles.heatmapTotal,
              {},
            )}
          </tbody>
        </table>
        {hoveredColumn && (
          <div
            className={styles.heatmapColumnHighlight}
            style={columnBoxStyle(hoveredColumn)}
          />
        )}
      </div>
      <div className={styles.heatmapScale}>
        <span>Share of committee&rsquo;s ads</span>
        <span className={styles.heatmapScaleSwatches}>
          {[0.001, 0.2, 0.4, 0.6, 0.8, 1].map((share) => (
            <i key={share} style={shareStyle(share)} />
          ))}
        </span>
        <span>0% → 100%</span>
      </div>
    </>
  );
}
