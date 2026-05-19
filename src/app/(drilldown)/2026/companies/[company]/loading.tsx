import contributionStyles from "@/app/components/individualOrCompany/individualOrCompany.module.css";
import { SpendingByPartySkeleton } from "@/app/components/individualOrCompany/SpendingByParty";
import Skeleton from "@/app/components/skeletons/Skeleton";
import sharedStyles from "@/app/shared.module.css";
import { range } from "@/app/utils/range";

import styles from "./page.module.css";

export default function LoadingPage() {
  return (
    <>
      <section className="full-width">
        <div className={styles.companyLogoAndName}>
          <div className={styles.companyLogoSkeleton}>
            <Skeleton width="10rem" height="10rem" />
          </div>
          <div className={`${styles.descriptionSkeleton} full-width`}>
            <Skeleton width="70%" height="3rem" />
            <div
              className={`${styles.descriptionSkeleton} ${styles.description}`}
            >
              <Skeleton width="80%" />
              <Skeleton width="80%" />
            </div>
            <div className={styles.descriptionSkeleton}>
              <Skeleton width="100%" />
            </div>
          </div>
        </div>
      </section>
      <div className={styles.page}>
        <section className={styles.contributionSection}>
          <h3 className={styles.contributionSectionHeader}>Contributions</h3>
          {[6, 2, 6, 3].map((items, ind) => (
            <div
              className={contributionStyles.contributionRow}
              key={`top-donors-skeleton-row-${ind}`}
            >
              <div className={contributionStyles.contributionSummary}>
                <Skeleton height="1.125rem" width="10rem" onCard={true} />
                <Skeleton height="1.125rem" width="10rem" onCard={true} />
              </div>
              <Skeleton width="90%" onCard={true} />
              <div className={contributionStyles.contributionsContainer}>
                {range(items).map((j) => (
                  <div
                    className={contributionStyles.contributionSubRow}
                    key={`top-donors-skeleton-subrow-${ind}-${j}`}
                  >
                    <Skeleton width="12rem" onCard={true} />
                    <Skeleton width="8rem" onCard={true} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
        <div className={styles.spendingWrapper}>
          <section
            className={`${styles.spendingByPartySection} ${sharedStyles.constrainWidth}`}
          >
            <h2 id="spending-by-party">Contributions by party</h2>
            <SpendingByPartySkeleton />
          </section>
        </div>
      </div>
    </>
  );
}
