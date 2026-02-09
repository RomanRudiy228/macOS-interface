"use client";

import React, { useCallback, useState } from "react";
import { useAppWindowDrag, useWindowMinimizeTransition } from "@/hooks";
import type { AppWindowProps } from "@/types";

export const AppWindow: React.FC<AppWindowProps> = ({
  title,
  onClose,
  onMinimize,
  isActive,
  onFocus,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMinimizing, setIsMinimizing] = useState(false);

  const { dragOffset, handleTitleMouseDown } = useAppWindowDrag(onFocus);
  const handleMinimizeTransitionEnd = useWindowMinimizeTransition(
    isMinimizing,
    onMinimize
  );

  const handleMinimize = useCallback(() => {
    requestAnimationFrame(() => {
      setIsMinimizing(true);
    });
  }, []);

  return (
    <div
      role="dialog"
      aria-label={`${title} window`}
      className={`app-window fixed left-1/2 top-1/2 flex max-h-[90vh] flex-col overflow-hidden rounded-xl border border-white/20 bg-slate-800/95 shadow-2xl backdrop-blur-xl ${isActive ? "z-40" : "z-[39]"} ${isCollapsed ? "w-[min(90vw,280px)] min-h-0" : "w-[min(90vw,720px)] min-h-[520px]"} ${isMinimizing ? "app-window--minimizing" : ""}`}
      style={
        {
          "--app-window-dx": `${dragOffset.x}px`,
          "--app-window-dy": `${dragOffset.y}px`,
        } as React.CSSProperties
      }
      onClick={onFocus}
      onMouseDown={onFocus}
      onTransitionEnd={handleMinimizeTransitionEnd}
    >
      <div className="flex h-full w-full min-h-full flex-col overflow-hidden rounded-xl">
        <div
          className={`flex shrink-0 cursor-grab active:cursor-grabbing items-center gap-3 border-white/10 bg-slate-800/80 px-3 py-2 select-none transition-[border-radius,border-color] duration-200 ${isCollapsed ? "rounded-xl" : "rounded-t-xl border-b"}`}
          onMouseDown={handleTitleMouseDown}
        >
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Close"
              className="h-3 w-3 rounded-full bg-[#ff5f57] transition-opacity duration-200 hover:opacity-90"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            />
            <button
              type="button"
              aria-label="Minimize"
              className="h-3 w-3 rounded-full bg-[#febc2e] transition-opacity duration-200 hover:opacity-90"
              onClick={(e) => {
                e.stopPropagation();
                handleMinimize();
              }}
            />
            <button
              type="button"
              aria-label={isCollapsed ? "Expand" : "Minimize"}
              className="h-3 w-3 rounded-full bg-[#28c840] transition-opacity duration-200 hover:opacity-90"
              onClick={(e) => {
                e.stopPropagation();
                setIsCollapsed((prev) => !prev);
              }}
            />
          </div>
          <span className="flex-1 text-center text-[13px] font-medium text-slate-200 select-none">
            {title}
          </span>
          <div className="w-[52px]" aria-hidden />
        </div>

        {!isCollapsed && (
          <div className="flex-1 min-h-[460px] overflow-auto rounded-b-xl bg-slate-900/50 transition-[min-height,opacity] duration-200" />
        )}
      </div>
    </div>
  );
};
