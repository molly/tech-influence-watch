import type { Metadata } from "next";

import { parseSector, SECTOR_STATIC_PARAMS } from "@/app/utils/sector";

import BattlegroundsView, {
  battlegroundsMetadata,
} from "../../../analysis/battlegrounds/BattlegroundsView";

export const dynamicParams = false;

export function generateStaticParams() {
  return SECTOR_STATIC_PARAMS;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sector: string }>;
}): Promise<Metadata> {
  return battlegroundsMetadata(parseSector((await params).sector));
}

export default async function BattlegroundsSectorPage({
  params,
}: {
  params: Promise<{ sector: string }>;
}) {
  const sector = parseSector((await params).sector);
  return <BattlegroundsView sector={sector} />;
}
