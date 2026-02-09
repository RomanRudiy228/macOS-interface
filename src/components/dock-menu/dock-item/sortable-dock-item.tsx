"use client";

import React from "react";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ICON_SIZE, SLOT_HEIGHT } from "@/const";
import { getScale } from "@/utils";
import type { SortableDockItemProps } from "./types";

function DockItemContent({
  item,
  scale,
  className,
}: {
  item: SortableDockItemProps["item"];
  scale: number;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={className}
          style={{
            width: ICON_SIZE,
            height: ICON_SIZE,
            transform: `scale(${scale})`,
          }}
        >
          <Image
            src={item.src}
            alt={item.name}
            width={ICON_SIZE}
            height={ICON_SIZE}
            unoptimized={item.src.endsWith(".png")}
            draggable={false}
          />
        </span>
      </TooltipTrigger>
      <TooltipContent side="top">{item.name}</TooltipContent>
    </Tooltip>
  );
}

const SortableDockItemInner: React.FC<
  SortableDockItemProps & { variant: "default" }
> = ({ item, index, hoveredIndex, onMouseEnter, onMouseLeave }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const scale = getScale(hoveredIndex, index);
  const size = Math.ceil(ICON_SIZE * scale);

  const style = {
    minWidth: size,
    height: SLOT_HEIGHT,
    transform: CSS.Transform.toString(transform),
    transition: isDragging
      ? transition
      : "min-width 200ms ease-out, transform 200ms ease-out",
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex flex-col cursor-default items-center justify-end transition-all duration-200 ease-out origin-bottom"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...attributes}
      {...listeners}
    >
      <DockItemContent
        item={item}
        scale={scale}
        className="relative block shrink-0 transition-transform duration-200 ease-out origin-bottom touch-none"
      />
    </li>
  );
};

const BinDockItem: React.FC<SortableDockItemProps & { variant: "bin" }> = ({
  item,
  index,
  hoveredIndex,
  onMouseEnter,
  onMouseLeave,
}) => {
  const scale = getScale(hoveredIndex, index);
  const size = Math.ceil(ICON_SIZE * scale);

  return (
    <li
      className="flex flex-col cursor-default items-center justify-end transition-all duration-200 ease-out origin-bottom"
      style={{ minWidth: size, height: SLOT_HEIGHT }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <DockItemContent
        item={item}
        scale={scale}
        className="relative block shrink-0 transition-transform duration-200 ease-out origin-bottom"
      />
    </li>
  );
};

export const SortableDockItem: React.FC<SortableDockItemProps> = (props) => {
  if (props.variant === "bin") {
    return <BinDockItem {...props} variant="bin" />;
  }
  return <SortableDockItemInner {...props} variant="default" />;
};
