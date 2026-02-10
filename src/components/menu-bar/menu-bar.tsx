"use client";

import { useState, useEffect } from "react";
import { Wifi, Search } from "lucide-react";
import { formatMacOSTime } from "@/utils/date";
import { MenuBarItem } from "@/components/context-menu/context-menu";
import {
  finderMenuItems,
  fileMenuItems,
  editMenuItems,
  viewMenuItems,
  goMenuItems,
  windowMenuItems,
  helpMenuItems,
} from "@/const/context-const";

export const Menubar = () => {
  const [date, setDate] = useState<Date | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setDate(new Date());
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-9 w-full bg-slate-500/20 backdrop-blur-2xl shadow-sm text-[13px] text-slate-900 flex items-center justify-between px-4 select-none border-b border-white/10">
      <div className="flex items-center gap-4">
        <button className="text-black hover:opacity-70 transition-opacity pb-0.5">
          <svg width="18" height="18" viewBox="0 0 384 512" fill="currentColor">
            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z" />
          </svg>
        </button>

        {/* Finder with Context Menu */}
        <MenuBarItem
          label="Finder"
          items={finderMenuItems}
          className="font-bold text-black cursor-default hover:bg-black/5 px-2 py-0.5 rounded transition-colors"
        >
          Finder
        </MenuBarItem>
        {/* Menu Items with Context Menus */}
        <nav className="hidden md:flex gap-1 font-medium text-black/90">
          <MenuBarItem
            label="File"
            items={fileMenuItems}
            className="hover:bg-black/5 px-3 py-0.5 rounded transition-colors cursor-default"
          >
            File
          </MenuBarItem>

          <MenuBarItem
            label="Edit"
            items={editMenuItems}
            className="hover:bg-black/5 px-3 py-0.5 rounded transition-colors cursor-default"
          >
            Edit
          </MenuBarItem>

          <MenuBarItem
            label="View"
            items={viewMenuItems}
            className="hover:bg-black/5 px-3 py-0.5 rounded transition-colors cursor-default"
          >
            View
          </MenuBarItem>

          <MenuBarItem
            label="Go"
            items={goMenuItems}
            className="hover:bg-black/5 px-3 py-0.5 rounded transition-colors cursor-default"
          >
            Go
          </MenuBarItem>

          <MenuBarItem
            label="Window"
            items={windowMenuItems}
            className="hover:bg-black/5 px-3 py-0.5 rounded transition-colors cursor-default"
          >
            Window
          </MenuBarItem>

          <MenuBarItem
            label="Help"
            items={helpMenuItems}
            className="hover:bg-black/5 px-3 py-0.5 rounded transition-colors cursor-default"
          >
            Help
          </MenuBarItem>
        </nav>
      </div>

      <div className="flex items-center gap-4 text-black/90 font-medium">
        <div className="hidden sm:flex items-center gap-5">
          <Search size={16} strokeWidth={2.5} className="opacity-80" />

          <Wifi size={18} strokeWidth={2.5} className="opacity-80" />

          <div className="opacity-80">
            <svg
              width="24"
              height="12"
              viewBox="0 0 24 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="1"
                y="1"
                width="20"
                height="10"
                rx="2.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M23 4V8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              <rect
                x="3.5"
                y="3.5"
                width="10"
                height="5"
                rx="1"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>

        <button className="hover:bg-black/10 rounded p-0.5 transition-colors opacity-90">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="2"
              y="4"
              width="20"
              height="6"
              rx="3"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <circle cx="7" cy="7" r="2" fill="currentColor" />
            <rect
              x="2"
              y="14"
              width="20"
              height="6"
              rx="3"
              fill="currentColor"
            />
            <circle cx="17" cy="17" r="2" fill="white" />{" "}
          </svg>
        </button>

        <div className="min-w-[140px] text-right font-semibold text-[12.5px]">
          {isMounted && date ? (
            <span>{formatMacOSTime(date)}</span>
          ) : (
            <span className="opacity-0">Loading...</span>
          )}
        </div>
      </div>
    </header>
  );
};
