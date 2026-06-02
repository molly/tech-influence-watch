import { Suspense } from "react";

import {
  fetchCommitteesWithContributions,
  fetchCommitteeTotalReceipts,
} from "@/app/actions/fetch";
import sharedStyles from "@/app/shared.module.css";
import {
  CommitteeConstantWithContributions,
  CommitteeTotalsSnapshot,
} from "@/app/types/Committee";
import { Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import { formatCompact } from "@/app/utils/humanize";

import ErrorText from "../ErrorText";
import AllCashByCommitteeChart from "./AllCashByCommitteeChart";
import { HorizontalBarsSkeleton } from "./HorizontalBars";

async function CashTotal({ sector }: { sector: Sector }) {
  const data = await fetchCommitteeTotalReceipts(sector);
  if (isError(data)) {
    return null;
  }
  const totals = data as CommitteeTotalsSnapshot;
  const total = (totals.net_receipts ?? totals.receipts) + totals.cash_on_hand;
  return (
    <span className={sharedStyles.sectionTitleAmount}>
      of{" "}
      <span className={sharedStyles.sectionTitleAmountValue}>
        {formatCompact(total)}
      </span>{" "}
      total
    </span>
  );
}

async function AllCashByCommitteeContent({
  labelId,
  sector,
}: {
  labelId: string;
  sector: Sector;
}) {
  const [committeesData, committeeRaisedData] = await Promise.all([
    fetchCommitteesWithContributions(sector),
    fetchCommitteeTotalReceipts(sector),
  ]);
  if (isError(committeesData)) {
    return <ErrorText subject="receipts by committee" />;
  }
  const max = isError(committeeRaisedData)
    ? undefined
    : (committeeRaisedData as CommitteeTotalsSnapshot).receipts;
  return (
    <AllCashByCommitteeChart
      committees={committeesData as CommitteeConstantWithContributions[]}
      labelId={labelId}
      sector={sector}
      max={max}
    />
  );
}

export default function AllCashByCommittee({ sector }: { sector: Sector }) {
  return (
    <section className={sharedStyles.section}>
      <h2 id="cash-by-committee-label" className={sharedStyles.sectionTitle}>
        PAC funds raised
        <Suspense fallback={null}>
          <CashTotal sector={sector} />
        </Suspense>
      </h2>
      <div className={sharedStyles.subtitle}>
        All cash raised by PACs, including unspent funds from previous election
        cycles and transfers from other committees
      </div>
      <Suspense fallback={<HorizontalBarsSkeleton numBars={4} />}>
        <AllCashByCommitteeContent
          labelId="cash-by-committee-label"
          sector={sector}
        />
      </Suspense>
    </section>
  );
}
