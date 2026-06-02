import Link from "next/link";

import styles from "./footer.module.css";
import { NAV_ITEMS } from "./navItems";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContents}>
        <nav className={styles.sitemap} aria-label="Site navigation">
          {NAV_ITEMS.map((item) => (
            <div key={item.id} className={styles.sitemapSection}>
              <span className={styles.sitemapHeading}>{item.label}</span>
              <ul className={styles.sitemapLinks}>
                {item.children.map((child) => (
                  <li key={child.href}>
                    <Link href={child.href}>{child.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className={styles.description}>
          <i>Tech Influence Watch</i> is a project of{" "}
          <a href="https://www.citationneeded.news">
            <i>Citation Needed</i>
          </a>
          , an independent newsletter by Molly White.
          <br />
          This work is entirely reader-funded. If you find it valuable, consider{" "}
          <Link href="/about/support">supporting</Link>.
        </div>
        <div className={styles.links}>
          <Link href="/about">About this project</Link>
          <Link href="/about/support">Support this work</Link>
        </div>
        <div className={styles.copyright}>
          &copy; {new Date().getFullYear()} <i>Tech Influence Watch</i>.{" "}
          <i>Tech Influence Watch</i> was previously known as{" "}
          <i>Follow the Crypto</i>.
        </div>
      </div>
    </footer>
  );
}
