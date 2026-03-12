"use server";

import { createClient } from "@/supabase/server";
import { cookies } from "next/headers";

export async function upsertWidgetPosition(
  widgetId: string,
  x: number,
  y: number
) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("widget_positions")
    .upsert(
      { user_id: user.id, widget_id: widgetId, x, y },
      { onConflict: "user_id,widget_id" }
    );

  if (error) throw new Error(error.message);
}
