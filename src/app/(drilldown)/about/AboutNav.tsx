"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./page.module.css";

const links = [
  { href: "/about", label: "About" },
  { href: "/about/colophon", label: "Colophon" },
  { href: "/about/faq", label: "FAQ" },
  { href: "/about/support", label: "Support" },
  { href: "/about/contact", label: "Contact" },
];

export default function AboutNav() {
  const pathname = usePathname();
  return (
    <div className={styles.subpageLinks}>
      {links.map(({ href, label }) =>
        pathname === href ? (
          <span key={href} className={styles.subpageLinksActive}>
            {label}
          </span>
        ) : (
          <Link key={href} href={href}>
            {label}
          </Link>
        ),
      )}
    </div>
  );
}
