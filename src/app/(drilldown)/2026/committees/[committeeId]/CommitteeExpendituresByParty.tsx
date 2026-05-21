import {
  fetchCommitteeDetails,
  fetchCommitteeTotalExpenditures,
} from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import SpendingByPartyWithOpposition from "@/app/components/SpendingByPartyWithOpposition";
import { CommitteeDetails } from "@/app/types/Committee";
import { CommitteeTotalExpenditures } from "@/app/types/Expenditures";
import { is4xx, isError } from "@/app/utils/errors";

export default async function CommitteeExpendituresByParty({
  committeeId,
}: {
  committeeId: string;
}) {
  const [committeeData, totalData] = await Promise.all([
    fetchCommitteeDetails(committeeId),
    fetchCommitteeTotalExpenditures(committeeId),
  ]);

  if (isError(committeeData)) {
    if (is4xx(committeeData)) {
      return <div className="secondary">Committee not found.</div>;
    } else {
      return <ErrorText subject="the expenditures by this committee" />;
    }
  }

  const committee = committeeData as CommitteeDetails;
  const expenditures = committee.by_party;
  const max = isError(totalData)
    ? undefined
    : ((totalData as CommitteeTotalExpenditures).expenditures ?? undefined);

  return expenditures ? (
    <SpendingByPartyWithOpposition
      expenditures={expenditures}
      labelId="expenditures-label"
      max={max}
    />
  ) : (
    <p>{`${committee.name} has not made any independent expenditures.`}</p>
  );
}
