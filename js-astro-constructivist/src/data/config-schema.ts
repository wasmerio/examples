import { z } from 'zod'

function isLanguageTag(value: string): boolean {
  try {
    return Intl.getCanonicalLocales(value).length === 1
  }
  catch {
    return false
  }
}

function isTimeZone(value: string): boolean {
  try {
    new Intl.DateTimeFormat('en', { timeZone: value }).format()
    return true
  }
  catch {
    return false
  }
}

export const httpUrlSchema = z.url().regex(/^https?:\/\//i, 'Use an absolute HTTP(S) URL').refine((value) => {
  try {
    const url = new URL(value)
    return !url.username && !url.password && !/\p{Cc}/u.test(value)
  }
  catch {
    return false
  }
}, 'URLs must not contain embedded credentials or control characters')

export const assetSchema = z.string().min(1).refine((value) => {
  if (/^https?:\/\//i.test(value))
    return httpUrlSchema.safeParse(value).success
  try {
    const path = decodeURIComponent(value.split(/[?#]/)[0] ?? '')
    return Boolean(path.trim()) && !/[:\\\p{Cc}]/u.test(path)
      && !path.startsWith('//')
      && !path.split('/').some(part => part === '.' || part === '..')
  }
  catch {
    return false
  }
}, 'Use a public-relative asset path or an HTTP(S) URL, without traversal or embedded credentials')

const actionLinkSchema = z.string().min(1).refine((value) => {
  if (value.startsWith('#'))
    return /^#[\w-]+$/.test(value)
  if (/^(?:mailto|tel):/i.test(value))
    return value.split(':').slice(1).join(':').trim().length > 0 && !/\p{Cc}/u.test(value)
  return assetSchema.safeParse(value).success
}, 'Actions must use a section fragment, public-relative path, HTTP(S), mailto, or tel URL')

const sectionIds = [
  'top',
  'about',
  'experience',
  'projects',
  'education',
  'skills',
  'gallery',
  'contact',
] as const
const toneSchema = z.enum(['paper', 'paper-2', 'ink', 'accent'])

const defaultSections = [
  {
    id: 'top',
    label: 'Portfolio',
    title: 'Portfolio',
    kicker: '',
    tagline: 'Introduction',
    enabled: true,
    nav: false,
    tone: 'paper',
  },
  {
    id: 'about',
    label: 'About',
    title: 'About',
    kicker: 'The person behind the work',
    tagline: 'Manifesto',
    enabled: true,
    nav: true,
    tone: 'paper',
  },
  {
    id: 'experience',
    label: 'Experience',
    title: 'Experience',
    kicker: 'Practice, in progress',
    tagline: 'Service record',
    enabled: true,
    nav: true,
    tone: 'ink',
  },
  {
    id: 'projects',
    label: 'Projects',
    title: 'Selected work',
    kicker: 'A selection of things made',
    tagline: 'Case files',
    enabled: true,
    nav: true,
    tone: 'paper',
  },
  {
    id: 'education',
    label: 'Education',
    title: 'Education',
    kicker: 'Always a student',
    tagline: 'Learning',
    enabled: true,
    nav: false,
    tone: 'paper',
  },
  {
    id: 'skills',
    label: 'Skills',
    title: 'Working materials',
    kicker: 'Tools for the work',
    tagline: 'Materials',
    enabled: true,
    nav: false,
    tone: 'ink',
  },
  {
    id: 'gallery',
    label: 'Gallery',
    title: 'Field notes',
    kicker: 'Looking outside the screen',
    tagline: 'Contact sheet',
    enabled: true,
    nav: false,
    tone: 'paper',
  },
  {
    id: 'contact',
    label: 'Contact',
    title: 'Contact',
    kicker: 'Start a conversation',
    tagline: 'Transmission',
    enabled: true,
    nav: true,
    tone: 'accent',
  },
] as const

export const sectionsSchema = z.array(z.object({
  id: z.enum(sectionIds),
  label: z.string().min(1),
  title: z.string().min(1),
  kicker: z.string().default(''),
  tagline: z.string().default(''),
  meta: z.string().optional(),
  enabled: z.boolean().default(true),
  nav: z.boolean().default(false),
  tone: toneSchema.default('paper'),
}).strict()).min(1).max(8).refine(items => new Set(items.map(item => item.id)).size === items.length, 'Section IDs must be unique').refine(items => items.some(item => item.enabled), 'At least one section must be enabled').default([...defaultSections])

export const siteSchema = z.object({
  url: httpUrlSchema.refine((value) => {
    try {
      const url = new URL(value)
      return url.pathname === '/' && !url.search && !url.hash
    }
    catch {
      return false
    }
  }, 'Use an HTTP(S) origin; put the deployment path in site.base').default('https://example.com'),
  base: z.string().regex(/^\/(?:[\w.-]+\/)*[\w.-]*\/?$/, 'Base must be / or a slash-prefixed path such as /portfolio/').refine(value => !value.split('/').some(part => part === '.' || part === '..'), 'Base cannot contain dot segments').default('/'),
  lang: z.string().min(2).max(80).refine(isLanguageTag, 'Use a valid BCP 47 language tag such as en or zh-CN').default('en'),
  locale: z.string().min(2).max(80).refine(value => isLanguageTag(value.replaceAll('_', '-')), 'Use a valid locale such as en_US or en-GB').default('en_US'),
  timeZone: z.string().min(1).refine(isTimeZone, 'Use an IANA time zone such as UTC or Europe/London').default('UTC'),
  favicon: assetSchema.default('/favicon.svg'),
  appleTouchIcon: assetSchema.default('/apple-touch-icon.png'),
  loader: z.object({
    enabled: z.boolean().default(true),
    minimumDuration: z.number().int().min(0).max(3000).default(1800),
    maxWait: z.number().int().min(1000).max(10000).default(6000),
    label: z.string().min(1).max(40).default('Constructa'),
    colors: z.array(z.string().regex(/^#(?:[\da-f]{3}|[\da-f]{6})$/i, 'Use a hexadecimal color')).min(3).max(6).default([
      '#f03a17',
      '#1d4ed8',
      '#d6e600',
      '#f2eadb',
      '#121110',
    ]),
  }).strict().prefault({}),
  seo: z.object({
    title: z.string().default(''),
    description: z.string().default(''),
    keywords: z.array(z.string()).default([]),
    image: assetSchema.default('/og.png'),
    imageAlt: z.string().default('Constructa - a constructivist portfolio theme for Astro'),
    twitterHandle: z.string().default(''),
    noIndex: z.boolean().default(false),
  }).strict().prefault({}),
  features: z.object({
    smoothScroll: z.boolean().default(true),
    scrollMotion: z.boolean().default(true),
    sectionTransitions: z.boolean().default(true),
    projectExhibition: z.boolean().default(true),
    cursor: z.boolean().default(true),
    blueprint: z.boolean().default(true),
    commandPalette: z.boolean().default(true),
    posterStudio: z.boolean().default(true),
    print: z.boolean().default(true),
    themeSwitch: z.boolean().default(true),
    marquee: z.boolean().default(true),
  }).strict().prefault({}),
  footer: z.object({
    copyrightStart: z.number().int().min(1900).max(2200).default(2026),
    showAttribution: z.boolean().default(true),
  }).strict().prefault({}),
}).strict().prefault({})

export const heroSchema = z.object({
  nameLines: z.array(z.string().min(1)).max(3).default([]),
  role: z.string().default(''),
  description: z.string().default('Independent thinking. Thoughtful digital experiences.'),
  location: z.string().default('Working worldwide'),
  availability: z.string().default('Open to conversations'),
  cta: z.object({
    label: z.string().default('Explore the work'),
    href: actionLinkSchema.default('#projects'),
  }).strict().prefault({}),
  metrics: z.array(z.object({
    label: z.string(),
    value: z.string(),
  }).strict()).max(6).default([]),
  note: z.string().default('Design with intent. Build for people.'),
  scrollLabel: z.string().default('Scroll to unfold'),
  typography: z.object({
    mixed: z.boolean().default(true),
    shuffle: z.boolean().default(true),
    seed: z.number().int().default(2026),
  }).strict().prefault({}),
  globe: z.object({
    enabled: z.boolean().default(true),
    autoRotate: z.boolean().default(true),
    speed: z.number().min(0).max(2).default(0.12),
    dotSize: z.number().min(1).max(8).default(2.2),
    latitude: z.number().min(-90).max(90).default(51.5),
    longitude: z.number().min(-180).max(180).default(-0.12),
    label: z.string().default('Based here. Building everywhere.'),
  }).strict().prefault({}),
  marquee: z.array(z.string()).default([]),
}).strict().prefault({})
