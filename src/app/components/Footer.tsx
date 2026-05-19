import Link from "next/link";

import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContents}>
        <p className={styles.description}>
          Tech Influence Watch is a project of{" "}
          <a href="https://www.citationneeded.news">
            <i>Citation Needed</i>
          </a>
          , an independent newsletter by Molly White. This work is entirely
          reader-funded. If you find it valuable, consider{" "}
          <Link href="/about/support">supporting</Link>.
        </p>
        <p className={styles.links}>
          <Link href="/about">About this project</Link>
          <Link href="/about/support">Support this work</Link>
        </p>
        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} <i>Tech Influence Watch</i>.{" "}
          <i>Tech Influence Watch</i> was previously known as{" "}
          <i>Follow the Crypto</i>.
        </p>
      </div>
    </footer>
  );
}
