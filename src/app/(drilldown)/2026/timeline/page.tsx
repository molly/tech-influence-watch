import type { Metadata } from "next";

import SpendingFlowView, { spendingFlowMetadata } from "./SpendingFlowView";

export function generateMetadata(): Metadata {
  return spendingFlowMetadata("all");
}

export default function SpendingFlowPage() {
  return <SpendingFlowView sector="all" />;
}
