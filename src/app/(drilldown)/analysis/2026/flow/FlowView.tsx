import type { Metadata } from "next";

import {
  fetchAllCommitteeTotalExpenditures,
  fetchCommitteeTotalReceipts,
  fetchCompanyTotalSpending,
} from "@/app/actions/fetch";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import ErrorText from "@/app/components/ErrorText";
import sharedStyles from "@/app/shared.module.css";
import { CommitteeTotalsSnapshot } from "@/app/types/Committee";
import { CompanyTotals } from "@/app/types/Companies";
import { Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";
import { customMetadata } from "@/app/utils/metadata";
import { humanizeSector } from "@/app/utils/sector";

import FlowSankey from "./FlowSankey";

export function flowMetadata(): Metadata {
  return customMetadata({
    title: "How the money flows",
    description: `How ${humanizeSector("all", {
      lowercase: true,
      abbrev: true,
    })} money moves from companies and individuals through super PACs to candidates in the 2026 election cycle`,
  });
}

export default async function FlowView() {
  const sector: Sector = "all";
  const [companyData, receiptsData, expendituresData] = await Promise.all([
    fetchCompanyTotalSpending(sector),
    fetchCommitteeTotalReceipts(sector),
    fetchAllCommitteeTotalExpenditures(sector),
  ]);

  return (
    <div className={sharedStyles.main}>
      <Breadcrumbs crumbs={["Analysis", "How the money flows"]} />
      <h1 className={sharedStyles.title}>How the money flows</h1>
      <p className={sharedStyles.headerSubtitle}>
        Money from{" "}
        {humanizeSector(sector, { lowercase: true, abbrev: true })} companies
        and individuals can reach candidates two ways: through the super PACs the
        site tracks, or directly. This diagram traces what we can follow — and
        where the trail goes cold.
      </p>
      {isError(companyData) ||
      isError(receiptsData) ||
      isError(expendituresData) ? (
        <ErrorText subject="the money flow" />
      ) : (
        <FlowContents
          companyData={companyData as CompanyTotals}
          receiptsData={receiptsData as CommitteeTotalsSnapshot}
          expenditures={expendituresData as number}
        />
      )}
    </div>
  );
}

function FlowContents({
  companyData,
  receiptsData,
  expenditures,
}: {
  companyData: CompanyTotals;
  receiptsData: CommitteeTotalsSnapshot;
  expenditures: number;
}) {
  const total = companyData.total;
  const toTracked = companyData.to_tracked;
  const receipts = receiptsData.receipts;
  const directAndOther = Math.max(0, total - toTracked);

  return (
    <>
      <FlowSankey
        total={total}
        toTracked={toTracked}
        receipts={receipts}
        expenditures={expenditures}
      />
      <p>
        Tracked companies and individuals put{" "}
        <span className={sharedStyles.sectionTitleAmountValue}>
          {humanizeRoundedCurrency(total, true, 1)}
        </span>{" "}
        into the 2026 cycle. Of that,{" "}
        {humanizeRoundedCurrency(toTracked, true, 1)} went to the super PACs the
        site tracks. The other{" "}
        {humanizeRoundedCurrency(directAndOther, true, 1)} left those sources but
        is harder to follow. Some of it goes straight to candidates as direct
        contributions; the rest goes to party committees or to other super PACs
        that may still be sitting on it. There&rsquo;s no way to tell how much
        landed where.
      </p>
      <p>
        Those super PACs took in{" "}
        <span className={sharedStyles.sectionTitleAmountValue}>
          {humanizeRoundedCurrency(receipts, true, 1)}
        </span>{" "}
        in total, including money from contributors the site does not track. So
        far they have spent{" "}
        <span className={sharedStyles.sectionTitleAmountValue}>
          {humanizeRoundedCurrency(expenditures, true, 1)}
        </span>{" "}
        directly supporting or opposing candidates, holding the rest for later
        in the cycle. Candidates also receive an unknown share of the direct
        contributions above, so they have taken in more than{" "}
        {humanizeRoundedCurrency(expenditures, true, 1)} — there&rsquo;s just no
        way to put an exact figure on it.
      </p>
    </>
  );
}
