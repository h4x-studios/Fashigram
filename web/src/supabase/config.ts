import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!supabaseUrl.startsWith("http")) {
  throw new Error(
    `Invalid supabaseUrl: "${supabaseUrl}". Check NEXT_PUBLIC_SUPABASE_URL in web/.env.local`
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
