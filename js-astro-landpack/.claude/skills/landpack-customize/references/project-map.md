# Landpack customization map

All paths below are relative to the repository root. Full field definitions live in [the customization guide](../../../../docs/customization.md); read the current schema before changes. This map connects user intent to files and catches content outside YAML.

## Runtime content

| Surface                            | Source                                                                                                           | Consumers / dependent edits                                                            |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Full name, short name, description | `src/content/project/main.yaml`: `name`, `shortName`, `description`                                              | Metadata via `src/consts.ts`, header, drawer, footer wordmark, generated OG            |
| Repository, docs, optional demo    | YAML: `repository`, `docs`, `demo`                                                                               | Hero, nav, mobile sidebar, footer, CTA; check collection links separately              |
| Hero                               | YAML: `eyebrow`, `headline`, `headlineAccent`, `intro`, `command`, `background`                                  | `Content/SectionProjectHero.astro`, `ContentCommand.astro`; OG uses hero text too      |
| License and author                 | YAML: `license`, `author`, `authorUrl`, optional avatar/framing                                                  | Footer and hero have surrounding hardcoded sentences; ensure “Free to use” is accurate |
| Facts                              | YAML: `stats[]`: `value`, `label`, optional `href`                                                               | `ContentProjectStats.astro`; no live metrics                                           |
| Highlights                         | YAML: `highlights[]`: eyebrow/title/description, graphic, image pair/alt/crops                                   | `ContentProjectHighlights.astro`; array order controls alternating rows                |
| Feature heading/intro              | YAML: `featuresHeading`, `featuresIntro`                                                                         | `ContentProjectFeatures.astro`                                                         |
| Features                           | `src/content/features/*.json`: title, description, icon, order                                                   | Schema icon enum and feature component path map must agree                             |
| Setup copy                         | YAML: `setupHeading`, `setupIntro`, `setupNote`                                                                  | `ContentProjectSetup.astro`                                                            |
| Setup steps                        | `src/content/steps/*.json`: title, description, command, order                                                   | Command text is displayed and copied, not executed                                     |
| Integration copy                   | YAML: `integrationsHeading`, `integrationsIntro`                                                                 | `ContentProjectIntegrations.astro`                                                     |
| Integration tabs                   | `src/content/integrations/*.json`: title, description, order, language, code, href; optional icon/package/source | Code must match the actual package docs; titles generate shareable URL slugs           |
| FAQ copy                           | YAML: `faqHeading`, `faqIntro`                                                                                   | `ContentProjectFaq.astro`                                                              |
| FAQ entries                        | `src/content/faq/*.md`: question/order frontmatter and Markdown answer                                           | Do not retain SSO/commercial-license statements unless applicable                      |
| Final CTA                          | YAML: `ctaHeading`, `ctaIntro`                                                                                   | `SectionProjectCta.astro`; button labels are component-owned                           |
| Preview                            | YAML: `preview` address/title/subtitle/apps/caption, frame, optional image pair and alt                          | `GraphicProjectPreview.astro`, `BrowserFrame.astro`, `ThemeImage.astro`                |
| Stamp                              | YAML: optional `stamp` enabled/ringText/title/label/href                                                         | `GraphicStamp.astro`; `#` is the starter placeholder                                   |
| Social card                        | YAML: optional `seo` image/imageAlt/imageWidth/imageHeight                                                       | `BaseHead.astro`, `types.ts`, `consts.ts`; generator does not change the selection     |

Do not rename `main.yaml`. Schema: `src/content.config.ts`. Loaders only match the documented extensions directly in each collection directory. Empty collections hide their sections; empty `stats`/`highlights` hide those blocks. Required project fields still need values.

## Branding and media

| Surface                | File(s)                                                    | Customization rule                                                                                    |
| ---------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Theme colors and scale | `src/styles/base.css`                                      | Change both light/root and dark accent values; preserve semantic tokens and contrast                  |
| Shared CSS systems     | `src/styles/global.css`, `patterns.css`, `utilities.css`   | Keep layer order and reusable patterns; avoid global redesign during content adaptation               |
| Fonts                  | `src/assets/fonts/`, `astro.config.mjs`, `BaseHead.astro`  | Local Inter regular by default; update configured/preloaded font references together                  |
| Primary mark           | `src/components/Graphic/GraphicMark.astro`                 | Used in header and final CTA; replace artwork within its existing interface                           |
| Favicon                | `public/favicon.svg`, inherited `favicon.ico`              | Head references SVG; update/remove obsolete icon content intentionally                                |
| Social raster          | `public/og-image.jpg`                                      | Run `npm run og:generate` or provide a custom card; see `docs/seo.md`                                 |
| OG generator           | `scripts/generate-og.mjs`                                  | Reads hero/name/license and hex palette tokens; keeps fixed 1200 × 630 output                         |
| Screenshots            | `src/assets/screenshots/`                                  | YAML paths relative to main.yaml; replace the selected references, don't reuse misleading SSO screens |
| Theme pairs and crops  | `src/components/Media/ThemeImage.astro`                    | Configuration first; crop is in source pixels, dark/light independently                               |
| Preview frame          | `src/components/Media/BrowserFrame.astro`                  | arc/browser/safari via YAML; address is decorative                                                    |
| Integration marks      | `src/assets/icons/brands/`, integration component icon map | Preserve license/source notices; available names are schema enums                                     |
| Portrait               | YAML `authorAvatar`, `authorAvatarFraming`                 | Own portraits use `portrait`; `reference` is specific to the bundled screenshot                       |

