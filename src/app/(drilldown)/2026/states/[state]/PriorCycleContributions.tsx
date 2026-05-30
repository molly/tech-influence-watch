import Link from "next/link";

import { fetchStateExpenditures } from "@/app/actions/fetch";
import sharedStyles from "@/app/shared.module.css";
import {
  PopulatedStateExpenditures,
  PriorCycleDetail,
} from "@/app/types/Expenditures";
import { Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import { titlecaseCommittee, titlecaseLastFirst } from "@/app/utils/titlecase";
import { formatCurrency } from "@/app/utils/utils";

import styles from "./page.module.css";

function groupByCompany(details: PriorCycleDetail[]) {
  const map = new Map<
    string,
    {
      company_name: string;
      total: number;
      committees: {
        committee_id: string;
        committee_name: string;
        amount: number;
        candidates: PriorCycleDetail["candidates"];
      }[];
    }
  >();

  for (const detail of details) {
    if (!map.has(detail.company_id)) {
      map.set(detail.company_id, {
        company_name: detail.company_name,
        total: 0,
        committees: [],
      });
    }
    const entry = map.get(detail.company_id)!;
    entry.total = Math.round((entry.total + detail.amount) * 100) / 100;
    entry.committees.push({
      committee_id: detail.committee_id,
      committee_name: detail.committee_name,
      amount: detail.amount,
      candidates: detail.candidates,
    });
  }

  return Array.from(map.entries()).sort((a, b) => b[1].total - a[1].total);
}

function formatCandidates(candidates: PriorCycleDetail["candidates"]) {
  return candidates.map((c) => {
    const years =
      c.election_years.length > 0 ? ` (${c.election_years.join(", ")})` : "";
    return `${c.name}${years}`;
  });
}

export default async function PriorCycleContributions({
  stateAbbr,
  sector,
}: {
  stateAbbr: string;
  sector: Sector;
}) {
  const data = await fetchStateExpenditures(stateAbbr, sector);

  if (isError(data)) {
    return null;
  }

  const expenditures = data as PopulatedStateExpenditures;
  const details = expenditures.prior_cycle_details;
  const total = expenditures.prior_cycle_companies_total;

  if (!details || !total || total <= 0) {
    return null;
  }

  const companies = groupByCompany(details);

  return (
    <div className={sharedStyles.section}>
      <h2 className={sharedStyles.sectionTitle}>
        Contributions not tied to 2026 races
      </h2>
      <p className={sharedStyles.subtitle}>
        <span className="bold">{formatCurrency(total, true)}</span> of the
        direct contributions above went to committees linked only to candidates
        not running in 2026.
      </p>
      {companies.map(([companyId, company]) => (
        <div key={companyId} className={styles.companyGroup}>
          <div className={styles.companyGroupHeader}>
            <Link
              href={`/2026/companies/${companyId}`}
              className={styles.companyGroupName}
            >
              {company.company_name}
            </Link>
            <span className={styles.companyGroupAmount}>
              {formatCurrency(company.total, true)}
            </span>
          </div>
          <ul className={styles.priorCycleContributions}>
            {company.committees.map((c) => {
              const candidateList = formatCandidates(c.candidates);
              const committeeName = c.committee_name
                ? titlecaseCommittee(c.committee_name)
                : c.committee_id;
              return (
                <li
                  key={c.committee_id}
                  className={styles.priorCycleContribution}
                >
                  <span className={styles.contributionLeft}>
                    <span className={styles.contributionName}>
                      {committeeName}
                    </span>
                    {candidateList.length > 0 && (
                      <span className="secondary">
                        {" "}
                        — linked to:{" "}
                        {candidateList.map(titlecaseLastFirst).join(", ")}
                      </span>
                    )}
                  </span>
                  <span className={styles.contributionRight}>
                    <span className={styles.contributionAmount}>
                      {formatCurrency(c.amount, true)}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
