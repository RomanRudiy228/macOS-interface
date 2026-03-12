"use server";

import { cookies } from "next/headers";
import { createClient } from "@/supabase/server";

export async function markConversationAsSeen(conversationId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  await supabase
    .from("conversations")
    .update({ last_seen_at: new Date().toISOString() })
    .eq("id", conversationId);
}
