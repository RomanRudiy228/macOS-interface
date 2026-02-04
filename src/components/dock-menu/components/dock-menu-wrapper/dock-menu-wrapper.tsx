import { getDockItems } from "@/services/dock-menu/dock-menu.service";
import { DockMenuClient } from "../dock-menu-client/dock-menu-client";

export async function DockMenuWrapper() {
  const items = await getDockItems();
  return <DockMenuClient items={items} />;
}
