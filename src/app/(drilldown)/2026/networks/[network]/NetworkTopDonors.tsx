import Link from "next/link";
import { Fragment } from "react";

import sharedStyles from "@/app/shared.module.css";
import { formatCurrency, formatDateFromString } from "@/app/utils/utils";

import type { MergedDonor, NetworkData } from "./networkData";
import styles from "./NetworkDetail.module.css";

const GROUP_COUNT = 3;
const FLAT_LIMIT = 9;

function DonorName({ donor }: { donor: MergedDonor }) {
  if (donor.href) {
    return <Link href={donor.href}>{donor.name}</Link>;
  }
  return <>{donor.name}</>;
}

function DonorGroup({ donor }: { donor: MergedDonor }) {
  return (
    <div className={styles.donorGroup}>
      <div className={styles.donorHead}>
        <div className={styles.donorName}>
          <DonorName donor={donor} />
        </div>
        <div className={styles.donorTotal}>
          {formatCurrency(donor.total, true)}
        </div>
      </div>
      <div className={styles.gifts}>
        {donor.gifts.map((gift, index) => {
          const label = [gift.attribution, formatDateFromString(gift.date)]
            .filter(Boolean)
            .join(" · ");
          return (
            <Fragment key={`${donor.key}-${index}`}>
              <span className={styles.giftDate}>{label}</span>
              <span className={styles.giftAmt}>
                {formatCurrency(gift.amount, true)}
              </span>
              {gift.note && (
                <span className={styles.giftNote}>{gift.note}</span>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

function DonorRow({ donor }: { donor: MergedDonor }) {
  return (
    <div className={styles.donorRow}>
      <div className={styles.donorRowName}>
        <DonorName donor={donor} />
        {donor.role && <span className={styles.donorRole}> {donor.role}</span>}
      </div>
      <div className={styles.donorRowAmt}>
        {formatCurrency(donor.total, true)}
      </div>
    </div>
  );
}

export default function NetworkTopDonors({ data }: { data: NetworkData }) {
  const { donors, donorCount } = data;
  if (donors.length === 0) {
    return null;
  }

  const groups = donors.slice(0, GROUP_COUNT);
  const rows = donors.slice(GROUP_COUNT, GROUP_COUNT + FLAT_LIMIT);
  const shown = groups.length + rows.length;

  return (
    <section>
      <h2 className={sharedStyles.sectionTitle}>Top donors</h2>
      {groups.map((donor) => (
        <DonorGroup key={donor.key} donor={donor} />
      ))}
      {rows.map((donor) => (
        <DonorRow key={donor.key} donor={donor} />
      ))}
      {donorCount > shown && (
        <div className={styles.allLink}>
          Showing the top {shown} of {donorCount} donors across the network.
        </div>
      )}
    </section>
  );
}
