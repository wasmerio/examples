export type SupabaseConfig = {
  url: string;
  anonKey: string;
};

export function getSupabaseConfigFromEnv(): SupabaseConfig {
  const url = process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL || "";
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY || "";
  return { url, anonKey };
}

export function createSupabaseClientMock() {
  const cfg = getSupabaseConfigFromEnv();
  const hasConfig = Boolean(cfg.url && cfg.anonKey);

  return {
    async query(table: string) {
      if (!hasConfig) {
        return { data: null, error: `Missing SUPABASE_URL or SUPABASE_ANON_KEY` } as const;
      }
      return { data: [{ table, mock: true }], error: null } as const;
    },
  } as const;
}

