/**
 * GitHub API integration using REST API
 * Fetches issues, PRs, and discussions from GitHub
 */

import { config } from '../config';

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';

// In-memory cache with TTL
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Get data from cache if not expired
 */
function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  
  const now = Date.now();
  if (now - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  
  return entry.data as T;
}

/**
 * Store data in cache
 */
function setCache<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

export interface GitHubItem {
  id: number;
  number: number;
  title: string;
  state: string;
  created_at: string;
  updated_at: string;
  html_url: string;
  user: {
    login: string;
    avatar_url: string;
  };
  labels: Array<{
    name: string;
    color: string;
  }>;
  repository?: string;
  type: 'issue' | 'pr' | 'discussion';
}

export interface FilterOptions {
  state?: 'open' | 'closed' | 'all';
  type?: 'issue' | 'pr' | 'discussion' | 'all';
  repository?: string;
}

export interface GitHubOrganization {
  login: string;
  id: number;
  avatar_url: string;
  description: string;
  name: string;
  blog: string;
  location: string;
  email: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  html_url: string;
  created_at: string;
  updated_at: string;
}

/**
 * Make authenticated GitHub API request
 */
async function githubFetch<T>(endpoint: string): Promise<T> {
  // Check cache first
  const cacheKey = `rest:${endpoint}`;
  const cached = getCached<T>(cacheKey);
  if (cached) {
    return cached;
  }
  
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  
  if (config.githubToken) {
    headers['Authorization'] = `Bearer ${config.githubToken}`;
  }
  
  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, { headers });
  
  if (!response.ok) {
    console.error(`GitHub API error: ${response.status} ${response.statusText}`);
    throw new Error(`GitHub API request failed: ${response.statusText}`);
  }
  
  const data = await response.json() as T;
  setCache(cacheKey, data);
  return data;
}

/**
 * Make authenticated GitHub GraphQL request
 */
async function githubGraphQL<T>(query: string, variables?: Record<string, any>): Promise<T> {
  // Check cache first
  const cacheKey = `graphql:${query}:${JSON.stringify(variables || {})}`;
  const cached = getCached<T>(cacheKey);
  if (cached) {
    return cached;
  }
  
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github+json',
    'Content-Type': 'application/json',
  };
  
  if (config.githubToken) {
    headers['Authorization'] = `Bearer ${config.githubToken}`;
  }
  
  const response = await fetch(GITHUB_GRAPHQL_API, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });
  
  if (!response.ok) {
    console.error(`GitHub GraphQL error: ${response.status} ${response.statusText}`);
    throw new Error(`GitHub GraphQL request failed: ${response.statusText}`);
  }
  
  const result = await response.json();
  
  if (result.errors) {
    console.error('GraphQL errors:', result.errors);
    throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
  }
  
  const data = result.data as T;
  setCache(cacheKey, data);
  return data;
}

/**
 * Build repository filter query
 * Wraps repo names in quotes if they contain special characters like dots
 */
function buildRepoFilter(org: string, allowedRepos: string[]): string {
  if (allowedRepos.length === 0) {
    return `org:${org}`;
  }
  return allowedRepos.map(repo => {
    // Quote repository names that contain dots or other special characters
    const needsQuotes = /[.\-]/.test(repo);
    return needsQuotes ? `repo:"${org}/${repo}"` : `repo:${org}/${repo}`;
  }).join(' ');
}

/**
 * Filter out items from excluded users
 */
function filterByUser(items: GitHubItem[]): GitHubItem[] {
  if (!config.excludedUsers || config.excludedUsers.length === 0) {
    return items;
  }
  
  return items.filter(item => {
    const username = item.user?.login?.toLowerCase();
    return !config.excludedUsers?.some(excluded => 
      excluded.toLowerCase() === username
    );
  });
}

/**
 * Transform GitHub issue/PR data to our format
 */
function transformGitHubItem(item: any, type: 'issue' | 'pr'): GitHubItem {
  // Extract repository name from URL or repository object
  let repoName = '';
  if (item.repository_url) {
    const parts = item.repository_url.split('/');
    repoName = parts[parts.length - 1];
  } else if (item.repository) {
    repoName = item.repository.name;
  }
  
  return {
    id: item.id,
    number: item.number,
    title: item.title,
    state: item.state,
    created_at: item.created_at,
    updated_at: item.updated_at,
    html_url: item.html_url,
    user: {
      login: item.user?.login || 'unknown',
      avatar_url: item.user?.avatar_url || '',
    },
    labels: (item.labels || []).map((label: any) => ({
      name: typeof label === 'string' ? label : label.name,
      color: typeof label === 'string' ? '000000' : label.color,
    })),
    repository: repoName,
    type,
  };
}

