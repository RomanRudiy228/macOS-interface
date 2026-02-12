"use client";

import { useEffect, useState } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { addToDock, reorderDockItems, removeFromDock } from "@/actions";
import { APP_CATALOG } from "@/const";
import type { DockItemView } from "@/types";

const LOCAL_DOCK_ITEMS_KEY = "macos-interface:dock-items";

function buildDockItemsFromKeys(
  appKeys: string[],
  baseItems: DockItemView[]
): DockItemView[] {
  const uniqueValidKeys = Array.from(
    new Set(
      appKeys.filter((appKey) => APP_CATALOG[appKey] && appKey !== "bin")
    )
  );

  const baseByAppKey = new Map(baseItems.map((item) => [item.appKey, item]));

  const mainItems = uniqueValidKeys.map((appKey) => {
    const existing = baseByAppKey.get(appKey);
    if (existing) return existing;

    const app = APP_CATALOG[appKey];
    return {
      id: `local-${appKey}`,
      appKey,
      name: app.name,
      src: app.src,
      isLocked: false,
    };
  });

  const binItem = baseByAppKey.get("bin");
  if (binItem) return [...mainItems, binItem];

  const binApp = APP_CATALOG.bin;
  return [
    ...mainItems,
    {
      id: "local-bin",
      appKey: "bin",
      name: binApp.name,
      src: binApp.src,
      isLocked: false,
    },
  ];
}

export function useDockItems(initialItems: DockItemView[]) {
  const [items, setItems] = useState<DockItemView[]>(initialItems);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LOCAL_DOCK_ITEMS_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;

      setItems(buildDockItemsFromKeys(parsed, initialItems));
    } catch {
      // Ignore local storage errors and keep server-backed items.
    }
  }, [initialItems]);

  useEffect(() => {
    try {
      const appKeys = items.map((item) => item.appKey);
      window.localStorage.setItem(LOCAL_DOCK_ITEMS_KEY, JSON.stringify(appKeys));
    } catch {
      // Ignore local storage write failures.
    }
  }, [items]);

  const mainItems = items.slice(0, -1);
  const binItem = items[items.length - 1];

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      const item = mainItems.find((i) => i.id === active.id);
      if (!item || item.isLocked) return;
      const newMain = mainItems.filter((i) => i.id !== active.id);
      setItems([...newMain, binItem]);
      if (!item.id.startsWith("fallback-")) {
        await removeFromDock(item.id);
      }
      return;
    }

    if (active.id === over.id) return;

    const oldIndex = mainItems.findIndex((i) => i.id === active.id);
    const newIndex = mainItems.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newMain = arrayMove(mainItems, oldIndex, newIndex);
    const newItems = [...newMain, binItem];
    setItems(newItems);

    await reorderDockItems(newMain.map((i) => i.id));
  };

  const addItemToDock = async (appKey: string) => {
    if (appKey === "bin" || appKey === "launchpad") return;
    if (!APP_CATALOG[appKey]) return;
    if (items.some((item) => item.appKey === appKey)) return;

    const addedItem = await addToDock(appKey);
    if (!addedItem) return;

    setItems((prev) => {
      if (prev.some((item) => item.appKey === appKey)) return prev;

      const currentBin = prev[prev.length - 1];
      const main = prev.slice(0, -1);
      return [...main, addedItem, currentBin];
    });
  };

  return { items, mainItems, binItem, setItems, handleDragEnd, addItemToDock };
}
