import { getDockItems } from "@services/dock-menu";
import { DockMenuClient } from "@components/dock-menu";

export async function DockMenuWrapper() {
  const items = await getDockItems();
  return <DockMenuClient items={items} />;
}
