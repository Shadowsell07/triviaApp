import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase project URL and anon key
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
