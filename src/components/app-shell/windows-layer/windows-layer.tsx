"use client";

import React from "react";
import { AppWindow } from "@/components/app-shell/windows-layer/app-window";
import { useWindows } from "@/contexts";

export const WindowsLayer: React.FC = () => {
  const {
    openWindows,
    activeWindowId,
    closeWindow,
    minimizeWindow,
    setActiveWindow,
  } = useWindows();

  return (
    <>
      {openWindows
        .filter((w) => !w.isMinimized)
        .map((w) => (
          <AppWindow
            key={w.id}
            title={w.title}
            isActive={activeWindowId === w.id}
            onFocus={() => setActiveWindow(w.id)}
            onClose={() => closeWindow(w.id)}
            onMinimize={() => minimizeWindow(w.id)}
          />
        ))}
    </>
  );
};
