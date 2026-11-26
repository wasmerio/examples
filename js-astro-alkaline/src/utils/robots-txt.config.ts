//No need to make any changes here: This is the configuration for the robots.txt file, which is used to control and manage how search engines crawl and index your website.

import type { RobotsTxtOptions } from 'astro-robots-txt';
import { SITE } from '../alkaline.config';

const robotsConfig: RobotsTxtOptions = {
  policy: [
    {
      userAgent: '*',
      // The next line enables or disables the crawling on the `robots.txt` level
      disallow: SITE.disableIndexing ? '/' : '',
    },
  ],
  sitemapBaseFileName: 'sitemap-index', // default 'sitemap-index'
  transform(content) {
    const commentsList = [`${SITE.disableIndexing ? 'No indexing' : 'Indexing'}`, 'Build Date: ' + new Date().toISOString()];
    const comments = commentsList.map((item) => `# ${item}.`).join('\n');
    return `${comments}\n\n${content}`;
  },
};

export default robotsConfig;
