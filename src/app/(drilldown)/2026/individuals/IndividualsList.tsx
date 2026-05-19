/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import { fetchConstant, fetchIndividualTotalSpending } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import { IndividualConstant, IndividualTotals } from "@/app/types/Individuals";
import { Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";

import listStyles from "../listStyles.module.css";
import styles from "./IndividualsList.module.css";

function individualMatchesSector(individual: IndividualConstant, sector: Sector): boolean {
  if (sector === "all") {
    return true;
  }
  const s = individual.sector;
  if (!s) {
    return false;
  }
  // "tech" individuals appear in both crypto and ai views
  if (s === "tech") {
    return true;
  }
  return s === sector;
}

export default async function IndividualsList({ sector = "all" }: { sector?: Sector }) {
  const [data, totalsData] = await Promise.all([
    fetchConstant<Record<string, IndividualConstant> | null>("individuals"),
    fetchIndividualTotalSpending(),
  ]);

  if (data === null) {
    return <ErrorText subject="the list of individuals" />;
  }

  let totals: Record<string, { total: number }> = {};
  if (!isError(totalsData)) {
    totals = (totalsData as IndividualTotals).by_individual;
  }

  const individuals = Object.values(
    data as Record<string, IndividualConstant>,
  )
    .filter((individual) => individualMatchesSector(individual, sector))
    .map((individual) => ({
      ...individual,
      total: totals[individual.id]?.total || 0,
    }))
    .filter((individual) => individual.total > 0)
    .sort((a, b) => b.total - a.total);

  const maxTotal = Math.max(...individuals.map((i) => i.total), 1);

  return (
    <>
      {individuals.map((individual) => {
        const barPct = maxTotal > 0 ? (individual.total / maxTotal) * 100 : 0;
        const roundedTotal = Math.floor(individual.total / 10000) * 10000;
        return (
          <div key={individual.id} className={styles.individualRow}>
            <div className={styles.avatarWrapper}>
              <img
                src={`https://storage.googleapis.com/follow-the-crypto-misc-assets/${individual.id}.webp`}
                alt={individual.name}
                className={styles.avatar}
              />
            </div>
            <div className={styles.nameAndCompany}>
              <Link href={`/2026/individuals/${individual.id}`} className={styles.name}>
                {individual.name}
              </Link>
              {individual.company && individual.company.map((company) => (
                <span key={company} className={styles.company}>{company}</span>
              ))}
            </div>
            <div className={listStyles.barTrack}>
              <div className={listStyles.bar} style={{ width: `${barPct}%` }} />
            </div>
            <div className={listStyles.amount}>
              {humanizeRoundedCurrency(roundedTotal || individual.total)}
            </div>
          </div>
        );
      })}
    </>
  );
}
