import { cn } from "@/lib/utils";
import { defaultWallpaperId, wallpapers } from "@/shared/data/wallpapers";

type DesktopScreenProps = {
  className?: string;
  wallpaperId?: string;
};

export function DesktopScreen({
  className,
  wallpaperId = defaultWallpaperId,
}: DesktopScreenProps) {
  const wallpaper =
    wallpapers.find((item) => item.id === wallpaperId) ?? wallpapers[0];

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
