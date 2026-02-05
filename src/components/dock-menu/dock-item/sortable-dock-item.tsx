"use client";

import Image from "next/image";
import { Tooltip, TooltipContent, TooltipTrigger } from "@shared";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ICON_SIZE, SLOT_HEIGHT } from "@const";
import { getScale } from "@utils";
import type { SortableDockItemProps } from "./types";

export function SortableDockItem({
  item,
  index,
  hoveredIndex,
  onMouseEnter,
  onMouseLeave,
  onImageLoad,
}: SortableDockItemProps) {
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
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className="relative block shrink-0 transition-transform duration-200 ease-out origin-bottom touch-none"
            style={{
              width: ICON_SIZE,
              height: ICON_SIZE,
              transform: `scale(${scale})`,
            }}
          >
            <Image
              src={item.src}
              alt={item.name}
              fill
              className="object-contain drop-shadow-lg pointer-events-none"
              sizes={`${size}px`}
              unoptimized={item.src.endsWith(".png")}
              draggable={false}
              onLoad={onImageLoad}
              onError={onImageLoad}
            />
          </span>
        </TooltipTrigger>
        <TooltipContent side="top">{item.name}</TooltipContent>
      </Tooltip>
    </li>
  );
}
