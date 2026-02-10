import { wallpapers } from "@/const/wallpapers.const";

export function getWallpaperById(id: string) {
  return wallpapers.find((w) => w.id === id);
}
