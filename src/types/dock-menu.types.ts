export type DockItemView = {
  id: string;
  appKey: string;
  name: string;
  src: string;
  isLocked: boolean;
};

export type DockMenuProps = {
  items: DockItemView[];
};

export type SortableDockItemProps = {
  item: DockItemView;
  index: number;
  hoveredIndex: number | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  variant?: "default" | "bin";
  isOpen?: boolean;
  isActive?: boolean;
  onOpen?: () => void;
};
