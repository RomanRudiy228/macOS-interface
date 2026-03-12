"use server";

import { cookies } from "next/headers";
import { createClient } from "@/supabase/server";

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
}

export async function searchUsers(query: string): Promise<UserProfile[]> {
  if (!query.trim()) {
    return [];
  }

  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user: currentUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !currentUser) {
      return [];
    }

    // Search by username or email
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, username, email, avatar_url")
      .neq("id", currentUser.id) // Exclude current user
      .or(
        `username.ilike.%${query}%,email.ilike.%${query}%`
      );

    if (error) {
      console.error("Error searching users:", error);
      return [];
    }

    return profiles || [];
  } catch (error) {
    console.error("Error in searchUsers:", error);
    return [];
  }
}

export async function getAllUsers(): Promise<UserProfile[]> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user: currentUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !currentUser) {
      return [];
    }

    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, username, email, avatar_url")
      .neq("id", currentUser.id);

    if (error) {
      console.error("Error fetching users:", error);
      return [];
    }

    return profiles || [];
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return [];
  }
}
