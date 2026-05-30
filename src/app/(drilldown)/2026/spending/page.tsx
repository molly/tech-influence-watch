import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { fetchAllExpenditureTotalsByParty } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import SpendingByPartyWithOpposition, {
  SpendingByPartySkeleton,
} from "@/app/components/SpendingByPartyWithOpposition";
import sharedStyles from "@/app/shared.module.css";
import { ExpendituresByPartySnapshot } from "@/app/types/Expenditures";
import { Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import { customMetadata } from "@/app/utils/metadata";
import { humanizeSector, parseSector } from "@/app/utils/sector";

import OppositionSpending, {
  OppositionSpendingSkeleton,
} from "./OppositionSpending";
import styles from "./page.module.css";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string }>;
}): Promise<Metadata> {
  const { sector: rawSector } = await searchParams;
  const sector = parseSector(rawSector);
  return customMetadata({
    title: "PAC spending by party",
    description: `${humanizeSector(sector, { hyphen: true })}focused PAC spending in the 2026 election cycle by political party`,
  });
}

async function SpendingByPartyWithOppositionChart({
  sector,
}: {
  sector: Sector;
}) {
  const data = await fetchAllExpenditureTotalsByParty(sector);
  if (isError(data)) {
    return <ErrorText subject="expenditures by party" />;
  }
  const expenditures = data as ExpendituresByPartySnapshot;
  return (
    <SpendingByPartyWithOpposition
      expenditures={expenditures}
      labelId="expenditures-by-party-label"
    />
  );
}

export default async function SpendingPage({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string }>;
}) {
  const { sector: rawSector } = await searchParams;
  const sector = parseSector(rawSector);

  return (
    <div className={sharedStyles.main}>
      <h1 className={sharedStyles.title}>Spending by all committees</h1>
      <p className={sharedStyles.headerSubtitle}>
        {humanizeSector(sector, { hyphen: true, or: true })}focused PACs have
        contributed to both support and oppose candidates from Republican and
        Democratic parties.
      </p>
      <section className={styles.column}>
        <div className={styles.spendingChart}>
          <Suspense fallback={<SpendingByPartySkeleton />}>
            <SpendingByPartyWithOppositionChart sector={sector} />
          </Suspense>
        </div>
        <p>
          However, spending to oppose Democrats does not always support
          Republicans, and vice versa. For example, when a PAC opposes a
          candidate in a primary against a candidate from the same party, they
          may be supporting a different candidate from the same party — or they
          may intend to support a candidate from the opposing party in a later
          election.
        </p>
        <p>
          In some races where PACs have spent heavily to oppose candidates but
          have not supported any candidates, such as in Illinois&rsquo;{" "}
          <Link href="/2026/elections/IL-S">Senate primary</Link> and{" "}
          <Link href="/2026/elections/IL-H-07">District 7 House primary</Link>,
          these PACs seem more focused on ousting candidates they view as
          anti-crypto, rather than supporting any specific candidate. The
          incidental beneficiaries in these cases are marked in lighter italic
          text in the table below.
        </p>
        <p>
          Based on committee support spending, individual contributions to other
          candidates, and statements supporting other candidates, opposition
          spending can be categorized based on likely beneficiary:
        </p>
        <Suspense fallback={<OppositionSpendingSkeleton />}>
          <OppositionSpending />
        </Suspense>
      </section>
    </div>
  );
}
