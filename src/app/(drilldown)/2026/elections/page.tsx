import type { Metadata } from "next";

import RacesListView, { racesListMetadata } from "./RacesListView";

export function generateMetadata(): Metadata {
  return racesListMetadata("all");
}

export default function ElectionsPage() {
  return <RacesListView sector="all" />;
}
