"use client";

import { useState, useEffect, useRef, ReactNode } from "react";

// -----------------------------------------------------------
// Types
// -----------------------------------------------------------
export interface MenuItem {
  label: string;
  shortcut?: string;
  disabled?: boolean;
  isDivider?: boolean;
  onClick?: () => void;
}

interface MenuBarItemProps {
  label: string;
  items: MenuItem[];
  children?: ReactNode;
  className?: string;
}

// -----------------------------------------------------------
// MenuBarItem with integrated ContextMenu
// -----------------------------------------------------------
export const MenuBarItem = ({
  label,
  items,
  children,
  className = "",
}: MenuBarItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (itemRef.current && !itemRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handler);
    }
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  return (
    <div ref={itemRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${className} transition-colors ${
          isOpen
            ? "bg-[hsl(var(--primary)/0.2)] dark:bg-[hsl(var(--primary)/0.3)]"
            : ""
        }`}
      >
        {children || label}
      </button>

      {isOpen && <ContextMenu items={items} onClose={() => setIsOpen(false)} />}
    </div>
  );
};

// -----------------------------------------------------------
// ContextMenu Component
// -----------------------------------------------------------
export const ContextMenu = ({
  items,
  onClose,
}: {
  items: MenuItem[];
  onClose: () => void;
}) => {
  return (
    <div className="absolute left-0 top-[calc(100%+2px)] z-[100] min-w-[220px] rounded-[10px] border border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-800/90 p-[5px] shadow-[0_10px_30px_rgba(0,0,0,0.3)] backdrop-blur-[30px]">
      {items.map((item, i) => {
        if (item.isDivider) {
          return (
            <div
              key={`divider-${i}`}
              className="mx-[14px] my-1 h-px bg-black/5 dark:bg-white/10"
            />
          );
        }
        return (
          <ContextMenuItem
            key={`${item.label}-${i}`}
            item={item}
            onClose={onClose}
          />
        );
      })}
    </div>
  );
};

// -----------------------------------------------------------
// ContextMenuItem Component
// -----------------------------------------------------------
const ContextMenuItem = ({
  item,
  onClose,
}: {
  item: MenuItem;
  onClose: () => void;
}) => {
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    if (item.disabled) return;
    if (item.onClick) {
      item.onClick();
    }
    onClose();
  };

  return (
    <div
      onMouseEnter={() => !item.disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      className={`mx-[5px] my-[1px] flex select-none items-center justify-between rounded-md px-[11px] py-[5px] transition-colors duration-75 ${
        item.disabled ? "cursor-default" : "cursor-pointer"
      } ${hovered ? "bg-primary text-white" : "bg-transparent"}`}
    >
      <span
        className={`text-[13.5px] font-normal tracking-[0.15px] ${
          item.disabled
            ? "text-black/30 dark:text-white/30"
            : hovered
              ? "text-white"
              : "text-black dark:text-white"
        }`}
      >
        {item.label}
      </span>
      {item.shortcut && (
        <span
          className={`ml-7 text-xs font-light tracking-[0.3px] ${
            item.disabled
              ? "text-black/20 dark:text-white/25"
              : hovered
                ? "text-white/90"
                : "text-black/40 dark:text-white/45"
          }`}
        >
          {item.shortcut}
        </span>
      )}
    </div>
  );
};
