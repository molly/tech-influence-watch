import Link from "next/link";

import {
  fetchBeneficiaries,
  fetchConstant,
  fetchStateElections,
  fetchStateExpenditures,
} from "@/app/actions/fetch";
import Candidate, { CandidateImage } from "@/app/components/Candidate";
import { CommitteeLink } from "@/app/components/CommitteeLink";
import ErrorText from "@/app/components/ErrorText";
import Outcome from "@/app/components/Outcome";
import Skeleton from "@/app/components/skeletons/Skeleton";
import { Beneficiary } from "@/app/types/Beneficiaries";
import { CommitteeConstant } from "@/app/types/Committee";
import {
  CandidateSummary,
  ElectionsByState,
  Race,
} from "@/app/types/Elections";
import { PopulatedStateExpenditures } from "@/app/types/Expenditures";
import { is4xx, isError } from "@/app/utils/errors";
import { humanizeList, pluralize } from "@/app/utils/humanize";
import { getFirstLastName } from "@/app/utils/names";
import {
  getRaceName,
  getSubraceName,
  getUpcomingRaceForCandidate,
  sortRaces,
} from "@/app/utils/races";
import { range } from "@/app/utils/range";
import { formatCurrency } from "@/app/utils/utils";

import styles from "./page.module.css";

const renderAmount = (amount: number, supportOppose: string) => {
  if (amount > 0) {
    return `${formatCurrency(amount, true)} to ${supportOppose}`;
  }
  return "";
};

const MAX_COMPANIES = 3;

function renderOtherSupport(
  candidate: CandidateSummary,
  beneficiary: Beneficiary,
  races: Race[],
) {
  const sorted = [...beneficiary.contributions].sort(
    (a, b) => b.total - a.total,
  );
  const topItems: (string | React.ReactElement)[] = sorted
    .slice(0, MAX_COMPANIES)
    .map((g) => (
      <Link key={g.company_id} href={`/2026/companies/${g.company_id}`}>
        {g.company_name}
      </Link>
    ));
  const remaining = sorted.length - MAX_COMPANIES;
  if (remaining > 0) {
    topItems.push(
      `${remaining} other ${pluralize(remaining, "company", { plural: "companies" })}`,
    );
  }
  const companies = humanizeList(topItems);
  const isPlural = sorted.length > 1;
  const executiveNote = isPlural
    ? " (or their executives)"
    : " (or executives)";
  const isUpcoming = !!getUpcomingRaceForCandidate(races, candidate);
  const hasPacSpending =
    candidate.support_total > 0 || candidate.oppose_total > 0;
  let verb;
  if (isUpcoming && hasPacSpending) {
    verb = isPlural ? "have also contributed" : "has also contributed";
  } else if (isUpcoming) {
    verb = isPlural ? "have contributed" : "has contributed";
  } else if (hasPacSpending) {
    verb = "also contributed";
  } else {
    verb = "contributed";
  }
  return (
    <div>
      {companies}
      {`${executiveNote} ${verb} ${formatCurrency(beneficiary.total, true)} to support ${candidate.common_name}.`}
    </div>
  );
}

function Influenced({
  candidate,
  committeeNames,
  beneficiary,
  races,
}: {
  candidate: CandidateSummary;
  committeeNames: React.ReactElement[];
  beneficiary?: Beneficiary;
  races: Race[];
}) {
  const [_, lastName] = getFirstLastName(candidate.common_name);
  const committees = humanizeList(committeeNames);
  const amounts = humanizeList([
    renderAmount(candidate.support_total, "support"),
    renderAmount(candidate.oppose_total, "oppose"),
  ]);

  const involvedRaces = (candidate.expenditure_races as string[]).map(
    (raceType: string) => {
      const r = races.filter((r) => r.type === raceType);
      if (!r) {
        return raceType;
      } else if (r.length > 1) {
        const rParty = r.filter((r) => r.party === candidate.party);
        if (rParty.length === 1) {
          return getSubraceName(rParty[0] as Race);
        } else {
          return raceType;
        }
      }
      return getSubraceName(r[0] as Race);
    },
  );
  const raceList = humanizeList(involvedRaces);
  const isUpcoming = !!getUpcomingRaceForCandidate(races, candidate);
  const spentVerb = isUpcoming
    ? committeeNames.length > 1
      ? "have spent"
      : "has spent"
    : "spent";
  return (
    <div className={styles.candidateGroup}>
      <div>
        {committees}
        {` ${spentVerb} ${amounts} ${candidate.common_name} in the `}
        {raceList}
        {"."}
      </div>
      {beneficiary && renderOtherSupport(candidate, beneficiary, races)}
      <div className={styles.candidateResultWithImage}>
        <Candidate
          candidateSummary={candidate}
          defeated={candidate.defeated}
          imageOnly={true}
        />
        {candidate.common_name}
        <Outcome candidate={candidate} races={races} inSentence={true} />.
      </div>
    </div>
  );
}

