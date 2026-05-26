import Link from "next/link";

import MaybeLink from "@/app/components/MaybeLink";
import sharedStyles from "@/app/shared.module.css";
import { IndividualOrCompanyContributionGroup } from "@/app/types/Contributions";
import { humanizeApproximateRounded, possessive } from "@/app/utils/humanize";
import { titlecaseCommittee } from "@/app/utils/titlecase";

import styles from "./page.module.css";

export default function CompanySpendingBreakdown({
  companyName,
  superPacGroups,
  partyGroups,
  candidateGroups,
}: {
  companyName: string;
  superPacGroups: IndividualOrCompanyContributionGroup[];
  partyGroups: IndividualOrCompanyContributionGroup[];
  candidateGroups: IndividualOrCompanyContributionGroup[];
}) {
  const superPacTotal = superPacGroups.reduce((sum, g) => sum + g.total, 0);
  const partyTotal = partyGroups.reduce((sum, g) => sum + g.total, 0);
  const candidateTotal = candidateGroups.reduce((sum, g) => sum + g.total, 0);

  const topNonPartisanSuperPac = superPacGroups
    .filter(
      (g) =>
        !g.recipient?.party ||
        g.recipient.party === "N" ||
        g.recipient.party === "U",
    )
    .sort((a, b) => b.total - a.total)[0];
  const total = superPacTotal + partyTotal + candidateTotal;

  if (total === 0) {
    return null;
  }

  const superPacPct = (superPacTotal / total) * 100;
  const partyPct = (partyTotal / total) * 100;
  const candidatePct = (candidateTotal / total) * 100;

  return (
    <section
      className={`${styles.spendingBreakdownSection} ${sharedStyles.scopeCard}`}
    >
      <h2 className={styles.breakdownTitle}>
        Where {possessive(companyName)} ${humanizeApproximateRounded(total, 1)}{" "}
        went
      </h2>
      <div
        className={styles.breakdownBar}
        role="img"
        aria-label={`${companyName} spending breakdown: ${Math.round(superPacPct)}% Super PACs, ${Math.round(partyPct)}% Party committees, ${Math.round(candidatePct)}% benefitting specific candidates`}
      >
        {superPacTotal > 0 && (
          <div
            className={`${styles.breakdownBarSegment} ${styles.superPacBarSegment}`}
            style={{ width: `${superPacPct}%` }}
          />
        )}
        {partyTotal > 0 && (
          <div
            className={`${styles.breakdownBarSegment} ${styles.partyBarSegment}`}
            style={{ width: `${partyPct}%` }}
          />
        )}
        {candidateTotal > 0 && (
          <div
            className={`${styles.breakdownBarSegment} ${styles.candidateBarSegment}`}
            style={{ width: `${candidatePct}%` }}
          />
        )}
      </div>
      <div className={styles.breakdownColumns}>
        <div className={`${styles.breakdownColumn} ${styles.superPacColumn}`}>
          <p className={styles.breakdownLabel}>to super PACs</p>
          <p className={styles.breakdownAmount}>
            ${humanizeApproximateRounded(superPacTotal, 1)}
          </p>
          <p className={styles.breakdownDetails}>
            {parseFloat(superPacPct.toFixed(1))}%
          </p>
        </div>
        <div className={`${styles.breakdownColumn} ${styles.partyColumn}`}>
          <p className={styles.breakdownLabel}>to party committees</p>
          <p className={styles.breakdownAmount}>
            ${humanizeApproximateRounded(partyTotal, 1)}
          </p>
          <p className={styles.breakdownDetails}>
            {parseFloat(partyPct.toFixed(1))}%
          </p>
        </div>
        <div className={`${styles.breakdownColumn} ${styles.candidateColumn}`}>
          <p className={styles.breakdownLabel}>
            benefitting specific candidates
          </p>
          <p className={styles.breakdownAmount}>
            ${humanizeApproximateRounded(candidateTotal, 1)}
          </p>
          <p className={styles.breakdownDetails}>
            {parseFloat(candidatePct.toFixed(1))}%
          </p>
        </div>
      </div>
      {superPacTotal > 0 && (
        <div className={styles.breakdownNote}>
          <div
            className={styles.breakdownNoteHighlight}
          >{`$${humanizeApproximateRounded(superPacTotal, 1)} (${Math.round(superPacPct)}%) went to super PACs.`}</div>
          Partisan super PACs are classified by party below; super PACs that
          genuinely cross party lines
          {topNonPartisanSuperPac?.recipient?.committee_name && (
            <>
              {" "}
              (like{" "}
              <MaybeLink
                href={
                  topNonPartisanSuperPac.recipient.link ??
                  `/2026/committees/${topNonPartisanSuperPac.committee_id}`
                }
                className="unstyled"
              >
                {titlecaseCommittee(
                  topNonPartisanSuperPac.recipient.committee_name,
                )}
              </MaybeLink>
              )
            </>
          )}{" "}
          are classified as non-partisan / unknown. None of this money is in the
          state map&nbsp;&mdash; super PAC contributions aren&rsquo;t tied to a
          state until the PAC spends them. To learn more about a super
          PAC&rsquo;s spending, click on a{" "}
          <Link href="/2026/committees" className="unstyled">
            tracked super PAC
          </Link>
          .
        </div>
      )}
    </section>
  );
}
