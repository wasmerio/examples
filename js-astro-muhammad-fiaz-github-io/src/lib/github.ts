import { siteConfig } from "@/site.config";
import { setCachedData, CACHE_KEYS, clearCachedData } from "@/lib/indexeddb-cache";

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  disabled: boolean;
  visibility: string;
  license: {
    key: string;
    name: string;
    spdx_id: string;
  } | null;
  default_branch: string;
  size: number;
  has_wiki: boolean;
  has_pages: boolean;
  has_discussions: boolean;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface RepositoryStats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  totalWatchers: number;
  languages: Record<string, number>;
  topLanguage: string;
  mostStarred: GitHubRepository | null;
}

export const languageColors: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Zig: "#ec915c",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Lua: "#000080",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Astro: "#ff5d01",
  SCSS: "#c6538c",
  Markdown: "#083fa1"
};

export function getLanguageColor(language: string | null): string {
  if (!language) return "#6e7681";
  return languageColors[language] || "#6e7681";
}

async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries: number = 3
): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Accept": "application/vnd.github.v3+json",
          ...options.headers
        }
      });
      
      if (response.ok) {
        return response;
      }
      
      if (response.status === 403) {
        const remaining = response.headers.get("X-RateLimit-Remaining");
        if (remaining === "0") {
          throw new Error("GitHub API rate limit exceeded. Please try again later.");
        }
      }
      
      if (response.status >= 500) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      
      throw new Error(`GitHub API error: ${response.status}`);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
  
  throw lastError || new Error("Failed to fetch from GitHub API");
}

// Helper to get raw server cache with metadata
async function getServerCacheRaw(key: string): Promise<{ data: any; expiresAt: number } | null> {
  // Only run on server - using import.meta.env.SSR for proper tree-shaking
  if (!import.meta.env.SSR) {
    return null;
  }
  
  try {
    // Dynamic import only on server
    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    const cacheDir = path.resolve(process.cwd(), ".cache");
    const cacheFile = path.join(cacheDir, `${key}.json`);

    try {
      await fs.access(cacheFile);
    } catch {
      return null; // File doesn't exist
    }

    const fileContent = await fs.readFile(cacheFile, "utf-8");
    const entry = JSON.parse(fileContent);
    return entry; 
  } catch (error) {
    // Ignore errors (file not found, corrupt, etc)
    return null;
  }
}

async function setServerCache(key: string, data: any): Promise<void> {
  // Only run on server - using import.meta.env.SSR for proper tree-shaking
  if (!import.meta.env.SSR) {
    return;
  }
  
  try {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    const cacheDir = path.resolve(process.cwd(), ".cache");
    const cacheFile = path.join(cacheDir, `${key}.json`);

    await fs.mkdir(cacheDir, { recursive: true });
    await fs.writeFile(
      cacheFile,
      JSON.stringify({
        data,
        expiresAt: Date.now() + 60 * 60 * 1000 // 1 hour
      })
    );
  } catch (error) {
    console.warn("Server cache write error:", error);
  }
}

export async function fetchUserRepositories(
  username: string = siteConfig.github.username,
  forceRefresh: boolean = false
): Promise<GitHubRepository[]> {
  const cacheKey = CACHE_KEYS.GITHUB_REPOS;
  const now = Date.now();
  
  // 1. Attempt to load any existing cache (Fresh or Stale) for fallback purposes
  let cachedEntry: { data: GitHubRepository[]; expiresAt: number } | null = null;
  
  if (typeof window !== "undefined") {
    // Client-side: IndexedDB
    // We import this dynamically if needed or just use the helper
    const { getRawCacheEntry } = await import("@/lib/indexeddb-cache");
    cachedEntry = await getRawCacheEntry<GitHubRepository[]>(cacheKey);
  } else {
    // Server-side: FS
    cachedEntry = await getServerCacheRaw(cacheKey);
  }

  // 2. If we have FRESH cache and aren't forcing refresh, return it immediately
  if (!forceRefresh && cachedEntry && now < cachedEntry.expiresAt) {
    return cachedEntry.data;
  }

  // 3. Otherwise, try to fetch from API
  const allRepos: GitHubRepository[] = [];
  let page = 1;
  let hasMore = true;

  try {
    while (hasMore) {
      const url = `https://api.github.com/users/${username}/repos?per_page=100&page=${page}&sort=updated&direction=desc&type=owner`;
      
      const response = await fetchWithRetry(url);
      const repos: GitHubRepository[] = await response.json();

      if (repos.length === 0) {
        hasMore = false;
      } else {
        allRepos.push(...repos);
        page++;
        if (repos.length < 100) {
          hasMore = false;
        }
      }
    }

    const filteredRepos = allRepos.filter(
      (repo) => !siteConfig.github.excludedRepos.includes(repo.name)
    );

    // Success! Save to cache (Client or Server)
    if (typeof window !== "undefined") {
      await setCachedData(cacheKey, filteredRepos);
    } else {
      await setServerCache(cacheKey, filteredRepos);
    }
    
    return filteredRepos;

  } catch (error) {
    // Only log full error if it's NOT a rate limit (to keep console clean)
    const isRateLimit = error instanceof Error && error.message.includes("rate limit");
    
    if (isRateLimit) {
      console.warn("GitHub API rate limit exceeded. Using cached data if available.");
    } else {
      console.warn("GitHub fetch failed:", error);
    }
    
    // 4. API Failed: Return STALE cache if available
    if (cachedEntry) {
      if (!isRateLimit) console.info("Serving stale cache data due to API failure.");
      return cachedEntry.data;
    }
    
    // 5. No cache available at all: Return empty or rethrow
    // Returning empty array allows the build to silently succeed with no data, 
    // which is better than crashing for a static site generator.
    return []; 
  }
}

