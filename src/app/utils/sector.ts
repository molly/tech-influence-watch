import { CommitteeConstant } from "../types/Committee";
import { CompanyConstant } from "../types/Companies";
import { IndividualConstant } from "../types/Individuals";
import { BESector, Sector } from "../types/Sector";

const SECTOR_LABELS: Record<Sector, string> = {
  all: "Cryptocurrency and artificial intelligence",
  crypto: "Cryptocurrency",
  ai: "Artificial intelligence",
};

const SECTOR_LABELS_ABBREV: Record<Sector, string> = {
  all: "Crypto and AI",
  crypto: "Crypto",
  ai: "AI",
};

interface HumanizeSectorOptions {
  context?: "industry";
  abbrev?: boolean;
  lowercase?: boolean;
  hyphen?: boolean;
  or?: boolean;
}

export function humanizeSector(
  sector: Sector,
  options?: HumanizeSectorOptions,
): string {
  if (!sector) {
    return "";
  }
  let label = options?.abbrev
    ? SECTOR_LABELS_ABBREV[sector]
    : SECTOR_LABELS[sector];
  if (options?.lowercase) {
    label = options?.abbrev
      ? label.replace(/\b(?!AI\b)\w+/g, (w) => w.toLowerCase())
      : label.toLowerCase();
  }
  if (options?.context === "industry") {
    label = `${label} industry`;
  }
  if (options?.hyphen) {
    if (sector === "all") {
      label = label.replace(" and ", "- and ") + "-";
    } else {
      label = `${label}-`;
    }
  }
  if (options?.or) {
    return label.replace("and", "or");
  }
  return label;
}

export function parseSector(value: string | undefined): Sector {
  if (value === "crypto" || value === "ai") {
    return value;
  }
  return "all";
}

// The sector lives in the URL path: "all" has no prefix (clean URLs), while
// "crypto" and "ai" get a prefix segment right after the year. Drilldown pages
// become /2026/crypto/companies; the homepage becomes /crypto and /ai.
const PREFIXED_SECTORS: Sector[] = ["crypto", "ai"];

function isPrefixedSector(value: string | undefined): value is "crypto" | "ai" {
  return value === "crypto" || value === "ai";
}

/**
 * Insert the sector into a canonical ("all") path. Used by links that already
 * know their destination, e.g. sectorHref("/2026/companies", "crypto").
 */
export function sectorHref(path: string, sector: Sector): string {
  if (sector === "all") {
    return path;
  }
  if (path === "/") {
    return `/${sector}`;
  }
  if (path === "/2026" || path.startsWith("/2026/")) {
    return `/2026/${sector}${path.slice("/2026".length)}`;
  }
  return path;
}

/**
 * Read the active sector out of the current pathname.
 */
export function sectorFromPathname(pathname: string): Sector {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 1 && isPrefixedSector(segments[0])) {
    return segments[0];
  }
  if (segments[0] === "2026" && isPrefixedSector(segments[1])) {
    return segments[1];
  }
  return "all";
}

/**
 * Pages whose content is sector-aware. Detail pages for a single company,
 * individual, or committee ignore the sector, so the toggle should not try to
 * build a prefixed URL for them.
 */
export function isSectorAwarePath(canonicalPath: string): boolean {
  if (canonicalPath === "/") {
    return true;
  }
  const exact = [
    "/2026/companies",
    "/2026/individuals",
    "/2026/committees",
    "/2026/networks",
    "/2026/contributions",
    "/2026/spending",
    "/2026/expenditures",
    "/2026/beneficiaries",
    "/2026/states",
    "/2026/elections",
  ];
  if (exact.includes(canonicalPath)) {
    return true;
  }
  // State and race detail pages do vary by sector.
  return (
    canonicalPath.startsWith("/2026/states/") ||
    canonicalPath.startsWith("/2026/elections/")
  );
}

/**
 * Strip any sector prefix from a pathname, returning its canonical ("all")
 * form so it can be compared or re-prefixed.
 */
export function canonicalPathname(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length >= 1 && isPrefixedSector(segments[0])) {
    // Homepage sector variant: /crypto -> /
    return "/" + segments.slice(1).join("/");
  }
  if (segments[0] === "2026" && isPrefixedSector(segments[1])) {
    segments.splice(1, 1);
  }
  return "/" + segments.join("/");
}

/**
 * Switch the current pathname to a different sector for the sector toggle. On
 * pages that aren't sector-aware, fall back to that sector's homepage rather
 * than fabricating a route that doesn't exist.
 */
export function setSectorOnPathname(pathname: string, sector: Sector): string {
  const canonical = canonicalPathname(pathname);
  if (!isSectorAwarePath(canonical)) {
    return sector === "all" ? "/" : `/${sector}`;
  }
  return sectorHref(canonical, sector);
}

export const SECTOR_STATIC_PARAMS = PREFIXED_SECTORS.map((sector) => ({
  sector,
}));

/**
 * Backend sector "tech" means the entity spans all sectors and should appear
 * in both "crypto" and "ai" filtered views.
 */
export function matchesSector(
  entitySector: BESector | undefined,
  sector: Sector,
): boolean {
  if (entitySector === "tech") {
    return true; // tech appears in all sector views
  }
  return entitySector === (sector as BESector);
}

export function getCommitteeIdsForSector(
  sector: Sector,
  committeeConstants: Record<string, CommitteeConstant>,
): Set<string> | null {
  if (sector === "all") {
    return null;
  }
  return new Set(
    Object.entries(committeeConstants)
      .filter(([, c]) => matchesSector(c.sector, sector))
      .map(([id]) => id),
  );
}

export function getCompanyIdsForSector(
  sector: Sector,
  companyConstants: Record<string, CompanyConstant>,
): Set<string> | null {
  if (sector === "all") {
    return null;
  }
  return new Set(
    Object.entries(companyConstants)
      .filter(([, c]) => matchesSector(c.sector, sector))
      .map(([id]) => id),
  );
}

export function getSectorsForIndividual(
  individual: IndividualConstant,
  companyConstants: Record<string, CompanyConstant>,
): BESector[] {
  if (individual.sector) {
    return [individual.sector];
  } else if (!individual.company) {
    return [];
  }
  return [
    ...new Set(
      individual.company
        .map(
          (companyString) =>
            (
              Object.values(companyConstants).find(
                (cc) => cc.name === companyString,
              ) ?? {}
            ).sector,
        )
        .filter((x) => x !== undefined),
    ),
  ];
}
