export type Wallpaper = {
  id: string;
  name: string;
  backgroundImage: string;
};

export const wallpapers: Wallpaper[] = [
  {
    id: "sierra-dusk",
    name: "Sierra Dusk",
    backgroundImage:
      "linear-gradient(140deg, #0f172a 0%, #1e293b 35%, #0f766e 70%, #22c55e 100%)",
  },
  {
    id: "monterey-glow",
    name: "Monterey Glow",
    backgroundImage:
      "linear-gradient(135deg, #111827 0%, #1f2937 30%, #7c3aed 70%, #f472b6 100%)",
  },
  {
    id: "catalina-breeze",
    name: "Catalina Breeze",
    backgroundImage:
      "linear-gradient(150deg, #020617 0%, #0f172a 40%, #0284c7 70%, #bae6fd 100%)",
  },
  {
    id: "sonoma-morning",
    name: "Sonoma Morning",
    backgroundImage:
      "linear-gradient(160deg, #0b1020 0%, #1f2937 35%, #f59e0b 70%, #fef3c7 100%)",
  },
  {
    id: "ventura-twilight",
    name: "Ventura Twilight",
    backgroundImage:
      "linear-gradient(150deg, #0f172a 0%, #1e1b4b 35%, #4c1d95 65%, #a78bfa 100%)",
  },
  {
    id: "big-sur-coast",
    name: "Big Sur Coast",
    backgroundImage:
      "linear-gradient(160deg, #0f172a 0%, #0f766e 40%, #14b8a6 70%, #99f6e4 100%)",
  },
  {
    id: "mojave-night",
    name: "Mojave Night",
    backgroundImage:
      "linear-gradient(145deg, #0b1020 0%, #111827 35%, #1f2937 65%, #6b7280 100%)",
  },
  {
    id: "sequoia-sunrise",
    name: "Sequoia Sunrise",
    backgroundImage:
      "linear-gradient(150deg, #0b1020 0%, #1f2937 35%, #f97316 70%, #fdba74 100%)",
  },
  {
    id: "yosemite-clear",
    name: "Yosemite Clear",
    backgroundImage:
      "linear-gradient(160deg, #0f172a 0%, #1d4ed8 45%, #38bdf8 75%, #e0f2fe 100%)",
  },
];

export const defaultWallpaperId = wallpapers[0]?.id ?? "sierra-dusk";
