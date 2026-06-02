import type { Metadata } from "next";

import { parseSector, SECTOR_STATIC_PARAMS } from "@/app/utils/sector";

import RacesListView, {
  racesListMetadata,
} from "../../elections/RacesListView";

export const dynamicParams = false;

export function generateStaticParams() {
  return SECTOR_STATIC_PARAMS;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sector: string }>;
}): Promise<Metadata> {
  return racesListMetadata(parseSector((await params).sector));
}

export default async function ElectionsSectorPage({
  params,
}: {
  params: Promise<{ sector: string }>;
}) {
  const sector = parseSector((await params).sector);
  return <RacesListView sector={sector} />;
}
