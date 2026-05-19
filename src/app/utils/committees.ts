import { RecipientDetails } from "@/app/types/Contributions";

export function getUniqueCandidateIds(recipient: RecipientDetails) {
  // If a candidate has run for multiple offices, sometimes they end up duplicated in candidate_ids
  // There is an edge case here where two different candidates could have the same last name AND
  // they've formed a committee together, but this is rare enough that it's probably acceptable to
  // ignore for now.
  if (!recipient.candidate_ids) {
    return [];
  }
  const lastNameMap = new Map<string, string>();
  for (const candidateId of recipient.candidate_ids) {
    const candidate = recipient.candidate_details[candidateId];
    if (candidate && candidate.name) {
      const lastName = candidate.name.split(", ")[0];
      const existing = lastNameMap.get(lastName);
      if (!existing) {
        lastNameMap.set(lastName, candidateId);
      } else {
        const existingCandidate = recipient.candidate_details[existing];
        const existingMax = Math.max(
          ...(existingCandidate.election_years ?? [0]),
        );
        const currentMax = Math.max(...(candidate.election_years ?? [0]));
        if (currentMax > existingMax) {
          lastNameMap.set(lastName, candidateId);
        }
      }
    }
  }
  return Array.from(lastNameMap.values());
}

export function isSingleCandidateCommittee(
  recipient: RecipientDetails,
  nonCandidateCommittees: Set<string>,
) {
  if (nonCandidateCommittees.has(recipient.committee_id)) {
    return false;
  }
  if (recipient?.candidate_ids) {
    if (recipient.candidate_ids.length === 1) {
      return true;
    }
    const uniqueCandidateIds = getUniqueCandidateIds(recipient);
    if (uniqueCandidateIds.length === 1) {
      return true;
    }
  }
  return false;
}

export function isMultiCandidateCommittee(
  recipient: RecipientDetails,
  nonCandidateCommittees: Set<string>,
) {
  if (nonCandidateCommittees.has(recipient.committee_id)) {
    return false;
  }
  if (recipient?.candidate_ids && recipient.candidate_ids.length > 1) {
    const candidates = recipient.candidate_ids.map(
      (id) => recipient.candidate_details[id],
    );
    if (
      new Set(candidates.map((c) => !c || !c.name || c.name.split(", ")[0]))
        .size > 1
    ) {
      return true;
    }
  }
  return false;
}

export function isSingleSponsorCandidateCommittee(recipient: RecipientDetails) {
  if (recipient?.sponsor_candidate_ids) {
    if (recipient.sponsor_candidate_ids.length === 1) {
      return true;
    }
    const candidates = recipient.sponsor_candidate_ids.map(
      (id) => recipient.candidate_details[id],
    );
    if (new Set(candidates.map((c) => c.name.split(", ")[0])).size === 1) {
      return true;
    }
  }
  return false;
}

export function getDesignation(designation_full: string | undefined) {
  if (!designation_full || designation_full === "Unauthorized") {
    return null;
  } else if (designation_full == "Authorized by a candidate") {
    return " authorized committee";
  } else {
    return ` ${designation_full[0].toLowerCase() + designation_full.slice(1)}`;
  }
}
