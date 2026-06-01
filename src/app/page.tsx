import { Suspense } from "react";

import Header from "./components/Header";
import AllCashByCommittee from "./components/home/AllCashByCommittee";
import AllCompanySpendingByParty from "./components/home/AllCompanySpendingByParty";
import AllCompanySpendingMap from "./components/home/AllCompanySpendingMap";
import AllExpendituresByCommittee from "./components/home/AllExpendituresByCommittee";
import AllExpendituresByParty from "./components/home/AllExpendituresByParty";
import AllRecentContributions from "./components/home/AllRecentContributions";
import AllRecentExpenditures from "./components/home/AllRecentExpenditures";
import CombinedMapToggle from "./components/home/CombinedMapToggle";
import CompanyBubbleChart from "./components/home/CompanyBubbleChart";
import SuperPacSpendingMapWrapper from "./components/home/SuperPacSpendingMapWrapper";
import TechSectorBreakdown from "./components/home/TechSectorBreakdown";
import TotalCompanySpending from "./components/home/TotalCompanySpending";
import TotalExpenditures from "./components/home/TotalExpenditures";
import TotalRaised from "./components/home/TotalRaised";
import InfluencedRaces from "./components/InfluencedRaces";
import { MoneyCardSkeleton } from "./components/MoneyCard";
import SuperPACsByReceipts from "./components/PACsByReceipts";
import USMapSkeleton from "./components/skeletons/USMapSkeleton";
import SuperPACsByReceiptsTableContents from "./components/SuperPACsByReceiptsTableContents";
import TotalsRow from "./components/TotalsRow";
import styles from "./page.module.css";
import sharedStyles from "./shared.module.css";
import { parseSector } from "./utils/sector";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string }>;
}) {
  const { sector: rawSector } = await searchParams;
  const sector = parseSector(rawSector);

  return (
    <div className={sharedStyles.mainLayout}>
      <Header />
      <main className={sharedStyles.main}>
        <TotalsRow>
          <Suspense fallback={<MoneyCardSkeleton />}>
            <TotalCompanySpending sector={sector} />
          </Suspense>
          <Suspense fallback={<MoneyCardSkeleton />}>
            <TotalRaised sector={sector} />
          </Suspense>
          <Suspense fallback={<MoneyCardSkeleton />}>
            <TotalExpenditures sector={sector} />
          </Suspense>
        </TotalsRow>
        <div className={styles.columns}>
          <div className={styles.mainColumn}>
            <InfluencedRaces sector={sector} />
            <div className={styles.combinedMap}>
              <CombinedMapToggle
                companyMap={
                  <Suspense fallback={<USMapSkeleton />}>
                    <AllCompanySpendingMap
                      showHeader={true}
                      sector={sector}
                      showLink={true}
                    />
                  </Suspense>
                }
                superPacMap={
                  <Suspense fallback={<USMapSkeleton />}>
                    <SuperPacSpendingMapWrapper
                      showHeader={true}
                      sector={sector}
                      showLink={true}
                    />
                  </Suspense>
                }
              />
            </div>
            <SuperPACsByReceipts type="super" sector={sector}>
              <SuperPACsByReceiptsTableContents />
            </SuperPACsByReceipts>
          </div>
          <div className={styles.sideColumn}>
            {sector === "all" && <TechSectorBreakdown />}
            <CompanyBubbleChart sector={sector} />
            <AllCompanySpendingByParty sector={sector} />
            <AllCashByCommittee sector={sector} />
            <AllExpendituresByCommittee sector={sector} />
            <AllExpendituresByParty sector={sector} />
            <AllRecentExpenditures sector={sector} />
            <AllRecentContributions sector={sector} />
          </div>
        </div>
      </main>
    </div>
  );
}
