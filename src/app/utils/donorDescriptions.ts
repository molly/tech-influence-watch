import { Contribution } from "@/app/types/Contributions";

// Entity types for donors that are political committees.
const COMMITTEE_ENTITY_TYPES = new Set(["COM", "PAC", "PTY"]);

// The FEC committee IDs that appear on a donor's contributions.
export function getDonorCommitteeIds(contributions: Contribution[]): string[] {
  return [
    ...new Set(
      contributions
        .map((c) => c.contributor_id)
        .filter((id): id is string => !!id),
    ),
  ];
}

// A committee donor with no FEC committee ID, such as a state committee, or
// one whose only contributions are e-filings FEC hasn't processed yet. These
// are described by name in constants/donorDescriptions.
export function isCommitteeDonorWithoutId(
  contributions: Contribution[],
): boolean {
  return (
    getDonorCommitteeIds(contributions).length === 0 &&
    contributions.some((c) => COMMITTEE_ENTITY_TYPES.has(c.entity_type ?? ""))
  );
}

// The name a contribution is grouped under, matching the backend's
// resolve_group_and_links: the employer if there is one, otherwise the
// contributor name, swapped for its alias if it has one.
export function getDonorGroupName(
  contribution: Contribution,
  companyAliases: Record<string, string>,
): string | undefined {
  const name =
    contribution.contributor_employer &&
    contribution.contributor_employer !== "N/A"
      ? contribution.contributor_employer
      : contribution.contributor_name;
  if (!name) {
    return undefined;
  }
  return companyAliases[name] ?? name;
}

// A committee donor's description: from allCommittees by FEC committee ID, or
// from donorDescriptions by donor name for committees without one.
export function getDonorDescription(
  contributions: Contribution[],
  donorName: string | undefined,
  allCommittees: Record<string, string>,
  donorDescriptions: Record<string, string>,
): string | undefined {
  for (const id of getDonorCommitteeIds(contributions)) {
    if (allCommittees[id]) {
      return allCommittees[id];
    }
  }
  if (donorName && isCommitteeDonorWithoutId(contributions)) {
    return donorDescriptions[donorName.toUpperCase()];
  }
  return undefined;
}
