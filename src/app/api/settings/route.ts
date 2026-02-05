import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/supabase/server";
import { defaultWallpaperId } from "@/shared/data/wallpapers";

type ThemeMode = "light" | "dark";

type DesktopSettings = {
  wallpaperId: string;
  accent: string;
  theme: ThemeMode;
};

type DesktopSettingsRow = {
  wallpaper_id: string | null;
  accent_hsl: string | null;
  theme: string | null;
};

const defaultSettings: DesktopSettings = {
  wallpaperId: defaultWallpaperId,
  accent: "214 92% 56%",
  theme: "dark",
};

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  let settings = defaultSettings;

  const { data: userResult } = await supabase.auth.getUser();
  const user = userResult?.user;

  if (user) {
    const { data, error } = await supabase
      .from("settings")
      .select("wallpaper_id, accent_hsl, theme")
      .eq("user_id", user.id)
      .maybeSingle();

    const row = data as DesktopSettingsRow | null;

    if (!error && row) {
      settings = {
        wallpaperId: row.wallpaper_id ?? defaultSettings.wallpaperId,
        accent: row.accent_hsl ?? defaultSettings.accent,
        theme: (row.theme as ThemeMode) ?? defaultSettings.theme,
      };
    }
  } else {
    const { data, error } = await supabase
      .from("desktop_defaults")
      .select("wallpaper_id, accent_hsl, theme")
      .maybeSingle();

    const row = data as DesktopSettingsRow | null;

    if (!error && row) {
      settings = {
        wallpaperId: row.wallpaper_id ?? defaultSettings.wallpaperId,
        accent: row.accent_hsl ?? defaultSettings.accent,
        theme: (row.theme as ThemeMode) ?? defaultSettings.theme,
      };
    }
  }

  return NextResponse.json({ settings });
}
