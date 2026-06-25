import Link from "next/link";
import { type ReactNode, Suspense } from "react";

import {
  fetchAllExpenditureTotalsByParty,
  fetchRaceInsights,
} from "@/app/actions/fetch";
import sharedStyles from "@/app/shared.module.css";
import { RaceInsight } from "@/app/types/Elections";
import { ExpendituresByPartySnapshot } from "@/app/types/Expenditures";
import { isError } from "@/app/utils/errors";
import {
  formatCompact,
  humanizeNumber,
  humanizePercentage,
  humanizeRoundedCurrency,
} from "@/app/utils/humanize";
import { sentenceCase } from "@/app/utils/titlecase";

import ErrorText from "../ErrorText";
import styles from "./NotablePatterns.module.css";

type NotablePattern = {
  key: string;
  label: ReactNode;
  headline: string;
  description: ReactNode;
  href?: string;
};

// Committees and the race referenced in the hand-written card copy below. The
// editorial claims around these (most-common pairing, only intra-sector
// conflict, party lean, top opposition targets) are validated post-pipeline by
// the backend healthcheck's notable_patterns_premises section; the figures here
// recompute on every render, but the prose only changes when that check flags.
const DEFEND_AMERICAN_JOBS = "C00836221";
const AMERICAN_MISSION = "C00916692";
const THINK_BIG = "C00923417";
const JOBS_AND_DEMOCRACY = "C00928374";
const INTRA_SECTOR_RACE = "NY-H-12";

const findCommittee = (race: RaceInsight | undefined, committeeId: string) =>
  race?.committees.find((committee) => committee.id === committeeId);

