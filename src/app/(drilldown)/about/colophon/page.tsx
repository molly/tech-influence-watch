import { Metadata } from "next";
import Link from "next/link";

import { customMetadata } from "@/app/utils/metadata";

import styles from "./page.module.css";

export const metadata: Metadata = customMetadata({
  title: "About",
  description: "About Tech Influence Watch",
});

export default function Colophon() {
  return (
    <div className={styles.mainText}>
      <h3 id="who">Who I am</h3>
      <p>
        <i>Tech Influence Watch</i> is a project of{" "}
        <i>
          <a href="https://citationneeded.news/">Citation Needed</a>
        </i>
        , my independent newsletter covering cryptocurrency, technology, and
        tech policy. I&rsquo;m{" "}
        <a href="https://www.mollywhite.net/">Molly White</a>, a technology
        writer, researcher, and software engineer. I also run{" "}
        <a href="https://www.web3isgoinggreat.com/">
          <i>Web3 is Going Just Great</i>
        </a>
        , where I document the many disasters in the crypto industry.
      </p>
      <p>
        I don&rsquo;t use paywalls, run ads, or accept industry funding. This
        work is entirely supported by readers. Consider{" "}
        <a href="https://citationneeded.news/">subscribing</a> to{" "}
        <i>Citation Needed</i> to support this kind of independent research and
        writing.
      </p>
      <p>
        I have{" "}
        <a href="https://www.mollywhite.net/crypto-disclosures">disclosures</a>{" "}
        for my crypto-related work.
      </p>
      <h3 id="data">Data</h3>
      <p>
        Most of the data shown on this website comes directly from the{" "}
        <a href="https://fec.gov/">Federal Election Commission</a>. Some data
        about political advertisements comes from{" "}
        <a href="https://adstransparency.google.com/">
          Google&rsquo;s Ad Transparency Center
        </a>
        . Some additional information, such as news coverage and some other
        political ads, is gathered manually.
      </p>
      <p>
        Election data is messy, and despite best efforts to clean up the data,
        there <i>may be errors</i>. Always verify against primary sources before
        relying on this data for any purpose. If you think something&rsquo;s
        missing or erroneous, please{" "}
        <Link href="/about/contact">get in touch</Link>.
      </p>
      <h3 id="code">Code</h3>
      <p>
        The code for this website is all open source and available on Github:{" "}
        <a href="https://github.com/molly/follow-the-crypto">frontend</a>,{" "}
        <a href="https://github.com/molly/follow-the-crypto-backend">backend</a>
        .
      </p>
      <h3 id="further-reading">Further reading</h3>
      <h4>
        <i>Citation Needed</i>
      </h4>
      <ul>
        <li>
          &ldquo;
          <a href="https://www.citationneeded.news/crypto-super-pacs-2026-midterms/">
            Crypto super PACs have hundreds of millions ready to spend on the
            midterms
          </a>
          &rdquo; (February 20, 2026)
        </li>
        <li>
          Video: &ldquo;
          <a href="https://www.citationneeded.news/video-the-cryptocurrency-industrys-unprecedented-election-spending/">
            The Cryptocurrency Industry&lsquo;s Unprecedented Election Spending
          </a>
          &rdquo; (November 22, 2024)
        </li>
        <li>
          <a href="https://www.citationneeded.news/tag/crypto-lobby/">
            All posts tagged &ldquo;crypto lobby&rdquo;
          </a>
        </li>
      </ul>
      <h4>Other sources</h4>
      <ul>
        <li>
          &ldquo;
          <a href="https://www.citizen.org/article/cryptobros-united-fairshake-super-pac-2024-elections/">
            Cryptobros United: Crypto Super PACs Amass Over $100 Million for
            2024 Elections
          </a>
          &rdquo;, Rick Claypool at <i>Public Citizen</i> (May 6, 2024)
        </li>
        <li>
          &ldquo;
          <a href="https://www.opensecrets.org/news/issues/crypto">
            Cryptocurrency
          </a>
          &rdquo;, <i>OpenSecrets</i> (July 11, 2023)
        </li>
      </ul>
    </div>
  );
}
