import Link from "next/link";

import styles from "./AnnouncementBanner.module.css";

export default function AnnouncementBanner() {
  return (
    <section className={styles.banner}>
      <div className={styles.headlineColumn}>
        <div className={styles.eyebrow}>
          <span className={styles.rule} aria-hidden="true" />
          <span className={styles.kicker}>Announcement</span>
          <span className={styles.date}>· June 8, 2026</span>
        </div>
        <h2 className={styles.headline}>It&rsquo;s not just crypto anymore.</h2>
      </div>
      <div className={styles.bodyColumn}>
        <p className={styles.body}>
          This site started by tracking the cryptocurrency industry&rsquo;s
          political spending. Artificial intelligence&nbsp;companies are now
          copying the same playbook, with the same strategists and the same
          backers. Here&rsquo;s what&rsquo;s new.
        </p>
        <div className={styles.actions}>
          <Link
            href="https://www.citationneeded.news/tech-influence-watch/"
            className={styles.cta}
          >
            Read the full announcement &rarr;
          </Link>
          <span className={styles.readTime}>~14 min read</span>
        </div>
      </div>
    </section>
  );
}
