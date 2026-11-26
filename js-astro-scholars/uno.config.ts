import { readFileSync } from 'node:fs';
import {
	defineConfig,
	presetIcons,
	presetTypography,
	presetWind3,
	transformerDirectives,
} from 'unocss';
import siteConfig from './src/side.config';

// Dynamic icon names from editable data need to be available to UnoCSS at build time.
const aboutIcons =
	readFileSync(new URL('./src/data/about.yml', import.meta.url), 'utf8').match(
		/\bi-[\w:-]+/g,
	) ?? [];
const iconSafelist = [
	...siteConfig.socialLinks.map((link) => link.icon),
	...aboutIcons,
].filter((icon): icon is string => Boolean(icon && icon.startsWith('i-')));

iconSafelist.push(
	// Theme and navigation icons
	'i-ph-moon',
	'i-ph-sun',
	'i-ph-list-bold',
	'i-ph-x-bold',
	'i-ph-arrow-up-bold',
	// Page section icons
	'i-mdi:account-circle',
	'i-mdi:school',
	'i-mdi:briefcase',
	'i-mdi:account-group',
	'i-mdi:trophy',
	'i-mdi:sparkles',
	'i-mdi:tag-outline',
	'i-mdi:check-circle-outline',
	'i-mdi:certificate-outline',
	'i-mdi:check-circle',
	'i-mdi:star-outline',
	'i-mdi:medal',
	'i-mdi:bookshelf',
	'i-mdi:file-document-check',
	'i-mdi:file-document-edit',
	'i-mdi:file-document-outline',
	'i-mdi:file-document',
	'i-mdi:file-document-multiple',
	'i-mdi:text-box-outline',
	'i-mdi:open-in-new',
	'i-mdi:arrow-right',
	'i-mdi:arrow-left',
	'i-mdi:arrow-top-right',
	'i-mdi:folder-open',
	'i-mdi:code-braces',
	'i-mdi:circle',
	'i-mdi:rocket-launch',
	'i-mdi:archive',
	'i-mdi:book-education',
	'i-mdi:calendar',
	'i-mdi:calendar-blank',
	'i-mdi:calendar-check',
	'i-mdi:calendar-range',
	'i-mdi:history',
	'i-mdi:post-outline',
	'i-mdi:clock-outline',
	'i-mdi:update',
	'i-mdi:twitter',
	'i-mdi:linkedin',
	'i-mdi:content-copy',
	'i-mdi:check',
	'i-mdi:star',
	'i-mdi:calendar-clock',
	'i-mdi:chevron-down',
	'i-mdi:file-pdf-box',
	'i-ph-arrow-down',
	'i-ph-arrow-right',
);

