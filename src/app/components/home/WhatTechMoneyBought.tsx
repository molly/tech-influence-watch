import Link from "next/link";
import { Suspense } from "react";

import { fetchSpendingFlowData } from "@/app/(drilldown)/2026/timeline/spendingFlowData";
import {
  FLOW_START_DATE,
  getWeekIndex,
  SpendingFlowData,
} from "@/app/(drilldown)/2026/timeline/spendingFlowUtils";
import {
  fetchAllCommitteeTotalExpenditures,
  fetchAllExpenditures,
  fetchAllStateElections,
  fetchConstant,
  fetchCookRatings,
} from "@/app/actions/fetch";
import { getCategorySplit } from "@/app/components/analysis/BattlegroundRaces";
import ErrorText from "@/app/components/ErrorText";
import barStyles from "@/app/components/home/HorizontalBars.module.css";
import legendStyles from "@/app/components/home/TechSectorBreakdown.module.css";
import {
  loadResults,
  TagRecordBars,
} from "@/app/components/results/ElectionResults";
import Skeleton from "@/app/components/skeletons/Skeleton";
import { CommitteeConstant } from "@/app/types/Committee";
import { ElectionsByState, RaceType } from "@/app/types/Elections";
import { Expenditure } from "@/app/types/Expenditures";
import { mentionsIndustry } from "@/app/utils/adAnalysis";
import { getTaggedAds } from "@/app/utils/adAnalysisData";
import { isError } from "@/app/utils/errors";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";
import { getRoundName } from "@/app/utils/results";
import { formatDateFromString } from "@/app/utils/utils";

import styles from "./WhatTechMoneyBought.module.css";

/*
 * Homepage feature for the three election analyses. Self-contained so it can
 * be lifted out once it goes stale.
 */

const PLOT_HEIGHT = 100;
const BAR_WIDTH = 10;

function currency(amount: number) {
  return humanizeRoundedCurrency(amount, true, 1);
}

