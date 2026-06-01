import { Metadata } from "next";

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
          <h2 className={styles.subpageTitle}>Contact</h2>
          <p>
            Spot an error? Found an advertisement by a cryptocurrency-focused
            PAC that isn&rsquo;t on the site yet? Spotted a PAC that appears to
            be crypto- or AI-affiliated? Have a question I haven&rsquo;t
            answered in the <a href="/about/faq">FAQ</a>? Have a suggestion?
            Just want to say hi?
          </p>
          <p>
            Missing data, errors, or feature suggestions are best submitted{" "}
            <a href="https://github.com/molly/follow-the-crypto/pulls">
              via Github
            </a>{" "}
            if you&rsquo;re able.
          </p>
          <p>
            If you&rsquo;re not, or for anything else, feel free to reach out
            via email to{" "}
            <a href="mailto:ftc@mollywhite.net">ftc@mollywhite.net</a>.
            I&rsquo;m also on{" "}
            <a href="https://bsky.app/profile/molly.wiki">Bluesky</a> and{" "}
            <a href="https://hachyderm.io/@molly0xfff">Mastodon</a>, or can be
            contacted in a{" "}
            <a href="https://www.mollywhite.net/verify/">
              multitude of other ways
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
