# Plan: shipping the Astro theme as an npm package

Status: approved (work begun); phase 1 is PR #10 (package skeleton + smoke
consumer). Phase-1 learnings:

- MDX content imports theme components by package id
  (`astro-theme-popular/components/Callout.astro`), not by relative path.
- Behavior JS is injected by the integration (`injectScript('page', ...)`),
  bundled and hashed, instead of static `/scripts/*.js` tags.
- Until the phase-4 cutover, theme code exists twice in this repo (template
  `src/` + `package/`); the package-smoke workflow fails on drift.

## Why

- **Updates become `npm install astro-theme-popular@latest`.** Today Astro
  adopters vendor the repo and update by diffing tags and re-copying files:
  honest, documented, and the weakest part of the theme's story. Community
  sites are long-lived and change organizer hands; a site that stays current
  by bumping one dependency survives handoffs that a vendored copy does not.
- **The theme is already config-first.** Brand block, STRINGS, composable
  home, sections that render only when content exists: adopters are told to
  configure, not to edit templates. That is the packaged-theme philosophy
  (Starlight is the existence proof), and Popular loses little of its
  customization story by packaging.
- **Parity gets more symmetric.** Hugo Module ⇄ npm package is a cleaner
  pair than Hugo Module ⇄ "repo you copy".

## Target architecture

One npm package, `astro-theme-popular`, exposing an Astro integration:

```js
// adopter's astro.config.mjs
import popular from 'astro-theme-popular';
export default defineConfig({
  site: 'https://your.community',
  integrations: [popular({ configFile: './popular.config.ts' })],
});
```

- **Routes** are injected by the integration (`injectRoute`): home, blog +
  tags + pagination, events, speakers, venues, organizers, docs, authors,
  RSS. An adopter route at the same path wins (Astro gives project routes
  priority), which is the escape hatch for one-off pages.
- **Config** (`SITE`, `STRINGS`, `BRAND`, `NAV`, `FOOTER`, `HOME`,
  `SECTIONS`, `PAGINATION`) moves to `popular.config.ts` in the adopter's
  repo, typed by the package and surfaced to theme code as a virtual module
  (`popular:config`). Same keys as today: the config *shape* is already the
  parity contract and does not change.
- **Content stays in the adopter's repo** under `src/content/`. The package
  exports the zod schemas (`import { schemas } from 'astro-theme-popular'`)
  so `content.config.ts` is three lines. The content model is unchanged.
- **Styles**: the shared CSS (tokens, base, components: the Tier-1 files)
  ships in the package and is imported by the base layout; `BRAND` emission
  stays as the html:root override. `customCSS` keeps working (adopter files,
  loaded after).
- **Shared JS** ships in the package; the integration injects the script
  tags that BaseLayout carries today.
- **URL helpers**: `withBase()` / `absoluteUrl()` are exported publicly as
  `astro-theme-popular/url`, so an adopter's own pages, overrides and config
  resolve URLs the same way the theme does on a subpath install. The
  integration also registers the markdown hooks (lazy images, base-aware
  links) on the active markdown processor, since `markdown.rehypePlugins` set
  from an integration is ignored by Astro 7's default processor.
