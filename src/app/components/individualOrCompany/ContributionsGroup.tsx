import MaybeLink from "@/app/components/MaybeLink";
import {
  IndividualOrCompanyContributionGroup,
  RecipientDetails,
} from "@/app/types/Contributions";
import { IndividualConstant } from "@/app/types/Individuals";
import { titlecaseCommittee } from "@/app/utils/titlecase";
import { formatCurrency } from "@/app/utils/utils";

import Claimed from "./Claimed";
import CommitteeDetails from "./CommitteeDetails";
import Contribution from "./Contribution";
import styles from "./individualOrCompany.module.css";

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
