import Link from "next/link";
import { Suspense } from "react";

import {
  fetchAllCommitteeTotalExpenditures,
  fetchAllExpenditureTotalsByParty,
} from "@/app/actions/fetch";
import pageStyles from "@/app/page.module.css";
import styles from "@/app/shared.module.css";
import { ExpendituresByPartySnapshot } from "@/app/types/Expenditures";
import { Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import { formatCompact } from "@/app/utils/humanize";
import { humanizeSector, sectorHref } from "@/app/utils/sector";

import ErrorText from "../ErrorText";
import SpendingByPartyWithOpposition from "../SpendingByPartyWithOpposition";
import { HorizontalBarsSkeleton } from "./HorizontalBars";

async function ExpendituresTotal({ sector }: { sector: Sector }) {
  const data = await fetchAllCommitteeTotalExpenditures(sector);
  if (isError(data)) {
    return null;
  }
  return (
    <span className={styles.sectionTitleAmount}>
      of{" "}
      <span className={styles.sectionTitleAmountValue}>
        {formatCompact(data as number)}
      </span>{" "}
      total
    </span>
  );
}

async function AllExpendituresByPartyContent({
  labelId,
  sector,
}: {
  labelId: string;
  sector: Sector;
}) {
  const [data, totalData] = await Promise.all([
    fetchAllExpenditureTotalsByParty(sector),
    fetchAllCommitteeTotalExpenditures(sector),
  ]);
  if (isError(data)) {
    return <ErrorText subject="expenditures by party" />;
  }
  const total = isError(totalData) ? undefined : (totalData as number);
  return (
    <SpendingByPartyWithOpposition
      expenditures={data as ExpendituresByPartySnapshot}
      labelId={labelId}
      max={total}
    />
  );
}

export default function AllExpendituresByParty({ sector }: { sector: Sector }) {
  const sectorText = humanizeSector(sector, {
    abbrev: true,
    lowercase: true,
    hyphen: true,
  });
  return (
    <section className={styles.section}>
      <h2 id="expenditures-by-party-label" className={styles.sectionTitle}>
        PAC expenditures by party
        <Suspense fallback={null}>
          <ExpendituresTotal sector={sector} />
        </Suspense>
      </h2>
      <div className={pageStyles.subtitle}>
        Independent expenditures by {sectorText}focused PACs in support of or
        opposition to candidates
      </div>
      <Suspense fallback={<HorizontalBarsSkeleton numBars={4} />}>
        <AllExpendituresByPartyContent
          labelId="expenditures-by-party-label"
          sector={sector}
        />
      </Suspense>
      <div className={styles.linkRow}>
        <Link href={sectorHref("/2026/explainers/spending", sector)}>
          &raquo; More details
        </Link>
      </div>
    </section>
  );
}
