import Link from "next/link";

import SectorBadge from "@/app/components/SectorBadge";
import { CommitteeConstant } from "@/app/types/Committee";
import { Expenditure } from "@/app/types/Expenditures";
import { Sector } from "@/app/types/Sector";
import {
  getCategory,
  humanizeExpenditureDescription,
} from "@/app/utils/expenditures";
import { range } from "@/app/utils/range";
import { sectorHref } from "@/app/utils/sector";
import {
  sentenceCase,
  titlecaseIndividualName,
  titlecaseSuffix,
} from "@/app/utils/titlecase";
import {
  formatCurrency,
  formatDateFromString,
  formatRelativeDate,
} from "@/app/utils/utils";

import { STATES_BY_ABBR } from "../data/states";
import { RaceType } from "../types/Elections";
import { getRaceName, getSubraceName } from "../utils/races";
import styles from "./recentExpenditures.module.css";
import Skeleton from "./skeletons/Skeleton";

export function RecentExpendituresContentSkeleton({
  fullPage,
}: {
  fullPage?: boolean;
}) {
  return range(fullPage ? 20 : 5).map((i) => (
    <div
      className={styles.recentExpenditureRow}
      key={`recent-expenditures-skeleton-row-${i}`}
    >
      <div>
        <Skeleton width="8rem" height="0.8rem" />
      </div>
      <div className={styles.expenditureNameAndAmount}>
        <Skeleton randWidth={[10, 15]} />
        <Skeleton width="3rem" />
      </div>
      <Skeleton width="6rem" height="0.8rem" />
      <Skeleton randWidth={[6, 15]} height="0.8rem" />
    </div>
  ));
}

function getRaceId(expenditure: Expenditure, withState = false) {
  let raceId = "";
  if (withState) {
    raceId = `${expenditure.candidate_office_state}-${expenditure.candidate_office}`;
  } else if (expenditure.candidate_office) {
    raceId = expenditure.candidate_office;
  }
  if (
    expenditure.candidate_office_district &&
    expenditure.candidate_office_district !== "00"
  ) {
    raceId += `-${expenditure.candidate_office_district}`;
  }
  if (
    expenditure.subrace === "special" ||
    (expenditure.election_type && expenditure.election_type[0] == "S")
  ) {
    raceId += "-special";
  }
  return raceId;
}

