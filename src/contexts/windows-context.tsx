"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import type { OpenWindow, WindowsContextValue } from "@/types";

const WindowsContext = createContext<WindowsContextValue | null>(null);

export const WindowsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);

  const openWindow = useCallback((id: string, title: string) => {
    setOpenWindows((prev) => {
      if (prev.some((w) => w.id === id)) return prev;
      return [...prev, { id, title, isMinimized: false }];
    });
    setActiveWindowId(id);
  }, []);

  const closeWindow = useCallback((id: string) => {
    setOpenWindows((prev) => prev.filter((w) => w.id !== id));
    setActiveWindowId((current) => (current === id ? null : current));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
    setActiveWindowId((current) => (current === id ? null : current));
  }, []);

  const restoreWindow = useCallback((id: string) => {
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: false } : w))
    );
    setActiveWindowId(id);
  }, []);

  const isOpen = useCallback(
    (id: string) => openWindows.some((w) => w.id === id),
    [openWindows]
  );

  const isActive = useCallback(
    (id: string) => activeWindowId === id,
    [activeWindowId]
  );

  const isMinimized = useCallback(
    (id: string) =>
      openWindows.some((w) => w.id === id && w.isMinimized),
    [openWindows]
  );

  const value: WindowsContextValue = {
    openWindows,
    activeWindowId,
    openWindow,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    setActiveWindow: setActiveWindowId,
    isOpen,
    isActive,
    isMinimized,
  };

  return (
    <WindowsContext.Provider value={value}>{children}</WindowsContext.Provider>
  );
};

export function useWindows() {
  const ctx = useContext(WindowsContext);
  if (!ctx) throw new Error("useWindows must be used within WindowsProvider");
  return ctx;
}
