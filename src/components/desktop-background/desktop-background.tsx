"use client";

import React from "react";
import { useWallpaper } from "@/contexts";

export const DesktopBackground: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { selectedWallpaper } = useWallpaper();
  const style: React.CSSProperties = {
    backgroundImage: selectedWallpaper?.backgroundImage ?? undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
  };

  return <div className="min-h-screen" style={style}>{children}</div>;
};
