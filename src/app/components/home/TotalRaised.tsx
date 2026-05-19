import { fetchCommitteeTotalReceipts } from "@/app/actions/fetch";
import sharedStyles from "@/app/shared.module.css";
import { CommitteeTotalsSnapshot } from "@/app/types/Committee";
import { type Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";
import { humanizeSector } from "@/app/utils/sector";
import ErrorText from "../ErrorText";
import MoneyCard from "../MoneyCard";

export default async function TotalRaised({
  className,
  sector,
}: {
  className?: string;
  sector: Sector;
}) {
  const receiptsData = await fetchCommitteeTotalReceipts(sector);
  const sectorText = humanizeSector(sector, {
    hyphen: true,
    abbrev: true,
    lowercase: true,
  });
  if (isError(receiptsData)) {
    return (
      <div
        className={`${sharedStyles.smallCard} ${sharedStyles.smallCardError} ${className}`}
      >
        <ErrorText
          subject={`the total amount of money raised by ${sectorText}focused political action committees`}
        />
      </div>
    );
  }
  const totals = receiptsData as CommitteeTotalsSnapshot;
  const confirmedCash =
    (totals.net_receipts ?? totals.receipts) + totals.cash_on_hand;

  let claimed;
  if (totals.claimed_committed) {
    claimed = ` They claim to have another ${humanizeRoundedCurrency(totals.claimed_committed, true)} committed.`;
  }
  const bottomText = (
    <div>
      held by {sectorText}focused committees.{claimed}
    </div>
  );

  return (
    <MoneyCard
      topText="PAC funds on hand"
      amount={humanizeRoundedCurrency(confirmedCash, true)}
      bottomText={bottomText}
      className={className}
    />
  );
}
