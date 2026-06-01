import { Metadata } from "next";

import sharedStyles from "@/app/shared.module.css";
import { customMetadata } from "@/app/utils/metadata";

import AboutNav from "../AboutNav";
import styles from "../page.module.css";

export const metadata: Metadata = customMetadata({
  title: "Support",
  description: "Support Tech Influence Watch and Citation Needed.",
});

export default function SupportPage() {
  return (
    <div className={sharedStyles.fullWidthHeader}>
      <div className={sharedStyles.header}>
        <h1 className={sharedStyles.title}>About</h1>
      </div>
      <div className={styles.navRow}>
        <AboutNav />
      </div>
      <div className={`${sharedStyles.main} ${styles.bodyText}`}>
        <div className="single-column-page">
          <h2 className={styles.subpageTitle}>Support this work</h2>
          <p>
            <i>Tech Influence Watch</i> is a project of{" "}
            <a href="https://www.citationneeded.news">
              <i>Citation Needed</i>
            </a>
            , Molly White&rsquo;s independent newsletter on cryptocurrency,
            technology, and tech policy. The data here and the reporting in the
            newsletter are two parts of the same work: the newsletter&rsquo;s
            investigations into tech industry influence inform what gets tracked
            here, and <i>Tech Influence Watch</i> data powers and extends my
            reporting. If you&rsquo;ve found this data useful, there&apos;s a
            good chance the newsletter is worth your time too.
          </p>
          <p>
            This data is freely available and used by journalists, advocates,
            and policymakers working to hold the country&rsquo;s leaders and
            the tech industry accountable.
          </p>
          <p>
            Keeping it free, accurate, and independent costs time and money. I
            don&apos;t use paywalls, run ads, or accept industry funding. If
            you find this work valuable, the best way to support it is to
            subscribe to <i>Citation Needed</i>.
          </p>
          <div className={styles.ctaBlock}>
            <a
              href="https://www.citationneeded.news/signup/"
              className={styles.ctaButton}
            >
              Subscribe
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
