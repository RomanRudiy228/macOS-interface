import { cookies } from "next/headers";
import { createClient } from "@/supabase/server";
import {
  APP_CATALOG,
  DEFAULT_DOCK_ORDER,
} from "@/components/dock-menu/const/dock-menu.const";
import type { DockItemView } from "./types/dock-menu.types";

export function canRemoveFromDock(item: DockItemView): boolean {
  return !item.is_locked;
}

export async function getDockItems(): Promise<DockItemView[]> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase
      .from("dock_items")
      .select("id, app_key, position, is_locked")
      .order("position", { ascending: true });

    if (error || !data?.length) {
      return getFallbackDockItems();
    }

    const items: DockItemView[] = [];
    for (const row of data) {
      const app = APP_CATALOG[row.app_key];
      if (!app) continue;
      items.push({
        id: row.id,
        name: app.name,
        src: app.src,
        is_locked: row.is_locked ?? false,
      });
    }

    return items.length ? items : getFallbackDockItems();
  } catch {
    return getFallbackDockItems();
  }
}

function getFallbackDockItems(): DockItemView[] {
  return DEFAULT_DOCK_ORDER.map((appKey, index) => {
    const app = APP_CATALOG[appKey];
    return {
      id: `fallback-${index}-${appKey}`,
      name: app.name,
      src: app.src,
      is_locked: false,
    };
  });
}
