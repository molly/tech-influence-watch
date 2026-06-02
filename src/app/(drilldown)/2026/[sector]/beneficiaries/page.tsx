import type { Metadata } from "next";

import { parseSector, SECTOR_STATIC_PARAMS } from "@/app/utils/sector";

import BeneficiariesView, {
  beneficiariesMetadata,
} from "../../beneficiaries/BeneficiariesView";

export const dynamicParams = false;

export function generateStaticParams() {
  return SECTOR_STATIC_PARAMS;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sector: string }>;
}): Promise<Metadata> {
  return beneficiariesMetadata(parseSector((await params).sector));
}

export default async function BeneficiariesSectorPage({
  params,
}: {
  params: Promise<{ sector: string }>;
}) {
  const sector = parseSector((await params).sector);
  return <BeneficiariesView sector={sector} />;
}
