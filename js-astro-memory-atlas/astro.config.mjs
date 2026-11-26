import { defineConfig } from 'astro/config';
import { getConfiguredBasePath, SITE_CONFIG } from './src/config/site.js';

const basePath = getConfiguredBasePath();

export default defineConfig({
  ...(SITE_CONFIG.siteUrl ? { site: SITE_CONFIG.siteUrl } : {}),
  output: 'static',
  outDir: './dist',
  devToolbar: { enabled: false },
  image: { dangerouslyProcessSVG: true },
  base: basePath === '/' ? undefined : basePath.replace(/\/$/, ''),
});
