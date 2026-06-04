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
      "quidproquo",
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
    ];
  },
  output: "standalone",
  compress: true,
};

export default nextConfig;
