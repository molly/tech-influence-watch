import {
  fetchCommitteeDetails,
  fetchCommitteeDonors,
  fetchCommitteeTotalExpenditures,
} from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import InformationalTooltip from "@/app/components/InformationalTooltip";
import MoneyCard from "@/app/components/MoneyCard";
import sharedStyles from "@/app/shared.module.css";
import { CommitteeDetails } from "@/app/types/Committee";
import { Contributions } from "@/app/types/Contributions";
import { CommitteeTotalExpenditures } from "@/app/types/Expenditures";
import {
  isElectioneeringFiler,
  spendsOnCandidates,
} from "@/app/utils/committees";
import { is4xx, isError } from "@/app/utils/errors";
import { formatCurrency } from "@/app/utils/utils";

export default async function CommitteeExpendituresTotal({
  committeeId,
}: {
  committeeId: string;
}) {
  let [totalData, donorData, committeeData] = await Promise.all([
    fetchCommitteeTotalExpenditures(committeeId),
    fetchCommitteeDonors(committeeId),
    fetchCommitteeDetails(committeeId),
  ]);

  if (isError(committeeData)) {
    return null;
  }
  const committee = committeeData as CommitteeDetails;
  if (!spendsOnCandidates(committee.committee_type)) {
    return null;
  }
  if (isError(totalData) && !is4xx(totalData)) {
    return (
      <div className={sharedStyles.smallCard}>
        <ErrorText subject="the total expenditures by this committee" />
      </div>
    );
  }
  const totals = totalData as CommitteeTotalExpenditures;
  const expenditures = totals.expenditures || 0;
  const disbursements = totals.disbursements || 0;

  let tooltip;
  // Electioneering filers don't report receipts, so spending always exceeds
  // the (zero) amount raised and the reporting-lag explanation doesn't apply.
  if (!isError(donorData) && !isElectioneeringFiler(committee.committee_type)) {
    const donors = donorData as Contributions;
    const total = donors.total_contributed + donors.total_transferred;
    if (total < expenditures + disbursements) {
      tooltip = (
        <InformationalTooltip>
          <span>
            Due to different reporting frequencies for receipts and
            expenditures, committees sometimes appear to have spent more than
            they have raised.
          </span>
        </InformationalTooltip>
      );
    }
  }

  return (
    <MoneyCard
      amount={formatCurrency(expenditures, true)}
      topText="Total spending"
      tooltip={tooltip}
      bottomText={
        isElectioneeringFiler(committee.committee_type)
          ? "in electioneering communications."
          : "in independent expenditures."
      }
    />
  );
}
