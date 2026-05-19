import Breadcrumbs from "@/app/components/Breadcrumbs";
import sharedStyles from "@/app/shared.module.css";
import { Sector } from "@/app/types/Sector";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";
import { humanizeSector } from "@/app/utils/sector";

export default async function BeneficiariesHeader({
  sector,
  totalSpending,
  numBeneficiaries,
}: {
  sector: Sector;
  totalSpending: number;
  numBeneficiaries: number;
}) {
  return (
    <div className={sharedStyles.fullWidthHeader}>
      <section className={sharedStyles.header}>
        <Breadcrumbs crumbs={["Spending", "Beneficiaries"]} />
        <h1 className={sharedStyles.title}>Beneficiaries</h1>
        <p className={sharedStyles.subtitle}>
          <span>
            {`Tracked ${humanizeSector(sector, { context: "industry", lowercase: true })} sources have contributed more than `}
            <span className="bold">
              {humanizeRoundedCurrency(totalSpending, true)}
            </span>
            {` to `}
            <span className="bold">{`${numBeneficiaries} federal recipients`}</span>
            {` during the 2026 election cycle — including candidates, party committees, and super PACs.`}
          </span>
        </p>
      </section>
    </div>
  );
}
