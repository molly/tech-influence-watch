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
];
export const humanizeNumber = (value: number): string => {
  if (value < NUMBERS.length) {
    return NUMBERS[value];
  }
  return value.toString();
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
): string => {
  if (value >= 1000000000) {
    let amount;
    if (round) {
      amount = Math.floor(value / 1000000000);
    } else {
      amount = value / 1000000000;
    }
    return `$${amount} billion`;
  }
  if (value >= 1000000) {
    let amount;
    if (round) {
      amount = Math.floor(value / 1000000);
    } else {
      amount = value / 1000000;
    }
    return `$${amount} million`;
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
  return `$${humanizeApproximateRounded(value, 2)}`;
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
