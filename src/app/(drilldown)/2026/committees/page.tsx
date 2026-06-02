import type { Metadata } from "next";

import CommitteesView, { committeesMetadata } from "./CommitteesView";

export function generateMetadata(): Metadata {
  return committeesMetadata("all");
}

export default function CommitteesPage() {
  return <CommitteesView sector="all" />;
}
