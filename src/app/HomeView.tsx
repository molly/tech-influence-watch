import Link from "next/link";
import { Suspense } from "react";

import Header from "./components/Header";
import AllCashByCommittee from "./components/home/AllCashByCommittee";
import AllCompanySpendingByParty from "./components/home/AllCompanySpendingByParty";
import AllCompanySpendingMap from "./components/home/AllCompanySpendingMap";
import AllExpendituresByCommittee from "./components/home/AllExpendituresByCommittee";
import AllExpendituresByParty from "./components/home/AllExpendituresByParty";
import AllRecentContributions from "./components/home/AllRecentContributions";
import AllRecentExpenditures from "./components/home/AllRecentExpenditures";
import AnnouncementBanner from "./components/home/AnnouncementBanner";
import CombinedMapToggle from "./components/home/CombinedMapToggle";
import CompanyBubbleChart from "./components/home/CompanyBubbleChart";
import FeaturedTracker, {
  FeaturedTrackerSkeleton,
} from "./components/home/FeaturedTracker";
import NotablePatterns from "./components/home/NotablePatterns";
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
import { Sector } from "./types/Sector";

export default async function HomeView({ sector }: { sector: Sector }) {
  return (
    <div className={sharedStyles.mainLayout}>
      <Header />
      <main className={sharedStyles.main}>
        {/* Standalone announcement banner — remove this section once stale */}
        <AnnouncementBanner />
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
        <span className={sharedStyles.subtitle}>
          These three figures aren&rsquo;t additive&nbsp;&mdash; they show the
          same money at three different stages, as it flows from donors to PACs
          to elections.{" "}
          <span className={styles.flowLink}>
            <Link href="/2026/explainers/flow">
              &raquo; Follow the money flow
            </Link>
          </span>
        </span>
        <div className={styles.columns}>
          <div className={styles.mainColumn}>
            <div className={styles.order1}>
              <InfluencedRaces sector={sector} />
            </div>
            <div className={`${styles.combinedMap} ${styles.order6}`}>
              <CombinedMapToggle
                companyMap={
                  <Suspense fallback={<USMapSkeleton />}>
                    <AllCompanySpendingMap
                      sector={sector}
                      showLink={true}
                      showDisclaimer={true}
                    />
                  </Suspense>
                }
                superPacMap={
                  <Suspense fallback={<USMapSkeleton />}>
                    <SuperPacSpendingMapWrapper
                      sector={sector}
                      showLink={true}
                    />
                  </Suspense>
                }
              />
            </div>
            <div className={styles.order9}>
              <SuperPACsByReceipts type="super" sector={sector}>
                <SuperPACsByReceiptsTableContents />
              </SuperPACsByReceipts>
            </div>
            <div className={styles.order13}>
              <AllRecentExpenditures sector={sector} />
            </div>
            <div className={styles.order7}>
              <AllRecentContributions sector={sector} />
            </div>
          </div>
          <div className={styles.sideColumn}>
            <div className={styles.order2}>
              <Suspense fallback={<FeaturedTrackerSkeleton />}>
                <FeaturedTracker />
              </Suspense>
            </div>
            {sector === "all" && (
              <div className={styles.order12}>
                <NotablePatterns />
              </div>
            )}
            {sector === "all" && (
              <div className={styles.order4}>
                <TechSectorBreakdown />
              </div>
            )}
            <div className={styles.order5}>
              <CompanyBubbleChart sector={sector} />
            </div>
            <div className={styles.order3}>
              <AllCompanySpendingByParty sector={sector} />
            </div>
            <div className={styles.order8}>
              <AllCashByCommittee sector={sector} />
            </div>
            <div className={styles.order10}>
              <AllExpendituresByCommittee sector={sector} />
            </div>
            <div className={styles.order11}>
              <AllExpendituresByParty sector={sector} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
