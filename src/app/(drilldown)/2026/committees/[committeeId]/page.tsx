import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { MoneyCardSkeleton } from "@/app/components/MoneyCard";
import { SpendingByPartySkeleton } from "@/app/components/SpendingByPartyWithOpposition";
import COMMITTEES from "@/app/data/committees";
import sharedStyles from "@/app/shared.module.css";
import { customMetadata } from "@/app/utils/metadata";

import CommitteeDetailsSection, {
  CommitteeDetailsSkeleton,
} from "./CommitteeDetailsSection";
import CommitteeDisbursements from "./CommitteeDisbursements";
import CommitteeExpendituresByParty from "./CommitteeExpendituresByParty";
import CommitteeExpendituresTotal from "./CommitteeExpendituresTotal";
import CommitteeRaised from "./CommitteeRaised";
import CommitteeRecentExpenditures from "./CommitteeRecentExpenditures";
import styles from "./page.module.css";
import TopDonors, { TopDonorsSkeleton } from "./TopDonors";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ committeeId: string }>;
}): Promise<Metadata> {
  const { committeeId } = await params;
  let committeeName =
    committeeId in COMMITTEES ? COMMITTEES[committeeId] : committeeId;
  return customMetadata({
    title: committeeName,
    description: `Election activity by the ${committeeName} PAC`,
  });
}

export default async function CommitteePage({
  params,
  searchParams,
}: {
  params: Promise<{ committeeId: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const { committeeId } = await params;
  const { sort } = await searchParams;

  return (
    <div className={styles.page}>
      <Suspense fallback={<CommitteeDetailsSkeleton />}>
        <CommitteeDetailsSection committeeId={committeeId} />
      </Suspense>
      <section className={styles.moneyCardRow}>
        <Suspense fallback={<MoneyCardSkeleton />}>
          <CommitteeRaised committeeId={committeeId} />
        </Suspense>
        <Suspense fallback={<MoneyCardSkeleton />}>
          <CommitteeExpendituresTotal committeeId={committeeId} />
        </Suspense>
        <Suspense fallback={<MoneyCardSkeleton />}>
          <CommitteeDisbursements committeeId={committeeId} />
        </Suspense>
      </section>
      <div className={styles.committeeWrapper}>
        <section className={styles.donorSection}>
          <div className={styles.donorSectionHeaderGroup}>
            <h3 className={styles.donorSectionHeader}>Top donors</h3>
            <div className={styles.donorSortLink}>
              Sort by:{" "}
              <Link href={`?sort=${sort === "date" ? "donor" : "date"}`}>
                {sort === "date" ? "Donor" : "Date"}
              </Link>
            </div>
          </div>
          <Suspense fallback={<TopDonorsSkeleton />}>
            <TopDonors committeeId={committeeId} sort={sort} />
          </Suspense>
        </section>
        <div className={styles.rightColumn}>
          <div className={sharedStyles.constrainedWrapper}>
            <section
              className={`${sharedStyles.section} ${sharedStyles.constrainWidth}`}
            >
              <h2 id="expenditures-label">Expenditures</h2>
              <Suspense fallback={<SpendingByPartySkeleton />}>
                <CommitteeExpendituresByParty committeeId={committeeId} />
              </Suspense>
            </section>
          </div>
          <CommitteeRecentExpenditures committeeId={committeeId} />
        </div>
      </div>
    </div>
  );
}
