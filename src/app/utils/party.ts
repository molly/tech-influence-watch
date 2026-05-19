export const getFullPartyName = (
  party: string,
  adjective: boolean = true,
): string => {
  switch (party) {
    case "D":
      return adjective ? "Democratic" : "Democrat";
    case "R":
      return "Republican";
    case "L":
      return "Libertarian";
    case "G":
      return "Green";
    case "I":
      return "Independent";
    case "N":
      return adjective ? "non-partisan" : "No party affiliation";
    case "U":
      return adjective ? "unknown" : "Unknown";
    case "O":
      return adjective ? "other" : "Other";
    default:
      return party;
  }
};

export const getPartyAbbreviation = (party: string): string => {
  switch (party.charAt(0).toUpperCase()) {
    case "D":
      return "Dem";
    case "R":
      return "Rep";
    case "L":
      return "Lib";
    case "G":
      return "Gre";
    case "I":
      return "Ind";
    case "N":
      return "Non";
    case "U":
      return "Unk";
    case "O":
      return "Oth";
    default:
      return party;
  }
};
