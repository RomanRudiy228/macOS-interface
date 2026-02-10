"use server";

import { cookies } from "next/headers";
import { createClient } from "@/supabase/server";

export async function getSettings(): Promise<{
  wallpaperId: string | null;
}> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase
      .from("settings")
      .select("wallpaper_id")
      .limit(1)
      .maybeSingle();

    if (error || !data) return { wallpaperId: null };
    return { wallpaperId: data.wallpaper_id ?? null };
  } catch {
    return { wallpaperId: null };
  }
}
