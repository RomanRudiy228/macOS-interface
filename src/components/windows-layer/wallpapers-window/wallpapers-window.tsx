"use client";

import React from "react";
import { useWallpaper } from "@/contexts";

export const WallpapersWindow: React.FC = () => {
  const { wallpapers, selectedWallpaper, setSelectedWallpaperId } = useWallpaper();

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-12 overflow-y-auto p-4">
      <section className="flex flex-col gap-3 mx-auto w-full max-w-md">
        <div
          className="h-72 w-full overflow-hidden rounded-xl bg-slate-100"
          style={{
            backgroundImage: selectedWallpaper?.backgroundImage,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div>
          <p className="text-lg font-semibold text-slate-900">
            {selectedWallpaper?.name ?? "Wallpaper"}
          </p>
          <p className="text-sm text-slate-500">Wallpaper</p>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-slate-900">Wallpapers</h2>
        <div className="grid grid-cols-4 gap-3">
          {wallpapers.map((wallpaper) => (
            <button
              key={wallpaper.id}
              type="button"
              onClick={() => setSelectedWallpaperId(wallpaper.id)}
              className="flex w-full flex-col items-center gap-1 rounded-lg p-0 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              <div
                className="w-full aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                style={{
                  backgroundImage: wallpaper.backgroundImage,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <span className="w-full truncate text-center text-xs text-slate-600">
                {wallpaper.name}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
