import Link from "next/link";

import { fetchConstant, fetchStateExpenditures } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import HorizontalBars, {
  HorizontalBarItem,
  HorizontalBarsSkeleton,
} from "@/app/components/home/HorizontalBars";
import SectorBadge from "@/app/components/SectorBadge";
import { CommitteeConstant } from "@/app/types/Committee";
import { PopulatedStateExpenditures } from "@/app/types/Expenditures";
import { Sector } from "@/app/types/Sector";
import { is4xx, isError } from "@/app/utils/errors";
import { pluralize } from "@/app/utils/humanize";
import { humanizeActiveRaces } from "@/app/utils/races";
import { formatCurrency } from "@/app/utils/utils";

export function CommitteeCardContentsSkeleton() {
  return <HorizontalBarsSkeleton numBars={3} />;
}

export default async function CommitteeCard({
  stateAbbr,
  sector,
}: {
  stateAbbr: string;
  sector: Sector;
}) {
  const [expendituresData, committeeData] = await Promise.all([
    fetchStateExpenditures(stateAbbr, sector),
    fetchConstant("committees"),
  ]);
  const committees = (committeeData || {}) as Record<string, CommitteeConstant>;
  if (isError(expendituresData)) {
    if (is4xx(expendituresData)) {
      return (
        <div className="secondary">
          No spending has been recorded in this state.
        </div>
      );
    }
    return <ErrorText subject="state election information" />;
  }
  const expenditures = expendituresData as PopulatedStateExpenditures;

  if (Object.keys(expenditures.by_committee).length === 0) {
    return (
      <div className="secondary">
        No spending has been recorded in this state.
      </div>
    );
  }

  const committeesSortedByExpenditures = Object.keys(
    expenditures.by_committee,
  ).sort((a, b) => {
    return (
      expenditures.by_committee[b].total - expenditures.by_committee[a].total
    );
  });

  const items: HorizontalBarItem[] = committeesSortedByExpenditures.map(
    (committeeId) => {
      const committee = committees?.[committeeId];
      const committeeExpenditures = expenditures.by_committee[committeeId];

      const raceIdSet = new Set<string>();
      for (const exp of committeeExpenditures.expenditures) {
        if (exp.candidate_office === "S") {
          raceIdSet.add(`${stateAbbr}-S`);
        } else if (exp.candidate_office === "H") {
          const district = exp.candidate_office_district;
          raceIdSet.add(
            district ? `${stateAbbr}-H-${district}` : `${stateAbbr}-H`,
          );
        }
      }

      const subtitle =
        raceIdSet.size > 0
          ? `Active in the ${humanizeActiveRaces(Array.from(raceIdSet))} ${pluralize(raceIdSet.size, "race")}`
          : undefined;

      return {
        key: committeeId,
        label: committee?.name ?? committeeId,
        labelNode: committee ? (
          <span>
            <Link href={`/2026/committees/${committeeId}`}>
              {committee.name}
            </Link>
            {sector === "all" && committee.sector && (
              <SectorBadge>{committee.sector}</SectorBadge>
            )}
          </span>
        ) : undefined,
        subtitle,
        value: committeeExpenditures.total,
        displayValue: formatCurrency(committeeExpenditures.total, true),
        ariaLabel: `${committee?.name ?? committeeId}: ${formatCurrency(committeeExpenditures.total, true)}`,
      };
    },
  );

  return <HorizontalBars items={items} max={expenditures.total} />;
}
