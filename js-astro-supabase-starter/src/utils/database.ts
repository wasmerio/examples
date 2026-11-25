import { createClient } from '@supabase/supabase-js'
import type { Database } from '../../supabase/types'

const supabaseUrl = import.meta.env.SUPABASE_DATABASE_URL
const supabaseKey = import.meta.env.SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseKey ? createClient<Database>(supabaseUrl, supabaseKey) : null;
