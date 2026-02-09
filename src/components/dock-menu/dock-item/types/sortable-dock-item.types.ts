import type { DockItemView } from "@/types";

export type SortableDockItemProps = {
  item: DockItemView;
  index: number;
  hoveredIndex: number | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  variant?: "default" | "bin";
};
