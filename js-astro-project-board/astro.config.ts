import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// Example of using environment variable from deployment platform to set the site URL in production, and a localhost URL in development
const primarySiteDomain = process.env.NODE_ENV === 'production'
  ? process.env.DOKPLOY_DEPLOY_URL : 'project-board-demo.studiocms.dev';

// https://astro.build/config
export default defineConfig({
  site: `https://${primarySiteDomain}`,
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  security: {
    allowedDomains: [
      {
        hostname: '*.studiocms.dev',
      },
    ]
  },
});