import type { Metadata } from "next";

import ContributionsView, { contributionsMetadata } from "./ContributionsView";

export function generateMetadata(): Metadata {
  return contributionsMetadata("all");
}

export default function ContributionsPage() {
  return <ContributionsView sector="all" />;
}
