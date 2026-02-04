import { DockItemView } from "@/services/dock-menu/types/dock-menu.types";

export type SortableDockItemProps = {
  item: DockItemView;
  index: number;
  hoveredIndex: number | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onImageLoad?: () => void;
};
