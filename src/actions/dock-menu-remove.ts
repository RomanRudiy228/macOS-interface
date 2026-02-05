"use server";

import { removeDockItemService } from "@services/dock-menu";

export async function removeFromDock(itemId: string) {
  return removeDockItemService(itemId);
}
