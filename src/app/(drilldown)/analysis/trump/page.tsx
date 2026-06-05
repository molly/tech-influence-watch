import type { Metadata } from "next";
import { Suspense } from "react";

import TrumpCombinedDonors, {
  TrumpCombinedDonorsSkeleton,
} from "@/app/components/analysis/TrumpCombinedDonors";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import sharedStyles from "@/app/shared.module.css";
import { customMetadata } from "@/app/utils/metadata";

export const metadata: Metadata = customMetadata({
  title:
    "Cryptocurrency, AI, and tech industry campaign contributions to President Trump",
  description:
    "Cryptocurrency, artificial intelligence, and broader tech-industry contributions to Donald Trump's campaign committees, leadership PACs, and 2025 inauguration",
});

export default function TrumpContributionsPage() {
  return (
    <>
      <div className={sharedStyles.fullWidthHeader}>
        <section className={sharedStyles.header}>
          <Breadcrumbs crumbs={["Analysis", "Donald Trump"]} />
          <h1 className={sharedStyles.title}>Contributions to Donald Trump</h1>
        </section>
      </div>
      <div className={sharedStyles.main}>
        <Suspense fallback={<TrumpCombinedDonorsSkeleton />}>
          <TrumpCombinedDonors />
        </Suspense>
      </div>
    </>
  );
}
