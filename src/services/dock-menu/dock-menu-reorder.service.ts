import { cookies } from "next/headers";
import { createClient } from "@/supabase/server";

export async function reorderDockItems(orderedMainIds: string[]) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  for (let i = 0; i < orderedMainIds.length; i++) {
    await supabase
      .from("dock_items")
      .update({ position: i + 1 })
      .eq("id", orderedMainIds[i]);
  }
}
