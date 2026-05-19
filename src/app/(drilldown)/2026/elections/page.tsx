import type { Metadata } from "next";

import InfluencedRaces from "@/app/components/InfluencedRaces";
import { customMetadata } from "@/app/utils/metadata";
import { parseSector } from "@/app/utils/sector";

import OtherSupportedRaces from "./OtherSupportedRaces";
import styles from "./page.module.css";

export const metadata: Metadata = customMetadata({
  title: "Influenced Elections",
  description:
    "Cryptocurrency-focused PACs have already spent heavily to influence the outcome of multiple Congressional races.",
});

export default async function RacesList({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string }>;
}) {
  const { sector: rawSector } = await searchParams;
  const sector = parseSector(rawSector);
  return (
    <div className={styles.page}>
      <h1 className="no-margin">Elections</h1>
      <InfluencedRaces sector={sector} fullPage={true} />
      <OtherSupportedRaces />
    </div>
  );
}
