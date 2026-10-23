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

// Committees and races referenced in the hand-written card copy below. The
// editorial claims around these (most-common pairing, only intra-sector
// conflict, party lean, top opposition targets) are validated post-pipeline by
// the backend healthcheck's notable_patterns_premises section; the figures here
// recompute on every render, but the prose only changes when that check flags.
const DEFEND_AMERICAN_JOBS = "C00836221";
const AMERICAN_MISSION = "C00916692";
const INTRA_SECTOR_RACES = [
  "NY-H-12",
  "MA-H-06",
  "AZ-H-01",
  "MT-H-01",
  "NC-H-01",
];

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

  const intraSectorAiTotal = insights
    .filter((race) => INTRA_SECTOR_RACES.includes(race.race_id))
    .flatMap((race) => race.committees)
    .filter((committee) => committee.sector === "ai")
    .reduce((sum, committee) => sum + committee.total, 0);

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
  const brownOppose = opposeByCandidate.get("Sherrod Brown") ?? 0;
  // Osborn is an independent, so his opposition isn't in the by-party totals.
  const osbornOppose = opposeByCandidate.get("Dan Osborn") ?? 0;

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
          these races, always supporting the same candidate. The two PACs share
          strategists and backers.{" "}
        </>
      ),
    },
    {
      key: "intra-sector",
      label: (
        <>
          Intra-sector conflict ·{" "}
          <Link href="/2026/elections/NY-H-12">NY-H-12</Link>,{" "}
          <Link href="/2026/elections/MA-H-06">MA-H-06</Link>,{" "}
          <Link href="/2026/elections/AZ-H-01">AZ-H-01</Link>,{" "}
          <Link href="/2026/elections/MT-H-01">MT-H-01</Link>,{" "}
          <Link href="/2026/elections/NC-H-01">NC-H-01</Link>
        </>
      ),
      headline:
        "AI PACs have turned on each other in five House races this cycle",
      description: (
        <>
          AI PACs have spent{" "}
          {humanizeRoundedCurrency(intraSectorAiTotal, true, 1)} across these
          races. Each one pits the OpenAI– and Andreessen Horowitz–backed{" "}
          <Link href="/2026/networks/leading-the-future">
            Leading the Future
          </Link>{" "}
          network against other AI PACs, and the largest fight was over{" "}
          <Link href="/2026/elections/NY-H-12">Alex Bores</Link> in New
          York&rsquo;s District 12.
        </>
      ),
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
      label: `Opposition spending · ${formatCompact(all.dem_oppose + all.rep_oppose + osbornOppose)}`,
      headline: "Most negative spending targets Democrats",
      description: (
        <>
          Of the money spent opposing candidates rather than supporting them,{" "}
          {humanizeRoundedCurrency(all.dem_oppose, true, 1)} has gone against
          Democrats, {humanizeRoundedCurrency(osbornOppose, true, 1)} against{" "}
          <Link href="/2026/elections/NE-S">Dan Osborn</Link>, an independent
          challenging Republican Senator Pete Ricketts in Nebraska, and just{" "}
          {humanizeRoundedCurrency(all.rep_oppose, true, 1)} against
          Republicans. The largest target is Ohio Senate candidate{" "}
          <Link href="/2026/elections/OH-S-special">Sherrod Brown</Link> (
          {humanizeRoundedCurrency(brownOppose, true, 1)}).
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
