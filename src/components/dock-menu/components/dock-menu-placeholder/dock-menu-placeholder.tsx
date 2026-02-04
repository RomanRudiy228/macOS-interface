"use client";

import Image from "next/image";
import { useState } from "react";
import { ICON_SIZE, SLOT_HEIGHT } from "@/shared/const/dock-menu.const";
import { getScale } from "@/components/dock-menu/utils/get-scale";
import type { DockMenuPlaceholderProps } from "./types/dock-menu-placeholder.types";

export function DockMenuPlaceholder({ items }: DockMenuPlaceholderProps) {
  const mainItems = items.slice(0, -1);
  const binItem = items[items.length - 1];
  const [loadedCount, setLoadedCount] = useState(0);
  const allImagesLoaded = loadedCount >= items.length;
  const handleImageLoadOrError = () =>
    setLoadedCount((c) => Math.min(c + 1, items.length));

  return (
    <nav
      className={`fixed bottom-5 left-1/2 z-50 -translate-x-1/2 flex items-end overflow-visible gap-1 rounded-2xl border border-white/15 bg-white/10 px-1.5 py-1 shadow-sm backdrop-blur-2xl backdrop-saturate-[1.4] transition-opacity duration-300 ease-out ${
        allImagesLoaded ? "opacity-100" : "opacity-0"
      }`}
      aria-label="Dock"
    >
      <ul className="flex items-end gap-0.5">
        {mainItems.map((item, index) => {
          const scale = getScale(null, index);
          const size = Math.ceil(ICON_SIZE * scale);
          return (
            <li
              key={item.id}
              className="flex flex-col cursor-default items-center justify-end transition-all duration-200 ease-out origin-bottom"
              style={{ minWidth: size, height: SLOT_HEIGHT }}
            >
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
                  className="object-contain drop-shadow-lg pointer-events-none"
                  sizes={`${size}px`}
                  unoptimized={item.src.endsWith(".png")}
                  onLoad={handleImageLoadOrError}
                  onError={handleImageLoadOrError}
                />
              </span>
            </li>
          );
        })}
      </ul>
      <div className="w-px self-center h-10 bg-white/20 shrink-0" aria-hidden />
      <ul className="flex items-end gap-0.5">
        <li
          className="flex flex-col cursor-default items-center justify-end transition-all duration-200 ease-out origin-bottom"
          style={{ minWidth: ICON_SIZE, height: SLOT_HEIGHT }}
        >
          <span
            className="relative block shrink-0 transition-transform duration-200 ease-out origin-bottom"
            style={{ width: ICON_SIZE, height: ICON_SIZE }}
          >
            <Image
              src={binItem.src}
              alt={binItem.name}
              fill
              className="object-contain drop-shadow-lg opacity-80"
              sizes={`${ICON_SIZE}px`}
              unoptimized
              onLoad={handleImageLoadOrError}
              onError={handleImageLoadOrError}
            />
          </span>
        </li>
      </ul>
    </nav>
  );
}
