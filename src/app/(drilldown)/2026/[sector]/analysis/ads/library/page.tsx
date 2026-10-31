import type { Metadata } from "next";

import { AdLibraryParams } from "@/app/utils/adAnalysis";
import { parseSector, SECTOR_STATIC_PARAMS } from "@/app/utils/sector";

import AdLibraryView, {
  adLibraryMetadata,
} from "../../../../analysis/ads/library/AdLibraryView";

export const dynamicParams = false;

export function generateStaticParams() {
  return SECTOR_STATIC_PARAMS;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sector: string }>;
}): Promise<Metadata> {
  return adLibraryMetadata(parseSector((await params).sector));
}

export default async function AdLibrarySectorPage({
  params,
  searchParams,
}: {
  params: Promise<{ sector: string }>;
  searchParams: Promise<AdLibraryParams>;
}) {
  const sector = parseSector((await params).sector);
  return <AdLibraryView sector={sector} params={await searchParams} />;
}
