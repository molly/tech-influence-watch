"use client";

import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { ReactNode, useState } from "react";

import styles from "./informationalTooltip.module.css";

export default function InformationalTooltip({
  children,
}: {
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "top",
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        fallbackAxisSideDirection: "start",
      }),
      shift(),
    ],
  });

  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);
  return (
    <>
      <button
        ref={refs.setReference} // eslint-disable-line react-hooks/refs
        className={styles.tooltipButton}
        {...getReferenceProps()}
      >
        <span className={styles.tooltipIcon}>ⓘ</span>
        <FloatingPortal>
          {isOpen && (
            <div
              className={styles.tooltip}
              ref={refs.setFloating} // eslint-disable-line react-hooks/refs
              style={floatingStyles}
              {...getFloatingProps()}
            >
              {children}
            </div>
          )}
        </FloatingPortal>
      </button>
    </>
  );
}
