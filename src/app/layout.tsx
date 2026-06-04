import "./globals.css";

import type { Metadata } from "next";
import {
  Big_Shoulders,
  IBM_Plex_Sans,
  Roboto,
  Source_Serif_4,
} from "next/font/google";

import Footer from "./components/Footer";
import SubscribeBannerWrapper from "./components/SubscribeBannerWrapper";
import { BASE_METADATA } from "./utils/metadata";

export const revalidate = 86400;
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

export const metadata: Metadata = BASE_METADATA;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="me" href="https://hachyderm.io/@followthecrypto" />
      </head>
      <body
        className={`${sansFont.variable} ${serifFont.variable} ${displayFont.variable} ${robotoFont.variable}`}
      >
        <div className="flex1">{children}</div>
        <SubscribeBannerWrapper />
        <Footer />
      </body>
    </html>
  );
}
