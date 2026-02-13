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
import { getApps } from "@/actions";
import type { DockMenuProps } from "@/types";
import type { AppCatalog } from "@/actions/apps-get";

export const DockMenu: React.FC<DockMenuProps> = ({ items: initialItems }) => {
  const [mounted, setMounted] = useState(false);
  const [availableApps, setAvailableApps] = useState<
    Record<string, AppCatalog>
  >({});
  const { items, mainItems, binItem, handleDragEnd, addItemToDock } =
    useDockItems(initialItems, availableApps);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDropTarget, setIsDropTarget] = useState(false);
  const effectiveHoveredIndex = isDragging ? null : hoveredIndex;
  const {
    openWindow,
    isOpen,
    isActive,
    restoreWindow,
    minimizeWindow,
    isMinimized,
  } = useWindows();
  const isLaunchpadVisible = isOpen("launchpad") && !isMinimized("launchpad");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const loadApps = async () => {
      const apps = await getApps();
      setAvailableApps(apps);
    };

    loadApps();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleOpenApp = (windowId: string, itemName: string) => {
    if (!isOpen(windowId)) {
      return openWindow(windowId, itemName);
    }

    if (isMinimized(windowId)) {
      return restoreWindow(windowId);
    }

    return minimizeWindow(windowId);
  };

  if (!mounted) return null;

  const handleDockDrop = async (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    setIsDropTarget(false);

    const appKey =
      event.dataTransfer.getData("application/x-macos-app-key") ||
      event.dataTransfer.getData("text/plain");

    if (!appKey) return;
    await addItemToDock(appKey);
  };

  return (
    <nav
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 flex items-end overflow-visible gap-1 rounded-2xl border px-1.5 py-1 shadow-sm backdrop-blur-2xl backdrop-saturate-[1.4] transition-all duration-200 ${isLaunchpadVisible ? "z-[75] border-white/25 bg-white/20" : "z-50 border-white/15 bg-white/10"} ${isDropTarget ? "scale-[1.02] shadow-[0_12px_36px_rgba(255,255,255,0.25)]" : ""}`}
      aria-label="Dock"
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
        setIsDropTarget(true);
      }}
      onDragLeave={() => setIsDropTarget(false)}
      onDrop={handleDockDrop}
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
                isOpen={isOpen(item.appKey)}
                isActive={isActive(item.appKey)}
                onOpen={() => handleOpenApp(item.appKey, item.name)}
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
            isOpen={isOpen(binItem.appKey)}
            onOpen={() => handleOpenApp(binItem.appKey, binItem.name)}
          />
        </ul>
      </DndContext>
    </nav>
  );
};
