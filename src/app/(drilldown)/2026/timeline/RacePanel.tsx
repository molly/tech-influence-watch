import { DateTime } from "luxon";
import Link from "next/link";

import Breadcrumbs from "@/app/components/Breadcrumbs";
import { CandidateImage } from "@/app/components/Candidate";
import { HorizontalBars } from "@/app/components/home/HorizontalBars";
import barStyles from "@/app/components/home/HorizontalBars.module.css";
import MoneyCard from "@/app/components/MoneyCard";
import { STATES_BY_ABBR } from "@/app/data/states";
import sharedStyles from "@/app/shared.module.css";
import { Sector } from "@/app/types/Sector";
import { humanizeExpenditureDescription } from "@/app/utils/expenditures";
import {
  formatCompact,
  humanizePercentage,
  humanizeRoundedCurrency,
} from "@/app/utils/humanize";
import { getFirstLastName } from "@/app/utils/names";
import { humanizeSectorShort, sectorHref } from "@/app/utils/sector";
import { sentenceCase } from "@/app/utils/titlecase";

import CandidateMoneyChart, {
  getMoneyAxis,
  MoneyBar,
} from "./CandidateMoneyChart";
import { DirectionSwatch } from "./DirectionBreakdown";
import styles from "./SpendingFlow.module.css";
import {
  DIRECTIONS,
  DirectionTotals,
  FlowCandidate,
  FlowExpenditure,
  FlowRace,
  getRaceDistrict,
  getRaceLabel,
  PartyDirection,
  raisedThroughWeek,
  StageFilter,
  sumThroughWeek,
} from "./spendingFlowUtils";
import WeeklyBars, { WeekBucket } from "./WeeklyBars";

const RECENT_ROWS = 5;

export interface SiblingRace {
  race: FlowRace;
  total: number;
}

interface TechSplit {
  total: number;
  crypto: number;
  ai: number;
  // Committees that span both industries.
  both: number;
}

// Tech spending for or against one candidate, split by industry.
function getTechSplit(
  expenditures: FlowExpenditure[],
  candidate: string,
  supportOppose: "S" | "O",
): TechSplit {
  const split = { total: 0, crypto: 0, ai: 0, both: 0 };
  for (const e of expenditures) {
    if (e.candidate !== candidate || e.supportOppose !== supportOppose) {
      continue;
    }
    split.total += e.amount;
    if (e.sector === "crypto") {
      split.crypto += e.amount;
    } else if (e.sector === "ai") {
      split.ai += e.amount;
    } else {
      split.both += e.amount;
    }
  }
  return split;
}

export interface CandidateMoney {
  candidate: FlowCandidate;
  raised: { amount: number; through: string | null };
  outsideFor: number;
  outsideAgainst: number;
  techFor: TechSplit;
  techAgainst: TechSplit;
}

function outsideBar(
  key: string,
  label: string,
  total: number,
  tech: TechSplit,
  techLabel: string,
): MoneyBar {
  return {
    key,
    label,
    note:
      tech.total > 0
        ? `${formatCompact(Math.round(tech.total))} ${techLabel}`
        : null,
    segments: [
      { key: "crypto", value: tech.crypto, className: styles.barCrypto },
      { key: "ai", value: tech.ai, className: styles.barAi },
      { key: "both", value: tech.both, className: styles.barBoth },
      {
        key: "other",
        value: total - tech.total,
        className: styles.barOtherOutside,
      },
    ],
  };
}

