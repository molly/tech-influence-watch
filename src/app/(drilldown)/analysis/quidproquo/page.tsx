import type { Metadata } from "next";
import Link from "next/link";
import React, { Suspense } from "react";

import { fetchQpq } from "@/app/actions/fetch";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import ErrorText from "@/app/components/ErrorText";
import ExternalLinkIcon from "@/app/components/ExternalLinkIcon";
import MoneyCard from "@/app/components/MoneyCard";
import Skeleton from "@/app/components/skeletons/Skeleton";
import tableStyles from "@/app/components/tables.module.css";
import sharedStyles from "@/app/shared.module.css";
import { QPQ } from "@/app/types/Qpq";
import { isError } from "@/app/utils/errors";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";
import { customMetadata } from "@/app/utils/metadata";
import {
  getQpqCompanyId,
  getQpqContribMaps,
  getQpqEntryTotal,
  getQpqGrandTotal,
  getQpqTrumpTotal,
  type QpqContribMaps,
} from "@/app/utils/qpq";
import { range } from "@/app/utils/range";
import {
  getTrumpCombinedDonors,
  type TrumpCombinedDonorsData,
} from "@/app/utils/trumpCombinedDonors";

import styles from "./page.module.css";

export const metadata: Metadata = customMetadata({
  title: "Quid pro quo",
  description:
    "Companies are reaping the benefits of their contributions to Trump and other politicians.",
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
  const [maps, qpqData] = await Promise.all([getQpqContribMaps(), fetchQpq()]);

  if (isError(maps) || !qpqData) {
    return <ErrorText subject="contribution data" />;
  }

  const contribMaps = maps as QpqContribMaps;

  const hasContributions = (entry: QPQ): boolean => {
    const manualContributions =
      "contributions" in entry && entry.contributions
        ? entry.contributions
        : [];
    if (manualContributions.length > 0) {
      return true;
    }
    if (getQpqTrumpTotal(entry, contribMaps) >= 10000) {
      return true;
    }
    const companyId = getQpqCompanyId(entry);
    if (companyId === null) {
      return false;
    }
    return (
      (contribMaps.crypto.get(companyId) ?? 0) >= 10000 ||
      (contribMaps.senate.get(companyId) ?? 0) >= 10000 ||
      (contribMaps.house.get(companyId) ?? 0) >= 10000
    );
  };

  const sortedQpq = (Object.entries(qpqData) as [string, QPQ][]).sort(
    ([, a], [, b]) => {
      const aHas = hasContributions(a);
      const bHas = hasContributions(b);
      if (aHas !== bHas) {
        return aHas ? -1 : 1;
      }
      const aAmount = getQpqEntryTotal(a, contribMaps);
      const bAmount = getQpqEntryTotal(b, contribMaps);
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

    const companyId = getQpqCompanyId(entry);

    const trumpTotal = getQpqTrumpTotal(entry, contribMaps);
    if (trumpTotal && trumpTotal >= 10000) {
      allItems.push({
        amount: trumpTotal,
        jsx: (
          <li key="trump-fec">
            <strong>
              {humanizeRoundedCurrency(Math.floor(trumpTotal / 10000) * 10000)}
            </strong>{" "}
            to Trump&rsquo;s campaign, inauguration, and pro-Trump PACs (since
            2024)
          </li>
        ),
      });
    }

    const cryptoTotal =
      companyId !== null ? contribMaps.crypto.get(companyId) : undefined;
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
      companyId !== null ? contribMaps.senate.get(companyId) : undefined;
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
      companyId !== null ? contribMaps.house.get(companyId) : undefined;
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
          const total = getQpqEntryTotal(entry, contribMaps);
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

export default async function QuidProQuoPage() {
  const [combinedDonors, maps, qpqData] = await Promise.all([
    getTrumpCombinedDonors(),
    getQpqContribMaps(),
    fetchQpq(),
  ]);
  const trumpTotal = isError(combinedDonors)
    ? null
    : humanizeRoundedCurrency(
        (combinedDonors as TrumpCombinedDonorsData).grandTotal,
        true,
        1,
      );
  const grandTotal =
    isError(maps) || !qpqData
      ? null
      : getQpqGrandTotal(
          Object.values(qpqData) as QPQ[],
          maps as QpqContribMaps,
        );
  return (
    <div className={styles.page}>
      <Breadcrumbs crumbs={["Analysis", "Quid pro quo"]} />
      <h1 className={sharedStyles.title}>Quid pro quo</h1>
      <section className={sharedStyles.heroWithStat}>
        <div>
          <p className={sharedStyles.headerSubtitle}>
            Companies are reaping the benefits of their contributions to
            President Trump and other politicians.
          </p>
          <div className={sharedStyles.noteCard}>
            <span className={sharedStyles.noteLabel}>Note:</span> This page
            tracks contributions from and business arrangements between
            companies and President Trump, and favorable regulatory outcomes
            that followed. For a focused view of the industries&rsquo;{" "}
            {trumpTotal ? (
              <span
                className={sharedStyles.highlightFigure}
              >{`${trumpTotal} in campaign contributions`}</span>
            ) : (
              "campaign contributions"
            )}{" "}
            to Trump, see the{" "}
            <Link href="/analysis/trump" className="bold">
              Trump campaign contributions tracker
            </Link>
            .
          </div>
        </div>
        {grandTotal !== null && (
          <MoneyCard
            className={styles.headerStat}
            topText="Total to Trump &amp; family"
            amount={`${humanizeRoundedCurrency(grandTotal, true, 1)}+`}
            bottomText="in campaign contributions and business arrangements"
          />
        )}
      </section>
      <Suspense fallback={<QuidProQuoTableSkeleton />}>
        <QuidProQuoTable />
      </Suspense>
    </div>
  );
}