// "$243.4 million" as a big figure with a small "M"
function BigCurrency({ amount }: { amount: number }) {
  const text = currency(amount);
  const [figure, unit] = text.split(/\s/);
  return (
    <div className={styles.figure} aria-label={text}>
      <span aria-hidden="true">{figure}</span>
      {unit && (
        <span className={styles.figureUnit} aria-hidden="true">
          {unit.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}

function Column({
  title,
  figure,
  description,
  chart,
  note,
  href,
  linkText,
}: {
  title: string;
  figure: React.ReactNode;
  description: React.ReactNode;
  chart: React.ReactNode;
  // Smaller fine print at the bottom of the card, above the link
  note?: React.ReactNode;
  href: string;
  linkText: string;
}) {
  return (
    <div className={styles.column}>
      <h3 className={styles.eyebrow}>{title}</h3>
      {figure}
      <p className={styles.description}>{description}</p>
      <div className={styles.chart}>{chart}</div>
      {note && <p className={styles.note}>{note}</p>}
      <Link href={href} className={styles.link}>
        &raquo; {linkText}
      </Link>
    </div>
  );
}

// Every race a tracked PAC has spent in this cycle, as counted by the spending
// column
function getSpentRaceIds(expenditures: Record<string, Expenditure>) {
  return new Set(
    Object.values(expenditures)
      .filter((e) => e.expenditure_amount)
      .map((e) => e.race_id)
      .filter((raceId): raceId is string => !!raceId),
  );
}

function ColumnSkeleton({ title }: { title: string }) {
  return (
    <div className={styles.column}>
      <h3 className={styles.eyebrow}>{title}</h3>
      <Skeleton onCard height="5rem" width="60%" />
      <Skeleton onCard height="1.1rem" width="90%" />
      <Skeleton onCard height="1.1rem" width="75%" />
      <Skeleton onCard height="5rem" width="100%" />
    </div>
  );
}

// Earliest and latest regular primary of the year, across every state
function getPrimaryRange(elections: Record<string, ElectionsByState>) {
  const dates = Object.values(elections)
    .flatMap((state) => Object.values(state))
    .flatMap((group) => group.races || [])
    .filter(
      (race) =>
        race.type === RaceType.Primary &&
        !race.canceled &&
        race.date >= FLOW_START_DATE,
    )
    .map((race) => race.date)
    .sort();
  if (!dates.length) {
    return null;
  }
  return { first: dates[0], last: dates[dates.length - 1] };
}

function WeeklySpending({
  data,
  primaries,
}: {
  data: SpendingFlowData;
  primaries: { first: string; last: string } | null;
}) {
  const n = data.numWeeks;
  const weeks = Array.from({ length: n }, () => ({ D: 0, R: 0 }));
  for (const e of data.expenditures) {
    if (e.week >= 0 && e.week < n && e.direction !== "U") {
      weeks[e.week][e.direction] += e.amount;
    }
  }
  const max = Math.max(...weeks.map((w) => w.D + w.R), 1);
  const bars = weeks.flatMap((week, i) => {
    const d = (week.D / max) * PLOT_HEIGHT;
    const r = (week.R / max) * PLOT_HEIGHT;
    return [
      d > 0 && (
        <rect
          key={`${i}-D`}
          x={i * BAR_WIDTH + 1.5}
          y={PLOT_HEIGHT - d}
          width={BAR_WIDTH - 3}
          height={d}
          className={styles.fillD}
        />
      ),
      r > 0 && (
        <rect
          key={`${i}-R`}
          x={i * BAR_WIDTH + 1.5}
          y={PLOT_HEIGHT - d - r}
          width={BAR_WIDTH - 3}
          height={r}
          className={styles.fillR}
        />
      ),
    ];
  });
  const ticks = primaries
    ? [
        { label: "First", week: getWeekIndex(primaries.first) },
        { label: "Last", week: getWeekIndex(primaries.last) },
      ]
    : [];

  return (
    <div>
      <svg
        className={styles.weeklyPlot}
        viewBox={`0 0 ${n * BAR_WIDTH} ${PLOT_HEIGHT}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Weekly spending by crypto and AI PACs, favoring Democrats and Republicans"
      >
        {bars}
        <line
          x1={0}
          x2={n * BAR_WIDTH}
          y1={PLOT_HEIGHT}
          y2={PLOT_HEIGHT}
          className={styles.baseline}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className={styles.weeklyAxis} aria-hidden="true">
        <span className={styles.axisLabel}>Jan</span>
        {ticks.map((tick) => (
          <span
            key={tick.label}
            className={`${styles.axisLabel} ${styles.weeklyTick}`}
            style={{ left: `${((tick.week + 0.5) / n) * 100}%` }}
          >
            {tick.label}
            <br />
            primaries
          </span>
        ))}
        <span className={`${styles.axisLabel} ${styles.axisLabelEnd}`}>
          Nov
        </span>
      </div>
    </div>
  );
}

async function SpendingColumn() {
  const [data, elections, totalData, expendituresData, results] =
    await Promise.all([
      fetchSpendingFlowData("all"),
      fetchAllStateElections(),
      fetchAllCommitteeTotalExpenditures("all"),
      fetchAllExpenditures(),
      loadResults("all"),
    ]);
  if (isError(data) || isError(totalData) || isError(expendituresData)) {
    return (
      <div className={styles.column}>
        <ErrorText subject="spending data" />
      </div>
    );
  }
  const flow = data as SpendingFlowData;
  // The whole cycle, matching the PAC spending card above, though the
  // timeline itself starts in 2026
  const total = totalData as number;
  const spentRaceIds = getSpentRaceIds(
    expendituresData as Record<string, Expenditure>,
  );
  const races = spentRaceIds.size;
  // Races already decided before the latest election date, like special
  // elections held earlier, which the results card next door doesn't count
  const ballotRaceIds = new Set(results?.races.map((r) => r.raceId));
  const decidedEarlier =
    results?.date && ballotRaceIds.size > 0
      ? [...spentRaceIds].filter((raceId) => !ballotRaceIds.has(raceId))
          .length
      : 0;
  return (
    <Column
      title="Spending over time"
      figure={<BigCurrency amount={total} />}
      description={
        <>
          spent by crypto and AI PACs across {races} races. Play it back week by
          week to see where and when.
        </>
      }
      chart={
        <WeeklySpending
          data={flow}
          primaries={
            isError(elections)
              ? null
              : getPrimaryRange(elections as Record<string, ElectionsByState>)
          }
        />
      }
      note={
        decidedEarlier > 0 &&
        results?.date && (
          <>
            Includes {decidedEarlier}{" "}
            {decidedEarlier === 1 ? "race" : "races"} decided before the{" "}
            {formatDateFromString(results.date)} election.
          </>
        )
      }
      href="/2026/timeline"
      linkText="Watch the timeline"
    />
  );
}

async function BattlegroundsColumn() {
  const [elections, committees, cookRatings] = await Promise.all([
    fetchAllStateElections(),
    fetchConstant<Record<string, CommitteeConstant>>("committees"),
    fetchCookRatings(),
  ]);
  if (isError(elections) || !committees) {
    return (
      <div className={styles.column}>
        <ErrorText subject="race data" />
      </div>
    );
  }
  const split = getCategorySplit(
    elections as Record<string, ElectionsByState>,
    committees,
    cookRatings,
    "all",
  );
  const total = split.reduce((t, s) => t + s.amount, 0);
  const contests = split.reduce((t, s) => t + s.contests, 0);
  const competitive = split.find((s) => s.key === "competitive")?.amount ?? 0;
  const safe = split.find((s) => s.key === "safe")?.amount ?? 0;
  const pct = total > 0 ? Math.round((competitive / total) * 100) : 0;
  const rows = [
    {
      label: "Dollars",
      value: (s: (typeof split)[number]) => s.amount,
      describe: (s: (typeof split)[number]) =>
        `${s.label} ${currency(s.amount)}`,
    },
    {
      label: "Contests",
      value: (s: (typeof split)[number]) => s.contests,
      describe: (s: (typeof split)[number]) => `${s.label} ${s.contests}`,
    },
  ];

  return (
    <Column
      title="Battlegrounds and safe seats"
      figure={
        <div className={styles.figure}>
          {pct}
          <span className={styles.figureUnit}>%</span>
        </div>
      }
      description={
        <>
          of super PAC money went to competitive races. Another {currency(safe)}{" "}
          backed candidates who were already safe.
        </>
      }
      chart={
        <>
          <div className={styles.splitRows}>
            {rows.map((row) => (
              <div key={row.label} className={styles.splitRow}>
                <span className={styles.splitLabel}>{row.label}</span>
                <div
                  className={`${barStyles.track} ${barStyles.unoutlined} ${styles.splitBar}`}
                  role="img"
                  aria-label={`${row.label} by how competitive the contest was, of ${
                    row.label === "Dollars"
                      ? currency(total)
                      : `${contests} contests`
                  }: ${split.map(row.describe).join("; ")}`}
                >
                  {split.map((s) => (
                    <div
                      key={s.key}
                      className={`${barStyles.segment} ${s.className}`}
                      style={{ flexGrow: row.value(s) }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className={legendStyles.barLegend}>
            {split.map((s) => (
              <div key={s.key} className={legendStyles.barLegendItem}>
                <span
                  className={`${legendStyles.barLegendSwatch} ${s.className}`}
                />
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </>
      }
      href="/2026/analysis/battlegrounds"
      linkText="See where the money went"
    />
  );
}

async function ResultsColumn() {
  const results = await loadResults("all");
  if (!results || !results.date) {
    return (
      <div className={styles.column}>
        <ErrorText subject="election results" />
      </div>
    );
  }
  const { tally } = results;
  const roundName = getRoundName(results.races);
  // The rest of the results page's races: super PAC money only in the
  // primary, or only direct contributions
  const otherRaces = tally.races - tally.superPacRaces;
  return (
    <Column
      title="Election results"
      figure={
        <div className={styles.figure}>
          {tally.superPacCalled}
          <span className={styles.figureOf}> of {tally.superPacRaces}</span>
        </div>
      }
      description={
        <>
          {roundName}s with crypto or AI super PAC money have been called. Each
          bar splits one kind of race&rsquo;s super PAC money by whether it
          ended up on the winning side, the losing side, or is still waiting
          on a call.
        </>
      }
      chart={<TagRecordBars tally={tally} />}
      note={
        otherRaces > 0 && (
          <>
            The results page also covers {otherRaces} more races where super
            PACs only spent in the primary or industry companies and
            executives only gave directly to candidates.
          </>
        )
      }
      href="/2026/results"
      linkText="Follow the results"
    />
  );
}

async function AdsColumn() {
  const ads = await getTaggedAds();
  const crypto = ads.filter((ad) => ad.sector === "crypto");
  const cryptoMentions = crypto.filter(mentionsIndustry).length;
  const aiMentions = ads.filter(
    (ad) => ad.sector === "ai" && mentionsIndustry(ad),
  ).length;
  const mentions = cryptoMentions + aiMentions;
  // Crypto mentions first, then AI, then the rest
  const cells = [
    ...Array<string>(cryptoMentions).fill(styles.cellCrypto),
    ...Array<string>(aiMentions).fill(styles.cellAi),
    ...Array<string>(ads.length - mentions).fill(styles.cellNone),
  ];

  return (
    <Column
      title="Political ads"
      figure={
        <div className={styles.figure}>
          {mentions}
          <span className={styles.figureOf}> of {ads.length}</span>
        </div>
      }
      description={
        <>
          ads mention the industry paying for them. Crypto PACs mention crypto
          in {cryptoMentions} of {crypto.length}.
        </>
      }
      chart={
        <>
          <div
            className={styles.waffle}
            role="img"
            aria-label={`${cryptoMentions} ads mention crypto, ${aiMentions} mention AI, and ${
              ads.length - mentions
            } mention neither`}
          >
            {cells.map((className, i) => (
              <span key={i} className={`${styles.cell} ${className}`} />
            ))}
          </div>
          <div className={legendStyles.barLegend}>
            <div className={legendStyles.barLegendItem}>
              <span
                className={`${legendStyles.barLegendSwatch} ${styles.cellCrypto}`}
              />
              <span>Mentions crypto ({cryptoMentions})</span>
            </div>
            <div className={legendStyles.barLegendItem}>
              <span
                className={`${legendStyles.barLegendSwatch} ${styles.cellAi}`}
              />
              <span>Mentions AI ({aiMentions})</span>
            </div>
            <div className={legendStyles.barLegendItem}>
              <span
                className={`${legendStyles.barLegendSwatch} ${styles.cellNone}`}
              />
              <span>No mention</span>
            </div>
          </div>
        </>
      }
      href="/2026/analysis/ads"
      linkText="See what the ads say"
    />
  );
}

export default function WhatTechMoneyBought() {
  return (
    <section className={styles.panel}>
      <div className={styles.bar}>
        <div className={styles.titleGroup}>
          <span className={styles.newBadge}>New</span>
          <h2 className={styles.title}>What tech money bought</h2>
        </div>
        <span className={styles.date}>
          Live results and three new analyses · Nov 3, 2026
        </span>
      </div>
      <div className={styles.columns}>
        <Suspense fallback={<ColumnSkeleton title="Election results" />}>
          <ResultsColumn />
        </Suspense>
        <Suspense fallback={<ColumnSkeleton title="Spending over time" />}>
          <SpendingColumn />
        </Suspense>
        <Suspense
          fallback={<ColumnSkeleton title="Battlegrounds and safe seats" />}
        >
          <BattlegroundsColumn />
        </Suspense>
        <Suspense fallback={<ColumnSkeleton title="Political ads" />}>
          <AdsColumn />
        </Suspense>
      </div>
    </section>
  );
}
