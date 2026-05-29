import Link from "next/link";

import { fetchConstant, fetchElection } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import sharedStyles from "@/app/shared.module.css";
import { CommitteeConstant } from "@/app/types/Committee";
import { ElectionGroup, RaceType } from "@/app/types/Elections";
import { Sector } from "@/app/types/Sector";
import { is4xx, isError } from "@/app/utils/errors";
import { getSubraceName } from "@/app/utils/races";
import { getCommitteeIdsForSector, humanizeSector } from "@/app/utils/sector";
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
  sector,
  raceId,
}: {
  sector: Sector;
  raceId: string;
}) {
  const [election, committeeData] = await Promise.all([
    fetchElection(raceId),
    fetchConstant("committees"),
  ]);
  const humanizedSector = humanizeSector(sector, {
    context: "industry",
    lowercase: true,
    or: true,
  });

  if (isError(election)) {
    if (is4xx(election)) {
      return (
        <span className={sharedStyles.subtitle}>
          No {humanizedSector} PAC spending has been recorded for this election.
        </span>
      );
    }
    return (
      <span className={sharedStyles.subtitle}>
        <ErrorText subject="election spending data" />
      </span>
    );
  }
  const spending = (election as ElectionGroup).spending;
  const committeeConstants = (committeeData || {}) as Record<
    string,
    CommitteeConstant
  >;
  const sectorCommitteeIds = getCommitteeIdsForSector(
    sector,
    committeeConstants,
  );
  const sortedCommitteeIds = Object.keys(spending)
    .filter((id) => sectorCommitteeIds === null || sectorCommitteeIds.has(id))
    .sort((a, b) => spending[b].total - spending[a].total);
  if (sortedCommitteeIds.length === 0) {
    return (
      <span className={sharedStyles.subtitle}>
        No {humanizedSector} committees have made expenditures involving this
        election.
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
          <div key={committeeId} className={styles.committeeBlock}>
            <div className={styles.committeeHeader}>
              <span className={styles.committeeHeaderName}>
                <Link href={`/2026/committees/${committeeId}`}>
                  {committeeId in committeeConstants
                    ? committeeConstants[committeeId].name
                    : committeeId}
                </Link>
              </span>
              <span className={styles.committeeTotal}>
                Total spending{" "}
                <span className={styles.committeeTotalAmount}>
                  {formatCurrency(committee.total, true)}
                </span>
              </span>
            </div>
            {sortedSubraces.flatMap((subrace) => {
              const raceName = getSubraceName({
                type: subrace as RaceType,
                party: null,
              });
              return Object.keys(
                spending[committeeId].subraces[subrace].candidates,
              ).flatMap((candidateName) => {
                const candidateSpending =
                  spending[committeeId].subraces[subrace].candidates[
                    candidateName
                  ];
                const rows: { action: string; amount: number }[] = [];
                if (candidateSpending.support > 0) {
                  rows.push({
                    action: "support",
                    amount: candidateSpending.support,
                  });
                }
                if (candidateSpending.oppose > 0) {
                  rows.push({
                    action: "oppose",
                    amount: candidateSpending.oppose,
                  });
                }
                return rows.map(({ action, amount }) => (
                  <div
                    key={`${candidateName}-${subrace}-${action}`}
                    className={styles.committeeSpendingRow}
                  >
                    <span>
                      <span className={styles.committeeSpendingAction}>
                        to {action}{" "}
                      </span>
                      <span className={styles.committeeSpendingCandidateName}>
                        {candidateName}
                      </span>
                      <span className={styles.committeeSpendingAction}>
                        {" "}
                        in the {raceName}
                      </span>
                    </span>
                    <span className={styles.committeeRowAmount}>
                      {formatCurrency(amount, true)}
                    </span>
                  </div>
                ));
              });
            })}
          </div>
        );
      })}
    </div>
  );
}
