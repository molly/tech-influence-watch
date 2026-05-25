import Image from "next/image";
import Link from "next/link";

import Breadcrumbs from "@/app/components/Breadcrumbs";
import sharedStyles from "@/app/shared.module.css";
import { Company } from "@/app/types/Companies";
import { Sector } from "@/app/types/Sector";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";
import { humanizeSector } from "@/app/utils/sector";

import styles from "./page.module.css";

export default function CompanyHeader({
  company,
  companyParam,
}: {
  company: Company;
  companyParam: string;
}) {
  return (
    <div className={sharedStyles.fullWidthHeader}>
      <section className={sharedStyles.header}>
        <Breadcrumbs crumbs={["Spending", "Companies"]} />
        <div className={styles.companyHeader}>
          <div className={styles.companyLogoWrapper}>
            <Image
              fill
              src={`https://storage.googleapis.com/follow-the-crypto-misc-assets/${companyParam}.webp`}
              alt={`${company.name} logo`}
              className={styles.companyLogoImage}
            />
          </div>
          <h1 className={`${sharedStyles.title} ${styles.companyName}`}>
            {company.name}
          </h1>
          <div className={`${styles.companyDetails}`}>
            {company.country && company.country}
            {company.relatedIndividuals.length > 0 && (
              <>
                {company.country && <span> · </span>}
                <span>Related people: </span>
                <ul className={styles.plainList}>
                  {company.relatedIndividuals.map((individual) => (
                    <li key={individual.id} className={styles.plainListItem}>
                      <Link
                        className="unstyled"
                        href={`/2026/individuals/${individual.id}`}
                      >
                        {individual.name}
                      </Link>
                      {individual.title && ` (${individual.title})`}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div
            className={`${styles.companyDescription} ${sharedStyles.headerSubtitle}`}
          >
            <span
              dangerouslySetInnerHTML={{
                __html: company.description || "",
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
