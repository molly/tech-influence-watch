"use client";

import { usePathname, useRouter } from "next/navigation";

import { type Sector } from "@/app/types/Sector";
import { sectorFromPathname, setSectorOnPathname } from "@/app/utils/sector";

import styles from "./header.module.css";

const SECTORS: { label: string; value: Sector }[] = [
  { label: "All", value: "all" },
  { label: "Crypto", value: "crypto" },
  { label: "AI", value: "ai" },
];

export default function SectorButtons() {
  const router = useRouter();
  const pathname = usePathname();
  const sector = sectorFromPathname(pathname);

  function handleSelect(value: Sector) {
    router.push(setSectorOnPathname(pathname, value));
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
