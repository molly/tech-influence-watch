import { sentenceCase } from "@/app/utils/titlecase";

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
