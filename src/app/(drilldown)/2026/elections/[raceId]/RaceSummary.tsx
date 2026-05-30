import sharedStyles from "@/app/shared.module.css";
import { ElectionGroup, Party, Race, RaceType } from "@/app/types/Elections";
import { PopulatedRaceExpenditureGroup } from "@/app/types/Expenditures";
import { Sector } from "@/app/types/Sector";
import { getSubraceName, isUpcomingRace } from "@/app/utils/races";
import { sentenceCase } from "@/app/utils/titlecase";
import { formatDateFromString, isUpcomingDate } from "@/app/utils/utils";

import CandidateExpendituresTable from "./CandidateExpendituresTable";
import styles from "./page.module.css";
import RaceCandidates from "./RaceCandidates";

function RaceDate({ race }: { race: Race }) {
  if (!("date" in race) || race.date === null) {
    return null;
  }
  if (isUpcomingDate(race.date, { inclusive: true })) {
    return (
      <span>
        Upcoming on{" "}
        <span className={sharedStyles.sectionTitleAmountValue}>
          {formatDateFromString(race.date)}
        </span>
      </span>
    );
  }
  return (
    <span>
      Held on{" "}
      <span className={sharedStyles.sectionTitleAmountValue}>
        {formatDateFromString(race.date)}
      </span>
    </span>
  );
}

export default function RaceSummary({
  sector,
  sectorCommitteeIds,
  race,
  electionData,
  expenditures,
  upcomingRaces,
}: {
  sector: Sector;
  sectorCommitteeIds: Set<string> | null;
  race: Race;
  electionData: ElectionGroup;
  expenditures: PopulatedRaceExpenditureGroup | null;
  upcomingRaces: Race[];
}) {
  const raceType = race.type;

  const candidates = [...race.candidates].sort((a, b) => {
    const wonA = a.won === true ? 1 : 0;
    const wonB = b.won === true ? 1 : 0;
    if (wonB !== wonA) {
      return wonB - wonA;
    }
    const summaryA = electionData.candidates[a.name] || {};
    const summaryB = electionData.candidates[b.name] || {};
    const raisedA = summaryA.raised_total ?? 0;
    const raisedB = summaryB.raised_total ?? 0;
    if (raisedB !== raisedA) {
      return raisedB - raisedA;
    }
    return a.name.localeCompare(b.name);
  });
  const candidateSummaries = candidates.map(
    (c) => electionData.candidates[c.name] || {},
  );

  const raceCandidateIds = race.party
    ? (candidates
        .map((c) => electionData.candidates[c.name]?.candidate_id)
        .filter(Boolean) as string[])
    : null;

  const sameRaceTypeExpenditures = expenditures
    ? expenditures.expenditures.filter(
        (e) =>
          e.subrace === raceType &&
          (sectorCommitteeIds === null ||
            sectorCommitteeIds.has(String(e.committee_id))),
      )
    : [];
  const relatedExpenditures = raceCandidateIds
    ? sameRaceTypeExpenditures.filter(
        (e) =>
          e.candidate_id != null &&
          raceCandidateIds.some((id) => id.includes(e.candidate_id!)),
      )
    : sameRaceTypeExpenditures;

  const hasRelatedSpending = relatedExpenditures.length > 0;
  const hasSameRaceOtherPartySpending =
    race.party != null &&
    relatedExpenditures.length === 0 &&
    sameRaceTypeExpenditures.length > 0;
  const hasSpendingInOtherRaces = candidateSummaries.filter((c) => {
    if (sectorCommitteeIds === null) {
      return c.support_total > 0 || c.oppose_total > 0;
    }
    return (
      c.expenditure_committees?.some((id) => sectorCommitteeIds.has(id)) ??
      false
    );
  });
  const isRaceUpcoming = isUpcomingRace(race, true) as boolean;

  // Collect presumptive nominees: candidates already marked won:true in an upcoming race
  // (uncontested — filing deadline has passed with only one candidate).
  const presumptiveCandidateNames = new Set<string>();
  const presumptiveParties = new Set<string>();
  if (isRaceUpcoming) {
    if (race.type === RaceType.General && upcomingRaces.length > 1) {
      // For the general, scan upcoming non-runoff primary races. Runoff races don't
      // confirm the nomination until they actually happen, even if uncontested.
      upcomingRaces.slice(1).forEach((primaryRace) => {
        if (
          primaryRace.type === RaceType.PrimaryRunoff ||
          primaryRace.type === RaceType.GeneralRunoff
        ) {
          return;
        }
        primaryRace.candidates.forEach((c) => {
          if (c.won === true) {
            presumptiveCandidateNames.add(c.name);
            const party = c.party ?? electionData.candidates[c.name]?.party;
            if (party) {
              presumptiveParties.add(party);
            }
          }
        });
      });
    } else {
      // For any other upcoming race, candidates with won:true are uncontested in
      // this specific race and should be shown as presumptive here.
      race.candidates.forEach((c) => {
        if (c.won === true) {
          presumptiveCandidateNames.add(c.name);
        }
      });
    }
  }

  let intermediateRaces;
  if (upcomingRaces.length > 1) {
    if (race.type === "general") {
      const generalCandidateParties = new Set<Party>(
        race.candidates
          .map((c) => c.party ?? electionData.candidates[c.name]?.party)
          .filter((p): p is Party => !!p),
      );
      intermediateRaces = upcomingRaces
        .slice(1)
        .filter(
          (r) =>
            !r.party ||
            (!presumptiveParties.has(r.party) &&
              !generalCandidateParties.has(r.party)),
        );
    }
  }

  return (
    <div>
      <div className={styles.raceSummaryDetails}>
        <h2 className={sharedStyles.sectionTitle}>
          {sentenceCase(getSubraceName(race))}
          <span className={sharedStyles.sectionTitleAmount}>
            <RaceDate race={race} />
          </span>
        </h2>
      </div>

      {!hasRelatedSpending && (
        <RaceCandidates
          candidates={candidates}
          candidateSummaries={candidateSummaries}
          electionData={electionData}
          hasSpendingInOtherRaces={hasSpendingInOtherRaces}
          isRaceUpcoming={isRaceUpcoming}
          presumptiveCandidateNames={presumptiveCandidateNames}
          intermediateRaces={intermediateRaces}
          sector={sector}
          hasSameRaceOtherPartySpending={hasSameRaceOtherPartySpending}
        />
      )}

      {hasRelatedSpending ? (
        <CandidateExpendituresTable
          candidates={candidates}
          electionData={electionData}
          relatedExpenditures={relatedExpenditures}
          isRaceUpcoming={isRaceUpcoming}
          presumptiveCandidateNames={presumptiveCandidateNames}
        />
      ) : (
        <div className={styles.noSpending}></div>
      )}
    </div>
  );
}
