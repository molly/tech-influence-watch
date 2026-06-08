import { Suspense } from "react";

import { fetchCompanyTotalSpending } from "@/app/actions/fetch";
import sharedStyles from "@/app/shared.module.css";
import { CompanyTotals } from "@/app/types/Companies";
import { Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import { formatCompact } from "@/app/utils/humanize";
import { humanizeSector } from "@/app/utils/sector";

import ErrorText from "../ErrorText";
import { HorizontalBarsSkeleton, HorizontalPartyBars } from "./HorizontalBars";

async function SpendingTotal({ sector }: { sector: Sector }) {
  const data = await fetchCompanyTotalSpending(sector);
  if (isError(data)) {
    return null;
  }
  return (
    <span className={sharedStyles.sectionTitleAmount}>
      of{" "}
      <span className={sharedStyles.highlightFigure}>
        {formatCompact((data as CompanyTotals).fec_total)}
      </span>{" "}
      total
    </span>
  );
}

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
  // FEC-only: party bars sum to `fec_total` (reported dark money has no party).
  return (
    <HorizontalPartyBars partySummary={partySummary} max={summary.fec_total} />
  );
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
    <section className={sharedStyles.section}>
      <h2
        id="company-spending-by-party-label"
        className={sharedStyles.sectionTitle}
      >
        Contributions by party
        <Suspense fallback={null}>
          <SpendingTotal sector={sector} />
        </Suspense>
      </h2>
      <div className={sharedStyles.subtitle}>
        Contributions from {sectorText} companies and associated individuals to
        candidates and PACs
      </div>
      <Suspense fallback={<HorizontalBarsSkeleton numBars={4} />}>
        <AllCompanySpendingByPartyContent sector={sector} />
      </Suspense>
    </section>
  );
}
