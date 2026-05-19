import MaybeLink from "@/app/components/MaybeLink";
import Skeleton from "@/app/components/skeletons/Skeleton";
import sharedStyles from "@/app/shared.module.css";
import { Beneficiary } from "@/app/types/Beneficiaries";
import { humanizeApproximateRounded } from "@/app/utils/humanize";

import styles from "./beneficiaries.module.css";
import {
  getDescription,
  getDisplayName,
  getPartyBorderClass,
  getPartyCode,
  isCryptoTracked,
} from "./beneficiaries.utils";

export function TopCardSkeleton() {
  return (
    <div
      className={`${styles.topCard} ${getPartyBorderClass("U", "topCardParty")}`}
    >
      <div className={styles.topCardHeader}>
        <Skeleton width="5rem" height="1rem" />
      </div>
      <div className={styles.topCardName}>
        <Skeleton width="10rem" height="2.5rem" />
      </div>

      <p className={styles.topCardDescription}>
        <Skeleton width="10rem" height="1rem" />
      </p>
      <div className={styles.topCardAmount}>
        <Skeleton width="4rem" height="2.5rem" />
      </div>
    </div>
  );
}

export default function TopCard({
  label,
  id,
  beneficiary,
}: {
  label: string;
  id: string;
  beneficiary: Beneficiary;
}) {
  const name = getDisplayName(id, beneficiary);
  const partyCode = getPartyCode(beneficiary);
  const partyLetter = partyCode ? partyCode[0] : null;
  const partyBorderClass = getPartyBorderClass(
    partyCode || "U",
    "topCardParty",
  );
  const description = getDescription(beneficiary);
  const isTracked = isCryptoTracked(id, beneficiary);
  const raceHref =
    beneficiary.type === "candidate" && beneficiary.candidate_details.race_link
      ? `/2026${beneficiary.candidate_details.race_link}`
      : undefined;

  return (
    <div className={`${styles.topCard} ${partyBorderClass}`}>
      <div className={styles.topCardHeader}>
        <span className={styles.topCardLabel}>{label}</span>
        {isTracked && <span className={sharedStyles.sectorBadge}>crypto</span>}
      </div>
      <div className={styles.topCardName}>
        <MaybeLink href={raceHref}>{name}</MaybeLink>
        {partyLetter && (
          <span className={styles.topCardParty}> ({partyLetter})</span>
        )}
      </div>
      {description && (
        <p className={styles.topCardDescription}>{description}</p>
      )}
      <div className={styles.topCardAmount}>
        {`$${humanizeApproximateRounded(beneficiary.total, 1)}`}
      </div>
    </div>
  );
}
