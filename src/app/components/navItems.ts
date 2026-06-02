export type NavChild = { label: string; href: string; useSector?: boolean };
export type NavItem = {
  id: string;
  label: string;
  href?: string;
  children: NavChild[];
};

export const NAV_ITEMS: NavItem[] = [
  {
    id: "spending",
    label: "Spending",
    children: [
      { label: "By committees", href: "/2026/committees", useSector: true },
      { label: "By companies", href: "/2026/companies", useSector: true },
      { label: "By individuals", href: "/2026/individuals", useSector: true },
      { label: "By beneficiary", href: "/2026/beneficiaries", useSector: true },
    ],
  },
  {
    id: "elections",
    label: "Elections",
    children: [
      { label: "By state", href: "/2026/states", useSector: true },
      { label: "All elections", href: "/2026/elections", useSector: true },
    ],
  },
  {
    id: "recent",
    label: "Recent",
    children: [
      { label: "Contributions", href: "/2026/contributions", useSector: true },
      { label: "Expenditures", href: "/2026/expenditures", useSector: true },
    ],
  },
  {
    id: "rankings",
    label: "Rankings",
    children: [
      {
        label: "Super PACs",
        href: "/2026/committees/ranking/super",
      },
      {
        label: "All committees",
        href: "/2026/committees/ranking/all",
      },
    ],
  },
  {
    id: "analysis",
    label: "Analysis",
    children: [
      { label: "Quid pro quo", href: "/analysis/quidproquo" },
      { label: "Contributions to Trump", href: "/analysis/trump" },
      { label: "How the money flows", href: "/analysis/2026/flow" },
    ],
  },
  {
    id: "about",
    label: "About",
    children: [
      { label: "About", href: "/about" },
      { label: "FAQ", href: "/about/faq" },
      { label: "Contact", href: "/about/contact" },
      { label: "Support", href: "/about/support" },
      { label: "Colophon", href: "/about/colophon" },
    ],
  },
];
