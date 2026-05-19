import Link from "next/link";

import { fetchCompanyTotalSpending, fetchConstant } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import MoneyCard from "@/app/components/MoneyCard";
import {
  CompanyCategory,
  CompanyConstant,
  CompanyTotals,
} from "@/app/types/Companies";
import { Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";
import { getCompanyIdsForSector } from "@/app/utils/sector";

import listStyles from "../listStyles.module.css";
import styles from "./page.module.css";

type CompanyGroup = {
  id: string;
  total: number;
};

function CompanyListGroup({
  title,
  groups,
  companies,
  maxTotal,
}: {
  title: string;
  groups: CompanyGroup[];
  companies: Record<string, CompanyConstant>;
  maxTotal: number;
}) {
  if (groups.length === 0) {
    return null;
  }
  return (
    <>
      <h3 className={listStyles.subhead}>{title}</h3>
      {groups.map(({ id, total }) => {
        const barPct = maxTotal > 0 ? (total / maxTotal) * 100 : 0;
        let roundedTotal = Math.floor(total / 10000) * 10000;
        return (
          <div key={id} className={styles.companyRow}>
            <div className={styles.companyName} title={companies[id].name}>
              <Link href={`/2026/companies/${id}`}>{companies[id].name}</Link>
            </div>
            <div className={listStyles.barTrack}>
              <div className={listStyles.bar} style={{ width: `${barPct}%` }} />
            </div>
            <div className={listStyles.amount}>
              {humanizeRoundedCurrency(roundedTotal || total)}
            </div>
          </div>
        );
      })}
    </>
  );
}

export default async function CompanyList({ sector = "all" }: { sector?: Sector }) {
  const data = await fetchConstant<Record<string, CompanyConstant> | null>(
    "companies",
  );
  const totalsData = await fetchCompanyTotalSpending(sector);
  if (data === null) {
    return <ErrorText subject="the list of companies" />;
  }
  let totals: Record<string, any> = {};
  let grandTotal = 0;
  if (!isError(totalsData)) {
    const t = totalsData as CompanyTotals;
    totals = t.by_company;
    grandTotal = t.total;
  }

  const sectorIds = getCompanyIdsForSector(sector, data as Record<string, CompanyConstant>);

  const companyGroups: Record<string, CompanyGroup[]> = Object.values(
    data as Record<string, CompanyConstant>,
  ).filter(({ id }) => sectorIds === null || sectorIds.has(id)).reduce<Record<string, CompanyGroup[]>>(
    (acc, { category, id }) => {
      const companyGroup = { id, total: totals[id]?.total || 0 };
      if (category) {
        if (category.includes("capital" as CompanyCategory)) {
          if (category.includes("crypto" as CompanyCategory)) {
            acc["crypto-capital"].push(companyGroup);
          } else {
            acc["capital"].push(companyGroup);
          }
        } else if (category.includes("finance" as CompanyCategory)) {
          acc["finance"].push(companyGroup);
        } else if (category.includes("prediction" as CompanyCategory)) {
          acc["prediction"].push(companyGroup);
        } else if (category.includes("advocacy" as CompanyCategory)) {
          acc["advocacy"].push(companyGroup);
        } else if (category.includes("crypto" as CompanyCategory)) {
          acc["crypto"].push(companyGroup);
        }
      }
      return acc;
    },
    {
      capital: [],
      crypto: [],
      "crypto-capital": [],
      advocacy: [],
      finance: [],
      prediction: [],
    },
  );
  for (const key in companyGroups) {
    companyGroups[key] = companyGroups[key].filter((c) => c.total > 0);
    companyGroups[key].sort((a, b) => b.total - a.total);
  }

  const allCompanies = Object.values(companyGroups).flat();
  const maxTotal = Math.max(...allCompanies.map((c) => c.total), 1);
  const companyCount = allCompanies.length;

  const companies = data as Record<string, CompanyConstant>;

  return (
    <>
      <MoneyCard
        topText={`${companyCount} companies and their executives have contributed`}
        amount={humanizeRoundedCurrency(grandTotal, true)}
        bottomText="to candidates and political action committees"
        className={listStyles.centeredCard}
      />
      <CompanyListGroup
        title="Cryptocurrency companies"
        groups={companyGroups["crypto"]}
        companies={companies}
        maxTotal={maxTotal}
      />
      <CompanyListGroup
        title="Advocacy groups"
        groups={companyGroups["advocacy"]}
        companies={companies}
        maxTotal={maxTotal}
      />
      <CompanyListGroup
        title="Crypto-specific investment companies"
        groups={companyGroups["crypto-capital"]}
        companies={companies}
        maxTotal={maxTotal}
      />
      <CompanyListGroup
        title="Investment companies"
        groups={companyGroups["capital"]}
        companies={companies}
        maxTotal={maxTotal}
      />
      <CompanyListGroup
        title="Finance companies with crypto involvement"
        groups={companyGroups["finance"]}
        companies={companies}
        maxTotal={maxTotal}
      />
      <CompanyListGroup
        title="Prediction markets"
        groups={companyGroups["prediction"]}
        companies={companies}
        maxTotal={maxTotal}
      />
    </>
  );
}
