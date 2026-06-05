import type { Metadata } from "next";
import { Suspense } from "react";

import {
  fetchBeneficiaries,
  fetchBeneficiariesOrder,
  fetchCompanyTotalSpending,
  fetchConstant,
} from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import sharedStyles from "@/app/shared.module.css";
import { Beneficiary } from "@/app/types/Beneficiaries";
import { CommitteeConstant } from "@/app/types/Committee";
import { CompanyTotals } from "@/app/types/Companies";
import { Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import { customMetadata } from "@/app/utils/metadata";
import { humanizeSector } from "@/app/utils/sector";

import styles from "./beneficiaries.module.css";
import { findTopByType } from "./beneficiaries.utils";
import BeneficiariesHeader from "./BeneficiariesHeader";
import BeneficiariesList from "./BeneficiariesList";
import BeneficiariesSidebar from "./BeneficiariesSidebar";
import {
  BENEFICIARIES_PAGE_SIZE,
  BeneficiariesTableHeader,
  BeneficiaryRows,
} from "./BeneficiaryRows";
import TopCard, { TopCardSkeleton } from "./TopCard";

export function beneficiariesMetadata(sector: Sector): Metadata {
  return customMetadata({
    title: "Beneficiaries",
    description: `Beneficiaries of ${humanizeSector(sector, { context: "industry", lowercase: true })} spending`,
  });
}

export default async function BeneficiariesView({
  sector,
}: {
  sector: Sector;
}) {
  const [
    beneficiariesData,
    beneficiariesOrderData,
    companyTotalsData,
    committeeConstants,
  ] = await Promise.all([
    fetchBeneficiaries(sector),
    fetchBeneficiariesOrder(sector),
    fetchCompanyTotalSpending(sector),
    fetchConstant<Record<string, CommitteeConstant>>("committees"),
  ]);

  if (
    isError(beneficiariesData) ||
    isError(beneficiariesOrderData) ||
    isError(companyTotalsData)
  ) {
    return <ErrorText subject="the list of beneficiaries" />;
  }

  const beneficiaries = beneficiariesData as Record<string, Beneficiary>;
  const allOrder = beneficiariesOrderData as string[];
  const companyTotals = companyTotalsData as CompanyTotals;

  // Find top of each category for header cards (from total-sorted order)
  const topCandidate = findTopByType(allOrder, beneficiaries, "candidate");
  const topPac = findTopByType(allOrder, beneficiaries, "pac");
  const topParty = findTopByType(allOrder, beneficiaries, "party");

  return (
    <>
      <BeneficiariesHeader
        sector={sector}
        totalSpending={companyTotals.fec_total}
        numBeneficiaries={allOrder.length}
      />
      <div className={`${sharedStyles.main} ${sharedStyles.columns}`}>
        <div className={sharedStyles.mainColumn}>
          <section>
            <h2 className={sharedStyles.sectionTitle}>
              Top recipient in each category
            </h2>
            <div className={styles.topCardsGrid}>
              {topCandidate && (
                <Suspense fallback={<TopCardSkeleton />}>
                  <TopCard
                    label="Top candidate"
                    id={topCandidate.id}
                    beneficiary={topCandidate.beneficiary}
                  />
                </Suspense>
              )}
              {topPac && (
                <Suspense fallback={<TopCardSkeleton />}>
                  <TopCard
                    label="Top PAC"
                    id={topPac.id}
                    beneficiary={topPac.beneficiary}
                  />
                </Suspense>
              )}
              {topParty && (
                <Suspense fallback={<TopCardSkeleton />}>
                  <TopCard
                    label="Top party committee"
                    id={topParty.id}
                    beneficiary={topParty.beneficiary}
                  />
                </Suspense>
              )}
            </div>
          </section>

          <section>
            <div className={styles.allRecipientsHeader}>
              <h2 className={styles.allRecipientsTitle}>All recipients</h2>
            </div>
            <Suspense
              fallback={
                <table className={styles.beneficiariesTable}>
                  <BeneficiariesTableHeader />
                  <tbody>
                    <BeneficiaryRows
                      ids={allOrder.slice(0, BENEFICIARIES_PAGE_SIZE)}
                      beneficiaries={beneficiaries}
                      committeeConstants={committeeConstants}
                    />
                  </tbody>
                </table>
              }
            >
              <BeneficiariesList
                beneficiaries={beneficiaries}
                allOrder={allOrder}
                committeeConstants={committeeConstants}
              />
            </Suspense>
          </section>
        </div>

        <BeneficiariesSidebar
          sector={sector}
          beneficiaries={beneficiaries}
          allOrder={allOrder}
          max={companyTotals.fec_total}
        />
      </div>
    </>
  );
}
