import Link from "next/link";

import sharedStyles from "@/app/shared.module.css";
import {
  RecentContribution,
  RecipientCandidateDetails,
} from "@/app/types/Contributions";
import { Sector } from "@/app/types/Sector";
import { getRaceName, getStateFromRaceId } from "@/app/utils/races";
import { titlecaseCommittee, titlecaseLastFirst } from "@/app/utils/titlecase";
import {
  formatCurrency,
  formatDateFromString,
  formatRelativeDate,
} from "@/app/utils/utils";

import { STATES_BY_ABBR } from "../data/states";
import { range } from "../utils/range";
import styles from "./individualOrCompany/individualOrCompany.module.css";
import MaybeLink from "./MaybeLink";
import feedStyles from "./recentExpenditures.module.css";
import Skeleton from "./skeletons/Skeleton";

export function RecentContributionsContentSkeleton({
  fullPage,
}: {
  fullPage?: boolean;
} = {}) {
  return range(fullPage ? 20 : 5).map((i) => (
    <div
      className={styles.contributionRow}
      key={`recent-contributions-skeleton-row-${i}`}
    >
      <div className={styles.contributionSummary}>
        <Skeleton randWidth={[10, 20]} onCard={true} />
        <Skeleton width="6rem" onCard={true} />
      </div>
      <div className={styles.committeeDetails}>
        <Skeleton width="15rem" onCard={true} />
      </div>
      <div className={styles.contributionDetails}>
        <Skeleton width="18rem" onCard={true} />
      </div>
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
    race_id = race_link.replace("/2026/elections/", "").toUpperCase();
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

function ContributionRow({
  contribution,
  trackedCommitteeIds,
  index,
  sector,
}: {
  contribution: RecentContribution;
  trackedCommitteeIds: Set<string>;
  index: number;
  sector?: Sector;
}) {
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

  const state = getStateFromRaceId(candidate?.race_id);

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
      key={`recent-contribution-${index}`}
      className={styles.contributionRow}
    >
      <div className={styles.contributionSummary}>
        <span className={styles.contributionCommittee}>
          {isTracked ? (
            <Link
              className="unstyled"
              href={`/2026/committees/${contribution.committee_id}`}
            >
              {committeeDisplay}
            </Link>
          ) : (
            committeeDisplay
          )}
        </span>
        {amount != null && (
          <span className={styles.summaryAmount}>
            {formatCurrency(amount, true)}
          </span>
        )}
      </div>
      {contribution.committee_description && (
        <div className={styles.committeeDetails}>
          <span className={styles.committeeDetail}>
            {contribution.committee_description}
          </span>
        </div>
      )}
      {!contribution.committee_description && candidate && (
        <div className={styles.committeeDetails}>
          <span className={styles.committeeDetail}>
            {candidate.name}
            {!candidate.isRunningThisCycle && " (not on 2026 ballot)"}
          </span>
          {candidate.race_id && (
            <span className={styles.committeeDetail}>
              {candidate.race_link ? (
                <Link href={candidate.race_link}>
                  {state && `${STATES_BY_ABBR[state]} `}
                  {getRaceName(candidate.race_id)}
                </Link>
              ) : (
                candidate.race_id
              )}
            </span>
          )}
        </div>
      )}
      {!contribution.committee_description && sponsorCandidate && (
        <div className={styles.committeeDetails}>
          <span className={styles.committeeDetail}>
            {sponsorCandidate.name}
            {sponsorCandidate.race_id && (
              <>
                {" ("}
                {STATES_BY_ABBR[sponsorCandidate.race_id.split("-")[0]]}{" "}
                {sponsorCandidate.race_link ? (
                  <MaybeLink href={sponsorCandidate.race_link}>
                    {getRaceName(sponsorCandidate.race_id)}
                  </MaybeLink>
                ) : (
                  sponsorCandidate.race_id
                )}
              </>
            )}
            {")"}
            {" leadership PAC"}
          </span>
        </div>
      )}
      <div className={styles.contributionDetails}>
        <span className="bold">
          <Link href={sourceHref}>{contribution.source_name}</Link>
          {sector === "all" &&
            contribution.source_sector &&
            contribution.source_sector !== "tech" && (
              <span className={sharedStyles.sectorBadge}>
                {contribution.source_sector === "ai"
                  ? "AI"
                  : contribution.source_sector}
              </span>
            )}
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
        {date && (
          <span className={styles.contributionDate}>
            {formatDateFromString(date)}
          </span>
        )}
      </div>
    </div>
  );
}

export default function RecentContributionsContent({
  contributions,
  trackedCommitteeIds,
  fullPage,
  sector,
}: {
  contributions: RecentContribution[];
  trackedCommitteeIds: Set<string>;
  fullPage?: boolean;
  sector?: Sector;
}) {
  if (!fullPage) {
    return contributions.map((contribution, i) => (
      <ContributionRow
        key={`contribution-${i}`}
        contribution={contribution}
        trackedCommitteeIds={trackedCommitteeIds}
        index={i}
        sector={sector}
      />
    ));
  }

  const groups: {
    dateKey: string;
    items: RecentContribution[];
    total: number;
  }[] = [];
  const seenKeys = new Map<string, number>();

  for (const contribution of contributions) {
    const dateKey =
      contribution.contribution_receipt_date ?? contribution.newest ?? "";
    const existing = seenKeys.get(dateKey);
    if (existing !== undefined) {
      groups[existing].items.push(contribution);
      groups[existing].total +=
        contribution.contribution_receipt_amount ??
        contribution.total_receipt_amount ??
        0;
    } else {
      seenKeys.set(dateKey, groups.length);
      groups.push({
        dateKey,
        items: [contribution],
        total:
          contribution.contribution_receipt_amount ??
          contribution.total_receipt_amount ??
          0,
      });
    }
  }

  return groups.map(({ dateKey, items, total }) => (
    <div key={dateKey} className={feedStyles.dateGroup}>
      {dateKey && (
        <div className={feedStyles.dateGroupHeader}>
          <div className={feedStyles.dateGroupDateGroup}>
            <h3 className={feedStyles.dateGroupDate}>
              {formatDateFromString(dateKey)}
            </h3>
            <span className={feedStyles.dateGroupMeta}>
              {formatRelativeDate(dateKey)}
            </span>
          </div>
          <div className={feedStyles.dateGroupTotal}>
            {"day total "}
            <span className="bold">{formatCurrency(total, true)}</span>
          </div>
        </div>
      )}
      {items.map((contribution, i) => (
        <ContributionRow
          key={`${dateKey}-${i}`}
          contribution={contribution}
          trackedCommitteeIds={trackedCommitteeIds}
          index={i}
          sector={sector}
        />
      ))}
    </div>
  ));
}
