import Link from "next/link";

import { fetchMapData } from "@/app/actions/fetch";
import HorizontalBars, {
  HorizontalBarsSkeleton,
} from "@/app/components/home/HorizontalBars";
import Skeleton from "@/app/components/skeletons/Skeleton";
import { STATES_BY_ABBR } from "@/app/data/states";
import { MapData } from "@/app/types/MapData";
import { Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import { getRaceName } from "@/app/utils/races";
import { range } from "@/app/utils/range";
import { sectorHref } from "@/app/utils/sector";
import { formatCurrency } from "@/app/utils/utils";

import styles from "./page.module.css";

export function StateExpendituresSkeleton() {
  return (
    <div className={styles.statesList}>
      {range(5).map((i) => (
        <div key={`state-skeleton-${i}`} className={styles.stateGroup}>
          <HorizontalBarsSkeleton numBars={1} />
          <div className={styles.raceRows}>
            {range(3).map((j) => (
              <div key={`race-skeleton-${i}-${j}`} className={styles.raceRow}>
                <Skeleton width="10rem" onCard={true} />
                <Skeleton width="5rem" onCard={true} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function StateNonPacExpenditures({
  sector = "all",
}: {
  sector?: Sector;
}) {
  const mapDataResult = await fetchMapData(sector);
  if (isError(mapDataResult)) {
    // Other segment in this section handles error message
    return null;
  }
  const mapData = mapDataResult as MapData;
  const states = Object.keys(mapData)
    .filter((k) => (mapData[k]?.companies_total ?? 0) > 0)
    .sort((a, b) => {
      const aTotal = mapData[a]?.companies_total ?? 0;
      const bTotal = mapData[b]?.companies_total ?? 0;
      return bTotal - aTotal;
    });
  const maxTotal =
    states.length > 0 ? (mapData[states[0]]?.companies_total ?? 1) : 1;

  return (
    <div className={styles.statesList}>
      {states.map((state) => {
        const stateName = STATES_BY_ABBR[state];
        if (!stateName) {
          return null;
        }
        const total = mapData[state]?.companies_total;
        const byRaceCompanies = mapData[state]?.by_race_companies ?? {};
        const raceOrder = Object.keys(byRaceCompanies).sort(
          (a, b) => byRaceCompanies[b] - byRaceCompanies[a],
        );
        return (
          <div key={state} className={styles.stateGroup}>
            <HorizontalBars
              items={[
                {
                  key: state,
                  label: stateName,
                  labelNode: (
                    <Link
                      href={sectorHref(
                        `/2026/states/${stateName.toLowerCase().replace(" ", "-")}`,
                        sector,
                      )}
                    >
                      {stateName}
                    </Link>
                  ),
                  value: total ?? 0,
                  displayValue: total ? formatCurrency(total, true) : undefined,
                },
              ]}
              max={maxTotal}
            />
            <div className={styles.raceRows}>
              {raceOrder.map((fullRaceId) => (
                <div key={fullRaceId} className={styles.raceRow}>
                  <Link href={sectorHref(`/2026/elections/${fullRaceId}`, sector)}>
                    {getRaceName(fullRaceId)}
                  </Link>
                  <span className={styles.raceAmount}>
                    {formatCurrency(byRaceCompanies[fullRaceId], true)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
