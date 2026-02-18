"use client";

import { useEffect, useMemo, useState } from "react";
import { formatLockScreenDate, formatLockScreenTime } from "@/utils";

export const LockScreenClock = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const dateLabel = useMemo(() => formatLockScreenDate(now), [now]);
  const timeLabel = useMemo(() => formatLockScreenTime(now), [now]);

  return (
    <header className="pointer-events-none absolute left-1/2 top-20 z-10 -translate-x-1/2 text-center text-white">
      <p className="text-3xl font-medium tracking-tight text-white/90">{dateLabel}</p>
      <p className="bg-gradient-to-b from-white/95 to-white/55 bg-clip-text text-8xl font-semibold leading-none tracking-tight text-transparent">
        {timeLabel}
      </p>
    </header>
  );
};
