import { getDockItems } from "@/services/dock-menu/dock-menu.service";
import { DockMenu } from "./dock-menu";

export async function DockMenuWrapper() {
  const items = await getDockItems();
  return <DockMenu items={items} />;
}
