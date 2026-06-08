import Image from "next/image";
import Link from "next/link";

import Skeleton from "@/app/components/skeletons/Skeleton";
import SourceBar, {
  SourceBarItem,
  SourceBarSkeleton,
} from "@/app/components/SourceBar";
import { IndividualListData } from "@/app/types/Individuals";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";
import { range } from "@/app/utils/range";

import listStyles from "../listStyles.module.css";
import CompanyLinks from "./CompanyLinks";
import styles from "./IndividualsList.module.css";

function lastName(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts[parts.length - 1];
}

export function IndividualsListSkeleton() {
  return (
    <div className={styles.individualsList}>
      <SourceBarSkeleton />
      <div className={styles.table}>
        <div className={styles.columnHeaders}>
          <div className={listStyles.columnHeaderLabel}>Individual</div>
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
            <Skeleton width="5rem" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function IndividualsList({
  individuals,
}: {
  individuals: IndividualListData[];
}) {
  const combinedTotal = individuals.reduce((sum, i) => sum + i.total, 0);

  const sourceItems: SourceBarItem[] = individuals.map((individual) => ({
    key: individual.id,
    segmentLabel: lastName(individual.name),
    captionLabel: individual.name,
    total: individual.total,
  }));

  return (
    <div className={styles.individualsList}>
      <SourceBar
        items={sourceItems}
        combinedTotal={combinedTotal}
        noun={{ singular: "donor", plural: "donors" }}
        totalLabel="all tracked personal contributions"
      />
      <div className={styles.table}>
        <div className={styles.columnHeaders}>
          <div className={listStyles.columnHeaderLabel}>Individual</div>
          <div className={listStyles.columnHeaderLabelRight}>Amount</div>
        </div>
        {individuals.map((individual) => {
          const pctDisplay =
            combinedTotal > 0
              ? Math.round((individual.total / combinedTotal) * 100)
              : 0;
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
                      <CompanyLinks
                        individual={individual}
                        className={styles.company}
                        showBadge={true}
                      />
                    </span>
                  )}
                </div>
              </div>
              <div className={listStyles.amount}>
                {humanizeRoundedCurrency(individual.total, true, 2)}
                {pctDisplay > 0 && (
                  <span className={listStyles.pct}> ({pctDisplay}%)</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
