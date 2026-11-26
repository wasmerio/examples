/**
 * Global configuration for GitHub organization and repositories
 */

import type { ProjectConfig } from "./lib/types";

/**
 * Main configuration object for the project board.
 * Customize the values below to fit your GitHub organization and preferences.
 */
export const config: ProjectConfig = {
  organization: 'withstudiocms',
  githubToken: process.env.GITHUB_TOKEN,
  allowedRepositories: ['studiocms', 'cfetch', 'bots', 'docs', 'ui', 'expressive-code-twoslash', 'studiocms.dev'],
  maxItemsPerPage: 100,
  enableDiscussions: true,
  excludedUsers: ['renovate[bot]'], // Add usernames to filter out (e.g., ['dependabot', 'renovate-bot', 'github-actions[bot]'])
  defaultRepository: 'studiocms', // Optional: Set default selected repository
  roadmapRepository: 'roadmap',
  roadmapCategoryLabels: {
    discussions: 'Stage 1: Proposals',
    issues: 'Stage 2: Accepted Proposals',
    pullRequests: 'Stage 3: RFC & Development'
  },
  openGraph: {
    index: {
        titleTemplate: `{{org}} Project Board`,
        descriptionTemplate: `A project board for {{org}} GitHub issues, pull requests, and discussions.`
    },
    roadmap: {
        titleTemplate: `{{org}} Project Roadmap`,
        descriptionTemplate: `A roadmap for upcoming features and improvements. Stay tuned for what's next!`
    }
  },
  
  // Sort repositories alphabetically (a-z)
  repositorySort: (a, b) => a.localeCompare(b),
  
  // Alternative sorting examples:
  // Reverse alphabetical: (a, b) => b.localeCompare(a)
  // Case-insensitive: (a, b) => a.toLowerCase().localeCompare(b.toLowerCase())
  // Custom priority order:
  // repositorySort: (a, b) => {
  //   const priority = ['studiocms', 'docs', 'ui'];
  //   const aIndex = priority.indexOf(a);
  //   const bIndex = priority.indexOf(b);
  //   if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
  //   if (aIndex !== -1) return -1;
  //   if (bIndex !== -1) return 1;
  //   return a.localeCompare(b);
  // },
};
