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
      "spending",
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
    ];
  },
  output: "standalone",
  compress: true,
};

export default nextConfig;