/**
 * Fetch issues from GitHub organization
 */
export async function fetchIssues(org: string, state: string = 'open', allowedRepos: string[] = []): Promise<GitHubItem[]> {
  try {
    // If specific repos are provided, fetch directly from each repo
    if (allowedRepos.length > 0) {
      const allIssues: GitHubItem[] = [];
      
      for (const repo of allowedRepos) {
        try {
          const stateParam = state === 'all' ? 'all' : state;
          const params = new URLSearchParams({
            state: stateParam,
            per_page: '100',
            sort: 'updated',
            direction: 'desc',
          });
          
          const issues = await githubFetch<any[]>(`/repos/${org}/${repo}/issues?${params}`);
          
          // Filter out pull requests (they appear in issues endpoint)
          const actualIssues = issues.filter((issue: any) => !issue.pull_request);
          
          allIssues.push(...actualIssues.map((item: any) => ({
            ...transformGitHubItem(item, 'issue'),
            repository: repo,
          })));
        } catch (repoError) {
          console.error(`Error fetching issues from ${org}/${repo}:`, repoError);
        }
      }
      
      return filterByUser(allIssues);
    }
    
    // Otherwise use search API for org-wide search
    const repoFilter = buildRepoFilter(org, allowedRepos);
    const stateQuery = state === 'all' ? '' : `is:${state}`;
    const query = `${repoFilter} is:issue ${stateQuery}`.trim();
    
    const params = new URLSearchParams({
      q: query,
      per_page: config.maxItemsPerPage.toString(),
      sort: 'updated',
      order: 'desc',
    });
    
    const result = await githubFetch<{ items: any[] }>(`/search/issues?${params}`);
    
    if (!result?.items) return [];
    
    const issues = result.items.map((item: any) => transformGitHubItem(item, 'issue'));
    return filterByUser(issues);
  } catch (error) {
    console.error('Error fetching issues:', error);
    return [];
  }
}

/**
 * Fetch pull requests from GitHub organization
 */
export async function fetchPullRequests(org: string, state: string = 'open', allowedRepos: string[] = []): Promise<GitHubItem[]> {
  try {
    // If specific repos are provided, fetch directly from each repo
    if (allowedRepos.length > 0) {
      const allPRs: GitHubItem[] = [];
      
      for (const repo of allowedRepos) {
        try {
          const stateParam = state === 'all' ? 'all' : state;
          const params = new URLSearchParams({
            state: stateParam,
            per_page: '100',
            sort: 'updated',
            direction: 'desc',
          });
          
          const prs = await githubFetch<any[]>(`/repos/${org}/${repo}/pulls?${params}`);
          
          allPRs.push(...prs.map((item: any) => ({
            ...transformGitHubItem(item, 'pr'),
            repository: repo,
          })));
        } catch (repoError) {
          console.error(`Error fetching PRs from ${org}/${repo}:`, repoError);
        }
      }
      
      return filterByUser(allPRs);
    }
    
    // Otherwise use search API for org-wide search
    const repoFilter = buildRepoFilter(org, allowedRepos);
    const stateQuery = state === 'all' ? '' : `is:${state}`;
    const query = `${repoFilter} is:pr ${stateQuery}`.trim();
    
    const params = new URLSearchParams({
      q: query,
      per_page: config.maxItemsPerPage.toString(),
      sort: 'updated',
      order: 'desc',
    });
    
    const result = await githubFetch<{ items: any[] }>(`/search/issues?${params}`);
    
    if (!result?.items) return [];
    
    const prs = result.items.map((item: any) => transformGitHubItem(item, 'pr'));
    return filterByUser(prs);
  } catch (error) {
    console.error('Error fetching pull requests:', error);
    return [];
  }
}

/**
 * Fetch discussions from GitHub organization
 * Uses GraphQL API to fetch discussions from repositories
 */