export default defineConfig({
	// Keep this utility generated for the generated-site accessibility assertion.
	safelist: [...iconSafelist, 'min-h-10'],
	presets: [
		presetWind3(),
		presetTypography({
			cssExtend: {
				':where(p, li, blockquote)': {
					'font-family':
						"'Atkinson Hyperlegible', 'Noto Sans SC', 'Segoe UI', system-ui, sans-serif",
				},
				':where(h1, h2, h3, h4)': {
					'font-family': "'Crimson Pro', Georgia, 'Times New Roman', serif",
					'letter-spacing': '-0.015em',
				},
			},
		}),
		presetIcons({
			scale: 1.1,
			warn: true,
			cdn: 'https://esm.sh/',
			extraProperties: {
				display: 'inline-block',
				'vertical-align': 'middle',
			},
		}),
	],
	shortcuts: {
		// Page structure
		'page-stack': 'space-y-7 pb-2 sm:space-y-10 sm:pb-4',
		'page-header':
			'relative space-y-3 border-b border-paper-300/90 pb-5 pt-2 dark:border-ink-700 sm:pb-6',
		'page-title':
			'font-heading text-[2.25rem] font-semibold leading-[1.02] tracking-[-0.025em] text-ink-950 dark:text-paper-50 sm:text-[2.75rem]',
		'page-description':
			'max-w-[44rem] font-sans text-[1.0625rem] leading-7 text-ink-600 dark:text-paper-300',
		'body-copy':
			'font-sans text-base leading-7 text-ink-700 dark:text-paper-300',
		'section-heading':
			'font-heading text-2xl font-semibold leading-[1.08] tracking-[-0.015em] text-ink-900 dark:text-paper-100 sm:text-[1.75rem]',

		// Reusable editorial entry hierarchy: title → supporting text → metadata.
		'entry-title':
			'font-heading text-[1.25rem] font-semibold leading-[1.28] tracking-[-0.01em] text-ink-950 dark:text-paper-50',
		'entry-supporting':
			'font-sans text-base font-normal leading-6 text-ink-600 dark:text-paper-300',
		'entry-summary':
			'font-sans text-base font-normal leading-[1.625rem] text-ink-700 dark:text-paper-300',
		'entry-meta':
			'font-sans text-sm font-normal leading-[1.375rem] text-ink-600 dark:text-paper-300',
		'entry-index':
			'whitespace-nowrap font-mono text-xs font-semibold leading-[1.125rem] tabular-nums text-accent-700 dark:text-accent-300',

		// Restrained materials. Only the site chrome and mobile popover use real blur.
		'glass-panel':
			'relative isolate overflow-hidden rounded-xl border border-paper-300/90 dark:border-ink-700',
		'glass-popover': 'glass-panel shadow-xl',
		'glass-control':
			'relative inline-flex overflow-hidden rounded-[0.625rem] border',
		'glass-active': 'font-bold',

		// Surfaces and metadata
		'surface-card':
			'rounded-xl border border-paper-300/90 bg-white/70 p-5 shadow-paper transition-all duration-200 dark:border-ink-700/80 dark:bg-ink-900/65 sm:p-6',
		'surface-card-hover':
			'surface-card hover:-translate-y-0.5 hover:shadow-paper-lg hover:border-accent-400 focus-within:border-accent-400 dark:hover:border-accent-600 dark:hover:bg-ink-900',
		'bento-card-hero':
			'relative overflow-hidden rounded-2xl border border-accent-200/80 bg-gradient-to-br from-accent-50/50 via-white/85 to-paper-50/70 p-6 shadow-paper transition-all duration-200 hover:-translate-y-0.5 hover:shadow-paper-lg hover:border-accent-400 dark:border-accent-800/70 dark:from-accent-900/25 dark:via-ink-900/75 dark:to-ink-900/50 dark:hover:border-accent-500 sm:p-7',
		'meta-chip':
			'inline-flex min-h-7 items-center gap-1.5 rounded-md border border-paper-300 bg-paper-100/90 px-2.5 py-1 font-sans text-xs font-semibold leading-none text-ink-700 dark:border-ink-700 dark:bg-ink-800 dark:text-paper-300',
		'scholarly-pill':
			'inline-flex min-h-6 items-center gap-1 rounded border border-paper-300/80 bg-paper-100/60 px-2 py-0.5 font-mono text-[11px] font-medium text-ink-600 dark:border-ink-700/80 dark:bg-ink-800/50 dark:text-paper-300',
		'chip-status-active':
			'inline-flex min-h-7 items-center gap-1.5 rounded-md border border-emerald-300/50 bg-emerald-50/85 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:border-emerald-800/50 dark:bg-emerald-950/40 dark:text-emerald-300',
		'chip-status-past':
			'inline-flex min-h-7 items-center gap-1.5 rounded-md border border-paper-300 bg-paper-100/75 px-2.5 py-1 text-xs font-semibold text-ink-600 dark:border-ink-700 dark:bg-ink-800/60 dark:text-paper-400',

		// Actions
		'action-link':
			'inline-flex min-h-11 items-center gap-1.5 rounded-md px-1 font-sans text-sm font-bold text-accent-700 no-underline underline-offset-4 transition-colors duration-200 hover:text-accent-900 hover:underline dark:text-accent-300 dark:hover:text-accent-100',
		'icon-button':
			'glass-control inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-[0.625rem] text-ink-600 transition-[background-color,border-color,color] duration-150 hover:text-accent-800 dark:text-paper-300 dark:hover:text-accent-200',

		// Compatibility aliases used by existing templates.
		'btn-primary':
			'glass-control glass-active inline-flex min-h-11 items-center gap-2 px-4 py-2 font-sans text-sm font-bold text-accent-900 no-underline transition-[background-color,border-color,color] duration-150 hover:text-ink-950 dark:text-accent-100 dark:hover:text-paper-50',
		'btn-secondary':
			'glass-control inline-flex min-h-11 items-center gap-2 px-4 py-2 font-sans text-sm font-bold text-ink-700 no-underline transition-colors duration-200 hover:text-accent-800 dark:text-paper-200 dark:hover:text-accent-200',
		'btn-ghost': 'action-link px-3',
		card: 'surface-card',
		'card-hover': 'surface-card-hover',
		'card-accent':
			'rounded-2xl border border-accent-200 bg-accent-50/75 p-4 shadow-paper dark:border-accent-800 dark:bg-accent-900/25 sm:p-5',
		chip: 'meta-chip',
		'chip-accent':
			'inline-flex min-h-7 items-center gap-1.5 rounded-md border border-accent-200 bg-accent-50 px-2.5 py-1 text-xs font-bold text-accent-800 dark:border-accent-800 dark:bg-accent-900/35 dark:text-accent-200',
		'chip-success':
			'inline-flex min-h-7 items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/35 dark:text-emerald-200',
		'section-title': 'section-heading',
		'section-subtitle': 'page-description text-sm sm:text-base sm:leading-7',
		link: 'action-link min-h-0',
		'link-muted':
			'font-sans text-ink-600 no-underline underline-offset-4 transition-colors hover:text-ink-900 hover:underline dark:text-paper-400 dark:hover:text-paper-100',
	},
	theme: {
		colors: {
			// Warm paper surfaces
			paper: {
				50: '#fbfaf6',
				100: '#f5f1e8',
				200: '#ebe4d8',
				300: '#ddd2c2',
				400: '#c1b3a0',
				500: '#aca08e',
			},
			// Warm neutral compatibility scale used throughout existing pages
			gray: {
				50: '#fbfaf6',
				100: '#f5f1e8',
				200: '#e7dfd2',
				300: '#d1c5b6',
				400: '#9a8f83',
				500: '#756b61',
				600: '#5b524a',
				700: '#423b35',
				800: '#2b2926',
				900: '#1d1c1a',
			},
			// Ink is used for the strongest typography and dark surfaces
			ink: {
				50: '#f7f7f5',
				100: '#ececea',
				200: '#d7d6d2',
				300: '#b8b6b0',
				400: '#86847d',
				500: '#67655f',
				600: '#5c5a55',
				700: '#45433f',
				800: '#302f2c',
				900: '#222321',
				950: '#161918',
			},
			// Restrained scholarly blue
			accent: {
				50: '#eef5f7',
				100: '#dcebef',
				200: '#bfd8df',
				300: '#96bdc9',
				400: '#679aaa',
				500: '#497d90',
				600: '#396779',
				700: '#2f5363',
				800: '#294652',
				900: '#243b45',
				950: '#172b34',
			},
			emerald: {
				50: '#ecfdf5',
				100: '#d1fae5',
				200: '#a7f3d0',
				300: '#6ee7b7',
				400: '#34d399',
				500: '#10b981',
				600: '#059669',
				700: '#047857',
				800: '#065f46',
				900: '#064e3b',
			},
			amber: {
				50: '#fffbeb',
				100: '#fef3c7',
				200: '#fde68a',
				300: '#fcd34d',
				400: '#fbbf24',
				500: '#f59e0b',
				600: '#d97706',
				700: '#b45309',
				800: '#92400e',
				900: '#78350f',
			},
		},
		fontFamily: {
			sans:
				"'Atkinson Hyperlegible', 'Noto Sans SC', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
			heading: "'Crimson Pro', Georgia, 'Times New Roman', 'Noto Serif SC', serif",
			mono:
				"'JetBrains Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace",
		},
		fontSize: {
			xs: ['0.8125rem', { 'line-height': '1.125rem' }],
			sm: ['0.875rem', { 'line-height': '1.375rem' }],
			base: ['1rem', { 'line-height': '1.625rem' }],
		},
		boxShadow: {
			sm: '0 1px 2px rgb(34 35 33 / 0.06)',
			DEFAULT: '0 1px 3px rgb(34 35 33 / 0.08), 0 1px 2px rgb(34 35 33 / 0.04)',
			md: '0 8px 18px -12px rgb(34 35 33 / 0.28)',
			lg: '0 16px 32px -18px rgb(34 35 33 / 0.3)',
			xl: '0 24px 48px -24px rgb(34 35 33 / 0.34)',
			paper: '0 1px 1px rgb(34 35 33 / 0.04), 0 12px 28px -22px rgb(34 35 33 / 0.32)',
			'paper-lg':
				'0 1px 2px rgb(34 35 33 / 0.05), 0 18px 38px -24px rgb(47 83 99 / 0.34)',
			sketch: '2px 2px 0 rgb(34 35 33 / 0.08)',
			'sketch-hover': '4px 4px 0 rgb(34 35 33 / 0.12)',
		},
		animation: {
			'fade-in': 'fadeIn 0.45s ease-out forwards',
			'fade-in-up': 'fadeInUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards',
			pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
		},
		keyframes: {
			fadeIn: {
				'0%': { opacity: '0' },
				'100%': { opacity: '1' },
			},
			fadeInUp: {
				'0%': { opacity: '0', transform: 'translateY(10px)' },
				'100%': { opacity: '1', transform: 'translateY(0)' },
			},
			pulse: {
				'0%, 100%': { opacity: '1' },
				'50%': { opacity: '0.5' },
			},
		},
	},
	transformers: [transformerDirectives()],
});
