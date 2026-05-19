import { Metadata } from "next";
import Link from "next/link";

import { customMetadata } from "@/app/utils/metadata";

import AboutNav from "../AboutNav";
import styles from "../page.module.css";

export const metadata: Metadata = customMetadata({
  title: "FAQ",
  description: "Frequently asked questions about Follow the Crypto.",
});

export default function FAQPage() {
  return (
    <div className={`${styles.about} single-column-page`}>
      <AboutNav />
      <h2>FAQ</h2>
      <div className={styles.mainText}>
        <h3 id="individual">
          Why are some contributions attributed only to “Individual”?
        </h3>
        <p>
          Although the FEC publishes detailed information about anyone who
          contributes to political candidates or campaigns, the goal of this
          project is not to draw attention to the many everyday people who
          choose to make small contributions to support their favored causes or
          candidates. For those who don&rsquo;t appear to be executives or
          senior-level employees at these companies, I have redacted identifying
          information.
        </p>
        <h3 id="missing-ads">Why are some political advertisements missing?</h3>
        <p>
          Although the FEC tracks ad spending, they do not maintain a database
          of the advertisements themselves. I am doing my best to gather this
          information as I am able, but databases with this information are
          either limited or prohibitively expensive. If you&rsquo;re aware of an
          advertisement that&rsquo;s missing, please{" "}
          <Link href="/about/contact">send it in</Link> so I can add it!
        </p>
        <h3 id="pacs-data">
          What&rsquo;s going on with the list of PACs? Why aren&rsquo;t the
          amounts belonging to each PAC displayed?
        </h3>
        <p>
          There are some errors in FEC data, generally where in-kind
          cryptocurrency contributions have been double-reported or even
          triple-reported. While the FEC accounts for this by recording a
          disbursement for each duplicate contribution, it causes the receipts
          data to appear artificially high. Because I am only calculating
          committee receipts (accounting for duplicates) for the
          cryptocurrency-related PACs, and it is not feasible for me to do this
          type of labor-intensive data correction across all political
          committees, I am showing the order of PACs as reflected by the FEC,
          while acknowledging that PACs with cryptocurrency-denominated
          contributions may appear slightly too highly. To avoid propogating
          numbers that I know are inaccurate, I no longer show the FEC-reported
          PAC receipts in the lists of PACs.
        </p>
        <h3 id="discrepancies">Why do some numbers not seem to add up?</h3>
        <p>
          You might notice that there are some discrepancies between numbers —
          for example, committees that appear to have spent more than
          they&rsquo;ve raised, or cash on hand that doesn&rsquo;t equal
          receipts - disbursements. This is largely due to the fact that
          different data is subject to different reporting requirements and
          timeframes. For example, the FEC requires that committees report
          independent expenditures within 24 or 48 hours of the expenditure, but
          receipts are reported monthly or quarterly. This site aims to show the
          most up-to-date data as possible, at the expense of occasionally
          unusual numbers.
        </p>
        <h3 id="recent">
          Why does it look like there hasn&rsquo;t been much recent spending
          activity?
        </h3>
        <p>
          There are delays between when expenditures are made and when they are
          filed with the FEC. This project attempts to pull as much as possible
          from{" "}
          <a href="https://www.fec.gov/help-candidates-and-committees/dates-and-deadlines/2026-reporting-dates/24-and-48-hour-reports-independent-expenditures-periods-main-page-2026/">
            24- and 48-hour reports
          </a>
          , but some data{" "}
          <a href="https://www.fec.gov/help-candidates-and-committees/dates-and-deadlines/">
            just isn&rsquo;t filed that frequently
          </a>
          .
        </p>
        <h3 id="crypto-or-dollars">
          Are these people and companies donating cryptocurrency or regular
          dollars?
        </h3>
        <p>
          It&rsquo;s a mix, but anecdotally it appears to be mostly dollars.
        </p>
        <h3 id="blockchain">Does this project use blockchain data?</h3>
        <p>
          No, the monetary data for this project comes from reports to the FEC
          (which includes donations made both in dollars and in cryptocurrency).
          This project does not aim to track dark money political spending that
          is not reported to the FEC.
        </p>
        <h3 id="what-about">
          Who cares what the cryptocurrency and/or AI industries are doing when
          [oil|pharma|banking|some other industry] also spends millions on
          lobbying and politics?
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
          much money into politics. If you would like to see a project like this
          to track spending from another industry, please make it happen! As
          always, my{" "}
          <a href="https://github.com/molly/follow-the-crypto">
            code is all open source
          </a>
          .
        </p>
      </div>
    </div>
  );
}
