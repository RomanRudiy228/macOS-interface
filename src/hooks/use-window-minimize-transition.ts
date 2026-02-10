"use client";

import { useCallback, useEffect, useRef } from "react";

export const useWindowMinimizeTransition = (
  isMinimizing: boolean,
  onMinimize: () => void
) => {
  const minimizeHandledRef = useRef(false);

  useEffect(() => {
    if (!isMinimizing) minimizeHandledRef.current = false;
  }, [isMinimizing]);

  const handleMinimizeTransitionEnd = useCallback(
    (e: React.TransitionEvent) => {
      if (e.target !== e.currentTarget) return;
      if (e.propertyName !== "transform" && e.propertyName !== "opacity")
        return;
      if (!isMinimizing || minimizeHandledRef.current) return;
      minimizeHandledRef.current = true;
      onMinimize();
    },
    [isMinimizing, onMinimize]
  );

  return handleMinimizeTransitionEnd;
};
