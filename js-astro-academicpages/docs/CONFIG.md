# ⚙️ Site Configuration Guide (`CONFIG.md`)

This guide explains how configuration works across `academicpages-astro`, detailing all options in `src/data/siteConfig.ts`, navigation in `src/data/navigation.ts`, deployment URLs, and redirects in `astro.config.ts`.

---

## 1. Site Metadata & Author Profile (`src/data/siteConfig.ts`)

All global metadata and author information are centralized in [`src/data/siteConfig.ts`](../src/data/siteConfig.ts).

```ts
export const siteConfig: SiteConfig = {
  locale: 'en-US',
  title: 'Your Name / Site Title',
  titleSeparator: '-',
  description: "Your Name's Academic Portfolio",
  url: 'https://username.github.io',
  theme: {
    light: 'default',
    dark: 'default',
  },
  breadcrumbs: true,
  author: {
    avatar: '/images/profile.png',
    name: 'Your Name',
    bio: 'Short biography',
    location: 'City, State / Country',
    employer: 'Your University or Organization',
    website: 'https://example.org',
    email: 'none@example.org',
    googlescholar: 'https://scholar.google.com/citations?user=your_scholar_id',
    orcid: '0000-0000-0000-0000',
    github: 'your-github-username',
    linkedin: 'your-linkedin-username',
    x: 'your-x-handle',
  },
  publicationCategories: {
    books: { title: 'Books' },
    journals: { title: 'Journal Articles' },
    conferences: { title: 'Conference Papers' },
  },
};
```

### Core Site Settings

