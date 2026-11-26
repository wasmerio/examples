import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey =
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

if (
  !import.meta.env.PUBLIC_SUPABASE_URL ||
  !import.meta.env.PUBLIC_SUPABASE_ANON_KEY
) {
  if (import.meta.env.DEV) {
    console.warn(
      'Supabase URL or Anon Key is missing. Using placeholder values for development.'
    );
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
