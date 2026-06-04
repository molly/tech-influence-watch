import Candidate from "@/app/components/Candidate";
import { CandidateSummary, RaceCandidate } from "@/app/types/Elections";
import { formatCurrency } from "@/app/utils/utils";

import styles from "./page.module.css";

export function ResultNote({ candidate }: { candidate: RaceCandidate }) {
  if (!candidate.declined && !candidate.withdrew) {
    return null;
  }
  return (
    <div className={styles.resultNote}>
      {candidate.declined
        ? "Declined to run"
        : candidate.withdrew
          ? `Withdrew`
          : ""}
    </div>
  );
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
  let candidateNameClassName;
  if (
    ("won" in candidate && candidate.won === false) ||
    ("withdrew" in candidate && candidate.withdrew) ||
    ("declined" in candidate && candidate.declined)
  ) {
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
