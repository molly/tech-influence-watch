import Link from "next/link";

import { fetchMapData } from "@/app/actions/fetch";
import tableStyles from "@/app/components/tables.module.css";
import { STATES_BY_ABBR } from "@/app/data/states";
import { MapData } from "@/app/types/MapData";
import { type Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import { sectorHref } from "@/app/utils/sector";

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
  if (isError(data)) {
    return <ErrorText subject="PAC expenditures by state" />;
  }
  const mapData = data as MapData;
  return (
    <>
      <ChloroplethMap
        domain={generateDomain(10000, 10000000)}
        stateValues={toStateValues(mapData)}
        labelId="spending-by-state"
      />
      {showLink && (
        <div className={tableStyles.viewMoreLinks}>
          <Link href={sectorHref("/2026/states", sector)}>
            &raquo; Full spending-by-state map
          </Link>
        </div>
      )}
    </>
  );
}
