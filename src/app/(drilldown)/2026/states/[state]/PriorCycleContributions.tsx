import Link from "next/link";

import { fetchStateExpenditures } from "@/app/actions/fetch";
import {
  PopulatedStateExpenditures,
  PriorCycleDetail,
} from "@/app/types/Expenditures";
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
}: {
  stateAbbr: string;
}) {
  const data = await fetchStateExpenditures(stateAbbr);

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
    <div className={styles.priorCycleCard}>
      <h2>Contributions not tied to 2026 races</h2>
      <p>
        {formatCurrency(total, true)} of the company contributions above went to
        committees linked only to candidates not running in 2026.
      </p>
      {companies.map(([companyId, company]) => (
        <div key={companyId} className={styles.cardSection}>
          <Link href={`/2026/companies/${companyId}`}>
            <h3>{company.company_name}</h3>
          </Link>
          <b>{formatCurrency(company.total, true)}</b>
          {company.committees.map((c) => {
            const candidateList = formatCandidates(c.candidates);
            let committeeName = c.committee_name
              ? titlecaseCommittee(c.committee_name)
              : c.committee_id;
            return (
              <div key={c.committee_id} className={styles.cardSubsection}>
                <div>{committeeName}</div>
                <div className="secondary">
                  {formatCurrency(c.amount, true)}
                  {candidateList.length > 0 && (
                    <span>
                      , linked to:{" "}
                      {candidateList.map(titlecaseLastFirst).join(", ")}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
