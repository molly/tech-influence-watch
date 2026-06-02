import type { Metadata } from "next";

import SpendingView, { spendingMetadata } from "./SpendingView";

export function generateMetadata(): Metadata {
  return spendingMetadata("all");
}

export default function SpendingPage() {
  return <SpendingView sector="all" />;
}
