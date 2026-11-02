import styles from "./spinner.module.css";

export default function Spinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div className={styles.spinner} role="status">
      <div className={styles.ring} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </div>
  );
}
