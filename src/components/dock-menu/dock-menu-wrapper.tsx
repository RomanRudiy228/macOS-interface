import { getDockItems } from "@/actions";
import { DockMenu } from "@/components/dock-menu";

export async function DockMenuWrapper() {
  const items = await getDockItems();
  return <DockMenu items={items} />;
}
