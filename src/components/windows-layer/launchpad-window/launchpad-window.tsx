"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";

export type LaunchpadApp = {
  id: string;
  name: string;
  src: string;
};

type LaunchpadWindowProps = {
  isActive: boolean;
  onFocus: () => void;
  onDismiss: () => void;
  apps: LaunchpadApp[];
};

export const LaunchpadWindow: React.FC<LaunchpadWindowProps> = ({
  isActive,
  onFocus,
  onDismiss,
  apps,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter out launchpad and bin from the apps list
  const launchpadApps = useMemo(
    () =>
      apps.filter((app) => app.id !== "launchpad" && app.id !== "bin"),
    [apps]
  );

  const filteredApps = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return launchpadApps;

    return launchpadApps.filter(
      (app) =>
        app.name.toLowerCase().includes(query) ||
        app.id.toLowerCase().includes(query)
    );
  }, [searchQuery, launchpadApps]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (searchQuery) {
          setSearchQuery("");
          return;
        }

        onDismiss();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onDismiss, searchQuery]);

  return (
    <section
      className={`launchpad-overlay fixed inset-x-0 top-9 bottom-0 z-[60] overflow-hidden ${isActive ? "z-[61]" : "z-[60]"}`}
      onMouseDown={onDismiss}
      onClick={onFocus}
      aria-label="Launchpad"
      role="dialog"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(236,244,255,0.42),_rgba(120,140,170,0.35)_35%,_rgba(30,37,52,0.5)_95%)] backdrop-blur-[28px]" />

      <div
        className="relative mx-auto flex h-full w-full max-w-[1160px] flex-col px-5 pb-28 pt-12 sm:px-8 sm:pt-14"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-10 w-full max-w-md">
          <label className="relative block">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-white/80"
            />
            <input
              type="search"
              placeholder="Search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="launchpad-search-input h-11 w-full rounded-xl border border-white/30 bg-black/25 pl-10 pr-10 text-sm font-semibold text-white caret-white outline-none backdrop-blur-xl placeholder:text-center placeholder:text-white/75 focus:border-white/55 focus:ring-2 focus:ring-white/25"
              aria-label="Search apps"
            />
          </label>
        </div>

        <div
          className="flex-1 overflow-y-auto overscroll-contain"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <ul className="mx-auto grid max-w-[1040px] grid-cols-4 gap-x-8 gap-y-8 pb-6 sm:grid-cols-5 lg:grid-cols-6">
            {filteredApps.map((app, index) => (
              <li
                key={app.id}
                className="launchpad-app-item"
                style={{ animationDelay: `${30 + index * 18}ms` }}
              >
                <button
                  type="button"
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData(
                      "application/x-macos-app-key",
                      app.id
                    );
                    event.dataTransfer.setData("text/plain", app.id);
                    event.dataTransfer.effectAllowed = "copy";
                  }}
                  className="flex w-full flex-col items-center gap-2.5 rounded-2xl p-2 transition-colors hover:bg-white/10 active:scale-[0.98]"
                >
                  <span className="relative flex h-20 w-20 items-center justify-center rounded-[20px] shadow-[0_14px_30px_rgba(7,11,19,0.42)] ring-1 ring-white/22">
                    <Image
                      src={app.src}
                      alt={app.name}
                      width={80}
                      height={80}
                      unoptimized={app.src.endsWith(".png")}
                      draggable={false}
                      className="h-20 w-20 rounded-[20px]"
                    />
                  </span>
                  <span
                    className="max-w-full truncate text-center text-[12px] font-semibold leading-tight text-white/95"
                    style={{ textShadow: "0 1px 10px rgba(0,0,0,0.45)" }}
                  >
                    {app.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          {!filteredApps.length && (
            <p className="mt-16 text-center text-sm font-medium text-white/75">
              No apps found for &quot;{searchQuery.trim()}&quot;.
            </p>
          )}
        </div>

        <div className="pointer-events-none mt-6 flex items-center justify-center gap-2">
          <span className="h-1.5 w-5 rounded-full bg-white/85" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/45" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/45" />
        </div>
      </div>
    </section>
  );
};
