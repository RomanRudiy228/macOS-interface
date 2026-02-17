import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { createClient } from "@/supabase/client";
import { SystemColor } from "@/types/types";
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

  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("theme, system_color")
        .eq("id", 1)
        .single();

      if (error || !data) {
        console.error("Settings fetch error:", error);
        setIsLoading(false);
        return;
      }

      if (data.theme && data.theme !== theme) {
        setTheme(data.theme);
      }

      if (data.system_color) {
        setActiveColor(data.system_color);
        applySystemTheme(data.system_color, STATIC_COLORS);
      }

      setIsLoading(false);
    };

    fetchSettings();
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
    colors: STATIC_COLORS,
    isLoading,
    toggleTheme,
    changeColor,
  };
};
