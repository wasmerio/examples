// @ts-check
import { defineConfig } from 'astro/config';

// Florin builds at the site root by default. Set FLORIN_BASE to mount it under
// a sub-path (veritheme.com/florin/ hosts the live demo this way):
//   FLORIN_BASE=/florin/ npm run build
// In-app links go through src/lib/url.ts, so both modes stay correct.
const base = process.env.FLORIN_BASE || '/';
const prefix = base.replace(/\/$/, '');

export default defineConfig({
  base,
  redirects: {
    '/': `${prefix}/overview/`,
  },
});
