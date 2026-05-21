import "./globals.css";

import type { Metadata } from "next";
import {
  Barlow_Semi_Condensed,
  Big_Shoulders,
  Roboto,
  Roboto_Mono,
} from "next/font/google";

import Footer from "./components/Footer";
import { BASE_METADATA } from "./utils/metadata";

export const revalidate = 3600;
const sansFont = Barlow_Semi_Condensed({
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
const monoFont = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400"],
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
        <link rel="me" href="https://hachyderm.io/@followthecrypto" />
      </head>
      <body
        className={`${sansFont.variable} ${displayFont.variable} ${robotoFont.variable} ${monoFont.variable}`}
      >
        <div className="flex1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
