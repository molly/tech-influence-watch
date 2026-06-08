/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/(candidates|follow-the-crypto-(ads|misc-assets))/**",
      },
    ],
  },
  async redirects() {
    // Before the 2026 cycle, the site was 2024-only and links had no year slug
    // (e.g. /elections/CA-H-45). Those bare links are now preserved by pointing
    // them at the archived 2024 site. Only routes that actually existed in 2024
    // are listed here — 2026-only features (networks, contributions,
    // explainers/flow, analysis/trump, sector-prefixed routes) are omitted so
    // they don't redirect to a 404 on the archive.
    const archive = "https://influence.citationneeded.news/2024";
    const routes = [
      "beneficiaries",
      "committees",
      "companies",
      "elections",
      "expenditures",
      "individuals",
      "states",
    ];
    const _2024routes = routes.flatMap((route) => [
      {
        source: `/${route}`,
        destination: `${archive}/${route}`,
        permanent: false,
      },
      {
        source: `/${route}/:path*`,
        destination: `${archive}/${route}/:path*`,
        permanent: false,
      },
    ]);
    return [
      ..._2024routes,
      {
        source: "/2026/committees/ranking",
        destination: "/2026/committees/ranking/all",
        permanent: false,
      },
      // "all" is the canonical (unprefixed) sector — strip an explicit /all/
      // prefix so it never serves duplicate content.
      {
        source: "/2026/all/:path*",
        destination: "/2026/:path*",
        permanent: false,
      },
      // Relocated routes (permanent — these are genuine moves). Spending became
      // an explainer; quid pro quo moved out of the cycle into /analysis.
      {
        source: "/spending",
        destination: "/2026/explainers/spending",
        permanent: true,
      },
      {
        source: "/2026/spending",
        destination: "/2026/explainers/spending",
        permanent: true,
      },
      {
        source: "/quidproquo",
        destination: "/analysis/quidproquo",
        permanent: true,
      },
      {
        source: "/quidproquo/:path*",
        destination: "/analysis/quidproquo",
        permanent: true,
      },
      {
        source: "/2026/quidproquo",
        destination: "/analysis/quidproquo",
        permanent: true,
      },
    ];
  },
  output: "standalone",
  compress: true,
};

export default nextConfig;
