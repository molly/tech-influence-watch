import Link from "next/link";

import { fetchAllStateElections, fetchConstant } from "@/app/actions/fetch";
import { CommitteeLink } from "@/app/components/CommitteeLink";
import ErrorText from "@/app/components/ErrorText";
import HorizontalBars, {
  HorizontalBarItem,
  HorizontalBarsSkeleton,
} from "@/app/components/home/HorizontalBars";
import patternStyles from "@/app/components/home/NotablePatterns.module.css";
import MoneyCard, { MoneyCardSkeleton } from "@/app/components/MoneyCard";
import { RaceRatingChip, RatingHeader } from "@/app/components/RaceRating";
import Skeleton from "@/app/components/skeletons/Skeleton";
import tableStyles from "@/app/components/tables.module.css";
import { COOK_RATINGS, COOK_RATINGS_AS_OF } from "@/app/data/cookRatings";
import competitivenessReview from "@/app/data/raceCompetitiveness.review.json";
import { STATES_BY_ABBR } from "@/app/data/states";
import sharedStyles from "@/app/shared.module.css";
import { CommitteeConstant } from "@/app/types/Committee";
import { ElectionGroup, ElectionsByState, Party } from "@/app/types/Elections";
import { Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import { humanizeList, humanizeRoundedCurrency } from "@/app/utils/humanize";
import { getFullPartyName } from "@/app/utils/party";
import { getRaceName, isIncumbent } from "@/app/utils/races";
import { humanizeSector, matchesSector } from "@/app/utils/sector";
import { sentenceCase } from "@/app/utils/titlecase";
import { formatDateFromString } from "@/app/utils/utils";

import styles from "./BattlegroundRaces.module.css";

// Where a dollar went: into a genuinely competitive contest, behind a clear
// but not certain favorite (a Likely seat), behind the candidate who was the
// safe bet, behind the underdog, or into a contest that hasn't been reviewed
type Category = "competitive" | "likely" | "safe" | "underdog" | "unclassified";

const CATEGORIES: {
  key: Category;
  title: string;
  barLabel: string;
  // Completes "N% ..." in prose
  phrase: string;
}[] = [
  {
    key: "competitive",
    title: "Competitive contests",
    barLabel: "Competitive contests",
    phrase: "went into competitive contests",
  },
  {
    key: "likely",
    title: "Backing a likely winner",
    barLabel: "Likely winners",
    phrase: "backed a likely winner",
  },
  {
    key: "safe",
    title: "Backing the safe bet",
    barLabel: "Safe bets",
    phrase: "backed the safe bet",
  },
  {
    key: "underdog",
    title: "Backing the underdog",
    barLabel: "Underdogs",
    phrase: "backed the underdog",
  },
  {
    key: "unclassified",
    title: "Not yet classified",
    barLabel: "Not yet classified",
    phrase: "not yet classified",
  },
];

// Hand-marked contests that Cook's general election ratings can't classify:
// primaries, and generals between two candidates of the same party. Generated
// and marked by the backend's commands/race_competitiveness.py.
interface ReviewedContest {
  key: string;
  race_id: string;
  type: string;
  party: string;
  // true, "likely" (a clear favorite, but a real contest), false (a safe bet),
  // or null if not reviewed yet
  competitive: boolean | "likely" | null;
  // Who the safe bet was, for a contest without results yet
  favorite: string;
  candidates: { name: string; won: boolean | null }[];
}

// Index the reviewed contests by race, round, and candidate, since that's how
// spending is keyed
const REVIEWED_CONTESTS = new Map<string, ReviewedContest>();
for (const contest of competitivenessReview.contests as ReviewedContest[]) {
  for (const candidate of contest.candidates) {
    REVIEWED_CONTESTS.set(
      `${contest.race_id}|${contest.type}|${candidate.name}`,
      contest,
    );
  }
}

// One tracked-PAC amount for or against one candidate in one contest
interface Piece {
  contestKey: string;
  raceId: string;
  type: string;
  party?: string;
  category: Category;
  candidate: string;
  incumbent: boolean;
  candidateParty?: string;
  // The party the money helps: the candidate's own when supporting them, the
  // other side's when opposing them
  beneficiaryParty?: string;
  kind: "support" | "oppose";
  amount: number;
  committeeId: string;
  committeeName: string;
}

// Opposing a candidate helps their opponents' party. In a partisan primary
// that's the same party; in a general it's the other candidates' party, or if
// they're split across parties (e.g. an independent running against both), the
// party Cook rates as favored. Nonpartisan primaries have no single side to
// credit.
function getBeneficiaryParty(
  raceId: string,
  group: ElectionGroup,
  type: string,
  candidate: string,
  candidateParty: string | undefined,
  kind: "support" | "oppose",
  contestParty: string | undefined,
): string | undefined {
  if (kind === "support") {
    return candidateParty;
  }
  if (type !== "general") {
    const party = contestParty ?? candidateParty;
    return party === "N" ? undefined : party;
  }
  const opponentParties = new Set(
    (group.races || [])
      .filter((race) => race.type === "general")
      .flatMap((race) => race.candidates)
      .filter(
        (c) => c.name !== candidate && !c.withdrew && !c.died && !c.placeholder,
      )
      .map((c) => c.party),
  );
  if (opponentParties.size === 1) {
    return [...opponentParties][0];
  }
  const rating = COOK_RATINGS[raceId];
  const favoredParty = rating?.endsWith("-d")
    ? Party.Democratic
    : rating?.endsWith("-r")
      ? Party.Republican
      : undefined;
  if (
    favoredParty &&
    favoredParty !== candidateParty &&
    opponentParties.has(favoredParty)
  ) {
    return favoredParty;
  }
  return undefined;
}

// Cook's rating settles general elections between the parties: Toss-up and
// Lean are competitive, and money helping the favored party backs a likely
// winner in a Likely seat and the safe bet in a Solid one.
function classifyGeneral(
  raceId: string,
  candidateParty: string | undefined,
  kind: "support" | "oppose",
): Category {
  const rating = COOK_RATINGS[raceId];
  if (!rating) {
    return "unclassified";
  }
  if (rating === "tossup" || rating.startsWith("lean")) {
    return "competitive";
  }
  const favoredParty = rating.endsWith("-d") ? "D" : "R";
  const helpsFavorite =
    kind === "support"
      ? candidateParty === favoredParty
      : candidateParty !== favoredParty;
  if (!helpsFavorite) {
    return "underdog";
  }
  return rating.startsWith("likely") ? "likely" : "safe";
}

// For a reviewed contest marked "likely" or not competitive, the winner (or
// the hand-marked favorite, before there are results) is the favorite
function classifyReviewed(
  contest: ReviewedContest,
  candidate: string,
  kind: "support" | "oppose",
): Category {
  if (contest.competitive === null) {
    return "unclassified";
  }
  if (contest.competitive === true) {
    return "competitive";
  }
  const favorites = contest.favorite
    ? [contest.favorite]
    : contest.candidates.filter((c) => c.won === true).map((c) => c.name);
  if (!favorites.length) {
    return "unclassified";
  }
  const isFavorite = favorites.includes(candidate);
  if ((kind === "support") !== isFavorite) {
    return "underdog";
  }
  return contest.competitive === "likely" ? "likely" : "safe";
}

function getPieces(
  elections: Record<string, ElectionsByState>,
  committees: Record<string, CommitteeConstant>,
  sector: Sector,
): Piece[] {
  const pieces: Piece[] = [];
  for (const [state, stateElections] of Object.entries(elections)) {
    if (!(state in STATES_BY_ABBR)) {
      continue;
    }
    for (const [shortRaceId, group] of Object.entries(stateElections)) {
      const raceId = `${state}-${shortRaceId}`;
      const rosterCandidates = (group.races || []).flatMap((r) => r.candidates);
      for (const [committeeId, committeeSpending] of Object.entries(
        group.spending || {},
      )) {
        if (
          sector !== "all" &&
          !matchesSector(committees[committeeId]?.sector, sector)
        ) {
          continue;
        }
        for (const [type, spending] of Object.entries(
          committeeSpending.subraces || {},
        )) {
          for (const [candidate, amounts] of Object.entries(
            spending.candidates,
          )) {
            const reviewed = REVIEWED_CONTESTS.get(
              `${raceId}|${type}|${candidate}`,
            );
            const candidateParty = group.candidates?.[candidate]?.party;
            const incumbent = isIncumbent(
              group.candidates?.[candidate],
              // A candidate can be listed in several rounds, and the flag may
              // only be set on some of them
              rosterCandidates.find((c) => c.name === candidate && c.incumbent),
            );
            for (const kind of ["support", "oppose"] as const) {
              if (!amounts[kind]) {
                continue;
              }
              let category: Category;
              if (reviewed) {
                category = classifyReviewed(reviewed, candidate, kind);
              } else if (type === "general") {
                category = classifyGeneral(raceId, candidateParty, kind);
              } else {
                // Primary spending the review file doesn't have yet
                category = "unclassified";
              }
              pieces.push({
                contestKey: reviewed?.key ?? `${raceId}|${type}`,
                raceId,
                type,
                party: reviewed?.party,
                category,
                candidate,
                incumbent,
                candidateParty,
                beneficiaryParty: getBeneficiaryParty(
                  raceId,
                  group,
                  type,
                  candidate,
                  candidateParty,
                  kind,
                  reviewed?.party,
                ),
                kind,
                amount: amounts[kind],
                committeeId,
                committeeName: committees[committeeId]?.name ?? committeeId,
              });
            }
          }
        }
      }
    }
  }
  return pieces;
}

function sum(pieces: Piece[]) {
  return pieces.reduce((total, piece) => total + piece.amount, 0);
}

function pct(part: number, whole: number) {
  return whole > 0 ? Math.round((part / whole) * 100) : 0;
}

// A percentage for prose, so a small nonzero share doesn't read as "0%"
function pctText(part: number, whole: number) {
  if (part > 0 && pct(part, whole) === 0) {
    return "less than 1%";
  }
  return `${pct(part, whole)}%`;
}

function currency(amount: number) {
  return humanizeRoundedCurrency(amount, true, 1);
}

function raceName(raceId: string) {
  const state = raceId.split("-")[0];
  return `${STATES_BY_ABBR[state]} ${getRaceName(raceId)}`;
}

function contestLabel(type: string, party?: string) {
  if (type === "general") {
    return "General election";
  }
  const round = type === "primary_runoff" ? "primary runoff" : "primary";
  if (!party || party === "N") {
    return `Nonpartisan ${round}`;
  }
  return `${getFullPartyName(party)} ${round}`;
}

// Each category's contests are listed in two tables, since generals are judged
// by Cook's ratings and primaries (including runoffs) by hand review
const ROUNDS = [
  { title: "General elections", general: true },
  { title: "Primaries", general: false },
];

interface ContestRow {
  key: string;
  raceId: string;
  type: string;
  party?: string;
  amount: number;
  pieces: Piece[];
}

function groupByContest(pieces: Piece[]): ContestRow[] {
  const rows = new Map<string, ContestRow>();
  for (const piece of pieces) {
    const row = rows.get(piece.contestKey) ?? {
      key: piece.contestKey,
      raceId: piece.raceId,
      type: piece.type,
      party: piece.party,
      amount: 0,
      pieces: [],
    };
    row.amount += piece.amount;
    row.pieces.push(piece);
    rows.set(piece.contestKey, row);
  }
  return [...rows.values()].sort((a, b) => b.amount - a.amount);
}

// One line per candidate the money went for or against, with the PACs behind
// it: "For Barry Moore (R, incumbent): Defend American Jobs $2.1 million"
function TargetLines({ pieces }: { pieces: Piece[] }) {
  const byTarget = new Map<
    string,
    {
      piece: Piece;
      amount: number;
      committees: Map<string, { name: string; amount: number }>;
    }
  >();
  for (const piece of pieces) {
    const key = `${piece.kind}|${piece.candidate}`;
    const target = byTarget.get(key) ?? {
      piece,
      amount: 0,
      committees: new Map(),
    };
    target.amount += piece.amount;
    const committee = target.committees.get(piece.committeeId) ?? {
      name: piece.committeeName,
      amount: 0,
    };
    committee.amount += piece.amount;
    target.committees.set(piece.committeeId, committee);
    byTarget.set(key, target);
  }
  return [...byTarget.entries()]
    .sort(([, a], [, b]) => b.amount - a.amount)
    .map(([key, { piece, committees }]) => {
      const details = [
        piece.candidateParty,
        piece.incumbent && "incumbent",
      ].filter(Boolean);
      return (
        <div key={key} className={styles.contestMeta}>
          {piece.kind === "support" ? "For" : "Against"} {piece.candidate}
          {details.length ? ` (${details.join(", ")})` : ""}:{" "}
          {[...committees.entries()]
            .sort(([, a], [, b]) => b.amount - a.amount)
            .map(([committeeId, { name, amount }], i) => (
              <span key={committeeId}>
                {i > 0 && ", "}
                <CommitteeLink
                  committeeId={committeeId}
                  committeeName={name}
                />{" "}
                {currency(amount)}
              </span>
            ))}
        </div>
      );
    });
}

const PARTY_BAR_CLASSES: Record<string, string> = {
  D: styles.democratic,
  R: styles.republican,
  I: styles.independent,
  L: styles.libertarian,
  G: styles.green,
};

// The party most of a contest's money helped, for the row's color bar
function dominantParty(pieces: Piece[]) {
  const totals: Record<string, number> = {};
  for (const piece of pieces) {
    const party = piece.beneficiaryParty || "U";
    totals[party] = (totals[party] || 0) + piece.amount;
  }
  return Object.entries(totals).sort(([, a], [, b]) => b - a)[0]?.[0];
}

function ContestTable({
  rows,
  general,
}: {
  rows: ContestRow[];
  general: boolean;
}) {
  return (
    <table className={tableStyles.superPacTable}>
      <thead>
        <tr className={tableStyles.superPacTableHeader}>
          <th className="text-cell">Contest</th>
          {general ? (
            <RatingHeader />
          ) : (
            <RatingHeader
              label="General rating"
              note="This rates the November general election. It shows how safe the seat is for the party, not how close the primary was."
            />
          )}
          <th className="number-cell">Spent</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.key} className={tableStyles.superPacRow}>
            <td
              className={`text-cell ${styles.directionCell} ${PARTY_BAR_CLASSES[dominantParty(row.pieces) ?? ""] ?? styles.unknownParty}`}
            >
              <Link href={`/2026/elections/${row.raceId}`}>
                {raceName(row.raceId)}
              </Link>
              <div className={styles.contestMeta}>
                {contestLabel(row.type, row.party)}
              </div>
              <TargetLines pieces={row.pieces} />
            </td>
            <td className="center-cell">
              {COOK_RATINGS[row.raceId] ? (
                <RaceRatingChip raceId={row.raceId} />
              ) : (
                <span className={tableStyles.nilCell}>—</span>
              )}
            </td>
            <td className="number-cell">{currency(row.amount)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// "$82.6 million supporting Republicans and $31 million supporting Democrats"
function describeByParty(pieces: Piece[], kind: "support" | "oppose") {
  const totals: Record<string, number> = {};
  for (const piece of pieces.filter((p) => p.kind === kind)) {
    const party = piece.candidateParty || "U";
    totals[party] = (totals[party] || 0) + piece.amount;
  }
  const parties = Object.entries(totals)
    .filter(([, amount]) => amount >= 100000)
    .sort(([, a], [, b]) => b - a);
  if (!parties.length) {
    return null;
  }
  const verb = kind === "support" ? "supporting" : "opposing";
  return humanizeList(
    parties.map(([party, amount]) => {
      const label = ["D", "R", "L", "G", "I"].includes(party)
        ? `${getFullPartyName(party, false)}s`
        : "candidates with no listed party";
      return `${currency(amount)} ${verb} ${label}`;
    }),
  ) as string;
}

function StrategyCard({
  sector,
  pieces,
}: {
  sector: "crypto" | "ai";
  pieces: Piece[];
}) {
  const total = sum(pieces);
  const piecesIn = (category: Category) =>
    pieces.filter((p) => p.category === category);
  const incumbentSafe = sum(
    piecesIn("safe").filter((p) => p.incumbent && p.kind === "support"),
  );
  const supported = describeByParty(pieces, "support");
  const opposed = describeByParty(pieces, "oppose");
  const contestName = (row: ContestRow) =>
    `${raceName(row.raceId)} ${contestLabel(row.type, row.party).toLowerCase()}`;

  return (
    <section className={styles.strategyCard}>
      <h2 className={sharedStyles.sectionTitle}>
        {humanizeSector(sector, { abbrev: true })} PAC strategy
        <span className={sharedStyles.sectionTitleAmount}>
          {currency(total)} in {groupByContest(pieces).length} contests
        </span>
      </h2>
      <div className={patternStyles.patterns}>
        {CATEGORIES.map((c) => {
          const categoryPieces = piecesIn(c.key);
          if (!categoryPieces.length) {
            return null;
          }
          const amount = sum(categoryPieces);
          const top = groupByContest(categoryPieces)[0];
          return (
            <div key={c.key} className={patternStyles.pattern}>
              <div className={patternStyles.label}>{c.barLabel}</div>
              <span className={patternStyles.headline}>
                {sentenceCase(pctText(amount, total))} {c.phrase}
              </span>
              <p className={patternStyles.description}>
                {currency(amount)} in all
                {c.key === "safe" &&
                  incumbentSafe > 0 &&
                  `, ${currency(incumbentSafe)} of it supporting incumbents`}
                {c.key === "unclassified"
                  ? ", still being reviewed."
                  : `. The largest was the ${contestName(top)}, at ${currency(top.amount)}.`}
              </p>
            </div>
          );
        })}
        {supported && (
          <div className={patternStyles.pattern}>
            <div className={patternStyles.label}>Party</div>
            <span className={patternStyles.headline}>
              {sentenceCase(supported, false)}
            </span>
            {opposed && (
              <p className={patternStyles.description}>
                They also spent {opposed}.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function SectorContent({
  sector,
  pieces,
  strategyPieces,
}: {
  sector: Sector;
  pieces: Piece[];
  strategyPieces: Record<"crypto" | "ai", Piece[]>;
}) {
  const piecesIn = (category: Category) =>
    pieces.filter((p) => p.category === category);
  const total = sum(pieces);
  const competitive = sum(piecesIn("competitive"));
  const likely = sum(piecesIn("likely"));
  const safe = sum(piecesIn("safe"));
  const safePrimary = sum(piecesIn("safe").filter((p) => p.type !== "general"));
  const underdog = sum(piecesIn("underdog"));
  const unclassified = sum(piecesIn("unclassified"));
  // Call out a single contest when it makes up most of the competitive money
  // (the Ohio Senate special, as of this writing), since it skews the split
  const topCompetitive = groupByContest(piecesIn("competitive"))[0];
  const showTopCompetitive =
    topCompetitive && topCompetitive.amount > competitive / 2;
  const pacLabel = `tracked ${humanizeSector(sector, {
    hyphen: true,
    abbrev: true,
    lowercase: true,
  })}focused super PACs`;
  const strategySectors: ("crypto" | "ai")[] =
    sector === "all" ? ["crypto", "ai"] : [sector];
  const visibleCategories = CATEGORIES.filter(
    (c) => piecesIn(c.key).length > 0,
  );

  const barItems: HorizontalBarItem[] = visibleCategories.map((c) => {
    const categoryPieces = piecesIn(c.key);
    const value = sum(categoryPieces);
    const general = sum(categoryPieces.filter((p) => p.type === "general"));
    return {
      key: c.key,
      label: c.barLabel,
      value,
      displayValue: currency(value),
      subtitle: `${currency(general)} in generals, ${currency(value - general)} in primaries`,
    };
  });

  return (
    <>
      <section className={sharedStyles.heroWithStat}>
        <div>
          <p className={sharedStyles.headerSubtitle}>
            Of the{" "}
            <span className={sharedStyles.highlightFigure}>
              {currency(total)}
            </span>{" "}
            that {pacLabel} have spent on candidates,{" "}
            <span className={sharedStyles.highlightFigure}>
              {pct(competitive, total)}%
            </span>{" "}
            went into genuinely competitive contests and{" "}
            <span className={sharedStyles.highlightFigure}>
              {pct(safe, total)}%
            </span>{" "}
            went behind the candidate who was already the safe bet. Another{" "}
            {pctText(likely, total)} backed a likely but not certain winner, and{" "}
            {pctText(underdog, total)} backed the underdog.
            {safe > 0 &&
              ` ${sentenceCase(pctText(safePrimary, safe))} of the safe-bet money was spent in primaries.`}
            {unclassified > 0 &&
              ` The remaining ${pct(unclassified, total)}% is in contests not yet classified.`}
          </p>
          {showTopCompetitive && (
            <p className={sharedStyles.headerSubtitle}>
              The {raceName(topCompetitive.raceId)} election alone accounts for{" "}
              {currency(topCompetitive.amount)}, or{" "}
              {pct(topCompetitive.amount, competitive)}% of the competitive
              total. Without it, competitive contests got{" "}
              {pct(
                competitive - topCompetitive.amount,
                total - topCompetitive.amount,
              )}
              % of the money.
            </p>
          )}
          <div className={sharedStyles.noteCard}>
            <span className={sharedStyles.noteLabel}>Note:</span> general
            elections are classified with the Cook Political Report&rsquo;s
            ratings as of {formatDateFromString(COOK_RATINGS_AS_OF.senate)}{" "}
            (Senate) and {formatDateFromString(COOK_RATINGS_AS_OF.house)}{" "}
            (House): Toss-up and Lean races count as competitive, and money
            helping the favored party backs a likely winner in a Likely seat and
            the safe bet in a Solid one. Cook doesn&rsquo;t rate primaries,
            generals between two members of the same party, or special elections
            decided before these ratings, so those were reviewed by hand the
            same way. In them, the favorite is the candidate who won, or for
            contests that haven&rsquo;t happened yet, the candidate expected to
            win.
          </div>
        </div>
        <MoneyCard
          topText="Spent backing the safe bet"
          amount={currency(safe)}
          bottomText={`across ${groupByContest(piecesIn("safe")).length} contests`}
        />
      </section>
      <div className={styles.strategyCards}>
        {strategySectors.map((s) => (
          <StrategyCard key={s} sector={s} pieces={strategyPieces[s]} />
        ))}
      </div>
      <div className={sharedStyles.columns}>
        <div className={sharedStyles.mainColumn}>
          {visibleCategories.map((c) => {
            const rows = groupByContest(piecesIn(c.key));
            return (
              <section key={c.key} className={styles.bucket}>
                <h2 className={sharedStyles.sectionTitle}>
                  {c.title}
                  <span className={sharedStyles.sectionTitleAmount}>
                    {rows.length} {rows.length === 1 ? "contest" : "contests"}
                  </span>
                </h2>
                {ROUNDS.map((round) => {
                  const roundRows = rows.filter(
                    (row) => (row.type === "general") === round.general,
                  );
                  if (!roundRows.length) {
                    return null;
                  }
                  return (
                    <div key={round.title} className={styles.round}>
                      <h3 className={sharedStyles.sectionTitle}>
                        {round.title}
                        <span className={sharedStyles.sectionTitleAmount}>
                          {currency(
                            sum(roundRows.flatMap((row) => row.pieces)),
                          )}{" "}
                          in {roundRows.length}{" "}
                          {roundRows.length === 1 ? "contest" : "contests"}
                        </span>
                      </h3>
                      <ContestTable rows={roundRows} general={round.general} />
                    </div>
                  );
                })}
              </section>
            );
          })}
        </div>
        <div className={sharedStyles.sideColumn}>
          <h2 className={sharedStyles.sectionTitle}>Where the money went</h2>
          <HorizontalBars items={barItems} />
        </div>
      </div>
    </>
  );
}

export function BattlegroundRacesSkeleton() {
  return (
    <>
      <section className={sharedStyles.heroWithStat}>
        <div>
          <Skeleton height="1.1rem" width="80%" />
          <Skeleton height="1.1rem" width="55%" />
        </div>
        <MoneyCardSkeleton />
      </section>
      <div className={sharedStyles.columns}>
        <div className={sharedStyles.mainColumn}>
          <h2 className={sharedStyles.sectionTitle}>Competitive contests</h2>
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} width="100%" />
          ))}
        </div>
        <div className={sharedStyles.sideColumn}>
          <h2 className={sharedStyles.sectionTitle}>Where the money went</h2>
          <HorizontalBarsSkeleton numBars={3} />
        </div>
      </div>
    </>
  );
}

export default async function BattlegroundRaces({
  sector,
}: {
  sector: Sector;
}) {
  const [data, committeesData] = await Promise.all([
    fetchAllStateElections(),
    fetchConstant<Record<string, CommitteeConstant>>("committees"),
  ]);
  if (isError(data) || !committeesData) {
    return <ErrorText subject="race data" />;
  }
  const elections = data as Record<string, ElectionsByState>;
  const strategyPieces = {
    crypto: getPieces(elections, committeesData, "crypto"),
    ai: getPieces(elections, committeesData, "ai"),
  };
  return (
    <SectorContent
      sector={sector}
      pieces={
        sector === "all"
          ? getPieces(elections, committeesData, "all")
          : strategyPieces[sector]
      }
      strategyPieces={strategyPieces}
    />
  );
}
