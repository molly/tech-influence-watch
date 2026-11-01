import type { Metadata } from "next";

import AdsView, { adsMetadata } from "./AdsView";

export function generateMetadata(): Promise<Metadata> {
  return adsMetadata("all");
}

export default function AdsPage() {
  return <AdsView sector="all" />;
}
