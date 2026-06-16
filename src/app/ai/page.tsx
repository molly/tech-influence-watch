import HomeView from "../HomeView";

// See (drilldown)/layout.tsx: render fresh per request, cache at the Fastly edge.
export const dynamic = "force-dynamic";

export default function AIHomePage() {
  return <HomeView sector="ai" />;
}
