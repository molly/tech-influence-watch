import Link from "next/link";
import { Suspense } from "react";

import PaginatedTable from "./PaginatedTable";

const PAGE_SIZE = 20;

import {
  fetchAllStateElections,
  fetchBeneficiaries,
  fetchCandidateExpenditures,
  fetchCookRatings,
} from "@/app/actions/fetch";
import styles from "@/app/components/tables.module.css";
import sharedStyles from "@/app/shared.module.css";
import { ElectionGroup, ElectionsByState, Race } from "@/app/types/Elections";
import {
  ExpenditureCandidateSummary,
  ExpendituresByCandidate,
} from "@/app/types/Expenditures";
import { isError } from "@/app/utils/errors";
import {
  getMostRecentRaceResult,
  getRaceName,
  getUpcomingRaceForCandidate,
} from "@/app/utils/races";
import { range } from "@/app/utils/range";
import { type Goal } from "@/app/utils/results";
import { formatCurrency } from "@/app/utils/utils";

import { CookRating } from "../data/cookRatings";
import { STATES_BY_ABBR } from "../data/states";
import { Beneficiary } from "../types/Beneficiaries";
import { Sector } from "../types/Sector";
import {
  getSectorOpposeTotal,
  getSectorSupportTotal,
  humanizeSector,
} from "../utils/sector";
import Candidate, { CandidateSkeleton } from "./Candidate";
import ErrorText from "./ErrorText";
import InformationalTooltip from "./InformationalTooltip";
import Outcome from "./Outcome";
import { RaceRatingChip, RatingHeader } from "./RaceRating";
import Skeleton from "./skeletons/Skeleton";

