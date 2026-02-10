"use server";

import { cookies } from "next/headers";
import { createClient } from "@/supabase/server";

export async function setWallpaperId(wallpaperId: string): Promise<void> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: row } = await supabase
      .from("settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (!row) return;

    await supabase.from("settings").update({ wallpaper_id: wallpaperId }).eq("id", row.id);
  } catch {
    // ignore
  }
}
