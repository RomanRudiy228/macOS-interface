import { cn } from "@/lib/utils";

type Wallpaper = {
  id: string;
  name: string;
  backgroundImage: string;
};

type DesktopScreenProps = {
  className?: string;
  wallpapers: Wallpaper[];
  wallpaperId?: string;
};

export function DesktopScreen({
  className,
  wallpapers,
  wallpaperId,
}: DesktopScreenProps) {
  const fallbackWallpaper: Wallpaper = {
    id: "sierra-dusk",
    name: "Sierra Dusk",
    backgroundImage:
      "linear-gradient(140deg, #0f172a 0%, #1e293b 35%, #0f766e 70%, #22c55e 100%)",
  };
  const wallpaper =
    wallpapers.find((item) => item.id === wallpaperId) ??
    wallpapers[0] ??
    fallbackWallpaper;

  return (
    <div
      className={cn(
        "desktop-shell relative min-h-screen w-full overflow-hidden text-white",
        className
      )}
      style={{
        backgroundImage: wallpaper.backgroundImage,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
      <div className="relative z-10 flex min-h-screen flex-col justify-between px-10 pb-10 pt-14">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px]/6 uppercase tracking-[0.45em] text-white/70">
              Wallpaper
            </p>
            <h1 className="text-2xl font-semibold">{wallpaper.name}</h1>
          </div>
          <div className="flex items-center gap-3 text-right">
            <div>
              <p className="text-xs/6 text-white/70">macOS Interface</p>
              <p className="text-lg font-medium">Desktop</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
