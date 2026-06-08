import { hierarchy, pack } from "d3-hierarchy";
import { Suspense } from "react";

import {
  fetchCompanyTotalSpending,
  fetchConstant,
  fetchIndividualTotalSpending,
} from "@/app/actions/fetch";
import sharedStyles from "@/app/shared.module.css";
import { CompanyConstant, CompanyTotals } from "@/app/types/Companies";
import { IndividualConstant, IndividualTotals } from "@/app/types/Individuals";
import { BESector, Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import { formatCompact, humanizeList } from "@/app/utils/humanize";
import { getSectorsForIndividual, matchesSector } from "@/app/utils/sector";

import styles from "./CompanyBubbleChart.module.css";
import CompanyBubbleChartSvg, { Bubble } from "./CompanyBubbleChartSvg";

const SIZE = 400;

type LeafDatum = {
  id: string;
  name: string;
  total: number;
  companySector: BESector | undefined;
  href: string;
  subtitle?: string;
};

// For individual bubbles, build a "Title of Company" line (mirroring the
// connector logic in AssociatedCompanies). Company bubbles have no subtitle.
function individualSubtitle(ind: IndividualConstant): string | undefined {
  const companies = humanizeList(ind.company ?? []) as string | null;
  if (ind.title) {
    if (!companies) {
      return ind.title;
    }
    const connector = ind.title.toLowerCase().includes("partner")
      ? "at"
      : "of";
    return `${ind.title} ${connector} ${companies}`;
  }
  return companies ?? undefined;
}

type RootDatum = {
  children: LeafDatum[];
};

// Break a too-long name across two lines at the most balanced space, but only
// when both resulting lines fit within maxChars. Otherwise fall back to a
// single truncated line.
function wrapLabel(name: string, maxChars: number): string[] {
  if (name.length <= maxChars) {
    return [name];
  }
  const words = name.split(" ");
  if (words.length > 1) {
    let best: { lines: [string, string]; imbalance: number } | null = null;
    for (let i = 1; i < words.length; i++) {
      const first = words.slice(0, i).join(" ");
      const second = words.slice(i).join(" ");
      if (first.length <= maxChars && second.length <= maxChars) {
        const imbalance = Math.abs(first.length - second.length);
        if (best === null || imbalance < best.imbalance) {
          best = { lines: [first, second], imbalance };
        }
      }
    }
    if (best !== null) {
      return best.lines;
    }
  }
  return [name.slice(0, maxChars) + "…"];
}

async function CompanyBubbleChartContent({ sector }: { sector: Sector }) {
  const [allData, companiesData, individualsData, individualTotalsData] =
    await Promise.all([
      fetchCompanyTotalSpending("all"),
      fetchConstant<Record<string, CompanyConstant>>("companies"),
      fetchConstant<Record<string, IndividualConstant>>("individuals"),
      fetchIndividualTotalSpending(),
    ]);

  if (isError(allData) || !companiesData) {
    return null;
  }

  const allTotals = allData as CompanyTotals;
  const companies = companiesData as Record<string, CompanyConstant>;

  const companyEntries: LeafDatum[] = Object.entries(allTotals.by_company).map(
    ([id, data]) => ({
      id,
      name: companies[id]?.name ?? id,
      total: data.total,
      companySector: companies[id]?.sector,
      href: `/2026/companies/${id}`,
    }),
  );

  // Include tracked individuals whose contributions aren't rolled into any
  // tracked company (e.g. Elon Musk, once xAI is removed). The backend
  // attributes an individual's gifts to a company by matching the company's
  // name against the individual's `company` array, so an individual is
  // "standalone" — and thus unrepresented by any company bubble — exactly when
  // none of those names match a tracked company. Showing them here keeps the
  // chart complete without double-counting money already inside a company.
  const trackedCompanyNames = new Set(
    Object.values(companies).map((c) => c.name),
  );
  const individualEntries: LeafDatum[] =
    individualsData && !isError(individualTotalsData)
      ? Object.values(individualsData as Record<string, IndividualConstant>)
          .filter((ind) => {
            const total =
              (individualTotalsData as IndividualTotals).by_individual[ind.id]
                ?.total ?? 0;
            if (total <= 0) {
              return false;
            }
            return !(ind.company ?? []).some((name) =>
              trackedCompanyNames.has(name),
            );
          })
          .map((ind) => ({
            id: ind.id,
            name: ind.name,
            total: (individualTotalsData as IndividualTotals).by_individual[
              ind.id
            ].total,
            companySector: getSectorsForIndividual(ind, companies)[0],
            href: `/2026/individuals/${ind.id}`,
            subtitle: individualSubtitle(ind),
          }))
      : [];

  const entries: LeafDatum[] = [...companyEntries, ...individualEntries]
    .filter((e) => {
      if (e.total <= 0) {
        return false;
      }
      if (sector === "all") {
        return true;
      }
      return matchesSector(e.companySector, sector);
    })
    .sort((a, b) => b.total - a.total);

  if (entries.length === 0) {
    return null;
  }

  // Rank and share are relative to the entities currently shown (entries are
  // sorted descending, so rank is index + 1).
  const totalEntities = entries.length;
  const grandTotal = entries.reduce((sum, e) => sum + e.total, 0);
  const rankById = new Map(entries.map((e, i) => [e.id, i + 1]));

  const maxTotal = entries[0].total;
  const minValue = maxTotal * 0.004;

  const root = hierarchy<RootDatum | LeafDatum>({
    children: entries,
  } as RootDatum).sum((d) => ("total" in d ? Math.max(d.total, minValue) : 0));

  const packed = pack<RootDatum | LeafDatum>().size([SIZE, SIZE]).padding(2)(
    root,
  );

  const leaves = packed.leaves();

  const bubbles: Bubble[] = leaves.map((leaf) => {
    const d = leaf.data as LeafDatum;
    const r = leaf.r;
    const fontSize = Math.min(11, r * 0.32);
    const showLabel = r >= 10;
    const showAmount = r >= 30;
    const maxChars = Math.floor((1.7 * r) / (fontSize * 0.6));
    const amountFontSize = fontSize * 0.85;

    // Stack the (optionally two-line) label and the amount as vertically
    // centered lines, with a tighter gap between wrapped label lines than
    // before the amount.
    const lines: { text: string; size: number; kind: "label" | "amount" }[] =
      [];
    if (showLabel) {
      for (const text of wrapLabel(d.name, maxChars)) {
        lines.push({ text, size: fontSize, kind: "label" });
      }
    }
    if (showAmount) {
      lines.push({
        text: formatCompact(d.total),
        size: amountFontSize,
        kind: "amount",
      });
    }
    const gapBefore = (i: number): number => {
      if (i === 0) {
        return 0;
      }
      return lines[i].kind === "amount" ? fontSize * 0.6 : fontSize * 0.15;
    };
    const totalHeight = lines.reduce(
      (h, line, i) => h + gapBefore(i) + line.size,
      0,
    );
    let cursor = leaf.y - totalHeight / 2;
    const positioned = lines.map((line, i) => {
      cursor += gapBefore(i) + line.size / 2;
      const y = cursor;
      cursor += line.size / 2;
      return { ...line, y };
    });

    return {
      id: d.id,
      name: d.name,
      total: d.total,
      sector: d.companySector,
      subtitle: d.subtitle,
      rank: rankById.get(d.id) ?? 0,
      totalEntities,
      share: grandTotal > 0 ? (d.total / grandTotal) * 100 : 0,
      href: d.href,
      x: leaf.x,
      y: leaf.y,
      r,
      darkText: d.companySector === "ai",
      lines: positioned,
    };
  });

  return (
    <>
      <CompanyBubbleChartSvg bubbles={bubbles} />
      <div className={styles.legend}>
        {(sector === "all" || sector === "crypto") && (
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.legendDotCrypto}`} />
            Crypto
          </div>
        )}
        {(sector === "all" || sector === "ai") && (
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.legendDotAi}`} />
            AI
          </div>
        )}
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendDotBoth}`} />
          Crypto &amp; AI
        </div>
      </div>
    </>
  );
}

export default function CompanyBubbleChart({ sector }: { sector: Sector }) {
  return (
    <section className={sharedStyles.section}>
      <h2 className={sharedStyles.sectionTitle}>Contributions by entity</h2>
      <Suspense fallback={null}>
        <CompanyBubbleChartContent sector={sector} />
      </Suspense>
    </section>
  );
}
