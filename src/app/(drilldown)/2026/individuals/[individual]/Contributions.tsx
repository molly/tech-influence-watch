import { fetchIndividual, fetchNonCandidateCommittees } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import individualStyles from "@/app/components/individualOrCompany/individualOrCompany.module.css";
import { IndividualContributions } from "@/app/types/Individuals";
import { is4xx, isError } from "@/app/utils/errors";

import ContributionsCardContent from "./ContributionsCardContent";
import styles from "./page.module.css";

export default async function Contributions({
  individualId,
}: {
  individualId: string;
}) {
  const [individualData, nonCandidateCommittees] = await Promise.all([
    fetchIndividual(individualId),
    fetchNonCandidateCommittees(),
  ]);
  if (isError(individualData) && !is4xx(individualData)) {
    return (
      <div className={`secondary ${individualStyles.contributionRow}`}>
        <ErrorText subject="individual contributions" />
      </div>
    );
  } else if (
    is4xx(individualData) ||
    !(individualData as IndividualContributions).contributions.length
  ) {
    return (
      <div className={`secondary ${individualStyles.contributionRow}`}>
        No contributions yet.
      </div>
    );
  }
  const individual = individualData as IndividualContributions;
  return (
    <section className={styles.contributionSection}>
      <ContributionsCardContent
        individual={individual}
        nonCandidateCommittees={Array.from(nonCandidateCommittees)}
      />
    </section>
  );
}
