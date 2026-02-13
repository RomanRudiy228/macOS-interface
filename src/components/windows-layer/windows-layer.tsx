"use client";

import React, { useEffect, useState } from "react";
import { AppWindow } from "@/components/windows-layer/app-window";
import { WallpapersWindow } from "@/components/windows-layer/wallpapers-window";
import { LaunchpadWindow } from "@/components/windows-layer/launchpad-window";
import { useWindows } from "@/contexts";
import { getApps } from "@/actions";
import type { LaunchpadApp } from "@/components/windows-layer/launchpad-window/launchpad-window";

const WINDOW_CONTENT: Record<
  string,
  React.ReactNode
> = {
  settings: <WallpapersWindow />,
  wallpapers: <WallpapersWindow />,
};

export const WindowsLayer: React.FC = () => {
  const {
    openWindows,
    activeWindowId,
    closeWindow,
    minimizeWindow,
    setActiveWindow,
  } = useWindows();

  const [launchpadApps, setLaunchpadApps] = useState<LaunchpadApp[]>([]);

  useEffect(() => {
    const loadApps = async () => {
      const apps = await getApps();
      const appsList: LaunchpadApp[] = Object.entries(apps).map(
        ([key, app]) => ({
          id: key,
          name: app.name,
          src: app.src,
        })
      );
      setLaunchpadApps(appsList);
    };

    loadApps();
  }, []);

  return (
    <>
      {openWindows
        .filter((w) => !w.isMinimized)
        .map((w) => {
          if (w.id === "launchpad") {
            return (
              <LaunchpadWindow
                key={w.id}
                isActive={activeWindowId === w.id}
                onFocus={() => setActiveWindow(w.id)}
                onDismiss={() => minimizeWindow(w.id)}
                apps={launchpadApps}
              />
            );
          }

          return (
            <AppWindow
              key={w.id}
              title={w.title}
              isActive={activeWindowId === w.id}
              onFocus={() => setActiveWindow(w.id)}
              onClose={() => closeWindow(w.id)}
              onMinimize={() => minimizeWindow(w.id)}
            >
              {WINDOW_CONTENT[w.id]}
            </AppWindow>
          );
        })}
    </>
  );
};
