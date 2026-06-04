import {
  fetchBeneficiariesForRace,
  fetchConstant,
  fetchStateElections,
} from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import { Beneficiary } from "@/app/types/Beneficiaries";
import { ElectionsByState } from "@/app/types/Elections";
import { Sector } from "@/app/types/Sector";
import { is4xx, isError } from "@/app/utils/errors";
import { getDeclinedElsewhereCandidateIds } from "@/app/utils/races";
import { humanizeSector } from "@/app/utils/sector";

import styles from "./page.module.css";
import Spending from "./Spending";

export default async function SpendingCard({
  sector,
  raceId,
}: {
  sector: Sector;
  raceId: string;
}) {
  const raceIdSplit = raceId.split("-");
  const shortRaceId = raceIdSplit.slice(1).join("-");
  const stateAbbr = raceIdSplit[0];
  const humanizedSector = humanizeSector(sector, {
    context: "industry",
    lowercase: true,
    or: true,
  });

  const [electionsData, beneficiariesData, candidateAliasesData] =
    await Promise.all([
      fetchStateElections(stateAbbr),
      fetchBeneficiariesForRace(raceId),
      fetchConstant<Record<string, string>>("candidateAliases"),
    ]);
  if (
    isError(electionsData) ||
    !(shortRaceId in (electionsData as ElectionsByState))
  ) {
    if (
      is4xx(electionsData) ||
      !(shortRaceId in (electionsData as ElectionsByState))
    ) {
      return (
        <span className={`${styles.errorText} smaller`}>
          No {humanizedSector} PAC spending has been recorded for this election.
        </span>
      );
    }
    return <ErrorText subject="election data" />;
  }

  const elections = electionsData as ElectionsByState;
  if (!(shortRaceId in elections)) {
    return (
      <div className="secondary">
        No {humanizedSector} PAC spending has been recorded for this election.
      </div>
    );
  }

  const beneficiaries = isError(beneficiariesData)
    ? {}
    : (beneficiariesData as Record<string, Beneficiary>);

  // Candidates who declined here but run elsewhere: their direct contributions
  // and fundraising belong to the race they're actually in, not this one.
  const suppressedCandidateIds = getDeclinedElsewhereCandidateIds(
    elections,
    shortRaceId,
    (candidateAliasesData ?? {}) as Record<string, string>,
  );

  return (
    <Spending
      election={elections[shortRaceId]}
      labelId="spending-label"
      sector={sector}
      beneficiaries={beneficiaries}
      suppressedCandidateIds={suppressedCandidateIds}
    />
  );
}