The OG image uses system fonts at generation time. Commit the reviewed output instead of silently regenerating during deployment. It contains the current project's visible copy, so a renamed project must regenerate or replace it.

## Copy that is not in YAML

All component paths below start at `src/components/`.

- `Global/Nav.astro`: navigation labels, repository label, theme/menu accessible labels, home label suffix.
- `Global/Footer.astro`: creator label, Docs/Demo, license sentence, framework credit, wordmark punctuation.
- `Content/SectionProjectHero.astro`: button labels and surrounding license sentence.
- `Content/ContentProjectFeatures.astro`: section eyebrow and feature SVG path map.
- `Content/ContentProjectSetup.astro`: eyebrow and integration-link label.
- `Content/ContentProjectIntegrations.astro`: eyebrow, CLIENT SETUP, Library example, Integration guide, brand icon imports/map.
- `Content/SectionProjectCta.astro`: Get started and Star on GitHub labels.
- `Graphic/GraphicProjectPreview.astro`: built-in dashboard illustration labels, example domains, protocol/status text; used only without a screenshot.
- `Graphic/GraphicSsoFlow.astro`: sign-in-specific labels, accessible description, stage captions, timings, and connecting path. Supply a relevant screenshot for unrelated products or adapt the existing graphic content without reconstructing the page.
- `Content/ContentProjectHighlights.astro`: sample roles table and its accessibility label when no screenshot is present.
- `Content/ContentCommand.astro`: clipboard labels/status; `Global/SkipLink.astro`: skip navigation label.
- `src/pages/404.astro`: error-page title, description, body, and back link.
- `Interactive/` and `Form/` primitives: generic controls and accessibility labels; normally retain them. Review these if translating the entire interface.

For full localization, also set HTML `lang` in `BaseLayout.astro`, `SITE_LOCALE` in `src/consts.ts`, and all content/alt text. Changing `SITE_LOCALE` alone does not translate the page.

## Composition and behavior boundaries

`src/pages/index.astro` controls the sequence: hero → facts → highlights → features → setup → integrations → FAQ → CTA. Preserve the sequence and anchors by default. Global shell: `src/layouts/BaseLayout.astro`.

- `Global/Nav.astro`: scroll-direction header, theme persistence, mobile sidebar through native Modal.
- `Global/ScrollBlur.astro`: fixed progressive viewport-bottom blur.
- `Button.astro`: shared hover/underline/arrow behavior; preserve the special transparent stamp tokens.
- `Interactive/Tabs.astro`: keyboard navigation, no-JavaScript fallback, URL state.
- `Interactive/AccordionItem.astro`: FAQ disclosure; `Modal.astro`: sidebar keyboard/focus behavior.
- `Wrapper/`, `Typography/`, `Media/`, `Form/`, `Item/`: reusable Lumos primitives; do not fork them to rewrite content.
- `/example-components`: retained noindex component gallery, not product copy requiring rebranding of every sample.

There is no backend or CMS. Editing the template does not configure the featured package's authentication, database, tokens, or runtime application.

## SEO, deployment, and repository identity

| Concern           | File / action                                                                                            |
| ----------------- | -------------------------------------------------------------------------------------------------------- |
| Production origin | `.env` / host build `PUBLIC_SITE_URL`; never infer it from a repository URL                              |
| Metadata defaults | YAML plus `src/consts.ts`                                                                                |
| Per-page metadata | `SeoProps` in `src/types.ts`, through `BaseLayout` into `Utility/BaseHead`                               |
| Sitemap / noindex | `astro.config.mjs`, `src/utils/seo.ts`, `NOINDEX_ROUTES` in `src/consts.ts`                              |
| Robots            | `src/pages/robots.txt.ts`                                                                                |
| SEO verification  | `npm run build`, then `npm run seo:check`; `docs/seo.md` documents limits                                |
| Cloudflare        | `wrangler.jsonc`; change Worker name only when preparing that provider                                   |
| Vercel            | Static Astro preset; no adapter or new config required                                                   |
| Hosting reference | `docs/deployment.md`; customization does not authorize publishing                                        |
| Toolchain         | `package.json`, lockfile, `tsconfig.json`; preserve stack and Lumos metadata                             |
| Documentation     | README and `docs/`; keep reusable template guidance, update statements affected by changed configuration |
| License           | Preserve `LICENSE` and third-party notices even if the showcased project's license differs               |
| Agent entrypoints | `AGENTS.md`, `CLAUDE.md`, this skill; keep customization instructions discoverable                       |

## Final coverage check

Use the old project name/namespace/URLs from the files you started with, not a hardcoded future assumption. For this starter, examples include Laravel SSO, `lauroguedes/laravel-sso`, `auth.example.com`, SSO user/role names, and the creator-reference screenshot. Check runtime content and visuals separately; a text search cannot inspect raster pixels.

Keep legitimate upstream credits and documentation references. Explain unresolved facts (for example, no public domain yet), and provide a complete local result without making the user change code themselves.
