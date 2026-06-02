import type { Metadata } from "next";

import IndividualsView, { individualsMetadata } from "./IndividualsView";

export function generateMetadata(): Metadata {
  return individualsMetadata("all");
}

export default function IndividualsPage() {
  return <IndividualsView sector="all" />;
}
