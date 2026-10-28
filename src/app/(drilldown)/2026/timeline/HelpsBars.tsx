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

// "lost Jun 23 Democratic primary", "withdrew", "died", for candidates no
// longer running.
function statusNote(
  statuses: Record<string, string>,
  name: string,
): string | null {
  const status = statuses[name];
  return status ? status.charAt(0).toLowerCase() + status.slice(1) : null;
}

export function getHelpsLabel(
  line: HelpsLine,
  formatName: (name: string) => string = lastName,
  statuses: Record<string, string> = {},
): string {
  if (!line.beneficiary) {
    const other = line.intraParty ? "other " : "";
    if (line.direction === "R") {
      return `Helps ${other}Republicans`;
    }
    if (line.direction === "D") {
      return `Helps ${other}Democrats`;
    }
    return "No clear beneficiary";
  }
  const notes = [
    line.party === "R" || line.party === "D" || line.party === "I"
      ? line.party
      : null,
    statusNote(statuses, line.beneficiary),
  ].filter(Boolean);
  const parenthetical = notes.length > 0 ? ` (${notes.join(", ")})` : "";
  return `Helps ${formatName(line.beneficiary)}${parenthetical}`;
}

export default function HelpsBars({
  lines,
  max,
  statuses,
}: {
  lines: HelpsLine[];
  max: number;
  // Candidates no longer running, by name: "Withdrew", "Lost Jun 23
  // Democratic primary", and so on.
  statuses: Record<string, string>;
}) {
  const formatName = getNameFormatter(lines);
  return (
    <HorizontalBars
      max={max}
      items={lines.map((line) => {
        const label = getHelpsLabel(line, formatName, statuses);
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
                .map((part) => {
                  const note = statusNote(statuses, part.candidate);
                  return `${humanizeRoundedCurrency(part.amount, true, 1)} ${part.kind} ${formatName(part.candidate)}${note ? ` (${note})` : ""}`;
                })
                .join(" + ")}
            </span>
          ),
        };
      })}
    />
  );
}
