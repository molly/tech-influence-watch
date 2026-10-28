import { DateTime } from "luxon";
import Link from "next/link";
import { useEffect, useRef } from "react";

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
  sharedThrough,
}: {
  money: CandidateMoney;
  axis: { top: number; ticks: number[] };
  techLabel: string;
  // The filing date most candidates in the race share, given once in the
  // note under the legend.
  sharedThrough: string | null;
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
      <CandidateMoneyChart
        top={axis.top}
        ticks={axis.ticks}
        bars={[
          {
            key: "raised",
            label:
              money.raised.through && money.raised.through !== sharedThrough
                ? `Raised through ${formatFilingDate(money.raised.through)}`
                : "Raised",
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

// The filing date shared by the most candidates.
function getSharedThrough(money: CandidateMoney[]): string | null {
  const counts = new Map<string, number>();
  for (const { raised } of money) {
    if (raised.through) {
      counts.set(raised.through, (counts.get(raised.through) ?? 0) + 1);
    }
  }
  let shared: string | null = null;
  for (const [date, count] of counts) {
    if (shared === null || count > (counts.get(shared) ?? 0)) {
      shared = date;
    }
  }
  return shared;
}

// FEC filing periods end on fixed dates; show the year only when it isn't the
// timeline's year.
function formatFilingDate(date: string): string {
  const parsed = DateTime.fromISO(date);
  return parsed.toFormat(parsed.year === 2026 ? "LLL d" : "LLL d, yyyy");
}

// "■ $616,000 favoring Republicans (44%)  ■ $784,000 favoring Democrats (56%)".
// Amounts, not just shares, so it's clear they split the tech total above.
function DirectionSummary({ totals }: { totals: DirectionTotals }) {
  if (totals.total <= 0) {
    return null;
  }
  return (
    <div className={styles.directionSummary}>
      {DIRECTIONS.map(({ key, phrase }) => (
        <span key={key} className={styles.directionSummaryItem}>
          <DirectionSwatch direction={key} />
          <span>
            <span className="bold">
              {humanizeRoundedCurrency(totals[key], true, 1)}
            </span>{" "}
            {phrase}{" "}
            <span className={styles.directionPct}>
              ({humanizePercentage(totals[key], totals.total)})
            </span>
          </span>
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
  throughDate,
  scrubber,
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
  throughDate: string;
  // A compact timeline, shown at the top of the panel when it's a bottom sheet
  // covering the real one.
  scrubber: React.ReactNode;
  week: number;
  stage: StageFilter;
  siblings: SiblingRace[];
  committees: Record<string, string>;
  sector: Sector;
  onSelect: (raceId: string) => void;
  onClose: () => void;
}) {
  // On narrow screens the panel is a bottom sheet that scrolls on its own;
  // start each race at the top.
  const panelRef = useRef<HTMLElement>(null);
  const raceId = race?.id;
  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 });
  }, [raceId]);

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
  const sharedThrough = getSharedThrough(money);
  const allOutside = Math.max(
    sumThroughWeek(race.outsideTotal, week, stage),
    totals.total,
  );
  // Everything the candidates have raised plus everything outside groups have
  // spent, for scale.
  const allRaceMoney =
    money.reduce((sum, m) => sum + m.raised.amount, 0) + allOutside;
  const techLabel = humanizeSectorShort(sector);
  const throughLabel = `Through ${throughDate}`;
  const hasBoth = money.some(
    (m) => m.techFor.both > 0 || m.techAgainst.both > 0,
  );
  const recent = expenditures.slice(0, RECENT_ROWS);
  const district = getRaceDistrict(race);
  const districtName = district
    ? `District ${parseInt(district, 10)}`
    : "at-large district";

  return (
    <aside
      ref={panelRef}
      className={`${styles.panel} ${styles.panelOpen}`}
      aria-label={`${getRaceLabel(race)} spending`}
    >
      {/* On narrow screens the close button moves up here, so it stays in
          reach as the sheet scrolls. */}
      <div className={styles.panelScrubber}>
        {scrubber}
        <button
          type="button"
          className={styles.panelClose}
          aria-label="Close race details"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
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
          className={`${styles.panelClose} ${styles.panelCloseCrumbs}`}
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
                sharedThrough={sharedThrough}
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
            <span className={styles.raisedNote}>
              Outside spending through {throughDate}. Campaign
              fundraising is total receipts from FEC reports
              {sharedThrough
                ? ` through ${formatFilingDate(sharedThrough)}`
                : ""}
              , including loans and self-funding.
            </span>
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
                          {humanizeRoundedCurrency(allOutside, true, 1)} in
                          outside spending
                        </span>
                      ),
                      value: totals.total,
                      ariaLabel: `${humanizePercentage(totals.total, allOutside)} of all outside spending in this race`,
                    },
                  ]}
                />
              )}
              {allRaceMoney > 0 && (
                <div className={styles.raceShareBar}>
                  <HorizontalBars
                    max={allRaceMoney}
                    items={[
                      {
                        key: "raceShare",
                        label: "Share of all spending in the race",
                        labelNode: (
                          <span className={styles.shareLabel}>
                            {humanizePercentage(totals.total, allRaceMoney)} of
                            the {humanizeRoundedCurrency(allRaceMoney, true, 1)}{" "}
                            total spent in this race
                          </span>
                        ),
                        value: totals.total,
                        ariaLabel: `${humanizePercentage(totals.total, allRaceMoney)} of all spending in this race`,
                      },
                    ]}
                  />
                </div>
              )}
              <DirectionSummary totals={totals} />
            </>
          }
        />
      </div>

      <div className={styles.panelSection}>
        <h3 className={sharedStyles.sectionTitle}>
          Weekly spending
          <span className={sharedStyles.sectionTitleAmount}>
            {throughLabel}
          </span>
        </h3>
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
              {throughLabel} · {siblings.length} with {techLabel} spending
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
          Latest expenditures
          <span className={sharedStyles.sectionTitleAmount}>
            {throughLabel} · <Link href={raceHref}>View all &rarr;</Link>
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
