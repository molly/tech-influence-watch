import {
  CandidateSummary,
  ElectionGroup,
  RaceCandidate,
} from "@/app/types/Elections";
import { Expenditure } from "@/app/types/Expenditures";

import CandidateResult from "./CandidateResult";
import styles from "./page.module.css";

const getCandidateSupportOppose = (
  candidate: CandidateSummary,
  expenditures: Expenditure[],
) => {
  let supportTotal: number = 0;
  let opposeTotal: number = 0;
  expenditures.forEach((e: Expenditure) => {
    if (
      candidate.candidate_id &&
      e.candidate_id &&
      candidate.candidate_id.includes(e.candidate_id)
    ) {
      if (e.support_oppose_indicator === "S") {
        supportTotal += e.expenditure_amount || 0;
      } else {
        opposeTotal += e.expenditure_amount || 0;
      }
    }
  });
  return { supportTotal, opposeTotal };
};

export default function CandidateExpendituresTable({
  candidates,
  electionData,
  relatedExpenditures,
  isRaceUpcoming,
  presumptiveCandidateNames,
}: {
  candidates: RaceCandidate[];
  electionData: ElectionGroup;
  relatedExpenditures: Expenditure[];
  isRaceUpcoming: boolean;
  presumptiveCandidateNames: Set<string>;
}) {
  // Placeholders have no summary by design (they aren't real people), so they
  // have to be exempted from the has-a-summary filter or they'd never render.
  const trimmedCandidates = candidates.filter(
    (c) => c.placeholder || c.name in electionData.candidates,
  );
  return (
    <table className={styles.candidateExpendituresTable}>
      <thead>
        <tr className={styles.candidateExpendituresHeader}>
          <th></th>
          <th className="number-cell">Support</th>
          <th className="number-cell">Oppose</th>
        </tr>
      </thead>
      <tbody>
        {trimmedCandidates.map((candidate, ind) => {
          const candidateSummary = electionData.candidates[candidate.name];
          const { supportTotal, opposeTotal } = candidateSummary
            ? getCandidateSupportOppose(candidateSummary, relatedExpenditures)
            : { supportTotal: 0, opposeTotal: 0 };
          const isPresumptive = presumptiveCandidateNames.has(candidate.name);
          return (
            <CandidateResult
              key={candidate.name}
              candidate={candidate}
              candidateSummary={candidateSummary}
              supportTotal={supportTotal}
              opposeTotal={opposeTotal}
              rowClass={ind < candidates.length - 1 ? styles.candidateRow : ""}
              isRaceUpcoming={isRaceUpcoming}
              isPresumptive={isPresumptive}
            />
          );
        })}
      </tbody>
    </table>
  );
}
