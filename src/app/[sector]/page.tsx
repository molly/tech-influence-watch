import { parseSector, SECTOR_STATIC_PARAMS } from "@/app/utils/sector";

import HomeView from "../HomeView";

export const dynamicParams = false;

export function generateStaticParams() {
  return SECTOR_STATIC_PARAMS;
}

export default async function HomeSectorPage({
  params,
}: {
  params: Promise<{ sector: string }>;
}) {
  const sector = parseSector((await params).sector);
  return <HomeView sector={sector} />;
}
