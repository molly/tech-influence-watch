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
            <div className={styles.errorCode}>
              4<span className={styles.errorZero}>0</span>4
            </div>
            <hr className={styles.rule} />
            <p className={styles.filingNote}>No filing found at this address.</p>
          </div>

          <div>
            <h1 className={styles.headline}>This trail goes cold.</h1>
            <p className={styles.description}>
              The page you&apos;re looking for doesn&apos;t exist or has moved.
              The money is out there &mdash;{" "}
              <Link href="/" className={styles.accentLink}>
                let&apos;s keep following it.
              </Link>
            </p>
            <Link href="/" className={styles.backButton}>
              ← Back to home
            </Link>

            <p className={styles.directLinksLabel}>Or go directly to</p>
            <div className={styles.linkGrid}>
              <Link href="/2026/elections" className={styles.quickLink}>
                → 2026 Elections
              </Link>
              <Link href="/2026/committees" className={styles.quickLink}>
                → PAC Committees
              </Link>
              <Link href="/2026/companies" className={styles.quickLink}>
                → Tech Companies
              </Link>
              <Link href="/2026/individuals" className={styles.quickLink}>
                → Individual Donors
              </Link>
              <Link href="/influence/quidproquo" className={styles.quickLink}>
                → Quid Pro Quo
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
