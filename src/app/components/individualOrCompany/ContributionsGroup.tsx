import MaybeLink from "@/app/components/MaybeLink";
import {
  IndividualOrCompanyContributionGroup,
  RecipientDetails,
} from "@/app/types/Contributions";
import { IndividualConstant } from "@/app/types/Individuals";
import { range } from "@/app/utils/range";
import { titlecaseCommittee } from "@/app/utils/titlecase";
import { formatCurrency } from "@/app/utils/utils";

import Skeleton from "../skeletons/Skeleton";
import Claimed from "./Claimed";
import CommitteeDetails from "./CommitteeDetails";
import Contribution from "./Contribution";
import styles from "./individualOrCompany.module.css";

export function ContributionsGroupSkeleton() {
  return (
    <div className={styles.contributionRow}>
      <div className={styles.contributionSummary}>
        <span className={styles.contributionCommittee}>
          <Skeleton randWidth={[3, 20]} />
        </span>
        <span className={styles.summaryAmount}>
          <Skeleton width="8rem" />
        </span>
      </div>
      <Skeleton randWidth={[10, 25]} height="0.9rem" />
      <div className={styles.contributionsContainer}>
        {range(5).map((i) => (
          <div key={`cgc-${i}`} className={styles.contributionSubRow}>
            <div className={styles.contributionDetails}>
              <Skeleton randWidth={[6, 18]} />
            </div>

            <div className={styles.subRowCurrency}>
              <Skeleton width="7rem" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ContributionsGroup({
  contributionsGroup,
  recipient,
  company,
  relatedIndividuals,
  nonCandidateCommittees,
}: {
  contributionsGroup: IndividualOrCompanyContributionGroup;
  recipient?: RecipientDetails;
  company?: string;
  relatedIndividuals?: IndividualConstant[];
  nonCandidateCommittees?: Set<string>;
}) {
  if (contributionsGroup.contributions.length === 1) {
    const donor = contributionsGroup.contributions[0];
    return (
      <Contribution
        contribution={donor}
        recipient={recipient}
        company={company}
        relatedIndividuals={relatedIndividuals}
        nonCandidateCommittees={nonCandidateCommittees}
      />
    );
  }

  const isClaimed = contributionsGroup.contributions.every(
    (c) => "claimed" in c && c.claimed,
  );

  return (
    <div className={styles.contributionRow}>
      <div className={styles.contributionSummary}>
        <span
          className={styles.contributionCommittee}
          data-committee-id={contributionsGroup.committee_id}
        >
          <MaybeLink className="unstyled" href={recipient?.link}>
            {recipient?.committee_name
              ? titlecaseCommittee(recipient.committee_name, false)
              : contributionsGroup.committee_id}
          </MaybeLink>
          {isClaimed && (
            <>
              {" "}
              <Claimed />
            </>
          )}
        </span>
        <span className={styles.summaryAmount}>
          {formatCurrency(contributionsGroup.total)}
        </span>
      </div>
      <CommitteeDetails
        recipient={recipient}
        nonCandidateCommittees={nonCandidateCommittees}
      />
      <div className={styles.contributionsContainer}>
        {contributionsGroup.contributions.map((contribution, ind) => (
          <Contribution
            isSubRow={true}
            contribution={contribution}
            recipient={recipient}
            company={company}
            relatedIndividuals={relatedIndividuals}
            nonCandidateCommittees={nonCandidateCommittees}
            key={`contribution-${ind}`}
          />
        ))}
      </div>
    </div>
  );
}
