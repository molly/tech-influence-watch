import Link from "next/link";

import sharedStyles from "@/app/shared.module.css";
import { formatCompact, pluralize } from "@/app/utils/humanize";

import type {
  NetworkAffiliatedOrgResolved,
  NetworkData,
  NetworkMember,
  NetworkRole,
} from "./networkData";
import styles from "./NetworkDetail.module.css";

function pacTypeLabel(member: NetworkMember): string {
  if (member.committee_type === "O") {
    return "Super PAC";
  }
  if (member.committee_type === "V" || member.committee_type === "W") {
    return "Hybrid PAC";
  }
  if (member.designation === "B" || member.organization_type === "C") {
    return "Corporation PAC";
  }
  return "PAC";
}

function partisanLabel(role: NetworkRole | undefined): string | null {
  if (role === "dem") {
    return "Democratic focus";
  }
  if (role === "rep") {
    return "Republican focus";
  }
  return null;
}

function orgRoleLabel(role: NetworkRole | undefined): string | null {
  if (role === "parent") {
    return "Parent";
  }
  return partisanLabel(role);
}

function isParent(member: NetworkMember, leadCommitteeId: string): boolean {
  if (member.role) {
    return member.role === "parent";
  }
  return member.id === leadCommitteeId;
}

function PacCard({
  member,
  isLead,
  partisan,
}: {
  member: NetworkMember;
  isLead: boolean;
  partisan: string | null;
}) {
  const spent = member.independent_expenditures || 0;
  const typeLabel = [
    isLead ? "Lead PAC" : null,
    pacTypeLabel(member),
    isLead ? null : partisan,
    member.id,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className={styles.pacCard}>
      <div className={styles.pacName}>
        <Link href={`/2026/committees/${member.id}`}>{member.name}</Link>
      </div>
      <div className={styles.pacFinancials}>
        <div className={styles.pacRaised}>
          {formatCompact(member.total_contributed)}
        </div>
        <div className={styles.pacRaisedLabel}>
          {spent > 0
            ? `raised · ${formatCompact(spent)} spent`
            : "raised this cycle"}
        </div>
      </div>
      <div className={styles.pacType}>{typeLabel}</div>
      {member.description && (
        <div
          className={styles.pacDesc}
          dangerouslySetInnerHTML={{ __html: member.description }}
        ></div>
      )}
    </div>
  );
}

function OrgCard({ org }: { org: NetworkAffiliatedOrgResolved }) {
  const typeLabel = [
    orgRoleLabel(org.role),
    org.type,
    org.type === "501(c)(4)" ? "Dark money" : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className={`${styles.pacCard} ${styles.pacCardOrg}`}>
      <div className={styles.pacName}>
        {org.href ? <Link href={org.href}>{org.name}</Link> : org.name}
      </div>
      <div className={styles.pacFinancials}>
        {org.reportedTotal ? (
          <>
            <div className={styles.pacRaised}>
              {formatCompact(org.reportedTotal)}
            </div>
            <div className={styles.pacRaisedLabel}>
              reported{org.reportedDonors?.length ? ` · from ${org.reportedDonors.join(", ")}` : ""}
            </div>
          </>
        ) : (
          <>
            <div className={styles.pacRaised}>Undisclosed</div>
            <div className={styles.pacRaisedLabel}>not publicly reported</div>
          </>
        )}
      </div>
      {typeLabel && <div className={styles.pacType}>{typeLabel}</div>}
    </div>
  );
}

export default function NetworkHeader({ data }: { data: NetworkData }) {
  const { network, members, affiliatedOrgs } = data;
  const summaryParts = [
    members.length > 0
      ? pluralize(members.length, "committee", { includeValue: true })
      : null,
    affiliatedOrgs.length > 0
      ? pluralize(affiliatedOrgs.length, "affiliated organization", {
          includeValue: true,
        })
      : null,
  ].filter(Boolean);

  return (
    <div className={`${styles.header} ${sharedStyles.flushTop}`}>
      <div className={styles.headerGrid}>
        <div className={styles.headerLeft}>
          <nav className={styles.crumbs} aria-label="Breadcrumb">
            <span>Spending</span>
            <span className={styles.crumbSep}>/</span>
            <Link href="/2026/committees">Committees</Link>
            <span className={styles.crumbSep}>/</span>
            <Link href="/2026/networks">Networks</Link>
            <span className={styles.crumbSep}>/</span>
            <span>{network.name}</span>
          </nav>
          <h1 className={styles.title}>{network.name}</h1>
          <div className={styles.chips}>
            <span className={`${styles.chip} ${styles.chipNetwork}`}>
              Network
            </span>
            <span className={styles.chip}>
              {network.sector === "ai" ? "AI" : network.sector}
            </span>
          </div>
          <div
            className={styles.lede}
            dangerouslySetInnerHTML={{ __html: network.description }}
          ></div>
        </div>

        <div className={styles.headerRight}>
          {summaryParts.length > 0 && (
            <div className={styles.membersLabel}>
              {summaryParts.join(" · ")}
            </div>
          )}

          {members.length > 0 && (
            <div className={styles.membersSection}>
              <div className={styles.membersSectionLabel}>PACs</div>
              {members.map((member) => {
                const isLead = isParent(member, network.leadCommitteeId);
                const partisan =
                  partisanLabel(member.role) ??
                  (member.role == null
                    ? data.memberNotesById[member.id] ?? null
                    : null);
                return (
                  <PacCard
                    key={member.id}
                    member={member}
                    isLead={isLead}
                    partisan={partisan}
                  />
                );
              })}
            </div>
          )}

          {affiliatedOrgs.length > 0 && (
            <div className={styles.membersSection}>
              <div className={styles.membersSectionLabel}>
                Affiliated organizations
              </div>
              {affiliatedOrgs.map((org) => (
                <OrgCard key={org.id} org={org} />
              ))}
            </div>
          )}

          {members.length === 0 && affiliatedOrgs.length === 0 && (
            <p className={`secondary italic ${sharedStyles.noMargin}`}>
              No tracked members yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
