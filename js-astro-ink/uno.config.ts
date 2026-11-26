import type { TypographyOptions } from '@unocss/preset-typography'
import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetWind3,
  transformerDirectives
} from 'unocss'

/**
 * astro-theme-ink
 * Warm "ink on paper" design system.
 *
 * Colors live in CSS custom properties (see src/assets/styles/tokens.css)
 * and are mapped into UnoCSS theme here, so utilities like
 * `bg-paper text-ink border-line` work everywhere.
 */

const ink = 'hsl(var(--ink) / var(--un-text-opacity, 1))'
const inkSoft = 'hsl(var(--ink-soft) / var(--un-text-opacity, 1))'
const accent = 'hsl(var(--accent) / var(--un-text-opacity, 1))'
const line = 'var(--un-default-border-color)'

/**
 * Article typography.
 * Note: preset-typography emits `:where(...)` selectors that are global unless
 * content is wrapped in `.not-prose`. All rules below are scoped to `.prose`,
 * and site chrome (header/footer/cards) carries the `not-prose` class.
 */
const typography: TypographyOptions = {
  selectorName: 'prose',
  colorScheme: {
    body: 'var(--ink-body)',
    headings: ink,
    links: ink,
    bold: ink,
    counters: 'hsl(var(--ink-soft) / 0.7)',
    bullets: 'hsl(var(--ink-soft) / 0.5)',
    hr: 'hsl(var(--line) / 1)',
    quotes: inkSoft,
    'quote-borders': 'hsl(var(--accent) / 0.45)',
    kbd: ink,
    code: ink,
    'pre-code': inkSoft,
    'th-borders': line,
    'td-borders': line
  },
  cssExtend: {
    // Root typography lives in global.css: cssExtend targets descendants.
    // Keep the main headings editorial and technical subsections easy to scan.
    '.prose h1,.prose h2,.prose h3,.prose h4,.prose h5,.prose h6': {
      'font-weight': '600',
      'letter-spacing': '0.01em',
      'line-height': '1.35',
      'text-wrap': 'balance'
    },
    // Give heading links and legacy fragment targets clearance below the sticky header.
    '.prose [id]': { 'scroll-margin-top': '5.5rem' },
    '.prose h1,.prose h2,.prose h5,.prose h6': { 'font-family': 'var(--font-serif)' },
    '.prose h3,.prose h4': { 'font-family': 'var(--font-sans)' },
    '.prose h2': { 'margin-top': '2.4em', 'margin-bottom': '0.9em' },
    '.prose h3': { 'margin-top': '2em', 'margin-bottom': '0.7em' },
    '.prose h4': { 'margin-top': '1.6em', 'margin-bottom': '0.5em' },
    '.prose p': { 'margin-block': '1.05em' },

    // Links remain recognizable on touch devices, with stronger emphasis on interaction.
    '.prose a': {
      'font-weight': '500',
      color: ink,
      'text-decoration': 'underline',
      'text-decoration-color': 'hsl(var(--accent) / 0.45)',
      'text-decoration-thickness': '1px',
      'text-underline-offset': '0.18em',
      transition: 'color 0.2s ease, text-decoration-color 0.2s ease',
      'word-break': 'break-word'
    },
    '.prose a:hover,.prose a:focus-visible': {
      color: accent,
      'text-decoration-color': 'hsl(var(--accent) / 0.9)'
    },
    '.prose :is(h1,h2,h3,h4,h5,h6) a': { 'font-weight': 'inherit' },

    // Inline code in running text; fenced blocks retain their Shiki styling.
    '.prose :not(pre) > code': {
      'font-family': 'var(--font-mono)',
      'font-size': '0.86em',
      'font-weight': '500',
      padding: '0.06em 0.24em',
      'border-radius': '0.2em',
      'background-color': 'hsl(var(--wash) / 0.75)',
      'box-decoration-break': 'clone',
      'white-space': 'pre-wrap',
      'word-break': 'normal',
      'overflow-wrap': 'anywhere'
    },
    '.prose :not(pre) > code::before': { content: 'none' },
    '.prose :not(pre) > code::after': { content: 'none' },

    // Blockquote: a quiet margin rule, with upright text for comfortable CJK reading.
    '.prose blockquote': {
      'font-family': 'var(--font-serif)',
      'font-style': 'normal',
      'font-weight': '400',
      'border-inline-start': '2px solid hsl(var(--accent) / 0.35)',
      'border-radius': '0',
      'background-color': 'transparent',
      'box-shadow': 'none',
      'padding-block': '0.1rem',
      'padding-inline': '1.2rem'
    },

    // Lists: custom elegant markers
    '.prose ul': { 'list-style': 'none', 'padding-inline-start': '0.2rem' },
    '.prose ul > li': {
      position: 'relative',
      'padding-inline-start': '1.35em',
      'margin-block': '0.4em'
    },
    '.prose ul > li::before': {
      content: '""',
      position: 'absolute',
      'inset-inline-start': '0.1em',
      top: '0.66em',
      width: '0.38em',
      height: '0.38em',
      'border-radius': '999px',
      'background-color': 'hsl(var(--accent) / 0.6)'
    },
    '.prose ol': {
      'list-style': 'none',
      'padding-inline-start': '0.2rem',
      'counter-reset': 'ink-ol'
    },
    '.prose ol > li': {
      'counter-increment': 'ink-ol',
      position: 'relative',
      'padding-inline-start': '1.75em',
      'margin-block': '0.4em'
    },
    '.prose ol > li::before': {
      content: 'counter(ink-ol)',
      position: 'absolute',
      'inset-inline-start': '0',
      top: '0.1em',
      'font-family': 'var(--font-serif)',
      'font-weight': '600',
      'font-size': '0.88em',
      color: 'hsl(var(--accent) / 0.85)',
      'min-width': '1.5em',
      'text-align': 'end'
    },
    '.prose ul ul,.prose ol ul,.prose ul ol,.prose ol ol': {
      'padding-inline-start': '0.4em',
      'margin-block': '0.2em'
    },

    // Horizontal rule: fading hairline
    '.prose hr': {
      border: 'none',
      height: '1px',
      width: '65%',
      margin: '2.5em auto',
      background: 'linear-gradient(to right, transparent, hsl(var(--line) / 1), transparent)'
    },

    // Tables: hairline rows only, hover highlight
    '.prose table': {
      'font-size': '0.9em',
      display: 'block',
      'overflow-x': 'auto',
      'border-collapse': 'collapse'
    },
    '.prose thead th': {
      'font-weight': '600',
      color: ink,
      'background-color': 'hsl(var(--wash) / 0.6)',
      'white-space': 'nowrap'
    },
    '.prose td,.prose th': { border: 'none', padding: '0.55em 1em' },
    '.prose tbody tr': {
      'border-top': '1px solid hsl(var(--line) / 1)',
      transition: 'background-color 0.15s ease'
    },
    '.prose tbody tr:hover': { 'background-color': 'hsl(var(--wash) / 0.5)' },

    // Images & captions
    '.prose figure': { margin: '1.8em auto' },
    '.prose figure > img,.prose figure > .lb-trigger': { margin: '0 auto' },
    '.prose img': {
      'border-radius': 'calc(var(--radius) * 1.25)',
      margin: '1.5em auto',
      'box-shadow': '0 1px 2px hsl(var(--ink) / 0.05), 0 14px 36px -18px hsl(var(--ink) / 0.18)'
    },
    '.prose figcaption': {
      'text-align': 'center',
      'font-size': '0.85em',
      'line-height': '1.5',
      color: 'hsl(var(--ink-soft) / 1)',
      'margin-top': '0.4em'
    },

    // Strong & emphasized
    '.prose strong': { 'font-weight': '600', color: ink },
    '.prose em': { 'font-style': 'italic' },

    // Keyboard keys
    '.prose kbd': {
      'font-family': 'var(--font-mono)',
      'border-radius': '0.3em',
      'border-color': line,
      'box-shadow': '0 2px 0 hsl(var(--line) / 1)',
      padding: '0.15em 0.45em'
    },

    // Footnote refs
    '.prose sup a': { 'scroll-margin-top': '5rem' }
  }
}

