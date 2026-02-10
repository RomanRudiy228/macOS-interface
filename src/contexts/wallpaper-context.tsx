"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  defaultWallpaperId,
  wallpapers,
} from "@/const/wallpapers.const";

import { getWallpaperById } from "@/utils/get-wallpaper";

import { WallpaperContextValue } from "@/types/wallpaper.types";

const WallpaperContext = createContext<WallpaperContextValue | null>(null);

export const WallpaperProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedWallpaperId, setSelectedWallpaperIdState] =
    useState(defaultWallpaperId);

  const setSelectedWallpaperId = useCallback((id: string) => {
    setSelectedWallpaperIdState(id);
  }, []);

  const selectedWallpaper = useMemo(
    () => getWallpaperById(selectedWallpaperId),
    [selectedWallpaperId]
  );

  const value: WallpaperContextValue = useMemo(
    () => ({
      selectedWallpaperId,
      selectedWallpaper:
        selectedWallpaper ??
        getWallpaperById(defaultWallpaperId) ??
        wallpapers[0],
      setSelectedWallpaperId,
    }),
    [selectedWallpaperId, selectedWallpaper, setSelectedWallpaperId]
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
