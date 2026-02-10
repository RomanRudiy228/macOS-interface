import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/supabase/server";

type ThemeMode = "light" | "dark";

type Wallpaper = {
  id: string;
  name: string;
  backgroundImage: string;
};

type DesktopSettings = {
  wallpaperId: string;
  accent: string;
  theme: ThemeMode;
};

type DesktopSettingsRow = {
  wallpaper_id: string | null;
  system_color: string | null;
  theme: string | null;
};

const fallbackWallpapers: Wallpaper[] = [
  {
    id: "sierra-dusk",
    name: "Sierra Dusk",
    backgroundImage:
      "linear-gradient(140deg, #0f172a 0%, #1e293b 35%, #0f766e 70%, #22c55e 100%)",
  },
];

const getDefaultWallpaperId = (items: Wallpaper[]) =>
  items[0]?.id ?? "sierra-dusk";

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: wallpapersData } = await supabase
    .from("wallpapers" as unknown as never)
    .select("id, name, background_image")
    .order("name", { ascending: true });

  const wallpapers: Wallpaper[] =
    (wallpapersData as Array<{
      id: string;
      name: string;
      background_image: string;
    }> | null)?.map((item) => ({
      id: item.id,
      name: item.name,
      backgroundImage: item.background_image,
    })) ?? fallbackWallpapers;

  const defaultSettings: DesktopSettings = {
    wallpaperId: getDefaultWallpaperId(wallpapers),
    accent: "214 92% 56%",
    theme: "dark",
  };

  let settings = defaultSettings;

  const { data, error } = await supabase
    .from("settings" as unknown as never)
    .select("wallpaper_id, system_color, theme")
    .maybeSingle();

  const row = data as DesktopSettingsRow | null;

  if (!error && row) {
    settings = {
      wallpaperId: row.wallpaper_id ?? defaultSettings.wallpaperId,
      accent: row.system_color ?? defaultSettings.accent,
      theme: (row.theme as ThemeMode) ?? defaultSettings.theme,
    };
  }

  return NextResponse.json({ settings, wallpapers });
}