export default defineConfig({
  presets: [
    presetWind3(),
    presetTypography(typography),
    presetIcons({
      collections: {
        lucide: () =>
          import('@iconify-json/lucide/icons.json').then((m) => (m.default || m) as never)
      },
      scale: 1.1,
      warn: true
    })
  ],
  transformers: [transformerDirectives()],
  theme: {
    colors: {
      // Surface & text
      paper: 'hsl(var(--paper) / <alpha-value>)',
      ink: 'hsl(var(--ink) / <alpha-value>)',
      'ink-soft': 'hsl(var(--ink-soft) / <alpha-value>)',
      'ink-body': 'var(--ink-body)',
      // Muted surface
      wash: 'hsl(var(--wash) / <alpha-value>)',
      card: 'hsl(var(--card) / <alpha-value>)',
      // Accent (brand)
      accent: 'hsl(var(--accent) / <alpha-value>)',
      ring: 'hsl(var(--ring) / <alpha-value>)',
      // Borders
      line: 'hsl(var(--line) / <alpha-value>)'
    },
    fontFamily: {
      serif: 'var(--font-serif)',
      sans: 'var(--font-sans)',
      mono: 'var(--font-mono)'
    }
  },
  shortcuts: {
    // Article lists use open rows; other card-based components keep their own surfaces.
    'post-row': 'border-b border-line/60 py-6 last:border-b-0 sm:py-7',
    'tag-link':
      'inline-flex min-h-6 items-center gap-1 text-xs text-ink-soft underline-offset-4 transition-colors duration-200 hover:text-accent hover:underline focus-visible:text-accent focus-visible:underline',
    // Paper card
    'paper-card':
      'rounded-xl border border-line bg-card/60 transition-all duration-300 hover:border-accent/40 hover:shadow-sm',
    // Pill chip (tags, meta)
    chip: 'inline-flex items-center gap-1 rounded-full border border-line bg-wash px-2.5 py-0.5 text-xs text-ink-soft transition-colors duration-200 hover:border-accent/50 hover:text-accent',
    // Text link with underline animation
    'link-ink':
      'underline decoration-accent/35 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent/80',
    // Icon-only link (add a size utility, e.g. `size-8`)
    'icon-link':
      'inline-flex items-center justify-center rounded-lg text-ink-soft transition-colors duration-200 hover:bg-wash hover:text-accent'
  },
  // Classes referenced only through config lookups (SOCIAL_ICONS in
  // src/utils/index.ts) are invisible to the scanners — generate them explicitly.
  safelist: [
    'i-lucide-github',
    'i-lucide-gitlab',
    'i-lucide-rss',
    'i-lucide-mail',
    'i-lucide-twitter',
    'i-lucide-globe',
    'i-lucide-link'
  ]
})
