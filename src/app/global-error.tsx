"use client";

import "./globals.css";

import {
  Big_Shoulders,
  IBM_Plex_Sans,
  Roboto,
  Source_Serif_4,
} from "next/font/google";
import { useEffect } from "react";

import styles from "./global-error.module.css";

const sansFont = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});
const displayFont = Big_Shoulders({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-display",
  fallback: ["Impact", "sans-serif"],
});
const robotoFont = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["400", "700"],
});
const serifFont = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

// When we deploy, Next rotates the content-hashed chunk filenames and the old
// ones 404 on the new Cloud Run revision. A client still running the previous
// build then throws ChunkLoadError mid-navigation. The fix is to reload once so
// the browser pulls fresh HTML with current hashes.
const RELOAD_KEY = "chunk-reload-at";
// If a reload doesn't resolve it within this window, treat the build as
// genuinely broken and stop reloading so we don't thrash. The window also lets
// the guard re-arm for a future deploy without any cleanup elsewhere.
const RELOAD_WINDOW_MS = 10_000;

function isChunkLoadError(error: Error): boolean {
  return (
    error.name === "ChunkLoadError" ||
    /Loading chunk [\w-]+ failed/i.test(error.message) ||
    /Loading CSS chunk [\w-]+ failed/i.test(error.message) ||
    /error loading dynamically imported module/i.test(error.message)
  );
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (!isChunkLoadError(error)) {
      return;
    }
    const last = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0);
    const now = Date.now();
    if (now - last < RELOAD_WINDOW_MS) {
      return;
    }
    sessionStorage.setItem(RELOAD_KEY, String(now));
    window.location.reload();
  }, [error]);

  return (
    <html lang="en">
      <body
        className={`${sansFont.variable} ${serifFont.variable} ${displayFont.variable} ${robotoFont.variable}`}
      >
        <main className={styles.page}>
          <div className={styles.card}>
            <span className={styles.label}>Error</span>
            <h1 className={styles.headline}>Something went wrong.</h1>
            <p className={styles.description}>
              The page failed to load. This usually clears up with a refresh.
            </p>
            <button
              type="button"
              className={styles.button}
              onClick={() => reset()}
            >
              ↻ Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
