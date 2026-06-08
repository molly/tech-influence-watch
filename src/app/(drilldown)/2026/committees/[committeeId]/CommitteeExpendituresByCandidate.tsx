import Link from "next/link";

import {
  fetchAllExpenditures,
  fetchCommitteeTotalExpenditures,
} from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import {
  HorizontalBarItem,
  HorizontalBars,
} from "@/app/components/home/HorizontalBars";
import { STATES_BY_ABBR } from "@/app/data/states";
import sharedStyles from "@/app/shared.module.css";
import {
  CommitteeTotalExpenditures,
  Expenditure,
} from "@/app/types/Expenditures";
import { isError } from "@/app/utils/errors";
import { formatCompact } from "@/app/utils/humanize";
import { getRaceName } from "@/app/utils/races";
import { titlecaseIndividualName } from "@/app/utils/titlecase";
import { formatCurrency } from "@/app/utils/utils";

import styles from "./page.module.css";

type CandidateTarget = {
  name: string;
  party: string;
  state: string;
  raceId: string;
  support: number;
  oppose: number;
};

function getCandidateName(expenditure: Expenditure): string {
  let parts: (string | null | undefined)[];
  if ("candidate_last_name" in expenditure && expenditure.candidate_last_name) {
    const firstName = expenditure.candidate_first_name
      ? expenditure.candidate_first_name.split(" ")[0]
      : "";
    parts = [
      firstName,
      expenditure.candidate_middle_name,
      expenditure.candidate_last_name,
    ];
  } else {
    parts = [expenditure.candidate_first_name, expenditure.candidate_name];
  }
  return parts.filter(Boolean).map(titlecaseIndividualName).join(" ");
}

function getExpenditureRaceId(expenditure: Expenditure): string {
  let raceId = expenditure.candidate_office ?? "";
  if (
    expenditure.candidate_office_district &&
    expenditure.candidate_office_district !== "00"
  ) {
    raceId += `-${expenditure.candidate_office_district}`;
  }
  if (
    expenditure.subrace === "special" ||
    (expenditure.election_type && expenditure.election_type[0] === "S")
  ) {
    raceId += "-special";
  }
  return raceId;
}

export default async function CommitteeExpendituresByCandidate({
  committeeId,
}: {
  committeeId: string;
}) {
  const [data, totalsData] = await Promise.all([
    fetchAllExpenditures(),
    fetchCommitteeTotalExpenditures(committeeId),
  ]);
  if (isError(data)) {
    return <ErrorText subject="the candidates targeted by this committee" />;
  }

  const allExpenditures = data as Record<string, Expenditure>;
  const targets: Record<string, CandidateTarget> = {};

  for (const expenditure of Object.values(allExpenditures)) {
    if (String(expenditure.committee_id) !== committeeId) {
      continue;
    }
    if (!expenditure.candidate_office_state) {
      continue;
    }

    const name = getCandidateName(expenditure);
    if (!name) {
      continue;
    }

    const state = expenditure.candidate_office_state;
    const raceId = getExpenditureRaceId(expenditure);
    const lastName = (
      expenditure.candidate_last_name ??
      expenditure.candidate_name ??
      ""
    ).toUpperCase();
    const key = `${state}-${raceId}-${lastName}`;

    const isSupport = expenditure.support_oppose_indicator === "S";
    const amount = expenditure.expenditure_amount ?? 0;

    if (targets[key]) {
      if (isSupport) {
        targets[key].support += amount;
      } else {
        targets[key].oppose += amount;
      }
      if (!targets[key].party && expenditure.candidate_party) {
        targets[key].party = expenditure.candidate_party;
      }
    } else {
      targets[key] = {
        name,
        party: expenditure.candidate_party ?? "",
        state,
        raceId,
        support: isSupport ? amount : 0,
        oppose: isSupport ? 0 : amount,
      };
    }
  }

  const sorted = Object.values(targets).sort(
    (a, b) => b.support + b.oppose - (a.support + a.oppose),
  );

  if (!sorted.length) {
    return null;
  }

  const raceCount = new Set(sorted.map((t) => `${t.state}-${t.raceId}`)).size;

  const totalExpenditures =
    !isError(totalsData) &&
    (totalsData as CommitteeTotalExpenditures).expenditures != null
      ? (totalsData as CommitteeTotalExpenditures).expenditures!
      : sorted[0].support + sorted[0].oppose;

  const items: HorizontalBarItem[] = sorted.map((target, i) => {
    const total = target.support + target.oppose;
    const prefix = target.support >= target.oppose ? "Support" : "Oppose";
    const stateName = STATES_BY_ABBR[target.state] ?? target.state;
    const raceName = getRaceName(target.raceId);
    const partyLetter = target.party ? target.party[0] : "";

    return {
      key: `${target.state}-${target.raceId}-${target.name}-${i}`,
      label: `${prefix} ${target.name}${partyLetter ? ` (${partyLetter})` : ""}`,
      labelNode: (
        <>
          {prefix}{" "}
          <Link
            href={`/2026/elections/${target.state}-${target.raceId}`}
            className="secondaryLink"
          >
            {target.name}
          </Link>
          {partyLetter && (
            <span className={styles.candidateTargetParty}>
              {" "}
              ({partyLetter})
            </span>
          )}
        </>
      ),
      subtitle: `${stateName} ${raceName}`.trim(),
      value: total,
      displayValue: formatCurrency(total, true),
    };
  });

  return (
    <>
      <h2 className={`${sharedStyles.sectionTitle} ${styles.sectionTitleRow}`}>
        By candidate
        <span>
          <span className={styles.sectionTitleCount}>
            {raceCount} {raceCount === 1 ? "race" : "races"}
          </span>
          <span className={sharedStyles.sectionTitleAmount}>
            of{" "}
            <span className={sharedStyles.highlightFigure}>
              {formatCompact(totalExpenditures)}
            </span>{" "}
            total
          </span>
        </span>
      </h2>
      <HorizontalBars items={items} max={totalExpenditures} showPct />
    </>
  );
}