export async function fetchUserProfile(
  username: string = siteConfig.github.username
): Promise<GitHubUser> {
  const cacheKey = CACHE_KEYS.GITHUB_PROFILE;
  const now = Date.now();
  
  // 1. Load any existing cache (Fresh or Stale)
  let cachedEntry: { data: GitHubUser; expiresAt: number } | null = null;

  if (typeof window !== "undefined") {
     const { getRawCacheEntry } = await import("@/lib/indexeddb-cache");
     cachedEntry = await getRawCacheEntry<GitHubUser>(cacheKey);
  } else {
     cachedEntry = await getServerCacheRaw(cacheKey);
  }

  // 2. Return Fresh Cache directly
  if (cachedEntry && now < cachedEntry.expiresAt) {
    return cachedEntry.data;
  }

  try {
    const url = `https://api.github.com/users/${username}`;
    const response = await fetchWithRetry(url);
    const profile = await response.json();
    
    // Success: Update Cache
    if (typeof window !== "undefined") {
      await setCachedData(cacheKey, profile);
    } else {
      await setServerCache(cacheKey, profile);
    }
    
    return profile;
  } catch (error) {
     console.warn("GitHub profile fetch failed. Attempting fallback.", error);
     
     // 3. Fail: Use Stale Cache if available
     if (cachedEntry) {
       console.info("Serving stale profile data.");
       return cachedEntry.data;
     }

     // 4. No Data: Rethrow or mock
     throw error;
  }
}

export async function fetchRepoReadme(
  repoName: string,
  username: string = siteConfig.github.username
): Promise<string | null> {
  const url = `https://api.github.com/repos/${username}/${repoName}/readme`;

  try {
    const response = await fetch(url, {
      headers: {
        "Accept": "application/vnd.github.v3.raw"
      }
    });

    if (!response.ok) {
      return null;
    }

    return response.text();
  } catch {
    return null;
  }
}

export function calculateStats(repos: GitHubRepository[]): RepositoryStats {
  const languages: Record<string, number> = {};
  let totalStars = 0;
  let totalForks = 0;
  let totalWatchers = 0;
  let mostStarred: GitHubRepository | null = null;

  for (const repo of repos) {
    totalStars += repo.stargazers_count;
    totalForks += repo.forks_count;
    totalWatchers += repo.watchers_count;

    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
    }

    if (!mostStarred || repo.stargazers_count > mostStarred.stargazers_count) {
      mostStarred = repo;
    }
  }

  const topLanguage = Object.entries(languages).sort(
    ([, a], [, b]) => b - a
  )[0]?.[0] || "Unknown";

  return {
    totalRepos: repos.length,
    totalStars,
    totalForks,
    totalWatchers,
    languages,
    topLanguage,
    mostStarred
  };
}

export function filterAndSortRepos(
  repos: GitHubRepository[],
  options: {
    search?: string;
    language?: string;
    sort?: "stars" | "forks" | "updated" | "name" | "created";
    direction?: "asc" | "desc";
    showForks?: boolean;
    showArchived?: boolean;
  } = {}
): GitHubRepository[] {
  const {
    search = "",
    language = "",
    sort = "stars",
    direction = "desc",
    showForks = true,
    showArchived = false
  } = options;

  let filtered = repos;

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (repo) =>
        repo.name.toLowerCase().includes(searchLower) ||
        repo.description?.toLowerCase().includes(searchLower) ||
        repo.topics.some((topic) => topic.toLowerCase().includes(searchLower))
    );
  }

  if (language) {
    filtered = filtered.filter(
      (repo) => repo.language?.toLowerCase() === language.toLowerCase()
    );
  }

  if (!showForks) {
    filtered = filtered.filter((repo) => !repo.fork);
  }

  if (!showArchived) {
    filtered = filtered.filter((repo) => !repo.archived);
  }

  const sortFn = (a: GitHubRepository, b: GitHubRepository): number => {
    let aVal: number | string;
    let bVal: number | string;

    switch (sort) {
      case "stars":
        aVal = a.stargazers_count;
        bVal = b.stargazers_count;
        break;
      case "forks":
        aVal = a.forks_count;
        bVal = b.forks_count;
        break;
      case "updated":
        aVal = new Date(a.updated_at).getTime();
        bVal = new Date(b.updated_at).getTime();
        break;
      case "created":
        aVal = new Date(a.created_at).getTime();
        bVal = new Date(b.created_at).getTime();
        break;
      case "name":
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
        break;
      default:
        aVal = a.stargazers_count;
        bVal = b.stargazers_count;
    }

    if (typeof aVal === "string" && typeof bVal === "string") {
      return direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return direction === "asc"
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number);
  };

  return [...filtered].sort(sortFn);
}

export function getUniqueLanguages(repos: GitHubRepository[]): string[] {
  const languages = new Set<string>();
  for (const repo of repos) {
    if (repo.language) {
      languages.add(repo.language);
    }
  }
  return Array.from(languages).sort();
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
  if (diffInSeconds < 31536000)
    return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  return `${Math.floor(diffInSeconds / 31536000)}y ago`;
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}

export function getRepoThumbnail(fullName: string): string {
  return `https://opengraph.githubassets.com/1/${fullName}`;
}

export async function clearGitHubCache(): Promise<void> {
  await clearCachedData(CACHE_KEYS.GITHUB_REPOS);
  await clearCachedData(CACHE_KEYS.GITHUB_PROFILE);
}
