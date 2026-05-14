import {
  fetchBeneficiaries,
  fetchBeneficiariesOrder,
} from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import MaybeLink from "@/app/components/MaybeLink";
import tableStyles from "@/app/components/tables.module.css";
import COMMITTEES from "@/app/data/committees";
import { SINGLE_MEMBER_STATES, STATES_BY_ABBR } from "@/app/data/states";
import {
  Beneficiary,
  BeneficiaryCommittee,
  CandidateBeneficiary as CandidateBeneficiaryType,
  CommitteeBeneficiary as CommitteeBeneficiaryType,
} from "@/app/types/Beneficiaries";
import { isError } from "@/app/utils/errors";
import { customMetadata } from "@/app/utils/metadata";
import { getRaceName } from "@/app/utils/races";
import { humanizeSector, parseSector } from "@/app/utils/sector";
import { titlecaseCommittee, titlecaseLastFirst } from "@/app/utils/titlecase";
import { formatCurrency } from "@/app/utils/utils";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string }>;
}): Promise<Metadata> {
  const { sector: rawSector } = await searchParams;
  const sector = parseSector(rawSector);
  return customMetadata({
    title: "Beneficiaries",
    description: `Beneficiaries of ${humanizeSector(sector, { context: "industry", lowercase: true })} spending`,
  });
}

function CommitteeBeneficiary({
  id,
  beneficiary,
  committee,
}: {
  id: string;
  beneficiary: CommitteeBeneficiaryType;
  committee?: BeneficiaryCommittee;
}) {
  return (
    <tr className={tableStyles.beneficiariesRow}>
      <td>
        <MaybeLink
          href={id in COMMITTEES ? `/2026/committees/${id}` : undefined}
        >
          {committee && committee.committee_name
            ? titlecaseCommittee(committee.committee_name)
            : id}
        </MaybeLink>
      </td>
      <td>{committee && committee.description ? committee.description : ""}</td>
      <td
        className={`center-cell ${committee && committee.party ? committee.party.toLowerCase() : ""}`}
      >
        {committee && committee.party ? committee.party[0] : ""}
      </td>
      <td className="number-cell">{formatCurrency(beneficiary.total, true)}</td>
    </tr>
  );
}

function CandidateBeneficiary({
  id,
  beneficiary,
}: {
  id: string;
  beneficiary: CandidateBeneficiaryType;
}) {
  const { state, office, district } = beneficiary.candidate_details;
  let raceId = `${office}`;
  if (office === "H" && !SINGLE_MEMBER_STATES.includes(state)) {
    raceId += `-${district}`;
  }
  let raceName;
  if (office !== "P") {
    raceName = `${STATES_BY_ABBR[state]} ${getRaceName(raceId)}`;
  } else {
    raceName = "President";
  }

  return (
    <tr className={tableStyles.beneficiariesRow}>
      <td>
        <Link href={`/2026/beneficiaries/${id}`}>
          {titlecaseLastFirst(beneficiary.candidate_details.name)}
        </Link>
      </td>
      <td>
        <span>candidate for </span>
        <MaybeLink href={beneficiary.candidate_details.race_link}>
          {raceName}
        </MaybeLink>
      </td>
      <td
        className={`center-cell ${beneficiary.candidate_details.party.toLowerCase()}`}
      >
        {beneficiary.candidate_details.party[0]}
      </td>
      <td className="number-cell">{formatCurrency(beneficiary.total, true)}</td>
    </tr>
  );
}

export default async function BeneficiariesList({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string }>;
}) {
  const { sector: rawSector } = await searchParams;
  const sector = parseSector(rawSector);
  const [beneficiariesData, beneficiariesOrderData] = await Promise.all([
    fetchBeneficiaries(sector),
    fetchBeneficiariesOrder(sector),
  ]);
  if (isError(beneficiariesData) || isError(beneficiariesOrderData)) {
    return <ErrorText subject="the list of beneficiaries" />;
  }

  const beneficiaries = beneficiariesData as Record<string, Beneficiary>;
  const beneficiariesOrder = beneficiariesOrderData as string[];

  return (
    <div className="single-column-page">
      <section>
        <h2 className={tableStyles.tableCardContent}>Beneficiaries</h2>
        <p className="secondary">
          {`Candidates and committees that have received
          contributions from tracked ${humanizeSector(sector, { context: "industry", lowercase: true })} companies
          and individuals.`}
        </p>
        <table>
          <thead>
            <tr>
              <th className="text-cell">Recipient</th>
              <th className="text-cell"></th>
              <th className="center-cell">Party</th>
              <th className="number-cell">Total</th>
            </tr>
          </thead>
          <tbody>
            {beneficiariesOrder.map((id) => {
              const beneficiary = beneficiaries[id];
              if (!beneficiary) return null;
              if (beneficiary.type === "committee") {
                return (
                  <CommitteeBeneficiary
                    id={id}
                    beneficiary={beneficiary}
                    committee={beneficiary.committee_details}
                    key={id}
                  />
                );
              }
              if (!beneficiary.candidate_details) return null;
              return (
                <CandidateBeneficiary
                  id={id}
                  beneficiary={beneficiary}
                  key={id}
                />
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
