// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import expressiveCode from 'astro-expressive-code';
import { defineConfig } from 'astro/config';
import process from 'node:process';
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs';

// Detect build platform: Netlify vs GitHub Pages vs Local / Docker
const isNetlify = Boolean(process.env.NETLIFY);
const isGitHubActions = Boolean(process.env.GITHUB_ACTIONS);
const isGitHubPages = isGitHubActions && !isNetlify;

// Extract repository name and owner when building inside GitHub Actions
const githubRepo = process.env.GITHUB_REPOSITORY || 'nivinvysakh/devlog-astro-template';
const repoOwner = process.env.GITHUB_REPOSITORY_OWNER || githubRepo.split('/')[0] || 'nivinvysakh';
const repoName = githubRepo.split('/')[1] || 'devlog-astro-template';

// If repository is a root user/org page (e.g. "username.github.io"), base is "/", otherwise "/<repo-name>/"
const isUserRootPage = repoName.endsWith('.github.io');
const githubBase = isUserRootPage ? '/' : `/${repoName}/`;

// Dynamic site URL and base path resolution
const siteUrl = isNetlify
  ? (process.env.URL || 'https://devblogsite.netlify.app')
  : isGitHubPages
  ? `https://${repoOwner}.github.io`
  : 'https://devlog.example.com';

const basePath = isGitHubPages ? githubBase : '/';

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  base: basePath,
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
  integrations: [
    expressiveCode({
      themes: ['tokyo-night'],
      useThemedScrollbars: true,
      styleOverrides: {
        borderRadius: '1rem',
        borderWidth: '1px',
        borderColor: 'rgba(255, 255, 255, 0.15)',
        codeFontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        uiFontFamily: '"Space Grotesk", "Plus Jakarta Sans", system-ui, sans-serif',
      },
    }),
    mdx(),
    sitemap(),
  ],
  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
  },
});
