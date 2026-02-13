"use server";

import { cookies } from "next/headers";
import { createClient } from "@/supabase/server";
import { DEFAULT_DOCK_ORDER } from "@/const";
import { getApps } from "./apps-get";
import type { DockItemView } from "@/types";

export async function getDockItems(): Promise<DockItemView[]> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let query = supabase
      .from("dock_items")
      .select("id, app_key, position, is_locked")
      .order("position", { ascending: true });

    query = user ? query.eq("user_id", user.id) : query.is("user_id", null);

    const { data, error } = await query;

    if (error || !data?.length) {
      return getFallbackDockItems();
    }

    const apps = await getApps();
    const items: DockItemView[] = [];
    for (const row of data) {
      const app = apps[row.app_key];
      if (!app) continue;
      items.push({
        id: row.id,
        appKey: row.app_key,
        name: app.name,
        src: app.src,
        isLocked: row.is_locked ?? false,
      });
    }

    return items.length ? items : getFallbackDockItems();
  } catch {
    return getFallbackDockItems();
  }
}

async function getFallbackDockItems(): Promise<DockItemView[]> {
  const apps = await getApps();
  return DEFAULT_DOCK_ORDER
    .map((appKey, index) => {
      const app = apps[appKey];
      if (!app) return null;
      return {
        id: `fallback-${index}-${appKey}`,
        appKey: appKey as string,
        name: app.name,
        src: app.src,
        isLocked: false,
      };
    })
    .filter((item): item is DockItemView => item !== null);
}
