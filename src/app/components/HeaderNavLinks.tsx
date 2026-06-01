"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { parseSector, sectorHref } from "../utils/sector";
import styles from "./header.module.css";

type NavChild = { label: string; href: string; useSector?: boolean };
type NavItem = { id: string; label: string; children: NavChild[] };

const NAV_ITEMS: NavItem[] = [
  {
    id: "spending",
    label: "Spending",
    children: [
      { label: "By committees", href: "/2026/committees", useSector: true },
      { label: "By companies", href: "/2026/companies", useSector: true },
      { label: "By individuals", href: "/2026/individuals", useSector: true },
      { label: "By beneficiary", href: "/2026/beneficiaries", useSector: true },
    ],
  },
  {
    id: "elections",
    label: "Elections",
    children: [
      { label: "By state", href: "/2026/states", useSector: true },
      { label: "All elections", href: "/2026/elections", useSector: true },
    ],
  },
  {
    id: "recent",
    label: "Recent",
    children: [
      { label: "Contributions", href: "/2026/contributions", useSector: true },
      { label: "Expenditures", href: "/2026/expenditures", useSector: true },
    ],
  },
  {
    id: "rankings",
    label: "Rankings",
    children: [
      {
        label: "Super PACs",
        href: "/2026/committees/ranking/super",
      },
      {
        label: "All committees",
        href: "/2026/committees/ranking/all",
      },
    ],
  },
  {
    id: "influence",
    label: "Influence",
    children: [
      { label: "Quid pro quo", href: "/influence/quidproquo" },
      { label: "Contributions to Trump", href: "/influence/trump" },
    ],
  },
  {
    id: "about",
    label: "About",
    children: [
      { label: "About", href: "/about" },
      { label: "FAQ", href: "/about/faq" },
      { label: "Contact", href: "/about/contact" },
      { label: "Support", href: "/about/support" },
      { label: "Colophon", href: "/about/colophon" },
    ],
  },
];

export default function HeaderNavLinks() {
  const searchParams = useSearchParams();
  const sector = parseSector(searchParams.get("sector") ?? undefined);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  function childHref(child: NavChild) {
    if (child.useSector) {
      return sectorHref(child.href, sector);
    }
    return child.href;
  }

  function openMenu() {
    setMenuOpen(true);
  }

  function closeMenu() {
    setMenuOpen(false);
    setOpenSection(null);
  }

  function toggleSection(id: string) {
    setOpenSection((prev) => (prev === id ? null : id));
  }

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {/* Desktop nav — hidden on mobile */}
      <nav className={styles.nav}>
        <div className={styles.navLinks}>
          {NAV_ITEMS.map((item) => (
            <div key={item.id} className={styles.navItem}>
              <a href="#">{item.label}</a>
              <div className={styles.dropdown}>
                {item.children.map((child) => (
                  <Link key={child.href} href={childHref(child)}>
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Hamburger button — visible on mobile only */}
      <button
        className={styles.hamburger}
        onClick={openMenu}
        aria-label="Open menu"
        aria-expanded={menuOpen}
      >
        <span className={styles.hamburgerIcon} />
      </button>

      {/* Mobile full-screen menu sheet */}
      {menuOpen && (
        <div
          className={styles.mobileMenu}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className={styles.mobileMenuHeader}>
            <Link
              href="/"
              className={styles.mobileMenuBrand}
              onClick={closeMenu}
            >
              Tech Influence{" "}
              <span className={styles.mobileMenuWatch}>Watch</span>
            </Link>
            <button
              className={styles.mobileMenuClose}
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <span className={styles.closeIcon} />
            </button>
          </div>

          <nav>
            {NAV_ITEMS.map((item) => (
              <div key={item.id} className={styles.mobileSection}>
                <button
                  className={styles.mobileSectionButton}
                  onClick={() => toggleSection(item.id)}
                  aria-expanded={openSection === item.id}
                >
                  {item.label}
                  <span
                    className={`${styles.chevron} ${openSection === item.id ? styles.chevronOpen : ""}`}
                  />
                </button>
                {openSection === item.id && (
                  <div className={styles.mobileSectionLinks}>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={childHref(child)}
                        className={styles.mobileSectionLink}
                        onClick={closeMenu}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
