import Link from "next/link";

import SectorBadge from "@/app/components/SectorBadge";
import { getNetworkId } from "@/app/data/networks";
import { CommitteeConstantWithContributions } from "@/app/types/Committee";
import { Sector } from "@/app/types/Sector";
import { formatCompact } from "@/app/utils/humanize";
import { formatCurrency } from "@/app/utils/utils";

import styles from "./HorizontalBars.module.css";

const BASE_LEGEND_ITEMS = [
  { label: "Cash from previous cycle", colorClass: styles.colorCash },
  { label: "Contributions", colorClass: styles.colorContributed },
  {
    label: "Transfers from other committees",
    colorClass: styles.colorTransferred,
  },
];

const CLAIMED_LEGEND_ITEM = {
  label: "Claimed commitments",
  colorClass: styles.colorClaimed,
};

export default function AllCashByCommitteeChart({
  committees,
  labelId: _labelId,
  sector,
  max: maxProp,
}: {
  committees: CommitteeConstantWithContributions[];
  labelId: string;
  sector: Sector;
  max?: number;
}) {
  const top6 = committees.slice(0, 6);
  const claimedNotInTop6 = committees.filter(
    (c) => (c.claimedCommitted || 0) > 0 && !top6.some((t) => t.id === c.id),
  );
  const committeesToShow = [...top6, ...claimedNotInTop6];

  const hasClaimedCommitted = committeesToShow.some(
    (c) => (c.claimedCommitted || 0) > 0,
  );
  const legendItems = hasClaimedCommitted
    ? [...BASE_LEGEND_ITEMS, CLAIMED_LEGEND_ITEM]
    : BASE_LEGEND_ITEMS;

  const maxTotal =
    maxProp ??
    Math.max(
      ...committeesToShow.map((c) => c.total + (c.claimedCommitted || 0)),
      0,
    );

  const pct = (value: number) => (maxTotal > 0 ? (value / maxTotal) * 100 : 0);

  return (
    <div>
      <div className={styles.legend} aria-hidden={true}>
        {legendItems.map((item) => (
          <div key={item.label} className={styles.legendItem}>
            <span className={`${styles.legendSwatch} ${item.colorClass}`} />
            {item.label}
          </div>
        ))}
      </div>

      <ul className={styles.bars}>
        {committeesToShow.map((committee) => {
          const barTotal = committee.total + (committee.claimedCommitted || 0);
          const cashPct = pct(committee.last_cash_on_hand_end_period);
          const contribPct = pct(committee.total_contributed);
          const transferPct = pct(committee.total_transferred);
          const claimedPct = pct(committee.claimedCommitted || 0);

          return (
            <li key={committee.id} className={styles.barRow}>
              <div className={styles.labelRow}>
                <span>
                  <a
                    href={`/2026/committees/${committee.id}`}
                    className={`${styles.label} secondaryLink`}
                  >
                    {committee.name}
                  </a>
                  {sector === "all" && committee.sector && (
                    <SectorBadge>{committee.sector}</SectorBadge>
                  )}
                  {committee.network &&
                    (getNetworkId(committee.network) ? (
                      <>
                        {" "}
                        <Link
                          href={`/2026/networks/${getNetworkId(committee.network)}`}
                          className={styles.networkLabel}
                        >
                          {committee.network} network
                        </Link>
                      </>
                    ) : (
                      <span className={styles.networkLabel}>
                        {" "}
                        {committee.network} network
                      </span>
                    ))}
                </span>
                <span className={styles.value}>
                  {formatCompact(barTotal)}
                  <span className={styles.pct}>
                    {" "}
                    ({Math.round(pct(barTotal))}%)
                  </span>
                </span>
              </div>
              <div
                className={styles.track}
                role="img"
                aria-label={`${committee.name}: ${formatCurrency(barTotal, true)}`}
              >
                {cashPct > 0 && (
                  <div
                    className={`${styles.segment} ${styles.colorCash}`}
                    style={{ width: `${cashPct}%` }}
                  />
                )}
                {contribPct > 0 && (
                  <div
                    className={`${styles.segment} ${styles.colorContributed}`}
                    style={{ width: `${contribPct}%` }}
                  />
                )}
                {transferPct > 0 && (
                  <div
                    className={`${styles.segment} ${styles.colorTransferred}`}
                    style={{ width: `${transferPct}%` }}
                  />
                )}
                {claimedPct > 0 && (
                  <div
                    className={`${styles.segment} ${styles.colorClaimed}`}
                    style={{ width: `${claimedPct}%` }}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
