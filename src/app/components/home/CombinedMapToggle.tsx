"use client";

import { useState } from "react";

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