- **Component overrides** (the "edit the file" replacement): a Starlight
  style override map for the components adopters realistically replace:

  ```js
  popular({ overrides: { Header: './src/overrides/Header.astro' } })
  ```

  Initial override surface: `Header`, `Footer`, `Head` (replaces the Hugo
  side's head-extra hook), `AuthorBox`, `EventRow`, `PostCard`, `Hero`.
  Everything else stays internal until someone shows a need (same policy
  that produced head-extra: hooks are added on demonstrated demand).

## What happens to this repo's layout

- `package/`: the theme (integration, components, layouts, styles, scripts,
  schemas). The only published artifact.
- `demos/`: each demo becomes a real consumer project (own package.json
  depending on the workspace package). Demos turn into integration tests:
  `npm run build` in each proves the package against four configs. The demo
  bar, activation script (`use-demo.mjs`), and `src/`-as-copy model are
  retired; `npm run dev --workspace demos/aquarium` replaces activation.
- `create-popular-site/`: a scaffolder (`npm create popular-site@latest`), offering
  the starter or any demo as the initial site. Replaces "copy the repo".
- The starter skeleton becomes the scaffolder's default template, which also
  dissolves the merge-based-fork papercut (no live samples in a theme repo).

## Parity contract changes

- Tier 1 (byte-identical CSS/JS/scripts/CHANGELOG) is unchanged: files move
  to `package/styles` and `package/scripts`; `sync-shared.sh` paths update.
- Tier 2 template mapping table now maps Hugo layouts to package components.
- The config-shape and content-model tiers are untouched: that is the point.
- New allowed asymmetry: Hugo customizes via partial overrides, Astro via
  the integration's override map. PARITY documents the equivalence table
  (head-extra.html ⇄ overrides.Head, etc.).

## Migration phases (each a PR set, template model keeps working until 4)

1. **Package skeleton**: workspace layout, integration with injected routes,
   virtual config module, schema exports. Demos still on the old model.
2. **Override surface + head/customCSS hooks**; component docs. Scope was
   sharpened by a real adoption attempt (UPSTREAM-HANDOFF round 2, item 10),
   and the route-flexibility half of it **shipped in phase 2a**:
   - `routes` option: per-route opt-outs
     (`popular({ routes: { speakers: false } })`) for sites replacing part
     of the content model; also the durable answer to `/` and `/rss.xml`
     shadowing, since Astro is deprecating silent route collisions. [shipped]
   - Injected slug routes use rest params (`[...slug]`) so folder-organized
     content ids (`2019-pycon-us/cooper-lees`) work. [shipped]
   - Injected routes no-op quietly when their collection is undefined or
     empty. [shipped]
   The component override map shipped in phase 2b: `popular({ overrides:
   { Header, Footer, Hero, EventRow, PostCard, OrganizerCard, AuthorBox,
   PageHero } })` via `popular:component/*` virtual resolution. Phase 2
   complete.
3. **Demos become consumers; scaffolder; CI reshaped** (image-alt and the
   base-path scan run per demo workspace; parity paths update).
   - The repo became an npm workspace (`package`, `demos/*`, `smoke`), and each
     of the five demos became a real consumer project with its own
     `package.json`, `astro.config.mjs`, `popular.config.ts`, `src/content/`
     and `public/images/`. `use-demo.mjs` and the `src/`-as-activation-copy
     model for demos are gone; the deployment and the image-alt job now build
     five real consumers, which makes both of them integration tests. [shipped]
   - **The demo bar stays.** PACKAGING originally listed it with the activation
     machinery, but `DEMO_BAR` ⇄ `params.demoBar` is a Tier-2 parity item with a
     Hugo twin (`demo-bar.html`), and the deployed gallery still needs it.
     What retired was activation, not the component.
   - `create-popular-site` shipped: `npm create popular-site@latest` writes a project
     that depends on the package, offering the starter or any demo as the
     initial site. Its templates are collected from `demos/*` by `prepack`, so
     there is no committed copy to drift, and CI scaffolds a site and builds
     it on every PR. Releases now publish two packages in lockstep. [shipped]
   - Still open: moving the Tier-1 parity paths to `package/`. Lands before
     the cutover, since `sync-shared.sh` pairs `assets/css/tokens` ⇄
     `src/styles/tokens` and `src/` stops existing at phase 4.
4. **Cutover**: old `src/` activation model removed, docs + updating guide
   rewritten, summit fork migrated as the pilot, npm publish. This release
   is the breaking one; target `0.5.0` (or whatever 0.x is next), with 1.0
   reserved for "package API stable".

## Open questions (decide before phase 1)

- npm name: `astro-theme-popular` (matches repo) vs a scoped
  `@mariatta/popular-astro`. Unscoped matches the repo and reads better in
  `npm create popular` land; check availability for both plus
  `create-popular-site`.
- Docs collection: keep docs pages as a content collection routed by the
  package (current behavior) vs leaving docs routing to adopters. Keep, per
  the organizer-handbook feature being a core differentiator.
- Minimum Astro version to support (the integration API pins this;
  proposal: current major only).
- Whether the Hugo repo's site should document both models during the
  transition or cut over in one docs release (proposal: one cut, less
  confusion).
