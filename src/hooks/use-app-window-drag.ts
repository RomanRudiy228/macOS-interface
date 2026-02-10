"use client";

import { useCallback, useRef, useState } from "react";

export const useAppWindowDrag = (onFocus: () => void) => {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const startRef = useRef({ mouseX: 0, mouseY: 0, offsetX: 0, offsetY: 0 });

  const handleTitleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      e.stopPropagation();
      onFocus();
      startRef.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        offsetX: dragOffset.x,
        offsetY: dragOffset.y,
      };
      const onMove = (e: MouseEvent) => {
        setDragOffset({
          x: startRef.current.offsetX + e.clientX - startRef.current.mouseX,
          y: startRef.current.offsetY + e.clientY - startRef.current.mouseY,
        });
      };
      const onUp = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    },
    [onFocus, dragOffset.x, dragOffset.y]
  );

  return { dragOffset, handleTitleMouseDown };
};
