import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    client = createClient(url, key);
  }
  return client;
}

export const supabaseAdmin = {
  from: (table: string) => getSupabaseAdmin().from(table),
  auth: {
    admin: {
      getUserById: (id: string) => getSupabaseAdmin().auth.admin.getUserById(id),
    },
  },
};
