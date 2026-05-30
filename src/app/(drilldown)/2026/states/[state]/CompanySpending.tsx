import { fetchStateExpenditures } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import MoneyCard from "@/app/components/MoneyCard";
import sharedStyles from "@/app/shared.module.css";
import { PopulatedStateExpenditures } from "@/app/types/Expenditures";
import { Sector } from "@/app/types/Sector";
import { is4xx, isError } from "@/app/utils/errors";
import { humanizeSector } from "@/app/utils/sector";
import { formatCurrency } from "@/app/utils/utils";

import styles from "./page.module.css";

export default async function CompanySpending({
  sector,
  stateAbbr,
  titlecasedState,
}: {
  sector: Sector;
  stateAbbr: string;
  titlecasedState: string;
}) {
  let data = await fetchStateExpenditures(stateAbbr, sector);

  if (isError(data)) {
    let errorText;
    if (is4xx(data)) {
      errorText = (
        <span className="secondary">
          No spending has been recorded in this state.
        </span>
      );
    } else {
      errorText = <ErrorText subject="state election information" />;
    }
    return (
      <div className={`${sharedStyles.smallCard} ${styles.totalSpendingCard}`}>
        {errorText}
      </div>
    );
  }

  const expenditures = data as PopulatedStateExpenditures;

  return (
    <MoneyCard
      className={styles.totalSpendingCard}
      topText="Direct contributions"
      amount={formatCurrency(expenditures.companies_total, true)}
      bottomText={`by ${humanizeSector(sector, { lowercase: true })} companies and associated individuals to candidates in ${titlecasedState}`}
    />
  );
}
