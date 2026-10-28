import type { Metadata } from "next";

import BattlegroundsView, { battlegroundsMetadata } from "./BattlegroundsView";

export function generateMetadata(): Metadata {
  return battlegroundsMetadata("all");
}

export default function BattlegroundsPage() {
  return <BattlegroundsView sector="all" />;
}
