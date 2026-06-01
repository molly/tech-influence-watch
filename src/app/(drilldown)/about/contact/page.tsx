import { Metadata } from "next";
import Link from "next/link";

import BlueskyIcon from "@/app/icons/BlueskyIcon";
import GithubIcon from "@/app/icons/GithubIcon";
import MastodonIcon from "@/app/icons/MastodonIcon";
import sharedStyles from "@/app/shared.module.css";
import { customMetadata } from "@/app/utils/metadata";

import AboutNav from "../AboutNav";
import styles from "../page.module.css";

export const metadata: Metadata = customMetadata({
  title: "Contact",
  description: "Contact Molly White about Tech Influence Watch.",
});

export default function ContactPage() {
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
          <h2 className={styles.subpageTitle}>Get in touch</h2>
          <div className={styles.journalistPanel}>
            <div className={styles.journalistLeft}>
              <div className={styles.journalistLabel}>
                For journalists, advocacy groups, &amp; researchers
              </div>
              <h3 className={styles.journalistHeadline}>This data is yours.</h3>
              <p>
                If you&rsquo;re reporting on crypto or AI industry influence,
                campaign finance, or tech policy,{" "}
                <span className="bold">please reach out.</span> All data on this
                site is public and free to use without requesting permission.
              </p>
              <p>
                <span className="bold">
                  I&rsquo;m happy to provide context in interviews or on
                  background.
                </span>{" "}
                I can walk you through the numbers, explain the background
                context, or dig into specific companies or individuals. The
                point of this site is for this data to be used, and the more
                people who see it, the better.
              </p>
              <a
                href="mailto:ftc@mollywhite.net"
                className={styles.journalistCta}
              >
                Press &amp; research inquiries &rarr;
              </a>
            </div>
            <div className={styles.journalistRight}>
              <div className={styles.journalistLabel}>
                What&rsquo;s on the site
              </div>
              <ul className={styles.journalistFeatureList}>
                <li>
                  <span className="bold">
                    Corrected FEC contribution &amp; expenditure data
                  </span>{" "}
                  for crypto- and AI-affiliated PACs and donors
                </li>
                <li>
                  <span className="bold">Individual donor records</span> for
                  companies, executives, and VCs
                </li>
                <li>
                  <span className="bold">Election-by-election breakdowns</span>{" "}
                  going back to 2024
                </li>
                <li>
                  <span className="bold">Political ad archive</span> with links
                  to source material
                </li>
                <li>
                  <span className="bold">Open-source code</span> &mdash; raw
                  data exports available on request
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.aboutPage}>
            <p>
              Spot an error? Found a crypto- or AI-affiliated PAC that
              isn&rsquo;t on the site yet? Have a question that isn&rsquo;t in
              the <Link href="/about/faq">FAQ</Link>? Want to make a suggestion?
            </p>
            <p>
              Missing data, errors, or feature suggestions are best submitted{" "}
              <a href="https://github.com/molly/follow-the-crypto/pulls">
                via GitHub
              </a>{" "}
              if you&rsquo;re able — that way the conversation stays attached to
              the fix.
            </p>
            <p>
              If you&rsquo;re not on GitHub, or for anything else, feel free to
              reach out by email or on the social platforms below.
            </p>
            <p className="italic">
              Responses are best-effort and usually within a few days. Please
              don&rsquo;t use these channels to pitch PR campaigns, request
              takedowns of public FEC records, or send press
              releases&nbsp;&mdash; they won&rsquo;t get a reply.
            </p>
          </div>
          <div className={styles.contactCards}>
            <a
              href="mailto:ftc@mollywhite.net"
              className={`${styles.contactCard} ${styles.contactCardFeatured}`}
            >
              <div className={styles.contactIcon}>@</div>
              <div className={styles.contactInfo}>
                <div className={styles.contactLabel}>
                  Best route &mdash; Email
                </div>
                <div className={styles.contactTitle}>ftc@mollywhite.net</div>
                <div className={styles.contactDescription}>
                  For anything that doesn&rsquo;t fit on GitHub.
                </div>
              </div>
            </a>
            <a
              href="https://github.com/molly/follow-the-crypto"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactCard}
            >
              <div className={styles.contactIcon}><GithubIcon width={32} height={32} /></div>
              <div className={styles.contactInfo}>
                <div className={styles.contactLabel}>
                  GitHub &mdash; Pull requests &amp; issues
                </div>
                <div className={styles.contactTitle}>
                  molly/follow-the-crypto
                </div>
                <div className={styles.contactDescription}>
                  Corrections, missing data, feature ideas.
                </div>
              </div>
              <span className={styles.contactExternalArrow}>↗</span>
            </a>
            <a
              href="https://bsky.app/profile/molly.wiki"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactCard}
            >
              <div className={styles.contactIcon}><BlueskyIcon width={32} height={32} /></div>
              <div className={styles.contactInfo}>
                <div className={styles.contactLabel}>Bluesky</div>
                <div className={styles.contactTitle}>@molly.wiki</div>
              </div>
              <span className={styles.contactExternalArrow}>↗</span>
            </a>
            <a
              href="https://hachyderm.io/@molly0xfff"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactCard}
            >
              <div className={styles.contactIcon}><MastodonIcon width={32} height={32} /></div>
              <div className={styles.contactInfo}>
                <div className={styles.contactLabel}>Mastodon</div>
                <div className={styles.contactTitle}>
                  @molly0xfff@hachyderm.io
                </div>
              </div>
              <span className={styles.contactExternalArrow}>↗</span>
            </a>
            <a
              href="https://www.mollywhite.net/verify/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactCard}
            >
              <div className={styles.contactIcon}>+</div>
              <div className={styles.contactInfo}>
                <div className={styles.contactLabel}>Everywhere else</div>
                <div className={styles.contactTitle}>
                  Verified contact methods
                </div>
                <div className={styles.contactDescription}>
                  mollywhite.net/verify
                </div>
              </div>
              <span className={styles.contactExternalArrow}>↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
