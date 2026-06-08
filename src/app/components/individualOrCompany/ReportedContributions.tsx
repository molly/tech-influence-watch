import Link from "next/link";

import sharedStyles from "@/app/shared.module.css";
import {
  humanizeApproximateRounded,
  humanizeRoundedCurrency,
  pluralize,
} from "@/app/utils/humanize";
import { formatDateFromString } from "@/app/utils/utils";

// Reuse the donor-list styling; the two sections are the same edge viewed from
// either end.
import styles from "./KnownDonors.module.css";

// A reported gift FROM this company TO a non-disclosing org. This is the inverse
// of KnownDonors: the same hand-curated edge, surfaced on the donor's page. The
// money trail ends at the recipient (the org doesn't disclose onward spending).
export interface ReportedContribution {
  // Recipient org slug (tracked company that holds the knownDonors entry)
  recipientId: string;
  // Recipient display name
  recipientName: string;
  amount: number;
  date?: string;
  source?: string;
  sourceUrl?: string;
}

export default function ReportedContributions({
  contributions,
  donorName,
}: {
  contributions: ReportedContribution[];
  donorName: string;
}) {
  if (!contributions || contributions.length === 0) {
    return null;
  }

  const sorted = [...contributions].sort((a, b) => b.amount - a.amount);
  const reportedTotal = sorted.reduce((sum, c) => sum + c.amount, 0);

  return (
    <section className={sharedStyles.section}>
      <h2 className={sharedStyles.sectionTitle}>
        <span>Reported contributions</span>
        <span className={sharedStyles.sectionTitleAmount}>
          <span className={sharedStyles.highlightFigure}>
            ${humanizeApproximateRounded(reportedTotal, 1)}
          </span>{" "}
          across{" "}
          <span className={sharedStyles.highlightFigure}>{sorted.length}</span>{" "}
          {pluralize(sorted.length, "recipient", { includeValue: false })}
        </span>
      </h2>
      <p className={styles.note}>
        {donorName} is reported to have given to organizations that don&rsquo;t
        disclose their donors. These contributions don&rsquo;t appear in FEC
        filings, and the trail ends at the recipient.
      </p>
      <ul className={styles.list}>
        {sorted.map((contribution, index) => (
          <li
            className={styles.row}
            key={`${contribution.recipientId}-${index}`}
          >
            <span className={styles.name}>
              <Link href={`/2026/companies/${contribution.recipientId}`}>
                {contribution.recipientName}
              </Link>
            </span>
            <span className={styles.amount}>
              {humanizeRoundedCurrency(contribution.amount, true, 1)}
            </span>
            {(contribution.date || contribution.source) && (
              <span className={styles.meta}>
                {contribution.date && formatDateFromString(contribution.date)}
                {contribution.date && contribution.source && (
                  <span className={styles.metaSep}>·</span>
                )}
                {contribution.source &&
                  (contribution.sourceUrl ? (
                    <a
                      href={contribution.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {contribution.source}
                    </a>
                  ) : (
                    contribution.source
                  ))}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
