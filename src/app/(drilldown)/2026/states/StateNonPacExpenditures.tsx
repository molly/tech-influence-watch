import Link from "next/link";
import { Fragment } from "react";

import { fetchAllRaceIds, fetchMapData } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import Skeleton from "@/app/components/skeletons/Skeleton";
import { STATES_BY_ABBR } from "@/app/data/states";
import sharedStyles from "@/app/shared.module.css";
import { MapData } from "@/app/types/MapData";
import { Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import { getRaceName } from "@/app/utils/races";
import { range } from "@/app/utils/range";
import { formatCurrency } from "@/app/utils/utils";

import styles from "./page.module.css";

export function StateExpendituresSkeleton() {
  return (
    <tbody>
      {range(5).map((i) => (
        <Fragment key={`state-skeleton-${i}`}>
          <tr>
            <td colSpan={2}>
              <Skeleton width="8rem" onCard={true} />
            </td>
            <td>
              <Skeleton width="6rem" onCard={true} className={sharedStyles.floatRight} />
            </td>
          </tr>
          {range(3).map((j) => (
            <tr key={`race-skeleton-${i}-${j}`}>
              <td></td>
              <td>
                <Skeleton width="10rem" onCard={true} />
              </td>
              <td>
                <Skeleton
                  width="5rem"
                  onCard={true}
                  className={sharedStyles.floatRight}
                />
              </td>
            </tr>
          ))}
        </Fragment>
      ))}
    </tbody>
  );
}

export default async function StateNonPacExpenditures({ sector = "all" }: { sector?: Sector }) {
  const [allRaceIdsData, mapDataResult] = await Promise.all([
    fetchAllRaceIds(),
    fetchMapData(sector),
  ]);
  if (isError(allRaceIdsData)) {
    return (
      <tbody>
        <tr>
          <td colSpan={3}>
            <ErrorText subject="direct contributions by state" />
          </td>
        </tr>
      </tbody>
    );
  }
  const data = allRaceIdsData as Record<string, string[]>;
  const mapData = !isError(mapDataResult) ? (mapDataResult as MapData) : null;
  const states = Object.keys(data)
    .filter((k) => (mapData?.[k]?.companies_total ?? 0) > 0)
    .sort((a, b) => {
      const aTotal = mapData?.[a]?.companies_total ?? 0;
      const bTotal = mapData?.[b]?.companies_total ?? 0;
      return bTotal - aTotal;
    });

  return (
    <tbody>
      {states.map((state) => {
        const stateName = STATES_BY_ABBR[state];
        if (!stateName) {
          return null;
        }
        const total = mapData?.[state]?.companies_total;
        return (
          <Fragment key={state}>
            <tr className={styles.headerRow}>
              <td colSpan={2} className="text-cell">
                <Link
                  href={`/2026/states/${stateName.toLowerCase().replace(" ", "-")}`}
                >
                  {stateName}
                </Link>
              </td>
              <td className="number-cell">
                {total ? formatCurrency(total, true) : null}
              </td>
            </tr>
            {data[state].map((raceId) => {
              return (
                <tr key={`${state}-${raceId}`}>
                  <td></td>
                  <td className="text-cell">
                    <Link href={`/2026/elections/${state}-${raceId}`}>
                      {getRaceName(raceId)}
                    </Link>
                  </td>
                </tr>
              );
            })}
          </Fragment>
        );
      })}
    </tbody>
  );
}
