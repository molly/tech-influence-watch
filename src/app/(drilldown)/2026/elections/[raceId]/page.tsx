import type { Metadata } from "next";

import { fetchAllRaceIds } from "@/app/actions/fetch";
import { isError } from "@/app/utils/errors";

import RaceDetailView, { raceDetailMetadata } from "./RaceDetailView";

export async function generateStaticParams() {
  const data = await fetchAllRaceIds();
  if (isError(data)) {
    return [];
  }
  return Object.entries(data as Record<string, string[]>).flatMap(
    ([state, races]) => races.map((race) => ({ raceId: `${state}-${race}` })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ raceId: string }>;
}): Promise<Metadata> {
  const { raceId } = await params;
  return raceDetailMetadata(raceId, "all");
}

export default async function RacePage({
  params,
}: {
  params: Promise<{ raceId: string }>;
}) {
  const { raceId } = await params;
  return <RaceDetailView raceId={raceId} sector="all" />;
}
