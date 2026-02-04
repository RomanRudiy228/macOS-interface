"use client";

import Image from "next/image";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { ICON_SIZE, SLOT_HEIGHT } from "@/shared/const/dock-menu.const";
import { getScale } from "./utils/get-scale";
import { SortableDockItem } from "./components/sortable-dock-item/sortable-dock-item";
import { useDockItems } from "./hooks/use-dock-items";
import type { DockMenuProps } from "./types/dock-menu.types";

export function DockMenu({ items: initialItems }: DockMenuProps) {
  const { items, mainItems, binItem, handleDragEnd } =
    useDockItems(initialItems);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [loadedCount, setLoadedCount] = useState(items.length);
  const allImagesLoaded = loadedCount >= items.length;
  const handleImageLoad = () =>
    setLoadedCount((c) => Math.min(c + 1, items.length));

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  return (
    <nav
      className={`fixed bottom-5 left-1/2 z-50 -translate-x-1/2 flex items-end overflow-visible gap-1 rounded-2xl border border-white/15 bg-white/10 px-1.5 py-1 shadow-sm backdrop-blur-2xl backdrop-saturate-[1.4] transition-opacity duration-300 ease-out ${
        allImagesLoaded ? "opacity-100" : "opacity-0"
      }`}
      aria-label="Dock"
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <ul className="flex items-end gap-0.5">
          <SortableContext
            items={mainItems.map((i) => i.id)}
            strategy={horizontalListSortingStrategy}
          >
            {mainItems.map((item, index) => (
              <SortableDockItem
                key={item.id}
                item={item}
                index={index}
                hoveredIndex={hoveredIndex}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onImageLoad={handleImageLoad}
              />
            ))}
          </SortableContext>
        </ul>

        <div
          className="w-px self-center h-10 bg-white/20 shrink-0"
          aria-hidden
        />

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
                        onLoad={handleImageLoad}
                        onError={handleImageLoad}
                      />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top">{binItem.name}</TooltipContent>
                </Tooltip>
              </li>
            );
          })()}
        </ul>
      </DndContext>
    </nav>
  );
}
