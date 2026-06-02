import type { Metadata } from "next";

import StatesView, { statesMetadata } from "./StatesView";

export function generateMetadata(): Metadata {
  return statesMetadata("all");
}

export default function StatesPage() {
  return <StatesView sector="all" />;
}
