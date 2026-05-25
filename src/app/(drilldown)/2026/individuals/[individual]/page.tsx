import Image from "next/image";
import { Metadata } from "next";
import Link from "next/link";

import { fetchConstant, fetchIndividual } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import SpendingByParty from "@/app/components/individualOrCompany/SpendingByParty";
import sharedStyles from "@/app/shared.module.css";
import {
  IndividualConstant,
  IndividualContributions,
} from "@/app/types/Individuals";
import { isError } from "@/app/utils/errors";
import { humanizeList } from "@/app/utils/humanize";
import { customMetadata } from "@/app/utils/metadata";
import { titlecase, titlecaseCompany } from "@/app/utils/titlecase";

import Contributions from "./Contributions";
import styles from "./page.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ individual: string }>;
}): Promise<Metadata> {
  const { individual } = await params;
  const individualName = titlecase(individual.replaceAll("-", " "));
  return customMetadata({
    title: individualName,
    description: `Election spending by ${individualName}.`,
  });
}

function Subhead({
  individual,
  associatedCompany,
}: {
  individual: IndividualConstant;
  associatedCompany?: string[];
}) {
  let subhead = [];
  if (individual.title) {
    if (!associatedCompany && !individual.company) {
      return <span key="title">{individual.title}</span>;
    }
    subhead.push(<span key="title">{`${individual.title} at `}</span>);
  }
  if (associatedCompany && associatedCompany.length) {
    if (!individual.title) {
      subhead.push(<span key="association">Associated with </span>);
    }
    const companyLinks = associatedCompany.map((company) => (
      <Link href={`/2026/companies/${company}`} key={company}>
        {titlecaseCompany(company.replaceAll("-", " "))}
      </Link>
    ));
    subhead.push(humanizeList(companyLinks));
  } else if (individual.company) {
    subhead.push(<span key="company">{humanizeList(individual.company)}</span>);
  }
  return subhead;
}

export default async function IndividualPage({
  params,
}: {
  params: Promise<{ individual: string }>;
}) {
  const { individual: individualParam } = await params;
  const [individualData, contributionsData] = await Promise.all([
    fetchConstant("individuals"),
    fetchIndividual(individualParam),
  ]);
  if (isError(individualData)) {
    return <ErrorText subject="individual data" />;
  }
  if (isError(contributionsData)) {
    return <ErrorText subject="individual contributions data" />;
  }
  const individual = (individualData as Record<string, IndividualConstant>)[
    individualParam
  ];
  const { associatedCompany, party_summary } =
    contributionsData as IndividualContributions;

  return (
    <>
      <section className={styles.imageAndName}>
        <div className={styles.imageAndAttribution}>
          <div className={styles.individualImageWrapper}>
            <Image
              fill
              src={`https://storage.googleapis.com/follow-the-crypto-misc-assets/${individualParam}.webp`}
              alt={`${individual.name} photo`}
              className={styles.individualImage}
            />
          </div>
          {individual.photoCredit && (
            <a href={individual.photoCredit} className={styles.attribution}>
              (image attribution)
            </a>
          )}
        </div>
        <div>
          <h1 className={styles.individualName}>{individual.name}</h1>
          <div className="secondary">
            <Subhead
              individual={individual}
              associatedCompany={associatedCompany}
            />
          </div>
        </div>
      </section>
      <div className={styles.page}>
        <Contributions individualId={individualParam} />
        <div className={styles.spendingWrapper}>
          <section
            className={`${styles.spendingByPartySection} ${sharedStyles.constrainWidth}`}
          >
            <h2 id="spending-by-party">Contributions by party</h2>
            {party_summary && (
              <SpendingByParty
                partySummary={party_summary}
                labelId="spending-by-party"
              />
            )}
          </section>
        </div>
      </div>
    </>
  );
}
