import Link from "next/link";

import sharedStyles from "@/app/shared.module.css";
import { KnownDonor } from "@/app/types/Companies";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";
import { pluralize } from "@/app/utils/humanize";
import { formatDateFromString } from "@/app/utils/utils";

import styles from "./KnownDonors.module.css";

function DonorLabel({ donor }: { donor: KnownDonor }) {
  if (!donor.id) {
    return <>{donor.name}</>;
  }
  const href =
    donor.idType === "individual"
      ? `/2026/individuals/${donor.id}`
      : `/2026/companies/${donor.id}`;
  return <Link href={href}>{donor.name}</Link>;
}

// Reported donors to a non-disclosing org (e.g. a 501(c)(4) dark-money group).
// These are hand-curated from public reporting, not FEC filings.
export default function KnownDonors({
  donors,
  orgName,
}: {
  donors: KnownDonor[];
  orgName: string;
}) {
  if (!donors || donors.length === 0) {
    return null;
  }

  const sorted = [...donors].sort((a, b) => b.amount - a.amount);

  return (
    <section className={sharedStyles.section}>
      <h2 className={sharedStyles.sectionTitle}>
        <span>Reported donors</span>
        <span className={sharedStyles.sectionTitleAmount}>
          {pluralize(sorted.length, "reported gift", { includeValue: true })}
        </span>
      </h2>
      <p className={styles.note}>
        {orgName} does not disclose its donors in FEC filings. These
        contributions have been reported publicly.
      </p>
      <ul className={styles.list}>
        {sorted.map((donor, index) => (
          <li className={styles.row} key={`${donor.id ?? donor.name}-${index}`}>
            <span className={styles.name}>
              <DonorLabel donor={donor} />
            </span>
            <span className={styles.amount}>
              {humanizeRoundedCurrency(donor.amount, true, 1)}
            </span>
            {(donor.date || donor.source) && (
              <span className={styles.meta}>
                {donor.date && formatDateFromString(donor.date)}
                {donor.date && donor.source && (
                  <span className={styles.metaSep}>·</span>
                )}
                {donor.source &&
                  (donor.sourceUrl ? (
                    <a
                      href={donor.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {donor.source}
                    </a>
                  ) : (
                    donor.source
                  ))}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
