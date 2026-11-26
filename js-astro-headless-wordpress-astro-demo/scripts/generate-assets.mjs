import fs from 'node:fs';
import path from 'node:path';

const outDir = '/Users/kyguney/Project-Datas/Rkxdesign/headless-wordpress-astro-demo/public/images';

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// 1. Author Avatars
const authors = [
  { file: 'authors/marcus.svg', name: 'MV', title: 'Marcus Vance', bg: '#1e293b', fg: '#f8fafc', accent: '#3b82f6' },
  { file: 'authors/elena.svg', name: 'ER', title: 'Elena Rostova', bg: '#0f172a', fg: '#f8fafc', accent: '#10b981' },
  { file: 'authors/david.svg', name: 'DC', title: 'David Chen', bg: '#18181b', fg: '#f8fafc', accent: '#f59e0b' }
];

authors.forEach(({ file, name, bg, fg, accent }) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
    <defs>
      <linearGradient id="grad-${name}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg}" />
        <stop offset="100%" stop-color="#020617" />
      </linearGradient>
    </defs>
    <rect width="160" height="160" rx="80" fill="url(#grad-${name})" />
    <circle cx="80" cy="80" r="76" fill="none" stroke="${accent}" stroke-width="3" stroke-opacity="0.4" />
    <text x="80" y="93" fill="${fg}" font-family="system-ui, -apple-system, sans-serif" font-size="44" font-weight="700" text-anchor="middle" letter-spacing="1">${name}</text>
  </svg>`;
  fs.writeFileSync(path.join(outDir, file), svg.trim());
});

// 2. Article Featured SVGs (1200x675 - 16:9 editorial standard)
const articles = [
  {
    file: 'articles/headless-architecture.svg',
    title: 'Headless WordPress Architecture',
    subtitle: 'Decoupled Publishing Pipeline • WordPress + Astro',
    tag: 'ARCHITECTURE',
    color1: '#0f172a',
    color2: '#1e1b4b',
    accent: '#6366f1',
    symbol: 'WP ➔ REST ➔ ASTRO'
  },
  {
    file: 'articles/astro-islands.svg',
    title: 'Astro Islands & Zero-JS Core',
    subtitle: 'Partial Hydration & Sub-100ms TTFB',
    tag: 'ASTRO ENGINE',
    color1: '#090d16',
    color2: '#1c1917',
    accent: '#f97316',
    symbol: 'ISLANDS // ZERO RUNTIME JS'
  },
  {
    file: 'articles/wp-rest-api.svg',
    title: 'Understanding WordPress REST API',
    subtitle: 'Endpoints, Taxonomies & Embedded Relations',
    tag: 'WP BACKEND',
    color1: '#0b1320',
    color2: '#111827',
    accent: '#0ea5e9',
    symbol: 'GET /wp-json/wp/v2/posts'
  },
  {
    file: 'articles/api-contracts.svg',
    title: 'Designing Clean API Responses',
    subtitle: 'Lean JSON Contracts & Type-Safe Payloads',
    tag: 'API DESIGN',
    color1: '#06201b',
    color2: '#022c22',
    accent: '#10b981',
    symbol: '{ id, slug, title, readingTime }'
  },
  {
    file: 'articles/ssg-vs-ssr.svg',
    title: 'SSG vs SSR in Modern Editorial',
    subtitle: 'Static Pre-Rendering vs Server Execution',
    tag: 'PERFORMANCE',
    color1: '#18181b',
    color2: '#27272a',
    accent: '#a855f7',
    symbol: 'BUILD TIME ➔ EDGE CDN'
  },
  {
    file: 'articles/custom-fields.svg',
    title: 'Custom Fields in Headless WP',
    subtitle: 'ACF Schema Modeling & Component Mapping',
    tag: 'CONTENT MODEL',
    color1: '#1a1003',
    color2: '#291804',
    accent: '#f59e0b',
    symbol: 'ACF META ➔ TYPED PROPS'
  },
  {
    file: 'articles/api-caching.svg',
    title: 'API Caching & Invalidation',
    subtitle: 'Transients, Stale-While-Revalidate & CDN Edge',
    tag: 'HIGH THROUGHPUT',
    color1: '#0c1a2e',
    color2: '#082f49',
    accent: '#38bdf8',
    symbol: 'CACHE-CONTROL: S-MAXAGE=86400'
  },
  {
    file: 'articles/maintainable-apis.svg',
    title: 'Maintainable Content APIs',
    subtitle: 'Adapter Patterns & Long-Term Stability',
    tag: 'PATTERNS',
    color1: '#1e1b4b',
    color2: '#0f172a',
    accent: '#818cf8',
    symbol: 'INTERFACE ContentAdapter<T>'
  }
];

articles.forEach(({ file, title, subtitle, tag, color1, color2, accent, symbol }) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${color1}" />
      <stop offset="100%" stop-color="${color2}" />
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1" />
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="1200" height="675" fill="url(#bg)" />
  <rect width="1200" height="675" fill="url(#grid)" />

  <!-- Accent glow orb -->
  <circle cx="950" cy="200" r="280" fill="${accent}" opacity="0.12" filter="blur(60px)" />
  <circle cx="200" cy="500" r="220" fill="${accent}" opacity="0.08" filter="blur(60px)" />

  <!-- Outer frame border -->
  <rect x="40" y="40" width="1120" height="595" rx="16" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" />

  <!-- Publication masthead pill -->
  <g transform="translate(80, 85)">
    <rect width="210" height="34" rx="17" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" stroke-width="1" />
    <circle cx="20" cy="17" r="4" fill="${accent}" />
    <text x="32" y="22" fill="#e2e8f0" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" letter-spacing="1.5">THE HEADLESS JOURNAL</text>
  </g>

  <!-- Category Badge -->
  <g transform="translate(80, 140)">
    <rect width="150" height="28" rx="4" fill="${accent}" fill-opacity="0.15" stroke="${accent}" stroke-opacity="0.4" stroke-width="1" />
    <text x="75" y="18" fill="${accent}" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700" text-anchor="middle" letter-spacing="1.5">${escapeXml(tag)}</text>
  </g>

  <!-- Main Title -->
  <text x="80" y="240" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="44" font-weight="800" letter-spacing="-0.5">${escapeXml(title)}</text>
  <text x="80" y="285" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="400">${escapeXml(subtitle)}</text>

  <!-- Center Visual Card / Code Badge -->
  <g transform="translate(80, 360)">
    <rect width="1040" height="190" rx="12" fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
    
    <!-- Code header dots -->
    <circle cx="24" cy="24" r="5" fill="#ef4444" opacity="0.7" />
    <circle cx="40" cy="24" r="5" fill="#f59e0b" opacity="0.7" />
    <circle cx="56" cy="24" r="5" fill="#10b981" opacity="0.7" />
    
    <text x="80" y="28" fill="#64748b" font-family="ui-monospace, monospace" font-size="12">system-pipeline.ts</text>
    <line x1="0" y1="44" x2="1040" y2="44" stroke="rgba(255,255,255,0.06)" stroke-width="1" />

    <!-- Code / Architecture Symbol text -->
    <text x="40" y="115" fill="${accent}" font-family="ui-monospace, monospace" font-size="26" font-weight="600" letter-spacing="0.5">${escapeXml(symbol)}</text>
    <text x="40" y="150" fill="#64748b" font-family="ui-monospace, monospace" font-size="14">// Powered by RKX API Studio • High-Performance Astro Frontend</text>
  </g>
</svg>`;
  fs.writeFileSync(path.join(outDir, file), svg.trim());
});

// 3. Default Open Graph image
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="ogbg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#ogbg)" />
  <circle cx="1000" cy="150" r="300" fill="#6366f1" opacity="0.15" />
  <rect x="60" y="60" width="1080" height="510" rx="16" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" />
  
  <text x="100" y="150" fill="#6366f1" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="800" letter-spacing="3">RKXBETA SHOWCASE</text>
  <text x="100" y="240" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="60" font-weight="800" letter-spacing="-1">The Headless Journal</text>
  <text x="100" y="300" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="400">Modern publishing, powered by WordPress and Astro.</text>

  <g transform="translate(100, 390)">
    <rect width="420" height="54" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
    <text x="210" y="34" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="600" text-anchor="middle">Demo Mode • Free Mode • Pro Mode</text>
  </g>
</svg>`;
fs.writeFileSync(path.join(outDir, 'og-default.svg'), ogSvg.trim());

console.log('Images generated successfully!');

