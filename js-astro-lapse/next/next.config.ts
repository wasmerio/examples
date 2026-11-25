import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Keep Turbopack from walking up past this folder looking for a workspace root.
  turbopack: { root: __dirname },
  output: 'export', // fully static, same as the Astro build
  trailingSlash: true, // /about/, like the Astro build's URLs, canonicals and sitemap
  images: { unoptimized: true },
  // One small stylesheet: put it inside the page instead of a render-blocking request.
  experimental: { inlineCss: true },
  // The Markdown renderer is a native module; load it from node_modules at build time.
  serverExternalPackages: ['satteri'],
};

export default nextConfig;
