"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { setWallpaperId as setWallpaperIdAction } from "@/actions/settings-set-wallpaper";
import {
  defaultWallpaperId,
  wallpapers as fallbackWallpapers,
} from "@/const/wallpapers.const";
import type { Wallpaper } from "@/types/wallpaper.types";
import type { WallpaperContextValue } from "@/types/wallpaper.types";

const WallpaperContext = createContext<WallpaperContextValue | null>(null);

type WallpaperProviderProps = {
  children: React.ReactNode;
  initialWallpapers: Wallpaper[];
  initialWallpaperId: string | null;
};

export const WallpaperProvider: React.FC<WallpaperProviderProps> = ({
  children,
  initialWallpapers,
  initialWallpaperId,
}) => {
  const [selectedWallpaperId, setSelectedWallpaperIdState] = useState(
    () => initialWallpaperId ?? defaultWallpaperId
  );

  const setSelectedWallpaperId = useCallback((id: string) => {
    setSelectedWallpaperIdState(id);
    setWallpaperIdAction(id);
  }, []);

  const wallpapers =
    initialWallpapers.length > 0 ? initialWallpapers : fallbackWallpapers;
  const selectedWallpaper = useMemo(
    () => wallpapers.find((w) => w.id === selectedWallpaperId),
    [wallpapers, selectedWallpaperId]
  );

  const value: WallpaperContextValue = useMemo(
    () => ({
      wallpapers,
      selectedWallpaperId,
      selectedWallpaper:
        selectedWallpaper ??
        wallpapers.find((w) => w.id === defaultWallpaperId) ??
        wallpapers[0],
      setSelectedWallpaperId,
    }),
    [wallpapers, selectedWallpaperId, selectedWallpaper, setSelectedWallpaperId]
  );

  return (
    <WallpaperContext.Provider value={value}>
      {children}
    </WallpaperContext.Provider>
  );
};

export function useWallpaper() {
  const ctx = useContext(WallpaperContext);
  if (!ctx)
    throw new Error("useWallpaper must be used within WallpaperProvider");
  return ctx;
}
