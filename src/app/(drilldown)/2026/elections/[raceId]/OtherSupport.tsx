import Link from "next/link";

import { fetchBeneficiaries, fetchConstant, fetchElection } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import {
  Beneficiary,
  BeneficiaryContribution,
  CompanyContributionGroup,
} from "@/app/types/Beneficiaries";
import { ElectionGroup } from "@/app/types/Elections";
import { is4xx, isError } from "@/app/utils/errors";
import { humanizeList } from "@/app/utils/humanize";
import {
  titlecaseCommittee,
  titlecaseLastFirst,
  titlecaseOccupation,
} from "@/app/utils/titlecase";
import { formatCurrency } from "@/app/utils/utils";

import styles from "./page.module.css";

function Contribution({
  contribution,
  individualAliases,
}: {
  contribution: BeneficiaryContribution;
  individualAliases: Record<string, string>;
}) {
  let contributorName = null;
  if (contribution.contributor_name) {
    const individualId =
      contribution.individual ??
      individualAliases[contribution.contributor_name];
    if (contribution.isIndividual && individualId) {
      contributorName = (
        <Link href={`/2026/individuals/${individualId}`}>
          {titlecaseLastFirst(contribution.contributor_name)}
        </Link>
      );
    } else if (contribution.isIndividual) {
      contributorName = titlecaseLastFirst(contribution.contributor_name);
    } else {
      contributorName = titlecaseCommittee(contribution.contributor_name);
    }
  }
  const committeeNames = contribution.committees.length
    ? humanizeList(
        contribution.committees.map((c) => titlecaseCommittee(c.name)),
      )
    : null;
  return (
    <li className={styles.otherSupportContribution}>
      <span>{formatCurrency(contribution.total)}</span>
      {contributorName && <span> from {contributorName}</span>}
      {(contribution.contributor_occupation ||
        contribution.individual_employer) && (
        <>
          {" "}
          <span className="secondary">
            {`(${[
              contribution.contributor_occupation
                ? titlecaseOccupation(contribution.contributor_occupation)
                : null,
              contribution.individual_employer ?? null,
            ]
              .filter(Boolean)
              .join(", ")})`}
          </span>
        </>
      )}
      {committeeNames && <span>{` via ${committeeNames}`}</span>}
    </li>
  );
}

function CompanyGroup({
  group,
  individualAliases,
}: {
  group: CompanyContributionGroup;
  individualAliases: Record<string, string>;
}) {
  return (
    <div className={styles.companyGroup}>
      <div className={styles.companyGroupHeader}>
        <Link
          href={
            group.individual_id
              ? `/2026/individuals/${group.individual_id}`
              : `/2026/companies/${group.company_id}`
          }
        >
          {group.company_name}
        </Link>
        {" – "}
        {formatCurrency(group.total, true)}
      </div>
      <ul className={styles.otherSupportContributions}>
        {group.contributions.map((contribution, ind) => (
          <Contribution
            key={`${group.company_id}-${ind}`}
            contribution={contribution}
            individualAliases={individualAliases}
          />
        ))}
      </ul>
    </div>
  );
}

export default async function OtherSupport({ raceId }: { raceId: string }) {
  const [electionData, beneficiaryData, individualAliases] = await Promise.all([
    fetchElection(raceId),
    fetchBeneficiaries(),
    fetchConstant<Record<string, string>>("individualAliases"),
  ]);
  if (isError(electionData) || isError(beneficiaryData)) {
    if (is4xx(electionData) || is4xx(beneficiaryData)) {
      return (
        <span className="secondary">
          No other support from cryptocurrency industry-associated companies or
          individuals has been recorded for candidates in this election.
        </span>
      );
    }
    return <ErrorText subject="other candidate support" />;
  }
  const election = electionData as ElectionGroup;
  const beneficiaries = beneficiaryData as Record<string, Beneficiary>;

  const supportedCandidates = Object.values(election.candidates)
    .filter((c) => c.has_non_pac_support)
    .sort((a, b) => {
      const aTotal = a.candidate_id ? beneficiaries[a.candidate_id].total : 0;
      const bTotal = b.candidate_id ? beneficiaries[b.candidate_id].total : 0;
      return bTotal - aTotal;
    });

  return (
    <div>
      {supportedCandidates.map((c) => {
        if (!c.candidate_id) {
          return null;
        }
        const beneficiary = beneficiaries[c.candidate_id];
        return (
          <section key={c.candidate_id} className={styles.otherSupportSection}>
            <h3 className="no-margin">{c.common_name}</h3>
            <div>{`${formatCurrency(beneficiary.total, true)} in total other support from companies and individuals`}</div>
            {beneficiary.contributions.map((group) => (
              <CompanyGroup
                key={`${c.candidate_id}-${group.company_id}`}
                group={group}
                individualAliases={individualAliases ?? {}}
              />
            ))}
          </section>
        );
      })}
      <div className={`${styles.tableCardContent} secondary small`}>
        Other support to a candidate may exceed the amounts shown in the
        &ldquo;Money involved in this election&rdquo; chart if funds have been
        contributed to a super PAC aligned with a candidate, but the PAC has not
        yet spent the funds.
      </div>
    </div>
  );
}
