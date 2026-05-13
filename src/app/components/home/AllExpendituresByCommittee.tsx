import {
  fetchAllCommitteeExpenditures,
  fetchConstant,
} from "@/app/actions/fetch";
import styles from "@/app/page.module.css";
import sharedStyles from "@/app/shared.module.css";
import { CommitteeConstant } from "@/app/types/Committee";
import { Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import { Suspense } from "react";
import ErrorText from "../ErrorText";
import ExpendituresSkeleton from "../skeletons/ExpendituresSkeleton";
import AllExpendituresByCommitteeChart from "./AllExpendituresByCommitteeChart";

async function AllExpendituresByCommitteeContent({
  labelId,
  sector,
}: {
  labelId: string;
  sector: Sector;
}) {
  const [expendituresData, committeeConstantData] = await Promise.all([
    fetchAllCommitteeExpenditures(sector),
    fetchConstant<Record<string, CommitteeConstant>>("committees"),
  ]);
  if (isError(expendituresData)) {
    return <ErrorText subject="expenditures by committee" />;
  }
  const committeeConstants = committeeConstantData || {};
  return (
    <AllExpendituresByCommitteeChart
      expenditures={expendituresData as Record<string, number>}
      committeeConstants={committeeConstants}
      labelId={labelId}
      sector={sector}
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
      </h2>
      <Suspense fallback={<ExpendituresSkeleton />}>
        <AllExpendituresByCommitteeContent
          labelId="expenditures-by-committee-label"
          sector={sector}
        />
      </Suspense>
    </section>
  );
}
