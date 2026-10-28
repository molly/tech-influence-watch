import type { Metadata } from "next";
import { Suspense } from "react";

import BattlegroundRaces, {
  BattlegroundRacesSkeleton,
} from "@/app/components/analysis/BattlegroundRaces";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import sharedStyles from "@/app/shared.module.css";
import { Sector } from "@/app/types/Sector";
import { customMetadata } from "@/app/utils/metadata";
import { humanizeSector } from "@/app/utils/sector";

export function battlegroundsMetadata(sector: Sector): Metadata {
  const label = humanizeSector(sector, { abbrev: true });
  return customMetadata({
    title: `${label} super PAC spending in competitive and safe races`,
    description: `How much ${humanizeSector(sector, {
      hyphen: true,
      abbrev: true,
      lowercase: true,
    })}focused super PACs have spent in competitive races compared to seats already considered safe for one party, based on Cook Political Report ratings`,
  });
}

export default function BattlegroundsView({ sector }: { sector: Sector }) {
  return (
    <>
      <div className={sharedStyles.fullWidthHeader}>
        <section className={sharedStyles.header}>
          <Breadcrumbs crumbs={["Analysis", "Battlegrounds and safe seats"]} />
          <h1 className={sharedStyles.title}>Battlegrounds and safe seats</h1>
        </section>
      </div>
      <div className={sharedStyles.main}>
        <Suspense fallback={<BattlegroundRacesSkeleton />}>
          <BattlegroundRaces sector={sector} />
        </Suspense>
      </div>
    </>
  );
}
