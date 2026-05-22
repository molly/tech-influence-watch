import Link from "next/link";
import { useEffect, useState } from "react";

import {
  fetchAllStateElections,
  fetchBeneficiaries,
  fetchCandidateExpenditures,
  fetchConstant,
} from "@/app/actions/fetch";
import styles from "@/app/components/tables.module.css";
import sharedStyles from "@/app/shared.module.css";
import { ElectionGroup, ElectionsByState, Race } from "@/app/types/Elections";
import {
  ExpenditureCandidateSummary,
  ExpendituresByCandidate,
} from "@/app/types/Expenditures";
import { ErrorType, isError } from "@/app/utils/errors";
import { getRaceName, getUpcomingRaceForCandidate } from "@/app/utils/races";
import { range } from "@/app/utils/range";
import { formatCurrency } from "@/app/utils/utils";

import { STATES_BY_ABBR } from "../data/states";
import { Beneficiary } from "../types/Beneficiaries";
import { CommitteeConstant } from "../types/Committee";
import { Sector } from "../types/Sector";
import { getCommitteeIdsForSector } from "../utils/sector";
import Candidate, { CandidateSkeleton } from "./Candidate";
import ErrorText from "./ErrorText";
import InformationalTooltip from "./InformationalTooltip";
import Outcome from "./Outcome";
import Skeleton from "./skeletons/Skeleton";

function computeSectorTotals(
  candidateName: string,
  state: string,
  race: string,
  raceDetails: Record<string, ElectionsByState>,
  committeeIds: Set<string>,
): { support: number; oppose: number } {
  const raceSpending = raceDetails[state]?.[race]?.spending ?? {};
  let support = 0;
  let oppose = 0;
  for (const [committeeId, spending] of Object.entries(raceSpending)) {
    if (committeeIds.has(committeeId)) {
      for (const subraceSpending of Object.values(spending.subraces)) {
        const candidateSpending = subraceSpending.candidates[candidateName];
        if (candidateSpending) {
          support += candidateSpending.support;
          oppose += candidateSpending.oppose;
        }
      }
    }
  }
  return { support, oppose };
}

