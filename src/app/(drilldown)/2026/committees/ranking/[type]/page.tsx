import { Metadata } from "next";

import {
  fetchPACsByReceipts,
  fetchSuperPACsByReceipts,
} from "@/app/actions/fetch";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import PACsByReceipts from "@/app/components/PACsByReceipts";
import sharedStyles from "@/app/shared.module.css";
import { AllCommitteesSummary } from "@/app/types/Committee";
import { isError } from "@/app/utils/errors";
import { customMetadata } from "@/app/utils/metadata";
import { titlecase } from "@/app/utils/titlecase";

import PacList from "./PacList";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ type: "super" }, { type: "all" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  return customMetadata({
    title: `${titlecase(type)} PAC rankings`,
    description: `The most highly funded ${type === "super" ? "super PACs" : "political action committees"} in the 2026 election cycle.`,
  });
}

const VISIBLE_PAC_COUNT = 50;

async function getTechCountInVisible(type: string): Promise<number> {
  const data =
    type === "super"
      ? await fetchSuperPACsByReceipts()
      : await fetchPACsByReceipts();
  if (isError(data)) {
    return 0;
  }
  return (data as AllCommitteesSummary[])
    .slice(0, VISIBLE_PAC_COUNT)
    .filter((p) => p.sector === "crypto" || p.sector === "ai").length;
}

export default async function PACRankingPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  return (
    <>
      <div className={sharedStyles.fullWidthHeader}>
        <section className={sharedStyles.header}>
          <Breadcrumbs
            crumbs={[
              "Spending",
              { name: "Committees", href: "/2026/committees" },
              "Ranking",
              type === "super" ? "Super PACs" : "All PACS",
            ]}
          />
          <h1 className={sharedStyles.title}>Committees</h1>
        </section>
      </div>
      <div className={sharedStyles.main}>
        <div className="single-column-page">
          <PACsByReceipts type={type} fullPage={true} sector="all">
            <PacList type={type} />
          </PACsByReceipts>
        </div>
      </div>
    </>
  );
}
