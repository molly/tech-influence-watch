import Link from "next/link";
import { Suspense } from "react";

import styles from "@/app/components/tables.module.css";
import sharedStyles from "@/app/shared.module.css";
import { type Sector } from "@/app/types/Sector";
import { range } from "@/app/utils/range";
import { humanizeSector } from "@/app/utils/sector";

import Skeleton from "./skeletons/Skeleton";

function TableContentsSkeleton({ type }: { type: string }) {
  return range(10).map((i) => {
    return (
      <tr className={styles.superPacRow} key={`superPac-skeleton-row-${i}`}>
        <td></td>
        <td>
          <Skeleton randWidth={[6, 18]} onCard={true} />
        </td>
        <td>
          <Skeleton randWidth={[6, 18]} onCard={true} />
        </td>
        {type === "all" && (
          <td>
            <Skeleton
              width="6rem"
              onCard={true}
              className={sharedStyles.floatRight}
            />
          </td>
        )}
      </tr>
    );
  });
}

export default function PACsByReceipts({
  children,
  type,
  sector,
  fullPage = false,
}: {
  children: React.ReactNode;
  sector: Sector;
  type: string;
  fullPage?: boolean;
}) {
  const sectorText = humanizeSector(sector);
  return (
    <div className={styles.superPacCard}>
      <div className={styles.tableCardContent}>
        <h2 className={sharedStyles.sectionTitle}>
          {`Top ${type === "super" ? "super " : ""}PACs by total receipts`}
        </h2>
        <p className={sharedStyles.subtitle}>
          Issues in FEC reporting may affect this list; see the{" "}
          <Link href="/about/faq#pacs-data">FAQ</Link>.
        </p>
        {fullPage && type === "super" && (
          <p className={sharedStyles.subtitle}>
            This list includes only PACs that are designated with the FEC as
            independent expenditure only political committees (super PACs), and
            does not include hybrid PACs. To view all political action and party
            committees, including hybrid PACs, see the{" "}
            <Link href="/2026/committees/ranking/all">list of all PACs</Link>.
          </p>
        )}
      </div>
      <table className={styles.superPacTable}>
        <thead>
          <tr className={styles.superPacTableHeader}>
            <th className={styles.rowIndex}>#</th>
            <th className="text-cell">Name</th>
            <th className={`text-cell ${styles.tableCellCollapse1}`}>
              Description
            </th>
            {type === "all" && (
              <th className={`text-cell ${styles.tableCellCollapse1}`}>Type</th>
            )}
          </tr>
        </thead>
        <tbody>
          <Suspense fallback={<TableContentsSkeleton type={type} />}>
            {children}
          </Suspense>
        </tbody>
      </table>
      <div className={styles.tableCardContent}>
        {!fullPage && type === "super" && (
          <>
            <div className={sharedStyles.subtitle}>
              This list includes only PACs that are designated with the FEC as
              independent expenditure only political committees (super PACs),
              and does not include hybrid PACs. To view all political action and
              party committees, including hybrid PACs, see the{" "}
              <Link href="/2026/committees/ranking/all">list of all PACs</Link>.
            </div>
            <div className={styles.viewMoreLinks}>
              <div className={styles.viewMoreLink}>
                <Link href="/2026/committees/ranking/super">
                  &raquo; More super PACs
                </Link>
              </div>
              <div className={styles.viewMoreLink}>
                <Link href="/2026/committees/ranking/all">
                  &raquo; More PACs
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
