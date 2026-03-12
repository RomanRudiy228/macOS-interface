"use client";

import React, { useEffect, useState } from "react";

export const ClockWidget = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const secDegrees = (time.getSeconds() / 60) * 360;
  const minDegrees = ((time.getMinutes() + time.getSeconds() / 60) / 60) * 360;
  const hourDegrees =
    (((time.getHours() % 12) + time.getMinutes() / 60) / 12) * 360;

  return (
    <div className="w-40 h-40 rounded-[32px] bg-white/20 dark:bg-black/20 backdrop-blur-2xl p-4 shadow-lg border border-white/10 flex items-center justify-center select-none">
      <div className="relative w-full h-full rounded-full border-[3px] border-white/30 flex items-center justify-center">
        <div className="absolute w-2 h-2 bg-white rounded-full z-40" />
        <div
          className="absolute w-1 h-10 bg-white rounded-full origin-bottom"
          style={{ transform: `translateY(-50%) rotate(${hourDegrees}deg)` }}
        />
        <div
          className="absolute w-1 h-14 bg-white/80 rounded-full origin-bottom"
          style={{ transform: `translateY(-50%) rotate(${minDegrees}deg)` }}
        />
        <div
          className="absolute w-[1.5px] h-14 bg-orange-500 rounded-full origin-bottom z-30"
          style={{ transform: `translateY(-50%) rotate(${secDegrees}deg)` }}
        />
      </div>
    </div>
  );
};
