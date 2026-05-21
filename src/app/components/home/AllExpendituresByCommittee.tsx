import { Suspense } from "react";

import {
  fetchAllCommitteeExpenditures,
  fetchAllCommitteeTotalExpenditures,
  fetchConstant,
} from "@/app/actions/fetch";
import styles from "@/app/page.module.css";
import sharedStyles from "@/app/shared.module.css";
import { CommitteeConstant } from "@/app/types/Committee";
import { Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import { formatCompact } from "@/app/utils/humanize";

import ErrorText from "../ErrorText";
import AllExpendituresByCommitteeChart from "./AllExpendituresByCommitteeChart";
import { HorizontalBarsSkeleton } from "./HorizontalBars";

async function ExpendituresTotal({ sector }: { sector: Sector }) {
  const data = await fetchAllCommitteeTotalExpenditures(sector);
  if (isError(data)) {
    return null;
  }
  return (
    <span className={sharedStyles.sectionTitleAmount}>
      of{" "}
      <span className={sharedStyles.sectionTitleAmountValue}>
        {formatCompact(data as number)}
      </span>{" "}
      total
    </span>
  );
}

async function AllExpendituresByCommitteeContent({
  labelId,
  sector,
}: {
  labelId: string;
  sector: Sector;
}) {
  const [expendituresData, committeeConstantData, totalExpendituresData] =
    await Promise.all([
      fetchAllCommitteeExpenditures(sector),
      fetchConstant<Record<string, CommitteeConstant>>("committees"),
      fetchAllCommitteeTotalExpenditures(sector),
    ]);
  if (isError(expendituresData)) {
    return <ErrorText subject="expenditures by committee" />;
  }
  const committeeConstants = committeeConstantData || {};
  const totalExpenditures = isError(totalExpendituresData)
    ? undefined
    : (totalExpendituresData as number);
  return (
    <AllExpendituresByCommitteeChart
      expenditures={expendituresData as Record<string, number>}
      committeeConstants={committeeConstants}
      labelId={labelId}
      sector={sector}
      max={totalExpenditures}
    />
  );
}

export default function AllExpendituresByCommittee({
  sector,
}: {
  sector: Sector;
}) {
  return (
    <section className={styles.expendituresByCommitteeCard}>
      <h2
        id="expenditures-by-committee-label"
        className={sharedStyles.sectionTitle}
      >
        PAC expenditures
        <Suspense fallback={null}>
          <ExpendituresTotal sector={sector} />
        </Suspense>
      </h2>
      <Suspense fallback={<HorizontalBarsSkeleton numBars={4} />}>
        <AllExpendituresByCommitteeContent
          labelId="expenditures-by-committee-label"
          sector={sector}
        />
      </Suspense>
    </section>
  );
}
