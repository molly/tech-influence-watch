import "@/app/globals.css";

import sharedStyles from "@/app/shared.module.css";

import Header from "../components/Header";

// Render data pages dynamically (per request) rather than prerendering them at
// build. On Cloud Run the ISR/prerender cache is per-instance and ephemeral, so
// a baked snapshot goes stale as soon as the pipeline writes new data and never
// recovers on cold instances. Dynamic rendering reads Firestore fresh every
// time; Fastly caches the rendered HTML and is purged after each pipeline run
// (see revalidate.py), so the edge — not a baked snapshot — is the cache layer.
export const dynamic = "force-dynamic";

export default function DrilldownLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main
        className={`${sharedStyles.mainLayout} ${sharedStyles.mainWithHeader}`}
      >
        {children}
      </main>
    </>
  );
}
