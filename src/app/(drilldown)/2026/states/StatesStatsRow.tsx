import { fetchMapData } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import TotalExpenditures from "@/app/components/home/TotalExpenditures";
import MoneyCard, { MoneyCardSkeleton } from "@/app/components/MoneyCard";
import { STATES_BY_ABBR } from "@/app/data/states";
import sharedStyles from "@/app/shared.module.css";
import { MapData } from "@/app/types/MapData";
import { Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";
import { humanizeSector } from "@/app/utils/sector";

import styles from "./page.module.css";

export function StatesStatsRowSkeleton() {
  return (
    <div className={styles.statsRow}>
      <MoneyCardSkeleton />
      <MoneyCardSkeleton />
      <MoneyCardSkeleton />
    </div>
  );
}

function StatePacActivity({
  statesWithPAC,
  statesWithMillion,
  error = false,
}: {
  statesWithPAC: number;
  statesWithMillion: number;
  error?: boolean;
}) {
  if (error) {
    return (
      <div className={`secondary ${sharedStyles.smallCard} `}>
        <ErrorText subject="the number of states with PAC spending" />
      </div>
    );
  }
  return (
    <MoneyCard
      topText="States with PAC activity"
      amount={statesWithPAC.toString()}
      bottomText={
        <span>
          {statesWithMillion > 0 && (
            <span>
              <span className="bold">{statesWithMillion}</span>
              {` of them ${statesWithMillion > 1 ? "have" : "has"} been the target of more than $1 million in PAC spending.`}
            </span>
          )}
        </span>
      }
    />
  );
}

function DirectContributions({
  totalDirectContribs,
  sector,
  error,
}: {
  totalDirectContribs: number;
  sector: Sector;
  error?: boolean;
}) {
  if (error) {
    return (
      <div className={`secondary ${sharedStyles.smallCard} `}>
        <ErrorText subject="direct industry contributions" />
      </div>
    );
  }
  return (
    <MoneyCard
      topText="Direct industry contributions"
      amount={humanizeRoundedCurrency(totalDirectContribs, true, 1)}
      bottomText={`from companies and individuals associated with the ${humanizeSector(sector, { lowercase: true })} ${sector === "all" ? "industries" : "industry"}`}
    />
  );
}

export default async function StatesStatsRow({ sector }: { sector: Sector }) {
  const mapDataResult = await fetchMapData(sector);

  let statesWithPAC = 0;
  let statesWithMillion = 0;
  let topStateNames: string[] = [];
  let totalDirectContribs = 0;
  const racesWithPAC = new Set<string>();

  if (!isError(mapDataResult)) {
    const mapData = mapDataResult as MapData;
    const stateEntries = Object.entries(mapData);

    statesWithPAC = stateEntries.filter(([, s]) => s.total > 0).length;
    statesWithMillion = stateEntries.filter(
      ([, s]) => s.total >= 1_000_000,
    ).length;

    topStateNames = stateEntries
      .filter(([, s]) => s.total > 0)
      .sort(([, a], [, b]) => b.total - a.total)
      .slice(0, 3)
      .map(([abbr]) => STATES_BY_ABBR[abbr])
      .filter(Boolean);

    totalDirectContribs = stateEntries.reduce(
      (sum, [, s]) => sum + (s.companies_total ?? 0),
      0,
    );

    stateEntries.forEach(([, s]) => {
      Object.keys(s.by_race).forEach((raceId) => racesWithPAC.add(raceId));
    });
  }

  return (
    <div className={styles.statsRow}>
      <TotalExpenditures sector={sector} />
      <StatePacActivity
        statesWithPAC={statesWithPAC}
        statesWithMillion={statesWithMillion}
        error={isError(mapDataResult)}
      />
      <DirectContributions
        totalDirectContribs={totalDirectContribs}
        sector={sector}
        error={isError(mapDataResult)}
      />
    </div>
  );
}
