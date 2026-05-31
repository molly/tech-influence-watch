import type { Metadata } from "next";
import Link from "next/link";
import React, { Suspense } from "react";

import {
  fetchBeneficiaries,
  fetchConstant,
  fetchTrumpCommittees,
} from "@/app/actions/fetch";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import ErrorText from "@/app/components/ErrorText";
import ExternalLinkIcon from "@/app/components/ExternalLinkIcon";
import Skeleton from "@/app/components/skeletons/Skeleton";
import tableStyles from "@/app/components/tables.module.css";
import { qpqData } from "@/app/data/qpq";
import { TRUMP_CANDIDATE_ID } from "@/app/data/trump";
import sharedStyles from "@/app/shared.module.css";
import {
  type Beneficiary,
  type CompanyContributionGroup,
} from "@/app/types/Beneficiaries";
import { QPQ } from "@/app/types/Qpq";
import { isError } from "@/app/utils/errors";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";
import { customMetadata } from "@/app/utils/metadata";
import { range } from "@/app/utils/range";

import styles from "./page.module.css";

export const metadata: Metadata = customMetadata({
  title: "Quid Pro Quo",
  description:
    "Cryptocurrency companies are reaping the benefits of their contributions to Trump and other pro-crypto politicians.",
});

function QuidProQuoTableSkeleton() {
  return (
    <table className={styles.qpqTable}>
      <thead>
        <tr>
          <th className={styles.entityCell}>Entity</th>
          <th>Benefit to entity</th>
          <th>Benefit to Trump and family</th>
        </tr>
      </thead>
      <tbody>
        {range(8).map((i) => (
          <tr key={i} className={`${tableStyles.qpqRow} ${styles.qpqRow}`}>
            <td className={styles.entityCell}>
              <Skeleton randWidth={[5, 9]} />
            </td>
            <td className={styles.benefitCell}>
              <Skeleton randWidth={[8, 16]} />
            </td>
            <td className={styles.benefitCell}>
              <Skeleton randWidth={[6, 12]} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

async function QuidProQuoTable() {
  const [
    beneficiariesResult,
    trumpCommitteesData,
    committeesConstant,
    senateConstant,
    houseConstant,
  ] = await Promise.all([
    fetchBeneficiaries(),
    fetchTrumpCommittees(),
    fetchConstant<Record<string, { id: string; name: string }>>("committees"),
    fetchConstant<{ ids: string[] }>("senateCommittees"),
    fetchConstant<{ ids: string[] }>("houseCommittees"),
  ]);

  const cryptoCommitteeIds = new Set(
    committeesConstant ? Object.keys(committeesConstant) : [],
  );
  const senateCommitteeIds = new Set(senateConstant?.ids ?? []);
  const houseCommitteeIds = new Set(houseConstant?.ids ?? []);

  const companyIdAliases: Record<string, string> = {
    "winklevoss-capital-management": "gemini",
  };

  const resolveCompanyId = (id: string): string => companyIdAliases[id] ?? id;

  const trumpCommitteeIds = new Set<string>([
    TRUMP_CANDIDATE_ID,
    ...(trumpCommitteesData?.ids ?? []),
  ]);

  if (isError(beneficiariesResult)) {
    return <ErrorText subject="contribution data" />;
  }

  const beneficiaries = beneficiariesResult as Record<string, Beneficiary>;
  const trumpContribsByCompany = new Map<string, number>();
  const cryptoContribsByCompany = new Map<string, number>();
  const senateContribsByCompany = new Map<string, number>();
  const houseContribsByCompany = new Map<string, number>();

  for (const [id, beneficiary] of Object.entries(beneficiaries)) {
    const isTrump = trumpCommitteeIds.has(id);
    const targetMap = isTrump
      ? trumpContribsByCompany
      : cryptoCommitteeIds.has(id)
        ? cryptoContribsByCompany
        : senateCommitteeIds.has(id)
          ? senateContribsByCompany
          : houseCommitteeIds.has(id)
            ? houseContribsByCompany
            : null;

    if (targetMap) {
      for (const group of beneficiary.contributions as CompanyContributionGroup[]) {
        const companyId = resolveCompanyId(group.company_id);
        const existing = targetMap.get(companyId) || 0;
        targetMap.set(companyId, existing + group.total);
      }
    }
  }

  const getCompanyId = (entry: QPQ): string | null => {
    if (!entry.link) {
      return null;
    }
    const match = entry.link.match(/^\/2026\/companies\/(.+)$/);
    return match ? match[1] : null;
  };

  const getTotalAmount = (entry: QPQ): number => {
    const manualAmount =
      "contributions" in entry && entry.contributions
        ? entry.contributions.reduce(
            (acc, curr) => acc + ("amount" in curr ? curr.amount || 0 : 0),
            0,
          )
        : 0;
    const companyId = getCompanyId(entry);
    const trumpTotal =
      companyId !== null ? (trumpContribsByCompany.get(companyId) ?? 0) : 0;
    const cryptoTotal =
      companyId !== null ? (cryptoContribsByCompany.get(companyId) ?? 0) : 0;
    const senateTotal =
      companyId !== null ? (senateContribsByCompany.get(companyId) ?? 0) : 0;
    const houseTotal =
      companyId !== null ? (houseContribsByCompany.get(companyId) ?? 0) : 0;
    return manualAmount + trumpTotal + cryptoTotal + senateTotal + houseTotal;
  };

  const hasContributions = (entry: QPQ): boolean => {
    const manualContributions =
      "contributions" in entry && entry.contributions
        ? entry.contributions
        : [];
    if (manualContributions.length > 0) {
      return true;
    }
    const companyId = getCompanyId(entry);
    if (companyId === null) {
      return false;
    }
    return (
      (trumpContribsByCompany.get(companyId) ?? 0) >= 10000 ||
      (cryptoContribsByCompany.get(companyId) ?? 0) >= 10000 ||
      (senateContribsByCompany.get(companyId) ?? 0) >= 10000 ||
      (houseContribsByCompany.get(companyId) ?? 0) >= 10000
    );
  };

  const sortedQpq = (Object.entries(qpqData) as [string, QPQ][]).sort(
    ([, a], [, b]) => {
      const aHas = hasContributions(a);
      const bHas = hasContributions(b);
      if (aHas !== bHas) {
        return aHas ? -1 : 1;
      }
      const aAmount = getTotalAmount(a);
      const bAmount = getTotalAmount(b);
      if (aAmount === bAmount) {
        return a.name.localeCompare(b.name);
      }
      return bAmount - aAmount;
    },
  );

  const renderName = (entry: QPQ) => {
    if (entry.link) {
      return <Link href={entry.link}>{entry.name}</Link>;
    }
    return entry.name;
  };

  const renderBenefit = (entry: QPQ) => {
    return entry.benefits.map((benefit) => {
      const text = typeof benefit === "string" ? benefit : benefit.text;
      const link = typeof benefit === "string" ? undefined : benefit.link;
      return (
        <li key={text}>
          <span dangerouslySetInnerHTML={{ __html: text }} />
          {link && (
            <span className={styles.noBreak}>
              {" "}
              <a href={link} target="_blank" rel="noreferrer">
                <ExternalLinkIcon />
              </a>
            </span>
          )}
        </li>
      );
    });
  };

  const renderContribution = (entry: QPQ) => {
    type Item = { amount?: number; jsx: React.ReactElement };

    const manualContributions =
      "contributions" in entry && entry.contributions
        ? entry.contributions
        : [];

    const allItems: Item[] = manualContributions.map((contribution) => {
      const linkMarker = contribution.link ? (
        <span className={styles.noBreak}>
          {" "}
          <a href={contribution.link} target="_blank" rel="noreferrer">
            <ExternalLinkIcon />
          </a>
        </span>
      ) : null;
      if (contribution.amount) {
        return {
          amount: contribution.amount,
          jsx: (
            <li key={contribution.recipient}>
              <strong>{humanizeRoundedCurrency(contribution.amount)}</strong>{" "}
              {contribution.recipient}
              {linkMarker}
            </li>
          ),
        };
      }
      return {
        jsx: (
          <li key={contribution.benefit}>
            {contribution.benefit}
            {linkMarker}
          </li>
        ),
      };
    });

    const companyId = getCompanyId(entry);

    const trumpTotal =
      companyId !== null ? trumpContribsByCompany.get(companyId) : undefined;
    if (trumpTotal && trumpTotal >= 10000) {
      allItems.push({
        amount: trumpTotal,
        jsx: (
          <li key="trump-fec">
            <strong>
              {humanizeRoundedCurrency(Math.floor(trumpTotal / 10000) * 10000)}
            </strong>{" "}
            to Trump-affiliated PACs (2026 cycle)
          </li>
        ),
      });
    }

    const cryptoTotal =
      companyId !== null ? cryptoContribsByCompany.get(companyId) : undefined;
    if (cryptoTotal && cryptoTotal >= 10000) {
      allItems.push({
        amount: cryptoTotal,
        jsx: (
          <li key="crypto-fec">
            <strong>
              {humanizeRoundedCurrency(Math.floor(cryptoTotal / 10000) * 10000)}
            </strong>{" "}
            to crypto-focused super PACs (2026 cycle)
          </li>
        ),
      });
    }

    const senateTotal =
      companyId !== null ? senateContribsByCompany.get(companyId) : undefined;
    if (senateTotal && senateTotal >= 10000) {
      allItems.push({
        amount: senateTotal,
        jsx: (
          <li key="senate-fec">
            <strong>
              {humanizeRoundedCurrency(Math.floor(senateTotal / 10000) * 10000)}
            </strong>{" "}
            to Senate super PACs (2026 cycle)
          </li>
        ),
      });
    }

    const houseTotal =
      companyId !== null ? houseContribsByCompany.get(companyId) : undefined;
    if (houseTotal && houseTotal >= 10000) {
      allItems.push({
        amount: houseTotal,
        jsx: (
          <li key="house-fec">
            <strong>
              {humanizeRoundedCurrency(Math.floor(houseTotal / 10000) * 10000)}
            </strong>{" "}
            to House super PACs (2026 cycle)
          </li>
        ),
      });
    }

    allItems.sort((a, b) => {
      if (a.amount !== undefined && b.amount !== undefined) {
        return b.amount - a.amount;
      }
      if (a.amount !== undefined) {
        return -1;
      }
      if (b.amount !== undefined) {
        return 1;
      }
      return 0;
    });

    return allItems.map((item) => item.jsx);
  };

  return (
    <table className={styles.qpqTable}>
      <thead>
        <tr>
          <th className={styles.entityCell}>Entity</th>
          <th>Benefit to entity</th>
          <th>Benefit to Trump and family</th>
        </tr>
      </thead>
      <tbody>
        {sortedQpq.map(([slug, entry]) => {
          const contributions = renderContribution(entry);
          const total = getTotalAmount(entry);
          return (
            <tr
              key={slug}
              id={slug}
              className={`${tableStyles.qpqRow} ${styles.qpqRow}`}
            >
              <td className={styles.entityCell}>
                <div className={styles.entityName}>{renderName(entry)}</div>
                {total > 0 && (
                  <div className={styles.totalAmount}>
                    {humanizeRoundedCurrency(total, true, 2)}
                  </div>
                )}
                <div className={styles.entityLabel}>To Trump & family</div>
              </td>
              <td className={styles.benefitCell} data-label="Benefit to entity">
                <ul>{renderBenefit(entry)}</ul>
              </td>
              <td
                className={styles.benefitCell}
                data-label="Benefit to Trump and family"
              >
                {contributions.length > 0 && <ul>{contributions}</ul>}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default function QuidProQuoPage() {
  return (
    <div className={styles.page}>
      <Breadcrumbs crumbs={["Influence", "Quid pro quo"]} />
      <h1 className={sharedStyles.title}>Quid pro quo</h1>
      <p className={sharedStyles.headerSubtitle}>
        Cryptocurrency companies are reaping the benefits of their contributions
        to President Trump and other pro-crypto politicians.
      </p>
      <Suspense fallback={<QuidProQuoTableSkeleton />}>
        <QuidProQuoTable />
      </Suspense>
    </div>
  );
}
