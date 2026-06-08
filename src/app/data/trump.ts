// Trump's stable FEC candidate ID.
// All affiliated committees are discovered dynamically via allRecipients/recipients
// by checking candidate_ids and sponsor_candidate_ids.
export const TRUMP_CANDIDATE_ID = "P80001571";

// PAC type label per recipient committee, keyed by FEC committee ID. The live data
// only carries per-committee totals (no FEC committee_type/designation), so these are
// curated by hand. Committees absent from this map render with no type label.
// Add new committees here as they appear in the "By committee" breakdown.
export const AMERICA_PAC_ID = "C00879510";

export const TRUMP_COMMITTEE_TYPES: Record<string, string> = {
  [AMERICA_PAC_ID]: "Super PAC", // America PAC
  C00892471: "Hybrid PAC", // MAGA Inc.
  C00894162: "Inaugural committee", // Trump Vance Inaugural Committee
  C00867937: "Joint fundraising committee", // Trump 47 Committee, Inc.
  C00828541: "Leadership PAC", // Never Surrender, Inc.
  C00762591: "Leadership PAC", // Save America
  C00873893: "Joint fundraising committee", // Trump National Committee JFC, Inc.
  C00770941: "Joint fundraising committee", // Trump Save America JFC
  C00825851: "Super PAC", // Make America Great Again Inc.
};
