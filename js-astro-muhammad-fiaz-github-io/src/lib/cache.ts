export const CACHE_DURATION = 60 * 60 * 1000;
export const CACHE_DURATION_SECONDS = 3600;

export const CACHE_KEYS = {
  GITHUB_REPOS: "github-repos",
  GITHUB_PROFILE: "github-profile",
  WAKATIME_STATS: "wakatime-stats",
  PROJECTS_STORE: "projects-storage"
} as const;

export type CacheKey = typeof CACHE_KEYS[keyof typeof CACHE_KEYS];
