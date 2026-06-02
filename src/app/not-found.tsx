import Link from "next/link";

import Header from "./components/Header";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className={styles.page}>
        <div className={styles.layout}>
          <div className={styles.filingCard}>
            <span className={styles.errorLabel}>Error</span>
            <div className={styles.errorCode}>404</div>
          </div>

          <div>
            <h1 className={styles.headline}>This trail goes cold.</h1>
            <p className={styles.description}>
              The page you&rsquo;re looking for doesn&rsquo;t exist or has
              moved.
            </p>
            <Link href="/" className={styles.backButton}>
              ← Back to home
            </Link>

            <p className={styles.directLinksLabel}>Or go directly to</p>
            <div className={styles.linkGrid}>
              <Link href="/2026/elections" className={styles.quickLink}>
                → 2026 elections
              </Link>
              <Link href="/2026/committees" className={styles.quickLink}>
                → PACs
              </Link>
              <Link href="/2026/companies" className={styles.quickLink}>
                → Companies
              </Link>
              <Link href="/2026/individuals" className={styles.quickLink}>
                → Individual donors
              </Link>
              <Link href="/analysis/quidproquo" className={styles.quickLink}>
                → Crypto quid pro quo
              </Link>
              <Link href="/about" className={styles.quickLink}>
                → About this project
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
