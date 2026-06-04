import Link from "next/link";

import {
  fetchCommitteeTransferGraph,
  fetchConstant,
} from "@/app/actions/fetch";
import MoneyCard from "@/app/components/MoneyCard";
import { CommitteeConstant, TransferEdge } from "@/app/types/Committee";
import { isError } from "@/app/utils/errors";
import { titlecaseCommittee } from "@/app/utils/titlecase";
import { formatCurrency } from "@/app/utils/utils";

import styles from "./page.module.css";

export default async function CommitteeDisbursements({
  committeeId,
}: {
  committeeId: string;
}) {
  const [transferData, committeeConstantData] = await Promise.all([
    fetchCommitteeTransferGraph("all"),
    fetchConstant<Record<string, CommitteeConstant>>("committees"),
  ]);

  if (isError(transferData)) {
    return null;
  }

  const transfers = (transferData as TransferEdge[])
    .filter((edge) => edge.fromId === committeeId)
    .sort((a, b) => b.amount - a.amount);

  if (!transfers.length) {
    return null;
  }

  const committeeConstants = committeeConstantData || {};

  const totalDisbursements = transfers.reduce(
    (sum, edge) => sum + edge.amount,
    0,
  );

  function renderCommitteeName(edge: TransferEdge) {
    if (committeeConstants[edge.toId]) {
      return (
        <Link href={`/2026/committees/${edge.toId}`}>
          {committeeConstants[edge.toId].name}
        </Link>
      );
    }
    return titlecaseCommittee(edge.toName);
  }

  const bottomText =
    transfers.length === 1 ? (
      <span>to {renderCommitteeName(transfers[0])}</span>
    ) : (
      <>
        {transfers.slice(0, 3).map((edge) => (
          <li key={edge.toId} className={styles.committeeDisbursementsListItem}>
            <span>{renderCommitteeName(edge)}</span>
            <span>{formatCurrency(edge.amount, true)}</span>
          </li>
        ))}
        {transfers.length > 3 && (
          <li className={styles.committeeDisbursementsListItem}>
            <span className="italic secondary">
              and {transfers.length - 3} more
            </span>
          </li>
        )}
      </>
    );

  return (
    <MoneyCard
      amount={formatCurrency(totalDisbursements, true)}
      topText="Total transferred to other committees"
      bottomText={bottomText}
    />
  );
}
