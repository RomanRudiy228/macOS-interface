"use client";

import { useMemo, useState } from "react";
import { Rect } from "@/utils/collisions";
import { WidgetWrapper } from "@/components/widgets/shared/widgets-wrapper";
import { ClockWidget } from "@/components/widgets/clock-widget";
import { WeatherWidget } from "@/components/widgets/weather-widget";
import { upsertWidgetPosition } from "@/actions/widget-positions-upsert";

const CLOCK_DEFAULT = { x: 60, y: 80 };
const WEATHER_DEFAULT = { x: 300, y: 80 };

type PosRow = { widget_id: string; x: number; y: number };

export function WidgetsLayerClient({ positions }: { positions: PosRow[] }) {
  const [registry, setRegistry] = useState<Rect[]>([]);

  const posMap = useMemo(() => {
    const m = new Map<string, { x: number; y: number }>();
    for (const p of positions) m.set(p.widget_id, { x: p.x, y: p.y });
    return m;
  }, [positions]);

  const handleUpdate = (rect: Rect) => {
    setRegistry((prev) => {
      const i = prev.findIndex((w) => w.id === rect.id);
      if (i > -1) {
        const copy = [...prev];
        copy[i] = rect;
        return copy;
      }
      return [...prev, rect];
    });
  };

  const persist = async (id: string, x: number, y: number) => {
    await upsertWidgetPosition(id, Math.round(x), Math.round(y));
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <WidgetWrapper
        id="clock-main"
        defaultPosition={CLOCK_DEFAULT}
        initialPosition={posMap.get("clock-main") ?? null}
        allWidgets={registry}
        onPositionUpdate={handleUpdate}
        onPersist={persist}
      >
        <ClockWidget />
      </WidgetWrapper>

      <WidgetWrapper
        id="weather-main"
        defaultPosition={WEATHER_DEFAULT}
        initialPosition={posMap.get("weather-main") ?? null}
        allWidgets={registry}
        onPositionUpdate={handleUpdate}
        onPersist={persist}
      >
        <WeatherWidget />
      </WidgetWrapper>
    </div>
  );
}
