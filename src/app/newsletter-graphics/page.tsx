import type { Metadata } from "next";

import {
  fetchAllCommitteeTotalExpenditures,
  fetchAllExpenditureTotalsByParty,
  fetchAllStateElections,
  fetchConstant,
} from "@/app/actions/fetch";
import { getContests } from "@/app/components/analysis/BattlegroundRaces";
import ErrorText from "@/app/components/ErrorText";
import HorizontalBars, {
  HorizontalBarItem,
} from "@/app/components/home/HorizontalBars";
import barStyles from "@/app/components/home/HorizontalBars.module.css";
import { RaceRatingChip } from "@/app/components/RaceRating";
import tableStyles from "@/app/components/tables.module.css";
import { COOK_RATINGS, COOK_RATINGS_AS_OF } from "@/app/data/cookRatings";
import contests2024 from "@/app/data/cryptoContests2024.json";
import { STATES_BY_ABBR } from "@/app/data/states";
import { CommitteeConstant } from "@/app/types/Committee";
import { ElectionsByState } from "@/app/types/Elections";
import { ExpendituresByPartySnapshot } from "@/app/types/Expenditures";
import { isError } from "@/app/utils/errors";
import {
  humanizeList,
  humanizeRoundedCurrency,
  pluralize,
} from "@/app/utils/humanize";
import { getFirstLastName } from "@/app/utils/names";
import { getRaceHeadline } from "@/app/utils/races";
import { humanizeSector, matchesSector } from "@/app/utils/sector";
import { formatDateFromString } from "@/app/utils/utils";

import styles from "./page.module.css";
import SeatDistribution, {
  bySeat,
  CycleSeats,
  SeatAmount,
} from "./SeatDistribution";

// Temporary page for rendering newsletter graphics. Not linked from anywhere.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Newsletter graphics",
  robots: { index: false, follow: false },
};

const ELECTION_DAY = "2026-11-03";
const ROW_LIMIT = 10;
const FEC_FILINGS_AS_OF = "2026-11-02";

interface Target {
  name: string;
  party?: string;
  support: number;
  oppose: number;
}

interface RaceRow {
  raceId: string;
  total: number;
  targets: Target[];
}

// General election spending by one sector's PACs in races on the ballot on
// election day, largest first
function getRows(
  elections: Record<string, ElectionsByState>,
  committees: Record<string, CommitteeConstant>,
  sector: "crypto" | "ai",
): RaceRow[] {
  const rows: RaceRow[] = [];
  for (const [state, stateElections] of Object.entries(elections)) {
    if (!(state in STATES_BY_ABBR)) {
      continue;
    }
    for (const [shortRaceId, group] of Object.entries(stateElections)) {
      const general = (group.races || []).find(
        (race) => race.type === "general" && race.date === ELECTION_DAY,
      );
      if (!general) {
        continue;
      }
      const targets = new Map<string, Target>();
      for (const [committeeId, committeeSpending] of Object.entries(
        group.spending || {},
      )) {
        if (!matchesSector(committees[committeeId]?.sector, sector)) {
          continue;
        }
        const spending = committeeSpending.subraces?.general;
        if (!spending) {
          continue;
        }
        for (const [name, amounts] of Object.entries(spending.candidates)) {
          const target = targets.get(name) ?? {
            name,
            party:
              group.candidates?.[name]?.party ??
              general.candidates.find((c) => c.name === name)?.party,
            support: 0,
            oppose: 0,
          };
          target.support += amounts.support || 0;
          target.oppose += amounts.oppose || 0;
          targets.set(name, target);
        }
      }
      const total = [...targets.values()].reduce(
        (sum, t) => sum + t.support + t.oppose,
        0,
      );
      if (total > 0) {
        rows.push({
          raceId: `${state}-${shortRaceId}`,
          total,
          targets: [...targets.values()],
        });
      }
    }
  }
  return rows.sort((a, b) => b.total - a.total);
}

function currency(amount: number) {
  return humanizeRoundedCurrency(amount, true, 1);
}