export function InfluencedRacesContentsSkeleton({
  fullPage,
}: {
  fullPage: boolean;
}) {
  return range(fullPage ? 20 : 5).map((i) => (
    <div
      key={`influenced-race-skeleton-${i}`}
      className={styles.influencedRowSkeleton}
    >
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

const CHECK_PATH =
  "M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z";
const X_PATH =
  "M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z";

const GOAL_TITLES: Record<Goal, string> = {
  achieved: "Goal achieved",
  failed: "Goal failed",
  mixed: "Mixed results",
};

export function GoalIcon({
  goal,
  inline = false,
  title = GOAL_TITLES[goal],
}: {
  goal: Goal;
  inline?: boolean;
  title?: string;
}) {
  const inlineClass = inline ? sharedStyles.goalInline : "";
  if (goal === "achieved") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        className={`${sharedStyles.goalAccomplished} ${inlineClass}`}
        role="image"
      >
        <path d={CHECK_PATH} />
        <title>{title}</title>
      </svg>
    );
  }
  if (goal === "failed") {
    return (
      <svg
        className={`${sharedStyles.goalFailed} ${inlineClass}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384 512"
      >
        <path d={X_PATH} />
        <title>{title}</title>
      </svg>
    );
  }
  return (
    <svg
      className={`${sharedStyles.goalMixed} ${inlineClass}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
    >
      <title>{title}</title>
      <path d="M32 288c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32" />
    </svg>
  );
}

// A check for a candidate who won and an x for one who lost, in the text color
// so it isn't read as whether the money's goal was met
export function ResultIcon({
  won,
  className,
}: {
  won: boolean;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={won ? "0 0 448 512" : "0 0 384 512"}
      className={className}
    >
      <title>{won ? "Won" : "Lost"}</title>
      <path d={won ? CHECK_PATH : X_PATH} />
    </svg>
  );
}

const MIXED_CANDIDATE_TITLE =
  "Mixed results (this candidate received both support and opposition from industry PACs)";

export function GoalOutcome({
  candidate,
  races,
  sector,
  explanatoryText = false,
}: {
  candidate: ExpenditureCandidateSummary;
  races: Race[];
  sector: Sector;
  explanatoryText?: boolean;
}) {
  const wasOpposed = getSectorOpposeTotal(candidate, sector) > 0;
  const wasSupported = getSectorSupportTotal(candidate, sector) > 0;
  const nextRace = getUpcomingRaceForCandidate(races, candidate);
  // Derive win/loss from the recorded race result rather than the summary's
  // `defeated`/`won` flags, which the pipeline doesn't keep in sync with manual
  // race edits. An uncalled most-recent race leaves both false (no goal shown).
  const result = nextRace
    ? undefined
    : getMostRecentRaceResult(races, candidate);
  const lost = result === false;
  const won = result === true;
  let goal: Goal | null = null;
  let text = null;

  if (lost || candidate.withdrew || candidate.died) {
    // "died" stands alone as a complete phrase; the other two take "their race".
    const outcomePhrase = lost
      ? "lost their race"
      : candidate.died
        ? "died"
        : "withdrew from their race";
    if (wasOpposed) {
      if (wasSupported) {
        goal = "mixed";
        text = `Candidate both supported and opposed by industry PACs ${outcomePhrase}`;
      } else {
        goal = "achieved";
        text = `Candidate opposed by industry PACs ${outcomePhrase}`;
      }
    } else {
      goal = "failed";
      text = `Candidate supported by industry PACs ${outcomePhrase}`;
    }
  } else if (won) {
    if (wasSupported && wasOpposed) {
      goal = "mixed";
      text = `Candidate both supported and opposed by industry PACs won their race`;
    } else if (wasSupported) {
      goal = "achieved";
      text = `Candidate supported by industry PACs won their race`;
    } else if (wasOpposed) {
      goal = "failed";
      text = `Candidate opposed by industry PACs won their race`;
    }
  }

  const icon = goal && (
    <GoalIcon
      goal={goal}
      inline={explanatoryText}
      title={goal === "mixed" ? MIXED_CANDIDATE_TITLE : undefined}
    />
  );

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
  sector,
  showRating,
  rating,
}: {
  candidate: ExpenditureCandidateSummary;
  race: ElectionGroup;
  beneficiary?: Beneficiary;
  sector: Sector;
  // Ratings are shown on the full elections list, not the homepage preview
  showRating: boolean;
  rating?: CookRating;
}) {
  const supportTotal = getSectorSupportTotal(candidate, sector);
  const opposeTotal = getSectorOpposeTotal(candidate, sector);
  const raceId = `${candidate.state}-${candidate.race}`;
  const raceHref = `/2026/elections/${raceId}`;
  const raceName = getRaceName(
    raceId,
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
          {showRating && (
            <RaceRatingChip rating={rating} className={styles.mobileRating} />
          )}
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
      {showRating && (
        <td className={`center-cell ${styles.ratingCol}`}>
          {rating ? (
            <RaceRatingChip rating={rating} />
          ) : (
            <span className={styles.nilCell}>—</span>
          )}
        </td>
      )}
      <td
        className={`${styles.supportCol} ${supportTotal ? "number-cell" : `center-cell ${styles.noValue}`}`}
      >
        <span className={styles.mobileLabel}>Support</span>
        <span className={styles.mobileValue}>
          {supportTotal ? (
            formatCurrency(supportTotal, true)
          ) : (
            <span className={styles.nilCell}>—</span>
          )}
        </span>
      </td>
      <td
        className={`${styles.opposeCol} ${opposeTotal ? "number-cell" : `center-cell ${styles.noValue}`}`}
      >
        <span className={styles.mobileLabel}>Oppose</span>
        <span className={styles.mobileValue}>
          {opposeTotal ? (
            formatCurrency(opposeTotal, true)
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
        <GoalOutcome candidate={candidate} races={race.races} sector={sector} />
      </td>
      <td className={`text-cell ${styles.outcomeCol}`}>
        <div className={styles.outcomeContent}>
          <Outcome candidate={candidate} races={race.races} />
        </div>
        <div className={styles.mobileGoalOutcome}>
          <GoalOutcome
            candidate={candidate}
            races={race.races}
            sector={sector}
            explanatoryText={true}
          />
        </div>
      </td>
    </tr>
  );
}

export default async function InfluencedRacesContents({
  fullPage = false,
  sector = "all",
}: {
  fullPage?: boolean;
  sector?: Sector;
}) {
  const fetchLimit = sector === "all" && !fullPage ? 5 : undefined;
  const [expenditureData, raceData, beneficiariesData, cookRatings] =
    await Promise.all([
    fetchCandidateExpenditures(fetchLimit),
    fetchAllStateElections(),
    fetchBeneficiaries(sector),
    fetchCookRatings(),
  ]);

  if (isError(expenditureData) || isError(raceData)) {
    return (
      <div className={sharedStyles.errorCardContentStandalone}>
        <ErrorText subject="the list of races" />
      </div>
    );
  }

  const { order, candidates } = expenditureData as ExpendituresByCandidate;
  const raceDetails = raceData as Record<string, ElectionsByState>;
  const beneficiaries = isError(beneficiariesData)
    ? {}
    : (beneficiariesData as Record<string, Beneficiary>);
  let rows: string[];

  if (sector === "all") {
    rows = order;
  } else {
    // Keep only candidates this sector's PACs actually spent on, and re-rank by
    // the sector's own spending — `order` is sorted by combined crypto+AI money.
    const sectorTotal = (name: string) =>
      getSectorSupportTotal(candidates[name], sector) +
      getSectorOpposeTotal(candidates[name], sector);
    rows = order
      .filter((name) => sectorTotal(name) > 0)
      .sort((a, b) => sectorTotal(b) - sectorTotal(a));
    if (!fullPage) {
      rows = rows.slice(0, 5);
    }
  }

  const rowNodes = rows.map((candidateName) => {
    const candidate = candidates[candidateName];
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
        sector={sector}
        showRating={fullPage}
        rating={cookRatings[`${candidate.state}-${candidate.race}`]}
      />
    );
  });

  const header = (
    <thead className={styles.inheritBorderRadius}>
      <tr className={styles.influencedTableHeader}>
        <th className="text-cell">Candidate</th>
        <th className="center-cell">State</th>
        <th className="center-cell small-cell">Office</th>
        {fullPage && <RatingHeader />}
        <th className="number-cell">Support</th>
        <th className="number-cell">Oppose</th>
        <th className="small-cell center-cell">
          Direct{" "}
          <span className="no-wrap">
            contributions
            <InformationalTooltip>
              <p>
                Contributions from{" "}
                {humanizeSector(sector, {
                  context: "industry",
                  abbrev: true,
                  lowercase: true,
                  or: true,
                })}{" "}
                companies or associated individuals to this candidate or
                aligned committees, which have not gone through the{" "}
                {humanizeSector(sector, {
                  hyphen: true,
                  abbrev: true,
                  lowercase: true,
                  or: true,
                })}
                focused super PACs.
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
  );

  if (fullPage) {
    // PaginatedTable reads useSearchParams (client-only), so the statically
    // rendered fallback is the default first page.
    return (
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
          pageParam="influencedPage"
          itemLabel="races"
          sortLabel="total super PAC spending"
        />
      </Suspense>
    );
  }

  return (
    <table className={styles.influencedTable}>
      {header}
      <tbody className={styles.inheritBorderRadius}>{rowNodes}</tbody>
    </table>
  );
}
