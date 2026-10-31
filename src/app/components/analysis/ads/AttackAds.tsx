import Link from "next/link";
import { Fragment } from "react";

import {
  HorizontalBarItem,
  HorizontalBars,
} from "@/app/components/home/HorizontalBars";
import { Sector } from "@/app/types/Sector";
import { adLibraryHref, CommitteeAds, hasRollup } from "@/app/utils/adAnalysis";
import { humanizeList } from "@/app/utils/humanize";

import { PartySwatch } from "./AdCardParts";
import styles from "./Ads.module.css";

export default function AttackAds({
  committees,
  sector,
}: {
  committees: CommitteeAds[];
  sector: Sector;
}) {
  const rows = committees.map((committee) => {
    const attacks = committee.ads.filter((ad) => hasRollup(ad, "attack"));
    const races = new Map<string, number>();
    for (const ad of attacks) {
      races.set(ad.race, (races.get(ad.race) ?? 0) + 1);
    }
    return { committee, attacks: attacks.length, races };
  });
  const attackers = rows
    .filter((row) => row.attacks > 0)
    .sort(
      (a, b) =>
        b.attacks - a.attacks ||
        b.committee.ads.length - a.committee.ads.length,
    );
  const none = rows.filter((row) => row.attacks === 0);
  const totalAds = committees.reduce((sum, c) => sum + c.ads.length, 0);
  const totalAttacks = attackers.reduce((sum, row) => sum + row.attacks, 0);

  const items: HorizontalBarItem[] = attackers.map(
    ({ committee, attacks, races }) => ({
      key: committee.id,
      label: committee.name,
      labelNode: (
        <span className={styles.inlineWho}>
          <PartySwatch party={committee.party} />
          {committee.name}
        </span>
      ),
      value: attacks / committee.ads.length,
      displayValue: `${attacks} of ${committee.ads.length}`,
      ariaLabel: `${committee.name}: ${attacks} of ${committee.ads.length} ads are attacks`,
      subtitle: (
        <span className={styles.attackRaces}>
          {[...races.entries()]
            .sort((a, b) => b[1] - a[1])
            .map(([race, count], i) => (
              <Fragment key={race}>
                {i > 0 && ", "}
                <Link
                  href={adLibraryHref(sector, {
                    cm: committee.id,
                    tag: "attack",
                    q: race,
                  })}
                >
                  {race}
                </Link>
                {count > 1 && ` ×${count}`}
              </Fragment>
            ))}
        </span>
      ),
    }),
  );

  return (
    <>
      <HorizontalBars items={items} max={1} />
      <p className={styles.note}>
        {totalAttacks} of {totalAds} ads are attacks.
        {none.length > 0 && (
          <>
            {" "}
            No attack ads from{" "}
            {humanizeList(none.map((row) => row.committee.name))}.
          </>
        )}
      </p>
    </>
  );
}
