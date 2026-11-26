import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { GitHubRepository } from "@/lib/github";
import { CACHE_DURATION } from "@/lib/cache";

type SortOption = "stars" | "forks" | "updated" | "name" | "created";
type SortDirection = "asc" | "desc";

interface ProjectsFilters {
  search: string;
  language: string;
  sort: SortOption;
  direction: SortDirection;
  showForks: boolean;
  showArchived: boolean;
}

interface ProjectsState {
  repositories: GitHubRepository[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  filters: ProjectsFilters;
  currentPage: number;
  perPage: number;
  setRepositories: (repos: GitHubRepository[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setLastFetched: (timestamp: number) => void;
  setSearch: (search: string) => void;
  setLanguage: (language: string) => void;
  setSort: (sort: SortOption) => void;
  setSortDirection: (direction: SortDirection) => void;
  toggleSortDirection: () => void;
  setShowForks: (show: boolean) => void;
  setShowArchived: (show: boolean) => void;
  resetFilters: () => void;
  setCurrentPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  shouldRefetch: () => boolean;
}

const defaultFilters: ProjectsFilters = {
  search: "",
  language: "",
  sort: "stars",
  direction: "desc",
  showForks: true,
  showArchived: false
};

export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set, get) => ({
      repositories: [],
      isLoading: false,
      error: null,
      lastFetched: null,
      filters: defaultFilters,
      currentPage: 1,
      perPage: 12,

      setRepositories: (repos) =>
        set({ repositories: repos, error: null, isLoading: false }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error, isLoading: false }),
      setLastFetched: (timestamp) => set({ lastFetched: timestamp }),

      setSearch: (search) =>
        set((state) => ({
          filters: { ...state.filters, search },
          currentPage: 1
        })),
      setLanguage: (language) =>
        set((state) => ({
          filters: { ...state.filters, language },
          currentPage: 1
        })),
      setSort: (sort) =>
        set((state) => ({
          filters: { ...state.filters, sort },
          currentPage: 1
        })),
      setSortDirection: (direction) =>
        set((state) => ({
          filters: { ...state.filters, direction }
        })),
      toggleSortDirection: () =>
        set((state) => ({
          filters: {
            ...state.filters,
            direction: state.filters.direction === "asc" ? "desc" : "asc"
          }
        })),
      setShowForks: (show) =>
        set((state) => ({
          filters: { ...state.filters, showForks: show },
          currentPage: 1
        })),
      setShowArchived: (show) =>
        set((state) => ({
          filters: { ...state.filters, showArchived: show },
          currentPage: 1
        })),
      resetFilters: () =>
        set({
          filters: defaultFilters,
          currentPage: 1
        }),

      setCurrentPage: (page) => set({ currentPage: page }),
      setPerPage: (perPage) => set({ perPage, currentPage: 1 }),
      nextPage: () =>
        set((state) => ({
          currentPage: state.currentPage + 1
        })),
      prevPage: () =>
        set((state) => ({
          currentPage: Math.max(1, state.currentPage - 1)
        })),

      shouldRefetch: () => {
        const { lastFetched } = get();
        if (!lastFetched) return true;
        return Date.now() - lastFetched > CACHE_DURATION;
      }
    }),
    {
      name: "projects-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        repositories: state.repositories,
        lastFetched: state.lastFetched,
        filters: state.filters,
        perPage: state.perPage
      })
    }
  )
);

export function useFilteredRepositories(overrideRepos?: GitHubRepository[]) {
  const { repositories, filters } = useProjectsStore();
  const sourceRepos = overrideRepos || repositories;

  return sourceRepos.filter((repo) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        repo.name.toLowerCase().includes(searchLower) ||
        repo.description?.toLowerCase().includes(searchLower) ||
        repo.topics?.some((topic) => topic.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }

    if (filters.language && repo.language?.toLowerCase() !== filters.language.toLowerCase()) {
      return false;
    }

    if (!filters.showForks && repo.fork) {
      return false;
    }

    if (!filters.showArchived && repo.archived) {
      return false;
    }

    return true;
  });
}

export function useSortedRepositories(overrideRepos?: GitHubRepository[]) {
  const filteredRepos = useFilteredRepositories(overrideRepos);
  const { filters } = useProjectsStore();

  return [...filteredRepos].sort((a, b) => {
    let aVal: number | string;
    let bVal: number | string;

    switch (filters.sort) {
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
      return filters.direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return filters.direction === "asc"
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number);
  });
}

export function usePaginatedRepositories(overrideRepos?: GitHubRepository[]) {
  const sortedRepos = useSortedRepositories(overrideRepos);
  const { currentPage, perPage } = useProjectsStore();

  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;

  return {
    repos: sortedRepos.slice(startIndex, endIndex),
    totalCount: sortedRepos.length,
    totalPages: Math.ceil(sortedRepos.length / perPage),
    hasNextPage: endIndex < sortedRepos.length,
    hasPrevPage: currentPage > 1
  };
}

export function useRepositoryStats(overrideRepos?: GitHubRepository[]) {
  const { repositories } = useProjectsStore();
  const sourceRepos = overrideRepos || repositories;

  const languages: Record<string, number> = {};
  let totalStars = 0;
  let totalForks = 0;
  let totalWatchers = 0;

  for (const repo of sourceRepos) {

    totalStars += repo.stargazers_count;
    totalForks += repo.forks_count;
    totalWatchers += repo.watchers_count;

    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
    }
  }

  const sortedLanguages = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .map(([lang, count]) => ({ language: lang, count }));

  return {
    totalRepos: repositories.length,
    totalStars,
    totalForks,
    totalWatchers,
    languages: sortedLanguages,
    topLanguage: sortedLanguages[0]?.language || "Unknown"
  };
}
