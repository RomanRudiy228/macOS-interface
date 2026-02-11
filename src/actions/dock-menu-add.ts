"use server";

import { cookies } from "next/headers";
import { createClient } from "@/supabase/server";
import { APP_CATALOG } from "@/const";
import type { DockItemView } from "@/types";

export async function addToDock(appKey: string): Promise<DockItemView | null> {
  const app = APP_CATALOG[appKey];
  if (!app || appKey === "bin") return null;

  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: existing } = await supabase
      .from("dock_items")
      .select("id, app_key, is_locked")
      .eq("app_key", appKey)
      .limit(1)
      .maybeSingle();

    if (existing) {
      return {
        id: existing.id,
        appKey: existing.app_key,
        name: app.name,
        src: app.src,
        isLocked: existing.is_locked ?? false,
      };
    }

    const { data: binItem } = await supabase
      .from("dock_items")
      .select("id, position")
      .eq("app_key", "bin")
      .limit(1)
      .maybeSingle();

    let insertPosition = 1;

    if (binItem) {
      const { data: rowsToShift } = await supabase
        .from("dock_items")
        .select("id, position")
        .gte("position", binItem.position)
        .order("position", { ascending: false });

      for (const row of rowsToShift ?? []) {
        await supabase
          .from("dock_items")
          .update({ position: row.position + 1 })
          .eq("id", row.id);
      }

      insertPosition = binItem.position;
    } else {
      const { data: lastItem } = await supabase
        .from("dock_items")
        .select("position")
        .order("position", { ascending: false })
        .limit(1)
        .maybeSingle();

      insertPosition = (lastItem?.position ?? 0) + 1;
    }

    const { data: inserted, error } = await supabase
      .from("dock_items")
      .insert({
        app_key: appKey,
        is_locked: false,
        position: insertPosition,
      })
      .select("id, app_key, is_locked")
      .single();

    if (error || !inserted) {
      return {
        id: `local-${appKey}`,
        appKey,
        name: app.name,
        src: app.src,
        isLocked: false,
      };
    }

    return {
      id: inserted.id,
      appKey: inserted.app_key,
      name: app.name,
      src: app.src,
      isLocked: inserted.is_locked ?? false,
    };
  } catch {
    return {
      id: `local-${appKey}`,
      appKey,
      name: app.name,
      src: app.src,
      isLocked: false,
    };
  }
}
