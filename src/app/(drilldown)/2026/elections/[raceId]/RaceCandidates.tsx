"use client";
import Candidate, { UnknownCandidate } from "@/app/components/Candidate";
import {
  CandidateSummary,
  ElectionGroup,
  Race,
  RaceCandidate,
} from "@/app/types/Elections";
import { humanizeList } from "@/app/utils/humanize";
import { getSubraceName } from "@/app/utils/races";

import styles from "./page.module.css";

function NoSpendingCell({
  candidates,
  isRaceUpcoming,
  hasSpendingInOtherRaces,
  intermediateRaces,
}: {
  candidates: CandidateSummary[];
  isRaceUpcoming: boolean;
  hasSpendingInOtherRaces: CandidateSummary[];
  intermediateRaces?: Race[];
}) {
  return (
    <td
      className={styles.noSpendingCell}
      rowSpan={
        candidates.length + (intermediateRaces ? intermediateRaces.length : 0)
      }
    >
      <span>
        {`No cryptocurrency-focused PACs ${isRaceUpcoming ? "have " : ""}made expenditures
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
}: {
  candidates: RaceCandidate[];
  candidateSummaries: CandidateSummary[];
  electionData: ElectionGroup;
  hasSpendingInOtherRaces: CandidateSummary[];
  isRaceUpcoming: boolean;
  presumptiveCandidateNames: Set<string>;
  intermediateRaces?: Race[];
}) {
  return (
    <table className={styles.candidateExpendituresTable}>
      <thead>
        <tr>
          <th className={styles.candidateCell}></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {candidates.map((candidate, ind) => {
          const summary = electionData.candidates[candidate.name];
          const defeated =
            ("won" in candidate && candidate.won === false) ||
            ("withdrew" in candidate && candidate.withdrew) ||
            ("declined" in candidate && candidate.declined);
          const isPresumptive = presumptiveCandidateNames.has(candidate.name);
          let candidateNameClassName;
          if (defeated) {
            candidateNameClassName = styles.defeatedCandidateName;
          } else if (!isRaceUpcoming || isPresumptive) {
            candidateNameClassName = styles.wonCandidateName;
          }
          const isLastRow =
            ind === candidates.length - 1 &&
            (!intermediateRaces || intermediateRaces.length == 0);
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
                />
              </td>
              {ind === 0 && (
                <NoSpendingCell
                  candidates={candidateSummaries}
                  isRaceUpcoming={isRaceUpcoming}
                  hasSpendingInOtherRaces={hasSpendingInOtherRaces}
                  intermediateRaces={intermediateRaces}
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
      </tbody>
    </table>
  );
}
