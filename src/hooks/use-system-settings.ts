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
const DEFAULT_THEME = "dark";
const DEFAULT_SYSTEM_COLOR = "blue";

export const useSystemSettings = () => {
  const { setTheme, theme } = useTheme();
  const supabase = createClient();

  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("settings")
        .select("theme, system_color")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Settings fetch error:", error);
        setIsLoading(false);
        return;
      }

      if (!data) {
        await supabase.from("settings").insert({
          user_id: user.id,
          wallpaper_id: null,
          theme: DEFAULT_THEME,
          system_color: DEFAULT_SYSTEM_COLOR,
        });
        if (DEFAULT_THEME !== theme) {
          setTheme(DEFAULT_THEME);
        }
        setActiveColor(DEFAULT_SYSTEM_COLOR);
        applySystemTheme(DEFAULT_SYSTEM_COLOR, STATIC_COLORS);
        setIsLoading(false);
        return;
      }

      const resolvedTheme = data.theme ?? DEFAULT_THEME;
      const resolvedColor = data.system_color ?? DEFAULT_SYSTEM_COLOR;

      if (resolvedTheme !== theme) {
        setTheme(resolvedTheme);
      }

      setActiveColor(resolvedColor);
      applySystemTheme(resolvedColor, STATIC_COLORS);

      if (!data.theme || !data.system_color) {
        await supabase
          .from("settings")
          .update({
            theme: resolvedTheme,
            system_color: resolvedColor,
          })
          .eq("user_id", user.id);
      }

      setIsLoading(false);
    };

    fetchSettings();
  }, []);

  const toggleTheme = async (checked: boolean) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const newTheme = checked ? "dark" : "light";
    setTheme(newTheme);
    await supabase.from("settings").update({ theme: newTheme }).eq("user_id", user.id);
  };

  const changeColor = async (colorId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    setActiveColor(colorId);
    applySystemTheme(colorId, STATIC_COLORS);
    await supabase
      .from("settings")
      .update({ system_color: colorId })
      .eq("user_id", user.id);
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
