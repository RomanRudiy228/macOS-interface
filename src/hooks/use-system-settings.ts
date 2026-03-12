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

  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [settingsRowId, setSettingsRowId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const supabase = createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("settings")
        .select("id, theme, system_color")
        .eq("user_id", user.id)
        .maybeSingle();
      let row = data;

      if (error || !row) {
        const { data: inserted, error: insertError } = await supabase
          .from("settings")
          .insert({
            user_id: user.id,
            theme: "dark",
            system_color: "blue",
          })
          .select("id, theme, system_color")
          .single();

        if (insertError || !inserted) {
          if (theme !== "dark") {
            setTheme("dark");
          }
          setActiveColor("blue");
          applySystemTheme("blue", STATIC_COLORS);
          setIsLoading(false);
          return;
        }

        row = inserted;
      }

      if (typeof row.id === "number") {
        setSettingsRowId(row.id);
      }

      if (row.theme && row.theme !== theme) {
        setTheme(row.theme);
      }

      if (row.system_color) {
        setActiveColor(row.system_color);
        applySystemTheme(row.system_color, STATIC_COLORS);
      }

      setIsLoading(false);
    };

    fetchSettings();
  }, [setTheme]);

  const toggleTheme = async (checked: boolean) => {
    const newTheme = checked ? "dark" : "light";
    setTheme(newTheme);
    try {
      const supabase = createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) return;

      let rowId = settingsRowId;
      if (rowId == null) {
        const { data: row } = await supabase
          .from("settings")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!row) {
          const { data: inserted } = await supabase
            .from("settings")
            .insert({
              user_id: user.id,
              theme: newTheme,
            })
            .select("id")
            .single();
          const insertedId =
            typeof inserted?.id === "number" ? inserted.id : null;
          rowId = insertedId;
          setSettingsRowId(insertedId);
        } else {
          const existingId = typeof row.id === "number" ? row.id : null;
          rowId = existingId;
          setSettingsRowId(existingId);
        }
      }

      if (rowId != null) {
        await supabase
          .from("settings")
          .update({ theme: newTheme })
          .eq("id", rowId);
      }
    } catch {}
  };

  const changeColor = async (colorId: string) => {
    setActiveColor(colorId);
    applySystemTheme(colorId, STATIC_COLORS);
    try {
      const supabase = createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) return;

      let rowId = settingsRowId;
      if (rowId == null) {
        const { data: row } = await supabase
          .from("settings")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!row) {
          const { data: inserted } = await supabase
            .from("settings")
            .insert({
              user_id: user.id,
              system_color: colorId,
            })
            .select("id")
            .single();
          const insertedId =
            typeof inserted?.id === "number" ? inserted.id : null;
          rowId = insertedId;
          setSettingsRowId(insertedId);
        } else {
          const existingId = typeof row.id === "number" ? row.id : null;
          rowId = existingId;
          setSettingsRowId(existingId);
        }
      }

      if (rowId != null) {
        await supabase
          .from("settings")
          .update({ system_color: colorId })
          .eq("id", rowId);
      }
    } catch {}
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
