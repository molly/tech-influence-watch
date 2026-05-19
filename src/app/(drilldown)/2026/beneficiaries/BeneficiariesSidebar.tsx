import MaybeLink from "@/app/components/MaybeLink";
import {
  HorizontalBars,
  HorizontalPartyBarsSkeleton,
} from "@/app/components/home/HorizontalPartyBars";
import Skeleton from "@/app/components/skeletons/Skeleton";
import { Beneficiary } from "@/app/types/Beneficiaries";
import { Sector } from "@/app/types/Sector";
import { humanizeApproximateRounded } from "@/app/utils/humanize";
import { getPartyAbbreviation } from "@/app/utils/party";
import { range } from "@/app/utils/range";
import { humanizeSector } from "@/app/utils/sector";
import { titlecaseLastFirst } from "@/app/utils/titlecase";
import { Suspense } from "react";
import styles from "./beneficiaries.module.css";
import {
  DisplayType,
  OfficeBreakdownEntry,
  getCompactRace,
  getOfficeBreakdown,
  getTopCandidates,
  getTypeBreakdown,
} from "./beneficiaries.utils";

const OFFICE_LABELS: Record<string, string> = {
  P: "President",
  S: "Senate",
  H: "House",
};

const TYPE_LABELS: Record<DisplayType, string> = {
  pac: "PAC",
  candidate: "Candidate",
  party: "Party committee",
};

function SidebarSectionHeader({
  title,
  rightLabel,
}: {
  title: string;
  rightLabel?: string;
}) {
  return (
    <div className={styles.sidebarSectionHeader}>
      <h3 className={styles.sidebarSectionTitle}>{title}</h3>
      {rightLabel && (
        <span className={styles.sidebarColumnLabel}>{rightLabel}</span>
      )}
    </div>
  );
}

function TopCandidatesSkeleton() {
  return range(10).map((i) => (
    <div key={i} className={styles.sidebarCandidateRow}>
      <div
        className={`${styles.sidebarPartyBorder} ${styles.partyBorderUnk}`}
      />
      <span className={styles.sidebarCandidateRankSkeleton}>{i + 1}</span>
      <div className={styles.sidebarCandidateInfo}>
        <Skeleton height="1.2rem" randWidth={[4, 8]} />
        <Skeleton height="0.9rem" width="5rem" />
      </div>
      <div className={styles.sidebarCandidateAmount}>
        <Skeleton height="1.2rem" width="4rem" />
      </div>
    </div>
  ));
}

function TopCandidateRow({
  rank,
  beneficiary,
}: {
  rank: number;
  id: string;
  beneficiary: Extract<Beneficiary, { type: "candidate" }>;
}) {
  const partyCode = beneficiary.candidate_details.party ?? "";
  const partyLetter = partyCode ? partyCode[0] : "";
  const partyBorderClass =
    styles[
      `partyBorder${getPartyAbbreviation(partyCode || "U")}` as keyof typeof styles
    ] ?? "";
  const name = titlecaseLastFirst(beneficiary.candidate_details.name);
  const race = getCompactRace(beneficiary.candidate_details);
  const raceHref = beneficiary.candidate_details.race_link
    ? `/2026${beneficiary.candidate_details.race_link}`
    : undefined;

  return (
    <div className={styles.sidebarCandidateRow}>
      <div className={`${styles.sidebarPartyBorder} ${partyBorderClass}`} />
      <span className={styles.sidebarCandidateRank}>{rank}</span>
      <div className={styles.sidebarCandidateInfo}>
        <MaybeLink href={raceHref}>
          <span className={styles.sidebarCandidateName}>{name}</span>
        </MaybeLink>
        {partyLetter && (
          <span className={styles.sidebarCandidateParty}> ({partyLetter})</span>
        )}
        <div className={styles.sidebarCandidateRace}>{race}</div>
      </div>
      <div className={styles.sidebarCandidateAmount}>
        {`$${humanizeApproximateRounded(beneficiary.total, 1)}`}
      </div>
    </div>
  );
}

export default function BeneficiariesSidebar({
  sector,
  beneficiaries,
  allOrder,
}: {
  sector: Sector;
  beneficiaries: Record<string, Beneficiary>;
  allOrder: string[];
}) {
  const topCandidates = getTopCandidates(allOrder, beneficiaries, 10);
  const typeBreakdown = getTypeBreakdown(allOrder, beneficiaries);
  const officeBreakdown = getOfficeBreakdown(allOrder, beneficiaries);

  const officeOrder = ["P", "S", "H"].filter((o) => officeBreakdown[o]);

  return (
    <aside className={styles.sidebarAside}>
      <section className={styles.sidebarSection}>
        <SidebarSectionHeader title="Top candidates" rightLabel="$ Received" />
        <p className={styles.sidebarSubtitle}>
          {`${humanizeSector(sector, { context: "industry", abbrev: true })} contributions to individuals running for federal office,
          including both direct contributions and contributions to their
          affiliated committees.`}
        </p>
        <div className={styles.sidebarCandidateList}>
          <Suspense fallback={<TopCandidatesSkeleton />}>
            {topCandidates.map(({ id, beneficiary }, i) => (
              <TopCandidateRow
                key={id}
                rank={i + 1}
                id={id}
                beneficiary={beneficiary}
              />
            ))}
          </Suspense>
        </div>
      </section>

      {/* By recipient type */}
      <section className={styles.sidebarSection}>
        <SidebarSectionHeader title="By recipient type" />
        <Suspense fallback={<HorizontalPartyBarsSkeleton numBars={3} />}>
          <HorizontalBars
            items={(["pac", "candidate", "party"] as DisplayType[]).map(
              (type) => ({
                key: type,
                label: TYPE_LABELS[type],
                value: typeBreakdown[type],
                displayValue: `$${humanizeApproximateRounded(typeBreakdown[type], 1)}`,
              }),
            )}
          />
        </Suspense>
      </section>

      {/* By office sought */}
      <section className={styles.sidebarSection}>
        <SidebarSectionHeader title="By office sought" />
        <p className={styles.sidebarSubtitle}>
          Crypto and AI industry contributions to candidates' campaigns, grouped
          by the federal office sought.
        </p>
        <Suspense fallback={<HorizontalPartyBarsSkeleton numBars={3} />}>
          <HorizontalBars
            items={officeOrder.map((office) => {
              const label = OFFICE_LABELS[office] ?? office;
              const { total, count } = officeBreakdown[
                office
              ] as OfficeBreakdownEntry;
              return {
                key: office,
                label,
                value: total,
                displayValue: `$${humanizeApproximateRounded(total, 1)}`,
              };
            })}
          />
        </Suspense>
      </section>
    </aside>
  );
}
