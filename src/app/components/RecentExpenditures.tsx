import sharedStyles from "@/app/shared.module.css";
import Link from "next/link";
import { Sector } from "../types/Sector";
import { sectorHref } from "../utils/sector";
import tableStyles from "./tables.module.css";

export default function RecentExpenditures({
  children,
  fullPage,
  noHeader,
  className,
  sector,
}: {
  children: React.ReactNode;
  fullPage?: boolean;
  noHeader?: boolean;
  className?: string;
  sector?: Sector;
}) {
  return (
    <section
      className={`${className ? className : ""} ${tableStyles.recentExpendituresCard}`}
    >
      {!noHeader && (
        <h2 className={sharedStyles.sectionTitle}>Recent PAC expenditures</h2>
      )}
      {children}
      {!fullPage && (
        <div className={tableStyles.viewMoreLinks}>
          <Link
            href={sectorHref("/2026/expenditures", sector ?? "all")}
            className={tableStyles.viewMoreLink}
          >
            &raquo; More recent expenditures
          </Link>
        </div>
      )}
    </section>
  );
}
