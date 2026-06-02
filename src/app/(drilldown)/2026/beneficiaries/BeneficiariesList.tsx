"use client";

import { useSearchParams } from "next/navigation";

import Pagination from "@/app/components/Pagination";
import { Beneficiary } from "@/app/types/Beneficiaries";
import { CommitteeConstant } from "@/app/types/Committee";

import styles from "./beneficiaries.module.css";
import { applySort, applyTypeFilter } from "./beneficiaries.utils";
import BeneficiariesControls from "./BeneficiariesControls";
import {
  BENEFICIARIES_PAGE_SIZE as PAGE_SIZE,
  BeneficiariesTableHeader,
  BeneficiaryRows,
} from "./BeneficiaryRows";

export default function BeneficiariesList({
  beneficiaries,
  allOrder,
  committeeConstants,
}: {
  beneficiaries: Record<string, Beneficiary>;
  allOrder: string[];
  committeeConstants: Record<string, CommitteeConstant> | null;
}) {
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") ?? "total";
  const type = searchParams.get("type") ?? "all";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);

  const filtered = applyTypeFilter(allOrder, beneficiaries, type);
  const sorted = applySort(filtered, beneficiaries, sort);
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const clampedPage = Math.min(page, Math.max(1, totalPages));
  const paginated = sorted.slice(
    (clampedPage - 1) * PAGE_SIZE,
    clampedPage * PAGE_SIZE,
  );

  function buildPageHref(p: number) {
    const sp = new URLSearchParams(searchParams.toString());
    if (p > 1) {
      sp.set("page", String(p));
    } else {
      sp.delete("page");
    }
    const query = sp.toString();
    return query ? `?${query}` : "?";
  }

  return (
    <>
      <BeneficiariesControls
        sort={sort}
        type={type}
        total={sorted.length}
        page={clampedPage}
        pageSize={PAGE_SIZE}
      />
      <table className={styles.beneficiariesTable}>
        <BeneficiariesTableHeader />
        <tbody>
          <BeneficiaryRows
            ids={paginated}
            beneficiaries={beneficiaries}
            committeeConstants={committeeConstants}
          />
        </tbody>
      </table>
      <Pagination
        page={clampedPage}
        totalPages={totalPages}
        totalItems={sorted.length}
        pageSize={PAGE_SIZE}
        itemLabel="recipients"
        sortLabel={
          sort === "name"
            ? "name"
            : sort === "recent"
              ? "most recent contributions"
              : "total industry contributions"
        }
        hrefs={Array.from({ length: totalPages }, (_, i) =>
          buildPageHref(i + 1),
        )}
      />
    </>
  );
}
