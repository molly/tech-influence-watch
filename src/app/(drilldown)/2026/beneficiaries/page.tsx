import {
  fetchBeneficiaries,
  fetchBeneficiariesOrder,
  fetchCompanyTotalSpending,
} from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import MaybeLink from "@/app/components/MaybeLink";
import Skeleton from "@/app/components/skeletons/Skeleton";
import COMMITTEES from "@/app/data/committees";
import sharedStyles from "@/app/shared.module.css";
import {
  Beneficiary,
  CandidateBeneficiary as CandidateBeneficiaryType,
  CommitteeBeneficiary as CommitteeBeneficiaryType,
} from "@/app/types/Beneficiaries";
import { CompanyTotals } from "@/app/types/Companies";
import { Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import { customMetadata } from "@/app/utils/metadata";
import { range } from "@/app/utils/range";
import { humanizeSector, parseSector } from "@/app/utils/sector";
import { titlecaseCommittee, titlecaseLastFirst } from "@/app/utils/titlecase";
import { formatCurrency } from "@/app/utils/utils";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import styles from "./beneficiaries.module.css";
import {
  applySort,
  applyTypeFilter,
  findTopByType,
  getCandidateDescription,
  getDescription,
  getPartyBorderClass,
  getPartyCode,
} from "./beneficiaries.utils";
import BeneficiariesControls from "./BeneficiariesControls";
import BeneficiariesHeader from "./BeneficiariesHeader";
import BeneficiariesSidebar from "./BeneficiariesSidebar";
import TopCard, { TopCardSkeleton } from "./TopCard";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string }>;
}): Promise<Metadata> {
  const { sector: rawSector } = await searchParams;
  const sector = parseSector(rawSector);
  return customMetadata({
    title: "Beneficiaries",
    description: `Beneficiaries of ${humanizeSector(sector, { context: "industry", lowercase: true })} spending`,
  });
}
function PartyBorderCell({ partyCode }: { partyCode: string }) {
  const className = getPartyBorderClass(partyCode);
  return (
    <td className={styles.partyBorderCell}>
      <span className={className} />
    </td>
  );
}

function RecipientTableSkeleton() {
  return range(10).map((ind) => (
    <tr className={styles.beneficiaryRow} key={`skeleton-recipient-row-${ind}`}>
      <PartyBorderCell partyCode={"U"} />
      <td className={styles.recipientCell}>
        <Skeleton height="1rem" randWidth={[6, 14]} />
        <Skeleton width="12rem" height="1rem" />
      </td>
      <td className="center-cell">–</td>
      <td className={styles.numberCellSkeleton}>
        <Skeleton width="2rem" height="1rem" />
      </td>
    </tr>
  ));
}

function TopCandidatesSkeleton() {
  return range(10).map((ind) => (
    <tr
      className={styles.beneficiaryRow}
      key={`skeleton-candidates-row-${ind}`}
    >
      <PartyBorderCell partyCode={"U"} />
      <td className={styles.recipientCell}>
        <Skeleton height="1rem" randWidth={[6, 14]} />
        <Skeleton width="12rem" height="1rem" />
      </td>
      <td className="center-cell">–</td>
      <td className={styles.numberCellSkeleton}>
        <Skeleton width="2rem" height="1rem" />
      </td>
    </tr>
  ));
}

function CommitteeRow({
  id,
  beneficiary,
}: {
  id: string;
  beneficiary: CommitteeBeneficiaryType;
}) {
  const partyCode = getPartyCode(beneficiary);
  const partyLetter = partyCode ? partyCode[0] : "";
  const partyClass = partyCode ? partyCode.toLowerCase() : "";
  const name = beneficiary.committee_details?.committee_name
    ? titlecaseCommittee(beneficiary.committee_details.committee_name)
    : id;
  const description = getDescription(beneficiary);
  const isTracked = id in COMMITTEES;

  return (
    <tr className={styles.beneficiaryRow}>
      <PartyBorderCell partyCode={partyCode} />
      <td className={styles.recipientCell}>
        <MaybeLink
          href={id in COMMITTEES ? `/2026/committees/${id}` : undefined}
        >
          <span className={styles.recipientName}>
            {name}
            {isTracked && (
              <span className={sharedStyles.sectorBadge}>crypto</span>
            )}
          </span>
        </MaybeLink>
        {description && (
          <span className={styles.recipientDescription}>{description}</span>
        )}
      </td>
      <td className={`center-cell ${partyClass}`}>{partyLetter || "–"}</td>
      <td className="number-cell">{formatCurrency(beneficiary.total, true)}</td>
    </tr>
  );
}

function CandidateRow({
  beneficiary,
}: {
  id: string;
  beneficiary: CandidateBeneficiaryType;
}) {
  const partyCode = getPartyCode(beneficiary);
  const partyLetter = partyCode ? partyCode[0] : "";
  const partyClass = partyCode ? partyCode.toLowerCase() : "";
  const name = titlecaseLastFirst(beneficiary.candidate_details.name);
  const description = getCandidateDescription(beneficiary);

  const raceHref = beneficiary.candidate_details.race_link
    ? `/2026${beneficiary.candidate_details.race_link}`
    : undefined;

  return (
    <tr className={styles.beneficiaryRow}>
      <PartyBorderCell partyCode={partyCode} />
      <td className={styles.recipientCell}>
        <MaybeLink href={raceHref}>
          <span className={styles.recipientName}>{name}</span>
        </MaybeLink>
        {description && (
          <span className={styles.recipientDescription}>{description}</span>
        )}
      </td>
      <td className={`center-cell ${partyClass}`}>{partyLetter}</td>
      <td className="number-cell">{formatCurrency(beneficiary.total, true)}</td>
    </tr>
  );
}

