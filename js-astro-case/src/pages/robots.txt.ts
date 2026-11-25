/**
 * Robots.txt API Route
 * 
 * Dynamically generates the robots.txt file for search engine crawlers.
 * Allows all user agents to crawl the entire site and provides the sitemap location.
 * 
 * Features:
 * - Allows all crawlers (User-agent: *)
 * - Permits crawling of all paths (Allow: /)
 * - References the sitemap for better indexing
 * - Normalizes site URL (removes trailing slash)
 * - Returns proper text/plain content type
 * 
 * Route: /robots.txt
 * 
 * @example
 * Generated output:
 * ```
 * User-agent: *
 * Allow: /
 * 
 * Sitemap: https://example.com/sitemap-index.xml
 * ```
 */

import type { APIRoute } from 'astro';
import { siteConfig } from '../config';

/**
 * GET handler for robots.txt
 * 
 * Generates the robots.txt content dynamically using the site URL from configuration.
 * Normalizes the URL by removing trailing slashes to ensure consistent sitemap URLs.
 * 
 * @returns Response with robots.txt content and text/plain content type
 */
export const GET: APIRoute = () => {
  /**
   * Normalizes the site URL by removing trailing slash
   * 
   * Ensures the sitemap URL is consistently formatted without double slashes.
   */
  const siteUrl = siteConfig.url.endsWith('/') 
    ? siteConfig.url.slice(0, -1) 
    : siteConfig.url;

  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap-index.xml
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