function CandidateCard({
  money,
  axis,
  techLabel,
}: {
  money: CandidateMoney;
  axis: { top: number; ticks: number[] };
  techLabel: string;
}) {
  const { candidate } = money;
  const [firstName, lastName] = getFirstLastName(candidate.name);
  return (
    <div className={styles.candidateCard}>
      <div className={styles.candidateWho}>
        <CandidateImage
          party={candidate.party}
          firstName={firstName}
          lastName={lastName}
          noMargins={true}
        />
        <div>
          <div className={styles.candidateName}>
            {candidate.name}
            {candidate.party ? ` (${candidate.party})` : ""}
          </div>
          <div className={styles.annotation}>
            {candidate.status ??
              (candidate.incumbent ? "Incumbent" : "Challenger")}
          </div>
        </div>
      </div>
      <div className={styles.candidateRaised}>
        {humanizeRoundedCurrency(money.raised.amount, true, 1)}
      </div>
      <div className={styles.annotation}>
        {money.raised.through
          ? `Raised through ${formatFilingDate(money.raised.through)}, all sources`
          : "Total raised, all sources"}
      </div>
      <CandidateMoneyChart
        top={axis.top}
        ticks={axis.ticks}
        bars={[
          {
            key: "raised",
            label: "Raised",
            segments: [
              {
                key: "raised",
                value: money.raised.amount,
                className: styles.barRaised,
              },
            ],
          },
          outsideBar(
            "for",
            "Outside, for",
            money.outsideFor,
            money.techFor,
            techLabel,
          ),
          outsideBar(
            "against",
            "Outside, against",
            money.outsideAgainst,
            money.techAgainst,
            techLabel,
          ),
        ]}
      />
    </div>
  );
}

// FEC filing periods end on fixed dates; show the year only when it isn't the
// timeline's year.
function formatFilingDate(date: string): string {
  const parsed = DateTime.fromISO(date);
  return parsed.toFormat(parsed.year === 2026 ? "LLL d" : "LLL d, yyyy");
}

const DIRECTION_SHORT: Record<PartyDirection, string> = {
  R: "Republicans",
  D: "Democrats",
};

// "■ 100% favoring Republicans · $0 Democrats"
function DirectionSummary({ totals }: { totals: DirectionTotals }) {
  if (totals.total <= 0) {
    return null;
  }
  const [lead, ...rest] = DIRECTIONS.slice().sort(
    (a, b) => totals[b.key] - totals[a.key],
  );
  return (
    <div className={styles.directionSummary}>
      <DirectionSwatch direction={lead.key} />
      <span className="bold">
        {humanizePercentage(totals[lead.key], totals.total)}
      </span>{" "}
      {lead.phrase}
      {rest.map(({ key }) => (
        <span key={key} className={styles.annotation}>
          {" "}
          · {humanizeRoundedCurrency(totals[key], true, 1)} {DIRECTION_SHORT[key]}
        </span>
      ))}
    </div>
  );
}

function ExpenditureDirection({ expenditure }: { expenditure: FlowExpenditure }) {
  const verb = expenditure.supportOppose === "S" ? "Supports" : "Opposes";
  return (
    <span className={styles.expenditureDirection}>
      <DirectionSwatch direction={expenditure.direction} />
      {verb} {getFirstLastName(expenditure.candidate)[1]}
    </span>
  );
}

