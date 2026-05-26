import Link from "next/link";
import { Suspense } from "react";

import {
  fetchAllStateElections,
  fetchBeneficiaries,
  fetchBeneficiariesWithoutExpendituresOrder,
} from "@/app/actions/fetch";
import Candidate, { CandidateSkeleton } from "@/app/components/Candidate";
import ErrorText from "@/app/components/ErrorText";
import Outcome from "@/app/components/Outcome";
import Pagination from "@/app/components/Pagination";
import Skeleton from "@/app/components/skeletons/Skeleton";
import styles from "@/app/components/tables.module.css";
import { SINGLE_MEMBER_STATES, STATES_BY_ABBR } from "@/app/data/states";
import sharedStyles from "@/app/shared.module.css";
import { Beneficiary, CandidateBeneficiary } from "@/app/types/Beneficiaries";
import { RecipientCandidateDetails } from "@/app/types/Contributions";
import { ElectionsByState } from "@/app/types/Elections";
import { isError } from "@/app/utils/errors";
import { getRaceName } from "@/app/utils/races";
import { range } from "@/app/utils/range";
import { humanizeSector, parseSector } from "@/app/utils/sector";
import { titlecaseLastFirst } from "@/app/utils/titlecase";
import { formatCurrency } from "@/app/utils/utils";

const PAGE_SIZE = 20;

function getRaceId(candidateDetails: RecipientCandidateDetails): string {
  if (candidateDetails.office === "P") {
    return "P";
  } else if (candidateDetails.office === "S") {
    return `${candidateDetails.state}-S`;
  } else if (candidateDetails.office === "H") {
    let id = `${candidateDetails.state}-H`;
    if (!SINGLE_MEMBER_STATES.includes(candidateDetails.state)) {
      id += `-${candidateDetails.district}`;
    }
    return id;
  }
  return "";
}

function getShortRaceId(candidateDetails: RecipientCandidateDetails): string {
  if (candidateDetails.office === "P") {
    return "P";
  } else if (candidateDetails.office === "S") {
    return "S";
  } else if (candidateDetails.office === "H") {
    let id = "H";
    if (!SINGLE_MEMBER_STATES.includes(candidateDetails.state)) {
      id += `-${candidateDetails.district}`;
    }
    return id;
  }
  return "";
}

function getElectionCandidate(
  shortRaceId: string,
  candidateId: string,
  stateElections?: ElectionsByState,
) {
  let electionCandidate;
  const election = stateElections?.[shortRaceId];
  if (election) {
    electionCandidate = Object.values(election.candidates).find(
      (c) => c.candidate_id === candidateId,
    );
  }
  return electionCandidate;
}

function OtherRacesContentsSkeleton() {
  return range(20).map((i) => (
    <div key={`influenced-race-skeleton-${i}`} className={styles.influencedRow}>
      <CandidateSkeleton onCard={true} />
      {[2.5, 6, 5, 13].map((width, ind) => (
        <Skeleton
          key={`skeleton-${ind}`}
          onCard={true}
          width={`${width}rem`}
          className={`${sharedStyles.noMarginBottomHalfLeft} ${styles.skeletonExtra}`}
        />
      ))}
    </div>
  ));
}

function CandidateRow({
  beneficiary,
  stateElections,
  id,
}: {
  beneficiary: CandidateBeneficiary;
  stateElections?: ElectionsByState;
  id: string;
}) {
  const candidateDetails = beneficiary.candidate_details;
  let raceId = getRaceId(candidateDetails);
  let shortRaceId = getShortRaceId(candidateDetails);
  let electionCandidate = getElectionCandidate(shortRaceId, id, stateElections);

  // Try special election if candidate not found in regular election.
  // Only switch to the special-election identifiers if the candidate is
  // actually found there; otherwise keep the regular race so the name and
  // link remain correct even when candidate details are missing.
  if (!electionCandidate) {
    const specialShortRaceId = `${shortRaceId}-special`;
    const specialElectionCandidate = getElectionCandidate(
      specialShortRaceId,
      id,
      stateElections,
    );
    if (specialElectionCandidate) {
      raceId = `${raceId}-special`;
      shortRaceId = specialShortRaceId;
      electionCandidate = specialElectionCandidate;
    }
  }

  const raceHref = `/2026/elections/${raceId === "P" ? "president" : raceId}`;
  const raceName = getRaceName(raceId);
  const election = stateElections?.[shortRaceId];
  const stateHref =
    candidateDetails.office !== "P"
      ? `/2026/states/${STATES_BY_ABBR[candidateDetails.state].replaceAll(" ", "-").toLowerCase()}`
      : null;

  return (
    <tr className={styles.influencedTableRow} key={id}>
      <td className={`text-cell ${styles.candidateCol}`}>
        {electionCandidate ? (
          <Link className="unstyled" href={raceHref}>
            <Candidate candidateSummary={electionCandidate} />
          </Link>
        ) : (
          <>
            <span>
              {titlecaseLastFirst(beneficiary.candidate_details.name)}
            </span>
            <span>{id}</span>
          </>
        )}
        <div className={styles.mobileMeta}>
          {stateHref && (
            <>
              <Link href={stateHref}>
                {STATES_BY_ABBR[candidateDetails.state]}
              </Link>
              {" · "}
            </>
          )}
          <Link href={raceHref}>{raceName}</Link>
        </div>
      </td>
      <td className={`center-cell ${styles.stateCol}`}>
        {stateHref && (
          <Link className="unstyled" href={stateHref}>
            {candidateDetails.state}
          </Link>
        )}
      </td>
      <td className={`center-cell ${styles.officeCol}`}>
        <Link className="unstyled" href={raceHref}>
          {raceName}
        </Link>
      </td>
      <td className={`number-cell ${styles.otherCol}`}>
        <span className={styles.mobileLabel}>Direct contributions</span>
        <span className={styles.mobileValue}>
          {formatCurrency(beneficiary.total, true)}
        </span>
      </td>
      <td className={`text-cell ${styles.outcomeCol}`}>
        <div className={styles.outcomeContent}>
          {election && electionCandidate && (
            <Outcome candidate={electionCandidate} races={election.races} />
          )}
        </div>
      </td>
    </tr>
  );
}

