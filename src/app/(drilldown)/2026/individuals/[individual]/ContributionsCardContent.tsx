"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import Contribution from "@/app/components/individualOrCompany/Contribution";
import ContributionsGroup, {
  ContributionsGroupSkeleton,
} from "@/app/components/individualOrCompany/ContributionsGroup";
import Skeleton from "@/app/components/skeletons/Skeleton";
import sharedStyles from "@/app/shared.module.css";
import {
  IndividualOrCompanyContributionGroup,
  RecipientDetails,
} from "@/app/types/Contributions";
import { IndividualContributions } from "@/app/types/Individuals";
import { humanizeApproximateRounded } from "@/app/utils/humanize";
import { range } from "@/app/utils/range";

function ByDate({
  individual,
  recipientsByCommitteeId,
  nonCandidateCommittees,
}: {
  individual: IndividualContributions;
  recipientsByCommitteeId: Record<string, RecipientDetails>;
  nonCandidateCommittees: Set<string>;
}) {
  if (!individual.contributions_by_date) {
    return null;
  }
  return individual.contributions_by_date.map((contribution, ind: number) => (
    <Contribution
      contribution={contribution}
      key={`contribution-${ind}`}
      recipient={
        contribution.committee_id
          ? recipientsByCommitteeId[contribution.committee_id]
          : undefined
      }
      nonCandidateCommittees={nonCandidateCommittees}
    />
  ));
}

function ByRecipient({
  individual,
  nonCandidateCommittees,
}: {
  individual: IndividualContributions;
  nonCandidateCommittees: Set<string>;
}) {
  return individual.contributions.map(
    (contributionsGroup: IndividualOrCompanyContributionGroup, ind: number) => {
      return (
        <ContributionsGroup
          key={`contrib-group-${ind}`}
          contributionsGroup={contributionsGroup}
          recipient={contributionsGroup.recipient}
          nonCandidateCommittees={nonCandidateCommittees}
        />
      );
    },
  );
}

export function ContributionsCardSkeleton() {
  return (
    <section>
      <h2 className={sharedStyles.sectionTitle}>
        <span>Contributions</span>
        <span className={sharedStyles.sectionTitleAmount}>
          <Skeleton width="11rem" />
        </span>
      </h2>
      {range(5).map((i) => (
        <ContributionsGroupSkeleton key={`cg-skeleton-${i}`} />
      ))}
    </section>
  );
}

export default function ContributionsCardContent({
  individual,
  nonCandidateCommittees: nonCandidateCommitteesArray = [],
  totalContributionAmount,
}: {
  individual: IndividualContributions;
  nonCandidateCommittees?: string[];
  totalContributionAmount: number;
}) {
  const nonCandidateCommittees = new Set(nonCandidateCommitteesArray);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const sort = searchParams.get("sort") || "recipient";

  const recipientsByCommitteeId = Object.fromEntries(
    individual.contributions
      .filter((g) => g.recipient)
      .map((g) => [g.committee_id, g.recipient!]),
  );

  return (
    <section>
      <h2 className={sharedStyles.sectionTitle}>
        Contributions
        <span className={sharedStyles.sectionTitleAmount}>
          <span className={sharedStyles.sectionTitleAmountValue}>
            ${humanizeApproximateRounded(totalContributionAmount, 1)}
          </span>{" "}
          across{" "}
          <span className={sharedStyles.sectionTitleAmountValue}>
            {individual.contributions.length}
          </span>{" "}
          recipients
        </span>
      </h2>
      <div className={sharedStyles.inlineSortControls}>
        <span className={sharedStyles.inlineSortLabel}>Sort by</span>
        <Link
          href={pathname}
          className={
            sort !== "date"
              ? sharedStyles.inlineSortOptionActive
              : sharedStyles.inlineSortOption
          }
        >
          Recipient
          {sort !== "date" && (
            <>
              {" "}
              <span className={sharedStyles.inlineSortArrow}>↓</span>
            </>
          )}
        </Link>
        <span className={sharedStyles.inlineSortSeparator}>·</span>
        <Link
          href={`${pathname}?sort=date`}
          className={
            sort === "date"
              ? sharedStyles.inlineSortOptionActive
              : sharedStyles.inlineSortOption
          }
        >
          Date
          {sort === "date" && (
            <>
              {" "}
              <span className={sharedStyles.inlineSortArrow}>↓</span>
            </>
          )}
        </Link>
      </div>
      {sort === "recipient" && (
        <ByRecipient
          individual={individual}
          nonCandidateCommittees={nonCandidateCommittees}
        />
      )}
      {sort === "date" && (
        <ByDate
          individual={individual}
          recipientsByCommitteeId={recipientsByCommitteeId}
          nonCandidateCommittees={nonCandidateCommittees}
        />
      )}
    </section>
  );
}
