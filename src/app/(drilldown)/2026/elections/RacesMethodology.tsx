import Link from "next/link";

import styles from "./RacesMethodology.module.css";

export default function RacesMethodology() {
  return (
    <section className={styles.methodology} aria-label="Methodology">
      <div className={styles.cyclesNote}>
        <span className={styles.cyclesLabel}>Earlier cycles</span>
        <p className={styles.note}>
          This page covers the{" "}
          <span className={styles.noteEmph}>2025&ndash;2026</span> federal
          cycle. Spending from the 2024 races&nbsp;&mdash; tracked under the
          project&rsquo;s former name,{" "}
          <span className="italic">Follow the Crypto</span> &mdash; is preserved
          in the <Link href="/2024">2024 archive</Link>.
        </p>
      </div>
      <p className={styles.note}>
        Support and oppose figures reflect independent expenditures by tracked
        super PACs as reported to the Federal Election Commission. Direct
        contributions are itemized contributions from industry-linked donors to
        campaign committees and other committees focused on supporting that
        cnadidate. Spending and contributions are categorized as crypto- or
        AI-aligned using the methodology described in the{" "}
        <Link href="/about/faq#classification">FAQ</Link>.
      </p>
      <p className={styles.note}>
        Goal achieved? indicates whether the industry&rsquo;s preferred outcome
        in a settled race occurred&nbsp;&mdash; typically, whether a supported
        candidate won or an opposed candidate lost.
      </p>
    </section>
  );
}
