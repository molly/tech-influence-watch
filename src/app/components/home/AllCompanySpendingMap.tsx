import Link from "next/link";

import { fetchMapData } from "@/app/actions/fetch";
import { generateDomain } from "@/app/components/chloroplethConstants";
import ChloroplethMap from "@/app/components/ChloroplethMap";
import styles from "@/app/components/chloroplethMap.module.css";
import ErrorText from "@/app/components/ErrorText";
import tableStyles from "@/app/components/tables.module.css";
import { STATES_BY_ABBR } from "@/app/data/states";
import { MapData } from "@/app/types/MapData";
import { type Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import { sectorHref } from "@/app/utils/sector";

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
  showDisclaimer,
}: {
  sector: Sector;
  showLink?: boolean;
  showDisclaimer?: boolean;
}) {
  const data = await fetchMapData(sector);
  if (isError(data)) {
    return <ErrorText subject="expenditures by state" />;
  }
  const mapData = data as MapData;
  return (
    <>
      <ChloroplethMap
        domain={generateDomain(5000, 50000000)}
        legendDomain={generateDomain(5000, 10000000)}
        stateValues={toStateValues(mapData)}
        labelId="spending-by-state"
      />
      {showDisclaimer && (
        <div className={styles.mapSubtitle}>
          <p>
            Some committees (particularly super PACs) spend cross-state or are
            not associated with a specific candidate, and contributions to them
            are omitted from this chart. This relies on manual classification
            and so represents a conservative estimate of industry spending.
          </p>
        </div>
      )}
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
