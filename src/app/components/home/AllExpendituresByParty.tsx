import { fetchAllExpenditureTotalsByParty } from "@/app/actions/fetch";
import pageStyles from "@/app/page.module.css";
import styles from "@/app/shared.module.css";
import { ExpendituresByPartySnapshot } from "@/app/types/Expenditures";
import { Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import { humanizeSector, sectorHref } from "@/app/utils/sector";
import Link from "next/link";
import { Suspense } from "react";
import ErrorText from "../ErrorText";
import SpendingByPartyWithOpposition from "../SpendingByPartyWithOpposition";
import { HorizontalPartyBarsSkeleton } from "./HorizontalPartyBars";

async function AllExpendituresByPartyContent({
  labelId,
  sector,
}: {
  labelId: string;
  sector: Sector;
}) {
  const data = await fetchAllExpenditureTotalsByParty(sector);
  if (isError(data)) {
    return <ErrorText subject="expenditures by party" />;
  }
  return (
    <SpendingByPartyWithOpposition
      expenditures={data as ExpendituresByPartySnapshot}
      labelId={labelId}
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
      </h2>
      <div className={pageStyles.subtitle}>
        Independent expenditures by {sectorText}focused PACs in support of or
        opposition to candidates
      </div>
      <Suspense fallback={<HorizontalPartyBarsSkeleton numBars={4} />}>
        <AllExpendituresByPartyContent
          labelId="expenditures-by-party-label"
          sector={sector}
        />
      </Suspense>
      <div className={styles.linkRow}>
        <Link href={sectorHref("/2026/spending", sector)}>
          &raquo; More details
        </Link>
      </div>
    </section>
  );
}
