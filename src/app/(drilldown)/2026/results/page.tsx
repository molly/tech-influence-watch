import type { Metadata } from "next";

import ResultsView, { resultsMetadata } from "./ResultsView";

export function generateMetadata(): Metadata {
  return resultsMetadata("all");
}

export default function ResultsPage() {
  return <ResultsView sector="all" />;
}
