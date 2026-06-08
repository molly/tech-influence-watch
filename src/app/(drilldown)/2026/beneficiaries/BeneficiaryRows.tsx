import MaybeLink from "@/app/components/MaybeLink";
import SectorBadge from "@/app/components/SectorBadge";
import COMMITTEES from "@/app/data/committees";
import {
  Beneficiary,
  CandidateBeneficiary as CandidateBeneficiaryType,
  CommitteeBeneficiary as CommitteeBeneficiaryType,
} from "@/app/types/Beneficiaries";
import { CommitteeConstant } from "@/app/types/Committee";
import { titlecaseCommittee, titlecaseLastFirst } from "@/app/utils/titlecase";
import { formatCurrency } from "@/app/utils/utils";

import styles from "./beneficiaries.module.css";
import {
  getCandidateDescription,
  getDescription,
  getPartyBorderClass,
  getPartyCode,
} from "./beneficiaries.utils";

export const BENEFICIARIES_PAGE_SIZE = 50;

export function BeneficiariesTableHeader() {
  return (
    <thead>
      <tr className={styles.tableHeaderRow}>
        <th />
        <th className="text-cell">Recipient</th>
        <th className="center-cell">Party</th>
        <th className="number-cell">Total industry contributions</th>
      </tr>
    </thead>
  );
}

function PartyBorderCell({ partyCode }: { partyCode: string }) {
  const className = getPartyBorderClass(partyCode);
  return (
    <td className={styles.partyBorderCell}>
      <span className={className} />
    </td>
  );
}

function CommitteeRow({
  id,
  beneficiary,
  committeeConstants,
}: {
  id: string;
  beneficiary: CommitteeBeneficiaryType;
  committeeConstants: Record<string, CommitteeConstant> | null;
}) {
  const partyCode = getPartyCode(beneficiary);
  const partyLetter = partyCode ? partyCode[0] : "";
  const partyClass = partyCode ? partyCode.toLowerCase() : "";
  const name = beneficiary.committee_details?.committee_name
    ? titlecaseCommittee(beneficiary.committee_details.committee_name)
    : id;
  const description = getDescription(beneficiary);
  const isTracked = id in COMMITTEES;
  const sector = committeeConstants?.[id]?.sector;

  return (
    <tr className={styles.beneficiaryRow}>
      <PartyBorderCell partyCode={partyCode} />
      <td className={styles.recipientCell}>
        <MaybeLink
          href={id in COMMITTEES ? `/2026/committees/${id}` : undefined}
        >
          <span className={styles.recipientName}>
            {name}
            {isTracked && sector && (
              <SectorBadge>{sector}</SectorBadge>
            )}
          </span>
        </MaybeLink>
        {description && (
          <span className={styles.recipientDescription}>{description}</span>
        )}
      </td>
      <td className={`center-cell ${partyClass}`}>{partyLetter || "–"}</td>
      <td className="number-cell">{formatCurrency(beneficiary.total, true)}</td>
    </tr>
  );
}

function CandidateRow({
  beneficiary,
}: {
  id: string;
  beneficiary: CandidateBeneficiaryType;
}) {
  const partyCode = getPartyCode(beneficiary);
  const partyLetter = partyCode ? partyCode[0] : "";
  const partyClass = partyCode ? partyCode.toLowerCase() : "";
  const name = titlecaseLastFirst(beneficiary.candidate_details.name);
  const description = getCandidateDescription(beneficiary);

  const raceHref = beneficiary.candidate_details.race_link;

  return (
    <tr className={styles.beneficiaryRow}>
      <PartyBorderCell partyCode={partyCode} />
      <td className={styles.recipientCell}>
        <MaybeLink href={raceHref}>
          <span className={styles.recipientName}>{name}</span>
        </MaybeLink>
        {description && (
          <span className={styles.recipientDescription}>{description}</span>
        )}
      </td>
      <td className={`center-cell ${partyClass}`}>{partyLetter}</td>
      <td className="number-cell">{formatCurrency(beneficiary.total, true)}</td>
    </tr>
  );
}

export function BeneficiaryRows({
  ids,
  beneficiaries,
  committeeConstants,
}: {
  ids: string[];
  beneficiaries: Record<string, Beneficiary>;
  committeeConstants: Record<string, CommitteeConstant> | null;
}) {
  return ids.map((id) => {
    const beneficiary = beneficiaries[id];
    if (!beneficiary) {
      return null;
    }
    if (beneficiary.type === "committee") {
      return (
        <CommitteeRow
          key={id}
          id={id}
          beneficiary={beneficiary}
          committeeConstants={committeeConstants}
        />
      );
    }
    if (!beneficiary.candidate_details) {
      return null;
    }
    return <CandidateRow key={id} id={id} beneficiary={beneficiary} />;
  });
}
