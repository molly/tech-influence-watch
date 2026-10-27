import type { Metadata } from "next";

import { parseSector, SECTOR_STATIC_PARAMS } from "@/app/utils/sector";

import SpendingFlowView, {
  spendingFlowMetadata,
} from "../../timeline/SpendingFlowView";

export const dynamicParams = false;

export function generateStaticParams() {
  return SECTOR_STATIC_PARAMS;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sector: string }>;
}): Promise<Metadata> {
  return spendingFlowMetadata(parseSector((await params).sector));
}

export default async function SpendingFlowSectorPage({
  params,
}: {
  params: Promise<{ sector: string }>;
}) {
  const sector = parseSector((await params).sector);
  return <SpendingFlowView sector={sector} />;
}
