import type { Metadata } from "next";

import ExpendituresView, { expendituresMetadata } from "./ExpendituresView";

export function generateMetadata(): Metadata {
  return expendituresMetadata("all");
}

export default function ExpendituresPage() {
  return <ExpendituresView sector="all" />;
}
