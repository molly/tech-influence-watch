import Candidate, { UnknownCandidate } from "@/app/components/Candidate";
import { CandidateSummary, RaceCandidate } from "@/app/types/Elections";
import { isOutOfRace } from "@/app/utils/races";
import { formatCurrency } from "@/app/utils/utils";

import styles from "./page.module.css";

export function ResultNote({ candidate }: { candidate: RaceCandidate }) {
  let note;
  if (candidate.declined) {
    note = candidate.declineReason
      ? `Declined to run: ${candidate.declineReason}`
      : "Declined to run";
  } else if (candidate.died) {
    // Checked before withdrew: a candidate who died after leaving the race is
    // described by the death, not the withdrawal.
    note = "Died";
  } else if (candidate.withdrew) {
    note = "Withdrew";
  }
  if (!note) {
    return null;
  }
  return <div className={styles.resultNote}>{note}</div>;
}

export default function CandidateResult({
  candidate,
  candidateSummary,
  supportTotal,
  opposeTotal,
  rowClass,
  isRaceUpcoming,
  isPresumptive,
}: {
  candidate: RaceCandidate;
  candidateSummary: CandidateSummary;
  supportTotal: number;
  opposeTotal: number;
  rowClass?: string;
  isRaceUpcoming: boolean;
  isPresumptive?: boolean;
}) {
  if (candidate.placeholder) {
    // Not a real person, so there is no summary to join to and no spending to
    // attribute. Render the slot itself.
    return (
      <tr className={rowClass}>
        <td className={styles.candidateCell}>
          <UnknownCandidate
            party={candidate.party}
            name={candidate.name}
            noMargins={true}
          />
        </td>
        <td className={`${styles.spendingAmount} number-cell`}>
          <span className={styles.nullPlaceholder}>&ndash;</span>
        </td>
        <td className={`${styles.spendingAmount} number-cell`}>
          <span className={styles.nullPlaceholder}>&ndash;</span>
        </td>
      </tr>
    );
  }

  let candidateNameClassName;
  if (isOutOfRace(candidate)) {
    candidateNameClassName = styles.defeatedCandidateName;
  } else if (!isRaceUpcoming || isPresumptive) {
    candidateNameClassName = styles.wonCandidateName;
  }
  return (
    <tr className={rowClass}>
      <td className={styles.candidateCell}>
        <Candidate
          candidate={candidate}
          candidateSummary={candidateSummary}
          candidateClassName={styles.candidate}
          candidateNameClassName={candidateNameClassName}
          writeIn={candidate.writeIn}
          presumptive={isPresumptive}
          noMargins={true}
          extraText={<ResultNote candidate={candidate} />}
        />
      </td>
      <td className={`${styles.spendingAmount} number-cell`}>
        {supportTotal > 0 ? (
          formatCurrency(supportTotal, true)
        ) : (
          <span className={styles.nullPlaceholder}>&ndash;</span>
        )}
      </td>
      <td className={`${styles.spendingAmount} number-cell`}>
        {opposeTotal > 0 ? (
          formatCurrency(opposeTotal, true)
        ) : (
          <span className={styles.nullPlaceholder}>&ndash;</span>
        )}
      </td>
    </tr>
  );
}
