import {
  fetchCommitteeDetails,
  fetchCommitteeTotalExpenditures,
} from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import Skeleton from "@/app/components/skeletons/Skeleton";
import SpendingByPartyWithOpposition, {
  SpendingByPartySkeleton,
} from "@/app/components/SpendingByPartyWithOpposition";
import sharedStyles from "@/app/shared.module.css";
import { CommitteeDetails } from "@/app/types/Committee";
import { CommitteeTotalExpenditures } from "@/app/types/Expenditures";
import { is4xx, isError } from "@/app/utils/errors";
import { formatCompact } from "@/app/utils/humanize";

export function CommitteeExpendituresByPartySkeleton() {
  return (
    <>
      <h2 className={sharedStyles.sectionTitle} id="expenditures-label">
        Expenditures
        <span className={sharedStyles.sectionTitleAmount}>
          of <Skeleton width="3rem" inline={true} />
          total
        </span>
      </h2>
      <SpendingByPartySkeleton />
    </>
  );
}

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

  return (
    <>
      <h2 className={sharedStyles.sectionTitle} id="expenditures-label">
        Expenditures
        {max != null && (
          <span className={sharedStyles.sectionTitleAmount}>
            of{" "}
            <span className={sharedStyles.highlightFigure}>
              {formatCompact(max)}
            </span>{" "}
            total
          </span>
        )}
      </h2>
      {expenditures ? (
        <SpendingByPartyWithOpposition
          expenditures={expenditures}
          labelId="expenditures-label"
          max={max}
        />
      ) : (
        <p>{`${committee.name} has not made any independent expenditures.`}</p>
      )}
    </>
  );
}
