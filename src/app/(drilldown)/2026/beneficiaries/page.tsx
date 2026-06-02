import type { Metadata } from "next";

import BeneficiariesView, { beneficiariesMetadata } from "./BeneficiariesView";

export function generateMetadata(): Metadata {
  return beneficiariesMetadata("all");
}

export default function BeneficiariesPage() {
  return <BeneficiariesView sector="all" />;
}
