import { Metadata } from "next";
import Link from "next/link";

import {
  fetchBeneficiaries,
  fetchTrumpCommittees,
} from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import tableStyles from "@/app/components/tables.module.css";
import COMMITTEES from "@/app/data/committees";
import { TRUMP_CANDIDATE_ID } from "@/app/data/trump";
import {
  type Beneficiary,
  type CompanyContributionGroup,
} from "@/app/types/Beneficiaries";
import { isError } from "@/app/utils/errors";
import { customMetadata } from "@/app/utils/metadata";
import { titlecaseCommittee } from "@/app/utils/titlecase";
import { formatCurrency } from "@/app/utils/utils";

import styles from "./page.module.css";

export const metadata: Metadata = customMetadata({
  title: "Contributions to Trump",
  description:
    "Crypto industry contributions to Donald Trump's campaign committees and affiliated organizations.",
});

export default async function TrumpContributionsPage() {
  const [beneficiariesData, trumpCommitteesData] = await Promise.all([
    fetchBeneficiaries(),
    fetchTrumpCommittees(),
  ]);

  if (isError(beneficiariesData)) {
    return <ErrorText subject="contributions data" />;
  }

  const beneficiaries = beneficiariesData as Record<string, Beneficiary>;
  const trumpCommitteeIds = new Set<string>([
    TRUMP_CANDIDATE_ID,
    ...(trumpCommitteesData?.ids ?? []),
  ]);
  const trumpCommitteeNames: Record<string, string> = trumpCommitteesData?.names ?? {};

  // Filter beneficiaries to Trump-affiliated committees/candidate.
  const trumpBeneficiaries = Object.fromEntries(
    Object.entries(beneficiaries).filter(([id]) => trumpCommitteeIds.has(id)),
  );

  const grandTotal = Object.values(trumpBeneficiaries).reduce(
    (sum, b) => sum + b.total,
    0,
  );

  // Aggregate contributions by donor (company_id) across all Trump committees.
  const byDonorMap = new Map<
    string,
    { company_name: string; total: number }
  >();
  for (const beneficiary of Object.values(trumpBeneficiaries)) {
    for (const group of beneficiary.contributions as CompanyContributionGroup[]) {
      const existing = byDonorMap.get(group.company_id);
      if (existing) {
        existing.total += group.total;
      } else {
        byDonorMap.set(group.company_id, {
          company_name: group.company_name,
          total: group.total,
        });
      }
    }
  }
  const sortedDonors = [...byDonorMap.entries()].sort(
    (a, b) => b[1].total - a[1].total,
  );

  // Build per-committee breakdown from by_committee field on the candidate beneficiary.
  // The backend collapses all Trump PAC contributions under P80001571, but records
  // per-committee totals in by_committee: { committee_id: total }.
  const trumpBeneficiary = trumpBeneficiaries[TRUMP_CANDIDATE_ID];
  const byCommitteeEntries = trumpBeneficiary?.by_committee
    ? Object.entries(trumpBeneficiary.by_committee)
    : [];
  const byCommittee = byCommitteeEntries
    .map(([id, total]) => ({
      id,
      name:
        trumpCommitteeNames[id] ??
        trumpBeneficiary?.committee_details?.committee_name ??
        id,
      total,
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <div className="single-column-page">
      <section className={styles.heroSection}>
        <h1>Contributions to Donald Trump</h1>
        <p className="secondary">
          Crypto industry contributions to Donald Trump&apos;s campaign
          committees and affiliated organizations, as reported to the FEC.
        </p>
        <div className={styles.totalAmount}>{formatCurrency(grandTotal, true)}</div>
        <div className="secondary">total from tracked crypto companies and individuals</div>
      </section>

      <section className={styles.card}>
        <h2 className={tableStyles.tableCardContent}>By donor</h2>
        {sortedDonors.length === 0 ? (
          <p className={styles.emptyMessage}>No contributions found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th className="text-cell">Donor</th>
                <th className="number-cell">Total</th>
              </tr>
            </thead>
            <tbody>
              {sortedDonors.map(([companyId, donor]) => (
                <tr key={companyId} className={tableStyles.beneficiariesRow}>
                  <td>
                    {companyId in COMMITTEES ? (
                      <Link href={`/2026/committees/${companyId}`}>
                        {donor.company_name}
                      </Link>
                    ) : (
                      <Link href={`/2026/companies/${companyId}`}>
                        {donor.company_name}
                      </Link>
                    )}
                  </td>
                  <td className="number-cell">
                    {formatCurrency(donor.total, true)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className={styles.card}>
        <h2 className={tableStyles.tableCardContent}>By committee</h2>
        {byCommittee.length === 0 ? (
          <p className={styles.emptyMessage}>No contributions found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th className="text-cell">Committee</th>
                <th className="number-cell">Total</th>
              </tr>
            </thead>
            <tbody>
              {byCommittee.map(({ id, name, total }) => (
                <tr key={id} className={tableStyles.beneficiariesRow}>
                  <td>
                    {id in COMMITTEES ? (
                      <Link href={`/2026/committees/${id}`}>
                        {titlecaseCommittee(name)}
                      </Link>
                    ) : (
                      titlecaseCommittee(name)
                    )}
                  </td>
                  <td className="number-cell">{formatCurrency(total, true)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
