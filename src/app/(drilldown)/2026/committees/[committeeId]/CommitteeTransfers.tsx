import Link from "next/link";

import {
  fetchAllRecipients,
  fetchCommitteeDetails,
  fetchConstant,
  fetchNonCandidateCommittees,
} from "@/app/actions/fetch";
import CommitteeDetails from "@/app/components/individualOrCompany/CommitteeDetails";
import sharedStyles from "@/app/shared.module.css";
import {
  CommitteeConstant,
  CommitteeDetails as CommitteeDetailsType,
} from "@/app/types/Committee";
import { RecipientDetails } from "@/app/types/Contributions";
import { isError } from "@/app/utils/errors";
import { formatCompact } from "@/app/utils/humanize";
import { titlecaseCommittee } from "@/app/utils/titlecase";
import { formatCurrency } from "@/app/utils/utils";

import styles from "./page.module.css";

export default async function CommitteeTransfers({
  committeeId,
}: {
  committeeId: string;
}) {
  const [
    committeeData,
    committeeConstantData,
    recipientData,
    nonCandidateCommittees,
  ] = await Promise.all([
    fetchCommitteeDetails(committeeId),
    fetchConstant<Record<string, CommitteeConstant>>("committees"),
    fetchAllRecipients(),
    fetchNonCandidateCommittees(),
  ]);

  if (isError(committeeData)) {
    return null;
  }

  const committee = committeeData as CommitteeDetailsType;
  const transfers = committee.disbursements_by_committee;

  if (!transfers || !Object.keys(transfers).length) {
    return (
      <>
        <h2 className={sharedStyles.sectionTitle}>By committee</h2>
        <p>{`${committee.name} has not transferred money to other committees.`}</p>
      </>
    );
  }

  const committeeConstants = committeeConstantData || {};
  const recipients = isError(recipientData)
    ? {}
    : (recipientData as Record<string, RecipientDetails>);

  const sortedRecipientIds = Object.keys(transfers).sort(
    (a, b) => transfers[b].total - transfers[a].total,
  );
  const totalTransferred = sortedRecipientIds.reduce(
    (sum, id) => sum + transfers[id].total,
    0,
  );

  const items = sortedRecipientIds.map((recipientId) => {
    const constant = committeeConstants[recipientId];
    const name = constant
      ? constant.name
      : titlecaseCommittee(transfers[recipientId].recipient_name);
    const recipient = recipients[recipientId];
    return {
      key: recipientId,
      labelNode: constant ? (
        <Link
          href={`/2026/committees/${recipientId}`}
          className="secondaryLink"
        >
          {name}
        </Link>
      ) : (
        name
      ),
      subtitle: recipient ? (
        <CommitteeDetails
          recipient={recipient}
          nonCandidateCommittees={nonCandidateCommittees}
        />
      ) : undefined,
      displayValue: formatCurrency(transfers[recipientId].total, true),
    };
  });

  const recipientCount = sortedRecipientIds.length;

  return (
    <>
      <h2 className={`${sharedStyles.sectionTitle} ${styles.sectionTitleRow}`}>
        Transfers to other committees
        <span>
          <span className={styles.sectionTitleCount}>
            {recipientCount} {recipientCount === 1 ? "committee" : "committees"}
          </span>
          <span className={sharedStyles.sectionTitleAmount}>
            <span className={sharedStyles.sectionTitleAmountValue}>
              {formatCompact(totalTransferred)}
            </span>{" "}
            total
          </span>
        </span>
      </h2>
      <ul className={styles.committeeTransfersList}>
        {items.map((item) => (
          <li key={item.key} className={styles.committeeTransfersRow}>
            <div className={styles.committeeTransfersLabelRow}>
              <span className={styles.committeeTransfersLabel}>
                {item.labelNode}
              </span>
              <span className={styles.committeeTransfersValue}>
                {item.displayValue}
              </span>
            </div>
            {item.subtitle && (
              <div className={styles.committeeTransfersSubtitle}>
                {item.subtitle}
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
