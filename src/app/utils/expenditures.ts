import { Expenditure } from "@/app/types/Expenditures";
import { sentenceCase, titlecaseIndividualName } from "@/app/utils/titlecase";

/**
 * The candidate an expenditure names, as the rest of the site writes it.
 *
 * Prefers `candidate_common_name`, which the pipeline resolves off the race
 * roster by candidate_id. The FEC name fields are filer-entered and can't be
 * assembled into a usable name on their own: Ashley Hinson is filed under her
 * spouse's surname, with "ASHLEY HINSON" sitting in `candidate_first_name` and
 * "ARENHOLZ" in `candidate_last_name`, so piecing those together reads "Ashley
 * Arenholz". They're only a fallback for rows the roster couldn't resolve.
 */
export function getCandidateName(expenditure: Expenditure): string {
  if (expenditure.candidate_common_name) {
    return expenditure.candidate_common_name;
  }
  let parts: (string | null | undefined)[];
  if ("candidate_last_name" in expenditure && expenditure.candidate_last_name) {
    const firstName = expenditure.candidate_first_name
      ? expenditure.candidate_first_name.split(" ")[0]
      : "";
    parts = [
      firstName,
      expenditure.candidate_middle_name,
      expenditure.candidate_last_name,
    ];
  } else {
    parts = [
      expenditure.candidate_first_name,
      expenditure.candidate_name,
      expenditure.candidate_suffix,
    ];
  }
  return parts.filter(Boolean).map(titlecaseIndividualName).join(" ");
}

export function getCategory(categoryCode: string) {
  switch (categoryCode) {
    case "004":
      return "Advertising expenses";
  }
  return null;
}

export function humanizeExpenditureDescription(description?: string) {
  if (!description) {
    return "";
  }
  const trimmed = description.replace(/^ie-([a-z, ]+)-/i, "");
  return sentenceCase(trimmed).replace(/\btv\b/gi, "TV");
}
