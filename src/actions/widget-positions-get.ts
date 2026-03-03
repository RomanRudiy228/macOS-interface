"use server";

import { createClient } from "@/supabase/server";
import { cookies } from "next/headers";

export async function getWidgetPositions() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("widget_positions")
    .select("widget_id,x,y");

  if (error) throw new Error(error.message);
  return data ?? [];
}
