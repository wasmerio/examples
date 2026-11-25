// GitHub REST API Integration & Stats Aggregator
import { PORTFOLIO_DATA } from "../data/portfolio";

export interface GitHubStats {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  totalForks: number;
  topLanguages: Array<{ name: string; count: number; percentage: number }>;
  topRepos: Array<{
    name: string;
    description: string;
    stars: number;
    forks: number;
    language: string;
    url: string;
    updatedAt: string;
  }>;
}

function extractUsername(): string {
  const raw = (PORTFOLIO_DATA.developer.github || "").trim().replace(/^@/, "");
  if (!raw) return "nivinvysakh";

  // Extract owner username from github.com/username or github.com/username/repo
  const match = raw.match(/github\.com\/([a-zA-Z0-9_-]+)/i);
  if (match && match[1]) {
    return match[1];
  }

  // If user entered just their username directly (e.g. "torvalds" or "nivinvysakh")
  return raw.replace(/\/$/, "");
}

const CACHE_KEY = "tui_github_stats_cache";
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

export async function fetchGitHubStats(): Promise<GitHubStats | null> {
  const username = extractUsername();

  // 1. Check LocalStorage Cache
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL_MS && data.username === username) {
          return data;
        }
      }
    } catch {}
  }

  try {
    // 2. Fetch User Profile
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    if (!userRes.ok) return null;
    const userData = await userRes.json();

    // 3. Fetch Repositories
    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?sort=pushed&per_page=100`
    );
    if (!reposRes.ok) return null;
    const reposData = await reposRes.json();

    let totalStars = 0;
    let totalForks = 0;
    const langCounts: Record<string, number> = {};

    const formattedRepos = reposData
      .filter((repo: any) => !repo.fork)
      .map((repo: any) => {
        const stars = repo.stargazers_count || 0;
        const forks = repo.forks_count || 0;
        totalStars += stars;
        totalForks += forks;

        if (repo.language) {
          langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
        }

        return {
          name: repo.name,
          description: repo.description || "No description provided",
          stars,
          forks,
          language: repo.language || "Plain Text",
          url: repo.html_url,
          updatedAt: new Date(repo.pushed_at || repo.updated_at).toLocaleDateString(),
        };
      })
      .sort((a: any, b: any) => b.stars - a.stars);

    // Calculate language percentages
    const totalLangs = Object.values(langCounts).reduce((a, b) => a + b, 0);
    const topLanguages = Object.entries(langCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / totalLangs) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const stats: GitHubStats = {
      username,
      name: userData.name || username,
      avatarUrl: userData.avatar_url || "",
      bio: userData.bio || "",
      publicRepos: userData.public_repos || reposData.length,
      followers: userData.followers || 0,
      following: userData.following || 0,
      totalStars,
      totalForks,
      topLanguages,
      topRepos: formattedRepos.slice(0, 8),
    };

    // Save to Cache
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: stats, timestamp: Date.now() })
        );
      } catch {}
    }

    return stats;
  } catch {
    return null;
  }
}

