import type { Metadata } from "next";

import AllRecentContributions from "@/app/components/home/AllRecentContributions";
import { customMetadata } from "@/app/utils/metadata";
import { parseSector } from "@/app/utils/sector";

export const metadata: Metadata = customMetadata({
  title: "Recent Contributions",
  description:
    "Recent contributions to PACs from cryptocurrency-focused companies and individuals.",
});

export default async function ContributionsList({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string }>;
}) {
  const { sector: rawSector } = await searchParams;
  const sector = parseSector(rawSector);

  return (
    <section className="single-column-page">
      <h1>Recent contributions from tracked companies and individuals</h1>
      <AllRecentContributions fullPage={true} sector={sector} />
    </section>
  );
}
