import Link from "next/link";
import { Suspense } from "react";

import { fetchPipelineLastRun } from "@/app/actions/fetch";

import styles from "./header.module.css";
import HeaderNavLinks from "./HeaderNavLinks";
import Logo from "./Logo";
import SectorWrapper from "./SectorWrapper";

export default async function Header() {
  const lastRun = await fetchPipelineLastRun();
  return (
    <header className={styles.headerWrapper}>
      <div className={styles.topbar}>
        <div className={styles.topbarContents}>
          <span className={styles.topbarLogo}>a [citation needed] project</span>
          <Link href="/about/support" className={styles.topbarButton}>
            Support
          </Link>
        </div>
      </div>
      <div className={styles.logoAndNav}>
        <Link href="/" className={styles.logoLink}>
          <Logo />
        </Link>
        <Suspense fallback={null}>
          <HeaderNavLinks />
        </Suspense>
      </div>
      <Suspense fallback={null}>
        <SectorWrapper lastRun={lastRun} />
      </Suspense>
    </header>
  );
}
