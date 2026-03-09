"use client";

import { motion, PanInfo } from "motion/react";
import { ReactNode, useEffect, useRef, useState } from "react";
import type { Rect } from "@/utils/collisions";

interface WidgetWrapperProps {
  id: string;
  children: ReactNode;
  defaultPosition: { x: number; y: number };
  initialPosition?: { x: number; y: number } | null;
  allWidgets: Rect[];
  onPositionUpdate: (rect: Rect) => void;
  onPersist?: (id: string, x: number, y: number) => void;
}

export const WidgetWrapper = ({
  id,
  children,
  defaultPosition,
  initialPosition,
  allWidgets,
  onPositionUpdate,
  onPersist,
}: WidgetWrapperProps) => {
  const MENU_HEIGHT = 36;

  const [position, setPosition] = useState(() => {
    const base = initialPosition ?? defaultPosition;
    return {
      x: Math.max(0, base.x),
      y: Math.max(MENU_HEIGHT, base.y),
    };
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const appliedInitialRef = useRef(false);
  useEffect(() => {
    if (appliedInitialRef.current) return;

    if (!initialPosition) {
      setIsLoaded(true);
      return;
    }

    appliedInitialRef.current = true;
    setPosition({
      x: Math.max(0, initialPosition.x),
      y: Math.max(MENU_HEIGHT, initialPosition.y),
    });
    setIsLoaded(true);
  }, [initialPosition]);

  const lastReportedRef = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    if (!isLoaded || !containerRef.current) return;

    const prev = lastReportedRef.current;
    if (prev && prev.x === position.x && prev.y === position.y) return;

    lastReportedRef.current = { x: position.x, y: position.y };

    const { width, height } = containerRef.current.getBoundingClientRect();
    onPositionUpdate({ id, ...position, width, height });
  }, [isLoaded, position.x, position.y, id, onPositionUpdate]);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (!containerRef.current) return;

    const { width, height } = containerRef.current.getBoundingClientRect();
    const boardWidth = window.innerWidth;
    const boardHeight = window.innerHeight;

    const clampToBoard = (pos: { x: number; y: number }) => {
      const maxX = Math.max(0, boardWidth - width);
      const maxY = Math.max(MENU_HEIGHT, boardHeight - height);
      return {
        x: Math.min(Math.max(0, pos.x), maxX),
        y: Math.min(Math.max(MENU_HEIGHT, pos.y), maxY),
      };
    };

    const others = allWidgets.filter((w) => w.id !== id);

    const overlapsAny = (x: number, y: number) => {
      const a: Rect = { id, x, y, width, height };
      return others.some((b) => {
        return (
          a.x < b.x + b.width &&
          a.x + a.width > b.x &&
          a.y < b.y + b.height &&
          a.y + a.height > b.y
        );
      });
    };

    const findFreeSpot = (start: { x: number; y: number }) => {
      const STEP = 12;

      const maxX = Math.max(0, boardWidth - width);
      const maxY = Math.max(MENU_HEIGHT, boardHeight - height);

      const maxRadius = Math.max(maxX, maxY) + STEP;

      for (let radius = 0; radius <= maxRadius; radius += STEP) {
        const candidates: { x: number; y: number }[] = [
          { x: start.x + radius, y: start.y },
          { x: start.x - radius, y: start.y },
          { x: start.x, y: start.y + radius },
          { x: start.x, y: start.y - radius },
          { x: start.x + radius, y: start.y + radius },
          { x: start.x - radius, y: start.y + radius },
          { x: start.x + radius, y: start.y - radius },
          { x: start.x - radius, y: start.y - radius },
        ];

        for (const c of candidates) {
          const clamped = clampToBoard(c);
          if (!overlapsAny(clamped.x, clamped.y)) {
            return clamped;
          }
        }
      }

      for (let y = MENU_HEIGHT; y <= maxY; y += STEP) {
        for (let x = 0; x <= maxX; x += STEP) {
          if (!overlapsAny(x, y)) {
            return { x, y };
          }
        }
      }

      return null;
    };

    const desired = clampToBoard({
      x: position.x + info.offset.x,
      y: position.y + info.offset.y,
    });

    let finalCoords = desired;

    if (overlapsAny(finalCoords.x, finalCoords.y)) {
      const free = findFreeSpot(finalCoords);

      if (free) {
        finalCoords = free;
      } else {
        finalCoords = position;
      }
    }

    if (finalCoords.x === position.x && finalCoords.y === position.y) {
      return;
    }

    setPosition(finalCoords);
    onPositionUpdate({
      id,
      x: finalCoords.x,
      y: finalCoords.y,
      width,
      height,
    });
    onPersist?.(id, finalCoords.x, finalCoords.y);
  };

  if (!isLoaded) return null;

  return (
    <motion.div
      ref={containerRef}
      data-widget-id={id}
      drag
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={{ top: MENU_HEIGHT }}
      animate={{ x: position.x, y: position.y }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05, zIndex: 50 }}
      className="widget-item absolute cursor-grab active:cursor-grabbing pointer-events-auto"
    >
      {children}
    </motion.div>
  );
};
