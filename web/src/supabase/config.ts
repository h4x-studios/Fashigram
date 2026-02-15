import { createClient } from "@supabase/supabase-js";

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Robustness: If the user only provided the project ID (e.g. pvvnwztyzdffpsrfslgt)
// automatically format it into the full Supabase URL.
if (supabaseUrl && !supabaseUrl.startsWith("http")) {
  supabaseUrl = `https://${supabaseUrl}.supabase.co`;
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase environment variables are missing. Build may fail or features will be limited.");
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);
