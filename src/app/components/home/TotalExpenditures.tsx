import { fetchAllCommitteeTotalExpenditures } from "@/app/actions/fetch";
import sharedStyles from "@/app/shared.module.css";
import { type Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";
import { humanizeSector } from "@/app/utils/sector";

import ErrorText from "../ErrorText";
import MoneyCard from "../MoneyCard";

export default async function TotalDisbursements({
  className,
  sector,
}: {
  className?: string;
  sector: Sector;
}) {
  const expendituresData = await fetchAllCommitteeTotalExpenditures(sector);
  const sectorText = humanizeSector(sector, { abbrev: true });
  if (isError(expendituresData)) {
    return (
      <div className={`secondary ${sharedStyles.smallCard} ${className}`}>
        <ErrorText subject={`the total expenditures by ${sectorText} PACs`} />
      </div>
    );
  }
  const expenditures = expendituresData as number;
  return (
    <MoneyCard
      topText="PAC spending"
      amount={humanizeRoundedCurrency(expenditures, true, 1)}
      bottomText="spent directly on federal elections this cycle"
      className={className}
    />
  );
}
