import { HorizontalBars } from "@/app/components/home/HorizontalBars";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";
import { getFirstLastName } from "@/app/utils/names";

import { DIRECTION_FILL } from "./DirectionBreakdown";
import styles from "./SpendingFlow.module.css";
import { HelpsLine } from "./spendingFlowUtils";

function lastName(name: string) {
  return getFirstLastName(name)[1];
}

// Last names, unless two different people in the same row share one (e.g.
// Lindsey and Darline Graham), in which case those get full names.
function getNameFormatter(lines: HelpsLine[]): (name: string) => string {
  const names = new Set(
    lines.flatMap((line) => [
      ...(line.beneficiary ? [line.beneficiary] : []),
      ...line.parts.map((part) => part.candidate),
    ]),
  );
  const counts = new Map<string, number>();
  for (const name of names) {
    counts.set(lastName(name), (counts.get(lastName(name)) ?? 0) + 1);
  }
  return (name) => ((counts.get(lastName(name)) ?? 0) > 1 ? name : lastName(name));
}

export function getHelpsLabel(
  line: HelpsLine,
  formatName: (name: string) => string = lastName,
): string {
  if (!line.beneficiary) {
    if (line.direction === "R") {
      return "Helps Republicans";
    }
    if (line.direction === "D") {
      return "Helps Democrats";
    }
    return "No clear beneficiary";
  }
  const party =
    line.party === "R" || line.party === "D" || line.party === "I"
      ? ` (${line.party})`
      : "";
  return `Helps ${formatName(line.beneficiary)}${party}`;
}

export default function HelpsBars({
  lines,
  max,
}: {
  lines: HelpsLine[];
  max: number;
}) {
  const formatName = getNameFormatter(lines);
  return (
    <HorizontalBars
      max={max}
      items={lines.map((line) => {
        const label = getHelpsLabel(line, formatName);
        const displayValue = humanizeRoundedCurrency(line.total, true, 1);
        return {
          key: line.key,
          label,
          value: line.total,
          displayValue,
          ariaLabel: `${label}: ${displayValue}`,
          fillClassName: DIRECTION_FILL[line.direction],
          subtitle: (
            <span className={styles.annotation}>
              {line.parts
                .map(
                  (part) =>
                    `${humanizeRoundedCurrency(part.amount, true, 1)} ${part.kind} ${formatName(part.candidate)}`,
                )
                .join(" + ")}
            </span>
          ),
        };
      })}
    />
  );
}
