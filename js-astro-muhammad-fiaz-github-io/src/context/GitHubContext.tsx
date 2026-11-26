/**
 * GitHub Context Provider
 * Provides shared GitHub data across all components with centralized caching
 */

import * as React from "react";
import {
  fetchUserRepositories,
  type GitHubRepository,
} from "@/lib/github";
import { siteConfig } from "@/site.config";

interface GitHubContextType {
  repositories: GitHubRepository[];
  isLoading: boolean;
  error: string | null;
  refetch: (force?: boolean) => Promise<void>;
}

const GitHubContext = React.createContext<GitHubContextType | undefined>(
  undefined
);

export function GitHubProvider({ children }: { children: React.ReactNode }) {
  const [repositories, setRepositories] = React.useState<GitHubRepository[]>(
    []
  );
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const initialFetchDone = React.useRef(false);

  const refetch = React.useCallback(async (force = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const repos = await fetchUserRepositories(
        siteConfig.github.username,
        force
      );
      setRepositories(repos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch repositories");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch on mount
  React.useEffect(() => {
    if (!initialFetchDone.current) {
      initialFetchDone.current = true;
      refetch(false);
    }
  }, [refetch]);

  const value = React.useMemo(
    () => ({
      repositories,
      isLoading,
      error,
      refetch,
    }),
    [repositories, isLoading, error, refetch]
  );

  return (
    <GitHubContext.Provider value={value}>{children}</GitHubContext.Provider>
  );
}

export function useGitHub() {
  const context = React.useContext(GitHubContext);
  if (context === undefined) {
    throw new Error("useGitHub must be used within a GitHubProvider");
  }
  return context;
}

// Hook to get featured repos
export function useFeaturedRepos() {
  const { repositories, isLoading, error } = useGitHub();

  const featured = React.useMemo(() => {
    return repositories
      .filter((repo) => siteConfig.github.featuredRepos.includes(repo.name))
      .sort((a, b) => b.stargazers_count - a.stargazers_count);
  }, [repositories]);

  return { repos: featured, isLoading, error };
}

// Hook to get repository stats
export function useRepoStats() {
  const { repositories, isLoading } = useGitHub();

  const stats = React.useMemo(() => {
    let totalStars = 0;
    let totalForks = 0;
    const languages: Record<string, number> = {};

    for (const repo of repositories) {
      totalStars += repo.stargazers_count;
      totalForks += repo.forks_count;
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    }

    const sortedLangs = Object.entries(languages)
      .sort(([, a], [, b]) => b - a)
      .map(([lang]) => lang);

    return {
      totalRepos: repositories.length,
      totalStars,
      totalForks,
      topLanguage: sortedLangs[0] || "Unknown",
      languages: sortedLangs,
    };
  }, [repositories]);

  return { stats, isLoading };
}
