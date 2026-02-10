"use client";

import React, { useEffect, useState } from "react";
import {
  DndContext,
  pointerWithin,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableDockItem } from "@/components/dock-menu/dock-item";
import { useWindows } from "@/contexts";
import { useDockItems } from "@/hooks";
import type { DockMenuProps } from "@/types";

export const DockMenu: React.FC<DockMenuProps> = ({ items: initialItems }) => {
  const [mounted, setMounted] = useState(false);
  const { items, mainItems, binItem, handleDragEnd } =
    useDockItems(initialItems);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const effectiveHoveredIndex = isDragging ? null : hoveredIndex;
  const {
    openWindow,
    isOpen,
    isActive,
    restoreWindow,
    minimizeWindow,
    isMinimized,
  } = useWindows();

  useEffect(() => setMounted(true), []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleOpenApp = (itemId: string, itemName: string) => {
    if (!isOpen(itemId)) {
      return openWindow(itemId, itemName);
    }

    if (isMinimized(itemId)) {
      return restoreWindow(itemId);
    }

    return minimizeWindow(itemId);
  };

  if (!mounted) return null;

  return (
    <nav
      className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 flex items-end overflow-visible gap-1 rounded-2xl border border-white/15 bg-white/10 px-1.5 py-1 shadow-sm backdrop-blur-2xl backdrop-saturate-[1.4]"
      aria-label="Dock"
    >
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(event) => {
          handleDragEnd(event);
          setIsDragging(false);
        }}
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
                hoveredIndex={effectiveHoveredIndex}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                isOpen={isOpen(item.id)}
                isActive={isActive(item.id)}
                onOpen={() => handleOpenApp(item.id, item.name)}
              />
            ))}
          </SortableContext>
        </ul>

        <div
          className="w-px self-center h-10 bg-white/20 shrink-0"
          aria-hidden
        />

        <ul className="flex items-end gap-0.5">
          <SortableDockItem
            item={binItem}
            index={items.length - 1}
            hoveredIndex={effectiveHoveredIndex}
            onMouseEnter={() => setHoveredIndex(items.length - 1)}
            onMouseLeave={() => setHoveredIndex(null)}
            variant="bin"
            isOpen={isOpen(binItem.id)}
            onOpen={() => handleOpenApp(binItem.id, binItem.name)}
          />
        </ul>
      </DndContext>
    </nav>
  );
};
