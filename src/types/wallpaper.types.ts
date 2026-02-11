export type Wallpaper = {
  id: string;
  name: string;
  backgroundImage: string;
};

export type WallpaperContextValue = {
  wallpapers: Wallpaper[];
  selectedWallpaperId: string;
  selectedWallpaper: Wallpaper | undefined;
  setSelectedWallpaperId: (id: string) => void;
};
