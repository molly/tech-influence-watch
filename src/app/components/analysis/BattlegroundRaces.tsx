import Link from "next/link";
import { Fragment } from "react";

import { fetchAllStateElections, fetchConstant } from "@/app/actions/fetch";
import { CommitteeLink } from "@/app/components/CommitteeLink";
import ErrorText from "@/app/components/ErrorText";
import barStyles from "@/app/components/home/HorizontalBars.module.css";
import patternStyles from "@/app/components/home/NotablePatterns.module.css";
import legendStyles from "@/app/components/home/TechSectorBreakdown.module.css";
import MoneyCard, { MoneyCardSkeleton } from "@/app/components/MoneyCard";
import { RaceRatingChip, RatingHeader } from "@/app/components/RaceRating";
import Skeleton from "@/app/components/skeletons/Skeleton";
import tableStyles from "@/app/components/tables.module.css";
import { COOK_RATINGS, COOK_RATINGS_AS_OF } from "@/app/data/cookRatings";
import competitiveness from "@/app/data/raceCompetitiveness.json";
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
    title: "Competitive races",
    barLabel: "Competitive races",
    phrase: "has gone into competitive races",
  },
  {
    key: "underdog",
    title: "Backing the underdog",
    barLabel: "Underdogs",
    phrase: "has backed the underdog",
  },
  {
    key: "likely",
    title: "Backing a likely winner",
    barLabel: "Likely winners",
    phrase: "has backed a likely winner",
  },
  {
    key: "safe",
    title: "Backing the safe bet",
    barLabel: "Safe bets",
    phrase: "has backed the safe bet",
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
// and marked by the backend's commands/race_competitiveness.py, which exports
// the marks from its (uncommitted) review file to raceCompetitiveness.json.
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
for (const contest of competitiveness.contests as ReviewedContest[]) {
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
          <th className="text-cell">Race</th>
          {general && <RatingHeader />}
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
            {general && (
              <td className="center-cell">
                {COOK_RATINGS[row.raceId] ? (
                  <RaceRatingChip raceId={row.raceId} />
                ) : (
                  <span className={tableStyles.nilCell}>—</span>
                )}
              </td>
            )}
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
  const contestLink = (row: ContestRow) => (
    <Link href={`/2026/elections/${row.raceId}`}>
      {raceName(row.raceId)} {contestLabel(row.type, row.party).toLowerCase()}
    </Link>
  );

  return (
    <section className={styles.strategyCard}>
      <h2 className={sharedStyles.sectionTitle}>
        {humanizeSector(sector, { abbrev: true })} PAC strategy
        <span className={sharedStyles.sectionTitleAmount}>
          {currency(total)} in {groupByContest(pieces).length} races
        </span>
      </h2>
      <div className={patternStyles.patterns}>
        {CATEGORIES.map((c) => {
          const categoryPieces = piecesIn(c.key);
          if (!categoryPieces.length) {
            return null;
          }
          const amount = sum(categoryPieces);
          const contests = groupByContest(categoryPieces);
          const top = contests[0];
          // Name the single contest instead of calling it the largest
          const onlyContest =
            contests.length === 1 &&
            c.key !== "safe" &&
            c.key !== "unclassified";
          return (
            <div key={c.key} className={patternStyles.pattern}>
              <div className={patternStyles.label}>{c.barLabel}</div>
              <span className={patternStyles.headline}>
                {sentenceCase(pctText(amount, total))} {c.phrase}
              </span>
              <p className={patternStyles.description}>
                {currency(amount)}
                {!onlyContest && " in all"}
                {c.key === "safe" &&
                  incumbentSafe > 0 &&
                  `, ${currency(incumbentSafe)} of it supporting incumbents`}
                {c.key === "unclassified" ? (
                  ", still being reviewed."
                ) : c.key === "safe" ? (
                  "."
                ) : onlyContest ? (
                  <>, all in the {contestLink(top)}.</>
                ) : (
                  <>
                    . The largest is the {contestLink(top)}, at{" "}
                    {currency(top.amount)}
                    {top.amount / amount > 0.5
                      ? `, which accounts for ${pctText(top.amount, amount)} of the competitive spending from ${humanizeSector(sector, { abbrev: true, lowercase: true })} PACs.`
                      : "."}
                  </>
                )}
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
                They have also spent {opposed}.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

const SEGMENT_CLASSES: Record<Category, string> = {
  competitive: styles.segCompetitive,
  likely: styles.segLikely,
  safe: styles.segSafe,
  underdog: styles.segUnderdog,
  unclassified: styles.segUnclassified,
};

interface SplitSegment {
  key: string;
  label: string;
  amount: number;
  className: string;
}

interface SplitRow {
  key: string;
  label: string;
  // The row's total, as shown under its label
  totalLabel: string;
  segments: SplitSegment[];
  // How each segment reads in the bar's accessible description
  describe: (segment: { label: string; amount: number }) => string;
  // Brackets the start of the bar, so it marks a contest within the first
  // segment
  annotation?: { label: string; amount: number };
}

// The category split as proportional bars, one per measure (dollars, races),
// with one legend for both
function SplitBars({
  rows,
  legend,
  children,
}: {
  rows: SplitRow[];
  legend: { key: string; label: string; value: string; className: string }[];
  children?: React.ReactNode;
}) {
  return (
    <div className={styles.splitBlock}>
      {rows.map((row) => {
        const total = row.segments.reduce((t, s) => t + s.amount, 0);
        return (
          <Fragment key={row.key}>
            {row.annotation && (
              <>
                <div />
                <div className={styles.splitAnnotationRow} aria-hidden="true">
                  <div
                    className={styles.splitAnnotation}
                    style={{ flexGrow: row.annotation.amount }}
                  >
                    <div className={styles.splitAnnotationLabel}>
                      {row.annotation.label}: {currency(row.annotation.amount)}{" "}
                      ({pctText(row.annotation.amount, total)} of all spending)
                    </div>
                    <div className={styles.splitAnnotationBracket} />
                  </div>
                  <div
                    className={styles.splitAnnotationSpacer}
                    style={{ flexGrow: total - row.annotation.amount }}
                  />
                </div>
              </>
            )}
            <div className={styles.splitLabel}>
              <div className={patternStyles.label}>{row.label}</div>
              <div className={styles.splitTotal}>{row.totalLabel}</div>
            </div>
            <div
              className={`${barStyles.track} ${styles.splitBar}`}
              role="img"
              aria-label={`${row.label} by how competitive the race was: ${row.segments
                .map(row.describe)
                .join("; ")}${
                row.annotation
                  ? `. Of that, ${row.describe(row.annotation)}`
                  : ""
              }`}
            >
              {row.segments.map((s) => (
                <div
                  key={s.key}
                  className={`${barStyles.segment} ${s.className}`}
                  style={{ flexGrow: s.amount }}
                />
              ))}
            </div>
          </Fragment>
        );
      })}
      <div />
      <div>
        <div className={legendStyles.barLegend}>
          {legend.map((item) => (
            <div key={item.key} className={legendStyles.barLegendItem}>
              <span
                className={`${legendStyles.barLegendSwatch} ${item.className}`}
              />
              <span className={legendStyles.barLegendName}>{item.label}</span>
              <span className={legendStyles.barLegendValue}>{item.value}</span>
            </div>
          ))}
        </div>
        {children}
      </div>
    </div>
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

  // A race with money on both sides of a category line counts in both, as it
  // does in the tables below, so the race bar adds up
  const raceCounts = Object.fromEntries(
    visibleCategories.map((c) => [
      c.key,
      groupByContest(piecesIn(c.key)).length,
    ]),
  ) as Record<Category, number>;
  const raceTotal = Object.values(raceCounts).reduce((t, n) => t + n, 0);
  const segmentsBy = (amountOf: (c: Category) => number) =>
    visibleCategories.map((c) => ({
      key: c.key,
      label: c.barLabel,
      amount: amountOf(c.key),
      className: SEGMENT_CLASSES[c.key],
    }));
  const splitRows: SplitRow[] = [
    {
      key: "dollars",
      label: "Dollars",
      totalLabel: currency(total),
      segments: segmentsBy((c) => sum(piecesIn(c))),
      describe: (s) =>
        `${s.label} ${currency(s.amount)}, ${pctText(s.amount, total)}`,
      // Marked even when the paragraph doesn't call it out, so its share of
      // the competitive segment is visible
      annotation: topCompetitive
        ? {
            label: raceName(topCompetitive.raceId),
            amount: topCompetitive.amount,
          }
        : undefined,
    },
    {
      key: "races",
      label: "Races",
      totalLabel: `${raceTotal} ${raceTotal === 1 ? "race" : "races"}`,
      segments: segmentsBy((c) => raceCounts[c]),
      describe: (s) => `${s.label} ${s.amount}, ${pctText(s.amount, raceTotal)}`,
    },
  ];
  const splitLegend = visibleCategories.map((c) => ({
    key: c.key,
    label: c.barLabel,
    value: `${currency(sum(piecesIn(c.key)))} · ${raceCounts[c.key]} ${
      raceCounts[c.key] === 1 ? "race" : "races"
    }`,
    className: SEGMENT_CLASSES[c.key],
  }));
  // "Safe bets are 61% of races but 18% of dollars"
  const shareComparison = (c: Category) =>
    `are ${pctText(raceCounts[c], raceTotal)} of races but ${pctText(
      sum(piecesIn(c)),
      total,
    )} of dollars`;

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
            has gone into genuinely competitive races and{" "}
            <span className={sharedStyles.highlightFigure}>
              {pct(safe, total)}%
            </span>{" "}
            has gone behind a candidate who was already the safe bet. Another{" "}
            {pctText(likely, total)} has backed likely but not certain winners,
            and {pctText(underdog, total)} has backed an underdog.
          </p>
          {showTopCompetitive && (
            <p className={sharedStyles.headerSubtitle}>
              The {raceName(topCompetitive.raceId)} election alone accounts for{" "}
              {currency(topCompetitive.amount)}, or{" "}
              {pct(topCompetitive.amount, competitive)}% of the competitive
              total. Without it, competitive races have gotten{" "}
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
            ratings as of {formatDateFromString(COOK_RATINGS_AS_OF.senate)} (
            <a
              href="https://www.cookpolitical.com/ratings/senate-race-ratings"
              target="_blank"
              rel="noopener noreferrer"
            >
              Senate
            </a>
            ) and {formatDateFromString(COOK_RATINGS_AS_OF.house)} (
            <a
              href="https://www.cookpolitical.com/ratings/house-race-ratings"
              target="_blank"
              rel="noopener noreferrer"
            >
              House
            </a>
            ). Competitive races are those rated &ldquo;Toss-up&rdquo; or
            &ldquo;Lean&rdquo;. Likely races are those rated
            &ldquo;Likely&rdquo; or &ldquo;Solid&rdquo;.
            <p>
              Cook doesn&rsquo;t rate primaries, generals between two members of
              the same party, so these were rated based on poll data.
            </p>
          </div>
        </div>
        <MoneyCard
          topText="Backing the winners"
          amount={currency(safe)}
          bottomText={
            <span>
              has been spent on projected &ldquo;safe&rdquo; candidates in{" "}
              {groupByContest(piecesIn("safe")).length} races, illustrating the
              PACs&rsquo;{" "}
              <a href="https://www.citationneeded.news/issue-111/">
                &ldquo;back the winners&rdquo; strategy.
              </a>
            </span>
          }
        />
      </section>
      <section className={styles.moneySplit}>
        <h2 className={sharedStyles.sectionTitle}>
          Where the money went
          <span className={sharedStyles.sectionTitleAmount}>
            {currency(total)} · {raceTotal} races
          </span>
        </h2>
        {competitive > total / 2 && raceCounts.safe > raceTotal / 2 && (
          <p className={sharedStyles.subtitle}>
            Most dollars went to a few battlegrounds. Most races were safe
            seats.
          </p>
        )}
        <SplitBars rows={splitRows} legend={splitLegend}>
          {raceCounts.safe > 0 && raceCounts.competitive > 0 && (
            <p className={styles.splitComparison}>
              <span className="bold">Safe bets</span>{" "}
              {shareComparison("safe")};{" "}
              <span className="bold">competitive races</span>{" "}
              {shareComparison("competitive")}.
            </p>
          )}
        </SplitBars>
      </section>
      <div className={styles.strategyCards}>
        {strategySectors.map((s) => (
          <StrategyCard key={s} sector={s} pieces={strategyPieces[s]} />
        ))}
      </div>
      {visibleCategories.map((c) => {
        const rows = groupByContest(piecesIn(c.key));
        return (
          <section key={c.key} className={styles.bucket}>
            <h2 className={sharedStyles.sectionTitle}>
              {c.title}
              <span className={sharedStyles.sectionTitleAmount}>
                {rows.length} {rows.length === 1 ? "race" : "races"}
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
                      {currency(sum(roundRows.flatMap((row) => row.pieces)))} in{" "}
                      {roundRows.length}{" "}
                      {roundRows.length === 1 ? "race" : "races"}
                    </span>
                  </h3>
                  <ContestTable rows={roundRows} general={round.general} />
                </div>
              );
            })}
          </section>
        );
      })}
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
          <div className={styles.splitBlock}>
            <Skeleton height="0.625rem" width="100%" />
          </div>
        </div>
        <MoneyCardSkeleton />
      </section>
      <h2 className={sharedStyles.sectionTitle}>Competitive races</h2>
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} width="100%" />
      ))}
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
