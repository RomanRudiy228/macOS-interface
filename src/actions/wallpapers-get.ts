"use server";

import { cookies } from "next/headers";
import { createClient } from "@/supabase/server";
import type { Wallpaper } from "@/types/wallpaper.types";

export async function getWallpapers(): Promise<Wallpaper[]> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase
      .from("wallpapers")
      .select("id, name, background_image")
      .order("id", { ascending: true });

    if (error || !data?.length) return [];

    return data.map((row) => ({
      id: row.id,
      name: row.name,
      backgroundImage: row.background_image,
    }));
  } catch {
    return [];
  }
}
