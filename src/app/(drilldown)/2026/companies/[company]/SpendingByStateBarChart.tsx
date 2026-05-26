import Link from "next/link";

import {
  HorizontalBarItem,
  HorizontalBars,
} from "@/app/components/home/HorizontalBars";
import { formatCompact } from "@/app/utils/humanize";

const TOP_N = 10;

function stateToUrl(stateName: string) {
  return `/2026/states/${stateName.toLowerCase().replace(/ /g, "-")}`;
}

export default function SpendingByStateBarChart({
  stateValues,
}: {
  stateValues: Record<string, number>;
}) {
  const sorted = Object.entries(stateValues)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, TOP_N);

  if (sorted.length === 0) {
    return null;
  }

  const items: HorizontalBarItem[] = sorted.map(([state, value]) => ({
    key: state,
    label: state,
    labelNode: (
      <Link className="unstyled" href={stateToUrl(state)}>
        {state}
      </Link>
    ),
    value,
    displayValue: formatCompact(value),
  }));

  return <HorizontalBars items={items} />;
}
