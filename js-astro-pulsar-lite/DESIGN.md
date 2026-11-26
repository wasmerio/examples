# Pulsar Lite — Design Contract

Pulsar Lite is the free, MIT-licensed variant of [Pulsar](https://cometthemes.lemonsqueezy.com/checkout/buy/cc506d0c-a002-4803-ae0c-076b8de1a479), an Astro theme for devtool/API companies: landing page + blog. The demo brand is **Vega**, a fictional API platform. Every page must look like one designer made it. **Quality bar: Tailwind Plus "Protocol". Every screenshot must visibly beat the free ScrewFast theme.**

## Stack

Astro 6.4 + Tailwind CSS 4.3 (via `@tailwindcss/vite`). Zero UI frameworks — `.astro` components only, no React/Vue/client JS unless truly needed (then vanilla `<script>`). Fonts are self-hosted via `@fontsource-variable/inter` and `@fontsource-variable/jetbrains-mono`, already imported in `BaseLayout.astro`.

**Never add dependencies or touch `package.json`/`pnpm-lock.yaml`.**

## Tokens (defined in `src/styles/global.css` — use these, never raw hex)

| Token | Value | Use |
|---|---|---|
| `bg-ink` | #0a0a0f | page background |
| `bg-ink-2` | #0e0e16 | alternate section bg, footer |
| `bg-panel` / `bg-panel-2` | #13131d / #181826 | cards, raised surfaces |
| `border-line` / `border-line-2` | white 8% / 14% | all hairlines; hover state |
| `text-fg` | #f5f5f8 | headings, emphasized |
| `text-fg-2` | #a0a0b4 | body copy |
| `text-fg-3` | #6e6e82 | captions, meta |
| `brand` / `brand-bright` | #8b5cf6 / #a78bfa | violet accent |
| `accent` / `accent-bright` | #22d3ee / #67e8f9 | cyan accent |
| `font-sans` / `font-mono` | Inter / JetBrains Mono | all text / code+labels |

Utilities: `text-gradient` (violet→cyan clipped text — use on ONE word/phrase per heading, sparingly), `glass` (translucent panel + hairline + blur), `shadow-glow` (CTA glow), `ring-line`.

## Components (in `src/components/`)

- `Container.astro` — max-w-6xl wrapper. Every section uses it.
- `Button.astro` — `variant`: primary (gradient), secondary (panel), ghost; `size`: sm/md/lg. Never hand-roll buttons.
- `Glow.astro` — decorative radial glow, absolutely positioned (parent needs `relative overflow-hidden`). Use at most one or two per page.
- `Logo.astro`, `Nav.astro`, `Footer.astro`, `layouts/BaseLayout.astro` (props: `title`, `description`).
- Code highlighting: `import { Code } from 'astro:components'` + `import codeTheme from '@shikijs/themes/catppuccin-mocha'`, then `<Code code={...} lang="ts" theme={codeTheme} />`. `.astro-code` background is already transparent — wrap in a `glass` panel. See `home/Hero.astro` for the canonical pattern. Markdown fences (blog posts) render through Astro's built-in Shiki with the same theme (`markdown.shikiConfig` in `astro.config.mjs`) and get the glass treatment from the `.prose pre` rules in `pages/blog/[slug].astro`.

## Visual language

- Sections: `py-20 sm:py-28`. Eyebrow label (mono, text-[13px], uppercase tracking-widest, text-fg-3) → heading (text-3xl sm:text-4xl font-semibold tracking-tight) → one-paragraph lede (text-fg-2, max-w-xl) → content.
- Cards: `rounded-xl border border-line bg-panel p-6`, hover `border-line-2` + subtle `bg-panel-2` transition. No heavy drop shadows except under the hero code panel.
- Radii: rounded-lg buttons/inputs, rounded-xl cards/panels. Borders are ALWAYS 1px hairlines.
- Icons: inline SVG, 16–20px, `stroke-width="1.5"`, currentColor. No icon library, no emoji as icons.
- Restraint is the aesthetic: lots of black space, one glow per viewport, gradient only on CTAs/one heading word/small accents. When in doubt, remove.
- Light mode is NOT in scope for v1 (`html.dark` is fixed); don't add toggles.

## Voice (Vega demo copy)

Confident, concise, developer-to-developer. No exclamation marks, no "supercharge/unleash/blazingly". Concrete numbers over adjectives ("42ms p99", "28 regions", "1.2s builds"). Product facts to stay consistent with: Vega = API platform; global deploys to 28 regions; built-in edge caching with SWR; request-level observability/tracing; CLI `vega deploy`; SDK `@vega/sdk`; current version 2.0. Pricing tiers: Free ($0, 100k req/mo, 3 regions), Pro ($20/seat/mo, 10M req/mo, all regions, tracing), Scale ($250/mo, unlimited, SSO, SLA, support).

## Accessibility & quality bar

- Real focus states (`focus-visible:outline-2 focus-visible:outline-brand`), semantic landmarks, alt text, `aria-label` on icon-only links.
- Text contrast ≥ 4.5:1 against its background (fg-3 only for non-essential meta text).
- Responsive at 360px, 768px, 1280px. No horizontal scroll, ever.
- `pnpm build` must pass with zero warnings from your files.