function CandidateNames({ targets }: { targets: Target[] }) {
  return humanizeList(
    targets.map((t) => (
      <span key={t.name} className="bold">
        {getFirstLastName(t.name)[1]}
        {t.party && ` (${t.party})`}
      </span>
    )),
  );
}

// "For Husted (R); against Brown (D)"
function ForAgainst({ targets }: { targets: Target[] }) {
  const byAmount = (kind: "support" | "oppose") =>
    targets.filter((t) => t[kind] > 0).sort((a, b) => b[kind] - a[kind]);
  const supported = byAmount("support");
  const opposed = byAmount("oppose");
  return (
    <>
      {supported.length > 0 && (
        <>
          For <CandidateNames targets={supported} />
        </>
      )}
      {supported.length > 0 && opposed.length > 0 && "; against "}
      {supported.length === 0 && opposed.length > 0 && "Against "}
      {opposed.length > 0 && <CandidateNames targets={opposed} />}
    </>
  );
}

function RatingsDate() {
  const { senate, house } = COOK_RATINGS_AS_OF;
  if (senate === house) {
    return <>as of {formatDateFromString(senate)}</>;
  }
  return (
    <>
      as of {formatDateFromString(senate)} (Senate) and{" "}
      {formatDateFromString(house)} (House)
    </>
  );
}

