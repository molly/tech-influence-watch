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

export function sectorHref(path: string, sector: Sector): string {
  if (sector === "all") {
    return path;
  }
  return `${path}?sector=${sector}`;
}

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
