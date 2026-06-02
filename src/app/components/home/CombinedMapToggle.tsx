"use client";

import { useState } from "react";

import sharedStyles from "@/app/shared.module.css";

import styles from "./CombinedMapToggle.module.css";

export default function CombinedMapToggle({
  companyMap,
  superPacMap,
}: {
  companyMap: React.ReactNode;
  superPacMap: React.ReactNode;
}) {
  const [active, setActive] = useState<"company" | "superpac">("company");

  return (
    <div>
      <h2 id="spending-by-state" className={sharedStyles.sectionTitle}>
        Spending by state
      </h2>
      <div className={styles.toggleRow}>
        <button
          className={active === "company" ? styles.activeButton : styles.button}
          onClick={() => setActive("company")}
        >
          Industry contributions
        </button>
        <button
          className={
            active === "superpac" ? styles.activeButton : styles.button
          }
          onClick={() => setActive("superpac")}
        >
          PAC expenditures
        </button>
      </div>
      {active === "company" ? companyMap : superPacMap}
    </div>
  );
}
