"use server";

import { removeDockItem as removeDockItemService } from "@/services/dock-menu/dock-menu-remove.service";

export async function removeFromDock(itemId: string) {
  return removeDockItemService(itemId);
}
