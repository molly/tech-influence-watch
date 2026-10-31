import type { Metadata } from "next";

import { parseSector, SECTOR_STATIC_PARAMS } from "@/app/utils/sector";

import AdsView, { adsMetadata } from "../../../analysis/ads/AdsView";

export const dynamicParams = false;

export function generateStaticParams() {
  return SECTOR_STATIC_PARAMS;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sector: string }>;
}): Promise<Metadata> {
  return adsMetadata(parseSector((await params).sector));
}

export default async function AdsSectorPage({
  params,
}: {
  params: Promise<{ sector: string }>;
}) {
  const sector = parseSector((await params).sector);
  return <AdsView sector={sector} />;
}
