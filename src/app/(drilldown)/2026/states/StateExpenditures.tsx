import Link from "next/link";

import { fetchMapData } from "@/app/actions/fetch";
import HorizontalBars, {
  HorizontalBarsSkeleton,
} from "@/app/components/home/HorizontalBars";
import Skeleton from "@/app/components/skeletons/Skeleton";
import { STATES_BY_ABBR } from "@/app/data/states";
import sharedStyles from "@/app/shared.module.css";
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
                <Skeleton
                  width="5rem"
                  onCard={true}
                  className={sharedStyles.floatRight}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function StateExpenditures({
  sector = "all",
}: {
  sector?: Sector;
}) {
  const mapData = await fetchMapData(sector);
  if (isError(mapData)) {
    // Other segment in this section handles error message
    return null;
  }
  const data = mapData as MapData;
  const states = Object.keys(data)
    .filter((k) => data[k].total > 0)
    .sort((a, b) => data[b].total - data[a].total);
  const maxTotal = states.length > 0 ? data[states[0]].total : 1;

  return (
    <div className={styles.statesList}>
      {states.map((state) => {
        const stateName = STATES_BY_ABBR[state];
        const raceOrder = Object.keys(data[state].by_race).sort(
          (a, b) => data[state].by_race[b] - data[state].by_race[a],
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
                  value: data[state].total,
                  displayValue: formatCurrency(data[state].total, true),
                },
              ]}
              max={maxTotal}
            />
            <div className={styles.raceRows}>
              {raceOrder.map((raceKey) => (
                <div key={raceKey} className={styles.raceRow}>
                  <Link href={sectorHref(`/2026/elections/${raceKey}`, sector)}>
                    {getRaceName(raceKey)}
                  </Link>
                  <span className={styles.raceAmount}>
                    {formatCurrency(data[state].by_race[raceKey], true)}
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