function OtherOnlyInfluenced({
  candidate,
  beneficiary,
  races,
}: {
  candidate: CandidateSummary;
  beneficiary: Beneficiary;
  races: Race[];
}) {
  const [_, lastName] = getFirstLastName(candidate.common_name);
  return (
    <div className={styles.candidateGroup}>
      {renderOtherSupport(candidate, beneficiary, races)}
      <div className={styles.candidateResultWithImage}>
        <Candidate
          candidateSummary={candidate}
          defeated={candidate.defeated}
          imageOnly={true}
        />
        {candidate.common_name}
        <Outcome candidate={candidate} races={races} inSentence={true} />.
      </div>
    </div>
  );
}

export function RaceCardContentsSkeleton() {
  return (
    <div className={styles.skeletonContainer}>
      {range(3).map((i) => (
        <div key={`race-skeleton-${i}`} className={styles.cardSection}>
          <Skeleton randWidth={[5, 15]} height="1.17em" onCard={true} />
          <Skeleton randWidth={[10, 25]} onCard={true} />
          <div className={styles.candidateResultWithImage}>
            <CandidateImage />
            <Skeleton randWidth={[10, 15]} onCard={true} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function RaceCard({ stateAbbr }: { stateAbbr: string }) {
  const [expendituresData, electionData, committeeData, beneficiariesData] =
    await Promise.all([
      fetchStateExpenditures(stateAbbr),
      fetchStateElections(stateAbbr),
      fetchConstant("committees"),
      fetchBeneficiaries(),
    ]);

  if (isError(electionData) || isError(expendituresData)) {
    if (is4xx(electionData) || is4xx(expendituresData)) {
      return (
        <span className="secondary">
          No spending has been recorded in this state.
        </span>
      );
    }
    return <ErrorText subject="state election information" />;
  }

  const COMMITTEES = (committeeData || {}) as Record<string, CommitteeConstant>;
  const expenditures = expendituresData as PopulatedStateExpenditures;
  const elections = electionData as ElectionsByState;
  const beneficiaries = (
    isError(beneficiariesData) ? {} : beneficiariesData
  ) as Record<string, Beneficiary>;

  // Include all races with any spending (super PAC or other industry support)
  const allRaceIds = new Set(Object.keys(expenditures.by_race));
  for (const shortId of Object.keys(elections)) {
    const fullId = `${stateAbbr}-${shortId}`;
    const hasNonPacSupport = Object.values(elections[shortId].candidates).some(
      (c: CandidateSummary) => c.has_non_pac_support,
    );
    if (hasNonPacSupport) {
      allRaceIds.add(fullId);
    }
  }
  const orderedRaces = Array.from(allRaceIds).sort(sortRaces);
  return (
    <>
      {orderedRaces.map(async (raceId) => {
        const shortId = raceId.split("-").slice(1).join("-");
        const influenced = Object.values(elections[shortId].candidates).filter(
          (c: CandidateSummary) => c.support_total > 0 || c.oppose_total > 0,
        );
        const otherOnlyInfluenced = Object.values(
          elections[shortId].candidates,
        ).filter(
          (c: CandidateSummary) =>
            c.has_non_pac_support &&
            c.support_total === 0 &&
            c.oppose_total === 0 &&
            c.candidate_id &&
            beneficiaries[c.candidate_id],
        );

        return (
          <div key={raceId} className={styles.cardSection}>
            <Link href={`/2026/elections/${raceId}`}>
              <h3>{getRaceName(raceId)}</h3>
            </Link>
            {influenced.map((candidate) => {
              const committeeNames = Object.keys(
                elections[shortId].spending,
              ).map((cid) => (
                <CommitteeLink
                  key={cid}
                  committeeId={cid}
                  committeeName={COMMITTEES ? COMMITTEES[cid].name : cid}
                />
              ));
              const beneficiary =
                candidate.has_non_pac_support && candidate.candidate_id
                  ? beneficiaries[candidate.candidate_id]
                  : undefined;
              return (
                <Influenced
                  key={candidate.candidate_id}
                  candidate={candidate}
                  committeeNames={committeeNames}
                  beneficiary={beneficiary}
                  races={elections[shortId].races}
                />
              );
            })}
            {otherOnlyInfluenced.map((candidate) => (
              <OtherOnlyInfluenced
                key={candidate.candidate_id}
                candidate={candidate}
                beneficiary={beneficiaries[candidate.candidate_id!]}
                races={elections[shortId].races}
              />
            ))}
          </div>
        );
      })}
    </>
  );
}
