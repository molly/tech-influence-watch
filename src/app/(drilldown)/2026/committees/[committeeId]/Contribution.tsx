import React from "react";

import { fetchConstant } from "@/app/actions/fetch";
import Claimed from "@/app/components/individualOrCompany/Claimed";
import MaybeLink from "@/app/components/MaybeLink";
import { Contribution as ContributionType } from "@/app/types/Contributions";
import { titlecaseCompany } from "@/app/utils/titlecase";
import { formatCurrency, formatDateFromString } from "@/app/utils/utils";

import {
  DonorType,
  getDonorDetails,
  IndividualDonorType,
} from "../../../../utils/donorDetails";
import styles from "./page.module.css";

function ContributorName({
  contribution,
  donorDetails,
}: {
  contribution: ContributionType;
  donorDetails: IndividualDonorType;
}) {
  if (contribution.redacted) {
    return <span className={styles.redactedName}>Individual</span>;
  } else if (!donorDetails.company) {
    return (
      <span className={styles.donorCompany}>
        <MaybeLink href={contribution.link}>{donorDetails.name}</MaybeLink>
      </span>
    );
  } else {
    return donorDetails.name;
  }
}

function CompanyName({
  donorDetails,
  link,
  inline = false,
  contributionDate = null,
  groupName,
}: {
  donorDetails: DonorType;
  link?: string;
  inline?: boolean;
  contributionDate?: React.ReactElement | null;
  groupName?: string;
}) {
  let companyName =
    (donorDetails.companyAlias &&
      titlecaseCompany(donorDetails.companyAlias)) ||
    donorDetails.company;

  let alias =
    donorDetails.companyAlias &&
    donorDetails.companyAlias !== donorDetails.company?.toUpperCase()
      ? donorDetails.company
      : "";

  if (alias && groupName && companyName === groupName) {
    companyName = alias;
    alias = "";
  }

  let entityType = null;
  if (!donorDetails.isIndividual && donorDetails.entityType) {
    if (donorDetails.entityType === "COM") {
      entityType = "Committee";
    } else if (donorDetails.entityType === "PAC") {
      entityType = "PAC";
    }
  }

  if (inline) {
    return (
      <>
        <span>{companyName}</span>
        {alias && <span className="secondary smaller"> ({alias})</span>}
      </>
    );
  }

  return (
    <div>
      <span className={styles.donorCompany}>
        <MaybeLink href={link}>{companyName}</MaybeLink>
      </span>
      {alias && (
        <div className={styles.aliasAndDate}>
          <span className="secondary smaller">({alias})</span>{" "}
          {contributionDate}
        </div>
      )}
      {!alias && contributionDate}
      {entityType && (
        <div className="secondary smaller italic">{`(${entityType})`}</div>
      )}
    </div>
  );
}

function ContributionDate({
  contribution,
}: {
  contribution: ContributionType;
}) {
  if (
    "contribution_receipt_date" in contribution &&
    contribution.contribution_receipt_date
  ) {
    return (
      <span
        className={styles.donorDate}
      >{`${formatDateFromString(contribution.contribution_receipt_date)}`}</span>
    );
  } else if (
    "oldest" in contribution &&
    contribution.oldest &&
    "newest" in contribution &&
    contribution.newest
  ) {
    return (
      <div
        className={styles.donorDateRange}
      >{`${contribution.total} contribution${contribution.total > 1 ? "s" : ""} from ${formatDateFromString(contribution.oldest)} to ${formatDateFromString(contribution.newest)}`}</div>
    );
  }
  return null;
}

function ContributionAmount({
  contribution,
  isSubRow = false,
}: {
  contribution: ContributionType;
  isSubRow?: boolean;
}) {
  if (
    "contribution_receipt_amount" in contribution &&
    contribution.contribution_receipt_amount
  ) {
    return (
      <span className={isSubRow ? styles.subRowCurrency : ""}>
        {formatCurrency(contribution.contribution_receipt_amount)}
      </span>
    );
  } else if (
    "total_receipt_amount" in contribution &&
    contribution.total_receipt_amount
  ) {
    return (
      <span className={isSubRow ? styles.subRowCurrency : ""}>
        {formatCurrency(contribution.total_receipt_amount)}
      </span>
    );
  }
  return null;
}

export default async function Contribution({
  contribution,
  isSubRow,
  groupName,
}: {
  contribution: ContributionType;
  isSubRow?: boolean;
  groupName?: string;
}) {
  let [COMPANY_ALIASES, INDIVIDUAL_EMPLOYERS] = await Promise.all([
    fetchConstant<Record<string, string>>("companyAliases") || {},
    fetchConstant<string[]>("individualEmployers") || [],
  ]);

  const donorDetails = getDonorDetails(
    contribution,
    COMPANY_ALIASES as Record<string, string>,
    INDIVIDUAL_EMPLOYERS as string[],
  );
  let donorIdentifier;

  if (isSubRow) {
    // SUBROW
    if (donorDetails.isIndividual) {
      donorIdentifier = (
        <>
          <ContributorName
            contribution={contribution}
            donorDetails={donorDetails}
          />
          {donorDetails.occupation && (
            <span className={styles.donorOccupation}>
              {donorDetails.occupation}
            </span>
          )}
        </>
      );
    } else {
      donorIdentifier = (
        <CompanyName
          donorDetails={donorDetails}
          link={contribution.link}
          groupName={groupName}
          inline
        />
      );
    }

    return (
      <div className={styles.donorSubRow}>
        <div className={styles.donorSubRowPrimary}>
          <div>
            {!donorDetails.isIndividual && donorDetails.company === groupName
              ? null
              : donorIdentifier}
            <ContributionDate contribution={contribution} />
            {contribution.claimed && <Claimed />}
          </div>
          <ContributionAmount contribution={contribution} isSubRow={true} />
        </div>
        {contribution.description && (
          <div className={styles.contributionDescription}>
            {contribution.description}
          </div>
        )}
      </div>
    );
  } else {
    // TOP-LEVEL ROW
    if (donorDetails.isIndividual) {
      donorIdentifier = (
        <div>
          <div>
            <ContributorName
              contribution={contribution}
              donorDetails={donorDetails}
            />
            {donorDetails.occupation && (
              <span className={styles.donorOccupation}>
                {donorDetails.occupation}
              </span>
            )}
            {!donorDetails.company && (
              <>
                <ContributionDate contribution={contribution} />
                {contribution.claimed && <Claimed />}
              </>
            )}
          </div>
          {donorDetails.company && (
            <div className={"oldest" in contribution ? "" : styles.donorBlock}>
              <CompanyName
                donorDetails={donorDetails}
                link={contribution.link}
              />
              <ContributionDate contribution={contribution} />
              {contribution.claimed && <Claimed />}
            </div>
          )}
        </div>
      );
    } else {
      donorIdentifier = (
        <div className={"oldest" in contribution ? "" : styles.donorBlock}>
          <CompanyName
            donorDetails={donorDetails}
            link={contribution.link}
            contributionDate={<ContributionDate contribution={contribution} />}
          />
          {contribution.claimed && <Claimed />}
        </div>
      );
    }

    return (
      <div className={styles.donorRow}>
        <div className={styles.donorSummary}>
          {donorIdentifier}
          <ContributionAmount contribution={contribution} />
        </div>
        {contribution.description && (
          <div className={styles.contributionDescription}>
            {contribution.description}
          </div>
        )}
      </div>
    );
  }
}
