import type { Metadata } from "next";

import CompaniesView, { companiesMetadata } from "./CompaniesView";

export function generateMetadata(): Metadata {
  return companiesMetadata("all");
}

export default function CompaniesPage() {
  return <CompaniesView sector="all" />;
}
