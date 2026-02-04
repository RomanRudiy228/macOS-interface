"use client";

import dynamic from "next/dynamic";
import { createContext, useContext } from "react";
import { DockMenuPlaceholder } from "@/components/dock-menu/components/dock-menu-placeholder/dock-menu-placeholder";
import type { DockItemView } from "@/services/dock-menu/types/dock-menu.types";

const DockItemsContext = createContext<DockItemView[] | null>(null);

function DockMenuLoading() {
  const items = useContext(DockItemsContext);
  if (!items?.length) return null;
  return <DockMenuPlaceholder items={items} />;
}

const DockMenuDynamic = dynamic(
  () => import("../../dock-menu").then((m) => ({ default: m.DockMenu })),
  { ssr: false, loading: DockMenuLoading }
);

type Props = { items: DockItemView[] };

export function DockMenuClient({ items }: Props) {
  return (
    <DockItemsContext.Provider value={items}>
      <DockMenuDynamic items={items} />
    </DockItemsContext.Provider>
  );
}
