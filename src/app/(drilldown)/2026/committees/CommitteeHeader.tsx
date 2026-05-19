import Breadcrumbs from "@/app/components/Breadcrumbs";
import sharedStyles from "@/app/shared.module.css";
import { Sector } from "@/app/types/Sector";
import { humanizeSector } from "@/app/utils/sector";

export default function CommitteeHeader({
  numCommittees,
  total,
  sector,
}: {
  numCommittees?: number;
  total?: string;
  sector: Sector;
}) {
  return (
    <div className={sharedStyles.fullWidthHeader}>
      <section className={sharedStyles.header}>
        <Breadcrumbs crumbs={["Spending", "Committees"]} />
        <h1
          className={sharedStyles.title}
        >{`${humanizeSector(sector, { abbrev: true })} PACs`}</h1>
        {total && numCommittees && (
          <p className={sharedStyles.subtitle}>
            <span className="bold">{numCommittees}</span>
            {` tracked ${humanizeSector(sector, { context: "industry", lowercase: true })} PACs have more than `}
            <span className="bold">{total}</span>
            {` on hand to influence 2026 elections.`}
          </p>
        )}
      </section>
    </div>
  );
}
