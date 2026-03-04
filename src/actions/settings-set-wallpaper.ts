"use server";

import { cookies } from "next/headers";
import { createClient } from "@/supabase/server";

export async function setWallpaperId(wallpaperId: string): Promise<void> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: row } = await supabase
      .from("settings")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!row) {
      await supabase
        .from("settings")
        .insert({
          user_id: user.id,
          wallpaper_id: wallpaperId,
          theme: "dark",
          system_color: "blue",
        });
      return;
    }

    await supabase.from("settings").update({ wallpaper_id: wallpaperId }).eq("id", row.id);
  } catch {
    // ignore
  }
}
