import Link from "next/link";

import { IndividualListData } from "@/app/types/Individuals";
import { humanizeList } from "@/app/utils/humanize";

import styles from "./IndividualsList.module.css";

export default function CompanyLinks({
  individual,
  className,
  showBadge = false,
}: {
  individual: IndividualListData;
  className?: string;
  showBadge?: boolean;
}) {
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
      if (!showBadge || isOneSector || details.sector === "tech") {
        companyEls.push(link);
      } else {
        companyEls.push(
          <span key={`${individual.id}-${details.id}`}>
            {link} <span className={styles.sectorBadge}>{details.sector}</span>
          </span>,
        );
      }
    } else {
      companyEls.push(<span key={`${individual.id}-${c}`}>{c}</span>);
    }
  }
  if (!companyEls.length) {
    return null;
  }
  return (
    <span className={className}>
      {humanizeList(companyEls)}{" "}
      {showBadge && sectors.size === 1 && [...sectors][0] !== "tech" && (
        <span className={styles.sectorBadge}>{[...sectors][0]}</span>
      )}
    </span>
  );
}