function buildPatterns(
  insights: RaceInsight[],
  crypto: ExpendituresByPartySnapshot,
  ai: ExpendituresByPartySnapshot,
  all: ExpendituresByPartySnapshot,
): NotablePattern[] {
  const crossSector = insights.filter((race) => race.is_cross_sector);
  const crossSectorTotal = crossSector.reduce(
    (sum, race) => sum + race.total,
    0,
  );
  const pairingCount = crossSector.filter((race) => {
    const ids = new Set(race.committees.map((committee) => committee.id));
    return ids.has(DEFEND_AMERICAN_JOBS) && ids.has(AMERICAN_MISSION);
  }).length;

  const intraSectorRace = insights.find(
    (race) => race.race_id === INTRA_SECTOR_RACE,
  );
  const thinkBigOppose =
    findCommittee(intraSectorRace, THINK_BIG)?.oppose_total ?? 0;
  const jobsAndDemocracySupport =
    findCommittee(intraSectorRace, JOBS_AND_DEMOCRACY)?.support_total ?? 0;
  const intraSectorCombined = thinkBigOppose + jobsAndDemocracySupport;

  const opposeByCandidate = new Map<string, number>();
  for (const race of insights) {
    for (const position of race.candidate_positions) {
      if (position.oppose_total > 0) {
        opposeByCandidate.set(
          position.candidate,
          (opposeByCandidate.get(position.candidate) ?? 0) +
            position.oppose_total,
        );
      }
    }
  }
  const strattonOppose = opposeByCandidate.get("Juliana Stratton") ?? 0;
  const boresOppose = opposeByCandidate.get("Alex Bores") ?? 0;

  return [
    {
      key: "cross-sector",
      label: `Cross-sector · ${crossSector.length} races · ${formatCompact(crossSectorTotal)}`,
      headline:
        "Crypto and AI PACs are spending in the same races, often through the same two committees",
      description: (
        <>
          {sentenceCase(humanizeNumber(crossSector.length))} races have seen
          spending from both crypto and AI PACs, totaling more than{" "}
          {humanizeRoundedCurrency(crossSectorTotal, true, 1)}. The most common
          pairing is{" "}
          <Link href="/2026/committees/C00836221">Defend American Jobs</Link>{" "}
          (the Republican arm of the{" "}
          <Link href="/2026/networks/fairshake">FairShake</Link> crypto super
          PAC network) and{" "}
          <Link href="/2026/committees/C00916692">American Mission</Link> (the
          Republican arm of the{" "}
          <Link href="/2026/networks/leading-the-future">
            Leading the Future
          </Link>{" "}
          AI PAC network), which have spent in {humanizeNumber(pairingCount)} of
          these races, always supporting the same candidate. One of the leaders
          of Leading the Future is also the longtime spokesperson for the
          Fairshake network.
        </>
      ),
    },
    {
      key: "intra-sector",
      label: (
        <>
          Intra-sector conflict ·{" "}
          <Link href="/2026/elections/NY-H-12">NY-H-12</Link>
        </>
      ),
      headline: `Two AI PACs spent ${formatCompact(intraSectorCombined)} opposing each other in the same primary`,
      description: (
        <>
          The OpenAI- and Andreessen Horowitz-linked{" "}
          <Link href="/2026/committees/C00923417">Think Big</Link> spent{" "}
          {humanizeRoundedCurrency(thinkBigOppose, true, 1)} opposing{" "}
          <Link href="/2026/elections/NY-H-12">Alex Bores</Link> in New
          York&rsquo;s District 12; the Anthropic-linked{" "}
          <Link href="/2026/committees/C00928374">Jobs and Democracy PAC</Link>{" "}
          spent {humanizeRoundedCurrency(jobsAndDemocracySupport, true, 1)}{" "}
          supporting him. This has been the only intra-sector conflict so far
          this cycle.
        </>
      ),
      href: "/2026/elections/NY-H-12",
    },
    {
      key: "party-lean",
      label: "Party lean · crypto vs. AI",
      headline:
        "Crypto PAC support leans Republican, AI PAC support leans Democratic",
      description: (
        <>
          Crypto PACs have spent{" "}
          {humanizeRoundedCurrency(crypto.rep_support, true, 1)} supporting
          Republicans and {humanizeRoundedCurrency(crypto.dem_support, true, 1)}{" "}
          supporting Democrats (
          {humanizePercentage(
            crypto.rep_support,
            crypto.rep_support + crypto.dem_support,
          )}
          &nbsp;Republican,{" "}
          {humanizePercentage(
            crypto.dem_support,
            crypto.rep_support + crypto.dem_support,
          )}
          &nbsp;Democrat). AI PACs have spent{" "}
          {humanizeRoundedCurrency(ai.dem_support, true, 1)} for Democrats and{" "}
          {humanizeRoundedCurrency(ai.rep_support, true, 1)} for Republicans (
          {humanizePercentage(ai.rep_support, ai.rep_support + ai.dem_support)}
          &nbsp;Republican,{" "}
          {humanizePercentage(ai.dem_support, ai.rep_support + ai.dem_support)}
          &nbsp;Democrat).
        </>
      ),
    },
    {
      key: "opposition-targets",
      label: `Opposition spending · ${formatCompact(all.dem_oppose + all.rep_oppose)}`,
      headline: "Nearly all negative spending targets Democrats",
      description: (
        <>
          Of the money spent opposing candidates rather than supporting them,{" "}
          {humanizeRoundedCurrency(all.dem_oppose, true, 1)} has gone against
          Democrats and just {humanizeRoundedCurrency(all.rep_oppose, true, 1)}{" "}
          against Republicans. The largest targets are Illinois Senate candidate{" "}
          <Link href="/2026/elections/IL-S">Juliana Stratton</Link> (
          {humanizeRoundedCurrency(strattonOppose, true, 1)}) and New York
          District 12 candidate{" "}
          <Link href="/2026/elections/NY-H-12">Alex Bores</Link> (
          {humanizeRoundedCurrency(boresOppose, true, 1)}).
        </>
      ),
    },
  ];
}

async function NotablePatternsContent() {
  const [insightsData, cryptoData, aiData, allData] = await Promise.all([
    fetchRaceInsights(),
    fetchAllExpenditureTotalsByParty("crypto"),
    fetchAllExpenditureTotalsByParty("ai"),
    fetchAllExpenditureTotalsByParty("all"),
  ]);

  if (
    isError(insightsData) ||
    isError(cryptoData) ||
    isError(aiData) ||
    isError(allData)
  ) {
    return <ErrorText subject="notable patterns" />;
  }

  const patterns = buildPatterns(
    insightsData as RaceInsight[],
    cryptoData as ExpendituresByPartySnapshot,
    aiData as ExpendituresByPartySnapshot,
    allData as ExpendituresByPartySnapshot,
  );

  return (
    <div className={styles.patterns}>
      {patterns.map((pattern) => (
        <div key={pattern.key} className={styles.pattern}>
          <div className={styles.label}>{pattern.label}</div>
          {pattern.href ? (
            <Link href={pattern.href} className={styles.headline}>
              {pattern.headline}
            </Link>
          ) : (
            <span className={styles.headline}>{pattern.headline}</span>
          )}
          <p className={styles.description}>{pattern.description}</p>
        </div>
      ))}
    </div>
  );
}

export default function NotablePatterns() {
  return (
    <section className={sharedStyles.section}>
      <h2 className={sharedStyles.sectionTitle}>Notable patterns</h2>
      <Suspense fallback={null}>
        <NotablePatternsContent />
      </Suspense>
    </section>
  );
}
