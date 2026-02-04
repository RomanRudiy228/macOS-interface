import { cookies } from "next/headers";
import { createClient } from "@/supabase/server";

export async function removeDockItem(id: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  await supabase.from("dock_items").delete().eq("id", id);
}
