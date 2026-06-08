import Link from "next/link";

import MaybeLink from "@/app/components/MaybeLink";
import sharedStyles from "@/app/shared.module.css";
import { IndividualOrCompanyContributionGroup } from "@/app/types/Contributions";
import { humanizeApproximateRounded, possessive } from "@/app/utils/humanize";
import { titlecaseCommittee } from "@/app/utils/titlecase";

import styles from "./individualOrCompany.module.css";

export default function CompanySpendingBreakdown({
  name,
  superPacGroups,
  partyGroups,
  candidateGroups,
  darkMoneyTotal = 0,
  hasMap = true,
}: {
  name: string;
  superPacGroups: IndividualOrCompanyContributionGroup[];
  partyGroups: IndividualOrCompanyContributionGroup[];
  candidateGroups: IndividualOrCompanyContributionGroup[];
  // Reported gifts to non-disclosing dark-money groups (FROM this org). Not in
  // FEC data, so passed in separately; omitted on pages without reported gifts.
  darkMoneyTotal?: number;
  hasMap?: boolean;
}) {
  const superPacTotal = superPacGroups.reduce((sum, g) => sum + g.total, 0);
  const partyTotal = partyGroups.reduce((sum, g) => sum + g.total, 0);
  const candidateTotal = candidateGroups.reduce((sum, g) => sum + g.total, 0);
  const hasDarkMoney = darkMoneyTotal > 0;

  // The "genuinely cross party lines" example must be a PAC with no partisan or
  // candidate affiliation at all. A PAC like America PAC reads as non-partisan
  // only because its FEC party field is blank, but it's tied to a candidate
  // (Trump) — so exclude any PAC affiliated with a party, a beneficiary
  // candidate, or a sponsor candidate.
  const topNonPartisanSuperPac = superPacGroups
    .filter((g) => {
      const recipient = g.recipient;
      if (!recipient) {
        return false;
      }
      if (
        recipient.party &&
        recipient.party !== "N" &&
        recipient.party !== "U"
      ) {
        return false;
      }
      if (recipient.candidate_ids && recipient.candidate_ids.length > 0) {
        return false;
      }
      if (
        recipient.sponsor_candidate_ids &&
        recipient.sponsor_candidate_ids.length > 0
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => b.total - a.total)[0];
  const total = superPacTotal + partyTotal + candidateTotal + darkMoneyTotal;

  if (superPacTotal === 0) {
    return null;
  }

  const superPacPct = (superPacTotal / total) * 100;
  const partyPct = (partyTotal / total) * 100;
  const candidatePct = (candidateTotal / total) * 100;
  const darkMoneyPct = (darkMoneyTotal / total) * 100;

  return (
    <section
      className={`${styles.spendingBreakdownSection} ${sharedStyles.scopeCard}`}
    >
      <h2 className={styles.breakdownTitle}>
        Where {possessive(name)} ${humanizeApproximateRounded(total, 1)} went
      </h2>
      <div
        className={styles.breakdownBar}
        role="img"
        aria-label={`${name} spending breakdown: ${Math.round(superPacPct)}% Super PACs, ${Math.round(partyPct)}% Party committees, ${Math.round(candidatePct)}% benefitting specific candidates${hasDarkMoney ? `, ${Math.round(darkMoneyPct)}% dark-money groups` : ""}`}
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
        {hasDarkMoney && (
          <div
            className={`${styles.breakdownBarSegment} ${styles.darkMoneyBarSegment}`}
            style={{ width: `${darkMoneyPct}%` }}
          />
        )}
      </div>
      <div
        className={`${styles.breakdownColumns} ${hasDarkMoney ? styles.breakdownColumnsFour : ""}`}
      >
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
        {hasDarkMoney && (
          <div className={`${styles.breakdownColumn} ${styles.darkMoneyColumn}`}>
            <p className={styles.breakdownLabel}>to dark-money groups</p>
            <p className={styles.breakdownAmount}>
              ${humanizeApproximateRounded(darkMoneyTotal, 1)}
            </p>
            <p className={styles.breakdownDetails}>
              {parseFloat(darkMoneyPct.toFixed(1))}%
            </p>
          </div>
        )}
      </div>
      {superPacTotal > 0 && (
        <div className={styles.breakdownNote}>
          <div
            className={styles.breakdownNoteHighlight}
          >{`$${humanizeApproximateRounded(superPacTotal, 1)} (${Math.round(superPacPct)}%) went to super PACs.`}</div>
          Partisan PACs are classified by party below. PACs that genuinely cross
          party lines
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
          are classified as non-partisan / unknown.
          {hasMap && (
            <span>
              None of this money is in the state map&nbsp;&mdash; such
              contributions aren&rsquo;t tied to a state until the PAC spends
              them. To learn more about a PAC&rsquo;s spending, click on a{" "}
              <Link href="/2026/committees" className="unstyled">
                tracked super PAC
              </Link>
              .
            </span>
          )}
        </div>
      )}
    </section>
  );
}
