import Link from "next/link";
import { type ReactNode } from "react";

import sharedStyles from "@/app/shared.module.css";

import styles from "./NotablePatterns.module.css";

type NotablePattern = {
  key: string;
  label: ReactNode;
  headline: string;
  description: ReactNode;
  href?: string;
};

const NOTABLE_PATTERNS: NotablePattern[] = [
  {
    key: "cross-sector",
    label: "Cross-sector · 13 races · $24.2M",
    headline:
      "Crypto and AI PACs are spending in the same races, often through the same two committees",
    description: (
      <>
        Thirteen races have seen spending from both crypto and AI PACs, totaling
        $24.2M. The most common pairing is{" "}
        <Link href="/2026/committees/C00836221">Defend American Jobs</Link> (the
        Republican arm of the Fairshake crypto super PAC network) and{" "}
        <Link href="/2026/committees/C00916692">American Mission</Link> (the
        Republican arm of the Leading the Future AI PAC network), which have
        spent in six of these races, always supporting the same candidate. One
        of the leaders of Leading the Future is also the longtime spokesperson
        for the Fairshake network.
      </>
    ),
  },
  {
    key: "intra-sector",
    label: (
      <>
        Intra-sector conflict ·{" "}
        <Link href="/2026/elections/NY-H-12">NY-H-12</Link>
      </>
    ),
    headline: "Two AI PACs spent $7M opposing each other in the same primary",
    description: (
      <>
        <Link href="/2026/committees/C00923417">Think Big</Link> spent $4.0M
        opposing <Link href="/2026/elections/NY-H-12">Alex Bores</Link> in New
        York&rsquo;s District 12;{" "}
        <Link href="/2026/committees/C00928374">Jobs and Democracy PAC</Link>{" "}
        spent $3.0M supporting him. This has been the only intra-sector conflict
        so far this cycle.
      </>
    ),
    href: "/2026/elections/NY-H-12",
  },
];

export default function NotablePatterns() {
  return (
    <section className={sharedStyles.section}>
      <h2 className={sharedStyles.sectionTitle}>
        Notable patterns
        <span className={sharedStyles.sectionTitleAmount}>
          updated manually
        </span>
      </h2>
      <div className={styles.patterns}>
        {NOTABLE_PATTERNS.map((pattern) => (
          <div key={pattern.key} className={styles.pattern}>
            <div className={styles.label}>{pattern.label}</div>
            {pattern.href ? (
              <Link href={pattern.href} className={styles.headline}>
                {pattern.headline}
              </Link>
            ) : (
              <span className={styles.headline}>{pattern.headline}</span>
            )}
            <p className={styles.description}>{pattern.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
