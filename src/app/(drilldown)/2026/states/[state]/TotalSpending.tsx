import { fetchStateExpenditures } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import MoneyCard from "@/app/components/MoneyCard";
import sharedStyles from "@/app/shared.module.css";
import { PopulatedStateExpenditures } from "@/app/types/Expenditures";
import { is4xx, isError } from "@/app/utils/errors";
import { formatCurrency } from "@/app/utils/utils";

import styles from "./page.module.css";

export default async function TotalSpending({
  stateAbbr,
  titlecasedState,
}: {
  stateAbbr: string;
  titlecasedState: string;
}) {
  let data = await fetchStateExpenditures(stateAbbr);

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
      topText="Cryptocurrency-focused PACs have spent"
      amount={formatCurrency(expenditures.total, true)}
      bottomText={`to influence 2026 elections in ${titlecasedState}`}
    />
  );
}
