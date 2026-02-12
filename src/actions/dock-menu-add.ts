"use server";

import { cookies } from "next/headers";
import { createClient } from "@/supabase/server";
// import { APP_CATALOG } from "@/const";
import { APP_CATALOGS } from "@/const";
import type { DockItemView } from "@/types";

export async function addToDock(appKey: string): Promise<DockItemView | null> {
  // const app = APP_CATALOG[appKey];
    const app = APP_CATALOGS[appKey];
  if (!app || appKey === "bin") return null;

  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const existingQuery = supabase
      .from("dock_items")
      .select("id, app_key, is_locked")
      .eq("app_key", appKey)
      .limit(1);
    const { data: existing } = await (user
      ? existingQuery.eq("user_id", user.id)
      : existingQuery.is("user_id", null)
    ).maybeSingle();

    if (existing) {
      return {
        id: existing.id,
        appKey: existing.app_key,
        name: app.name,
        src: app.src,
        isLocked: existing.is_locked ?? false,
      };
    }

    const binQuery = supabase
      .from("dock_items")
      .select("id, position")
      .eq("app_key", "bin")
      .limit(1);
    const { data: binItem } = await (user
      ? binQuery.eq("user_id", user.id)
      : binQuery.is("user_id", null)
    ).maybeSingle();

    let insertPosition = 1;

    if (binItem) {
      const rowsToShiftQuery = supabase
        .from("dock_items")
        .select("id, position")
        .gte("position", binItem.position)
        .order("position", { ascending: false });
      const { data: rowsToShift } = await (user
        ? rowsToShiftQuery.eq("user_id", user.id)
        : rowsToShiftQuery.is("user_id", null)
      );

      for (const row of rowsToShift ?? []) {
        await supabase
          .from("dock_items")
          .update({ position: row.position + 1 })
          .eq("id", row.id);
      }

      insertPosition = binItem.position;
    } else {
      const lastItemQuery = supabase
        .from("dock_items")
        .select("position")
        .order("position", { ascending: false })
        .limit(1);
      const { data: lastItem } = await (user
        ? lastItemQuery.eq("user_id", user.id)
        : lastItemQuery.is("user_id", null)
      ).maybeSingle();

      insertPosition = (lastItem?.position ?? 0) + 1;
    }

    const { data: inserted, error } = await supabase
      .from("dock_items")
      .insert({
        app_key: appKey,
        is_locked: false,
        position: insertPosition,
        user_id: user?.id ?? null,
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
