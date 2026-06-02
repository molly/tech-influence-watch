import { Metadata } from "next";
import { notFound } from "next/navigation";

import { STATES_BY_FULL } from "@/app/data/states";
import { parseSector } from "@/app/utils/sector";

import StateDetailView, {
  stateDetailMetadata,
} from "../../../states/[state]/StateDetailView";

export function generateStaticParams() {
  const states = Object.keys(STATES_BY_FULL).map((fullName) =>
    fullName.replaceAll(" ", "-").toLowerCase(),
  );
  return ["crypto", "ai"].flatMap((sector) =>
    states.map((state) => ({ sector, state })),
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
  params: Promise<{ sector: string; state: string }>;
}): Promise<Metadata> {
  const { sector: rawSector, state } = await params;
  requireSectorPrefix(rawSector);
  return stateDetailMetadata(state, parseSector(rawSector));
}

export default async function StateSectorPage({
  params,
}: {
  params: Promise<{ sector: string; state: string }>;
}) {
  const { sector: rawSector, state } = await params;
  requireSectorPrefix(rawSector);
  return <StateDetailView stateParam={state} sector={parseSector(rawSector)} />;
}
