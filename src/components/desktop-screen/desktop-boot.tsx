"use client";

import { useEffect, useMemo, useState } from "react";
import { ScreenLoader } from "@/components/desktop-screen/screen-loader";
import { DesktopScreen } from "@/components/desktop-screen/desktop-screen";

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

const defaultSettingsFor = (items: Wallpaper[]): DesktopSettings => ({
  wallpaperId: getDefaultWallpaperId(items),
  accent: "214 92% 56%",
  theme: "dark",
});

const normalizeWallpapers = (items?: Wallpaper[]) =>
  Array.isArray(items) && items.length > 0 ? items : fallbackWallpapers;

const hasWallpaper = (wallpaperId: string, items: Wallpaper[]) =>
  items.some((item) => item.id === wallpaperId);

const normalizeSettings = (
  settings: Partial<DesktopSettings> | undefined,
  items: Wallpaper[]
) => {
  const defaults = defaultSettingsFor(items);
  return {
    wallpaperId:
      settings?.wallpaperId && hasWallpaper(settings.wallpaperId, items)
        ? settings.wallpaperId
        : defaults.wallpaperId,
    accent: settings?.accent ?? defaults.accent,
    theme: settings?.theme ?? defaults.theme,
  };
};

export function DesktopBoot() {
  const [settings, setSettings] = useState<DesktopSettings | null>(null);
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>(
    fallbackWallpapers
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadSettings = async () => {
      try {
        const response = await fetch("/api/settings", { cache: "no-store" });
        const payload = await response.json();
        if (!active) return;
        const nextWallpapers = normalizeWallpapers(payload?.wallpapers);
        setWallpapers(nextWallpapers);
        setSettings(normalizeSettings(payload?.settings, nextWallpapers));
      } catch {
        if (!active) return;
        setWallpapers(fallbackWallpapers);
        setSettings(defaultSettingsFor(fallbackWallpapers));
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!settings) return;
    const root = document.documentElement;
    root.style.setProperty("--system-accent", settings.accent);
    root.style.setProperty("--system-accent-foreground", "0 0% 100%");
    root.classList.toggle("dark", settings.theme === "dark");
  }, [settings]);

  const wallpaperId = useMemo(
    () => settings?.wallpaperId ?? getDefaultWallpaperId(wallpapers),
    [settings?.wallpaperId, wallpapers]
  );

  if (isLoading) {
    return <ScreenLoader label="Initializing" />;
  }

  return (
    <DesktopScreen
      wallpaperId={wallpaperId}
      wallpapers={wallpapers}
    />
  );
}
