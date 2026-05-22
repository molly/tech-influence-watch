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
    <div className={sharedStyles.fullWidthHeaderNoBorder}>
      <section className={sharedStyles.header}>
        <Breadcrumbs
          crumbs={["Spending", { name: "Committees", href: "/committees" }]}
        />
        <Skeleton height="5rem" width="15rem" />
        <Skeleton width="min(45rem, 100%)" margin="1rem 0" />
        <Skeleton width="min(48rem, 100%)" />
        <Skeleton width="min(32rem, 80%)" />
      </section>
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
      return (
        <div className={sharedStyles.fullWidthHeaderNoBorder}>
          <section className={sharedStyles.header}>
            <p>
              <ErrorText subject="information about this committee" />
            </p>
          </section>
        </div>
      );
    }
  }

  const committee = committeeData as CommitteeDetails;

  const renderDetails = () => {
    const parts: React.ReactNode[] = [];

    if (committee.committee_type_full) {
      parts.push(
        <span className={styles.committeeDetail}>
          {committee.committee_type_full}
        </span>,
      );
    }

    if (committee.designation_full) {
      parts.push(
        <span className={styles.committeeDetail}>
          {committee.designation_full}
        </span>,
      );
    }

    parts.push(
      <span key="id" className={styles.committeeDetail}>
        {"ID: "}
        <a
          className={`${styles.fecId} unstyled`}
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
        <span className={styles.committeeDetail}>
          Registered {formatDateFromString(committee.first_f1_date)}
        </span>,
      );
    }

    return parts;
  };

  return (
    <div className={sharedStyles.fullWidthHeaderNoBorder}>
      <section className={sharedStyles.header}>
        <Breadcrumbs
          crumbs={[
            "Spending",
            { name: "Committees", href: "/committees" },
            committee.name,
          ]}
        />
        <h1 className={sharedStyles.title}>{committee.name}</h1>
        <span className="secondary small">{renderDetails()}</span>
        {committee.description && (
          <div
            className={sharedStyles.headerSubtitle}
            dangerouslySetInnerHTML={{ __html: committee.description }}
          ></div>
        )}
      </section>
    </div>
  );
}
