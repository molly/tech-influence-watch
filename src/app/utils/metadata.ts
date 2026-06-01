import { Metadata } from "next";

export const BASE_METADATA: Metadata = {
  title: "Tech Influence Watch",
  description:
    "Tracking cryptocurrency and artificial intelligence industry influence on 2026 elections in the United States.",
  authors: [{ name: "Molly White", url: "https://www.mollywhite.net" }],
  creator: "Molly White",
  publisher: "Citation Needed",
  metadataBase: new URL("https://influence.citationneeded.news"),
  openGraph: {
    title: "Tech Influence Watch",
    siteName: "Tech Influence Watch",
    description:
      "Tracking cryptocurrency and artificial intelligence industry influence on 2026 elections in the United States.",
    images: "/opengraph-image.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Influence Watch",
    description:
      "Tracking cryptocurrency and artificial intelligence industry influence on 2026 elections in the United States.",
    site: "@follow__crypto",
    siteId: "1804912038184939520",
    creator: "@molly0xfff",
    creatorId: "545445165",
    images: {
      url: "https://influence.citationneeded.news/twitter-image.png",
      alt: "Tech Influence Watch logo",
    },
  },
};

export const customMetadata = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  const fullTitle = `${title} | Tech Influence Watch`;
  return {
    ...BASE_METADATA,
    twitter: {
      ...BASE_METADATA.twitter,
      title: fullTitle,
      description,
    },
    openGraph: {
      ...BASE_METADATA.openGraph,
      title: fullTitle,
      description,
    },
    title: fullTitle,
    description,
  };
};
