import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  fetchCompanyTotalSpending,
  fetchTrumpGrandTotal,
} from "@/app/actions/fetch";
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
  const [companyTotalsData, trumpGrandTotalData] = await Promise.all([
    fetchCompanyTotalSpending("all"),
    fetchTrumpGrandTotal(),
  ]);
  const totalSpending =
    !isError(companyTotalsData) && companyTotalsData
      ? humanizeRoundedCurrency(
          (companyTotalsData as CompanyTotals).total,
          true,
          1,
        )
      : null;
  const trumpTotal =
    !isError(trumpGrandTotalData) && trumpGrandTotalData
      ? humanizeRoundedCurrency(trumpGrandTotalData as number, true, 1)
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
          <div className={styles.section}>
            <div className={styles.projectColumns}>
              <div className={styles.textColumn1}>
                <p className={styles.opener}>
                  The cryptocurrency industry has been throwing money into
                  politics unlike ever before. Despite the relatively small size
                  of the industry, it was one of the largest industry spenders
                  in the 2024 elections in the United States, and is poised to
                  spend even more in the 2026 midterms. In 2026, the artificial
                  intelligence industry began following the same playbook,
                  significantly ramping up their lobbying and campaign spending.{" "}
                  <span className="bold">
                    Together, crypto and AI companies tracked by Tech Influence
                    Watch represent {totalSpending} in contributions this cycle.
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
                  venture capitalists behind them&nbsp;&mdash; are spending
                  millions with a singular goal:{" "}
                  <span className="bold">
                    to obtain favorable crypto policy, no matter the cost
                  </span>
                  .
                </p>
              </div>
              <div className={styles.textColumn2}>
                <p>
                  <span className="bold">The strategy worked.</span> The
                  industry&rsquo;s more than $130&nbsp;million in 2024 election
                  spending helped install at least six new pro-crypto senators
                  and over a dozen crypto-friendly representatives,
                  <sup>
                    <a href="#ref-1" id="fn-1-ref">
                      1
                    </a>
                  </sup>{" "}
                  defeating key regulatory advocates including{" "}
                  <Link href="/2024/elections/OH-S">
                    Senate Banking Chair Sherrod Brown
                  </Link>{" "}
                  after a $40&nbsp;million ad campaign. Donald Trump has
                  received <span className="bold">{trumpTotal}</span> in
                  campaign contributions from crypto and AI companies and their
                  executives&nbsp;&mdash; while many of these same companies
                  simultaneously enriched him personally with{" "}
                  <span className="bold">more than $1&nbsp;billion</span>{" "}
                  through business deals involving his expanding portfolio of
                  crypto business ventures.
                  <sup>
                    <a href="#ref-2" id="fn-2-ref">
                      2
                    </a>
                  </sup>{" "}
                  After his election, he staffed the White House with crypto and
                  AI venture capitalists, giving the industries direct access to
                  policymaking at the highest levels. He has also pushed for
                  deregulatory legislation that would benefit these industries
                  and, by extension, his own holdings. Since then, we&rsquo;ve
                  seen{" "}
                  <Link href="/influence/quidproquo">
                    at least 21 enforcement actions or investigations against
                    crypto companies dropped or paused
                  </Link>
                  , industry-written legislation advanced through Congress, and
                  regulators who had pushed for consumer protections replaced
                  with Trump loyalists who gutted the agencies&rsquo; regulatory
                  capacity. Congress, shaped by hundreds of millions in industry
                  spending, has refused to address his blatant{" "}
                  <Link href="/influence/quidproquo">
                    crypto-related corruption
                  </Link>{" "}
                  or provide meaningful oversight.
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
                  intelligence development and regulation. They&rsquo;re
                  fighting local oversight and moratoriums that would give
                  communities power to reject the resource-intensive AI data
                  centers they increasingly oppose.
                  <sup>
                    <a href="#ref-3" id="fn-3-ref">
                      3
                    </a>
                  </sup>{" "}
                  Some industry PACs are working to block state or federal
                  legislation that would impose stricter regulations on AI
                  companies, hold them liable for harms caused by their
                  products, require safety assessments, or limit surveillance.
                  And while others claim to champion safety, these efforts often
                  serve to disadvantage competitors rather than protect the
                  public. Both factions echo the crypto industry in framing
                  their self-serving lobbying as principled advocacy aimed at
                  defending innovation, while in reality a handful of
                  well-funded companies are working to shape regulations that
                  will benefit their businesses at the expense of everyone else.
                </p>
                <p>
                  <span className="bold">
                    Most voters have no idea this is happening.
                  </span>{" "}
                  The crypto and AI industries have poured hundreds of millions
                  into elections, but much of that spending is obscured through
                  super PACs that run ads that don&rsquo;t mention the
                  industries funding them, or even the topics they are trying to
                  address. Candidates backed by crypto and AI money don&rsquo;t
                  campaign on crypto or AI policy&nbsp;&mdash; they run on other
                  issues while quietly committing to industry-friendly
                  positions. By the time voters learn who funded a campaign, the
                  election is over and the policies are already being signed
                  into law. A recent <i>CoinDesk</i> survey found that 73% of
                  voters disapprove of government officials having crypto
                  business ties, yet 55% weren&rsquo;t aware of the
                  president&rsquo;s involvement in the industry, and only 17%
                  knew he co-founded World Liberty Financial.
                  <sup>
                    <a href="#ref-4" id="fn-4-ref">
                      4
                    </a>
                  </sup>
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
                <p>
                  <i>Tech Influence Watch</i> (formerly <i>Follow the Crypto</i>
                  ) is a project of{" "}
                  <i>
                    <a href="https://www.citationneeded.news/">
                      Citation Needed
                    </a>
                  </i>
                  , my independent newsletter covering cryptocurrency,
                  technology, and tech policy&nbsp;&mdash; where the longer-form
                  reporting, analysis, and context behind this data lives.
                  I&rsquo;m{" "}
                  <a href="https://www.mollywhite.net/">Molly White</a>, a
                  technology writer, researcher, and software engineer. I also
                  run{" "}
                  <a href="https://www.web3isgoinggreat.com/">
                    Web3 is Going Just Great
                  </a>
                  , documenting the wider landscape of crypto industry failures.
                </p>
                <p>
                  <i>Tech Influence Watch</i>, like all{" "}
                  <i>Citation Needed projects</i>, has no ads, no paywalls, and
                  receives no industry funding. This means the companies
                  I&rsquo;m tracking can&rsquo;t buy my silence or influence
                  what I report, but it also means this work only exists because
                  readers support it.{" "}
                  <span className="bold">
                    The crypto and AI industries are spending hundreds of
                    millions to shape policy in their favor. Independent
                    documentation of that spending is the only way to begin to
                    counter it.
                  </span>{" "}
                  <a href="https://www.citationneeded.news/signup/">
                    Subscribe to <i>Citation Needed</i>
                  </a>{" "}
                  to keep this work going.
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
                      <div className={styles.imageAttribution}>
                        (
                        <a href="https://commons.wikimedia.org/wiki/File:Brian_Armstrong_-_TechCrunch_Disrupt_2018_02.jpg">
                          image
                        </a>{" "}
                        by TechCrunch,{" "}
                        <a href="https://creativecommons.org/licenses/by/2.0/deed.en">
                          CC BY 2.0
                        </a>
                        )
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
              <div className={styles.footnotesAndReferences}>
                <ol className={styles.footnotes}>
                  <li id="fn-a" className={styles.footnote}>
                    As close to real-time as possible, that is. There are some
                    delays between when a contribution is made and when it is
                    reported to the FEC.{" "}
                    <a href="#fn-a-ref" className={styles.footnoteBackref}>
                      ↩
                    </a>
                  </li>
                </ol>
                <ol className={styles.references}>
                  <li id="ref-1" className={styles.footnote}>
                    &ldquo;
                    <a href="https://www.politico.com/news/2024/11/08/crypto-2024-elections-00187415">
                      Crypto won the 2024 elections. Now comes the easy part.
                    </a>
                    &rdquo;, <i>Politico</i>.
                    <a href="#fn-1-ref" className={styles.footnoteBackref}>
                      ↩
                    </a>
                  </li>
                  <li id="ref-2" className={styles.footnote}>
                    &ldquo;
                    <a href="https://www.citizen.org/article/trump-crypto-world-liberty-financial-binance-iran-sanctions/">
                      Conflict Coin: How the Trumps’ Billion-Dollar Crypto Stake
                      Depends on a Company That Helped Iran Evade Sanctions
                    </a>
                    &rdquo;, Public Citizen.
                    <a href="#fn-2-ref" className={styles.footnoteBackref}>
                      ↩
                    </a>
                  </li>
                  <li id="ref-3" className={styles.footnote}>
                    &ldquo;
                    <a href="https://stateline.org/2026/05/28/more-cities-are-pressing-pause-on-data-centers-as-local-backlash-grows/">
                      More cities are pressing pause on data centers as local
                      backlash grows
                    </a>
                    &rdquo;, <i>Stateline</i>.
                    <a href="#fn-3-ref" className={styles.footnoteBackref}>
                      ↩
                    </a>
                  </li>
                  <li id="ref-4" className={styles.footnote}>
                    &ldquo;
                    <a href="https://www.coindesk.com/policy/2026/05/03/u-s-voters-don-t-trust-trump-administration-to-oversee-crypto-sector-coindesk-poll-finds">
                      U.S. voters don&rsquo;t trust Trump administration to
                      oversee crypto sector, CoinDesk poll finds
                    </a>
                    &rdquo;, <i>CoinDesk</i>.
                    <a href="#fn-4-ref" className={styles.footnoteBackref}>
                      ↩
                    </a>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
