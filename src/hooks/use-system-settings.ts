import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { createClient } from "@/supabase/client";
import { SystemColor, Settings } from "@/typings/types";
import { applySystemTheme } from "@/utils/theme-utilis";

const STATIC_COLORS: SystemColor[] = [
  { id: "blue", name: "Blue", css: "bg-blue-500" },
  { id: "purple", name: "Purple", css: "bg-purple-500" },
  { id: "pink", name: "Pink", css: "bg-pink-500" },
  { id: "red", name: "Red", css: "bg-red-500" },
  { id: "orange", name: "Orange", css: "bg-orange-500" },
  { id: "green", name: "Green", css: "bg-green-500" },
  { id: "yellow", name: "Yellow", css: "bg-yellow-400" },
];

export const useSystemSettings = () => {
  const { setTheme, theme } = useTheme();
  const supabase = createClient();

  const [activeColor, setActiveColor] = useState("blue");
  const [isLoading, setIsLoading] = useState(true);

  const colors = STATIC_COLORS;
  const [currentWallpaper, setCurrentWallpaper] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data: settingsData } = await supabase
        .from("settings")
        .select(`*, wallpapers ( thumbnail )`)
        .single();

      if (settingsData) {
        const settings = settingsData as unknown as Settings & {
          wallpapers: { thumbnail: string };
        };

        if (settings.theme && settings.theme !== theme) {
          setTheme(settings.theme);
        }

        setActiveColor(settings.system_color);

        applySystemTheme(settings.system_color, STATIC_COLORS);

        if (settings.wallpapers?.thumbnail) {
          setCurrentWallpaper(settings.wallpapers.thumbnail);
        }
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const toggleTheme = async (checked: boolean) => {
    const newTheme = checked ? "dark" : "light";
    setTheme(newTheme);

    await supabase.from("settings").update({ theme: newTheme }).eq("id", 1);
  };

  const changeColor = async (colorId: string) => {
    setActiveColor(colorId);
    applySystemTheme(colorId, STATIC_COLORS);

    await supabase
      .from("settings")
      .update({ system_color: colorId })
      .eq("id", 1);
  };

  return {
    theme,
    activeColor,
    colors,
    currentWallpaper,
    isLoading,
    toggleTheme,
    changeColor,
  };
};
