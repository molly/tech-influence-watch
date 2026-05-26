import { CompanyConstant } from "@/app/types/Companies";
import {
  IndividualConstant,
  IndividualListData,
} from "@/app/types/Individuals";

import CompanyLinks from "../CompanyLinks";
import styles from "./page.module.css";

type Props =
  | { individual: IndividualListData; companyConstants?: never }
  | {
      individual: IndividualConstant;
      companyConstants: Record<string, CompanyConstant>;
    };

export default function AssociatedCompanies({
  individual,
  companyConstants,
}: Props) {
  let subhead = [];
  const companyDetails: CompanyConstant[] =
    "companyDetails" in individual
      ? individual.companyDetails
      : (individual.company
          ?.map((co) =>
            Object.values(companyConstants!).find((c) => c.name === co),
          )
          .filter((c): c is CompanyConstant => c !== undefined) ?? []);
  const individualWithDetails: IndividualListData =
    "companyDetails" in individual
      ? individual
      : { ...individual, companyDetails, total: 0, allSectors: [] };

  if (individual.title) {
    if (!companyDetails.length && !individual.company) {
      return <span key="title">{individual.title}</span>;
    }
    subhead.push(
      <span key="title">{`${individual.title} ${individual.title.toLowerCase().includes("partner") ? "at" : "of"} `}</span>,
    );
  } else {
    subhead.push(<span key="title">associated with </span>);
  }

  subhead.push(
    <CompanyLinks
      key="company-links"
      individual={individualWithDetails}
      className={styles.company}
    />,
  );
  return subhead;
}
