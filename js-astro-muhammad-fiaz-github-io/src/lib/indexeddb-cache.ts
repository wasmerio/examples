import Dexie, { type EntityTable } from "dexie";

const CACHE_DURATION = 60 * 60 * 1000;

interface CacheEntry {
  key: string;
  data: string;
  timestamp: number;
  expiresAt: number;
}

let db: (Dexie & { cache: EntityTable<CacheEntry, "key"> }) | null = null;

function getDb() {
  if (typeof window === "undefined" || typeof indexedDB === "undefined") {
    return null;
  }
  
  if (!db) {
    db = new Dexie("github-cache-db") as Dexie & {
      cache: EntityTable<CacheEntry, "key">;
    };
    db.version(1).stores({
      cache: "key, expiresAt"
    });
  }
  
  return db;
}

export async function getCachedData<T>(key: string): Promise<T | null> {
  const database = getDb();
  if (!database) return null;
  
  try {
    const entry = await database.cache.get(key);
    if (!entry) return null;
    
    // Check expiration
    if (Date.now() < entry.expiresAt) {
      return JSON.parse(entry.data) as T;
    }
    
    // We do NOT delete here immediately anymore, to allow stale retrieval fallback
    // The consumer should handle deletion or overwrite if they successfully refresh
    return null;
  } catch (error) {
    console.warn("Cache read error:", error);
    return null;
  }
}

export async function getRawCacheEntry<T>(key: string): Promise<{ data: T; expiresAt: number } | null> {
  const database = getDb();
  if (!database) return null;

  try {
    const entry = await database.cache.get(key);
    if (!entry) return null;
    return {
      data: JSON.parse(entry.data) as T,
      expiresAt: entry.expiresAt
    };
  } catch (error) {
    console.warn("Raw cache read error:", error);
    return null;
  }
}

export async function setCachedData<T>(key: string, data: T): Promise<void> {
  const database = getDb();
  if (!database) return;
  
  try {
    const now = Date.now();
    await database.cache.put({
      key,
      data: JSON.stringify(data),
      timestamp: now,
      expiresAt: now + CACHE_DURATION
    });
  } catch (error) {
    console.warn("Cache write error:", error);
  }
}

export async function clearCachedData(key: string): Promise<void> {
  const database = getDb();
  if (!database) return;
  
  try {
    await database.cache.delete(key);
  } catch (error) {
    console.warn("Cache clear error:", error);
  }
}

export async function clearAllCache(): Promise<void> {
  const database = getDb();
  if (!database) return;
  
  try {
    await database.cache.clear();
  } catch (error) {
    console.warn("Cache clear all error:", error);
  }
}

export async function isCacheValid(key: string): Promise<boolean> {
  const database = getDb();
  if (!database) return false;
  
  try {
    const entry = await database.cache.get(key);
    if (!entry) return false;
    return Date.now() < entry.expiresAt;
  } catch {
    return false;
  }
}

export const CACHE_KEYS = {
  GITHUB_REPOS: "github-repos",
  GITHUB_PROFILE: "github-profile",
  WAKATIME_STATS: "wakatime-stats"
} as const;

export { CACHE_DURATION };
