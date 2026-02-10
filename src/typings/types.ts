// src/typings/types.ts

export interface Theme {
  id: "light" | "dark";
  name: string;
}

export interface SystemColor {
  id: string;
  name: string;
  css: string;
}

export interface Settings {
  id: number;
  theme: "light" | "dark";
  system_color: string;
  wallpaper_id: string;
}