function InfluencedRacesContentsSkeleton({ fullPage }: { fullPage: boolean }) {
  return range(fullPage ? 20 : 5).map((i) => (
    <div key={`influenced-race-skeleton-${i}`} className={styles.influencedRow}>
      <CandidateSkeleton onCard={true} />
      {[2.5, 6, 5, 5, 5, 5, 13].map((width, ind) => (
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

function GoalOutcome({
  candidate,
  races,
  explanatoryText = false,
}: {
  candidate: ExpenditureCandidateSummary;
  races: Race[];
  explanatoryText?: boolean;
}) {
  const wasOpposed = candidate.oppose_total > 0;
  const wasSupported = candidate.support_total > 0;
  let icon = null;
  let text = null;

  if (candidate.defeated || candidate.withdrew) {
    const verb = candidate.defeated ? "lost" : "withdrew from";
    if (wasOpposed) {
      if (wasSupported) {
        icon = (
          <svg
            className={`${sharedStyles.goalMixed} ${explanatoryText ? sharedStyles.goalInline : ""}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <title>
              Mixed results (this candidate received both support and opposition
              from crypto PACs)
            </title>
            <path d="M32 288c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32" />
          </svg>
        );
        text = `Candidate both supported and opposed by crypto PACs ${verb} their race`;
      } else {
        icon = (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            className={`${sharedStyles.goalAccomplished} ${explanatoryText ? sharedStyles.goalInline : ""}`}
            role="image"
          >
            <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
            <title>Goal achieved</title>
          </svg>
        );
        text = `Candidate opposed by crypto PACs ${verb} their race`;
      }
    } else {
      icon = (
        <svg
          className={`${sharedStyles.goalFailed} ${explanatoryText ? sharedStyles.goalInline : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
        >
          <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          <title>Goal failed</title>
        </svg>
      );
      text = `Candidate supported by crypto PACs ${verb} their race`;
    }
  } else if (candidate.won && wasSupported) {
    icon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        className={`${sharedStyles.goalAccomplished} ${explanatoryText ? sharedStyles.goalInline : ""}`}
        role="image"
      >
        <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
        <title>Goal achieved</title>
      </svg>
    );
    text = `Candidate supported by crypto PACs won their race`;
  } else {
    const nextRace = getUpcomingRaceForCandidate(races, candidate);
    if (!nextRace) {
      if (wasSupported && wasOpposed) {
        icon = (
          <svg
            className={`${sharedStyles.goalMixed} ${explanatoryText ? sharedStyles.goalInline : ""}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <title>
              Mixed results (this candidate received both support and opposition
              from crypto PACs)
            </title>
            <path d="M32 288c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32" />
          </svg>
        );
        text = `Candidate both supported and opposed by crypto PACs won their race`;
      } else if (wasSupported) {
        icon = (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            className={`${sharedStyles.goalAccomplished} ${explanatoryText ? sharedStyles.goalInline : ""}`}
            role="image"
          >
            <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
            <title>Goal achieved</title>
          </svg>
        );
        text = `Candidate supported by crypto PACs won their race`;
      } else if (wasOpposed) {
        icon = (
          <svg
            className={`${sharedStyles.goalFailed} ${explanatoryText ? sharedStyles.goalInline : ""}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
          >
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
            <title>Goal failed</title>
          </svg>
        );
        text = `Candidate supported by crypto PACs lost their race`;
      }
    }
  }

  if (!icon) {
    return null;
  }

  if (explanatoryText) {
    return (
      <>
        <div className={styles.goalIconWrapper}>{icon}</div>
        {text}
      </>
    );
  } else {
    return icon;
  }
}

function CandidateRow({
  candidate,
  race,
  beneficiary,
}: {
  candidate: ExpenditureCandidateSummary;
  race: ElectionGroup;
  beneficiary?: Beneficiary;
}) {
  const raceHref = `/2026/elections/${candidate.state}-${candidate.race}`;
  const raceName = getRaceName(
    `${candidate.state}-${candidate.race}`,
    race.year,
    true,
  );
  const stateHref = `/2026/states/${STATES_BY_ABBR[candidate.state].replaceAll(" ", "-").toLowerCase()}`;

  return (
    <tr className={styles.influencedTableRow}>
      <td className={`text-cell ${styles.candidateCol}`}>
        <Link className="unstyled-no-underline" href={raceHref}>
          <Candidate candidateSummary={candidate} />
        </Link>
        <div className={styles.mobileMeta}>
          <Link href={stateHref}>{STATES_BY_ABBR[candidate.state]}</Link>
          {" · "}
          <Link href={raceHref}>{raceName}</Link>
        </div>
      </td>
      <td className={`center-cell ${styles.stateCol}`}>
        <Link className="unstyled-no-underline" href={stateHref}>
          {candidate.state}
        </Link>
      </td>
      <td className={`center-cell small-cell ${styles.officeCol}`}>
        <Link className="unstyled-no-underline" href={raceHref}>
          {raceName}
        </Link>
      </td>
      <td
        className={`${styles.supportCol} ${candidate.support_total ? "number-cell" : `center-cell ${styles.noValue}`}`}
      >
        <span className={styles.mobileLabel}>Support</span>
        <span className={styles.mobileValue}>
          {candidate.support_total ? (
            formatCurrency(candidate.support_total, true)
          ) : (
            <span className={styles.nilCell}>—</span>
          )}
        </span>
      </td>
      <td
        className={`${styles.opposeCol} ${candidate.oppose_total ? "number-cell" : `center-cell ${styles.noValue}`}`}
      >
        <span className={styles.mobileLabel}>Oppose</span>
        <span className={styles.mobileValue}>
          {candidate.oppose_total ? (
            formatCurrency(candidate.oppose_total, true)
          ) : (
            <span className={styles.nilCell}>—</span>
          )}
        </span>
      </td>
      <td
        className={`small-cell ${styles.otherCol} ${beneficiary ? "number-cell" : `center-cell ${styles.noValue}`}`}
      >
        <span className={styles.mobileLabel}>Direct contributions</span>
        <span className={styles.mobileValue}>
          {beneficiary ? (
            formatCurrency(beneficiary.total, true)
          ) : (
            <span className={styles.nilCell}>—</span>
          )}
        </span>
      </td>
      <td className={`small-cell center-cell ${styles.goalCol}`}>
        <GoalOutcome candidate={candidate} races={race.races} />
      </td>
      <td className={`text-cell ${styles.outcomeCol}`}>
        <div className={styles.outcomeContent}>
          <Outcome candidate={candidate} races={race.races} />
        </div>
        <div className={styles.mobileGoalOutcome}>
          <GoalOutcome
            candidate={candidate}
            races={race.races}
            explanatoryText={true}
          />
        </div>
      </td>
    </tr>
  );
}

export default function InfluencedRacesContents({
  fullPage = false,
  sector = "all",
}: {
  fullPage?: boolean;
  sector?: Sector;
}) {
  const [expenditures, setExpenditures] = useState<
    ExpendituresByCandidate | ErrorType
  >({
    order: [],
    candidates: {},
  });
  const [raceDetailsData, setRaceDetails] = useState<
    Record<string, ElectionsByState> | ErrorType | null
  >();
  const [beneficiaries, setBeneficiaries] = useState<Record<
    string,
    Beneficiary
  > | null>();
  const [committeeConstants, setCommitteeConstants] = useState<Record<
    string,
    CommitteeConstant
  > | null>(null);

  useEffect(() => {
    setCommitteeConstants(null); // eslint-disable-line react-hooks/set-state-in-effect
    (async function () {
      const fetchLimit = sector === "all" && !fullPage ? 5 : undefined;
      const [expenditureData, raceData, beneficiariesData, committeeData] =
        await Promise.all([
          fetchCandidateExpenditures(fetchLimit),
          fetchAllStateElections(),
          fetchBeneficiaries(sector),
          sector !== "all"
            ? fetchConstant<Record<string, CommitteeConstant>>("committees")
            : Promise.resolve(null),
        ]);
      setExpenditures(expenditureData);
      setRaceDetails(raceData);
      setBeneficiaries(
        isError(beneficiariesData)
          ? {}
          : (beneficiariesData as Record<string, Beneficiary>),
      );
      setCommitteeConstants(
        sector !== "all" && !isError(committeeData)
          ? (committeeData as Record<string, CommitteeConstant>)
          : null,
      );
    })();
  }, [fullPage, sector]);

  if (!raceDetailsData || (sector !== "all" && !committeeConstants)) {
    return <InfluencedRacesContentsSkeleton fullPage={fullPage} />;
  }

  if (isError(expenditures) || isError(raceDetailsData)) {
    return (
      <div className={sharedStyles.errorCardContentStandalone}>
        <ErrorText subject="the list of races" />
      </div>
    );
  }

  const { order, candidates } = expenditures as ExpendituresByCandidate;
  const raceDetails = raceDetailsData as Record<string, ElectionsByState>;

  let rows: string[];
  let displayCandidates: Record<string, ExpenditureCandidateSummary>;

  if (sector !== "all" && committeeConstants) {
    const committeeIds =
      getCommitteeIdsForSector(sector, committeeConstants) ?? new Set<string>();
    const filtered: Record<string, ExpenditureCandidateSummary> = {};
    for (const name of order) {
      const candidate = candidates[name];
      const { support, oppose } = computeSectorTotals(
        name,
        candidate.state,
        candidate.race,
        raceDetails,
        committeeIds,
      );
      if (support > 0 || oppose > 0) {
        filtered[name] = {
          ...candidate,
          support_total: support,
          oppose_total: oppose,
        };
      }
    }
    rows = Object.keys(filtered).sort((a, b) => {
      const totalA = filtered[a].support_total + filtered[a].oppose_total;
      const totalB = filtered[b].support_total + filtered[b].oppose_total;
      return totalB - totalA;
    });
    if (!fullPage) {
      rows = rows.slice(0, 5);
    }
    displayCandidates = filtered;
  } else {
    rows = order;
    displayCandidates = candidates;
  }

  const contents = rows.map((candidateName) => {
    const candidate = displayCandidates[candidateName];
    const beneficiary =
      beneficiaries && candidate.candidate_id
        ? beneficiaries[candidate.candidate_id]
        : undefined;
    return (
      <CandidateRow
        key={candidateName}
        candidate={candidate}
        race={raceDetails[candidate.state][candidate.race]}
        beneficiary={beneficiary}
      />
    );
  });

  return (
    <table className={styles.influencedTable}>
      <thead className={styles.inheritBorderRadius}>
        <tr className={styles.influencedTableHeader}>
          <th className="text-cell">Candidate</th>
          <th className="center-cell">State</th>
          <th className="center-cell small-cell">Office</th>
          <th className="number-cell">Support</th>
          <th className="number-cell">Oppose</th>
          <th className="small-cell center-cell">
            Direct{" "}
            <span className="no-wrap">
              contributions
              <InformationalTooltip>
                <p>
                  Contributions from cryptocurrency industry companies or
                  associated individuals to this candidate or aligned
                  committees, which have not gone through the crypto-focused
                  super PACs.
                </p>
                <p>
                  This relies on manual classification and so represents a
                  conservative estimate of industry spending.
                </p>
              </InformationalTooltip>
            </span>
          </th>
          <th className="small-cell center-cell">
            Goal{" "}
            <span className="no-wrap">
              achieved?
              <InformationalTooltip>
                <span>
                  The PACs&rsquo; goal is considered to have been achieved if a
                  candidate they supported won their election, or if a candidate
                  they opposed lost.
                </span>
              </InformationalTooltip>
            </span>
          </th>
          <th className="long-text-cell">Outcome</th>
        </tr>
      </thead>
      <tbody className={styles.inheritBorderRadius}>{contents}</tbody>
    </table>
  );
}
