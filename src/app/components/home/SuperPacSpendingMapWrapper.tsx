import Link from "next/link";

import { fetchMapData } from "@/app/actions/fetch";
import tableStyles from "@/app/components/tables.module.css";
import { STATES_BY_ABBR } from "@/app/data/states";
import sharedStyles from "@/app/shared.module.css";
import { MapData } from "@/app/types/MapData";
import { type Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import { humanizeSector, sectorHref } from "@/app/utils/sector";

import { generateDomain } from "../chloroplethConstants";
import ChloroplethMap from "../ChloroplethMap";
import ErrorText from "../ErrorText";

function toStateValues(mapData: MapData): Record<string, number> {
  const values: Record<string, number> = {};
  for (const [abbr, totals] of Object.entries(mapData)) {
    const fullName = STATES_BY_ABBR[abbr];
    if (fullName && totals.total) {
      values[fullName] = totals.total;
    }
  }
  return values;
}

export default async function SuperPacSpendingMapWrapper({
  sector,
  showLink,
}: {
  sector: Sector;
  showLink?: boolean;
}) {
  const data = await fetchMapData(sector);
  const sectorText = humanizeSector(sector, {
    context: "industry",
    abbrev: true,
    lowercase: true,
  });
  if (isError(data)) {
    return (
      <div>
        <h2>Expenditures by {sectorText} PACs by state</h2>
        <ErrorText subject="PAC expenditures by state" />
      </div>
    );
  }
  const mapData = data as MapData;
  return (
    <>
      <h2
        id="super-pac-spending-by-state"
        className={sharedStyles.sectionTitle}
      >
        Expenditures by {sectorText} PACs by state
      </h2>
      <ChloroplethMap
        domain={generateDomain(10000, 10000000)}
        stateValues={toStateValues(mapData)}
        labelId="super-pac-spending-by-state"
      />
      {showLink && (
        <div className={tableStyles.viewMoreLinks}>
          <Link href={sectorHref("/2026/states", sector)}>
            &raquo; Spending by state
          </Link>
        </div>
      )}
    </>
  );
}
