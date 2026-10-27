import { DateTime } from "luxon";
import Link from "next/link";

import Breadcrumbs from "@/app/components/Breadcrumbs";
import { CandidateImage } from "@/app/components/Candidate";
import { HorizontalBars } from "@/app/components/home/HorizontalBars";
import MoneyCard from "@/app/components/MoneyCard";
import { STATES_BY_ABBR } from "@/app/data/states";
import sharedStyles from "@/app/shared.module.css";
import { Sector } from "@/app/types/Sector";
import { humanizeExpenditureDescription } from "@/app/utils/expenditures";
import { formatCompact, humanizeRoundedCurrency } from "@/app/utils/humanize";
import { getFirstLastName } from "@/app/utils/names";
import { sectorHref } from "@/app/utils/sector";

import DirectionBreakdown, {
  DIRECTION_FILL,
  DirectionSwatch,
} from "./DirectionBreakdown";
import styles from "./SpendingFlow.module.css";
import {
  DirectionTotals,
  FlowCandidate,
  FlowExpenditure,
  FlowRace,
  getRaceDistrict,
  getRaceLabel,
} from "./spendingFlowUtils";
import WeeklyBars, { WeekBucket } from "./WeeklyBars";

const RECENT_ROWS = 5;

export interface SiblingRace {
  race: FlowRace;
  total: number;
}

function CandidateCard({
  candidate,
  max,
}: {
  candidate: FlowCandidate;
  max: number;
}) {
  const [firstName, lastName] = getFirstLastName(candidate.name);
  const raised = humanizeRoundedCurrency(candidate.raised, true, 1);
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
            {candidate.incumbent ? "Incumbent" : "Challenger"}
          </div>
        </div>
      </div>
      <div className={styles.candidateRaised}>{raised}</div>
      <HorizontalBars
        max={max}
        items={[
          {
            key: candidate.name,
            label: "Total raised, all sources",
            labelNode: (
              <span className={styles.annotation}>
                Total raised, all sources
              </span>
            ),
            value: candidate.raised,
            ariaLabel: `${candidate.name} raised ${raised}`,
            fillClassName:
              candidate.party === "R" || candidate.party === "D"
                ? DIRECTION_FILL[candidate.party]
                : DIRECTION_FILL.U,
          },
        ]}
      />
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
  totals,
  series,
  throughLabel,
  siblings,
  committees,
  sector,
  onSelect,
  onClose,
}: {
  race: FlowRace | null;
  expenditures: FlowExpenditure[];
  totals: DirectionTotals;
  series: WeekBucket[];
  throughLabel: string;
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
  const maxRaised = Math.max(0, ...race.candidates.map((c) => c.raised));
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

      {race.candidates.length > 0 ? (
        <div className={styles.candidates}>
          {race.candidates.map((candidate) => (
            <CandidateCard
              key={candidate.name}
              candidate={candidate}
              max={maxRaised}
            />
          ))}
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
              <span>Tech spending in this race</span>
              <span>{throughLabel}</span>
            </span>
          }
          amount={humanizeRoundedCurrency(totals.total, true, 1)}
          bottomText={<DirectionBreakdown totals={totals} />}
        />
      </div>

      <div className={styles.panelSection}>
        <h3 className={sharedStyles.sectionTitle}>Weekly spending</h3>
        <WeeklyBars
          series={series}
          small={true}
          label={`Weekly tech spending in ${getRaceLabel(race)}`}
        />
      </div>

      {siblings.length > 0 && (
        <div className={styles.panelSection}>
          <h3 className={sharedStyles.sectionTitle}>
            Other races in {stateName}
            <span className={sharedStyles.sectionTitleAmount}>
              {siblings.length} with tech spending
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
