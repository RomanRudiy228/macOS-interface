"use client";

import { useEffect, useMemo, useState } from "react";
import { ScreenLoader } from "@/shared/components/ui/screen-loader";
import {
  defaultWallpaperId,
  wallpapers,
} from "@/shared/data/wallpapers";
import { DesktopScreen } from "@/shared/components/ui/desktop-screen";

type ThemeMode = "light" | "dark";

type DesktopSettings = {
  wallpaperId: string;
  accent: string;
  theme: ThemeMode;
};

const defaultSettings: DesktopSettings = {
  wallpaperId: defaultWallpaperId,
  accent: "214 92% 56%",
  theme: "dark",
};

const hasWallpaper = (wallpaperId: string) =>
  wallpapers.some((item) => item.id === wallpaperId);

const normalizeSettings = (settings?: Partial<DesktopSettings>) => ({
  wallpaperId:
    settings?.wallpaperId && hasWallpaper(settings.wallpaperId)
      ? settings.wallpaperId
      : defaultSettings.wallpaperId,
  accent: settings?.accent ?? defaultSettings.accent,
  theme: settings?.theme ?? defaultSettings.theme,
});

export function DesktopBoot() {
  const [settings, setSettings] = useState<DesktopSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  useEffect(() => {
    let active = true;

    const loadSettings = async () => {
      try {
        const response = await fetch("/api/settings", { cache: "no-store" });
        const payload = await response.json();
        if (!active) return;
        setSettings(normalizeSettings(payload?.settings));
      } catch {
        if (!active) return;
        setSettings(defaultSettings);
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
    () => settings?.wallpaperId ?? defaultSettings.wallpaperId,
    [settings?.wallpaperId]
  );

  if (isLoading) {
    return <ScreenLoader label="Initializing" />;
  }

  const handleWallpaperSelect = (nextId: string) => {
    setSettings((current) => {
      if (!current) return { ...defaultSettings, wallpaperId: nextId };
      return { ...current, wallpaperId: nextId };
    });
  };

  return (
    <DesktopScreen
      wallpaperId={wallpaperId}
      onWallpaperSelect={handleWallpaperSelect}
      isPickerOpen={isPickerOpen}
      onTogglePicker={() => setIsPickerOpen((open) => !open)}
    />
  );
}
