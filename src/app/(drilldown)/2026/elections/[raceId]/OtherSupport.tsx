import Link from "next/link";

import {
  fetchBeneficiaries,
  fetchConstant,
  fetchElection,
} from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import sharedStyles from "@/app/shared.module.css";
import {
  Beneficiary,
  BeneficiaryContribution,
  CompanyContributionGroup,
} from "@/app/types/Beneficiaries";
import { ElectionGroup } from "@/app/types/Elections";
import { Sector } from "@/app/types/Sector";
import { is4xx, isError } from "@/app/utils/errors";
import { humanizeList, humanizeNumber, pluralize } from "@/app/utils/humanize";
import { humanizeSector } from "@/app/utils/sector";
import {
  titlecaseCommittee,
  titlecaseLastFirst,
  titlecaseOccupation,
} from "@/app/utils/titlecase";
import { formatCurrency } from "@/app/utils/utils";

import styles from "./page.module.css";

function SectorBar({
  contributions,
  total,
}: {
  contributions: CompanyContributionGroup[];
  total: number;
}) {
  if (contributions.length === 0 || total === 0) {
    return null;
  }

  const techTotal = contributions
    .filter((g) => g.sector === "tech" || !g.sector)
    .reduce((sum, g) => sum + g.total, 0);
  const cryptoTotal = contributions
    .filter((g) => g.sector === "crypto")
    .reduce((sum, g) => sum + g.total, 0);
  const aiTotal = contributions
    .filter((g) => g.sector === "ai")
    .reduce((sum, g) => sum + g.total, 0);

  const sectors = [
    {
      key: "crypto",
      label: "Crypto",
      value: cryptoTotal,
      className: styles.sectorBarCrypto,
    },
    { key: "ai", label: "AI", value: aiTotal, className: styles.sectorBarAi },
    {
      key: "tech",
      label: "Both",
      value: techTotal,
      className: styles.sectorBarTech,
    },
  ].filter((s) => s.value > 0);

  if (sectors.length <= 1) {
    return null;
  }

  return (
    <div className={styles.sectorBarWrapper}>
      <div className={styles.sectorBarTrack}>
        {sectors.map((seg) => (
          <div
            key={seg.key}
            className={`${styles.sectorBarSegment} ${seg.className}`}
            style={{ flexGrow: seg.value }}
          />
        ))}
      </div>
      <div className={styles.sectorBarLegend}>
        {sectors.map((seg) => {
          const pct = Math.round((seg.value / total) * 100);
          return (
            <div key={seg.key} className={styles.sectorBarLegendItem}>
              <div className={`${styles.sectorBarSwatch} ${seg.className}`} />
              <span>
                {seg.label}: {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SupportBar({
  contributions,
  total,
}: {
  contributions: CompanyContributionGroup[];
  total: number;
}) {
  if (contributions.length === 0 || total === 0) {
    return null;
  }

  const labeledGroups = contributions.filter((g) => g.total / total > 0.1);

  return (
    <div className={styles.supportBarWrapper}>
      <div className={styles.supportBarLabels}>
        {labeledGroups.map((seg) => {
          const pct = Math.round((seg.total / total) * 100);
          return (
            <div
              key={seg.company_id}
              className={styles.supportBarLabel}
              style={{ width: `${(seg.total / total) * 100}%` }}
            >
              <div className={styles.supportBarLabelName}>
                {seg.company_name}
              </div>
              <div className={styles.supportBarLabelPct}>{pct}%</div>
            </div>
          );
        })}
      </div>
      <div className={styles.supportBarTrack}>
        {(() => {
          const shown = contributions.filter((g) => g.total / total >= 0.01);
          const grouped = contributions.filter((g) => g.total / total < 0.01);
          const groupedTotal = grouped.reduce((sum, g) => sum + g.total, 0);

          type SecondaryItem = {
            key: string;
            name: string;
            segTotal: number;
            hasLabel: boolean;
          };
          const secondaryItems: SecondaryItem[] = [
            ...shown.slice(1).map((g) => ({
              key: g.company_id,
              name: g.company_name,
              segTotal: g.total,
              hasLabel: g.total / total > 0.1,
            })),
            ...(grouped.length > 0
              ? [
                  {
                    key: "others",
                    name: `${humanizeNumber(grouped.length)} ${pluralize(grouped.length, "other")}`,
                    segTotal: groupedTotal,
                    hasLabel: false,
                  },
                ]
              : []),
          ];
          const secCount = secondaryItems.length;

          return (
            <>
              {shown[0] &&
                (() => {
                  const g = shown[0];
                  const pct = Math.round((g.total / total) * 100);
                  return (
                    <div
                      key={g.company_id}
                      className={`${styles.supportBarSegment} ${styles.supportBarSegmentPrimary}`}
                      style={{ flexGrow: g.total }}
                      data-title={
                        g.total / total > 0.1
                          ? undefined
                          : `${g.company_name}: ${pct}%`
                      }
                    />
                  );
                })()}
              {secondaryItems.map((seg, j) => {
                const t = secCount <= 1 ? 0 : j / (secCount - 1);
                const lightness = 35 + t * 40;
                const pct = Math.round((seg.segTotal / total) * 100);
                return (
                  <div
                    key={seg.key}
                    className={styles.supportBarSegment}
                    style={{
                      flexGrow: seg.segTotal,
                      backgroundColor: `oklch(${lightness}% 0 0)`,
                    }}
                    data-title={
                      seg.hasLabel ? undefined : `${seg.name}: ${pct}%`
                    }
                  />
                );
              })}
            </>
          );
        })()}
      </div>
    </div>
  );
}

function Contribution({
  contribution,
  individualAliases,
}: {
  contribution: BeneficiaryContribution;
  individualAliases: Record<string, string>;
}) {
  let contributorName = null;
  if (contribution.contributor_name) {
    const individualId =
      contribution.individual ??
      individualAliases[contribution.contributor_name];
    if (contribution.isIndividual && individualId) {
      contributorName = (
        <Link href={`/2026/individuals/${individualId}`}>
          {titlecaseLastFirst(contribution.contributor_name)}
        </Link>
      );
    } else if (contribution.isIndividual) {
      contributorName = titlecaseLastFirst(contribution.contributor_name);
    } else {
      contributorName = titlecaseCommittee(contribution.contributor_name);
    }
  }

  const committeeNames = contribution.committees.length
    ? humanizeList(
        contribution.committees.map((c) => titlecaseCommittee(c.name)),
      )
    : null;

  const occupation = [
    contribution.contributor_occupation
      ? titlecaseOccupation(contribution.contributor_occupation)
      : null,
    contribution.individual_employer ?? null,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <li className={styles.otherSupportContribution}>
      <span className={styles.contributionLeft}>
        {contributorName && (
          <span className={styles.contributionName}>{contributorName}</span>
        )}
        {occupation && <span className="secondary"> ({occupation})</span>}
      </span>
      <span className={styles.contributionRight}>
        <span className={styles.contributionAmount}>
          {formatCurrency(contribution.total)}
        </span>
        {committeeNames && (
          <span className={styles.contributionVia}> via {committeeNames}</span>
        )}
      </span>
    </li>
  );
}

function CompanyGroup({
  group,
  individualAliases,
  sector,
}: {
  group: CompanyContributionGroup;
  individualAliases: Record<string, string>;
  sector: Sector;
}) {
  return (
    <div className={styles.companyGroup}>
      <div className={styles.companyGroupHeader}>
        <span>
          <Link
            href={
              group.individual_id
                ? `/2026/individuals/${group.individual_id}`
                : `/2026/companies/${group.company_id}`
            }
            className={styles.companyGroupName}
          >
            {group.company_name}
          </Link>
          {sector === "all" && group.sector && group.sector !== "tech" && (
            <span className={sharedStyles.sectorBadge}>
              {group.sector === "ai" ? "AI" : group.sector}
            </span>
          )}
        </span>
        <span className={styles.companyGroupAmount}>
          {formatCurrency(group.total, true)}
        </span>
      </div>
      <ul className={styles.otherSupportContributions}>
        {group.contributions.map((contribution, ind) => (
          <Contribution
            key={`${group.company_id}-${ind}`}
            contribution={contribution}
            individualAliases={individualAliases}
          />
        ))}
      </ul>
    </div>
  );
}

export default async function OtherSupport({
  raceId,
  sector,
}: {
  raceId: string;
  sector: Sector;
}) {
  const humanizedSector = humanizeSector(sector, {
    context: "industry",
    lowercase: true,
    or: true,
  });
  const [electionData, beneficiaryData, individualAliases] = await Promise.all([
    fetchElection(raceId),
    fetchBeneficiaries(sector),
    fetchConstant<Record<string, string>>("individualAliases"),
  ]);
  if (isError(electionData) || isError(beneficiaryData)) {
    if (is4xx(electionData) || is4xx(beneficiaryData)) {
      return (
        <span className={sharedStyles.subtitle}>
          No other support from {humanizedSector}-associated companies or
          individuals has been recorded for this election.
        </span>
      );
    }
    return <ErrorText subject="other candidate support" />;
  }
  const election = electionData as ElectionGroup;
  const beneficiaries = beneficiaryData as Record<string, Beneficiary>;

  const supportedCandidates = Object.values(election.candidates)
    .filter(
      (c) =>
        c.has_non_pac_support &&
        c.candidate_id &&
        c.candidate_id in beneficiaries,
    )
    .sort((a, b) => {
      const aTotal = beneficiaries[a.candidate_id!].total;
      const bTotal = beneficiaries[b.candidate_id!].total;
      return bTotal - aTotal;
    });

  if (supportedCandidates.length === 0) {
    return (
      <span className={sharedStyles.subtitle}>
        No other support from {humanizedSector}-associated companies or
        individuals has been recorded for this election.
      </span>
    );
  }

  return (
    <div>
      <span className={sharedStyles.subtitle}>
        {humanizeSector(sector, { hyphen: true })}related companies and
        individuals associated with{" "}
        {sector === "all" ? "those industries" : "the industry"} have also
        supported candidates in this race more directly without going through
        industry-focused PACs. Direct contributions are not tied to a specific
        sub-race.
      </span>
      {supportedCandidates.map((c) => {
        if (!c.candidate_id) {
          return null;
        }
        const beneficiary = beneficiaries[c.candidate_id];
        const companyCount = beneficiary.contributions.length;
        return (
          <section key={c.candidate_id} className={styles.otherSupportSection}>
            <h3 className={styles.otherSupportCandidateHeading}>
              {c.common_name}
              {c.party && <span className="secondary"> ({c.party})</span>}
            </h3>
            <div className={styles.otherSupportTotal}>
              <strong>{formatCurrency(beneficiary.total, true)}</strong>
              <em>
                {` total from ${humanizeNumber(companyCount)} ${humanizeSector(sector, { lowercase: true, or: true })} ${pluralize(companyCount, "company", { plural: "companies" })} and associated people`}
              </em>
            </div>
            <div className={styles.vizGroup}>
              {sector === "all" && (
                <>
                  <div className={styles.vizHeader}>By sector</div>
                  <SectorBar
                    contributions={beneficiary.contributions}
                    total={beneficiary.total}
                  />
                </>
              )}
              <div className={styles.vizHeader}>By contributor</div>
              <SupportBar
                contributions={beneficiary.contributions}
                total={beneficiary.total}
              />
            </div>
            {beneficiary.contributions.map((group) => (
              <CompanyGroup
                key={`${c.candidate_id}-${group.company_id}`}
                group={group}
                individualAliases={individualAliases ?? {}}
                sector={sector}
              />
            ))}
          </section>
        );
      })}
      <div className={sharedStyles.subtitle}>
        Other support to a candidate may exceed the amounts shown in the
        &ldquo;Money involved in this election&rdquo; chart if funds have been
        contributed to a super PAC aligned with a candidate, but the PAC has not
        yet spent the funds.
      </div>
    </div>
  );
}
