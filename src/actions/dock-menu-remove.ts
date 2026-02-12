"use server";

import { cookies } from "next/headers";
import { createClient } from "@/supabase/server";

export async function removeFromDock(itemId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const query = supabase.from("dock_items").delete().eq("id", itemId);
  await (user ? query.eq("user_id", user.id) : query.is("user_id", null));
}
