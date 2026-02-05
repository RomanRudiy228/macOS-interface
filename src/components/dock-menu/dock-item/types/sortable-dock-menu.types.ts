import type { DockItemView } from "@services/dock-menu";

export type SortableDockItemProps = {
  item: DockItemView;
  index: number;
  hoveredIndex: number | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onImageLoad?: () => void;
};
