import type { Metadata } from "next";
import { Suspense } from "react";

import Skeleton from "@/app/components/skeletons/Skeleton";
import sharedStyles from "@/app/shared.module.css";
import { customMetadata } from "@/app/utils/metadata";
import { range } from "@/app/utils/range";
import { parseSector } from "@/app/utils/sector";

import CompanyList from "./CompanyList";

export const metadata: Metadata = customMetadata({
  title: "Companies",
  description:
    "List of cryptocurrency-related companies active in election spending.",
});

function CompanyListSkeleton() {
  return range(10).map((x) => (
    <Skeleton
      key={`skeleton-row-${x}`}
      randWidth={[5, 15]}
      className={sharedStyles.marginBottom1}
    />
  ));
}

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string }>;
}) {
  const { sector: rawSector } = await searchParams;
  const sector = parseSector(rawSector);

  return (
    <section className="single-column-page">
      <h1 className="no-margin">
        Cryptocurrency-related companies active in election spending
      </h1>
      <Suspense fallback={<CompanyListSkeleton />}>
        <CompanyList sector={sector} />
      </Suspense>
    </section>
  );
}
