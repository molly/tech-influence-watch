import { Metadata } from "next";
import Link from "next/link";

import sharedStyles from "@/app/shared.module.css";
import { customMetadata } from "@/app/utils/metadata";

import AboutNav from "../AboutNav";
import styles from "../page.module.css";

export const metadata: Metadata = customMetadata({
  title: "Colophon",
  description: "About Tech Influence Watch",
});

export default function Colophon() {
  return (
    <div className={sharedStyles.fullWidthHeader}>
      <div className={sharedStyles.header}>
        <h1 className={sharedStyles.title}>About</h1>
      </div>
      <div className={styles.navRow}>
        <AboutNav />
      </div>
      <div className={`${sharedStyles.main} ${styles.bodyText}`}>
        <div className="single-column-page">
          <h2 className={styles.subpageTitle}>Colophon</h2>
          <div className={styles.aboutPage}>
            <h3 className={styles.aboutSectionHeader} id="who">
              Who I am
            </h3>
            <p>
              <i>Tech Influence Watch</i> is a project of{" "}
              <i>
                <a href="https://citationneeded.news/">Citation Needed</a>
              </i>
              , my independent newsletter covering cryptocurrency, technology,
              and tech policy. I&rsquo;m{" "}
              <a href="https://www.mollywhite.net/">Molly White</a>, a
              technology writer, researcher, and software engineer. I also run{" "}
              <a href="https://www.web3isgoinggreat.com/">
                <i>Web3 is Going Just Great</i>
              </a>
              , where I document the many disasters in the crypto industry.
            </p>
            <p>
              I don&rsquo;t use paywalls, run ads, or accept industry funding.
              This work is entirely supported by readers. Consider{" "}
              <a href="https://citationneeded.news/">subscribing</a> to{" "}
              <i>Citation Needed</i> to support this kind of independent
              research and writing.
            </p>
            <p>
              I have{" "}
              <a href="https://www.mollywhite.net/crypto-disclosures">
                disclosures
              </a>{" "}
              for my crypto-related work.
            </p>
            <h3 className={styles.aboutSectionHeader} id="data">
              Data
            </h3>
            <p>
              Most of the data shown on this website comes directly from the{" "}
              <a href="https://fec.gov/">Federal Election Commission</a>. Some
              data about political advertisements comes from{" "}
              <a href="https://adstransparency.google.com/">
                Google&rsquo;s Ad Transparency Center
              </a>
              . Some additional information, such as news coverage and some
              other political ads, is gathered manually.
            </p>
            <p>
              Election data is messy, and despite best efforts to clean up the
              data, there <i>may be errors</i>. Always verify against primary
              sources before relying on this data for any purpose. If you think
              something&rsquo;s missing or erroneous, please{" "}
              <Link href="/about/contact">get in touch</Link>.
            </p>

            <h3 className={styles.aboutSectionHeader} id="col-methodology">
              Methodology
            </h3>

            <h4>Which entities are tracked</h4>
            <p>
              This site tracks political spending by companies and individuals
              with significant ties to the cryptocurrency or artificial
              intelligence industries. For companies, inclusion is based on
              whether a meaningful part of the company&rsquo;s business involves
              cryptocurrency, blockchain technology, or AI development. For
              individuals, inclusion is based on executive or senior-level roles
              at tracked companies, or on significant personal investment
              activity in the sector (e.g. prominent crypto- or AI-focused
              venture capitalists).
            </p>
            <p>
              Entities are added manually as they appear in FEC data or are
              identified through reporting. If you believe a company or
              individual is missing, please{" "}
              <Link href="/about/contact">get in touch</Link> or{" "}
              <a href="https://github.com/molly/follow-the-crypto/pulls">
                open a GitHub issue
              </a>
              .
            </p>

            <h4>Attribution</h4>
            <p>
              Contributions are attributed to a company when the corporate
              entity made the contribution, or the donor lists that company as
              their employer in FEC filings. Individual contributions are
              attributed to the person named in the filing. Where FEC data
              contains obvious errors&nbsp;&mdash; misspelled names, malformed
              employer strings, duplicate entries&nbsp;&mdash; corrections are
              made manually and noted where relevant.
            </p>
            <p>
              Some contributions are listed as &ldquo;Individual&rdquo; rather
              than attributed to a named person. This applies to donors who do
              not appear to be executives or senior employees at tracked
              companies; their contributions are still counted in totals but
              identifying information is redacted. See the{" "}
              <Link href="/about/faq#individual">FAQ</Link> for more.
            </p>

            <h4>Election cycles</h4>
            <p>
              Data currently covers the 2026 federal election cycle. Data from
              2024 is preserved at an <Link href="/2024">archived version</Link>
              . The 2026 cycle is ongoing; figures will change as new FEC
              reports are filed. Historical cycles are considered complete but
              may be amended if errors are found. The site does not currently
              track state-level campaign finance outside of federal races.
            </p>

            <h4>Limitations</h4>
            <p>
              FEC data has inherent delays: committee reports are typically
              filed monthly or quarterly, while independent expenditures must be
              reported within 24 or 48 hours. Totals shown on this site reflect
              the most recently available filings and may not capture the very
              latest activity. In-kind cryptocurrency contributions have known
              double-reporting issues in the FEC database; this site applies
              corrections where identified. This site does not attempt to track
              dark money or spending that is not disclosed to the FEC.
            </p>

            <h3 className={styles.aboutSectionHeader}>Code &amp; tech stack</h3>
            <p>
              The code for this website is all open source and available on
              Github:{" "}
              <a href="https://github.com/molly/follow-the-crypto">frontend</a>,{" "}
              <a href="https://github.com/molly/follow-the-crypto-backend">
                backend
              </a>
              .
            </p>
            <p>
              The frontend is a <a href="https://nextjs.org/">Next.js</a>{" "}
              application written in TypeScript. Some data visualizations are
              built with <a href="https://d3js.org/">D3</a>. Data is served from{" "}
              <a href="https://firebase.google.com/">Firebase</a>.
            </p>
            <p>
              The{" "}
              <a href="https://github.com/molly/follow-the-crypto-backend">
                backend
              </a>{" "}
              is a separate Python service responsible for ingesting and
              processing raw FEC data.
            </p>
            <p>
              Some AI coding tools (Claude and a variety of open-source models)
              were used to assist with coding and design. All code is reviewed
              by me, and I do not use large language models to fetch, generate,
              or analyze any of the data on this site. Data comes from FEC
              filings and the other primary sources described above, and LLMs
              are not in the pipeline that processes the data.
            </p>
            <p>
              Caching and additional cloud services are generously provided by{" "}
              <a href="https://www.fastly.com/">Fastly</a> through their{" "}
              <a href="https://www.fastly.com/fast-forward">Fast Forward</a>{" "}
              program.
            </p>
            <p>
              Some of the tools and services I use to build and run this site
              are made by companies it tracks: namely Firebase/Google Cloud
              Platform (<Link href="/2026/companies/google">Google</Link>),
              VSCode and Github (
              <Link href="/2026/companies/microsoft">Microsoft</Link>), and
              Claude (<Link href="/2026/companies/anthropic">Anthropic</Link>).
              No company tracked here funds this site, has any say in what it
              reports, or gets advance notice of anything I publish, and the
              site is built to be resilient in the event of pressure or takedown
              attempts.
            </p>
            <h3 className={styles.aboutSectionHeader} id="col-license">
              License &amp; reuse
            </h3>
            <p>
              The source code for this site is released under the{" "}
              <a href="https://github.com/molly/follow-the-crypto/blob/main/LICENSE">
                MIT License
              </a>{" "}
              &mdash; you are free to use, copy, modify, and distribute it. The
              underlying campaign finance data comes from the{" "}
              <a href="https://fec.gov/">Federal Election Commission</a> and is
              in the public domain.
            </p>
            <p>
              If you use data from this site in reporting, research, or
              publications, attribution to <em>Tech Influence Watch</em> is
              appreciated but not required. If you find an error in something
              you&rsquo;ve published based on this data, please{" "}
              <Link href="/about/contact">let me know</Link> so it can be
              corrected at the source.
            </p>
            <h3 className={styles.aboutSectionHeader} id="further-reading">
              Further reading
            </h3>
            <h4>
              <i>Citation Needed</i>
            </h4>
            <ul>
              <li>
                &ldquo;
                <a href="https://www.citationneeded.news/crypto-super-pacs-2026-midterms/">
                  Crypto super PACs have hundreds of millions ready to spend on
                  the midterms
                </a>
                &rdquo; (February 20, 2026)
              </li>
              <li>
                Video: &ldquo;
                <a href="https://www.citationneeded.news/video-the-cryptocurrency-industrys-unprecedented-election-spending/">
                  The Cryptocurrency Industry&lsquo;s Unprecedented Election
                  Spending
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
                  Cryptobros United: Crypto Super PACs Amass Over $100 Million
                  for 2024 Elections
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
        </div>
      </div>
    </div>
  );
}
