"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { type Sector } from "@/app/types/Sector";

import styles from "./header.module.css";

const SECTORS: { label: string; value: Sector }[] = [
  { label: "All", value: "all" },
  { label: "Crypto", value: "crypto" },
  { label: "AI", value: "ai" },
];

export default function SectorButtons() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawSector = searchParams.get("sector");
  const sector: Sector =
    rawSector === "crypto" || rawSector === "ai" ? rawSector : "all";

  function handleSelect(value: Sector) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("sector");
    } else {
      params.set("sector", value);
    }
    const query = params.toString();
    router.push(query ? `?${query}` : "?");
  }

  return (
    <>
      {SECTORS.map(({ label, value }) => (
        <button
          key={value}
          className={`${styles.sector} ${sector === value ? styles.sectorActive : ""}`}
          onClick={() => handleSelect(value)}
        >
          {label}
        </button>
      ))}
    </>
  );
}
