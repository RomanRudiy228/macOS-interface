import { useState, useEffect } from "react";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

export const useWeather = (apiKey: string) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );
      if (!res.ok) throw new Error("Помилка відповіді сервера");

      const data = await res.json();
      setWeather(data);
      setError(null);
    } catch (error) {
      console.error("Помилка завантаження погоди:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Геолокація не підтримується браузером");
      setLoading(false);
      return;
    }

    let interval: ReturnType<typeof setInterval>;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        fetchWeather(latitude, longitude);

        interval = setInterval(() => {
          fetchWeather(latitude, longitude);
        }, 300000);
      },
      () => {
        setLocationDenied(true);
        setLoading(false);
      }
    );

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [apiKey]);

  return { weather, loading, error, locationDenied };
};
