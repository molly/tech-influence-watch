"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import Contribution from "@/app/components/individualOrCompany/Contribution";
import ContributionsGroup from "@/app/components/individualOrCompany/ContributionsGroup";
import {
  IndividualOrCompanyContributionGroup,
  RecipientDetails,
} from "@/app/types/Contributions";
import { IndividualContributions } from "@/app/types/Individuals";

import styles from "./page.module.css";

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

export default function ContributionsCardContent({
  individual,
  nonCandidateCommittees: nonCandidateCommitteesArray = [],
}: {
  individual: IndividualContributions;
  nonCandidateCommittees?: string[];
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
    <>
      <div className={styles.contributionCardHeader}>
        <h3 className={styles.contributionSectionHeader}>Contributions</h3>
        <Link
          href={`${pathname}/${sort === "recipient" ? "?sort=date" : ""}`}
          className={styles.contributionCardSwitcher}
        >
          {`Sort by ${sort === "date" ? "recipient" : "date"}`}
        </Link>
      </div>
      {sort === "recipient" && (
        <ByRecipient individual={individual} nonCandidateCommittees={nonCandidateCommittees} />
      )}
      {sort === "date" && (
        <ByDate individual={individual} recipientsByCommitteeId={recipientsByCommitteeId} nonCandidateCommittees={nonCandidateCommittees} />
      )}
    </>
  );
}
