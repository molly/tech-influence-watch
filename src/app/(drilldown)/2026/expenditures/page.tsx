import type { Metadata } from "next";

import AllRecentExpenditures from "@/app/components/home/AllRecentExpenditures";
import { customMetadata } from "@/app/utils/metadata";
import { parseSector } from "@/app/utils/sector";

export const metadata: Metadata = customMetadata({
  title: "Recent Expenditures",
  description:
    "Recent expenditures in the 2026 election cycle by cryptocurrency-focused political action committees.",
});

export default async function ExpendituresList({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string }>;
}) {
  const { sector: rawSector } = await searchParams;
  const sector = parseSector(rawSector);

  return (
    <section className="single-column-page">
      <h1>Recent expenditures by any crypto-focused committee</h1>
      <AllRecentExpenditures fullPage={true} sector={sector} />
    </section>
  );
}
