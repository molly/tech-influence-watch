import Link from "next/link";

import { fetchCompany } from "@/app/actions/fetch";
import sharedStyles from "@/app/shared.module.css";
import { Company, CompanyConstant } from "@/app/types/Companies";
import { isError } from "@/app/utils/errors";
import { getFirstLastName } from "@/app/utils/names";

import AssociatedCompanies from "./AssociatedCompanies";

export default async function RelatedIndividual({
  individualId,
  companyIds,
  companyConstants,
}: {
  individualId: string;
  companyIds?: string[];
  companyConstants: Record<string, CompanyConstant>;
}) {
  if (!companyIds || companyIds.length === 0) {
    return null;
  }
  const companiesData = await Promise.all(companyIds.map(fetchCompany));
  if (companiesData.some(isError)) {
    return null;
  }
  const companies = companiesData.map((c) => c as Company);

  // Get related individuals, filter the currently displayed individual, dedupe
  const relatedIndividuals = Array.from(
    new Map(
      companies
        .flatMap((company) => company.relatedIndividuals)
        .filter((individual) => individual.id !== individualId)
        .map((individual) => [individual.id, individual]),
    ).values(),
  );
  if (relatedIndividuals.length === 0) {
    return null;
  }

  return (
    <section className={sharedStyles.section}>
      <h2 className={sharedStyles.sectionTitle}>Related individuals</h2>
      <ul className={sharedStyles.plainList}>
        {relatedIndividuals
          .sort((a, b) => {
            const [_, aLast] = getFirstLastName(a.name);
            const [__, bLast] = getFirstLastName(b.name);
            return aLast.localeCompare(bLast);
          })
          .map((ind) => (
            <li key={ind.id} className={sharedStyles.plainListItem}>
              <Link href={`/2026/individuals/${ind.id}`} className="unstyled">
                {ind.name}
              </Link>
              <div className={`${sharedStyles.subtitle} no-margin`}>
                <AssociatedCompanies
                  individual={ind}
                  companyConstants={companyConstants}
                />
              </div>
            </li>
          ))}
      </ul>
    </section>
  );
}