export default function RacePanel({
  race,
  expenditures,
  yearExpenditures,
  totals,
  series,
  throughLabel,
  week,
  stage,
  siblings,
  committees,
  sector,
  onSelect,
  onClose,
}: {
  race: FlowRace | null;
  expenditures: FlowExpenditure[];
  // The race's tech spending for the whole year, which sets the candidate
  // chart's fixed scale.
  yearExpenditures: FlowExpenditure[];
  totals: DirectionTotals;
  series: WeekBucket[];
  throughLabel: string;
  week: number;
  stage: StageFilter;
  siblings: SiblingRace[];
  committees: Record<string, string>;
  sector: Sector;
  onSelect: (raceId: string) => void;
  onClose: () => void;
}) {
  if (!race) {
    return (
      <aside className={styles.panel}>
        <p className={styles.panelEmpty}>
          Select a circle on the map or a race in the table to see spending in
          that race.
        </p>
      </aside>
    );
  }

  const stateName = STATES_BY_ABBR[race.state] ?? race.state;
  const officeName = race.office === "S" ? "Senate" : "House";
  const raceHref = sectorHref(`/2026/elections/${race.id}`, sector);
  // Outside totals cover 2026 through the selected week, like the rest of the
  // page. A candidate's tech total can't exceed their outside total in
  // principle; take the larger in case the two sources disagree on a date.
  // Every candidate the race lists is shown for the whole timeline, so the
  // panel's layout doesn't change while scrubbing; bars start at $0.
  const money: CandidateMoney[] = race.candidates.map((candidate) => {
    const techFor = getTechSplit(expenditures, candidate.name, "S");
    const techAgainst = getTechSplit(expenditures, candidate.name, "O");
    return {
      candidate,
      raised: raisedThroughWeek(candidate, week),
      techFor,
      techAgainst,
      outsideFor: Math.max(
        sumThroughWeek(candidate.outsideFor, week, stage),
        techFor.total,
      ),
      outsideAgainst: Math.max(
        sumThroughWeek(candidate.outsideAgainst, week, stage),
        techAgainst.total,
      ),
    };
  });
  // The axis is fixed at the race's full-year values so bars grow into it
  // while scrubbing instead of the scale shifting under them.
  const maxBar = Math.max(
    0,
    ...race.candidates.flatMap((candidate) => [
      candidate.raised,
      Math.max(
        sumThroughWeek(candidate.outsideFor, Infinity, stage),
        getTechSplit(yearExpenditures, candidate.name, "S").total,
      ),
      Math.max(
        sumThroughWeek(candidate.outsideAgainst, Infinity, stage),
        getTechSplit(yearExpenditures, candidate.name, "O").total,
      ),
    ]),
  );
  const axis = getMoneyAxis(maxBar);
  const allOutside = Math.max(
    sumThroughWeek(race.outsideTotal, week, stage),
    totals.total,
  );
  const techLabel = humanizeSectorShort(sector);
  const hasBoth = money.some(
    (m) => m.techFor.both > 0 || m.techAgainst.both > 0,
  );
  const recent = expenditures.slice(0, RECENT_ROWS);
  const district = getRaceDistrict(race);
  const districtName = district
    ? `District ${parseInt(district, 10)}`
    : "at-large district";

  return (
    <aside className={styles.panel} aria-label={`${getRaceLabel(race)} spending`}>
      <div className={styles.panelCrumbs}>
        <Breadcrumbs
          crumbs={[
            { name: "Elections", href: sectorHref("/2026/elections", sector) },
            {
              name: stateName,
              href: sectorHref(
                `/2026/states/${stateName.replaceAll(" ", "-").toLowerCase()}`,
                sector,
              ),
            },
            officeName,
          ]}
        />
        <button
          type="button"
          className={styles.panelClose}
          aria-label="Close race details"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
      <div className={styles.panelTitle}>
        <h2>{getRaceLabel(race)}</h2>
        <Link href={raceHref}>Race page &rarr;</Link>
      </div>
      <p className={styles.panelSubtitle}>
        U.S. {officeName} · {stateName}
        {race.office === "H" ? ` ${districtName}` : ""}
        {race.special ? " · Special election" : ""}
        {race.generalDate
          ? ` · General election ${DateTime.fromISO(race.generalDate).toFormat("LLL d, yyyy")}`
          : ""}
      </p>

      {money.length > 0 ? (
        <div className={styles.candidatesBlock}>
          <div className={styles.candidates}>
            {money.map((m) => (
              <CandidateCard
                key={m.candidate.name}
                money={m}
                axis={axis}
                techLabel={techLabel}
              />
            ))}
          </div>
          <div className={barStyles.legend}>
            <span className={barStyles.legendItem}>
              <span
                className={`${barStyles.legendSwatch} ${styles.barRaised}`}
              />
              Raised by campaign
            </span>
            <span className={barStyles.legendItem}>
              <span
                className={`${barStyles.legendSwatch} ${styles.barOtherOutside}`}
              />
              Outside groups
            </span>
            {sector !== "ai" && (
              <span className={barStyles.legendItem}>
                <span
                  className={`${barStyles.legendSwatch} ${styles.barCrypto}`}
                />
                Crypto
              </span>
            )}
            {sector !== "crypto" && (
              <span className={barStyles.legendItem}>
                <span className={`${barStyles.legendSwatch} ${styles.barAi}`} />
                AI
              </span>
            )}
            {hasBoth && (
              <span className={barStyles.legendItem}>
                <span
                  className={`${barStyles.legendSwatch} ${styles.barBoth}`}
                />
                Crypto and AI
              </span>
            )}
          </div>
        </div>
      ) : (
        <p className={styles.panelNote}>
          Candidates for this race are listed on the{" "}
          <Link href={raceHref}>race page</Link>.
        </p>
      )}

      <div className={styles.panelSection}>
        <MoneyCard
          topText={
            <span className={styles.moneyCardTop}>
              <span>{sentenceCase(`${techLabel} spending in this race`, false)}</span>
              <span>{throughLabel}</span>
            </span>
          }
          amount={humanizeRoundedCurrency(totals.total, true, 1)}
          bottomText={
            <>
              {allOutside > 0 && (
                <HorizontalBars
                  max={allOutside}
                  items={[
                    {
                      key: "share",
                      label: "Share of all outside spending",
                      labelNode: (
                        <span className={styles.shareLabel}>
                          {humanizePercentage(totals.total, allOutside)} of the{" "}
                          {humanizeRoundedCurrency(allOutside, true, 1)} from
                          all outside groups
                        </span>
                      ),
                      value: totals.total,
                      ariaLabel: `${humanizePercentage(totals.total, allOutside)} of all outside spending in this race`,
                    },
                  ]}
                />
              )}
              <DirectionSummary totals={totals} />
            </>
          }
        />
      </div>

      <div className={styles.panelSection}>
        <h3 className={sharedStyles.sectionTitle}>Weekly spending</h3>
        <WeeklyBars
          series={series}
          small={true}
          label={`Weekly ${techLabel} spending in ${getRaceLabel(race)}`}
        />
      </div>

      {siblings.length > 0 && (
        <div className={styles.panelSection}>
          <h3 className={sharedStyles.sectionTitle}>
            Other races in {stateName}
            <span className={sharedStyles.sectionTitleAmount}>
              {siblings.length} with {techLabel} spending
            </span>
          </h3>
          <div className={styles.siblings}>
            {siblings.map((sibling) => (
              <button
                key={sibling.race.id}
                type="button"
                className={styles.siblingButton}
                onClick={() => onSelect(sibling.race.id)}
              >
                {getRaceLabel(sibling.race)}
                <span>{formatCompact(Math.round(sibling.total))}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.panelSection}>
        <h3 className={sharedStyles.sectionTitle}>
          Recent expenditures
          <span className={sharedStyles.sectionTitleAmount}>
            <Link href={raceHref}>View all &rarr;</Link>
          </span>
        </h3>
        {recent.length === 0 ? (
          <p className={sharedStyles.subtitle}>
            No expenditures yet.
          </p>
        ) : (
          <table className={styles.expenditureTable}>
            <thead>
              <tr>
                <th>Date</th>
                <th className="number-cell">Amount</th>
                <th>Direction</th>
                <th>Spender</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((expenditure) => (
                <tr key={expenditure.uid}>
                  <td className="no-wrap">
                    {DateTime.fromISO(expenditure.date).toFormat("LLL d")}
                  </td>
                  <td className={`number-cell ${styles.expenditureAmount}`}>
                    {formatCompact(Math.round(expenditure.amount))}
                  </td>
                  <td>
                    <ExpenditureDirection expenditure={expenditure} />
                  </td>
                  <td>
                    <Link href={`/2026/committees/${expenditure.committeeId}`}>
                      {committees[expenditure.committeeId]}
                    </Link>
                  </td>
                  <td className={styles.annotation}>
                    {humanizeExpenditureDescription(expenditure.description)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </aside>
  );
}
