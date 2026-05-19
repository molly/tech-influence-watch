import React from "react";

import { ManualReview } from "@/app/types/Contributions";

import styles from "./ReviewStatusBadge.module.css";

interface ReviewStatusBadgeProps {
  manualReview?: ManualReview;
}

export default function ReviewStatusBadge({ manualReview }: ReviewStatusBadgeProps) {
  if (!manualReview) {
    return <span className={`${styles.badge} ${styles.pending}`}>Pending</span>;
  }

  const isVerified = manualReview.status === "verified";
  const isOmitted = manualReview.status === "omit";

  return (
    <span
      className={`${styles.badge} ${isVerified ? styles.verified : isOmitted ? styles.omitted : styles.pending}`}
    >
      {isVerified ? "Verified" : isOmitted ? "Omitted" : "Pending"}
    </span>
  );
}
