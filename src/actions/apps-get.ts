"use server";

import { cookies } from "next/headers";
import { createClient } from "@/supabase/server";
// import type { Database } from "@/supabase/types/database.types";

export type AppCatalog = {
  name: string;
  src: string;
};

export async function getApps(): Promise<Record<string, AppCatalog>> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("apps")
      .select("app_key, name, icon");

    if (error || !data) {
      console.error("Error fetching apps:", error);
      return {};
    }

    const apps: Record<string, AppCatalog> = {};
    for (const row of data) {
      apps[row.app_key] = {
        name: row.name,
        src: row.icon,
      };
    }

    return apps;
  } catch (error) {
    console.error("Error in getApps:", error);
    return {};
  }
}
