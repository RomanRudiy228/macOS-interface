import type { DockItemView } from "@/types";

export function canRemoveFromDock(item: DockItemView): boolean {
  return !item.isLocked;
}
