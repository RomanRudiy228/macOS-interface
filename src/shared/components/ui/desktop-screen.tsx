import { cn } from "@/shared/lib/utils";
import { defaultWallpaperId, wallpapers } from "@/shared/data/wallpapers";

type DesktopScreenProps = {
  className?: string;
  wallpaperId?: string;
  onWallpaperSelect?: (wallpaperId: string) => void;
  isPickerOpen?: boolean;
  onTogglePicker?: () => void;
};

export function DesktopScreen({
  className,
  wallpaperId = defaultWallpaperId,
  onWallpaperSelect,
  isPickerOpen = true,
  onTogglePicker,
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
            <button
              type="button"
              onClick={onTogglePicker}
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/80 transition hover:bg-white/20"
            >
              Wallpapers
            </button>
            <div>
              <p className="text-xs/6 text-white/70">macOS Interface</p>
              <p className="text-lg font-medium">Desktop</p>
            </div>
          </div>
        </div>

        {isPickerOpen ? (
          <div className="relative z-10 flex justify-end">
            <div className="glass-surface w-full max-w-sm rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="traffic-lights">
                  <span className="traffic-light red" />
                  <span className="traffic-light yellow" />
                  <span className="traffic-light green" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/60">
                  Wallpapers
                </span>
              </div>
              <p className="mt-4 text-sm text-white/70">
                Choose a wallpaper to update the desktop background.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {wallpapers.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onWallpaperSelect?.(item.id)}
                    className={cn(
                      "group relative aspect-[4/3] rounded-lg border border-white/10 transition",
                      item.id === wallpaperId
                        ? "ring-2 ring-[hsl(var(--system-accent))]"
                        : "hover:border-white/40"
                    )}
                    style={{ backgroundImage: item.backgroundImage }}
                    aria-label={`Select ${item.name}`}
                  >
                    <span className="absolute inset-x-1 bottom-1 rounded bg-black/55 px-1 py-0.5 text-[10px] text-white/80 opacity-0 transition group-hover:opacity-100">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
