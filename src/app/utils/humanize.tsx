import { formatCurrency } from "./utils";

const NUMBERS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
  "twenty",
  "twenty-one",
  "twenty-two",
  "twenty-three",
  "twenty-four",
  "twenty-five",
  "twenty-six",
  "twenty-seven",
  "twenty-eight",
  "twenty-nine",
  "thirty",
  "thirty-one",
  "thirty-two",
  "thirty-three",
  "thirty-four",
  "thirty-five",
  "thirty-six",
  "thirty-seven",
  "thirty-eight",
  "thirty-nine",
  "forty",
  "forty-one",
  "forty-two",
  "forty-three",
  "forty-four",
  "forty-five",
  "forty-six",
  "forty-seven",
  "forty-eight",
  "forty-nine",
  "fifty",
];
export const humanizeNumber = (
  value: number,
  limitToSmall: boolean = true,
): string => {
  if (value < NUMBERS.length && (!limitToSmall || value <= 10)) {
    return NUMBERS[value];
  }
  return value.toString();
};

export const humanizePercentage = (
  value: number,
  total: number,
  decimalPlaces = 0,
): string => {
  if (total === 0) {
    return "0%";
  }
  return `${parseFloat(((value / total) * 100).toFixed(decimalPlaces))}%`;
};

// A share as "one in N": "one in five" for 4 of 20, "fewer than one in six"
// for 22 of 145 (the smallest N the share still falls under). "No" for none,
// and "22 of 40" for half or more, which "one in N" can't express.
export const humanizeOneIn = (value: number, total: number): string => {
  if (value === 0) {
    return "no";
  }
  if (value * 2 > total) {
    return `${humanizeNumber(value)} of ${humanizeNumber(total)}`;
  }
  const ratio = total / value;
  if (Number.isInteger(ratio)) {
    return `one in ${humanizeNumber(ratio)}`;
  }
  return `fewer than one in ${humanizeNumber(Math.floor(ratio))}`;
};

export const humanizeApproximateRounded = (
  value: number,
  decimalPlaces?: number,
): string => {
  const format = (n: number): string => {
    if (decimalPlaces !== undefined) {
      return parseFloat(n.toFixed(decimalPlaces)).toString();
    }
    return Math.floor(n).toString();
  };
  if (value >= 1_000_000_000) {
    return `${format(value / 1_000_000_000)}B`;
  }
  if (value >= 1_000_000) {
    return `${format(value / 1_000_000)}M`;
  }
  if (value >= 1_000) {
    return `${format(value / 1_000)}K`;
  }
  return value.toString();
};

// This always rounds DOWN.
export const humanizeRoundedCurrency = (
  value: number,
  round = false,
  decimalPlaces?: number,
): string => {
  if (value >= 1000000000) {
    let amount;
    if (decimalPlaces !== undefined) {
      amount = parseFloat((value / 1000000000).toFixed(decimalPlaces));
    } else if (round) {
      amount = Math.floor(value / 1000000000);
    } else {
      amount = value / 1000000000;
    }
    return `$${amount} billion`;
  }
  if (value >= 1000000) {
    let amount;
    if (decimalPlaces !== undefined) {
      amount = parseFloat((value / 1000000).toFixed(decimalPlaces));
    } else if (round) {
      amount = Math.floor(value / 1000000);
    } else {
      amount = value / 1000000;
    }
    return `$${amount} million`;
  }
  if (value >= 1000) {
    let amount;
    if (round) {
      amount = Math.floor(value / 1000) * 1000;
    } else {
      amount = value;
    }
    return formatCurrency(amount, true);
  }
  return formatCurrency(value, true);
};

export function formatCompact(value: number): string {
  if (value < 1_000) {
    return `$${value}`;
  }
  return `$${humanizeApproximateRounded(value, 1)}`;
}

export const pluralize = (
  value: number,
  singular: string,
  options: { plural?: string; includeValue?: boolean; humanize?: boolean } = {},
) => {
  const plural = options.plural ? options.plural : `${singular}s`;
  if (options.includeValue) {
    const number = options.humanize ? humanizeNumber(value) : value;
    return value === 1 ? `${number} ${singular}` : `${number} ${plural}`;
  }
  return value === 1 ? singular : plural;
};

// 1st, 2nd, 3rd, 4th, 11th, 12th, 13th, 21st...
export const ordinal = (n: number): string => {
  const lastTwo = n % 100;
  if (lastTwo >= 11 && lastTwo <= 13) {
    return `${n}th`;
  }
  const suffix = { 1: "st", 2: "nd", 3: "rd" }[n % 10] ?? "th";
  return `${n}${suffix}`;
};

export const possessive = (term: string) =>
  term.endsWith("s") ? `${term}’` : `${term}’s`;

export function humanizeList<T>(
  values: T[],
): T | React.ReactElement | string | null {
  const isString = values.every((value) => typeof value === "string");
  const filtered = values.filter((value) => !!value);
  if (filtered.length === 0) {
    return null;
  }
  if (filtered.length === 1) {
    return filtered[0];
  } else if (filtered.length === 2) {
    if (isString) {
      return `${filtered[0]} and ${filtered[1]}`;
    }
    return (
      <>
        {filtered[0]} and {filtered[1]}
      </>
    );
  }
  const last = filtered.pop();
  const elements = [];
  for (const value of filtered) {
    elements.push(value);
    elements.push(", ");
  }
  elements.push("and ");
  elements.push(last);
  if (isString) {
    return elements.join("");
  }
  return <>{elements}</>;
}
