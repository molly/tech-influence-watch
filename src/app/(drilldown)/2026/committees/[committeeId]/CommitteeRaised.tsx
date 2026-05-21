import {
  fetchCommitteeDetails,
  fetchCommitteeDonors,
} from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import MoneyCard from "@/app/components/MoneyCard";
import sharedStyles from "@/app/shared.module.css";
import { CommitteeDetails } from "@/app/types/Committee";
import { Contributions } from "@/app/types/Contributions";
import { is4xx, isError } from "@/app/utils/errors";

import { formatCurrency } from "../../../../utils/utils";
import styles from "./page.module.css";

function renderBottomText(committee: CommitteeDetails, donors: Contributions) {
  const hasBreakdown =
    donors.total_transferred > 0 ||
    (committee.last_cash_on_hand_end_period &&
      committee.last_cash_on_hand_end_period > 0) ||
    (committee.claimedCommitted && committee.claimedCommitted > 0);

  if (!hasBreakdown) {
    return <div>from direct contributions this cycle.</div>;
  }

  return (
    <div className={styles.moneyCardBreakdown}>
      <div className={styles.moneyCardBreakdownRow}>
        <span>Direct contributions this cycle</span>
        <span className={styles.moneyCardBreakdownAmount}>
          {formatCurrency(donors.total_contributed, true)}
        </span>
      </div>
      {donors.total_transferred > 0 && (
        <div className={styles.moneyCardBreakdownRow}>
          <span>Transferred from other committees</span>
          <span className={styles.moneyCardBreakdownAmount}>
            {formatCurrency(donors.total_transferred, true)}
          </span>
        </div>
      )}
      {(committee.last_cash_on_hand_end_period || 0) > 0 && (
        <div className={styles.moneyCardBreakdownRow}>
          <span>Carried forward from last cycle</span>
          <span className={styles.moneyCardBreakdownAmount}>
            {formatCurrency(committee.last_cash_on_hand_end_period, true)}
          </span>
        </div>
      )}
      {(committee.claimedCommitted || 0) > 0 && (
        <div className={styles.moneyCardBreakdownRow}>
          <span>Committed funds (not yet in FEC filings)</span>
          <span className={styles.moneyCardBreakdownAmount}>
            {formatCurrency(committee.claimedCommitted, true)}
          </span>
        </div>
      )}
    </div>
  );
}

export default async function CommitteeRaised({
  committeeId,
}: {
  committeeId: string;
}) {
  const [committeeData, donorData] = await Promise.all([
    fetchCommitteeDetails(committeeId),
    fetchCommitteeDonors(committeeId),
  ]);

  if (isError(committeeData) || isError(donorData)) {
    let errorText;
    if (is4xx(committeeData) || is4xx(donorData)) {
      errorText = <span className="secondary">Committee not found.</span>;
    } else {
      errorText = <ErrorText subject="the amount raised by this committee" />;
    }
    return <div className={sharedStyles.smallCard}>{errorText}</div>;
  }

  const committee = committeeData as CommitteeDetails;
  const donors = donorData as Contributions;

  const total =
    donors.total_contributed +
    donors.total_transferred +
    (committee.last_cash_on_hand_end_period || 0);

  return (
    <MoneyCard
      amount={formatCurrency(total || 0, true)}
      topText={"Total raised"}
      bottomText={renderBottomText(committee, donors)}
    />
  );
}