function Graphic({
  sector,
  rows,
}: {
  sector: "crypto" | "ai";
  rows: RaceRow[];
}) {
  const shown = rows.slice(0, ROW_LIMIT);
  const max = shown[0]?.total ?? 0;
  const sectorLabel = humanizeSector(sector, { abbrev: true });
  return (
    <figure className={styles.graphic}>
      <h2 className={styles.title}>
        Where {sectorLabel === "AI" ? "AI" : sectorLabel.toLowerCase()} spent in
        2026
      </h2>
      <p className={styles.subtitle}>
        Super PAC spending by{" "}
        {humanizeSector(sector, { abbrev: true, lowercase: true })}-focused
        committees in general election races
        {rows.length > ROW_LIMIT && `, top ${ROW_LIMIT} of ${rows.length}`}
      </p>
      <div className={styles.tableWrapper}>
        <table className={`${tableStyles.superPacTable} ${styles.table}`}>
          <thead>
            <tr className={tableStyles.superPacTableHeader}>
              <th className="text-cell">Race</th>
              <th className="center-cell">Rating</th>
              <th className={`text-cell ${styles.moneyColumn}`}>Spent</th>
              <th className="text-cell">For / against</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((row) => (
              <tr key={row.raceId} className={tableStyles.superPacRow}>
                <td className={`text-cell ${styles.raceCell}`}>
                  {getRaceHeadline(row.raceId)}
                </td>
                <td className="center-cell">
                  {COOK_RATINGS[row.raceId] ? (
                    <RaceRatingChip raceId={row.raceId} />
                  ) : (
                    <span className={tableStyles.nilCell}>—</span>
                  )}
                </td>
                <td className="text-cell">
                  <HorizontalBars
                    max={max}
                    outlined={false}
                    items={[
                      {
                        key: row.raceId,
                        label: currency(row.total),
                        value: row.total,
                      },
                    ]}
                  />
                </td>
                <td className="text-cell">
                  <ForAgainst targets={row.targets} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className={styles.source}>
        Source: Tech Influence Watch,{" "}
        <a className="unstyled" href="https://influence.citationneeded.news">
          influence.citationneeded.news
        </a>
        .<br />
        Spending from Federal Election Commission filings as of{" "}
        {formatDateFromString(FEC_FILINGS_AS_OF)}. Ratings: Cook Political
        Report, <RatingsDate />.
      </figcaption>
    </figure>
  );
}

interface SectorSummary {
  sector: "crypto" | "ai";
  total: number;
  races: number;
  byParty: ExpendituresByPartySnapshot;
}

// Opposition spending is attributed to the party of its likely intended
// beneficiary, so spending against a Democrat in a Democratic primary helps
// Democrats.
function getPartyItems(byParty: ExpendituresByPartySnapshot) {
  const rows = [
    {
      key: "rep_support",
      label: "Supporting Republicans",
      value: byParty.rep_support,
      fill: barStyles.colorRepublican,
    },
    {
      key: "oppose_benefit_rep",
      label: "Opposition helping Republicans",
      value: byParty.oppose_benefit_rep,
      fill: barStyles.colorRepublican,
    },
    {
      key: "dem_support",
      label: "Supporting Democrats",
      value: byParty.dem_support,
      fill: barStyles.colorDemocrat,
    },
    {
      key: "oppose_benefit_dem",
      label: "Opposition helping Democrats",
      value: byParty.oppose_benefit_dem,
      fill: barStyles.colorDemocrat,
    },
  ];
  return rows.map(
    (row): HorizontalBarItem => ({
      key: row.key,
      label: row.label,
      value: row.value,
      displayValue: currency(row.value),
      fillClassName: row.fill,
    }),
  );
}

function PartyGraphic({ summaries }: { summaries: SectorSummary[] }) {
  // One scale across both sectors so the bars compare between panels
  const itemsBySector = summaries.map((s) => getPartyItems(s.byParty));
  const max = Math.max(
    ...itemsBySector.flatMap((items) => items.map((item) => item.value)),
  );
  return (
    <figure className={styles.graphic}>
      <h2 className={styles.title}>Which side tech PACs are on</h2>
      <p className={styles.subtitle}>
        Independent expenditures by crypto- and AI-focused super PACs in 2026
        races, by the party each expenditure helps
      </p>
      <div className={styles.legend}>
        <span className={barStyles.legendItem}>
          <span
            className={`${barStyles.legendSwatch} ${barStyles.colorRepublican}`}
            aria-hidden={true}
          />
          Helps Republicans
        </span>
        <span className={barStyles.legendItem}>
          <span
            className={`${barStyles.legendSwatch} ${barStyles.colorDemocrat}`}
            aria-hidden={true}
          />
          Helps Democrats
        </span>
      </div>
      <div className={styles.panels}>
        {summaries.map(({ sector, total, races }, i) => {
          const items = itemsBySector[i];
          return (
            <div key={sector} className={styles.panel}>
              <h3 className={styles.panelTitle}>
                {humanizeSector(sector, { abbrev: true })} PACs
              </h3>
              <p className={styles.panelSubtitle}>
                {currency(total)} across {races} races
              </p>
              <HorizontalBars items={items} max={max} outlined={false} />
            </div>
          );
        })}
      </div>
      <figcaption className={styles.source}>
        Source: Tech Influence Watch,{" "}
        <a className="unstyled" href="https://influence.citationneeded.news">
          influence.citationneeded.news
        </a>
        .<br />
        Spending from Federal Election Commission filings as of{" "}
        {formatDateFromString(FEC_FILINGS_AS_OF)}.
      </figcaption>
    </figure>
  );
}

// Many 2026 seats got close to the same amount, within 5% of this
const CLUSTER_AMOUNT = 150_000;

// Leaves out the 2025 special elections, to match the 2026 timeline
function hasElectionIn2026(
  elections: Record<string, ElectionsByState>,
  raceId: string,
): boolean {
  const separator = raceId.indexOf("-");
  const group =
    elections[raceId.slice(0, separator)]?.[raceId.slice(separator + 1)];
  return (group?.races || []).some((race) => race.date >= "2026-01-01");
}

function DistributionGraphic({
  cycles,
  excluded,
}: {
  cycles: CycleSeats[];
  // Seats whose only elections were the 2025 specials
  excluded: SeatAmount[];
}) {
  const excludedTotal = excluded.reduce((sum, seat) => sum + seat.amount, 0);
  return (
    <figure className={styles.graphic}>
      <h2 className={styles.title}>How crypto PACs spread their money</h2>
      <p className={styles.subtitle}>
        Each dot is one House or Senate seat where crypto-focused super PACs
        made independent expenditures, by total spent across its primary and
        general elections and the party the spending helped.
      </p>
      <div className={styles.legend}>
        <span className={barStyles.legendItem}>
          <span
            className={`${barStyles.legendSwatch} ${barStyles.colorRepublican}`}
            aria-hidden={true}
          />
          Helps Republicans
        </span>
        <span className={barStyles.legendItem}>
          <span
            className={`${barStyles.legendSwatch} ${barStyles.colorDemocrat}`}
            aria-hidden={true}
          />
          Helps Democrats
        </span>
        {cycles.some((cycle) => cycle.seats.some((seat) => !seat.party)) && (
          <span className={barStyles.legendItem}>
            <span
              className={`${barStyles.legendSwatch} ${barStyles.colorUnknownParty}`}
              aria-hidden={true}
            />
            Both parties or unclear
          </span>
        )}
      </div>
      <SeatDistribution cycles={cycles} />
      <figcaption className={styles.source}>
        Dollar amounts are on a logarithmic scale. 2026 leaves out{" "}
        {currency(excludedTotal)} spent on{" "}
        {pluralize(excluded.length, "special election", {
          includeValue: true,
          humanize: true,
        })}{" "}
        held in 2025.
        <br />
        Source: Tech Influence Watch,{" "}
        <a className="unstyled" href="https://influence.citationneeded.news">
          influence.citationneeded.news
        </a>
        .<br />
        Spending from Federal Election Commission filings. 2026 data as of{" "}
        {formatDateFromString(FEC_FILINGS_AS_OF)}.
      </figcaption>
    </figure>
  );
}

export default async function NewsletterGraphicsPage() {
  const [data, committees, cryptoParty, aiParty, cryptoTotal, aiTotal] =
    await Promise.all([
      fetchAllStateElections(),
      fetchConstant<Record<string, CommitteeConstant>>("committees"),
      fetchAllExpenditureTotalsByParty("crypto"),
      fetchAllExpenditureTotalsByParty("ai"),
      fetchAllCommitteeTotalExpenditures("crypto"),
      fetchAllCommitteeTotalExpenditures("ai"),
    ]);
  if (
    isError(data) ||
    !committees ||
    isError(cryptoParty) ||
    isError(aiParty) ||
    isError(cryptoTotal) ||
    isError(aiTotal)
  ) {
    return <ErrorText subject="race data" />;
  }
  const elections = data as Record<string, ElectionsByState>;
  const cryptoContests = getContests(elections, committees, "crypto");
  const summaries: SectorSummary[] = [
    {
      sector: "crypto",
      total: cryptoTotal as number,
      races: cryptoContests.length,
      byParty: cryptoParty as ExpendituresByPartySnapshot,
    },
    {
      sector: "ai",
      total: aiTotal as number,
      races: getContests(elections, committees, "ai").length,
      byParty: aiParty as ExpendituresByPartySnapshot,
    },
  ];
  // One amount per contest and party helped
  const cryptoAmounts: SeatAmount[] = cryptoContests.flatMap((contest) =>
    contest.pieces.map((piece) => ({
      raceId: contest.raceId,
      amount: piece.amount,
      party: piece.beneficiaryParty,
    })),
  );
  const seats2026 = bySeat(
    cryptoAmounts.filter((c) => hasElectionIn2026(elections, c.raceId)),
  );
  const seats2025 = bySeat(
    cryptoAmounts.filter((c) => !hasElectionIn2026(elections, c.raceId)),
  );
  const cluster = seats2026.filter(
    (seat) => Math.abs(seat.amount - CLUSTER_AMOUNT) <= CLUSTER_AMOUNT * 0.05,
  );
  const cycles: CycleSeats[] = [
    {
      year: "2024",
      seats: bySeat(
        contests2024.map((c) => ({
          raceId: c.race_id,
          amount: c.amount,
          party: c.party,
        })),
      ),
    },
    {
      year: "2026",
      seats: seats2026,
      cluster: {
        amount: CLUSTER_AMOUNT,
        lines: [
          `${pluralize(cluster.length, "seat", { includeValue: true })} drew`,
          `about ${currency(CLUSTER_AMOUNT)} each`,
        ],
      },
    },
  ];
  return (
    <main className={styles.page}>
      <DistributionGraphic cycles={cycles} excluded={seats2025} />
      <PartyGraphic summaries={summaries} />
      {(["crypto", "ai"] as const).map((sector) => (
        <Graphic
          key={sector}
          sector={sector}
          rows={getRows(elections, committees, sector)}
        />
      ))}
    </main>
  );
}
