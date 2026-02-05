type ScreenLoaderProps = {
  label?: string;
};

const SPINNER_TICKS = Array.from({ length: 12 });

export function ScreenLoader({ label = "Loading" }: ScreenLoaderProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/90"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="macos-spinner" aria-hidden="true">
          {SPINNER_TICKS.map((_, index) => {
            const rotation = index * 30;
            const delay = -(1.1 - index * 0.1);
            return (
              <span
                key={rotation}
                style={{
                  transform: `rotate(${rotation}deg) translate(0, -18px)`,
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })}
        </div>
        <p className="text-[11px] uppercase tracking-[0.35em] text-neutral-200/80">
          {label}
        </p>
      </div>
    </div>
  );
}
