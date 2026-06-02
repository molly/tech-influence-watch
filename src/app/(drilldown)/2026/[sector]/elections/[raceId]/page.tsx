import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { fetchAllRaceIds } from "@/app/actions/fetch";
import { isError } from "@/app/utils/errors";
import { parseSector } from "@/app/utils/sector";

import RaceDetailView, {
  raceDetailMetadata,
} from "../../../elections/[raceId]/RaceDetailView";

export async function generateStaticParams() {
  const data = await fetchAllRaceIds();
  if (isError(data)) {
    return [];
  }
  const raceIds = Object.entries(data as Record<string, string[]>).flatMap(
    ([state, races]) => races.map((race) => `${state}-${race}`),
  );
  return ["crypto", "ai"].flatMap((sector) =>
    raceIds.map((raceId) => ({ sector, raceId })),
  );
}

function requireSectorPrefix(rawSector: string) {
  if (rawSector !== "crypto" && rawSector !== "ai") {
    notFound();
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sector: string; raceId: string }>;
}): Promise<Metadata> {
  const { sector: rawSector, raceId } = await params;
  requireSectorPrefix(rawSector);
  return raceDetailMetadata(raceId, parseSector(rawSector));
}

export default async function RaceSectorPage({
  params,
}: {
  params: Promise<{ sector: string; raceId: string }>;
}) {
  const { sector: rawSector, raceId } = await params;
  requireSectorPrefix(rawSector);
  return <RaceDetailView raceId={raceId} sector={parseSector(rawSector)} />;
}
