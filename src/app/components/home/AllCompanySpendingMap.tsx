import { fetchMapData } from "@/app/actions/fetch";
import { generateDomain } from "@/app/components/chloroplethConstants";
import ChloroplethMap from "@/app/components/ChloroplethMap";
import ErrorText from "@/app/components/ErrorText";
import tableStyles from "@/app/components/tables.module.css";
import { STATES_BY_ABBR } from "@/app/data/states";
import sharedStyles from "@/app/shared.module.css";
import { MapData } from "@/app/types/MapData";
import { type Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import { humanizeSector, sectorHref } from "@/app/utils/sector";
import Link from "next/link";
import InformationalTooltip from "../InformationalTooltip";

function toStateValues(mapData: MapData): Record<string, number> {
  const values: Record<string, number> = {};
  for (const [abbr, totals] of Object.entries(mapData)) {
    const fullName = STATES_BY_ABBR[abbr];
    if (fullName) {
      values[fullName] = totals?.companies_total || 0;
    }
  }
  return values;
}

export default async function AllCompanySpendingMap({
  sector,
  showLink,
}: {
  sector: Sector;
  showLink?: boolean;
}) {
  const data = await fetchMapData(sector);
  const sectorText = humanizeSector(sector, {
    abbrev: true,
    lowercase: true,
    hyphen: true,
  });
  if (isError(data)) {
    return (
      <div>
        <h2
          id="company-spending-by-state"
          className={sharedStyles.sectionTitle}
        >
          Approximate
          <InformationalTooltip>
            <p>
              Some committees (particularly super PACs) spend cross-state or are
              not associated with a specific candidate, and contributions to
              them are omitted from this chart.
            </p>
            <p>
              This relies on manual classification and so represents a
              conservative estimate of industry spending.
            </p>
          </InformationalTooltip>{" "}
          {sectorText}linked contributions to candidates by state
        </h2>
        <ErrorText subject="expenditures by state" />
      </div>
    );
  }
  const mapData = data as MapData;
  return (
    <>
      <h2 id="company-spending-by-state" className={sharedStyles.sectionTitle}>
        Approximate
        <InformationalTooltip>
          <p>
            Some committees (particularly super PACs) spend cross-state or are
            not associated with a specific candidate, and contributions to them
            are omitted from this chart.
          </p>
          <p>
            This relies on manual classification and so represents a
            conservative estimate of industry spending.
          </p>
        </InformationalTooltip>{" "}
        {sectorText}linked contributions to candidates by state
      </h2>
      <ChloroplethMap
        domain={generateDomain(10000, 10000000)}
        stateValues={toStateValues(mapData)}
        labelId="company-spending-by-state"
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
