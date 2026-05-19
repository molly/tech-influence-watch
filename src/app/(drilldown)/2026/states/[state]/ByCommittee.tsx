import Link from "next/link";

import { fetchConstant, fetchStateExpenditures } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import Skeleton from "@/app/components/skeletons/Skeleton";
import { CommitteeConstant } from "@/app/types/Committee";
import { PopulatedStateExpenditures } from "@/app/types/Expenditures";
import { is4xx, isError } from "@/app/utils/errors";
import { formatCurrency } from "@/app/utils/utils";

import styles from "./page.module.css";

export function CommitteeCardContentsSkeleton() {
  return (
    <div className={styles.cardSection}>
      <Skeleton width="15rem" height="1.17em" onCard={true} />
      <Skeleton width="5em" onCard={true} />
    </div>
  );
}

export default async function CommitteeCard({
  stateAbbr,
}: {
  stateAbbr: string;
}) {
  const [expendituresData, committeeData] = await Promise.all([
    fetchStateExpenditures(stateAbbr),
    fetchConstant("committees"),
  ]);
  const committees = (committeeData || {}) as Record<string, CommitteeConstant>;
  if (isError(expendituresData)) {
    if (is4xx(expendituresData)) {
      return (
        <div className="secondary">
          No spending has been recorded in this state.
        </div>
      );
    }
    return <ErrorText subject="state election information" />;
  }
  const expenditures = expendituresData as PopulatedStateExpenditures;

  if (Object.keys(expenditures.by_committee).length === 0) {
    return (
      <div className="secondary">
        No spending has been recorded in this state.
      </div>
    );
  }

  const committeesSortedByExpenditures = Object.keys(
    expenditures.by_committee,
  ).sort((a, b) => {
    return (
      expenditures.by_committee[b].total - expenditures.by_committee[a].total
    );
  });

  return (
    <div>
      {committeesSortedByExpenditures.map((committeeId) => {
        let committee;
        if (committees && committeeId in committees) {
          committee = committees[committeeId];
        }
        return (
          <div key={committeeId} className={styles.cardSection}>
            {committee ? (
              <Link href={`/2026/committees/${committeeId}`}>
                <h3>{committee.name}</h3>
              </Link>
            ) : (
              <h3>{committeeId}</h3>
            )}
            <b>
              {formatCurrency(
                expenditures.by_committee[committeeId].total,
                true,
              )}
            </b>
          </div>
        );
      })}
    </div>
  );
}
