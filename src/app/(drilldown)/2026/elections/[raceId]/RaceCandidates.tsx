"use client";
import Candidate, { UnknownCandidate } from "@/app/components/Candidate";
import {
  CandidateSummary,
  ElectionGroup,
  Race,
  RaceCandidate,
} from "@/app/types/Elections";
import { Sector } from "@/app/types/Sector";
import { humanizeList } from "@/app/utils/humanize";
import { getSubraceName } from "@/app/utils/races";
import { humanizeSector } from "@/app/utils/sector";

import { ResultNote } from "./CandidateResult";
import styles from "./page.module.css";

function NoSpendingCell({
  candidates,
  isRaceUpcoming,
  hasSpendingInOtherRaces,
  intermediateRaces,
  nonPartisanPlaceholders = 0,
  sector,
  hasSameRaceOtherPartySpending,
}: {
  candidates: CandidateSummary[];
  isRaceUpcoming: boolean;
  hasSpendingInOtherRaces: CandidateSummary[];
  intermediateRaces?: Race[];
  nonPartisanPlaceholders?: number;
  sector: Sector;
  hasSameRaceOtherPartySpending?: boolean;
}) {
  const humanizedSector = humanizeSector(sector, {
    lowercase: true,
    hyphen: true,
    or: true,
  });
  const rowSpan =
    candidates.length +
    (intermediateRaces ? intermediateRaces.length : 0) +
    nonPartisanPlaceholders;
  if (hasSameRaceOtherPartySpending) {
    return (
      <td className={styles.noSpendingCell} rowSpan={rowSpan}>
        <span>{`No ${humanizedSector}focused PACs made expenditures pertaining to this specific race.`}</span>
      </td>
    );
  }
  return (
    <td className={styles.noSpendingCell} rowSpan={rowSpan}>
      <span>
        {`No ${humanizedSector}focused PACs ${isRaceUpcoming ? "have " : ""}made expenditures
    pertaining to this specific race`}
      </span>
      {hasSpendingInOtherRaces.length > 0 && (
        <>
          <span>, although they have supported </span>
          {humanizeList(
            hasSpendingInOtherRaces.map((c) => (
              <span key={c.common_name} className="bold">
                {c.common_name}
              </span>
            )),
          )}
          <span> in other races for this seat</span>
        </>
      )}
      <span>.</span>
    </td>
  );
}

export default function RaceCandidates({
  candidates,
  candidateSummaries,
  electionData,
  hasSpendingInOtherRaces,
  isRaceUpcoming,
  presumptiveCandidateNames,
  intermediateRaces,
  nonPartisanPlaceholders = 0,
  sector,
  hasSameRaceOtherPartySpending,
}: {
  candidates: RaceCandidate[];
  candidateSummaries: CandidateSummary[];
  electionData: ElectionGroup;
  hasSpendingInOtherRaces: CandidateSummary[];
  isRaceUpcoming: boolean;
  presumptiveCandidateNames: Set<string>;
  intermediateRaces?: Race[];
  nonPartisanPlaceholders?: number;
  sector: Sector;
  hasSameRaceOtherPartySpending?: boolean;
}) {
  return (
    <table className={styles.candidateExpendituresTable}>
      <tbody>
        {candidates.map((candidate, ind) => {
          const summary = electionData.candidates[candidate.name];
          const defeated =
            ("won" in candidate && candidate.won === false) ||
            ("withdrew" in candidate && candidate.withdrew) ||
            ("declined" in candidate && candidate.declined);
          const isPresumptive = presumptiveCandidateNames.has(candidate.name);
          let candidateNameClassName = "";
          if (defeated) {
            candidateNameClassName = styles.defeatedCandidateName;
          } else if (!isRaceUpcoming || isPresumptive) {
            candidateNameClassName = styles.wonCandidateName;
          }
          const isLastRow =
            ind === candidates.length - 1 &&
            (!intermediateRaces || intermediateRaces.length == 0) &&
            nonPartisanPlaceholders === 0;
          return (
            <tr key={candidate.name}>
              <td
                className={`${styles.candidateCell} ${!isLastRow ? styles.candidateRow : ""}`}
              >
                <Candidate
                  candidate={candidate}
                  candidateSummary={summary}
                  candidateNameClassName={candidateNameClassName}
                  writeIn={candidate.writeIn}
                  presumptive={isPresumptive}
                  noMargins={true}
                  extraText={<ResultNote candidate={candidate} />}
                />
              </td>
              {ind === 0 && (
                <NoSpendingCell
                  candidates={candidateSummaries}
                  isRaceUpcoming={isRaceUpcoming}
                  hasSpendingInOtherRaces={hasSpendingInOtherRaces}
                  intermediateRaces={intermediateRaces}
                  nonPartisanPlaceholders={nonPartisanPlaceholders}
                  sector={sector}
                  hasSameRaceOtherPartySpending={hasSameRaceOtherPartySpending}
                />
              )}
            </tr>
          );
        })}
        {intermediateRaces &&
          intermediateRaces.map((r, ind) => {
            return (
              <tr key={`${r.type}-${r.party}-winner`}>
                <td
                  className={`${styles.candidateCell} ${ind < intermediateRaces.length - 1 ? styles.candidateRow : ""}`}
                >
                  <UnknownCandidate
                    party={r.party}
                    name={`${getSubraceName(r)} winner`}
                    noMargins={true}
                  />
                </td>
              </tr>
            );
          })}
        {Array.from({ length: nonPartisanPlaceholders }).map((_, ind) => (
          <tr key={`nonpartisan-winner-${ind}`}>
            <td
              className={`${styles.candidateCell} ${ind < nonPartisanPlaceholders - 1 ? styles.candidateRow : ""}`}
            >
              <UnknownCandidate name="Primary winner" noMargins={true} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
