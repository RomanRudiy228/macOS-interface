/**
 *   npx supabase gen types typescript --project-id lfpvhchxavipluahzhop --schema public > types/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
}
