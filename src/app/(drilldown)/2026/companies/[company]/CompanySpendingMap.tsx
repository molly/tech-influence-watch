import { fetchMapData } from "@/app/actions/fetch";
import { generateDomain } from "@/app/components/chloroplethConstants";
import ChloroplethMap from "@/app/components/ChloroplethMap";
import ErrorText from "@/app/components/ErrorText";
import { STATES_BY_ABBR } from "@/app/data/states";
import { MapData } from "@/app/types/MapData";
import { isError } from "@/app/utils/errors";

import styles from "./page.module.css";
import SpendingByStateBarChart from "./SpendingByStateBarChart";

function toStateValues(
  mapData: MapData,
  companyId: string,
): Record<string, number> {
  const values: Record<string, number> = {};
  for (const [abbr, totals] of Object.entries(mapData)) {
    const fullName = STATES_BY_ABBR[abbr];
    if (fullName) {
      values[fullName] = 0;
      if ("by_companies" in totals && totals.by_companies) {
        values[fullName] = totals.by_companies[companyId] || 0;
      }
    }
  }
  return values;
}

export default async function CompanySpendingMap({
  companyId,
  labelId,
}: {
  companyId: string;
  labelId: string;
}) {
  const data = await fetchMapData();
  if (isError(data)) {
    return <ErrorText subject="expenditures by state" />;
  }
  const mapData = data as MapData;
  const stateValues = toStateValues(mapData, companyId);
  return (
    <>
      <ChloroplethMap
        domain={generateDomain(5000, 5000000)}
        stateValues={stateValues}
        labelId={labelId}
      />
      <div className={styles.spendingByStateBarChart}>
        <SpendingByStateBarChart stateValues={stateValues} />
      </div>
    </>
  );
}