function ExpenditureRow({
  expenditure,
  committees,
  sector,
  fullPage,
}: {
  expenditure: Expenditure;
  committees?: Record<string, CommitteeConstant>;
  sector?: Sector;
  fullPage?: boolean;
}) {
  let name;
  if ("candidate_last_name" in expenditure) {
    const first_name = expenditure.candidate_first_name
      ? expenditure.candidate_first_name.split(" ")[0]
      : "";
    name = [
      first_name,
      expenditure.candidate_middle_name,
      expenditure.candidate_last_name,
    ];
  } else {
    name = [
      expenditure.candidate_first_name,
      expenditure.candidate_name,
      expenditure.candidate_suffix,
    ];
  }
  name = name.filter(Boolean).map(titlecaseIndividualName).join(" ");
  let subraceName = getSubraceName({
    type: expenditure.subrace as RaceType,
    party: expenditure.candidate_party ? expenditure.candidate_party[0] : null,
  });
  if (subraceName) {
    subraceName = sentenceCase(subraceName);
  }
  return (
    <div
      key={expenditure.transaction_id}
      className={styles.recentExpenditureRow}
    >
      {!fullPage && (
        <div className={styles.expenditureDate}>
          {expenditure.expenditure_date &&
            formatDateFromString(expenditure.expenditure_date)}
          {!expenditure.expenditure_date &&
            expenditure.dissemination_date &&
            formatDateFromString(expenditure.dissemination_date)}
        </div>
      )}
      <div className={styles.topGroup}>
        <div className={styles.expenditureNameAndAmount}>
          <div className={styles.expenditureTarget}>
            <span className="bold">
              {`${
                expenditure.support_oppose_indicator === "S"
                  ? "Support "
                  : "Oppose "
              } ${name}
                ${
                  expenditure.candidate_suffix
                    ? ` ${titlecaseSuffix(expenditure.candidate_suffix)}`
                    : ""
                }`}
            </span>
            {expenditure.candidate_party && (
              <span className={styles.expenditureParty}>
                {` (${expenditure.candidate_party[0]})`}
              </span>
            )}
          </div>
          <span className={styles.expenditureAmount}>
            {formatCurrency(expenditure.expenditure_amount, true)}
          </span>
        </div>

        <div className={styles.expenditureDetails}>
          <div>
            {subraceName && `${subraceName}, `}
            {expenditure.candidate_office_state && (
              <span className={`${styles.expenditureRace} no-wrap`}>
                <Link
                  href={sectorHref(
                    `/2026/elections/${getRaceId(expenditure, true)}`,
                    sector ?? "all",
                  )}
                >{`${STATES_BY_ABBR[expenditure.candidate_office_state]} ${getRaceName(
                  getRaceId(expenditure),
                )}`}</Link>
              </span>
            )}
          </div>
          <div className={styles.expenditureCommittee}>
            {committees && expenditure.committee_id && (
              <Link href={`/2026/committees/${expenditure.committee_id}`}>
                {committees[expenditure.committee_id].name}
              </Link>
            )}
            {sector === "all" &&
              committees &&
              expenditure.committee_id &&
              committees[expenditure.committee_id]?.sector && (
                <SectorBadge>
                  {committees[expenditure.committee_id].sector}
                </SectorBadge>
              )}
          </div>
          <div className={styles.expenditureDescription}>
            {expenditure.category_code && (
              <span>{getCategory(expenditure.category_code)}</span>
            )}
            {expenditure.expenditure_description && (
              <span>
                {humanizeExpenditureDescription(
                  expenditure.expenditure_description,
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecentExpendituresContent({
  expenditures,
  committees,
  sector,
  fullPage,
}: {
  expenditures: Expenditure[];
  committees?: Record<string, CommitteeConstant>;
  sector?: Sector;
  fullPage?: boolean;
}) {
  if (!fullPage) {
    return expenditures.map((expenditure) => (
      <ExpenditureRow
        key={expenditure.transaction_id}
        expenditure={expenditure}
        committees={committees}
        sector={sector}
        fullPage={fullPage}
      />
    ));
  }

  const groups: {
    dateKey: string;
    items: Expenditure[];
    total: number;
  }[] = [];
  const seenKeys = new Map<string, number>();

  for (const expenditure of expenditures) {
    const dateKey =
      expenditure.expenditure_date ?? expenditure.dissemination_date ?? "";
    const existing = seenKeys.get(dateKey);
    if (existing !== undefined) {
      groups[existing].items.push(expenditure);
      groups[existing].total += expenditure.expenditure_amount ?? 0;
    } else {
      seenKeys.set(dateKey, groups.length);
      groups.push({
        dateKey,
        items: [expenditure],
        total: expenditure.expenditure_amount ?? 0,
      });
    }
  }

  return groups.map(({ dateKey, items, total }) => (
    <div key={dateKey} className={styles.dateGroup}>
      {dateKey && (
        <div className={styles.dateGroupHeader}>
          <div className={styles.dateGroupDateGroup}>
            <h3 className={styles.dateGroupDate}>
              {formatDateFromString(dateKey)}
            </h3>
            <span className={styles.dateGroupMeta}>
              {formatRelativeDate(dateKey)}
            </span>
          </div>
          <div className={styles.dateGroupTotal}>
            {"day total "}
            <span className="bold">{formatCurrency(total, true)}</span>
          </div>
        </div>
      )}
      {items.map((expenditure) => (
        <ExpenditureRow
          key={expenditure.transaction_id}
          expenditure={expenditure}
          committees={committees}
          sector={sector}
          fullPage={fullPage}
        />
      ))}
    </div>
  ));
}
