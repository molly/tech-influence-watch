import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import SpendingByPartyWithOpposition from "@/app/components/SpendingByPartyWithOpposition";
import { NETWORKS } from "@/app/data/networks";
import sharedStyles from "@/app/shared.module.css";
import { formatCompact, pluralize } from "@/app/utils/humanize";
import { customMetadata } from "@/app/utils/metadata";

import NetworkByCandidate from "./NetworkByCandidate";
import { getNetworkData, NetworkData } from "./networkData";
import styles from "./NetworkDetail.module.css";
import NetworkHeader from "./NetworkHeader";
import NetworkTopDonors from "./NetworkTopDonors";

export function generateStaticParams() {
  return NETWORKS.map((network) => ({ network: network.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ network: string }>;
}): Promise<Metadata> {
  const { network: networkId } = await params;
  const network = NETWORKS.find((n) => n.id === networkId);
  if (!network) {
    return customMetadata({
      title: "Network not found",
      description: "This PAC network could not be found.",
    });
  }
  return customMetadata({
    title: `${network.name} network`,
    description: `Committees, donors, and election spending across the ${network.name} PAC network.`,
  });
}

function StatBand({ data }: { data: NetworkData }) {
  const { members, raised, spent, cashOnHand, expenditureCount } = data;

  const raisedBreakdown = members
    .filter((member) => member.total_contributed > 0)
    .slice(0, 3)
    .map((member, index) => (
      <span key={member.id}>
        {index > 0 && ", "}
        <strong>{formatCompact(member.total_contributed)}</strong> by{" "}
        {member.name}
      </span>
    ));

  return (
    <div className={styles.statBand}>
      <div className={styles.statBandInner}>
        <div className={styles.statCell}>
          <div className={styles.statKey}>Combined raised</div>
          <div className={styles.statValue}>{formatCompact(raised)}</div>
          {raisedBreakdown.length > 0 && (
            <div className={styles.statSub}>{raisedBreakdown}</div>
          )}
        </div>
        <div className={styles.statCell}>
          <div className={styles.statKey}>Total spent</div>
          <div className={styles.statValue}>{formatCompact(spent)}</div>
          {expenditureCount > 0 && (
            <div className={styles.statSub}>
              across{" "}
              <strong>
                {pluralize(expenditureCount, "independent expenditure", {
                  includeValue: true,
                })}
              </strong>
            </div>
          )}
        </div>
        <div className={styles.statCell}>
          <div className={styles.statKey}>Cash remaining</div>
          <div className={styles.statValue}>{formatCompact(cashOnHand)}</div>
        </div>
      </div>
    </div>
  );
}

function RelatedCompanies({ data }: { data: NetworkData }) {
  const companies = data.relatedCompanies.slice(0, 4);
  if (companies.length === 0) {
    return null;
  }
  return (
    <section className={styles.sectionSpacer}>
      <h2 className={sharedStyles.sectionTitle}>
        Related companies
        <span className={sharedStyles.sectionTitleAmount}>
          Top contributors by total given
        </span>
      </h2>
      <div className={styles.companyGrid}>
        {companies.map((company) => (
          <div className={styles.companyCard} key={company.id}>
            <div className={styles.ccName}>
              <Link href={company.href}>{company.name}</Link>
            </div>
            {company.role && (
              <div className={styles.ccRole}>{company.role}</div>
            )}
            <div className={styles.ccGiven}>
              Given <strong>{formatCompact(company.total)}</strong> to the
              network
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function NetworkSpending({ data }: { data: NetworkData }) {
  if (!data.byParty) {
    return null;
  }
  return (
    <section>
      <h2 className={sharedStyles.sectionTitle}>
        Network spending
        <span className={sharedStyles.sectionTitleAmount}>
          {formatCompact(data.spent)} across{" "}
          {pluralize(data.raceCount, "race", { includeValue: true })}
        </span>
      </h2>
      <div className={styles.barGroup}>
        <SpendingByPartyWithOpposition
          expenditures={data.byParty}
          labelId={`net-spend-${data.network.id}`}
          max={data.spent || undefined}
        />
      </div>
    </section>
  );
}

export default async function NetworkDetailPage({
  params,
}: {
  params: Promise<{ network: string }>;
}) {
  const { network: networkId } = await params;
  const network = NETWORKS.find((n) => n.id === networkId);
  if (!network) {
    notFound();
  }

  const data = await getNetworkData(network);
  if (!data) {
    notFound();
  }

  return (
    <>
      <NetworkHeader data={data} />
      <StatBand data={data} />
      <div className={sharedStyles.main}>
        <div className={styles.body}>
          <div className={styles.leftCol}>
            <NetworkTopDonors data={data} />
            <RelatedCompanies data={data} />
          </div>
          <div className={styles.rightCol}>
            <NetworkSpending data={data} />
            <div className={styles.sectionSpacer}>
              <NetworkByCandidate data={data} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
