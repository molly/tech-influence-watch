import Image from "next/image";

import styles from "./header.module.css";

export default function Logo() {
  return (
    <div className={styles.logo}>
      <Image
        src="/mark.svg"
        alt=""
        width={28}
        height={28}
        className={styles.logoMark}
      />
      Tech Influence <span className={styles.logoWatch}>Watch</span>
    </div>
  );
}
