"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { sectorFromPathname, sectorHref } from "../utils/sector";
import styles from "./header.module.css";
import { NAV_ITEMS,NavChild } from "./navItems";

export default function HeaderNavLinks() {
  const pathname = usePathname();
  const sector = sectorFromPathname(pathname);
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
              {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
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
