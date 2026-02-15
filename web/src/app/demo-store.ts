// Re-export Supabase Store as the new "Demo Store" (to maintain import references)
import { supabaseStore } from './supabase-store';

// Export shared types so imports in other files still work
export * from './types';

// Alias the store instance
export const demoStore = supabaseStore;
