import type { Metadata } from "next";

import { parseSector, SECTOR_STATIC_PARAMS } from "@/app/utils/sector";

import ContributionsView, {
  contributionsMetadata,
} from "../../contributions/ContributionsView";

export const dynamicParams = false;

export function generateStaticParams() {
  return SECTOR_STATIC_PARAMS;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sector: string }>;
}): Promise<Metadata> {
  return contributionsMetadata(parseSector((await params).sector));
}

export default async function ContributionsSectorPage({
  params,
}: {
  params: Promise<{ sector: string }>;
}) {
  const sector = parseSector((await params).sector);
  return <ContributionsView sector={sector} />;
}
