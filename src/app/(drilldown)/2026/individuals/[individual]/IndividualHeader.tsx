import Image from "next/image";
import { Suspense } from "react";

import Breadcrumbs from "@/app/components/Breadcrumbs";
import { IndividualBadges } from "@/app/components/individualOrCompany/Badges";
import MoneyCard, { MoneyCardSkeleton } from "@/app/components/MoneyCard";
import Skeleton from "@/app/components/skeletons/Skeleton";
import sharedStyles from "@/app/shared.module.css";
import { IndividualListData } from "@/app/types/Individuals";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";

import AssociatedCompanies from "./AssociatedCompanies";
import styles from "./page.module.css";

function IndividualHeaderSkeleton() {
  return (
    <section className={styles.imageAndName}>
      <div className={styles.imageAndAttribution}>
        <Skeleton width="10rem" height="10rem" />
      </div>
      <div>
        <Skeleton width="min(30rem,100%)" height="6.5rem" />
        <Skeleton width="min(20rem, 100%)" />
      </div>
    </section>
  );
}

export default function IndividualHeader({
  individual,
  numRecipients,
}: {
  individual: IndividualListData;
  numRecipients: number;
}) {
  return (
    <section className={styles.header}>
      <Breadcrumbs
        crumbs={[
          "Spending",
          { name: "Individuals", href: "/2026/individuals" },
          individual.name,
        ]}
      />
      <div className={styles.heroWithStat}>
        <Suspense fallback={<IndividualHeaderSkeleton />}>
          <section className={styles.imageAndName}>
            <div className={styles.imageAndAttribution}>
              <div className={styles.individualImageWrapper}>
                <Image
                  fill
                  src={`https://storage.googleapis.com/follow-the-crypto-misc-assets/${individual.id}.webp`}
                  alt={`${individual.name} photo`}
                  className={styles.individualImage}
                  sizes="10rem"
                />
              </div>
              {individual.photoCredit && (
                <a href={individual.photoCredit} className={styles.attribution}>
                  (image attribution)
                </a>
              )}
            </div>
            <div>
              <h1 className={sharedStyles.title}>{individual.name}</h1>
              <IndividualBadges individual={individual} />
              <div className={styles.individualDescription}>
                <AssociatedCompanies individual={individual} />
              </div>
            </div>
          </section>
        </Suspense>
        <Suspense fallback={<MoneyCardSkeleton />}>
          <MoneyCard
            className={styles.moneyCard}
            topText="Contributions to candidates & PACs"
            amount={humanizeRoundedCurrency(individual.total, true, 1)}
            bottomText={`to ${numRecipients} committee${numRecipients > 1 ? "s" : ""}`}
          />
        </Suspense>
      </div>
    </section>
  );
}