function buildPageHref(p: number, rawSector?: string) {
  const sp = new URLSearchParams();
  if (rawSector) {
    sp.set("sector", rawSector);
  }
  if (p > 1) {
    sp.set("electionsPage", String(p));
  }
  const query = sp.toString();
  return query ? `?${query}` : "?";
}

export default async function OtherSupportedRaces({
  page,
  rawSector,
}: {
  page: number;
  rawSector?: string;
}) {
  const sector = parseSector(rawSector);
  const [beneficiariesData, beneficiariesOrder, electionsData] =
    await Promise.all([
      fetchBeneficiaries(sector),
      fetchBeneficiariesWithoutExpendituresOrder(sector),
      fetchAllStateElections(),
    ]);

  if (
    isError(beneficiariesData) ||
    isError(beneficiariesOrder) ||
    isError(electionsData)
  ) {
    return (
      <div className={styles.influencedCard}>
        <div className={styles.tableCardContent}>
          <h2 className={sharedStyles.sectionTitle}>
            Other races where{" "}
            {humanizeSector(sector, {
              lowercase: true,
              abbrev: true,
            })}{" "}
            companies and executives have contributed
          </h2>
        </div>
        <ErrorText subject="other contributions" />
      </div>
    );
  }

  const elections = electionsData as Record<string, ElectionsByState>;
  const beneficiaries = beneficiariesData as Record<string, Beneficiary>;
  const order = beneficiariesOrder as string[];

  const filtered = order.filter(
    (id) =>
      !id.startsWith("C") &&
      (beneficiaries[id] as CandidateBeneficiary).candidate_details
        .isRunningThisCycle,
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const clampedPage = Math.min(page, Math.max(1, totalPages));
  const paginated = filtered.slice(
    (clampedPage - 1) * PAGE_SIZE,
    clampedPage * PAGE_SIZE,
  );

  return (
    <div className={styles.influencedCard}>
      <div className={styles.tableCardContent}>
        <h2 className={sharedStyles.sectionTitle}>
          Other races where{" "}
          {humanizeSector(sector, {
            lowercase: true,
            abbrev: true,
          })}{" "}
          companies and executives have contributed
        </h2>
        <p className={sharedStyles.subtitle}>
          Federal races with no tracked super-PAC activity&nbsp;&mdash; only
          direct contributions from{" "}
          {humanizeSector(sector, {
            lowercase: true,
            abbrev: true,
          })}{" "}
          companies and executives to a candidate&rsquo;s principal campaign
          committee.
        </p>
      </div>
      <Suspense fallback={<OtherRacesContentsSkeleton />}>
        <table className={styles.influencedTable}>
          <thead className={styles.inheritBorderRadius}>
            <tr className={styles.influencedTableHeader}>
              <th className="text-cell">Candidate</th>
              <th className="center-cell">State</th>
              <th className="center-cell">Office</th>
              <th className="number-cell small-cell">
                Total industry contributions
              </th>
              <th className="long-text-cell">Outcome</th>
            </tr>
          </thead>
          <tbody className={styles.inheritBorderRadius}>
            {paginated.map((id) => {
              const beneficiary = beneficiaries[id] as CandidateBeneficiary;
              const state = beneficiary.candidate_details.state;
              return (
                <CandidateRow
                  key={id}
                  beneficiary={beneficiary}
                  stateElections={elections[state]}
                  id={id}
                />
              );
            })}
          </tbody>
        </table>
      </Suspense>
      <Pagination
        page={clampedPage}
        totalPages={totalPages}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
        itemLabel="races"
        sortLabel="total industry contributions"
        hrefs={Array.from({ length: totalPages }, (_, i) =>
          buildPageHref(i + 1, rawSector),
        )}
      />
    </div>
  );
}