const PAGE_SIZE = 50;

function buildPageHref(
  p: number,
  params: { sector?: string; sort?: string; type?: string },
) {
  const sp = new URLSearchParams();
  if (params.sector) sp.set("sector", params.sector);
  if (params.sort && params.sort !== "total") sp.set("sort", params.sort);
  if (params.type && params.type !== "all") sp.set("type", params.type);
  if (p > 1) sp.set("page", String(p));
  return `?${sp.toString()}`;
}

function Pagination({
  page,
  totalPages,
  params,
}: {
  page: number;
  totalPages: number;
  params: { sector?: string; sort?: string; type?: string };
}) {
  if (totalPages <= 1) {
    return null;
  }
  return (
    <div className={styles.pagination}>
      {page > 1 ? (
        <Link href={buildPageHref(page - 1, params)} className={styles.pageBtn}>
          ← Prev
        </Link>
      ) : (
        <span className={`${styles.pageBtn} ${styles.pageBtnDisabled}`}>
          ← Prev
        </span>
      )}
      <span className={styles.pageInfo}>
        {page} / {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={buildPageHref(page + 1, params)} className={styles.pageBtn}>
          Next →
        </Link>
      ) : (
        <span className={`${styles.pageBtn} ${styles.pageBtnDisabled}`}>
          Next →
        </span>
      )}
    </div>
  );
}

export default async function BeneficiariesList({
  searchParams,
}: {
  searchParams: Promise<{
    sector?: string;
    sort?: string;
    type?: string;
    page?: string;
  }>;
}) {
  const {
    sector: rawSector,
    sort = "total",
    type = "all",
    page: rawPage = "1",
  } = await searchParams;
  const page = Math.max(1, parseInt(rawPage, 10) || 1);
  const sector = parseSector(rawSector) as Sector;

  const [beneficiariesData, beneficiariesOrderData, companyTotalsData] =
    await Promise.all([
      fetchBeneficiaries(sector),
      fetchBeneficiariesOrder(sector),
      fetchCompanyTotalSpending(sector),
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

  // Apply filter then sort for the main table
  const filtered = applyTypeFilter(allOrder, beneficiaries, type);
  const sorted = applySort(filtered, beneficiaries, sort);
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const clampedPage = Math.min(page, Math.max(1, totalPages));
  const paginated = sorted.slice(
    (clampedPage - 1) * PAGE_SIZE,
    clampedPage * PAGE_SIZE,
  );

  return (
    <>
      <BeneficiariesHeader
        sector={sector}
        totalSpending={companyTotals.total}
        numBeneficiaries={allOrder.length}
      />
      <main className={`${sharedStyles.main} ${styles.columns}`}>
        <div className={styles.mainColumn}>
          <section>
            <h2 className={sharedStyles.sectionTitle}>
              Top recipient in each category
            </h2>
            <div className={styles.topCardsGrid}>
              {topCandidate && (
                <Suspense fallback={<TopCardSkeleton />}>
                  <TopCard
                    label="Top Candidate"
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
                    label="Top Party Committee"
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
            <Suspense fallback={null}>
              <BeneficiariesControls
                sort={sort}
                type={type}
                total={sorted.length}
                page={clampedPage}
                pageSize={PAGE_SIZE}
              />
            </Suspense>
            <table className={styles.beneficiariesTable}>
              <thead>
                <tr className={styles.tableHeaderRow}>
                  <th />
                  <th className="text-cell">Recipient</th>
                  <th className="center-cell">Party</th>
                  <th className="number-cell">Total industry contributions</th>
                </tr>
              </thead>
              <tbody>
                <Suspense fallback={<RecipientTableSkeleton />}>
                  {paginated.map((id) => {
                    const beneficiary = beneficiaries[id];
                    if (!beneficiary) {
                      return null;
                    }
                    if (beneficiary.type === "committee") {
                      return (
                        <CommitteeRow
                          key={id}
                          id={id}
                          beneficiary={beneficiary}
                        />
                      );
                    }
                    if (!beneficiary.candidate_details) {
                      return null;
                    }
                    return (
                      <CandidateRow
                        key={id}
                        id={id}
                        beneficiary={beneficiary}
                      />
                    );
                  })}
                </Suspense>
              </tbody>
            </table>
            <Suspense fallback={null}>
              <Pagination
                page={clampedPage}
                totalPages={totalPages}
                params={{ sector: rawSector, sort, type }}
              />
            </Suspense>
          </section>
        </div>

        <BeneficiariesSidebar
          sector={sector}
          beneficiaries={beneficiaries}
          allOrder={allOrder}
        />
      </main>
    </>
  );
}
