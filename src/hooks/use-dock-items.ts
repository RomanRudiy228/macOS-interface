"use client";

import { useState } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { reorderDockItems, removeFromDock } from "@/actions";
import type { DockItemView } from "@/types";

export function useDockItems(initialItems: DockItemView[]) {
  const [items, setItems] = useState<DockItemView[]>(initialItems);

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

  return { items, mainItems, binItem, setItems, handleDragEnd };
}
