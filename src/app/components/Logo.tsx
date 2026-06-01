import Image from "next/image";

import styles from "./header.module.css";

export default function Logo() {
  return (
    <div className={styles.logo}>
      <Image
        src="/mark.svg"
        alt=""
        width={52}
        height={52}
        className={styles.logoMark}
      />
      <div className={styles.logoText}>
        Tech Influence
        <div>
          <span className={styles.logoWatch}>Watch</span>
        </div>
      </div>
    </div>
  );
}
