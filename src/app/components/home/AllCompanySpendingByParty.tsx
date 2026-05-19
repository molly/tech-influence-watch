import { Suspense } from "react";

import { fetchCompanyTotalSpending } from "@/app/actions/fetch";
import styles from "@/app/page.module.css";
import sharedStyles from "@/app/shared.module.css";
import { CompanyTotals } from "@/app/types/Companies";
import { Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import { humanizeSector } from "@/app/utils/sector";

import ErrorText from "../ErrorText";
import HorizontalPartyBars, {
  HorizontalPartyBarsSkeleton,
} from "./HorizontalPartyBars";

async function AllCompanySpendingByPartyContent({
  sector,
}: {
  sector: Sector;
}) {
  const data = await fetchCompanyTotalSpending(sector);
  if (isError(data)) {
    return <ErrorText subject="company spending by party" />;
  }
  const summary = data as CompanyTotals;
  const { DEM, REP, UNK, ...rest } = summary.by_party;
  const partySummary = {
    DEM,
    REP,
    UNK,
    OTH: Object.values(rest).reduce((acc, amt) => acc + amt, 0),
  };
  return <HorizontalPartyBars partySummary={partySummary} />;
}

export default function AllCompanySpendingByParty({
  sector,
}: {
  sector: Sector;
}) {
  const sectorText = humanizeSector(sector, {
    context: "industry",
    abbrev: true,
    lowercase: true,
  });
  return (
    <section className={styles.companySpendingCard}>
      <h2
        id="company-spending-by-party-label"
        className={sharedStyles.sectionTitle}
      >
        Contributions by party
      </h2>
      <div className={styles.subtitle}>
        Contributions from {sectorText} companies and associated individuals to
        candidates and PACs
      </div>
      <Suspense fallback={<HorizontalPartyBarsSkeleton numBars={4} />}>
        <AllCompanySpendingByPartyContent sector={sector} />
      </Suspense>
    </section>
  );
}
