import { BESector } from "@/app/types/Sector";

export interface NetworkAffiliatedOrg {
  // Stable key. For orgs also tracked as companies, use the company slug so
  // this entry merges with the fetched company.
  id: string;
  name: string;
  // Tax-exempt classification, e.g. "501(c)(4)". " · Dark money" is appended
  // at render time.
  type?: string;
  // Optional link. Orgs defined here are unlinked unless an href is provided;
  // orgs tracked as companies get a link to their company page automatically.
  href?: string;
  // Position within its network: "parent" (lead org), or the "dem"/"rep" arm
  role?: "parent" | "dem" | "rep";
  // Short network-context blurb. For orgs tracked as companies this falls back
  // to the company constant's description when not set here.
  description?: TrustedHTML;
}

export interface NetworkConstant {
  // Matches the `network` field on tracked committees and companies
  key: string;
  // URL slug for the network's detail page, e.g. "fairshake"
  id: string;
  // Display name (may differ in casing from the stored key)
  name: string;
  sector: BESector;
  // TrustedHTML; may contain links to member committees / affiliated orgs
  description: string;
  // Affiliated orgs known up front. These are merged with any companies tagged
  // with this network's key in the companies constant.
  affiliatedOrgs?: NetworkAffiliatedOrg[];
}

export const NETWORKS: NetworkConstant[] = [
  {
    key: "Fairshake",
    id: "fairshake",
    name: "FairShake",
    sector: "crypto",
    description:
      '<p>A coordinated network of crypto-funded super PACs working to shape cryptocurrency and blockchain policy, and among the best-funded political operations of the cycle. <a href="/2026/committees/C00835959">FairShake</a> is the lead committee, distributing funds to the conservative-focused <a href="/2026/committees/C00836221">Defend American Jobs</a> and the progressive-focused <a href="/2026/committees/C00848440">Protect Progress</a>. All three draw on the same core donor base&nbsp;&mdash; chiefly <a href="/2026/companies/coinbase">Coinbase</a>, <a href="/2026/companies/ripple">Ripple</a>, and <a href="/2026/companies/andreessen-horowitz">Andreessen Horowitz</a>. The party-split structure lets the network back candidates in both parties&rsquo; primaries while casting itself as nonpartisan, though its spending has leaned toward Republicans. It concentrates on independent expenditures, funding ads to boost crypto-friendly candidates and oppose those seen as hostile to the industry&nbsp;&mdash; ads that typically make no mention of cryptocurrency. An affiliated dark money group, the <a href="/2026/companies/cedar-innovation-foundation">Cedar Innovation Foundation</a>, is not required to disclose its donors.</p>',
  },
  {
    key: "Leading the Future",
    id: "leading-the-future",
    name: "Leading the Future",
    sector: "ai",
    description:
      '<p>A coordinated network of AI-industry super PACs working to head off stricter AI regulation, chiefly by pushing a single federal framework that would override stronger state-level rules on issues like consumer protection and liability. <a href="/2026/committees/C00916114">Leading the Future</a> is the lead committee, channeling money to the Democratic-facing <a href="/2026/committees/C00923417">Think Big</a> and the Republican-facing <a href="/2026/committees/C00916692">American Mission</a>. All draw on the same core backers&nbsp;&mdash; chiefly <a href="/2026/companies/andreessen-horowitz">Andreessen Horowitz</a>, and <a href="/2026/companies/openai">OpenAI</a> president <a href="/2026/individuals/greg-brockman">Greg Brockman</a> and his wife. Explicitly modeled on the crypto industry&rsquo;s FairShake network&nbsp;&mdash; and sharing a strategist with it&nbsp;&mdash; its party-split structure lets the network back pro-AI candidates in both parties while opposing those who favor stronger oversight. Layering money through these committees, and through an affiliated 501(c)(4), <a href="/2026/companies/build-american-ai">Build American AI</a>, that is not required to disclose its donors, obscures the original source of the funds.</p>',
  },
  {
    key: "Public First",
    id: "public-first",
    name: "Public First",
    sector: "ai",
    description:
      '<p>An AI industry super PAC network pushing for favorable AI regulation through a bipartisan structure. The lead committee, <a href="/2026/committees/C00930503">Public First</a>, operates alongside the Democratic-focused <a href="/2026/committees/C00928374">Jobs and Democracy PAC</a>, led by former Rep. Brad Carson, and the Republican-focused <a href="/2026/committees/C00928390">Defending Our Values</a>, led by former Rep. Chris Stewart. All are affiliated with the <a href="/2026/companies/public-first-action">Public First Action</a> dark money group.</p>',
  },
  {
    key: "Bitcoin Policy Institute",
    id: "bitcoin-policy-institute",
    name: "Bitcoin Policy Institute",
    sector: "crypto",
    description:
      'A pro-bitcoin advocacy and lobbying network built around the <a href="/2026/companies/bitcoin-policy-institute">Bitcoin Policy Institute</a> think tank and two affiliated 501(c)(4)s. Former Representatives Tim Ryan (D-OH) and David McIntosh (R-IN) lend bipartisan cover to the agenda, casting it as a defense of the industry against political forces it says want to &ldquo;destroy&rdquo; it.',
  },
  {
    key: "America First Digital",
    id: "america-first-digital",
    name: "America First Digital",
    sector: "crypto",
    description:
      "A pro-crypto super PAC network aligned with President Trump. The electoral arm, First Principles Digital, is a Cynthia Lummis-affiliated super PAC working to elect pro-crypto Republicans, while the network's &ldquo;education&rdquo; and advocacy work runs through the affiliated America First Digital 501(c)(4), a dark money group that operates outside FEC disclosure rules. The group has said it will &ldquo;help advance pro-crypto policies and regulations, amplify the efforts of industry champions in Washington, and support ongoing education efforts among key decision-makers.&rdquo;",
  },
];
