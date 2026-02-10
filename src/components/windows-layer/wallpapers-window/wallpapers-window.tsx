"use client";

import React from "react";
import { useWallpaper } from "@/contexts";
import { wallpapers } from "@/const/wallpapers.const";

export const WallpapersWindow: React.FC = () => {
  const { selectedWallpaper, setSelectedWallpaperId } = useWallpaper();

  return (
    <div className="flex flex-col gap-6 p-6">
      <section className="flex flex-col gap-3">
        <div
          className="h-48 w-full overflow-hidden rounded-xl bg-slate-100"
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

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-slate-900">Wallpapers</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {wallpapers.map((wallpaper) => (
            <button
              key={wallpaper.id}
              type="button"
              onClick={() => setSelectedWallpaperId(wallpaper.id)}
              className="flex shrink-0 flex-col items-center gap-2 rounded-lg p-1 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              <div
                className="h-20 w-28 overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                style={{
                  backgroundImage: wallpaper.backgroundImage,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <span className="max-w-[7rem] truncate text-center text-xs text-slate-600">
                {wallpaper.name}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
