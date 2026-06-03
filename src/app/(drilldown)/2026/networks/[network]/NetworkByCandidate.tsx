import Link from "next/link";

import {
  HorizontalBarItem,
  HorizontalBars,
} from "@/app/components/home/HorizontalBars";
import sharedStyles from "@/app/shared.module.css";
import { formatCompact } from "@/app/utils/humanize";

import type { NetworkData } from "./networkData";

const LIMIT = 8;

export default function NetworkByCandidate({ data }: { data: NetworkData }) {
  const { candidates, spent, raceCount } = data;
  if (candidates.length === 0) {
    return null;
  }

  const top = candidates.slice(0, LIMIT);
  const max = spent || top[0].total;

  const items: HorizontalBarItem[] = top.map((target) => {
    const partyLetter = target.party ? target.party[0] : "";
    const location = `${target.stateName} ${target.raceName}`.trim();
    const subtitle = [location, target.committees.join(", ")]
      .filter(Boolean)
      .join(" · ");
    return {
      key: target.key,
      label: `${target.prefix} ${target.name}${partyLetter ? ` (${partyLetter})` : ""}`,
      labelNode: (
        <>
          {target.prefix}{" "}
          <Link
            href={`/2026/elections/${target.state}-${target.raceId}`}
            className="secondaryLink"
          >
            {target.name}
          </Link>
          {partyLetter && <span className="secondary"> ({partyLetter})</span>}
        </>
      ),
      subtitle,
      value: target.total,
      displayValue: formatCompact(target.total),
    };
  });

  return (
    <section>
      <h2 className={sharedStyles.sectionTitle}>
        By candidate
        <span className={sharedStyles.sectionTitleAmount}>
          Top {top.length} of {raceCount}
        </span>
      </h2>
      <HorizontalBars items={items} max={max} showPct />
    </section>
  );
}
