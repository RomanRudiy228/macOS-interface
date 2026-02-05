"use client";

import dynamic from "next/dynamic";
import { ICON_SIZE, SLOT_HEIGHT } from "@const";
import type { DockItemView } from "@services/dock-menu";

function DockMenuSkeleton() {
  return (
    <nav
      className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 flex items-end gap-1 rounded-2xl border border-white/15 bg-white/10 px-1.5 py-1 shadow-sm backdrop-blur-2xl backdrop-saturate-[1.4]"
      aria-label="Dock-menu (loading)"
    >
      <ul className="flex items-end gap-0.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <li
            key={i}
            className="rounded-xl bg-white/20 shrink-0 animate-pulse"
            style={{ width: ICON_SIZE * 0.7, height: SLOT_HEIGHT }}
          />
        ))}
      </ul>
      <div className="w-px self-center h-10 bg-white/20 shrink-0" aria-hidden />
      <div
        className="rounded-xl bg-white/20 shrink-0 animate-pulse"
        style={{ width: ICON_SIZE, height: SLOT_HEIGHT }}
      />
    </nav>
  );
}

const DockMenuDynamic = dynamic(
  () =>
    import("./dock-menu").then((m) => ({
      default: m.DockMenu,
    })),
  { ssr: false, loading: () => <DockMenuSkeleton /> }
);

export { DockMenuSkeleton };

export function DockMenuClient({ items }: { items: DockItemView[] }) {
  return <DockMenuDynamic items={items} />;
}
