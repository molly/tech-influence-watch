"use client";

import { useEffect, useState } from "react";

import styles from "./SubscribeBanner.module.css";

const DISMISSED_COOKIE = "ftc_subscribe_dismissed";
const VISITED_COOKIE = "ftc_visited";

function getCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp("(^| )" + name + "=([^;]+)"),
  );
  return match ? match[2] : null;
}

function setCookie(name: string, value: string, days: number): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

export default function SubscribeBanner({
  amount,
}: {
  amount: string | null;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (getCookie(DISMISSED_COOKIE)) {
      return;
    }

    const isReturnVisit = !!getCookie(VISITED_COOKIE);
    setCookie(VISITED_COOKIE, "1", 365);

    if (isReturnVisit) {
      setVisible(true);
      return;
    }

    const handleScroll = () => {
      const scrolled = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0 && scrolled / docHeight >= 0.5) {
        setVisible(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dismiss = () => {
    setCookie(DISMISSED_COOKIE, "1", 30);
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className={styles.banner}>
      <p className={styles.text}>
        Crypto and AI companies have spent {amount} on this election cycle. One
        researcher is tracking every dollar. Subscribe to{" "}
        <em>Citation Needed</em> to support independent reporting.
      </p>
      <a
        href="https://www.citationneeded.news/signup/"
        className={styles.button}
        target="_blank"
        rel="noopener noreferrer"
      >
        Subscribe →
      </a>
      <button className={styles.dismiss} onClick={dismiss} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}
