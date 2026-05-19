import Link from "next/link";

import { fetchConstant, fetchElection } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import { CommitteeConstant } from "@/app/types/Committee";
import { ElectionGroup, RaceType } from "@/app/types/Elections";
import { is4xx, isError } from "@/app/utils/errors";
import { getSubraceName } from "@/app/utils/races";
import { formatCurrency } from "@/app/utils/utils";

import styles from "./page.module.css";

const RACE_ORDER = [
  "general",
  "general_runoff",
  "primary_runoff",
  "primary",
  "convention",
  "special",
];

export default async function CommitteeSpending({
  raceId,
}: {
  raceId: string;
}) {
  const [election, committeeData] = await Promise.all([
    fetchElection(raceId),
    fetchConstant("committees"),
  ]);
  if (isError(election)) {
    if (is4xx(election)) {
      return (
        <span className="secondary">
          No cryptocurrency PACs have made expenditures involving this election.
        </span>
      );
    }
    return <ErrorText subject="election spending data" />;
  }
  const spending = (election as ElectionGroup).spending;
  const committeeConstants = (committeeData || {}) as Record<
    string,
    CommitteeConstant
  >;
  const sortedCommitteeIds = Object.keys(spending).sort((a, b) => {
    return spending[b].total - spending[a].total;
  });
  if (sortedCommitteeIds.length === 0) {
    return (
      <span className="secondary">
        No cryptocurrency-focused committees have made expenditures involving
        this election.
      </span>
    );
  }
  return (
    <div>
      {sortedCommitteeIds.map((committeeId) => {
        const committee = spending[committeeId];
        const sortedSubraces = Object.keys(committee.subraces).sort((a, b) => {
          return RACE_ORDER.indexOf(b) - RACE_ORDER.indexOf(a);
        });
        return (
          <div key={committeeId}>
            <h3>
              <Link href={`/2026/committees/${committeeId}`}>
                {committeeId in committeeConstants
                  ? committeeConstants[committeeId].name
                  : committeeId}
              </Link>
            </h3>
            <div>Total spending: {formatCurrency(committee.total, true)}</div>
            <ul className={styles.committeeSpendingList}>
              {sortedSubraces.map((subrace) => {
                const sortedCandidates = Object.keys(
                  spending[committeeId].subraces[subrace].candidates,
                );
                return sortedCandidates.map((candidateName) => {
                  const candidateSpending =
                    spending[committeeId].subraces[subrace].candidates[
                      candidateName
                    ];
                  const support =
                    candidateSpending.support > 0
                      ? `${formatCurrency(candidateSpending.support, true)} to support`
                      : null;
                  const oppose =
                    candidateSpending.oppose > 0
                      ? `${formatCurrency(candidateSpending.oppose, true)} to oppose`
                      : null;
                  const supportOppose = [support, oppose]
                    .filter(Boolean)
                    .join(" and ");
                  return (
                    <li
                      key={`${candidateName}-${subrace}`}
                      className={styles.committeeSpendingListItem}
                    >
                      {`${supportOppose} ${candidateName} in the ${getSubraceName({ type: subrace as RaceType, party: null })}`}
                    </li>
                  );
                });
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