| Property                | Type                                | Default                                 | Description                                                                                                    |
| :---------------------- | :---------------------------------- | :-------------------------------------- | :------------------------------------------------------------------------------------------------------------- |
| `locale`                | `string`                            | `'en-US'`                               | Site language/locale code used in HTML `lang` attributes and RSS feeds                                         |
| `title`                 | `string`                            | Required                                | Brand name displayed in masthead and SEO head tags                                                             |
| `titleSeparator`        | `string`                            | `'-'`                                   | Separator between page title and brand in browser tabs (e.g. `CV - Jane Doe`)                                  |
| `description`           | `string`                            | Required                                | Default fallback description for OpenGraph, Twitter cards, and search engine snippets                          |
| `url`                   | `string`                            | Required                                | Production deployment URL (e.g. `https://username.github.io` or `https://username.github.io/my-site`)          |
| `theme`                 | `ThemeConfig`                       | `{ light: 'default', dark: 'default' }` | Independent light and dark presets or partial custom palette objects (see [Color Themes](#color-themes-theme)) |
| `breadcrumbs`           | `boolean`                           | `true`                                  | Toggles breadcrumb trail navigation at the top of archive and single pages                                     |
| `publicationCategories` | `Record<string, { title: string }>` | Standard 3                              | Defines category filter tabs on `/publications/` (`books`, `journals`, `conferences`)                          |

### Color Themes (`theme`)

Defined in [`src/data/themes.ts`](../src/data/themes.ts), `theme.light` and `theme.dark` can be configured independently using a built-in preset name or a partial custom palette (`Partial<ThemePalette>`):

- **Light Presets**: `'default'` | `'github-light'` | `'one-light'` | `'catppuccin-latte'` | `'alucard'` | `'tokyo-night-day'` | `'solarized-light'` | `'nord-light'` | `'gruvbox-light'` | `'monokai-light'` | `'rose-pine-dawn'` | `'light-owl'` | `'ayu-light'` | `'kanagawa-lotus'` | `'everforest-light'` | `'flexoki-light'`
- **Dark Presets**: `'default'` | `'github-dark'` | `'one-dark'` | `'catppuccin-mocha'` | `'dracula'` | `'tokyo-night'` | `'solarized-dark'` | `'nord'` | `'gruvbox-dark'` | `'monokai'` | `'rose-pine'` | `'night-owl'` | `'ayu-dark'` | `'kanagawa-wave'` | `'everforest-dark'` | `'flexoki-dark'`
- **Custom Overrides**: Pass any subset of the 5 core tokens (`{ base, bg, surface, text, textLight }`); omitted fields inherit from `'default'` and secondary tokens (borders, code blocks, links) auto-derive via CSS `color-mix()`
- **Interactive Theme Picker (`theme.picker`)**: Enabled (`true`) in the starter template so visitors can preview all 32 presets in the masthead; set to `false` or remove `picker` on personal sites so only your configured `light` and `dark` palettes are shipped

### Author Profile Fields (`author`)

All platform handles accept either a bare username/ID or a complete URL (e.g. `'username'` or `'https://github.com/username'`).

#### Identity & Contact

- `name` (`string`): Sidebar display name
- `avatar` (`string`): Path to avatar image in `public/` (e.g. `'/images/profile.png'`)
- `pronouns` (`string`, optional): Optional display pronouns (e.g. `'they/them'`)
- `bio` (`string`, optional): 1–2 sentence personal or research summary
- `location` (`string`, optional): City, State, or Country
- `employer` (`string`, optional): University, institute, or company affiliation
- `website` (`string`, optional): External personal or lab homepage URL
- `email` (`string`, optional): Contact email address

#### Academic & Scholarly Platforms (50+ Supported)

- `googlescholar`: Google Scholar user ID or full profile URL
- `orcid`: ORCID 16-digit ID (e.g. `'0000-0000-0000-0000'`) or full URL
- `arxiv`: arXiv author ID (e.g. `'doe_j_1'`) or full URL
- `dblp`: DBLP author PID (e.g. `'123/4567'`) or full URL
- `huggingface`: Hugging Face profile username or URL
- `ieee`: IEEE Xplore author profile URL or ID
- `acm`: ACM Digital Library author profile URL or ID
- `openreview`: OpenReview profile handle or URL
- `pubmed`: PubMed author search query or profile URL
- `researchgate`: ResearchGate profile handle or URL
- `scopus`: Scopus author ID or profile URL
- `semantic`: Semantic Scholar author ID or URL
- `ssrn`: SSRN author ID or URL
- `zotero`: Zotero username or profile URL
- `academia`, `inspire_hep`, `impactstory`, `osf`, `philpapers`

#### Developer & Code Platforms

- `github`: GitHub username or profile URL
- `gitlab`: GitLab username or profile URL
- `bitbucket`: Bitbucket username or profile URL
- `codepen`: CodePen handle or URL
- `dribbble`: Dribbble handle or URL
- `kaggle`: Kaggle handle or URL
- `stackoverflow`: Stack Overflow user ID or full profile URL

#### Social Networks

- `bluesky`: Bluesky handle (e.g. `'user.bsky.social'`) or full URL
- `linkedin`: LinkedIn username or profile URL
- `x`: X / Twitter username or URL
- `mastodon`: Full instance URL (e.g. `'https://mastodon.social/@username'`)
- `medium`: Medium handle or publication URL
- `substack`: Substack handle or publication URL
- `artstation`, `discord`, `facebook`, `flickr`, `foursquare`, `goodreads`, `instagram`, `keybase`, `lastfm`, `pinterest`, `soundcloud`, `steam`, `telegram`, `threads`, `tumblr`, `weibo`, `wikipedia`, `xing`, `youtube`, `zhihu`

---

## 2. Navigation Configuration (`src/data/navigation.ts`)

Menu items displayed in the top header masthead are configured in [`src/data/navigation.ts`](../src/data/navigation.ts).

```ts
export const navigation: NavItem[] = [
  { title: 'Publications', url: '/publications/' },
  { title: 'Talks', url: '/talks/' },
  { title: 'Teaching', url: '/teaching/' },
  { title: 'Portfolio', url: '/portfolio/' },
  { title: 'Blog Posts', url: '/posts/' },
  { title: 'CV', url: '/cv/' },
];
```

### Customizing Navigation

- **Reordering**: Change the array order to rearrange menu items
- **Removing Unused Sections**: If you do not have talks or teaching, remove them from this array (the corresponding pages will not appear in the menu)
- **Adding Custom Pages**: Add `{ title: 'Custom Page', url: '/custom-url/' }` for any static page added to `src/pages/`

---

## 3. Base URL & Deployment Resolution (`astro.config.ts`)

Astro resolves `site` and `base` dynamically in [`astro.config.ts`](../astro.config.ts):

```ts
const rawUrl = process.env.ASTRO_URL || siteConfig.url;
const parsedUrl = rawUrl ? new URL(rawUrl) : undefined;

const site = parsedUrl ? parsedUrl.origin : undefined;
const base =
  parsedUrl && parsedUrl.pathname !== '/'
    ? parsedUrl.pathname.replace(/\/+$/, '')
    : undefined;
```

### GitHub Pages Configurations

- **User / Org Site** (`https://<username>.github.io`):
  - In `siteConfig.ts`: `url: 'https://<username>.github.io'`
  - `site` is set to `https://<username>.github.io`, `base` is `undefined` (root)
- **Project Site** (`https://<username>.github.io/<repo-name>`):
  - In `siteConfig.ts`: `url: 'https://<username>.github.io/<repo-name>'`
  - `site` is set to `https://<username>.github.io`, `base` is automatically resolved to `/<repo-name>`
- **Dynamic CI Injection**:
  - In GitHub Actions CI (`.github/workflows/ci.yml`), `ASTRO_URL` is automatically supplied from `steps.pages.outputs.base_url`, ensuring zero hardcoding during CI deployments

---

## 4. Route & Legacy Redirects (`astro.config.ts`)

Redirects are managed under `redirects` in [`astro.config.ts`](../astro.config.ts):

```ts
redirects: {
  '/about': '/',
  '/resume': '/cv/',
},
```

### Built-in Convenience Redirects

- `'/about': '/'`: Redirects legacy `/about` requests to the homepage
- `'/resume': '/cv/'`: Redirects `/resume` to `/cv/`

### Legacy Jekyll & WordPress Redirects

When migrating an existing Jekyll or WordPress site with live inbound links, preserve SEO rankings by adding legacy route aliases:

```ts
redirects: {
  '/about': '/',
  '/resume': '/cv/',
  // Legacy Jekyll blog archive redirects
  '/year-archive/': '/posts/',
  '/wordpress/blog-posts/': '/posts/',
  // Old Jekyll layout permalink formats
  '/publications.html': '/publications/',
  '/talks.html': '/talks/',
},
```

### Customizing Redirects

- **Keep**: Retain `/about` and `/resume` as standard convenience aliases
- **Prune**: If starting fresh without an existing site to migrate, omit legacy Jekyll and WordPress aliases
- **Extend**: Add custom entry-level redirects for past URL structures (e.g. `'/paper123': '/publications/paper-slug/'`)

---

## 5. Footer & Template Attribution (`src/components/Footer.astro`)

The global footer displays copyright notices, social follow links, RSS feed discovery, and template attribution:

- **Copyright Text**: Automatically resolves using `currentYear` and `siteConfig.author.name` (or `siteConfig.title`)
- **Template Attribution Rule**: The footer credit linking back to [Academic Pages Astro](https://github.com/arghyadipchak/academicpages-astro) and upstream sources must **never** be removed, commented out, or hidden during personalization or custom styling
