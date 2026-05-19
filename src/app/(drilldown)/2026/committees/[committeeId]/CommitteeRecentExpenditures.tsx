import { Suspense } from "react";

import {
  fetchCommitteeDetails,
  fetchRecentCommitteeExpenditures,
} from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import RecentExpenditures from "@/app/components/RecentExpenditures";
import RecentExpendituresContent, {
  RecentExpendituresContentSkeleton,
} from "@/app/components/RecentExpendituresContent";
import sharedStyles from "@/app/shared.module.css";
import { CommitteeDetails } from "@/app/types/Committee";
import { Expenditure } from "@/app/types/Expenditures";
import { is4xx, isError } from "@/app/utils/errors";

export async function CommitteeRecentExpendituresContent({
  committeeId,
}: {
  committeeId: string;
}) {
  const [committeeData, expendituresData] = await Promise.all([
    fetchCommitteeDetails(committeeId),
    fetchRecentCommitteeExpenditures(committeeId),
  ]);
  if (isError(expendituresData) || isError(committeeData)) {
    return (
      <div className={sharedStyles.errorCardContent}>
        {is4xx(expendituresData) || is4xx(committeeData) ? (
          <span className="secondary">Committee not found.</span>
        ) : (
          <ErrorText subject="the recent expenditures by this committee" />
        )}
      </div>
    );
  }

  const committeeExpenditures = expendituresData as Expenditure[];
  const committee = committeeData as CommitteeDetails;
  if (!committeeExpenditures.length) {
    return (
      <div className={sharedStyles.errorCardContent}>
        No recent expenditures found for this committee.
      </div>
    );
  }
  return <RecentExpendituresContent expenditures={committeeExpenditures} />;
}

export default function CommitteeRecentExpenditures({
  committeeId,
}: {
  committeeId: string;
}) {
  return (
    <RecentExpenditures fullPage={true}>
      <Suspense fallback={<RecentExpendituresContentSkeleton />}>
        <CommitteeRecentExpendituresContent committeeId={committeeId} />
      </Suspense>
    </RecentExpenditures>
  );
}
