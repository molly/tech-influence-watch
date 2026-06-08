import Link from "next/link";

import { fetchStateExpenditures } from "@/app/actions/fetch";
import sharedStyles from "@/app/shared.module.css";
import {
  PopulatedStateExpenditures,
  PriorCycleDetail,
} from "@/app/types/Expenditures";
import { Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import { titlecaseLastFirst } from "@/app/utils/titlecase";
import { formatCurrency } from "@/app/utils/utils";

import styles from "./page.module.css";

function round(amount: number) {
  return Math.round(amount * 100) / 100;
}

// Collapse FEC name variants of the same person to a stable identity. The same
// candidate can appear under several candidate IDs with differently-formatted
// names (e.g. "GILLIBRAND, KIRSTEN" vs "GILLIBRAND, KIRSTEN ELIZABETH MRS."),
// so we key on last name plus the first given-name token.
function candidateIdentity(name: string) {
  const [last, rest = ""] = name.toUpperCase().split(",");
  const first = rest.trim().split(/\s+/)[0] || "";
  return `${last.trim()}|${first}`;
}

// Dedupe a committee's candidates by identity, keeping the cleanest (shortest)
// name variant and the union of their election years.
function resolveCandidates(candidates: PriorCycleDetail["candidates"]) {
  const byIdentity = new Map<string, { name: string; years: number[] }>();
  for (const c of candidates) {
    if (!c.name) {
      continue;
    }
    const id = candidateIdentity(c.name);
    const existing = byIdentity.get(id);
    if (!existing) {
      byIdentity.set(id, { name: c.name, years: [...c.election_years] });
    } else {
      if (c.name.length < existing.name.length) {
        existing.name = c.name;
      }
      existing.years.push(...c.election_years);
    }
  }
  const ids = Array.from(byIdentity.keys()).sort();
  return {
    key: ids.join(" & "),
    names: ids.map((id) => byIdentity.get(id)!.name),
    years: Array.from(
      new Set(ids.flatMap((id) => byIdentity.get(id)!.years)),
    ).sort((a, b) => a - b),
  };
}

function groupByCandidate(details: PriorCycleDetail[]) {
  const map = new Map<
    string,
    {
      candidateNames: string[];
      election_years: number[];
      total: number;
      companies: Map<string, { company_name: string; amount: number }>;
    }
  >();

  for (const detail of details) {
    const resolved = resolveCandidates(detail.candidates);
    const key = resolved.key || detail.committee_name || detail.committee_id;
    const names = resolved.names.length
      ? resolved.names
      : [detail.committee_name || detail.committee_id];

    if (!map.has(key)) {
      map.set(key, {
        candidateNames: names,
        election_years: [],
        total: 0,
        companies: new Map(),
      });
    }
    const entry = map.get(key)!;
    entry.total = round(entry.total + detail.amount);
    entry.election_years = Array.from(
      new Set([...entry.election_years, ...resolved.years]),
    ).sort((a, b) => a - b);

    if (!entry.companies.has(detail.company_id)) {
      entry.companies.set(detail.company_id, {
        company_name: detail.company_name,
        amount: 0,
      });
    }
    const company = entry.companies.get(detail.company_id)!;
    company.amount = round(company.amount + detail.amount);
  }

  return Array.from(map.entries())
    .map(([key, entry]) => ({
      key,
      candidateNames: entry.candidateNames,
      election_years: entry.election_years,
      total: entry.total,
      companies: Array.from(entry.companies.entries()).sort(
        (a, b) => b[1].amount - a[1].amount,
      ),
    }))
    .sort((a, b) => b.total - a.total);
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

  const candidates = groupByCandidate(details);

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
      {candidates.map((candidate) => {
        const name = candidate.candidateNames
          .map(titlecaseLastFirst)
          .join(" & ");
        const years =
          candidate.election_years.length > 0
            ? ` (${candidate.election_years.join(", ")})`
            : "";
        return (
          <div key={candidate.key} className={styles.companyGroup}>
            <div className={styles.companyGroupHeader}>
              <span className={styles.companyGroupName}>
                {name}
                {years && <span className="secondary">{years}</span>}
              </span>
              <span className={styles.companyGroupAmount}>
                {formatCurrency(candidate.total, true)}
              </span>
            </div>
            <ul className={styles.priorCycleContributions}>
              {candidate.companies.map(([companyId, company]) => (
                <li
                  key={companyId}
                  className={styles.priorCycleContribution}
                >
                  <span className={styles.contributionLeft}>
                    <Link
                      href={`/2026/companies/${companyId}`}
                      className={styles.contributionName}
                    >
                      {company.company_name}
                    </Link>
                  </span>
                  <span className={styles.contributionRight}>
                    <span className={styles.contributionAmount}>
                      {formatCurrency(company.amount, true)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
