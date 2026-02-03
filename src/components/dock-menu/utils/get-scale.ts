import { SCALES } from "../const/dock-menu.const";

export function getScale(hoveredIndex: number | null, index: number): number {
  if (hoveredIndex === null) return 1;
  const distance = Math.abs(index - hoveredIndex);
  return SCALES[Math.min(distance, SCALES.length - 1)] ?? 1;
}
