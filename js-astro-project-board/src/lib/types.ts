/**
 * Types for the project configuration
 * 
 * This file defines the TypeScript interfaces for the project configuration object used in the application.
 * It ensures that the configuration adheres to the expected structure and provides type safety when accessing configuration properties.
 * 
 * @module types
 */


/**
 * Type definitions for the project configuration
 */
export interface ProjectConfig {
  /** GitHub organization name */
  organization: string;
  
  /** 
   * GitHub Personal Access Token (optional but recommended)
   * Get one at: https://github.com/settings/tokens
   * Scopes needed: public_repo (for public repos) or repo (for private)
   */
  githubToken?: string;
  
  /** 
   * List of allowed repositories to display.
   * Leave empty to show all repositories in the organization.
   */
  allowedRepositories: string[];
  
  /** 
   * Maximum number of items to fetch per request.
   * Higher values may cause slower page loads.
   */
  maxItemsPerPage: number;
  
  /**
   * Enable/disable fetching discussions
   * Requires GraphQL API and GitHub token
   */
  enableDiscussions: boolean;
  
  /**
   * List of GitHub usernames to exclude from results
   * Useful for filtering out bot accounts or automation users
   * Example: ['dependabot', 'renovate-bot', 'github-actions[bot]']
   */
  excludedUsers?: string[];
  
  /**
   * Name of the roadmap repository
   * This repository will be displayed on the /roadmap page
   */
  roadmapRepository: string;
  
  /**
   * Default repository to show on initial page load
   * Leave empty to show first repository alphabetically
   */
  defaultRepository?: string;
  
  /**
   * Function to sort repositories
   * Default: Alphabetically ascending (a-z)
   * Examples:
   * - Descending: (a, b) => b.localeCompare(a)
   * - Case-insensitive: (a, b) => a.toLowerCase().localeCompare(b.toLowerCase())
   * - Custom order: (a, b) => { const order = ['repo1', 'repo2']; return order.indexOf(a) - order.indexOf(b); }
   */
  repositorySort: (a: string, b: string) => number;

  /**
   * Optional custom labels for roadmap items
   * If not provided, defaults to "Discussions", "Issues", and "Pull Requests"
   */
  roadmapCategoryLabels?: {
    /**
     * Label for discussion items
     */
    discussions?: string;

    /**
     * Label for issue items
     */
    issues?: string;

    /**
     * Label for pull request items
     */
    pullRequests?: string;
  }

  /**
   * Open Graph metadata templates for dynamic image generation
   * Used by the OG image generation route to create custom images for social sharing
   * Supports placeholders like {{org}} which will be replaced with the organization name
   */
  openGraph: {
    // Hex color code for the theme color meta tag (e.g. #1d4ed8)
    /**
     * Theme color for the website, used in the meta tag and can be used in OG images
     * Example: `#1d4ed8`
     */
    themeColor?: `#${string}`;

    /**
     * Optional favicon configuration for the website
     */
    favicon?: {
      /**
       * Path to the favicon image, relative to the public directory
       * Example: `/favicon.svg`
       * 
       * Note: Make sure to include the leading slash and that the file exists in the public directory.
       */
      path: string;

      /**
       * MIME type of the favicon image
       * Example: `image/svg+xml` for SVG files, `image/png` for PNG files
       * 
       * Note: This should match the actual file type of the favicon image.
       */
      type: string;
    } 

    /**
     * Templates for the index page OG image
     */
    index: {
        /**
         * Title template for the index page OG image
         * 
         * Example: `{{org}} Project Board`
         */
        titleTemplate: string;

        /**
         * Description template for the index page OG image
         * 
         * Example: `A project board for {{org}} GitHub repositories, issues, pull requests, and discussions. Built with Astro and GitHub's GraphQL API.`
         */
        descriptionTemplate: string;
    },

    /**
     * Templates for the roadmap page OG image
     */
    roadmap: {
        
        /**
         * Title template for the roadmap page OG image
         * 
         * Example: `{{org}} Project Roadmap`
         */
        titleTemplate: string;

        /**
         * Description template for the roadmap page OG image
         * 
         * Example: `A roadmap for upcoming features and improvements for {{org}}. Stay tuned for what's next!`
         */
        descriptionTemplate: string; 
    }
  }
}