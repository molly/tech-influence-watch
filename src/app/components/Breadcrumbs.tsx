import Link from "next/link";

import styles from "@/app/shared.module.css";

type Crumb =
  | string
  | {
      name: string;
      href?: string;
    };

export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        const name = typeof crumb === "string" ? crumb : crumb.name;
        const href = typeof crumb === "string" ? undefined : crumb.href;
        return (
          <span key={i} className={styles.breadcrumb}>
            {href && !isLast ? (
              <Link className="secondaryLink" href={href}>
                {name}
              </Link>
            ) : (
              <span>{name}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
