"use client";

import React from "react";
import { WindowsProvider } from "@/contexts";
import { WindowsLayer } from "@/components/windows-layer";

export type AppShellProps = {
  children: React.ReactNode;
};

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <WindowsProvider>
      {children}
      <WindowsLayer />
    </WindowsProvider>
  );
};
