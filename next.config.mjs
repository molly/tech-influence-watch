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
    const routes = [
      "beneficiaries",
      "committees",
      "companies",
      "elections",
      "expenditures",
      "individuals",
      "states",
    ];
    const _2026routes = routes.flatMap((route) => [
      {
        source: `/${route}`,
        destination: `/2026/${route}`,
        permanent: false,
      },
      {
        source: `/${route}/:path*`,
        destination: `/2026/${route}/:path*`,
        permanent: false,
      },
    ]);
    return [
      ..._2026routes,
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
      // Old ?sector=crypto|ai query URLs are converted to path-based URLs in
      // middleware (which can drop the query and avoid a redirect loop).
      //
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
