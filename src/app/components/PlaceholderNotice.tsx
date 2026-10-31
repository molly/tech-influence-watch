import styles from "./PlaceholderNotice.module.css";

// TEMPORARY: marks copy or data that still needs to be written or reviewed
// before publishing. Remove every use before the page goes live.
export default function PlaceholderNotice({
  children,
  inline,
}: {
  children: React.ReactNode;
  inline?: boolean;
}) {
  const Tag = inline ? "span" : "div";
  return (
    <Tag className={inline ? styles.inline : styles.block}>
      <span className={styles.label}>Placeholder</span> {children}
    </Tag>
  );
}
