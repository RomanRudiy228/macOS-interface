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
  className = "" 
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
        className={`${className} ${
          isOpen ? "bg-black/10" : ""
        }`}
      >
        {children || label}
      </button>
      
      {isOpen && (
        <ContextMenu 
          items={items} 
          onClose={() => setIsOpen(false)} 
        />
      )}
    </div>
  );
};

// -----------------------------------------------------------
// ContextMenu Component
// -----------------------------------------------------------
export const ContextMenu = ({ 
  items, 
  onClose 
}: { 
  items: MenuItem[]; 
  onClose: () => void;
}) => {
  return (
    <div className="absolute left-0 top-[calc(100%+2px)] z-[100] min-w-[220px] rounded-[10px] border border-white/10 bg-slate-800/90 p-[5px] shadow-[0_2px_4px_rgba(0,0,0,0.2),0_10px_30px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[24px]">
      {items.map((item, i) => {
        if (item.isDivider) {
          return (
            <div
              key={`divider-${i}`}
              className="mx-[14px] my-1 h-px bg-white/10"
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
      className={`mx-[5px] my-[1px] flex select-none items-center justify-between rounded-md px-[11px] py-[5px] transition-colors duration-100 ${
        item.disabled ? "cursor-default" : "cursor-pointer"
      }`}
      style={{
        backgroundColor: hovered ? "rgba(59, 130, 246, 0.82)" : "transparent",
      }}
    >
      <span
        className={`text-[13.5px] font-normal tracking-[0.15px] ${
          item.disabled ? "text-white/30" : "text-white"
        }`}
      >
        {item.label}
      </span>
      {item.shortcut && (
        <span
          className={`ml-7 text-xs font-light tracking-[0.3px] ${
            item.disabled ? "text-white/25" : "text-white/45"
          }`}
        >
          {item.shortcut}
        </span>
      )}
    </div>
  );
};