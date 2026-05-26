import MaybeLink from "@/app/components/MaybeLink";
import {
  Contribution as ContributionType,
  IndividualOrCompanyContribution,
  RecipientDetails,
} from "@/app/types/Contributions";
import { IndividualConstant } from "@/app/types/Individuals";
import {
  titlecaseCommittee,
  titlecaseIndividualName,
  titlecaseLastFirst,
  titlecaseOccupation,
} from "@/app/utils/titlecase";
import { formatCurrency, formatDateFromString } from "@/app/utils/utils";

import Claimed from "./Claimed";
import CommitteeDetails from "./CommitteeDetails";
import styles from "./individualOrCompany.module.css";

function Contributor({
  contribution,
  company,
  relatedIndividuals,
}: {
  contribution: IndividualOrCompanyContribution;
  company?: string;
  relatedIndividuals?: IndividualConstant[];
}) {
  if (contribution.isIndividual) {
    // Check if this individual is in relatedIndividuals
    if (contribution.individual) {
      const individual = relatedIndividuals?.find(
        (ind) => ind.id === contribution.individual,
      );
      if (individual) {
        // Individual found in relatedIndividuals - show name (linked) and title
        return (
          <span className={styles.contributionSource}>
            <MaybeLink
              className="unstyled"
              href={`/2026/individuals/${individual.id}`}
            >
              {individual.name}
            </MaybeLink>
            {individual.title && (
              <>
                {" "}
                <span className="secondary">({individual.title})</span>
              </>
            )}
          </span>
        );
      }
      // Individual ID set but not found in relatedIndividuals (shouldn't happen)
      const contributorName = contribution.contributor_name
        ? titlecaseLastFirst(contribution.contributor_name)
        : titlecaseIndividualName(contribution.individual.replaceAll("-", " "));
      const occupation = contribution.contributor_occupation;
      return (
        <span className={styles.contributionSource}>
          {contributorName}
          {occupation && (
            <>
              {" "}
              <span className="secondary">
                ({titlecaseOccupation(occupation)})
              </span>
            </>
          )}
          {" – "}
        </span>
      );
    }
    // isIndividual but no individual ID - high-level individual not in relatedIndividuals
    const contributorName = contribution.contributor_name
      ? titlecaseLastFirst(contribution.contributor_name)
      : "Individual";
    const occupation = contribution.contributor_occupation;
    return (
      <span className={styles.contributionSource}>
        {contributorName}
        {occupation && (
          <>
            {" "}
            <span className="secondary">
              ({titlecaseOccupation(occupation)})
            </span>
          </>
        )}
      </span>
    );
  } else if (company) {
    return <span className={styles.contributionSource}>{company}</span>;
  }
  return null;
}

function ContributionDate({
  contribution,
}: {
  contribution: ContributionType;
}) {
  if (
    "contribution_receipt_date" in contribution &&
    contribution.contribution_receipt_date
  ) {
    return (
      <span
        className={styles.contributionDate}
      >{`${formatDateFromString(contribution.contribution_receipt_date)}`}</span>
    );
  } else if (
    "oldest" in contribution &&
    contribution.oldest &&
    "newest" in contribution &&
    contribution.newest
  ) {
    return (
      <span
        className={styles.contributionDate}
      >{`${contribution.total} contribution${contribution.total > 1 ? "s" : ""} from ${formatDateFromString(contribution.oldest)} to ${formatDateFromString(contribution.newest)}`}</span>
    );
  }
  return null;
}

function ContributionAmount({
  contribution,
  isSubRow = false,
}: {
  contribution: ContributionType;
  isSubRow?: boolean;
}) {
  if (
    "contribution_receipt_amount" in contribution &&
    contribution.contribution_receipt_amount
  ) {
    return (
      <span className={isSubRow ? styles.subRowCurrency : styles.summaryAmount}>
        {formatCurrency(contribution.contribution_receipt_amount)}
      </span>
    );
  } else if (
    "total_receipt_amount" in contribution &&
    contribution.total_receipt_amount
  ) {
    return (
      <span className={isSubRow ? styles.subRowCurrency : styles.summaryAmount}>
        {formatCurrency(contribution.total_receipt_amount)}
      </span>
    );
  }
  return null;
}

export default function Contribution({
  contribution,
  recipient,
  company,
  relatedIndividuals,
  isSubRow,
  nonCandidateCommittees,
}: {
  contribution: IndividualOrCompanyContribution;
  recipient?: RecipientDetails;
  company?: string;
  relatedIndividuals?: IndividualConstant[];
  isSubRow?: boolean;
  nonCandidateCommittees?: Set<string>;
}) {
  const formattedName = recipient?.committee_name
    ? titlecaseCommittee(recipient.committee_name, false)
    : contribution.committee_id;
  if (isSubRow) {
    return (
      <div className={styles.contributionSubRow}>
        <div className={styles.contributionDetails}>
          <Contributor
            contribution={contribution}
            company={company}
            relatedIndividuals={relatedIndividuals}
          />
          <ContributionDate contribution={contribution} />{" "}
          {"claimed" in contribution && contribution.claimed && <Claimed />}
        </div>
        <ContributionAmount contribution={contribution} isSubRow={true} />
      </div>
    );
  } else {
    // TOP-LEVEL ROW
    return (
      <div className={styles.contributionRow}>
        <div className={styles.contributionSummary}>
          <span
            className={styles.contributionCommittee}
            data-committee-id={contribution.committee_id}
          >
            <MaybeLink className="unstyled" href={recipient?.link}>
              {formattedName}
            </MaybeLink>
            {"claimed" in contribution && contribution.claimed && <Claimed />}
          </span>
          <ContributionAmount contribution={contribution} />
        </div>
        <CommitteeDetails
          recipient={recipient}
          nonCandidateCommittees={nonCandidateCommittees}
        />
        <div className={styles.contributionDetails}>
          <Contributor
            contribution={contribution}
            company={company}
            relatedIndividuals={relatedIndividuals}
          />
          <ContributionDate contribution={contribution} />
        </div>
      </div>
    );
  }
}
