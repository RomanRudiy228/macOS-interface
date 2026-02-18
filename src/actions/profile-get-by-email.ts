"use server";

import { cookies } from "next/headers";
import { createClient } from "@/supabase/server";

export async function getProfileByEmail(email: string): Promise<{
  username: string | null;
  avatarUrl: string | null;
}> {
  if (!email) {
    return { username: null, avatarUrl: null };
  }

  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("email", email)
      .maybeSingle();

    if (error || !data) {
      return { username: null, avatarUrl: null };
    }

    return {
      username: data.username ?? null,
      avatarUrl: data.avatar_url ?? null,
    };
  } catch {
    return { username: null, avatarUrl: null };
  }
}
