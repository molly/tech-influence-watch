import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { fetchCommitteeDetails } from "@/app/actions/fetch";
import { MoneyCardSkeleton } from "@/app/components/MoneyCard";
import { SpendingByPartySkeleton } from "@/app/components/SpendingByPartyWithOpposition";
import TotalsRow from "@/app/components/TotalsRow";
import COMMITTEES from "@/app/data/committees";
import sharedStyles from "@/app/shared.module.css";
import { CommitteeDetails } from "@/app/types/Committee";
import { isError } from "@/app/utils/errors";
import { customMetadata } from "@/app/utils/metadata";

import CommitteeDetailsSection, {
  CommitteeDetailsSkeleton,
} from "./CommitteeDetailsSection";
import CommitteeDisbursements from "./CommitteeDisbursements";
import CommitteeExpendituresByCandidate from "./CommitteeExpendituresByCandidate";
import CommitteeExpendituresByParty from "./CommitteeExpendituresByParty";
import CommitteeExpendituresTotal from "./CommitteeExpendituresTotal";
import CommitteeRaised from "./CommitteeRaised";
import CommitteeRecentExpenditures from "./CommitteeRecentExpenditures";
import styles from "./page.module.css";
import TopDonors, { TopDonorsSkeleton } from "./TopDonors";

async function CommitteeExpendituresBottomSections({
  committeeId,
}: {
  committeeId: string;
}) {
  const committeeData = await fetchCommitteeDetails(committeeId);
  if (isError(committeeData)) {
    return null;
  }
  const committee = committeeData as CommitteeDetails;
  if (!committee.by_party) {
    return null;
  }
  return (
    <>
      <section className={sharedStyles.section}>
        <h2 className={sharedStyles.sectionTitle}>By candidate</h2>
        <Suspense>
          <CommitteeExpendituresByCandidate committeeId={committeeId} />
        </Suspense>
      </section>
      <CommitteeRecentExpenditures committeeId={committeeId} />
    </>
  );
}

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
    <>
      <Suspense fallback={<CommitteeDetailsSkeleton />}>
        <CommitteeDetailsSection committeeId={committeeId} />
      </Suspense>
      <div className={sharedStyles.main}>
        <TotalsRow>
          <Suspense fallback={<MoneyCardSkeleton />}>
            <CommitteeRaised committeeId={committeeId} />
          </Suspense>
          <Suspense fallback={<MoneyCardSkeleton />}>
            <CommitteeExpendituresTotal committeeId={committeeId} />
          </Suspense>
          <Suspense fallback={<MoneyCardSkeleton />}>
            <CommitteeDisbursements committeeId={committeeId} />
          </Suspense>
        </TotalsRow>
        <div className={styles.committeeWrapper}>
          <section className={styles.donorSection}>
            <div className={styles.donorSectionHeaderGroup}>
              <h2 className={styles.donorSectionHeader}>Top donors</h2>
            </div>
            <div className={sharedStyles.controls}>
              <div className={sharedStyles.controlsLeft}>
                <span className={sharedStyles.controlLabel}>Sort</span>
                <div className={sharedStyles.controlGroup}>
                  <Link
                    href="?"
                    className={
                      sort !== "date"
                        ? sharedStyles.controlBtnActive
                        : sharedStyles.controlBtn
                    }
                  >
                    {sort !== "date" ? (
                      <>
                        Amount <span className={sharedStyles.sortArrow}>↓</span>
                      </>
                    ) : (
                      "Amount"
                    )}
                  </Link>
                  <Link
                    href="?sort=date"
                    className={
                      sort === "date"
                        ? sharedStyles.controlBtnActive
                        : sharedStyles.controlBtn
                    }
                  >
                    {sort === "date" ? (
                      <>
                        Date <span className={sharedStyles.sortArrow}>↓</span>
                      </>
                    ) : (
                      "Date"
                    )}
                  </Link>
                </div>
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
                <h2
                  className={sharedStyles.sectionTitle}
                  id="expenditures-label"
                >
                  Expenditures
                </h2>
                <Suspense fallback={<SpendingByPartySkeleton />}>
                  <CommitteeExpendituresByParty committeeId={committeeId} />
                </Suspense>
              </section>
            </div>

            <Suspense>
              <CommitteeExpendituresBottomSections committeeId={committeeId} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
