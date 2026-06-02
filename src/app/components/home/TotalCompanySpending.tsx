import { fetchCompanyTotalSpending } from "@/app/actions/fetch";
import sharedStyles from "@/app/shared.module.css";
import { CompanyTotals } from "@/app/types/Companies";
import { type Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";
import { humanizeSector } from "@/app/utils/sector";

import ErrorText from "../ErrorText";
import InformationalTooltip from "../InformationalTooltip";
import MoneyCard from "../MoneyCard";

export default async function TotalCompanySpending({
  className,
  sector,
}: {
  className?: string;
  sector: Sector;
}) {
  const companyTotalsData = await fetchCompanyTotalSpending(sector);
  const sectorText = humanizeSector(sector, { context: "industry" });
  if (isError(companyTotalsData)) {
    return (
      <div className={`${sharedStyles.smallCard} ${className}`}>
        <ErrorText
          subject={`the total amount of money contributed by ${sectorText.toLowerCase()} companies and individuals`}
        />
      </div>
    );
  }
  const spending = companyTotalsData as CompanyTotals;
  return (
    <MoneyCard
      topText="Industry contributions"
      amount={humanizeRoundedCurrency(spending.total, true, 1)}
      bottomText={`from tracked ${sectorText.toLowerCase()} companies and individuals`}
      tooltip={
        <InformationalTooltip>
          {`This figure includes direct contributions to candidates and committees from ${sectorText.toLowerCase()} companies and individuals, as well as contributions from these entities to the PACs tracked on this site. It is based on manual classification and may not capture all industry-related spending — treat it as a conservative estimate.`}
        </InformationalTooltip>
      }
      className={className}
    />
  );
}
