import { Suspense } from "react";

import { fetchCommitteesWithContributions } from "@/app/actions/fetch";
import styles from "@/app/page.module.css";
import sharedStyles from "@/app/shared.module.css";
import { CommitteeConstantWithContributions } from "@/app/types/Committee";
import { Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";

import ErrorText from "../ErrorText";
import AllCashByCommitteeChart from "./AllCashByCommitteeChart";
import { HorizontalBarsSkeleton } from "./HorizontalBars";

async function AllCashByCommitteeContent({
  labelId,
  sector,
}: {
  labelId: string;
  sector: Sector;
}) {
  const [committeesData] = await Promise.all([
    fetchCommitteesWithContributions(sector),
  ]);
  if (isError(committeesData)) {
    return <ErrorText subject="receipts by committee" />;
  }
  return (
    <AllCashByCommitteeChart
      committees={committeesData as CommitteeConstantWithContributions[]}
      labelId={labelId}
      sector={sector}
    />
  );
}

export default function AllCashByCommittee({ sector }: { sector: Sector }) {
  return (
    <section className={styles.allCashCard}>
      <h2 id="cash-by-committee-label" className={sharedStyles.sectionTitle}>
        PAC funds raised
      </h2>
      <div className={styles.subtitle}>
        All cash raised by PACs, including unspent funds from previous election
        cycles and transfers from other committees
      </div>
      <Suspense fallback={<HorizontalBarsSkeleton numBars={4} />}>
        <AllCashByCommitteeContent
          labelId="cash-by-committee-label"
          sector={sector}
        />
      </Suspense>
    </section>
  );
}
