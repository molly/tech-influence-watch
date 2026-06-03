import { Metadata } from "next";
import { Suspense } from "react";

import { fetchCommitteeDetails } from "@/app/actions/fetch";
import { MoneyCardSkeleton } from "@/app/components/MoneyCard";
import TotalsRow from "@/app/components/TotalsRow";
import COMMITTEES from "@/app/data/committees";
import sharedStyles from "@/app/shared.module.css";
import { CommitteeDetails } from "@/app/types/Committee";
import { isSuperOrHybridPac } from "@/app/utils/committees";
import { isError } from "@/app/utils/errors";
import { customMetadata } from "@/app/utils/metadata";

import CommitteeDetailsSection, {
  CommitteeDetailsSkeleton,
} from "./CommitteeDetailsSection";
import CommitteeDisbursements from "./CommitteeDisbursements";
import CommitteeExpendituresByCandidate from "./CommitteeExpendituresByCandidate";
import CommitteeExpendituresByParty, {
  CommitteeExpendituresByPartySkeleton,
} from "./CommitteeExpendituresByParty";
import CommitteeExpendituresTotal from "./CommitteeExpendituresTotal";
import CommitteeRaised from "./CommitteeRaised";
import CommitteeRecentExpenditures from "./CommitteeRecentExpenditures";
import CommitteeTransfers from "./CommitteeTransfers";
import CommitteeTransfersByParty from "./CommitteeTransfersByParty";
import styles from "./page.module.css";
import TopDonors, { TopDonorsSkeleton } from "./TopDonors";
import TopDonorsSortControl, {
  TopDonorsSortLinks,
} from "./TopDonorsSortControl";

export function generateStaticParams() {
  return Object.keys(COMMITTEES).map((committeeId) => ({ committeeId }));
}

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
        <Suspense>
          <CommitteeExpendituresByCandidate committeeId={committeeId} />
        </Suspense>
      </section>
      <CommitteeRecentExpenditures committeeId={committeeId} />
    </>
  );
}

async function CommitteeRightColumn({ committeeId }: { committeeId: string }) {
  const committeeData = await fetchCommitteeDetails(committeeId);
  if (isError(committeeData)) {
    return null;
  }
  const committee = committeeData as CommitteeDetails;

  // Only committees that can make independent expenditures (super PACs and
  // hybrid PACs) get the expenditures breakdown. For everyone else, their
  // transfers to other committees are the more meaningful activity.
  if (!isSuperOrHybridPac(committee.committee_type)) {
    return (
      <>
        {committee.transfers_by_party && (
          <section className={sharedStyles.section}>
            <CommitteeTransfersByParty committeeId={committeeId} />
          </section>
        )}
        <section className={sharedStyles.section}>
          <CommitteeTransfers committeeId={committeeId} />
        </section>
      </>
    );
  }

  return (
    <>
      <section className={sharedStyles.section}>
        <Suspense fallback={<CommitteeExpendituresByPartySkeleton />}>
          <CommitteeExpendituresByParty committeeId={committeeId} />
        </Suspense>
      </section>
      <Suspense>
        <CommitteeExpendituresBottomSections committeeId={committeeId} />
      </Suspense>
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
}: {
  params: Promise<{ committeeId: string }>;
}) {
  const { committeeId } = await params;

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
            <Suspense fallback={<TopDonorsSortLinks isDate={false} />}>
              <TopDonorsSortControl />
            </Suspense>
            <Suspense fallback={<TopDonorsSkeleton />}>
              <TopDonors committeeId={committeeId} />
            </Suspense>
          </section>
          <div className={styles.rightColumn}>
            <Suspense
              fallback={
                <section className={sharedStyles.section}>
                  <CommitteeExpendituresByPartySkeleton />
                </section>
              }
            >
              <CommitteeRightColumn committeeId={committeeId} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
