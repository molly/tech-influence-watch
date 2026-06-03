import type { Metadata } from "next";

import NetworksView, { networksMetadata } from "./NetworksView";

export function generateMetadata(): Metadata {
  return networksMetadata("all");
}

export default function NetworksPage() {
  return <NetworksView sector="all" />;
}
