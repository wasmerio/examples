# Project structure

[Back to README](../README.md) · [Customization reference](customization.md)

## Organization

```text
landpack/
├── .agents/skills/            Portable AI customization skill and project map
├── .claude/skills/            Lumos procedures and customization-skill alias
├── docs/                      Customization, AI, SEO, deployment, architecture
├── public/                    Unprocessed favicon and social assets
├── scripts/                   Social-card generator and built-output SEO check
├── src/
│   ├── assets/                Imported images, local fonts, and icons
│   ├── components/
│   │   ├── Content/           Landing-page sections and content blocks
│   │   ├── Global/            Navigation, footer, blur, skip link
│   │   ├── Graphic/           Logo, seal, and product illustrations
│   │   ├── Media/             Images, browser frames, icons, video
│   │   ├── Interactive/       Tabs, modal, accordion, and other primitives
│   │   ├── Wrapper/           Section, grid, content/button layouts
│   │   ├── Typography/        Headings, paragraphs, rich text
│   │   ├── Form/              Reusable form primitives
│   │   ├── Item/              Reusable card component
│   │   ├── Utility/           Metadata and formatted dates
│   │   └── Button.astro       Shared button/link variants and arrow motion
│   ├── content/               Project YAML, collection JSON, FAQ Markdown
│   ├── layouts/               Shared document shell
│   ├── pages/                 Homepage, 404, component gallery, robots.txt
│   ├── styles/                Tokens, patterns, utilities, global imports
│   ├── utils/                 Slots, text, IDs, SEO helpers
│   ├── content.config.ts      Collection loaders and validation
│   ├── consts.ts              Metadata defaults, locale, noindex routes
│   └── types.ts               Shared metadata props
├── astro.config.mjs            Site origin, sitemap, local fonts, build settings
├── wrangler.jsonc              Optional Cloudflare static deployment config
├── .env.example                Public site URL example
├── package.json                Commands and dependency/framework metadata
├── package-lock.json           Reproducible dependency versions
├── LUMOS.md                    Component and styling conventions
└── LICENSE                     Preserved MIT license
```

`node_modules/`, `.astro/`, and `dist/` are generated and ignored. Local verification output is ignored too. `.claude/skills/`, `AGENTS.md`, and `CLAUDE.md` contain development guidance, not runtime application code.

## Content flow

1. Astro collection loaders read the YAML, JSON, and Markdown entries and validate them against `src/content.config.ts`.
2. `pages/index.astro` retrieves the `main` project and repeatable collections, sorts entries by `order`, and composes sections. It carries no custom CSS or browser scripts.
3. Content components render their data with Lumos primitives. Components own the CSS and scripts needed for their behavior.
4. `BaseLayout.astro` adds metadata, theme restoration, navigation, footer, and viewport blur.
5. Astro generates a static site, optimized images, local-font assets, and a sitemap in `dist/`.

Navigation and footer read the same project collection entry. `consts.ts` reads raw YAML identity and social-image settings for shared metadata; it is also imported by configuration-time SEO helpers, so it does not import the runtime-only `astro:content` module. Collection validation remains the source of truth for project fields.

The [customization skill](../.agents/skills/landpack-customize/SKILL.md) maps these surfaces for AI agents. Its entrypoint describes the workflow; its reference map locates the files. The schema and customization guide remain authoritative, avoiding a second configuration contract.

## Review decisions

The existing separation between content, page composition, reusable primitives, and product graphics is appropriate for this template. It does not need another configuration layer or a folder reshuffle.

The review addressed concrete gaps:

- Optional feature/setup sections no longer leave stale navigation anchors.
- The setup-to-integrations link disappears when integrations are empty.
- The final CTA falls back to documentation when setup steps are absent.
- All local `.env.*` variants are ignored except `.env.example`.
- The stamp overrides shared button hover tokens instead of inheriting a filled background.
- The SSO diagram keeps its signal below opaque nodes and makes the illustration itself keyboard/touch accessible.
- The README links to a complete field reference and documents the remaining component-owned copy.

The component gallery at `/example-components` and unused Lumos primitives are intentionally retained for template development. They are not abandoned landing-page components. The gallery is excluded from indexing and the sitemap.

## Extending the template

Read [LUMOS.md](../LUMOS.md) first. This project uses **Lumos for Astro**, not Lumos for Webflow.

- Reuse `Section`, `ContentWrapper`, `Heading`, `Paragraph`, `Button`, and other installed primitives before adding markup/styles.
- Keep custom styles beside their component under `@layer components`; global tokens belong in `src/styles/base.css`.
- Name custom roots with `_wrap` and prefix descendants by component family.
- Use rem/em for ordinary layout; scaling illustrations use an aspect-ratio artboard with `container-type: inline-size` and cqw dimensions.
- Put new per-project settings in the content schema and YAML, then pass typed content into the component.
- Keep universal UI behavior in reusable components. Product-specific graphics can be replaced by images without editing the page structure.
- Preserve render guards, accessible labels, keyboard behavior, and reduced-motion fallbacks.

For a new route, add an Astro page and wrap it with `BaseLayout`. The shared navigation points back to homepage sections. Add appropriate metadata and update `NOINDEX_ROUTES` if the route should be excluded from search results.

## Validation and release scope

`npm run check` checks Astro/TypeScript diagnostics. `npm run build` exercises collection validation and static output generation. Neither is a browser interaction test or an end-to-end test of the sample authentication code.

`npm run og:generate` renders a social card from current content and color tokens. `npm run seo:check` inspects the built metadata, local social assets, sitemap, and robots file; it rejects placeholder domains unless explicitly allowed for local validation. See the [SEO audit](seo.md) and [deployment guide](deployment.md) for their scope and limitations.

Before publishing UI changes, review the page at desktop and mobile widths, in both themes, with keyboard interaction and reduced motion. Before publishing a customized template, replace its sample brand assets and URLs and verify generated metadata against the production domain.

The repository includes no automated deployment workflow or CI status badge. The README badges describe the declared stack, Node requirement, and license; add a real workflow-status badge only after configuring a workflow on the published repository.
