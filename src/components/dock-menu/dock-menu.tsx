"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { ICON_SIZE, SLOT_HEIGHT } from "./const/dock-menu.const";
import { getScale } from "./utils/get-scale";
import type { DockMenuProps } from "./types/dock-menu.types";

export function DockMenu({ items }: DockMenuProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const mainItems = items.slice(0, -1);
  const binItem = items[items.length - 1];

  return (
    <nav
      className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 flex items-end overflow-visible gap-1 rounded-2xl border border-white/15 bg-white/10 px-1.5 py-1 shadow-sm backdrop-blur-2xl backdrop-saturate-[1.4] transition-all duration-200 ease-out"
      aria-label="Dock"
    >
      <ul className="flex items-end gap-0.5">
        {mainItems.map((item, index) => {
          const scale = getScale(hoveredIndex, index);
          const size = Math.ceil(ICON_SIZE * scale);
          return (
            <li
              key={item.id}
              className="flex flex-col cursor-default items-center justify-end transition-all duration-200 ease-out origin-bottom"
              style={{ minWidth: size, height: SLOT_HEIGHT }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className="relative block shrink-0 transition-transform duration-200 ease-out origin-bottom"
                    style={{
                      width: ICON_SIZE,
                      height: ICON_SIZE,
                      transform: `scale(${scale})`,
                    }}
                  >
                    <Image
                      src={item.src}
                      alt={item.name}
                      fill
                      className="object-contain drop-shadow-lg"
                      sizes={`${size}px`}
                      unoptimized={item.src.endsWith(".png")}
                    />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top">{item.name}</TooltipContent>
              </Tooltip>
            </li>
          );
        })}
      </ul>
      <div className="w-px self-center h-10 bg-white/20 shrink-0" aria-hidden />
      <ul className="flex items-end gap-0.5">
        {(() => {
          const binIndex = items.length - 1;
          const scale = getScale(hoveredIndex, binIndex);
          const size = Math.ceil(ICON_SIZE * scale);
          return (
            <li
              className="flex flex-col cursor-default items-center justify-end transition-all duration-200 ease-out origin-bottom"
              style={{ minWidth: size, height: SLOT_HEIGHT }}
              onMouseEnter={() => setHoveredIndex(binIndex)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className="relative block shrink-0 transition-transform duration-200 ease-out origin-bottom"
                    style={{
                      width: ICON_SIZE,
                      height: ICON_SIZE,
                      transform: `scale(${scale})`,
                    }}
                  >
                    <Image
                      src={binItem.src}
                      alt={binItem.name}
                      fill
                      className="object-contain drop-shadow-lg opacity-80"
                      sizes={`${size}px`}
                      unoptimized
                    />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top">{binItem.name}</TooltipContent>
              </Tooltip>
            </li>
          );
        })()}
      </ul>
    </nav>
  );
}