export async function fetchDiscussions(org: string, allowedRepos: string[] = []): Promise<GitHubItem[]> {
  try {
    // Determine which repos to fetch from
    let reposToFetch: string[];
    
    if (allowedRepos.length > 0) {
      // If specific repos are requested, use them directly
      reposToFetch = allowedRepos;
    } else {
      // Otherwise get from organization's configured repos
      reposToFetch = await getOrgRepositories(org);
    }
    
    if (reposToFetch.length === 0) return [];
    
    // Fetch discussions for each repository
    const allDiscussions: GitHubItem[] = [];
    
    for (const repo of reposToFetch) {
      try {
        const query = `
          query($owner: String!, $repo: String!) {
            repository(owner: $owner, name: $repo) {
              discussions(first: 20, orderBy: {field: UPDATED_AT, direction: DESC}) {
                nodes {
                  id
                  number
                  title
                  url
                  createdAt
                  updatedAt
                  author {
                    login
                    avatarUrl
                  }
                  labels(first: 10) {
                    nodes {
                      name
                      color
                    }
                  }
                  closed
                  closedAt
                }
              }
            }
          }
        `;
        
        const result = await githubGraphQL<{
          repository: {
            discussions: {
              nodes: Array<{
                id: string;
                number: number;
                title: string;
                url: string;
                createdAt: string;
                updatedAt: string;
                author: { login: string; avatarUrl: string } | null;
                labels: { nodes: Array<{ name: string; color: string }> };
                closed: boolean;
                closedAt: string | null;
              }>;
            };
          };
        }>(query, { owner: org, repo });
        
        if (result?.repository?.discussions?.nodes) {
          const discussions = result.repository.discussions.nodes.map((disc) => ({
            id: parseInt(disc.id.replace(/\D/g, '')) || 0,
            number: disc.number,
            title: disc.title,
            state: disc.closed ? 'closed' : 'open',
            created_at: disc.createdAt,
            updated_at: disc.updatedAt,
            html_url: disc.url,
            user: {
              login: disc.author?.login || 'unknown',
              avatar_url: disc.author?.avatarUrl || '',
            },
            labels: disc.labels.nodes.map((label) => ({
              name: label.name,
              color: label.color,
            })),
            repository: repo,
            type: 'discussion' as const,
          }));
          
          allDiscussions.push(...discussions);
        }
      } catch (repoError) {
        console.error(`Error fetching discussions for ${repo}:`, repoError);
        // Continue with other repositories
      }
    }
    
    return filterByUser(allDiscussions);
  } catch (error) {
    console.error('Error fetching discussions:', error);
    return [];
  }
}

/**
 * Get all repositories for an organization
 * Filters to allowedRepositories if configured
 */
export async function getOrgRepositories(org: string): Promise<string[]> {
  try {
    // Fetch all repositories from GitHub
    const params = new URLSearchParams({
      q: `org:${org}`,
      per_page: '100',
      sort: 'updated',
      order: 'desc',
    });
    
    const result = await githubFetch<{ items: any[] }>(`/search/repositories?${params}`);
    
    if (!result?.items) return [];
    
    const allRepos = result.items.map((repo: any) => repo.name).filter(Boolean);
    
    // If allowedRepositories is configured, filter to only show those that exist
    if (config.allowedRepositories.length > 0) {
      return allRepos.filter(repo => config.allowedRepositories.includes(repo));
    }
    
    return allRepos;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return [];
  }
}

/**
 * Unified function to fetch all GitHub items with filtering
 */
export async function fetchAllItems(
  org: string,
  options: FilterOptions = {}
): Promise<GitHubItem[]> {
  const { state = 'open', type = 'all', repository } = options;
  const allowedRepos = config.allowedRepositories;
  
  const items: GitHubItem[] = [];
  
  // Fetch based on type filter
  if (type === 'all' || type === 'issue') {
    const issues = await fetchIssues(org, state, allowedRepos);
    items.push(...issues);
  }
  
  if (type === 'all' || type === 'pr') {
    const prs = await fetchPullRequests(org, state, allowedRepos);
    items.push(...prs);
  }
  
  if ((type === 'all' || type === 'discussion') && config.enableDiscussions) {
    const discussions = await fetchDiscussions(org, allowedRepos);
    items.push(...discussions);
  }
  
  // Filter by specific repository if requested
  let filteredItems = items;
  if (repository && repository !== 'all') {
    filteredItems = items.filter(item => item.repository === repository);
  }
  
  // Sort by updated date, most recent first
  return filteredItems.sort((a, b) => 
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
}

/**
 * Fetch organization details including avatar
 */
export async function fetchOrganization(org: string): Promise<GitHubOrganization | null> {
  try {
    return await githubFetch<GitHubOrganization>(`/orgs/${org}`);
  } catch (error) {
    console.error(`Failed to fetch organization ${org}:`, error);
    return null;
  }
}

/**
 * Fetch repository README content
 */
export async function fetchReadme(org: string, repo: string): Promise<string | null> {
  try {
    const response = await githubFetch<{ content: string; encoding: string }>(`/repos/${org}/${repo}/readme`);
    
    // GitHub API returns base64 encoded content
    if (response.encoding === 'base64') {
      return atob(response.content.replace(/\n/g, ''));
    }
    
    return response.content;
  } catch (error) {
    console.error(`Failed to fetch README for ${org}/${repo}:`, error);
    return null;
  }
}
