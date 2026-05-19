import type { Metadata } from "next";
import { Suspense } from "react";

import Skeleton from "@/app/components/skeletons/Skeleton";
import sharedStyles from "@/app/shared.module.css";
import { customMetadata } from "@/app/utils/metadata";
import { range } from "@/app/utils/range";
import { parseSector } from "@/app/utils/sector";

import IndividualsList from "./IndividualsList";

export const metadata: Metadata = customMetadata({
  title: "Individuals",
  description:
    "List of cryptocurrency-related individuals active in election spending.",
});

function IndividualsListSkeleton() {
  return range(20).map((x) => (
    <Skeleton
      key={`skeleton-row-${x}`}
      randWidth={[5, 15]}
      className={sharedStyles.marginBottom1}
    />
  ));
}

export default async function IndividualsPage({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string }>;
}) {
  const { sector: rawSector } = await searchParams;
  const sector = parseSector(rawSector);

  return (
    <section className="single-column-page">
      <h1>Cryptocurrency-related individuals active in election spending</h1>
      <Suspense fallback={<IndividualsListSkeleton />}>
        <IndividualsList sector={sector} />
      </Suspense>
    </section>
  );
}
