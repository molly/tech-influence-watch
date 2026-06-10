import { Metadata } from "next";
import Link from "next/link";

import sharedStyles from "@/app/shared.module.css";
import { customMetadata } from "@/app/utils/metadata";

import AboutNav from "../AboutNav";
import styles from "../page.module.css";

export const metadata: Metadata = customMetadata({
  title: "FAQ",
  description: "Frequently asked questions about Tech Influence Watch.",
});

export default function FAQPage() {
  return (
    <div className={sharedStyles.fullWidthHeader}>
      <div className={sharedStyles.header}>
        <h1 className={sharedStyles.title}>About</h1>
      </div>
      <div className={styles.navRow}>
        <AboutNav />
      </div>
      <div className={`${sharedStyles.main} ${styles.bodyText}`}>
        <h2 className={styles.subpageTitle}>Frequently asked questions</h2>
        <div className={`single-column-page ${styles.faqPage}`}>
          <h3 className={styles.aboutSectionHeader} id="rename">
            Why was the site renamed from &ldquo;Follow the Crypto&rdquo; to
            &ldquo;Tech Influence Watch&rdquo;?
          </h3>
          <p>
            When I{" "}
            <a href="https://www.citationneeded.news/follow-the-crypto/">
              launched this project in 2024
            </a>
            , it focused exclusively on cryptocurrency industry spending, hence
            the name. Along with the staggering amount of money they poured into
            the elections, they also developed a unique and incredibly
            aggressive{" "}
            <a href="https://www.citationneeded.news/crypto-super-pacs-2026-midterms/#the-playbook">
              playbook
            </a>
            : identify the legislators sympathetic to their agenda and flood
            them with cash; flip those who opposed them with promises of funding
            and primary anyone who wouldn&rsquo;t comply; buy influence with and
            direct access to the president through campaign contributions and
            his family&rsquo;s crypto ventures; wrap it all in a persecution
            narrative about &ldquo;debanking&rdquo; and a &ldquo;war on
            crypto&rdquo; and &ldquo;stifling innovation&rdquo; while presenting
            naked self-interest as a noble fight for individual freedom.
          </p>
          <p>
            By 2026, artificial intelligence companies were following the same
            playbook. Some of the biggest crypto spenders I was already
            tracking, like{" "}
            <Link href="/2026/companies/andreessen-horowitz">
              Andreessen Horowitz
            </Link>
            , also have substantial AI investments and were spending as much or
            more to back these new PACs as they were on crypto. The PACs are
            also themselves intertwined: Josh Vlasto, the spokesperson for the
            <Link href="/2026/committees/C00835959">Fairshake</Link> crypto
            super PAC network, simultaneously leads the{" "}
            <Link href="/2026/committees/C00916114">Leading the Future</Link> AI
            super PAC network. And increasingly, the PACs appear to coordinate
            spending.
          </p>
          <p>
            Only tracking the crypto side of this network would mean telling
            only half the story. The old domain still works if you&rsquo;ve
            bookmarked it.
          </p>
          <h3 className={styles.aboutSectionHeader} id="scope">
            Which elections and committees does this track? Does it include
            state races?
          </h3>
          <p>
            This site tracks money in U.S. federal elections (President, Senate,
            and House of Representatives) using data reported to the Federal
            Election Commission. That includes candidate campaigns, party
            committees, PACs, and super PACs that file with the FEC.
            Occasionally state-level candidates will have federally registered
            PACs (particularly if they&rsquo;ve previously run for federal
            office). Contributions from tracked companies and individuals to
            such PACs will appear, but the entirety of spending on those races
            will not.
          </p>
          <p>
            Although I would love to someday track state-level spending,
            particularly as the AI industry has been spending heavily at that
            level, every state runs its own campaign finance system and
            reconciling 50 of them is currently beyond my capacity.
          </p>
          <h3 className={styles.aboutSectionHeader} id="classification">
            What counts as a crypto or AI company?
          </h3>
          <p>
            For crypto, this includes exchanges, stablecoin issuers, blockchain
            infrastructure and mining companies, and funds whose portfolio
            includes a substantial number of crypto-related companies. For AI, I
            focus on companies building or deploying AI models, data center
            infrastructure, and the funds that substantially back them. The line
            can get blurry&nbsp;&mdash; some companies are involved in both
            sectors and categorized accordingly on this site. And some tech
            companies that are not exclusively AI- or crypto-focused, like{" "}
            <Link href="/2026/companies/google">Google</Link> and{" "}
            <Link href="/2026/companies/oracle">Oracle</Link> are tracked
            because of their substantial activity in these sectors.
          </p>
          <h3 className={styles.aboutSectionHeader} id="criteria">
            What criteria determine which companies and individuals are
            included?
          </h3>
          <p>
            Companies are included if they have substantial interests in the
            cryptocurrency or artificial intelligence industries and have made
            significant contributions reportable to the FEC. Individuals are
            included if they are executives, senior employees, or major
            investors at those companies and have made contributions that appear
            connected to their role in the industry. I make judgment calls here;
            not every person who works at a crypto company and donates to a
            political campaign is included. If you think a company or individual
            is missing, please <Link href="/about/contact">get in touch</Link>.
          </p>
          <h3 className={styles.aboutSectionHeader} id="distinction">
            Why does the site track people and companies who mostly contributed
            to regular party and campaign committees, not AI or crypto super
            PACs?
          </h3>
          <p>
            This site counts two different things: money flowing{" "}
            <span className="italic">to</span> crypto- and AI-aligned
            committees, and money flowing <span className="italic">from</span>{" "}
            people and companies with major crypto or AI interests. A donor can
            show up prominently here even if most of their giving is generic
            party money with little explicitly labeled crypto or AI, because the
            point is partly to follow where the industry&rsquo;s money{" "}
            <span className="italic">goes</span>, not only money that lands in
            an industry PAC.
          </p>
          <p>
            Both matter. Industry PACs are the most direct form of influence,
            but the personal political giving of the industry&rsquo;s wealthiest
            figures is a big part of the picture too. The drilldown views break
            contributions down by recipient and type so you can see which is
            which.
          </p>
          <h3 className={styles.aboutSectionHeader} id="what-about">
            Who cares what the cryptocurrency and/or AI industries are doing
            when [oil|pharma|banking|some other industry] also spends millions
            on lobbying and politics?
          </h3>
          <p>
            I do! As a technology industry researcher, this is something I pay a
            lot of attention to. However, I also think the magnitude of spending
            warrants scrutiny from a much broader audience.
          </p>
          <p>
            I <i>firmly</i> agree that corporate influence on politics is a much
            broader issue than just in the cryptocurrency and AI industries. The
            broader problem is{" "}
            <a href="https://en.wikipedia.org/wiki/Citizens_United_v._FEC">
              <i>Citizens United</i>
            </a>{" "}
            and the ability for corporations and the super wealthy to pour this
            much money into politics. If you would like to see a project like
            this to track spending from another industry, please make it happen!
            As always, my{" "}
            <a href="https://github.com/molly/follow-the-crypto">
              code is all open source
            </a>
            .
          </p>
          <h3 className={styles.aboutSectionHeader} id="blockchain">
            Does this project use blockchain data?
          </h3>
          <p>
            No, the monetary data for this project comes from reports to the FEC
            (which includes donations made both in dollars and in
            cryptocurrency). This project does not aim to track dark money
            political spending that is not reported to the FEC&nbsp;&mdash;
            except where that spending involves committees tracked on this site.
          </p>
          <h3 className={styles.aboutSectionHeader} id="crypto-or-dollars">
            Are these people and companies donating cryptocurrency or regular
            dollars?
          </h3>
          <p>
            It&rsquo;s a mix, but anecdotally it appears to be mostly dollars.
          </p>
          <h3 className={styles.aboutSectionHeader} id="recent">
            Why does it look like there hasn&rsquo;t been much recent spending
            activity?
          </h3>
          <p>
            There are delays between when expenditures are made and when they
            are filed with the FEC. This project attempts to pull as much as
            possible from{" "}
            <a href="https://www.fec.gov/help-candidates-and-committees/dates-and-deadlines/2026-reporting-dates/24-and-48-hour-reports-independent-expenditures-periods-main-page-2026/">
              24- and 48-hour reports
            </a>
            , but some data{" "}
            <a href="https://www.fec.gov/help-candidates-and-committees/dates-and-deadlines/">
              just isn&rsquo;t filed that frequently
            </a>
            .
          </p>
          <h3 className={styles.aboutSectionHeader} id="discrepancies">
            Why do some numbers not seem to add up?
          </h3>
          <p>
            You might notice that there are some discrepancies between numbers
            &mdash; for example, committees that appear to have spent more than
            they&rsquo;ve raised, or cash on hand that doesn&rsquo;t equal
            receipts - disbursements. This is largely due to the fact that
            different data is subject to different reporting requirements and
            timeframes. For example, the FEC requires that committees report
            independent expenditures within 24 or 48 hours of the expenditure,
            but receipts are reported monthly or quarterly. This site aims to
            show the most up-to-date data as possible, at the expense of
            occasionally unusual numbers.
          </p>
          <h3 className={styles.aboutSectionHeader} id="pacs-data">
            What&rsquo;s going on with the{" "}
            <Link href="/2026/committees/ranking/super">list of PACs</Link>? Why
            aren&rsquo;t the amounts contributed to each PAC displayed?
          </h3>
          <p>
            There are some errors in FEC data, generally where in-kind
            cryptocurrency contributions have been double-reported or even
            triple-reported. While the FEC accounts for this by recording a
            disbursement for each duplicate contribution, it causes the receipts
            data to appear artificially high. Because I am only calculating
            committee receipts (accounting for duplicates) for the
            cryptocurrency-related PACs, and it is not feasible for me to do
            this type of labor-intensive data correction across all political
            committees, I am showing the order of PACs as reflected by the FEC,
            while acknowledging that PACs with cryptocurrency-denominated
            contributions may appear slightly too highly. To avoid propogating
            numbers that I know are misleading, I no longer show the
            FEC-reported PAC receipts in the lists of PACs. With those caveats
            in mind, this data is still available from the{" "}
            <a href="https://www.fec.gov/data/committees/pac-party/?cycle=2026&committee_type=O">
              FEC
            </a>
            .
          </p>
          <h3 className={styles.aboutSectionHeader} id="individual">
            Why are some contributions attributed only to
            &ldquo;Individual&rdquo;?
          </h3>
          <p>
            Although the FEC publishes detailed information about anyone who
            contributes to political candidates or campaigns, the goal of this
            project is not to draw attention to the many everyday people who
            choose to make small contributions to support their favored causes
            or candidates. For those who don&rsquo;t appear to be executives or
            senior-level employees at these companies, I have redacted
            identifying information.
          </p>
          <h3 className={styles.aboutSectionHeader} id="missing-ads">
            Why are some political advertisements missing?
          </h3>
          <p>
            Although the FEC tracks ad spending, they do not maintain a database
            of the advertisements themselves. I am doing my best to gather this
            information as I am able, but databases with this information are
            either limited or prohibitively expensive. If you&rsquo;re aware of
            an advertisement that&rsquo;s missing, please{" "}
            <Link href="/about/contact">send it in</Link> so I can add it!
          </p>
        </div>
      </div>
    </div>
  );
}
