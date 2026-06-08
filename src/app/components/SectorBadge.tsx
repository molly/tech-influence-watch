import type { ReactNode } from "react";

import sharedStyles from "@/app/shared.module.css";

// Sector badge with a leading, zero-width-but-copyable space so selecting a
// name plus its badge copies as "Name crypto" rather than "Namecrypto". The
// visible gap is unchanged — it still comes from .sectorBadge's margin-left.
export default function SectorBadge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <>
      <span className={sharedStyles.badgeSpace}> </span>
      <span
        className={
          className
            ? `${sharedStyles.sectorBadge} ${className}`
            : sharedStyles.sectorBadge
        }
      >
        {children}
      </span>
    </>
  );
}
