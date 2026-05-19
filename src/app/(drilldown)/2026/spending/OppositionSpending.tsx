import Link from "next/link";

import { fetchCandidatesWithOpposeSpending } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import Skeleton from "@/app/components/skeletons/Skeleton";
import tableStyles from "@/app/components/tables.module.css";
import { STATES_BY_ABBR } from "@/app/data/states";
import sharedStyles from "@/app/shared.module.css";
import { OppositionConstant } from "@/app/types/Elections";
import { ExpenditureCandidateSummary } from "@/app/types/Expenditures";
import { isError } from "@/app/utils/errors";
import { getFullPartyName } from "@/app/utils/party";
import { getRaceName } from "@/app/utils/races";
import { range } from "@/app/utils/range";
import { formatCurrency } from "@/app/utils/utils";

import styles from "./page.module.css";

function Beneficiary({
  opposition_details,
}: {
  opposition_details?: OppositionConstant;
}) {
  const isIncidental =
    opposition_details && opposition_details.supportedBeneficiary === false;
  if (opposition_details && opposition_details.benefitsCandidate) {
    return (
      <span className={isIncidental ? styles.incidental : undefined}>
        {opposition_details.benefitsCandidate}
      </span>
    );
  }
  return <span className="secondary">Pending</span>;
}

function Party({
  opposition_details,
}: {
  opposition_details?: OppositionConstant;
}) {
  const isIncidental =
    opposition_details && opposition_details.supportedBeneficiary === false;
  if (!opposition_details || !opposition_details.benefitsParty) {
    return <span className="secondary">Pending</span>;
  } else if (opposition_details.benefitsParty === "MIX") {
    return "Multiple parties";
  }
  return (
    <span className={isIncidental ? styles.incidental : undefined}>
      {getFullPartyName(opposition_details.benefitsParty[0])}
    </span>
  );
}

function Table({ children }: { children: React.ReactNode }) {
  return (
    <table className={styles.oppositionSpendingTable}>
      <thead>
        <tr>
          <th className={`number-cell ${tableStyles.tableCellCollapse1}`}>
            Oppose spending
          </th>
          <th className="text-cell">Targeted candidate</th>
          <th className="text-cell">Election</th>
          <th className="text-cell">Likely intended beneficiary</th>
          <th className="text-cell">Beneficiary party</th>
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

export function OppositionSpendingSkeleton() {
  return (
    <Table>
      {range(4).map((i) => (
        <tr
          key={`skeleton-row-${i}`}
          className={tableStyles.oppositionSpendingRow}
        >
          <td className={`number-cell ${tableStyles.tableCellCollapse1}`}>
            <Skeleton onCard={true} width="5rem" className={sharedStyles.floatRight} />
          </td>
          <td className="text-cell">
            <Skeleton onCard={true} width="8rem" />
          </td>
          <td className="text-cell">
            <Skeleton onCard={true} width="8rem" />
          </td>
          <td className="text-cell">
            <Skeleton onCard={true} width="8rem" />
          </td>
          <td className="text-cell">
            <Skeleton onCard={true} width="8rem" />
          </td>
        </tr>
      ))}
    </Table>
  );
}

export default async function OppositionSpending() {
  const data = await fetchCandidatesWithOpposeSpending();
  if (isError(data)) {
    return <ErrorText subject="opposition spending" />;
  }
  const candidates = data as ExpenditureCandidateSummary[];
  return (
    <Table>
      {candidates.map((candidate) => {
        const race = `${candidate.state}-${candidate.race}`;
        return (
          <tr
            key={candidate.candidate_id}
            className={tableStyles.oppositionSpendingRow}
          >
            <td className={`number-cell ${tableStyles.tableCellCollapse1}`}>
              {formatCurrency(candidate.oppose_total, true)}
            </td>
            <td className="text-cell">{candidate.common_name}</td>
            <td className="text-cell">
              <Link href={`/2026/elections/${race}`}>
                {`${STATES_BY_ABBR[candidate.state]} ${getRaceName(race)}`}
              </Link>
            </td>
            <td className="text-cell">
              <Beneficiary opposition_details={candidate.opposition_details} />
            </td>
            <td className="text-cell">
              <Party opposition_details={candidate.opposition_details} />
            </td>
          </tr>
        );
      })}
    </Table>
  );
}
