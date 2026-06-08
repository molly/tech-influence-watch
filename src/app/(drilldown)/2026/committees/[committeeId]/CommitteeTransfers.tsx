import Link from "next/link";

import {
  fetchAllRecipients,
  fetchCommitteeDetails,
  fetchCommitteeTransferGraph,
  fetchConstant,
  fetchNonCandidateCommittees,
} from "@/app/actions/fetch";
import CommitteeDetails from "@/app/components/individualOrCompany/CommitteeDetails";
import sharedStyles from "@/app/shared.module.css";
import {
  CommitteeConstant,
  CommitteeDetails as CommitteeDetailsType,
  TransferEdge,
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
    transferData,
    committeeConstantData,
    recipientData,
    nonCandidateCommittees,
  ] = await Promise.all([
    fetchCommitteeDetails(committeeId),
    fetchCommitteeTransferGraph("all"),
    fetchConstant<Record<string, CommitteeConstant>>("committees"),
    fetchAllRecipients(),
    fetchNonCandidateCommittees(),
  ]);

  if (isError(committeeData)) {
    return null;
  }

  const committee = committeeData as CommitteeDetailsType;

  // Derive this committee's outgoing transfers from the recipient-reported
  // transfer graph (Schedule A) so the totals here reconcile with the
  // committees index and each recipient's "transferred from" figure.
  const transfers = isError(transferData)
    ? []
    : (transferData as TransferEdge[])
        .filter((edge) => edge.fromId === committeeId)
        .sort((a, b) => b.amount - a.amount);

  if (!transfers.length) {
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

  const totalTransferred = transfers.reduce(
    (sum, edge) => sum + edge.amount,
    0,
  );

  const items = transfers.map((edge) => {
    const recipientId = edge.toId;
    const constant = committeeConstants[recipientId];
    const name = constant ? constant.name : titlecaseCommittee(edge.toName);
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
      displayValue: formatCurrency(edge.amount, true),
    };
  });

  const recipientCount = transfers.length;

  return (
    <>
      <h2 className={`${sharedStyles.sectionTitle} ${styles.sectionTitleRow}`}>
        Transfers to other committees
        <span>
          <span className={styles.sectionTitleCount}>
            {recipientCount} {recipientCount === 1 ? "committee" : "committees"}
          </span>
          <span className={sharedStyles.sectionTitleAmount}>
            <span className={sharedStyles.highlightFigure}>
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
