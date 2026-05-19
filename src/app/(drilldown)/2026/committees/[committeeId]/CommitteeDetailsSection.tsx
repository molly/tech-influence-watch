import React from "react";

import { fetchCommitteeDetails } from "@/app/actions/fetch";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import ErrorText from "@/app/components/ErrorText";
import Skeleton from "@/app/components/skeletons/Skeleton";
import sharedStyles from "@/app/shared.module.css";
import { CommitteeDetails } from "@/app/types/Committee";
import { is4xx, isError } from "@/app/utils/errors";

import { formatDateFromString } from "../../../../utils/utils";
import styles from "./page.module.css";

export function CommitteeDetailsSkeleton() {
  return (
    <div>
      <Skeleton height="1.75rem" width="10rem" />
      <Skeleton width="90%" />
      <Skeleton width="60%" />
    </div>
  );
}

export default async function CommitteeDetailsSection({
  committeeId,
}: {
  committeeId: string;
}) {
  const committeeData = await fetchCommitteeDetails(committeeId);

  if (isError(committeeData)) {
    if (is4xx(committeeData)) {
      return <div className="secondary">Committee not found.</div>;
    } else {
      return <ErrorText subject="information about this committee" />;
    }
  }

  const committee = committeeData as CommitteeDetails;

  const renderDetails = () => {
    const parts: React.ReactNode[] = [];

    if (committee.committee_type_full) {
      parts.push(committee.committee_type_full);
    }

    if (committee.designation_full) {
      parts.push(` - ${committee.designation_full}`);
    }

    parts.push(
      <span key="id">
        {" | ID: "}
        <a
          href={`https://www.fec.gov/data/committee/${committee.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {committee.id}
        </a>
      </span>,
    );

    if (committee.first_f1_date) {
      parts.push(
        ` | Registration date: ${formatDateFromString(committee.first_f1_date)}`,
      );
    }

    return parts;
  };

  return (
    <div className={sharedStyles.fullWidthHeader}>
      <section className={sharedStyles.header}>
        <Breadcrumbs crumbs={["Spending", "Beneficiaries"]} />
      <h1>{committee.name}</h1>
      <span className="secondary small">{renderDetails()}</span>
      {committee.description && (
        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: committee.description }}
        ></div>
      )}
    </section>
    </div>
  );
}
