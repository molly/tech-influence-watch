import type { Metadata } from "next";

import { AdLibraryParams } from "@/app/utils/adAnalysis";

import AdLibraryView, { adLibraryMetadata } from "./AdLibraryView";

export function generateMetadata(): Metadata {
  return adLibraryMetadata("all");
}

export default async function AdLibraryPage({
  searchParams,
}: {
  searchParams: Promise<AdLibraryParams>;
}) {
  return <AdLibraryView sector="all" params={await searchParams} />;
}
