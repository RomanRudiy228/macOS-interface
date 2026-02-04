"use server";

import { reorderDockItems as reorderDockItemsService } from "@/services/dock-menu/dock-menu-reorder.service";

export async function reorderDockItems(orderedMainIds: string[]) {
  return reorderDockItemsService(orderedMainIds);
}
