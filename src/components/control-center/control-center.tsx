"use client";
import React, { useState } from "react";
import { useSystemSettings } from "@/hooks/use-system-settings";
import { useWallpaper } from "@/contexts";
import { useWindows } from "@/contexts";
import { Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/popover/popover";
import { cn } from "@/utils/theme-utilis";

const WALLPAPERS_WINDOW_ID = "wallpapers";
const WALLPAPERS_WINDOW_TITLE = "Wallpapers";

export const ControlCenter = ({ children }: { children: React.ReactNode }) => {
  const { theme, activeColor, colors, isLoading, toggleTheme, changeColor } =
    useSystemSettings();
  const { selectedWallpaper } = useWallpaper();
  const { openWindow } = useWindows();
  const [open, setOpen] = useState(false);

  const isDarkMode = theme === "dark";
  const loadingCircles = [1, 2, 3, 4, 5, 6, 7];

  const handleOpenWallpapers = () => {
    openWindow(WALLPAPERS_WINDOW_ID, WALLPAPERS_WINDOW_TITLE);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={15}
        className={cn(
          "w-80 p-2.5 rounded-[22px] border-0 shadow-2xl mr-2",
          "bg-white/60 dark:bg-black/40 backdrop-blur-3xl shadow-black/20"
        )}
      >
        <div className="flex flex-col gap-3 select-none">
          <button
            onClick={() => toggleTheme(!isDarkMode)}
            className={cn(
              "flex items-center justify-center gap-3 p-4 h-[70px] rounded-[18px] transition-all duration-200 w-full shadow-sm active:scale-[0.98]",
              "bg-white/50 dark:bg-gray-600/40 border border-white/40 dark:border-gray-500/30 hover:bg-white/80 dark:hover:bg-gray-600/60"
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors",
                isDarkMode ? "bg-transparent" : "bg-black/5"
              )}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-500"
                style={{
                  transform: isDarkMode ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22V2Z"
                  fill={isDarkMode ? "#FFFFFF" : "#3A3A3A"}
                />
                <path
                  d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22V2Z"
                  fill={isDarkMode ? "#4A4A4A" : "#FFFFFF"}
                />
                <path
                  d="M12 7C9.24 7 7 9.24 7 12C7 14.76 9.24 17 12 17V7Z"
                  fill={isDarkMode ? "#4A4A4A" : "#FFFFFF"}
                />
                <path
                  d="M12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17V7Z"
                  fill={isDarkMode ? "#FFFFFF" : "#3A3A3A"}
                />
              </svg>
            </div>

            <span className="font-bold text-[15px] tracking-wide text-slate-800 dark:text-white">
              Dark mode
            </span>
          </button>

          <div
            className={cn(
              "flex flex-col gap-3 p-4 rounded-[18px]",
              "bg-white/50 dark:bg-gray-600/40 border border-white/40 dark:border-gray-500/30 shadow-sm"
            )}
          >
            <span className="text-[13px] font-semibold text-slate-800 dark:text-white ml-1 opacity-90">
              System Color
            </span>

            <div className="flex flex-wrap gap-3 items-center">
              {isLoading
                ? loadingCircles.map((i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full bg-gray-400/30 animate-pulse"
                    />
                  ))
                : colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => changeColor(color.id)}
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-sm",
                        color.css,
                        activeColor === color.id &&
                          "ring-2 ring-white/50 dark:ring-black/20"
                      )}
                    >
                      {activeColor === color.id && (
                        <Check
                          size={12}
                          strokeWidth={4}
                          className="text-white drop-shadow-md"
                        />
                      )}
                    </button>
                  ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenWallpapers}
            className={cn(
              "group flex items-center gap-4 p-3 h-[72px] rounded-[18px] transition-all w-full text-left",
              "bg-white/50 dark:bg-gray-600/40 border border-white/40 dark:border-gray-500/30 shadow-sm",
              "hover:bg-white/80 dark:hover:bg-gray-600/60 active:scale-[0.98]"
            )}
          >
            <div
              className="w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-sm bg-gray-300"
              style={{
                backgroundImage: selectedWallpaper?.backgroundImage,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            <div className="flex flex-col justify-center min-w-0">
              <span className="text-[14px] font-semibold text-slate-800 dark:text-white leading-tight">
                Wallpaper
              </span>
              <span className="text-[12px] text-slate-500 dark:text-slate-300 leading-tight opacity-80 mt-0.5 truncate">
                {selectedWallpaper?.name ?? "Dynamic Wallpaper"}
              </span>
            </div>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
