import Link from "next/link";

import ErrorText from "@/app/components/ErrorText";
import MoneyCard, { MoneyCardSkeleton } from "@/app/components/MoneyCard";
import Skeleton from "@/app/components/skeletons/Skeleton";
import COMMITTEES from "@/app/data/committees";
import { AMERICA_PAC_ID } from "@/app/data/trump";
import sharedStyles from "@/app/shared.module.css";
import { isError } from "@/app/utils/errors";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";
import { titlecaseCommittee } from "@/app/utils/titlecase";
import {
  getTrumpCombinedDonors,
  type TrumpCombinedDonorsData,
} from "@/app/utils/trumpCombinedDonors";
import { formatCurrency } from "@/app/utils/utils";

import styles from "./TrumpCombinedDonors.module.css";
import TrumpDonorList from "./TrumpDonorList";

export function TrumpCombinedDonorsSkeleton() {
  return (
    <>
      <section className={styles.heroWithStat}>
        <div>
          <Skeleton height="1.1rem" width="80%" />
          <Skeleton height="1.1rem" width="55%" />
        </div>
        <MoneyCardSkeleton />
      </section>
      <div className={sharedStyles.columns}>
        <div className={sharedStyles.mainColumn}>
          <h2 className={sharedStyles.sectionTitle}>By donor</h2>
          {Array.from({ length: 14 }).map((_, i) => (
            <Skeleton key={i} width="100%" />
          ))}
        </div>
        <div className={sharedStyles.sideColumn}>
          <h2 className={sharedStyles.sectionTitle}>By committee</h2>
          <Skeleton width="100%" />
          <Skeleton width="100%" />
        </div>
      </div>
    </>
  );
}

export default async function TrumpCombinedDonors() {
  const data = await getTrumpCombinedDonors();
  if (isError(data)) {
    return <ErrorText subject="contributions data" />;
  }
  const { donors, grandTotal, committeeRows, allContributions } =
    data as TrumpCombinedDonorsData;

  return (
    <>
      <section className={styles.heroWithStat}>
        <div>
          <p className={sharedStyles.headerSubtitle}>
            Since 2024, the crypto and AI industries have contributed{" "}
            <span className={sharedStyles.highlightFigure}>
              more than {humanizeRoundedCurrency(grandTotal, true)}
            </span>{" "}
            to Donald Trump&rsquo;s campaign, inauguration, and the super PACs
            backing him.
          </p>
          <div className={sharedStyles.noteCard}>
            <span className={sharedStyles.noteLabel}>Note:</span> figures
            combine each tracked donor&rsquo;s full current-cycle FEC
            contributions with their 2024 gifts to the campaign, inauguration,
            and pro-Trump PACs&nbsp;&mdash; so they run higher than the
            current-cycle total shown on a donor&rsquo;s own page.
          </div>
        </div>
        <MoneyCard
          topText="Total tech money to Trump"
          amount={humanizeRoundedCurrency(grandTotal, true, 1)}
          bottomText="across all affiliated committees since 2024"
        />
      </section>

      <div className={sharedStyles.columns}>
        <div className={sharedStyles.mainColumn}>
          <h2 className={sharedStyles.sectionTitle}>
            By donor
            <span className={sharedStyles.sectionTitleAmount}>
              <span className={sharedStyles.highlightFigure}>
                {formatCurrency(grandTotal, true)}
              </span>
              {" total · "}
              <span className={sharedStyles.highlightFigure}>
                {donors.length}
              </span>
              {" donors"}
            </span>
          </h2>
          <TrumpDonorList donors={donors} />
        </div>

        <div className={sharedStyles.sideColumn}>
          <h2 className={sharedStyles.sectionTitle}>By committee</h2>
          {committeeRows.length === 0 ? (
            <p>No contributions found.</p>
          ) : (
            <div className={styles.committeeList}>
              {committeeRows.map(
                ({ id, name, total, description, pacType }) => {
                  const subtitle = [pacType, description]
                    .filter(Boolean)
                    .join(" · ");
                  return (
                    <div key={id} className={styles.committeeRow}>
                      <div className={styles.committeeInfo}>
                        <span className={styles.committeeName}>
                          {id in COMMITTEES ? (
                            <Link href={`/2026/committees/${id}`}>
                              {titlecaseCommittee(name)}
                            </Link>
                          ) : (
                            titlecaseCommittee(name)
                          )}
                          {id === AMERICA_PAC_ID && <sup>&dagger;</sup>}
                        </span>
                        {subtitle && (
                          <span className={styles.committeeDescription}>
                            {subtitle}
                          </span>
                        )}
                      </div>
                      <span className={styles.committeeAmount}>
                        {formatCurrency(total, true)}
                      </span>
                    </div>
                  );
                },
              )}
            </div>
          )}
          <aside className={styles.relatedCard}>
            <span className={styles.relatedLabel}>Related</span>
            <p className={styles.relatedBody}>
              Business arrangements that benefit Trump directly, like World
              Liberty Financial and the $TRUMP memecoin, aren&rsquo;t campaign
              contributions and are tracked separately on the{" "}
              <Link href="/analysis/quidproquo">quid pro quo page</Link>.
            </p>
          </aside>
          {committeeRows.some((row) => row.id === AMERICA_PAC_ID) && (
            <div className={styles.footnoteSection}>
              <sup>&dagger;</sup>
              <span className={styles.footnote}>
                America PAC figures cover contributions made before the November
                2024 election only. Elon Musk has kept funding the group since,
                but after his{" "}
                <a href="https://en.wikipedia.org/wiki/Trump%E2%80%93Musk_feud">
                  mid-2025 break with Trump
                </a>{" "}
                those later contributions no longer cleanly read as money behind
                Trump, so they aren&rsquo;t counted here.
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
