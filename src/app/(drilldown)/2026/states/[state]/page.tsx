import { Metadata } from "next";

import { STATES_BY_FULL } from "@/app/data/states";

import StateDetailView, { stateDetailMetadata } from "./StateDetailView";

export function generateStaticParams() {
  return Object.keys(STATES_BY_FULL).map((fullName) => ({
    state: fullName.replaceAll(" ", "-").toLowerCase(),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state } = await params;
  return stateDetailMetadata(state, "all");
}

export default async function StatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  return <StateDetailView stateParam={state} sector="all" />;
}
