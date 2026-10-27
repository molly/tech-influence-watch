import { HorizontalBars } from "@/app/components/home/HorizontalBars";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";
import { getFirstLastName } from "@/app/utils/names";

import { DIRECTION_FILL } from "./DirectionBreakdown";
import styles from "./SpendingFlow.module.css";
import { HelpsLine } from "./spendingFlowUtils";

function lastName(name: string) {
  return getFirstLastName(name)[1];
}

export function getHelpsLabel(line: HelpsLine): string {
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
  return `Helps ${lastName(line.beneficiary)}${party}`;
}

export default function HelpsBars({
  lines,
  max,
}: {
  lines: HelpsLine[];
  max: number;
}) {
  return (
    <HorizontalBars
      max={max}
      items={lines.map((line) => {
        const label = getHelpsLabel(line);
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
                    `${humanizeRoundedCurrency(part.amount, true, 1)} ${part.kind} ${lastName(part.candidate)}`,
                )
                .join(" + ")}
            </span>
          ),
        };
      })}
    />
  );
}
