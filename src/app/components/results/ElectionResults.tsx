import { DateTime } from "luxon";
import Link from "next/link";

import { ResultNote } from "@/app/(drilldown)/2026/elections/[raceId]/CandidateResult";
import raceStyles from "@/app/(drilldown)/2026/elections/[raceId]/page.module.css";
import {
  fetchAllStateElections,
  fetchBeneficiaries,
  fetchConstant,
  fetchCookRatings,
} from "@/app/actions/fetch";
import Candidate, { UnknownCandidate } from "@/app/components/Candidate";
import ErrorText from "@/app/components/ErrorText";
import {
  HorizontalBars,
  HorizontalBarsSkeleton,
} from "@/app/components/home/HorizontalBars";
import barStyles from "@/app/components/home/HorizontalBars.module.css";
import legendStyles from "@/app/components/home/TechSectorBreakdown.module.css";
import { GoalIcon, ResultIcon } from "@/app/components/InfluencedRacesContents";
import MoneyCard, { MoneyCardSkeleton } from "@/app/components/MoneyCard";
import { RaceRatingChip } from "@/app/components/RaceRating";
import Skeleton from "@/app/components/skeletons/Skeleton";
import sharedStyles from "@/app/shared.module.css";
import { Beneficiary } from "@/app/types/Beneficiaries";
import { CommitteeConstant } from "@/app/types/Committee";
import { ElectionsByState, RaceType } from "@/app/types/Elections";
import { Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import {
  humanizeList,
  humanizeRoundedCurrency,
  pluralize,
} from "@/app/utils/humanize";
import {
  getCandidateResult,
  getRaceHeadline,
  getSubraceName,
  isOutOfRace,
} from "@/app/utils/races";
import {
  getCandidatesBackedEarlier,
  getLatestElectionDate,
  getRaceGoal,
  getResultRaces,
  getResultsTally,
  Goal,
  MoneyByOutcome,
  RaceTag,
  ResultCandidate,
  ResultRace,
  ResultsTally,
  TagTally,
} from "@/app/utils/results";
import { humanizeSector, sectorHref } from "@/app/utils/sector";
import { sentenceCase } from "@/app/utils/titlecase";
import { formatCurrency, formatDateFromString } from "@/app/utils/utils";

import styles from "./ElectionResults.module.css";
import ResultRaceList from "./ResultRaceList";

// Tags for what each contest's money did, in display order
export const TAGS: { key: RaceTag; tag: string; title: string }[] = [
  { key: "competitive", tag: "Competitive race", title: "Competitive races" },
  { key: "likely", tag: "Likely winner", title: "Likely winners" },
  { key: "safe", tag: "Backing the winners", title: "Backing the winners" },
  { key: "underdog", tag: "Backing the underdog", title: "Backing the underdog" },
  { key: "mixed", tag: "Mixed result", title: "Mixed results" },
];

const GOAL_LABELS: Record<Goal, string> = {
  achieved: "Goal achieved",
  failed: "Goal failed",
  mixed: "Mixed results",
};

const GOAL_CLASSES: Record<Goal, string> = {
  achieved: styles.raceGoalAchieved,
  failed: styles.raceGoalFailed,
  mixed: styles.raceGoalMixed,
};

function currency(amount: number) {
  return humanizeRoundedCurrency(amount, true, 1);
}

function formatCallTime(calledAt: number) {
  return `${DateTime.fromMillis(calledAt)
    .setZone("America/New_York")
    .toFormat("MMM d, h:mm a")} ET`;
}

function getStatusText(race: ResultRace) {
  if (race.status === "called") {
    return race.race.calledAt !== undefined
      ? `Called ${formatCallTime(race.race.calledAt)}`
      : "Called";
  }
  return race.status === "partial" ? "Partly called" : "Not yet called";
}

// "primary", "primary runoff", or "primary and runoff" when the money was
// spread across a primary and its runoff
function nameRounds(rounds: string[]) {
  const names = rounds.map((round) =>
    getSubraceName({ type: round as RaceType }),
  );
  const shortNames = names.includes("primary")
    ? names.map((name) => (name === "primary runoff" ? "runoff" : name))
    : names;
  return String(humanizeList(shortNames));
}

function Amount({
  value,
  earlier = 0,
  rounds = [],
}: {
  value: number;
  // How much of the value was spent in other rounds of the race
  earlier?: number;
  rounds?: string[];
}) {
  if (value <= 0) {
    return <span className={raceStyles.nullPlaceholder}>&ndash;</span>;
  }
  return (
    <span className={styles.amountValue}>
      {formatCurrency(value, true)}
      {earlier > 0 && (
        <span className={styles.amountNote}>
          {earlier >= value
            ? `All in ${`the ${nameRounds(rounds)}`}`
            : `${formatCurrency(earlier, true)} in ${`the ${nameRounds(rounds)}`}`}
        </span>
      )}
    </span>
  );
}

function CandidateRow({ result }: { result: ResultCandidate }) {
  const { candidate, summary } = result;
  const outcome = getCandidateResult(candidate);
  let nameClassName;
  if (isOutOfRace(candidate)) {
    nameClassName = raceStyles.defeatedCandidateName;
  } else if (outcome === "won") {
    nameClassName = raceStyles.wonCandidateName;
  }
  return (
    <tr className={styles.candidateRow}>
      <td className={styles.candidateCell}>
        {candidate.placeholder ? (
          <UnknownCandidate
            party={candidate.party}
            name={candidate.name}
            noMargins={true}
          />
        ) : (
          <Candidate
            candidate={candidate}
            candidateSummary={summary}
            candidateNameClassName={nameClassName}
            writeIn={candidate.writeIn}
            noMargins={true}
            extraText={<ResultNote candidate={candidate} />}
          />
        )}
      </td>
      <td className={styles.resultCell}>
        <span className={styles.mobileLabel}>Result</span>
        <span className={styles.resultValue}>
          {outcome === "undecided" ? (
            <span className={raceStyles.nullPlaceholder}>&ndash;</span>
          ) : (
            <>
              <ResultIcon won={outcome === "won"} className={styles.resultIcon} />
              {outcome === "won" ? <span className="bold">Won</span> : "Lost"}
            </>
          )}
        </span>
      </td>
      <td className={styles.amountCell}>
        <span className={styles.mobileLabel}>Super PAC support</span>
        <Amount
          value={result.support}
          earlier={result.earlier.support}
          rounds={result.earlier.rounds}
        />
      </td>
      <td className={styles.amountCell}>
        <span className={styles.mobileLabel}>Super PAC opposition</span>
        <Amount
          value={result.oppose}
          earlier={result.earlier.oppose}
          rounds={result.earlier.rounds}
        />
      </td>
      <td className={styles.amountCell}>
        <span className={styles.mobileLabel}>Direct contributions</span>
        <Amount value={result.contributions} />
      </td>
    </tr>
  );
}

function RaceCard({ race, sector }: { race: ResultRace; sector: Sector }) {
  const goal = getRaceGoal(race);
  const primaryGoal = race.earlierRounds?.goal;
  const backedEarlier = getCandidatesBackedEarlier(race);
  return (
    <article className={styles.raceCard}>
      {(race.tag || goal || primaryGoal) && (
        <div className={styles.raceTopRow}>
          {goal && (
            <span className={`${styles.raceGoal} ${GOAL_CLASSES[goal]}`}>
              <GoalIcon goal={goal} inline={true} />
              {GOAL_LABELS[goal]}
            </span>
          )}
          {race.tag && (
            <span className={styles.raceTag}>
              {TAGS.find((t) => t.key === race.tag)?.tag}
            </span>
          )}
          {primaryGoal && race.earlierRounds && (
            <span className={`${styles.raceGoal} ${GOAL_CLASSES[primaryGoal]}`}>
              <GoalIcon goal={primaryGoal} inline={true} />
              {sentenceCase(nameRounds(race.earlierRounds.rounds), false)}:{" "}
              {GOAL_LABELS[primaryGoal].toLowerCase()}
            </span>
          )}
        </div>
      )}
      <div className={styles.raceHeader}>
        <h3 className={styles.raceTitle}>
          <Link href={sectorHref(`/2026/elections/${race.raceId}`, sector)}>
            {getRaceHeadline(race.raceId)}
          </Link>
        </h3>
        <span
          className={`${styles.raceStatus} ${race.status === "called" ? styles.raceStatusCalled : ""}`}
        >
          {getStatusText(race)}
        </span>
      </div>
      <div className={styles.raceMeta}>
        {sentenceCase(getSubraceName(race.race), false)}
        <RaceRatingChip
          rating={race.rating}
          prefix="Projected"
          className={styles.rating}
        />
      </div>
      {backedEarlier.length >= 2 && (
        <p className={styles.raceNote}>
          Earlier in the cycle, tracked super PACs backed{" "}
          {backedEarlier.length === 2 && "both "}
          {humanizeList(
            backedEarlier.map((c) => c.summary?.common_name ?? c.candidate.name),
          )}
          ,{" "}
          {backedEarlier.length === 2
            ? "who faced each other"
            : "who all ran against each other"}{" "}
          in this election.
        </p>
      )}
      <table className={styles.candidateTable}>
        <thead>
          <tr className={styles.candidateTableHeader}>
            <th className="text-cell">Candidate</th>
            <th className="text-cell">Result</th>
            <th className="number-cell">Super PAC support</th>
            <th className="number-cell">Super PAC opposition</th>
            <th className="number-cell">Direct contributions</th>
          </tr>
        </thead>
        <tbody>
          {race.candidates.map((result) => (
            <CandidateRow key={result.candidate.name} result={result} />
          ))}
        </tbody>
      </table>
    </article>
  );
}

// The tags with races, plus the races that couldn't be tagged, so the rows add
// up to the total
function getTagRows(tally: ResultsTally) {
  const rows = TAGS.filter((t) => tally.byTag[t.key].races > 0).map((t) => ({
    key: t.key as string,
    title: t.title,
    tally: tally.byTag[t.key],
  }));
  if (tally.untagged.races > 0) {
    rows.push({
      key: "untagged",
      title: "Not yet classified",
      tally: tally.untagged,
    });
  }
  return rows;
}

// "2–1", plus any mixed races: "2–1, 1 mixed"
function describeRecord(goals: TagTally["goals"]) {
  const record = `${goals.achieved}–${goals.failed}`;
  return goals.mixed ? `${record}, ${goals.mixed} mixed` : record;
}

// One bar per tag splitting that tag's super PAC money between the winning
// side, the losing side, and what hasn't been called. Each bar is its own 100%,
// so the Solid-seat money doesn't flatten the rest; the label gives the race
// record and dollars.
export function TagRecordBars({ tally }: { tally: ResultsTally }) {
  // Underdog money is a sliver of the total, and a full-width bar for it
  // would overstate it
  const rows = getTagRows(tally).filter((t) => t.key !== "underdog");
  return (
    <>
      <ul className={styles.tagRecords}>
        {rows.map((t) => {
          const { superPac, goals, called } = t.tally;
          const total = superPac.won + superPac.lost + superPac.uncalled;
          return (
            <li key={t.key} className={styles.tagRecord}>
              <div className={styles.tagRecordLabels}>
                <span className={styles.tagRecordName}>{t.title}</span>
                <span className={styles.tagRecordValue}>
                  {called > 0 || superPac.won + superPac.lost > 0
                    ? describeRecord(goals)
                    : "No calls yet"}
                  {` · ${currency(total)}`}
                </span>
              </div>
              <div
                className={`${barStyles.track} ${barStyles.unoutlined} ${styles.tagRecordBar}`}
                role="img"
                aria-label={`${t.title}: goal achieved in ${pluralize(goals.achieved, "race", { includeValue: true })} and failed in ${goals.failed}${
                  goals.mixed ? `, mixed in ${goals.mixed}` : ""
                }. Of ${currency(total)}, ${currency(superPac.won)} on the winning side, ${currency(
                  superPac.lost,
                )} on the losing side, and ${currency(superPac.uncalled)} not yet called.`}
              >
                <div
                  className={`${barStyles.segment} ${styles.segWon}`}
                  style={{ flexGrow: superPac.won }}
                />
                <div
                  className={`${barStyles.segment} ${styles.segLost}`}
                  style={{ flexGrow: superPac.lost }}
                />
                <div
                  className={`${barStyles.segment} ${styles.segUncalled}`}
                  style={{ flexGrow: superPac.uncalled }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      <div className={legendStyles.barLegend}>
        <div className={legendStyles.barLegendItem}>
          <span className={`${legendStyles.barLegendSwatch} ${styles.segWon}`} />
          <span>Winning side</span>
        </div>
        <div className={legendStyles.barLegendItem}>
          <span className={`${legendStyles.barLegendSwatch} ${styles.segLost}`} />
          <span>Losing side</span>
        </div>
        <div className={legendStyles.barLegendItem}>
          <span
            className={`${legendStyles.barLegendSwatch} ${styles.segUncalled}`}
          />
          <span>Not yet called</span>
        </div>
        <div className={legendStyles.barLegendItem}>
          <span>Record is goals achieved–failed</span>
        </div>
      </div>
    </>
  );
}

export function OutcomeBars({
  money,
  hideEmptyUncalled = false,
}: {
  money: MoneyByOutcome;
  // Leave out the "Not yet called" row when nothing is waiting on a result,
  // e.g. for primaries that have all been decided
  hideEmptyUncalled?: boolean;
}) {
  return (
    <HorizontalBars
      items={[
        {
          key: "won",
          label: "Winning side",
          value: money.won,
          displayValue: currency(money.won),
        },
        {
          key: "lost",
          label: "Losing side",
          value: money.lost,
          displayValue: currency(money.lost),
        },
        ...(hideEmptyUncalled && money.uncalled === 0
          ? []
          : [
              {
                key: "uncalled",
                label: "Not yet called",
                value: money.uncalled,
                displayValue: currency(money.uncalled),
              },
            ]),
      ]}
      max={money.won + money.lost + money.uncalled}
      showPct={true}
    />
  );
}

export function ElectionResultsSkeleton() {
  return (
    <>
      <section className={sharedStyles.heroWithStat}>
        <div>
          <Skeleton width="90%" />
          <Skeleton width="80%" />
          <Skeleton width="60%" />
        </div>
        <MoneyCardSkeleton />
      </section>
      <section className={styles.moneySection}>
        <h2 className={sharedStyles.sectionTitle}>Super PAC money</h2>
        <HorizontalBarsSkeleton numBars={3} />
      </section>
    </>
  );
}

// The races on the latest election date, or null if the data couldn't load.
// Shared with the homepage panel so the two always count the same races.
export async function loadResults(sector: Sector): Promise<{
  date: string | null;
  races: ResultRace[];
  tally: ResultsTally;
} | null> {
  const [
    electionsData,
    beneficiariesData,
    committees,
    candidateAliases,
    cookRatings,
  ] = await Promise.all([
    fetchAllStateElections(),
    fetchBeneficiaries(sector),
    fetchConstant<Record<string, CommitteeConstant>>("committees"),
    fetchConstant<Record<string, string>>("candidateAliases"),
    fetchCookRatings(),
  ]);
  // Committees are only needed to split a sector's spending by round
  if (
    isError(electionsData) ||
    isError(beneficiariesData) ||
    (sector !== "all" && !committees)
  ) {
    return null;
  }
  const elections = electionsData as Record<string, ElectionsByState>;
  const date = getLatestElectionDate(elections);
  const races = date
    ? getResultRaces(
        elections,
        beneficiariesData as Record<string, Beneficiary>,
        committees ?? {},
        candidateAliases ?? {},
        cookRatings,
        sector,
        date,
      )
    : [];
  return { date, races, tally: getResultsTally(races) };
}

export default async function ElectionResults({ sector }: { sector: Sector }) {
  const results = await loadResults(sector);
  if (!results) {
    return <ErrorText subject="election results" />;
  }
  const { date, races, tally } = results;
  if (!date) {
    return <p>No elections have been held yet.</p>;
  }
  // Races with at least one call. Uncalled races still count in the totals.
  const calledRaces = races.filter((race) => race.status !== "uncalled");
  const superPacTotal =
    tally.superPac.won + tally.superPac.lost + tally.superPac.uncalled;
  const industryLabel = humanizeSector(sector, {
    abbrev: true,
    lowercase: true,
  });
  const pacLabel = `tracked ${humanizeSector(sector, {
    hyphen: true,
    abbrev: true,
    lowercase: true,
  })}focused super PACs`;

  return (
    <>
      <section className={sharedStyles.heroWithStat}>
        <div>
          <p className={sharedStyles.headerSubtitle}>
            <span className={sharedStyles.highlightFigure}>
              {tally.called} of {tally.races}
            </span>{" "}
            races on the {formatDateFromString(date)} ballot have been called.
            In these elections, {pacLabel} spent{" "}
            <span className={sharedStyles.highlightFigure}>
              {currency(superPacTotal)}
            </span>{" "}
            supporting and opposing candidates. So far,{" "}
            {currency(tally.superPac.won)} of that has been on the winning side
            and {currency(tally.superPac.lost)} on the losing side.
          </p>
          <div className={sharedStyles.noteCard}>
            <span className={sharedStyles.noteLabel}>Note:</span> results are
            added by hand as races are called, and this page updates as they
            are. A race counts as called once every candidate still running has
            a result. The totals and graphs only count super PAC money spent
            in these elections, since money spent in a primary was settled by
            the primary. The amounts on each race cover the whole cycle, with a
            note on how much went to the primary.
            {tally.superPacRaces < tally.races && (
              <p>
                Tracked super PACs spent in {tally.superPacRaces} of these{" "}
                {tally.races} races.{" "}
                {tally.earlierOnlyRaces > 0 && (
                  <>
                    In {tally.earlierOnlyRaces} more, they only spent in the
                    primary.{" "}
                  </>
                )}
                In the other{" "}
                {tally.races - tally.superPacRaces - tally.earlierOnlyRaces},{" "}
                {industryLabel} companies and executives only gave directly to
                candidates&rsquo; campaigns. Those races count toward the races
                called but not toward the super PAC figures.
              </p>
            )}
          </div>
        </div>
        <MoneyCard
          topText="On the winning side"
          amount={currency(tally.superPac.won)}
          bottomText={
            <span>
              of super PAC money supported a candidate who won or opposed one
              who lost
            </span>
          }
        />
      </section>
      <section className={styles.moneySection}>
        <h2 className={sharedStyles.sectionTitle}>
          Super PAC money
          <span className={sharedStyles.sectionTitleAmount}>
            {currency(superPacTotal)}
          </span>
        </h2>
        <OutcomeBars money={tally.superPac} />
      </section>
      <section>
        <h2 className={sharedStyles.sectionTitle}>
          Super PAC money by what it backed
        </h2>
        <p className={sharedStyles.subtitle}>
          Competitive races are rated Toss-up or Lean. In races rated Likely or
          Solid, money that helped the favorite backed a likely winner or the
          winners, and money that helped the other side backed the underdog.
          Races with real money on both sides are mixed. Races without a
          rating yet aren&rsquo;t classified. Each race is tagged by its money
          in this election, using the same classification as the{" "}
          <Link href={sectorHref("/2026/analysis/battlegrounds", sector)}>
            battlegrounds analysis
          </Link>
          .
        </p>
        <div className={styles.outcomeColumns}>
          {getTagRows(tally).map((t) => {
            const tagTally = t.tally;
            return (
              <section key={t.key}>
                <h3 className={styles.ratingTitle}>
                  {t.title}
                  <span className={sharedStyles.sectionTitleAmount}>
                    {tagTally.called} of {tagTally.races} called
                  </span>
                </h3>
                <OutcomeBars money={tagTally.superPac} />
              </section>
            );
          })}
        </div>
      </section>
      {tally.earlier.seats > 0 && (
        <section className={styles.moneySection}>
          <h2 className={sharedStyles.sectionTitle}>
            Primary money for these seats
            <span className={sharedStyles.sectionTitleAmount}>
              {currency(
                tally.earlier.superPac.won +
                  tally.earlier.superPac.lost +
                  tally.earlier.superPac.uncalled,
              )}
            </span>
          </h2>
          <p className={sharedStyles.subtitle}>
            Super PAC money spent earlier in the cycle in the primaries and
            runoffs for {tally.earlier.seats} of these seats, scored against
            who won those primaries. It includes money for and against
            candidates who lost their primary and aren&rsquo;t on this ballot.
            The money&rsquo;s goal was met in {tally.earlier.goals.achieved}{" "}
            {pluralize(tally.earlier.goals.achieved, "seat")}, missed in{" "}
            {tally.earlier.goals.failed}
            {tally.earlier.goals.mixed > 0 &&
              `, and mixed in ${tally.earlier.goals.mixed}`}
            .
          </p>
          <OutcomeBars money={tally.earlier.superPac} hideEmptyUncalled={true} />
        </section>
      )}
      <section className={styles.races}>
        <h2 className={sharedStyles.sectionTitle}>
          Called races
          <span className={sharedStyles.sectionTitleAmount}>
            Most recently called first
          </span>
        </h2>
        {calledRaces.length > 0 ? (
          <ResultRaceList
            cards={calledRaces.map((race) => (
              <RaceCard key={race.key} race={race} sector={sector} />
            ))}
          />
        ) : (
          <p className={sharedStyles.subtitle}>
            No races have been called yet.
          </p>
        )}
      </section>
    </>
  );
}
