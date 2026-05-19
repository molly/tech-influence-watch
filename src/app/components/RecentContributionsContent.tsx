import Link from "next/link";

import {
  RecentContribution,
  RecipientCandidateDetails,
} from "@/app/types/Contributions";
import { getRaceName } from "@/app/utils/races";
import { titlecaseCommittee, titlecaseLastFirst } from "@/app/utils/titlecase";
import { formatCurrency, formatDateFromString } from "@/app/utils/utils";

import { STATES_BY_ABBR } from "../data/states";
import { range } from "../utils/range";
import MaybeLink from "./MaybeLink";
import styles from "./recentExpenditures.module.css";
import Skeleton from "./skeletons/Skeleton";

export function RecentContributionsContentSkeleton({
  fullPage,
}: {
  fullPage?: boolean;
} = {}) {
  return range(fullPage ? 20 : 5).map((i) => (
    <div
      className={styles.recentExpenditureRow}
      key={`recent-contributions-skeleton-row-${i}`}
    >
      <div>
        <Skeleton width="18rem" onCard={true} />
      </div>
      <div className={styles.expenditureNameAndAmount}>
        <Skeleton randWidth={[10, 20]} onCard={true} />
        <Skeleton width="6rem" onCard={true} />
      </div>
      <Skeleton width="15rem" onCard={true} />
    </div>
  ));
}

function getCandidateDisplay(
  candidateIds: string[] | undefined,
  candidateDetails: Record<string, RecipientCandidateDetails> | undefined,
): {
  name: string;
  race_id?: string;
  race_link?: string;
  isRunningThisCycle: boolean;
} | null {
  if (!candidateIds || !candidateDetails) {
    return null;
  }
  // Deduplicate by last name, preferring the most recent election year,
  // mirroring the logic in CommitteeDetails.tsx
  const lastNameMap = new Map<string, string>();
  for (const id of candidateIds) {
    const details = candidateDetails[id];
    if (!details?.name) {
      continue;
    }
    const lastName = details.name.split(", ")[0];
    const existing = lastNameMap.get(lastName);
    if (!existing) {
      lastNameMap.set(lastName, id);
    } else {
      const existingMax = Math.max(
        ...(candidateDetails[existing].election_years ?? [0]),
      );
      const currentMax = Math.max(...(details.election_years ?? [0]));
      if (currentMax > existingMax) {
        lastNameMap.set(lastName, id);
      }
    }
  }
  const uniqueIds = Array.from(lastNameMap.values());
  if (uniqueIds.length === 0) {
    return null;
  }
  const details = candidateDetails[uniqueIds[0]];
  const race_link = details.race_link;
  let race_id: string | undefined;
  if (race_link) {
    race_id = race_link.replace("/elections/", "").toUpperCase();
  } else if (details.state && details.office) {
    const parts = [details.state, details.office];
    if (details.district && details.district !== "00") {
      parts.push(details.district);
    }
    race_id = parts.join("-").toUpperCase();
  }
  return {
    name: titlecaseLastFirst(details.name),
    race_id,
    race_link,
    isRunningThisCycle: details.isRunningThisCycle,
  };
}

export default function RecentContributionsContent({
  contributions,
  trackedCommitteeIds,
}: {
  contributions: RecentContribution[];
  trackedCommitteeIds: Set<string>;
}) {
  return contributions.map((contribution, i) => {
    const committeeDisplay = contribution.committee_name
      ? titlecaseCommittee(contribution.committee_name, false)
      : contribution.committee_id;

    const isTracked =
      !!contribution.committee_id &&
      trackedCommitteeIds.has(contribution.committee_id);

    const candidate = getCandidateDisplay(
      contribution.candidate_ids,
      contribution.candidate_details,
    );

    const sponsorCandidate = getCandidateDisplay(
      contribution.sponsor_candidate_ids,
      contribution.candidate_details,
    );

    const sourceHref =
      contribution.source_type === "individual"
        ? `/2026/individuals/${contribution.source_id}`
        : `/2026/companies/${contribution.source_id}`;

    const amount =
      contribution.contribution_receipt_amount ??
      contribution.total_receipt_amount;

    const date = contribution.contribution_receipt_date ?? contribution.newest;
    return (
      <div
        key={`recent-contribution-${i}`}
        className={styles.recentExpenditureRow}
      >
        <div className={styles.expenditureDescription}>
          {date && formatDateFromString(date)}
        </div>
        <div className={styles.expenditureNameAndAmount}>
          <div>
            <span className="bold">
              <Link href={sourceHref}>{contribution.source_name}</Link>
            </span>
            {contribution.source_company &&
              contribution.source_company.length > 0 && (
                <span className="secondary">
                  {" ("}
                  {contribution.source_company.map((name, j) => {
                    const id = contribution.source_company_ids?.[j];
                    return (
                      <span key={name}>
                        {j > 0 && ", "}
                        {id ? (
                          <Link href={`/2026/companies/${id}`}>{name}</Link>
                        ) : (
                          name
                        )}
                      </span>
                    );
                  })}
                  {")"}
                </span>
              )}
          </div>
          {amount != null && (
            <span className={styles.expenditureAmount}>
              {formatCurrency(amount, true)}
            </span>
          )}
        </div>
        <div>
          {isTracked ? (
            <Link href={`/2026/committees/${contribution.committee_id}`}>
              {committeeDisplay}
            </Link>
          ) : (
            committeeDisplay
          )}
          {contribution.committee_description && (
            <div className={styles.expenditureDescription}>
              {contribution.committee_description}
            </div>
          )}
          {!contribution.committee_description && candidate && (
            <div className={styles.expenditureDescription}>
              {candidate.name}
              {candidate.race_id && (
                <>
                  {" · "}
                  {candidate.race_link ? (
                    <Link href={`/2026${candidate.race_link}`}>
                      {candidate.race_id}
                    </Link>
                  ) : (
                    candidate.race_id
                  )}
                </>
              )}
              {!candidate.isRunningThisCycle && " (not on 2026 ballot)"}
            </div>
          )}
          {!contribution.committee_description && sponsorCandidate && (
            <div className={styles.expenditureDescription}>
              {sponsorCandidate.name}
              {sponsorCandidate.race_id && (
                <>
                  {" ("}
                  {STATES_BY_ABBR[sponsorCandidate.race_id.split("-")[0]]}{" "}
                  {sponsorCandidate.race_link ? (
                    <MaybeLink href={`/2026${sponsorCandidate.race_link}`}>
                      {getRaceName(sponsorCandidate.race_id)}
                    </MaybeLink>
                  ) : (
                    sponsorCandidate.race_id
                  )}
                </>
              )}
              {")"}
              {" leadership PAC"}
            </div>
          )}
        </div>
      </div>
    );
  });
}
