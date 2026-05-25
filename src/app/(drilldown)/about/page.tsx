import Image from "next/image";
import { Metadata } from "next";
import Link from "next/link";

import { customMetadata } from "@/app/utils/metadata";

import AboutNav from "./AboutNav";
import styles from "./page.module.css";

export const metadata: Metadata = customMetadata({
  title: "About",
  description: "About Follow the Crypto",
});

export default function AboutPage() {
  return (
    <div className={`${styles.about} single-column-page`}>
      <AboutNav />
      <h2>About</h2>
      <div className={styles.mainText}>
        <p>
          The cryptocurrency industry has been throwing money into politics
          unlike ever before. Despite the relatively small size of the industry,
          it was one of the largest industry spenders in the 2024 elections in
          the United States, and is poised to spend even more in the 2026
          midterms.
        </p>
        <p>
          Cryptocurrency companies have raised hundreds of millions of dollars
          to put towards buying crypto-friendly politicians and ousting those
          who have spoken up for stricter regulations to protect consumers in an
          industry that is{" "}
          <a href="https://web3isgoinggreat.com/">
            fraught with hacks, scams, and fraud
          </a>
          . Although parts of the industry have{" "}
          <a href="https://www.citationneeded.news/issue-62/#stand-with-crypto">
            tried to portray this as a grassroots effort
          </a>
          , the reality is that a very small number of crypto companies, and the
          billionaire executives and venture capitalists behind them, are
          spending millions with a singular goal: to obtain favorable crypto
          policy, no matter the cost.
        </p>
        <p>
          In 2026, the artificial intelligence industry began following the
          playbook developed by pro-cryptocurrency super PACS, and is now also
          spending millions to influence elections. This website was created to
          track this spending in real time,<sup>1</sup> and to hold these
          companies accountable for their attempts to buy influence in our
          democracy.
        </p>
        <div className={styles.quoteCard}>
          <Image
            src="https://storage.googleapis.com/follow-the-crypto-misc-assets/brian-armstrong.webp"
            alt="Brian Armstrong photograph"
            width={240}
            height={240}
            className={styles.quoteCardImage}
          />
          <div>
            <div className={styles.quote}>
              &ldquo;Money moves the needle. For better or worse, that&rsquo;s
              how our system works.&rdquo;
            </div>
            <div className={styles.quoteAttribution}>
              &ndash;{" "}
              <Link href="/2026/individuals/brian-armstrong">
                Brian Armstrong
              </Link>
              , <Link href="/2026/companies/coinbase">Coinbase</Link> CEO
              <div className={styles.quoteAttributionSource}>
                in a{" "}
                <a href="https://www.axios.com/newsletters/axios-crypto-4f9fc70a-8aca-4ebf-8977-35df739403b4.html">
                  2023 interview
                </a>
              </div>
            </div>
          </div>
        </div>

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
          <i>Citation Needed</i> to support this kind of independent research
          and writing.
        </p>
        <p>
          I have{" "}
          <a href="https://www.mollywhite.net/crypto-disclosures">
            disclosures
          </a>{" "}
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
          there <i>may be errors</i>. Always verify against primary sources
          before relying on this data for any purpose. If you think
          something&rsquo;s missing or erroneous, please{" "}
          <Link href="/about/contact">get in touch</Link>.
        </p>
        <h3 id="code">Code</h3>
        <p>
          The code for this website is all open source and available on Github:{" "}
          <a href="https://github.com/molly/follow-the-crypto">frontend</a>,{" "}
          <a href="https://github.com/molly/follow-the-crypto-backend">
            backend
          </a>
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
            “
            <a href="https://www.citizen.org/article/cryptobros-united-fairshake-super-pac-2024-elections/">
              Cryptobros United: Crypto Super PACs Amass Over $100 Million for
              2024 Elections
            </a>
            “, Rick Claypool at <i>Public Citizen</i> (May 6, 2024)
          </li>
          <li>
            “
            <a href="https://www.opensecrets.org/news/issues/crypto">
              Cryptocurrency
            </a>
            “, <i>OpenSecrets</i> (July 11, 2023)
          </li>
        </ul>
        <div className={styles.footnotes}>
          1. As close to real-time as possible, that is. There are some delays
          between when a contribution is made and when it is reported to the
          FEC.
        </div>
      </div>
    </div>
  );
}
