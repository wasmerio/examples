# astro-theme-popular

**Popular** is a warm, community-first Astro theme for meetups, clubs and fan
communities: events with venues and speakers, a multi-author blog, organizer
docs with persistent checklists, and one-block re-theming, shipped as an
Astro integration.

```bash
npm install astro-theme-popular
```

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import popular from 'astro-theme-popular';

export default defineConfig({
  site: 'https://your.community',
  integrations: [mdx(), popular()],
});
```

Override any theme component with your own, without forking:

```js
popular({ overrides: { Header: './src/overrides/Header.astro' } })
```

Overridable: `Header`, `Footer`, `Hero`, `EventRow`, `PostCard`,
`OrganizerCard`, `AuthorBox`, `PageHero`. Your file receives the same props
the theme component does.

Disable any injected route group when your site replaces it (also the
answer when you provide your own `/` or `/rss.xml`):

```js
popular({ routes: { speakers: false, venues: false } })
```

Your site keeps its own content (`src/content/`) and one typed config file
(`popular.config.ts`); the theme injects the routes, layouts, styles and
behavior. Adopt the content model in one line:

```ts
// src/content.config.ts
export { collections } from 'astro-theme-popular/schemas';
```

- **Docs & feature guides**: https://popular.mariatta.ca/
- **Live demo** (the neutral starter, exactly what this package gives you):
  https://mariatta.ca/astro-theme-popular/
- **Demo gallery** (three fictional communities + one superfan personal site):
  https://mariatta.ca/astro-theme-popular/demos/
- **Changelog & releases**: https://github.com/Mariatta/astro-theme-popular/releases
- **Hugo twin** (same design system, full parity):
  https://github.com/Mariatta/hugo-theme-popular

Popular is MIT licensed and named after the song *Pop!ular* by Darren Hayes.
