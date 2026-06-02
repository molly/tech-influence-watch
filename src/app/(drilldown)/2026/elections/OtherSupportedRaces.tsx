import Link from "next/link";
import { Suspense } from "react";

import {
  fetchAllStateElections,
  fetchBeneficiaries,
  fetchBeneficiariesWithoutExpendituresOrder,
} from "@/app/actions/fetch";
import Candidate from "@/app/components/Candidate";
import ErrorText from "@/app/components/ErrorText";
import Outcome from "@/app/components/Outcome";
import PaginatedTable from "@/app/components/PaginatedTable";
import styles from "@/app/components/tables.module.css";
import { SINGLE_MEMBER_STATES, STATES_BY_ABBR } from "@/app/data/states";
import sharedStyles from "@/app/shared.module.css";
import { Beneficiary, CandidateBeneficiary } from "@/app/types/Beneficiaries";
import { RecipientCandidateDetails } from "@/app/types/Contributions";
import { ElectionsByState } from "@/app/types/Elections";
import { Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import { getRaceName } from "@/app/utils/races";
import { humanizeSector } from "@/app/utils/sector";
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

export default async function OtherSupportedRaces({
  sector,
}: {
  sector: Sector;
}) {
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

  const rowNodes = filtered.map((id) => {
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
  });

  const header = (
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
      <Suspense
        fallback={
          <table className={styles.influencedTable}>
            {header}
            <tbody className={styles.inheritBorderRadius}>
              {rowNodes.slice(0, PAGE_SIZE)}
            </tbody>
          </table>
        }
      >
        <PaginatedTable
          header={header}
          rows={rowNodes}
          pageSize={PAGE_SIZE}
          pageParam="otherRacesPage"
          itemLabel="races"
          sortLabel="total industry contributions"
        />
      </Suspense>
    </div>
  );
}
