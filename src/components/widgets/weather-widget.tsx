"use client";

import { useWeather } from "@/hooks/use-weather";

export const WeatherWidget = () => {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_KEY;
  const { weather, loading, error, locationDenied } = useWeather(apiKey ?? "");

  if (!apiKey) {
    return (
      <div className="w-40 h-40 rounded-[36px] bg-white/20 backdrop-blur-2xl p-5 flex items-center justify-center text-white text-sm text-center">
        <div className="space-y-1 px-1">
          <p className="text-sm font-semibold leading-snug">
            Weather unavailable
          </p>
          <p className="text-xs opacity-80 leading-snug">
            Set NEXT_PUBLIC_WEATHER_KEY to enable the weather widget.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-40 h-40 rounded-[36px] bg-white/20 backdrop-blur-2xl animate-pulse" />
    );
  }

  if (locationDenied) {
    return (
      <div className="w-40 h-40 rounded-[36px] bg-white/20 backdrop-blur-2xl p-5 flex items-center justify-center text-white text-sm text-center">
        <div className="space-y-1 px-1">
          <p className="text-sm font-semibold leading-snug">
            Location not available
          </p>
          <p className="text-xs opacity-80 leading-snug">
            Allow location access to show the weather for your area.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-40 h-40 rounded-[36px] bg-white/20 backdrop-blur-2xl p-5 flex items-center justify-center text-white text-sm text-center">
        {error}
      </div>
    );
  }

  if (!weather) return null;

  const icon = weather.weather?.[0]?.icon;
  const iconUrl = icon
    ? `https://openweathermap.org/img/wn/${icon}@4x.png`
    : null;

  return (
    <div
      className="w-40 h-40 rounded-[36px]
      bg-white/20 dark:bg-black/20
      backdrop-blur-2xl
      p-5
      shadow-[0_8px_32px_rgba(0,0,0,0.25)]
      border border-white/10
      flex flex-col justify-between
      text-white select-none"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium opacity-80">{weather.name}</p>
          <p className="text-4xl font-light tracking-tight">
            {Math.round(weather.main.temp)}°
          </p>
        </div>

        {iconUrl && (
          <img
            src={iconUrl}
            alt="weather icon"
            className="w-16 h-16 drop-shadow-[0_0_12px_rgba(255,255,255,0.5)]"
          />
        )}
      </div>

      <div className="flex justify-between text-sm opacity-80">
        <span>{weather.weather?.[0]?.description}</span>
        <span>
          ↑{Math.round(weather.main.temp_max)}° ↓
          {Math.round(weather.main.temp_min)}°
        </span>
      </div>
    </div>
  );
};
