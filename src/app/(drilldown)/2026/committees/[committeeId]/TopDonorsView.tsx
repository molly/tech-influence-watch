"use client";

import { useSearchParams } from "next/navigation";
import { ReactNode } from "react";

export default function TopDonorsView({
  byDonor,
  byDate,
}: {
  byDonor: ReactNode;
  byDate: ReactNode;
}) {
  const isDate = useSearchParams().get("sort") === "date";
  return <>{isDate ? byDate : byDonor}</>;
}
