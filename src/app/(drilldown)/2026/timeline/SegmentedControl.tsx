import styles from "./SpendingFlow.module.css";

export default function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label?: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className={styles.filterGroup}>
      {label && <span className={styles.filterLabel}>{label}</span>}
      <div
        className={styles.segmented}
        role="group"
        {...(label ? { "aria-label": label } : {})}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={
              option.value === value
                ? `${styles.segment} ${styles.segmentActive}`
                : styles.segment
            }
            aria-pressed={option.value === value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
