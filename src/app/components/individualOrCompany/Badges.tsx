import { IndividualListData } from "@/app/types/Individuals";
import { BESector } from "@/app/types/Sector";

import styles from "./individualOrCompany.module.css";

function Badges({ sectors, key }: { sectors: BESector[]; key: string }) {
  return (
    <div className={styles.badges}>
      {sectors.map((sector) => (
        <span className={styles.sectorBadge} key={`${key}-${sector}`}>
          {sector === "ai" ? "AI" : sector}
        </span>
      ))}
    </div>
  );
}

export function IndividualBadges({
  individual,
}: {
  individual: IndividualListData;
}) {
  let sectors = individual.allSectors;
  if (sectors.length === 0 || (sectors.length === 1 && sectors[0] === "tech")) {
    sectors = ["ai", "crypto"];
  }
  sectors.sort();
  return <Badges sectors={sectors} key={individual.id} />;
}

export function CompanyBadges({
  name,
  sector,
}: {
  name: string;
  sector?: BESector;
}) {
  if (!sector) {
    return;
  }
  const sectors: BESector[] = sector === "tech" ? ["ai", "crypto"] : [sector];
  return <Badges sectors={sectors} key={name} />;
}
