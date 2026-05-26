import Image from "next/image";
import Link from "next/link";

import Skeleton from "@/app/components/skeletons/Skeleton";
import { IndividualListData } from "@/app/types/Individuals";
import { humanizeList, humanizeRoundedCurrency } from "@/app/utils/humanize";
import { range } from "@/app/utils/range";

import listStyles from "../listStyles.module.css";
import styles from "./IndividualsList.module.css";

export function IndividualsListSkeleton() {
  return (
    <div className={styles.individualsList}>
      <div className={styles.columnHeaders}>
        <div className={listStyles.columnHeaderLabel}>Individual</div>
        <div className={listStyles.columnHeaderLabel}>Contribution total</div>
        <div className={listStyles.columnHeaderLabelRight}>Amount</div>
      </div>
      {range(20).map((x) => (
        <div key={`skeleton-${x}`} className={styles.individualRow}>
          <div className={styles.nameCol}>
            <div className={styles.avatarWrapper}>
              <Skeleton width="2rem" height="2rem" />
            </div>
            <div className={styles.nameAndCompany}>
              <Skeleton width="10rem" />
              <Skeleton width="8rem" />
            </div>
          </div>
          <Skeleton width="100%" />
          <Skeleton width="5rem" />
        </div>
      ))}
    </div>
  );
}

function CompanyLinks({ individual }: { individual: IndividualListData }) {
  const companyEls = [];
  if (!individual.company || individual.company.length === 0) {
    return null;
  }
  const sectors = new Set(
    individual.companyDetails
      .map((cd) => cd.sector)
      .filter((s) => s !== undefined),
  );
  const isOneSector = sectors.size === 1;
  for (let c of individual.company) {
    const details = individual.companyDetails.find((cd) => cd.name === c);
    if (details) {
      const link = (
        <Link
          className="unstyled"
          href={`/2026/companies/${details.id}`}
          key={`${individual.id}-${details.id}`}
        >
          {details.name}
        </Link>
      );
      if (isOneSector || details.sector === "tech") {
        companyEls.push(link);
      } else {
        companyEls.push(
          <span className={styles.companyWithBadge}>
            {link} <span className={styles.sectorBadge}>{details.sector}</span>
          </span>,
        );
      }
    } else {
      companyEls.push(c);
    }
  }
  if (!companyEls.length) {
    return null;
  }
  return (
    <span className={styles.company}>
      {humanizeList(companyEls)}{" "}
      {sectors.size === 1 && [...sectors][0] !== "tech" && (
        <span className={styles.sectorBadge}>{[...sectors][0]}</span>
      )}
    </span>
  );
}

export default async function IndividualsList({
  individuals,
}: {
  individuals: IndividualListData[];
}) {
  const sectionTotal = individuals.reduce((sum, i) => sum + i.total, 0);

  return (
    <div className={styles.individualsList}>
      <div className={styles.columnHeaders}>
        <div className={listStyles.columnHeaderLabel}>Individual</div>
        <div className={listStyles.columnHeaderLabel}>Contribution total</div>
        <div className={listStyles.columnHeaderLabelRight}>Amount</div>
      </div>
      {individuals.map((individual) => {
        const barPct =
          sectionTotal > 0 ? (individual.total / sectionTotal) * 100 : 0;
        const pctDisplay = Math.round(barPct);
        return (
          <div key={individual.id} className={styles.individualRow}>
            <div className={styles.nameCol}>
              <div className={styles.avatarWrapper}>
                <Image
                  fill
                  sizes="2rem"
                  src={`https://storage.googleapis.com/follow-the-crypto-misc-assets/${individual.id}.webp`}
                  alt={individual.name}
                  className={styles.avatar}
                />
              </div>
              <div className={styles.nameAndCompany}>
                <Link
                  href={`/2026/individuals/${individual.id}`}
                  className="unstyled"
                >
                  {individual.name}
                </Link>
                {individual.company && (
                  <span className={styles.companyAndTitle}>
                    {individual.title && (
                      <div className={styles.title}>{individual.title}</div>
                    )}
                    {!individual.title && (
                      <span className={styles.associatedWith}>
                        associated with{" "}
                      </span>
                    )}
                    <CompanyLinks individual={individual} />
                  </span>
                )}
              </div>
            </div>
            <div className={listStyles.barTrack}>
              <div
                className={listStyles.barRaised}
                style={{ width: `${barPct}%` }}
              />
            </div>
            <div className={listStyles.amount}>
              {humanizeRoundedCurrency(individual.total, true, 2)}
              <span className={listStyles.pct}> ({pctDisplay}%)</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
