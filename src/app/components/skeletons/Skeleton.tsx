import { getRandomInt } from "@/app/utils/range";

import styles from "./skeleton.module.css";

export default function Skeleton({
  onCard = false,
  height,
  randHeight,
  width,
  randWidth,
  margin,
  inline,
  ...rest
}: {
  onCard?: boolean;
  height?: string;
  randHeight?: [number, number];
  width?: string;
  randWidth?: [number, number];
  margin?: string;
  inline?: boolean;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "style">) {
  let className = onCard ? styles.skeletonCard : styles.skeleton;
  if (rest.className) {
    className += ` ${rest.className}`;
  }
  const style = {
    ...(height && { height }),
    ...(randHeight && {
      height: `${getRandomInt(randHeight[0], randHeight[1])}rem`,
    }),
    ...(width && { width }),
    ...(randWidth && {
      width: `${getRandomInt(randWidth[0], randWidth[1])}rem`,
    }),
    ...(margin
      ? { margin }
      : inline
        ? { marginBottom: 0, marginLeft: "0.25rem", marginRight: "0.25rem" }
        : {}),
    ...(inline && { display: "inline-block" }),
  };
  return (
    <div
      {...rest}
      className={className}
      style={style}
      suppressHydrationWarning={!!(randWidth || randHeight)}
    />
  );
}
