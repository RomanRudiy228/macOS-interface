"use server";

import { reorderDockItemsService } from "@services/dock-menu";

export async function reorderDockItems(orderedMainIds: string[]) {
  return reorderDockItemsService(orderedMainIds);
}
