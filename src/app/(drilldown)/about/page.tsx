import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { fetchCompanyTotalSpending } from "@/app/actions/fetch";
import sharedStyles from "@/app/shared.module.css";
import { CompanyTotals } from "@/app/types/Companies";
import { isError } from "@/app/utils/errors";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";
import { customMetadata } from "@/app/utils/metadata";

import AboutNav from "./AboutNav";
import styles from "./page.module.css";

export const metadata: Metadata = customMetadata({
  title: "About",
  description: "About Tech Influence Watch",
});

export default async function AboutPage() {
  const companyTotalsData = await fetchCompanyTotalSpending("all");
  const totalSpending =
    !isError(companyTotalsData) && companyTotalsData
      ? humanizeRoundedCurrency(
          (companyTotalsData as CompanyTotals).total,
          true,
          1,
        )
      : null;
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
          <div className={styles.projectSection}>
            <div className={styles.projectSectionHeader}>
              <h3>The project</h3>
            </div>
            <div className={styles.projectColumns}>
              <div className={styles.textColumn}>
                <p className={styles.opener}>
                  The cryptocurrency industry has been throwing money into
                  politics unlike ever before. Despite the relatively small size
                  of the industry, it was one of the largest industry spenders
                  in the 2024 elections in the United States, and is poised to
                  spend even more in the 2026 midterms. In 2026, the artificial
                  intelligence industry began following the same playbook,
                  significantly ramping up their lobbying and campaign spending.
                  Some companies and individuals tracked by Tech Influence Watch
                  span both categories;{" "}
                  <span className="bold">
                    together they represent {totalSpending} in contributions
                    this cycle.
                  </span>
                </p>
                <p>
                  Cryptocurrency companies have raised hundreds of millions of
                  dollars to buy crypto-friendly politicians and oust those who
                  have pushed for stricter regulations on an industry{" "}
                  <a href="https://web3isgoinggreat.com/">
                    fraught with hacks, scams, and fraud
                  </a>
                  . Although parts of the industry have{" "}
                  <a href="https://www.citationneeded.news/issue-62/#stand-with-crypto">
                    tried to portray this as a grassroots effort
                  </a>
                  , the reality is that a very small number of crypto
                  companies&nbsp;&mdash; and the billionaire executives and
                  venture capitalists behind them&nbsp;&ndash; are spending
                  millions with a singular goal:{" "}
                  <span className="bold">
                    to obtain favorable crypto policy, no matter the cost
                  </span>
                  .
                </p>
                <p>
                  <span className="bold">The strategy worked.</span> The
                  industry&rsquo;s spending helped elect at least six new
                  pro-crypto senators and over a dozen crypto-friendly
                  representatives, defeating key regulatory advocates including{" "}
                  <Link href="/2024/elections/OH-S">
                    Senate Banking Chair Sherrod Brown
                  </Link>{" "}
                  after a $40&nbsp;million ad campaign. Since then, we&rsquo;ve
                  seen{" "}
                  <Link href="/influence/quidproquo">
                    at least 21 enforcement actions or investigations against
                    crypto companies dropped or paused
                  </Link>
                  , industry-written legislation advanced through Congress, and
                  financial regulators who had pushed for consumer protections
                  replaced with Trump loyalists who gutted the agencies&rsquo;
                  regulatory capacity. Meanwhile, the president&nbsp;&mdash; who
                  has made more than $1&nbsp;billion from his family&rsquo;s
                  crypto ventures&nbsp;&mdash; has pushed for deregulatory
                  legislation that would benefit the industry and, by extension,
                  his own holdings.
                </p>
                <blockquote className={styles.pullQuote}>
                  <p>
                    &ldquo;This reckless deregulatory agenda, driven by greed,
                    threatens to destabilize our financial system and pummel the
                    health of our economy. The end result could be a financial
                    crisis that devastates individuals, families, and
                    communities, regardless of whether they invested in crypto,
                    and could lead to a bailout that costs many billions of
                    dollars in government intervention and recovery
                    efforts.&rdquo;
                  </p>
                  <cite>
                    <span>Americans for Financial Reform</span>
                    <a href="https://ourfinancialsecurity.org/resources/we-pay-the-cost-for-crypto-corruption/">
                      We&rsquo;ll All Pay the Cost for Crypto Corruption
                    </a>
                    <span>March 5, 2026</span>
                  </cite>
                </blockquote>
                <p>
                  Artificial intelligence companies are now deploying similar
                  tactics, spending heavily to shape policy around artificial
                  intelligence development and regulation. They aim to block
                  legislation that would impose stricter regulations on AI
                  companies or open them to liability for harms caused by their
                  products, and to avoid oversight over the construction of
                  resource-intensive AI data centers. Various AI groups are also
                  pushing for their own preferred regulations (or lack thereof)
                  pertaining to public safety and mass surveillance. Like the
                  crypto industry, AI companies frame their lobbying as
                  protecting innovation, while the reality is a concentrated
                  effort by a handful of well-funded companies to shape
                  regulations in ways that benefit their businesses, often at
                  the expense of everyone else.
                </p>
                <p>
                  <span className="bold">
                    Most voters have no idea this is happening.
                  </span>{" "}
                  The crypto and AI industries have poured hundreds of millions
                  into elections, but much of that spending is obscured through
                  super PACs whose ads don&rsquo;t mention the industries
                  funding them. Candidates backed by crypto money don&nbsp;t
                  campaign on crypto policy&nbsp;&mdash; they run on other
                  issues while quietly committing to industry-friendly
                  positions. By the time voters learn who funded a campaign, the
                  election is over and the policies are already being signed
                  into law. A recent <i>CoinDesk</i> survey found that 73% of
                  voters disapprove of government officials having crypto
                  business ties, yet 55% weren&rsquo;t aware of the
                  president&rsquo;s involvement in the industry, and only 17%
                  knew he co-founded World Liberty Financial.
                </p>
                <p>
                  This website tracks this spending in real time,
                  <sup>
                    <a href="#fn-a" id="fn-a-ref">
                      a
                    </a>
                  </sup>{" "}
                  documenting the flow of money from tech companies to
                  politicians and making visible the influence these industries
                  are buying in our democracy.
                </p>
              </div>
              <aside className={styles.quoteColumn}>
                <div className={styles.quoteCard}>
                  <div className={styles.quoteImageArea}>
                    <span
                      className={`${sharedStyles.sectorBadge} ${styles.quoteBadgePos}`}
                    >
                      Coinbase CEO
                    </span>
                    <div className={styles.quoteImageContainer}>
                      <Image
                        src="https://storage.googleapis.com/follow-the-crypto-misc-assets/brian-armstrong.webp"
                        alt="Brian Armstrong photograph"
                        fill
                        sizes="(max-width: 768px) 100vw, 40vw"
                        className={styles.quoteCardImage}
                      />
                    </div>
                  </div>
                  <div className={styles.quoteContent}>
                    <div className={styles.quote}>
                      &ldquo;Money moves the needle. For better or worse,
                      that&rsquo;s how our system works.&rdquo;
                    </div>
                    <div className={styles.quoteAttribution}>
                      &ndash;{" "}
                      <Link href="/2026/individuals/brian-armstrong">
                        Brian Armstrong
                      </Link>
                      , <Link href="/2026/companies/coinbase">Coinbase</Link>{" "}
                      CEO
                      <div className={styles.quoteAttributionSource}>
                        in a{" "}
                        <a href="https://www.axios.com/newsletters/axios-crypto-4f9fc70a-8aca-4ebf-8977-35df739403b4.html">
                          2023 interview
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
          <div className={styles.mainText}>
            <h3 id="who">Who I am</h3>
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
            <h3 id="data">Data</h3>
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
            <h3 id="code">Code</h3>
            <p>
              The code for this website is all open source and available on
              Github:{" "}
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
            <div className={styles.footnotes}>
              <div id="fn-a" className={styles.footnote}>
                <span className={styles.footnoteLabel}>a.</span> As close to
                real-time as possible, that is. There are some delays between
                when a contribution is made and when it is reported to the FEC.{" "}
                <a href="#fn-a-ref" className={styles.footnoteBackref}>
                  ↩
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
