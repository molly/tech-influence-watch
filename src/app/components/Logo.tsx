import styles from "./header.module.css";

export default function Logo() {
  return (
    <div className={styles.logo}>
      Tech Influence <span className={styles.logoWatch}>Watch</span>
    </div>
  );
}
