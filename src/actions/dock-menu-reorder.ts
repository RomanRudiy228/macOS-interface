"use server";

import { cookies } from "next/headers";
import { createClient } from "@/supabase/server";

export async function reorderDockItems(orderedMainIds: string[]) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  for (let i = 0; i < orderedMainIds.length; i++) {
    const query = supabase
      .from("dock_items")
      .update({ position: i + 1 })
      .eq("id", orderedMainIds[i]);
    await (user ? query.eq("user_id", user.id) : query.is("user_id", null));
  }
}
