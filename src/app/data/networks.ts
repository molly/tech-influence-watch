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
  leadCommitteeId: string;
  // Short partisan/structural qualifier for a member, keyed by committee id
  memberNotes?: Record<string, string>;
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
    leadCommitteeId: "C00835959",
    description:
      '<p>A single-issue super PAC network focused on cryptocurrency and blockchain policy. <a href="/2026/committees/C00835959">FairShake</a> is the lead committee, distributing funds to the conservative-focused <a href="/2026/committees/C00836221">Defend American Jobs</a> and the progressive-focused <a href="/2026/committees/C00848440">Protect Progress</a>. All three draw on the same core donor base. An affiliated nonprofit, <a href="/2026/companies/cedar-innovation-foundation">Cedar Innovation Foundation</a>, operates outside FEC disclosure rules.</p>',
    memberNotes: {
      C00836221: "Conservative",
      C00848440: "Progressive",
    },
  },
  {
    key: "Leading the Future",
    id: "leading-the-future",
    name: "Leading the Future",
    sector: "ai",
    leadCommitteeId: "C00916114",
    description:
      '<p>An AI industry super PAC network working to elect pro-AI candidates and unseat those it considers unfavorable. The lead committee, <a href="/2026/committees/C00916114">Leading the Future</a>, is affiliated with the Democratic-focused <a href="/2026/committees/C00923417">Think Big</a> PAC and the bipartisan <a href="/2026/committees/C00916692">American Mission</a> PAC. All three are linked to the <a href="/2026/companies/build-american-ai">Build American AI</a> dark money group.</p>',
    memberNotes: {
      C00923417: "Democratic focus",
      C00916692: "Bipartisan",
    },
  },
  {
    key: "Public First",
    id: "public-first",
    name: "Public First",
    sector: "ai",
    leadCommitteeId: "C00930503",
    description:
      '<p>An AI industry super PAC network pushing for favorable AI regulation through a bipartisan structure. The lead committee, <a href="/2026/committees/C00930503">Public First</a>, operates alongside the Democratic-focused <a href="/2026/committees/C00928374">Jobs and Democracy PAC</a>, led by former Rep. Brad Carson, and the Republican-focused <a href="/2026/committees/C00928390">Defending Our Values</a>, led by former Rep. Chris Stewart. All are affiliated with the <a href="/2026/companies/public-first-action">Public First Action</a> dark money group.</p>',
    memberNotes: {
      C00928374: "Democratic focus",
      C00928390: "Republican focus",
    },
  },
  {
    key: "Bitcoin Policy Institute",
    id: "bitcoin-policy-institute",
    name: "Bitcoin Policy Institute",
    sector: "crypto",
    leadCommitteeId: "",
    description:
      'A pro-bitcoin advocacy and lobbying network built around the <a href="/2026/companies/bitcoin-policy-institute">Bitcoin Policy Institute</a> think tank and two affiliated 501(c)(4)s. Former Representatives Tim Ryan (D-OH) and David McIntosh (R-IN) lend bipartisan cover to the agenda, casting it as a defense of the industry against political forces it says want to &ldquo;destroy&rdquo; it.',
  },
  {
    key: "America First Digital",
    id: "america-first-digital",
    name: "America First Digital",
    sector: "crypto",
    leadCommitteeId: "",
    description:
      "A pro-crypto super PAC network aligned with President Trump. The electoral arm, First Principles Digital, is a Cynthia Lummis-affiliated super PAC working to elect pro-crypto Republicans, while the network's &ldquo;education&rdquo; and advocacy work runs through the affiliated America First Digital 501(c)(4), a dark money group that operates outside FEC disclosure rules. The group has said it will &ldquo;help advance pro-crypto policies and regulations, amplify the efforts of industry champions in Washington, and support ongoing education efforts among key decision-makers.&rdquo;",
  },
];
