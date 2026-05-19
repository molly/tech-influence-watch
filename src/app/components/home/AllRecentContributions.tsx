import { Suspense } from "react";

import {
  fetchAllRecentContributions,
  fetchConstant,
} from "@/app/actions/fetch";
import styles from "@/app/page.module.css";
import sharedStyles from "@/app/shared.module.css";
import { CommitteeConstant } from "@/app/types/Committee";
import { RecentContribution } from "@/app/types/Contributions";
import { Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";

import ErrorText from "../ErrorText";
import RecentContributions from "../RecentContributions";
import RecentContributionsContent, {
  RecentContributionsContentSkeleton,
} from "../RecentContributionsContent";

async function AllRecentContributionsContent({
  fullPage,
  sector,
}: {
  fullPage?: boolean;
  sector?: Sector;
}) {
  const [data, committeesData] = await Promise.all([
    fetchAllRecentContributions(sector),
    fetchConstant<Record<string, CommitteeConstant>>("committees"),
  ]);
  if (isError(data)) {
    return (
      <div
        className={
          fullPage
            ? sharedStyles.errorCardContentStandalone
            : sharedStyles.errorCardContent
        }
      >
        <ErrorText subject="recent contributions" />
      </div>
    );
  }

  const trackedCommitteeIds = new Set(Object.keys(committeesData ?? {}));
  const allContributions = data as RecentContribution[];
  const contributions = fullPage
    ? allContributions
    : allContributions.slice(0, 5);
  return (
    <RecentContributionsContent
      contributions={contributions}
      trackedCommitteeIds={trackedCommitteeIds}
    />
  );
}

export default async function AllRecentContributions({
  fullPage,
  sector,
}: {
  fullPage?: boolean;
  sector?: Sector;
}) {
  return (
    <RecentContributions
      className={styles.recentContributions}
      noHeader={fullPage}
      fullPage={fullPage}
      sector={sector}
    >
      <Suspense
        fallback={<RecentContributionsContentSkeleton fullPage={fullPage} />}
      >
        <AllRecentContributionsContent fullPage={fullPage} sector={sector} />
      </Suspense>
    </RecentContributions>
  );
}
