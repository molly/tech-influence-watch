import { ReactNode } from "react";
import styles from "./TotalsRow.module.css";

export default function TotalsRow({ children }: { children: ReactNode }) {
  return <div className={styles.totalsRow}>{children}</div>;
}
