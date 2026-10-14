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
  const [active, setActive] = useState<"company" | "superpac">("superpac");

  return (
    <div>
      <h2 id="spending-by-state" className={sharedStyles.sectionTitle}>
        Spending by state
      </h2>
      <div className={styles.toggleRow}>
        <button
          className={
            active === "superpac" ? styles.activeButton : styles.button
          }
          onClick={() => setActive("superpac")}
        >
          Super PAC expenditures
        </button>
        <button
          className={active === "company" ? styles.activeButton : styles.button}
          onClick={() => setActive("company")}
        >
          Direct contributions
        </button>
      </div>
      {active === "superpac" ? superPacMap : companyMap}
    </div>
  );
}
