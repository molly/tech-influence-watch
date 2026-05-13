import { formatCurrency } from "../../../../utils/utils";

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
      bottomText={
        <div>
          {donors.total_transferred > 0 ||
          (committee.last_cash_on_hand_end_period &&
            committee.last_cash_on_hand_end_period > 0) ||
          (committee.claimedCommitted && committee.claimedCommitted > 0) ? (
            <>
              <div>
                {`${formatCurrency(donors.total_contributed, true)} came from direct contributions.`}
              </div>
              {donors.total_transferred > 0 && (
                <div>
                  {`${formatCurrency(donors.total_transferred, true)} was transferred from other committees.`}
                </div>
              )}
              {(committee.last_cash_on_hand_end_period || 0) > 0 && (
                <div>
                  {`${formatCurrency(committee.last_cash_on_hand_end_period, true)} was cash on hand from last cycle.`}
                </div>
              )}
              {(committee.claimedCommitted || 0) > 0 && (
                <div>
                  {`They claim to have ${formatCurrency(committee.claimedCommitted, true)} in committed funds, though these have not yet been reflected in FEC filings.`}
                </div>
              )}
            </>
          ) : undefined}
        </div>
      }
    />
  );
}
