import { getDockItems } from "@services/dock-menu";
import { DockMenuClient } from "@components/dock-menu/components/dock-menu-client";

export async function DockMenuWrapper() {
  const items = await getDockItems();
  return <DockMenuClient items={items} />;
}
