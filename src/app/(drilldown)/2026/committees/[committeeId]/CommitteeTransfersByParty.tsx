import { fetchCommitteeDetails } from "@/app/actions/fetch";
import { HorizontalPartyBars } from "@/app/components/home/HorizontalBars";
import sharedStyles from "@/app/shared.module.css";
import { CommitteeDetails } from "@/app/types/Committee";
import { isError } from "@/app/utils/errors";
import { formatCompact } from "@/app/utils/humanize";

export default async function CommitteeTransfersByParty({
  committeeId,
}: {
  committeeId: string;
}) {
  const committeeData = await fetchCommitteeDetails(committeeId);
  if (isError(committeeData)) {
    return null;
  }

  const committee = committeeData as CommitteeDetails;
  const byParty = committee.transfers_by_party;

  if (!byParty || !Object.keys(byParty).length) {
    return null;
  }

  const total = Object.values(byParty).reduce((sum, amount) => sum + amount, 0);

  return (
    <>
      <h2 className={sharedStyles.sectionTitle}>
        Transfers
        <span className={sharedStyles.sectionTitleAmount}>
          of{" "}
          <span className={sharedStyles.sectionTitleAmountValue}>
            {formatCompact(total)}
          </span>{" "}
          total
        </span>
      </h2>
      <HorizontalPartyBars partySummary={byParty} max={total} />
    </>
  );
}
