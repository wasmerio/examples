# Customization reference

[Back to README](../README.md) · [Project structure](architecture.md)

## Configuration model

The template uses Astro content collections with validation in [src/content.config.ts](../src/content.config.ts). Content is read at build time; changes require a new production build. Development mode reloads content automatically.

- **One project:** `src/content/project/main.yaml`. Keep the entry name `main`.
- **Repeatable content:** JSON files for features, setup steps, and integrations; Markdown files for FAQs.
- **Appearance:** CSS custom properties and component styles.
- **Deployment:** `PUBLIC_SITE_URL` and `astro.config.mjs`.

Start by editing the included project rather than replacing it with a partial example. Fields below are required unless marked optional or given a default. Text must be nonempty. External links must be HTTP(S) URLs; only the stamp also accepts fragment links. Unknown keys do not become settings automatically: add a schema field and a component consumer together.

## Project identity and links

| Field                 | Purpose                                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------ |
| `name`                | Full project name; page title, social site name, navigation accessibility label, and mobile menu title |
| `shortName`           | Visible navigation name and decorative footer wordmark; the components append a period                 |
| `description`         | Default metadata description; distinct from visible hero copy                                          |
| `repository`          | Repository link in navigation and the final CTA                                                        |
| `docs`                | Hero, navigation, and footer documentation destination; final CTA fallback when no setup steps exist   |
| `demo`                | Optional demo URL; omit the key to hide all demo links                                                 |
| `license`             | Displayed license name; does not modify the repository’s `LICENSE` file                                |
| `author`              | Creator’s name                                                                                         |
| `authorUrl`           | Creator-credit destination                                                                             |
| `authorAvatar`        | Optional local image path                                                                              |
| `authorAvatarFraming` | `portrait` (default) or `reference`; use `portrait` for your own image                                 |

The example’s `reference` framing crops the supplied creator screenshot using CSS. It is tailored to that asset, not a general portrait crop preset.

## Hero

| Field            | Purpose / default                                      |
| ---------------- | ------------------------------------------------------ |
| `eyebrow`        | Small line above the heading                           |
| `headline`       | First heading line                                     |
| `headlineAccent` | Second, italic accent line                             |
| `intro`          | Supporting paragraph                                   |
| `command`        | Copyable installation command; supports multiline text |
| `background`     | `glow` (default), `grid`, or `rays`                    |

```yaml
headline: Your project.
headlineAccent: Your way.
intro: A short explanation of what your project helps people do.
command: npm install your-package
background: glow
```

Backgrounds are configuration-only options; there is no visitor-facing chooser. The command box uses a translucent glass treatment from `ContentCommand.astro`.

### Hero stamp

`stamp` is optional. Remove it to omit the seal, or set `enabled: false` while retaining its content.

```yaml
stamp:
  enabled: true
  ringText: FREE ASTRO TEMPLATE · MAKE IT YOURS ·
  title: Use this template
  label: Use this landing page as a free Astro template
  href: "#"
```

| Field      | Purpose                                                           |
| ---------- | ----------------------------------------------------------------- |
| `enabled`  | Defaults to `true` when the object is present                     |
| `ringText` | Circular text; keep it short enough to remain legible             |
| `title`    | Short center label, ideally two or three words                    |
| `label`    | Accessible link name and tooltip                                  |
| `href`     | HTTP(S) destination or fragment; the shipped `#` is a placeholder |

The seal keeps a transparent background, rotates slightly and increases opacity on hover/focus. Reduced motion disables rotation. On narrower layouts it moves below the hero actions. Replace both the wording and destination when using it for an award or certification.

## Product preview

The `preview` object is required.

| Field        | Purpose / default                                                 |
| ------------ | ----------------------------------------------------------------- |
| `frame`      | Screenshot frame: `arc` (default), `browser`, or `safari`         |
| `address`    | Decorative address; not a real browser control or navigation link |
| `caption`    | Text beneath the preview; also fallback image description         |
| `image`      | Optional local screenshot; default/dark image                     |
| `imageLight` | Optional light screenshot; used only with `image`                 |
| `imageAlt`   | Optional shared image description; prefer an explicit description |
| `title`      | Heading for the built-in illustration fallback                    |
| `subtitle`   | Supporting text for the fallback                                  |
| `apps`       | Nonempty list of app names for the fallback                       |

```yaml
preview:
  frame: arc
  address: app.example.com
  caption: Your application in action.
  image: ../../assets/screenshots/applications-dark.png
  imageLight: ../../assets/screenshots/applications-light.png
  imageAlt: Application list with status, type, and client identifiers.
  title: Your applications
  subtitle: Everything in one place.
  apps:
    - Dashboard
    - Customer Portal
```

The fallback fields remain required by the schema even when you use a screenshot. Without `image`, an editable application-dashboard illustration appears. That illustration has its own built-in chrome; `frame` selects the frame around **screenshots**.

| Frame     | Appearance                                                      |
| --------- | --------------------------------------------------------------- |
| `arc`     | Translucent border only, no navigation bar                      |
| `browser` | Glass frame, address bar, and neutral controls                  |
| `safari`  | Compact toolbar and red, yellow, and green macOS-style controls |

## Images and cropping

Put imported assets in `src/assets/`. Paths in the project YAML are relative to `src/content/project/main.yaml`, so `../../assets/screenshots/file.png` points into `src/assets/screenshots/`.

Astro reads image metadata and generates responsive assets through the Lumos `Img` component. Do not put `/public` in a collection image path. Files in `public/` are served directly and are appropriate for favicons and the default social image.

- `image` is used in dark mode and in both themes when no `imageLight` is supplied.
- `imageLight` overrides the image in light mode.
- Both variants share `imageAlt`.
- Use matching compositions/aspect ratios to avoid a layout jump on theme change.
- The preview loads eagerly; highlight screenshots load lazily.

Highlight images accept `crop` and `cropLight`:

```yaml
crop:
  x: 10
  y: 12
  width: 752
  height: 409
```

Values describe a rectangle in **source-image pixels**, starting at the top-left. Coordinates must be nonnegative, dimensions positive, and the rectangle should stay within the image. Crop framing is applied with CSS; source files are preserved. Each theme has its own crop; omitting `cropLight` shows the full light image. These crop settings belong to highlights, not `preview`.

## Facts and highlights

### `stats`

An array of `{ value, label, href? }`. Set `stats: []` to hide the facts section.

```yaml
stats:
  - value: Open source
    label: Built in the open
    href: https://github.com/your-org/your-project
  - value: MIT
    label: Free to make it yours
```

These are editorial values, not live GitHub metrics.

### `highlights`

An array in display order. Set `highlights: []` to hide the section. Rows alternate their visual/text placement.

| Field                             | Purpose                                            |
| --------------------------------- | -------------------------------------------------- |
| `eyebrow`                         | Small section label                                |
| `title`                           | Heading; YAML multiline text preserves line breaks |
| `description`                     | Supporting paragraph                               |
| `graphic`                         | Built-in fallback: `flow` or `roles`               |
| `image`, `imageLight`, `imageAlt` | Optional screenshot pair and description           |
| `crop`, `cropLight`               | Optional source-image crop rectangles              |

```yaml
highlights:
  - eyebrow: BUILT FOR YOUR TEAM
    title: |-
      One workspace.
      Every project.
    description: Explain the benefit shown in the screenshot.
    graphic: roles
    image: ../../assets/screenshots/user-access.png
    imageLight: ../../assets/screenshots/user-access-light.png
    imageAlt: Team members and their application roles.
```

A screenshot takes precedence over `graphic` and always uses the Arc frame. Without a screenshot, `flow` shows the interactive sign-in journey and `roles` shows the sample permissions illustration.

The SSO flow plays once on pointer hover, tapping/clicking the illustration, or pressing Enter/Space while it is focused. The caption is centered; there is no replay link. With reduced motion enabled, activation shows the completed state immediately. Its labels, timings, and path belong to [GraphicSsoFlow.astro](../src/components/Graphic/GraphicSsoFlow.astro). Replace that graphic or provide a screenshot for a product unrelated to SSO.

## Section copy

These fields live in the project YAML:

| Section      | Fields                                     |
| ------------ | ------------------------------------------ |
| Features     | `featuresHeading`, `featuresIntro`         |
| Setup        | `setupHeading`, `setupIntro`, `setupNote`  |
| Integrations | `integrationsHeading`, `integrationsIntro` |
| FAQ          | `faqHeading`, `faqIntro`                   |
| Final CTA    | `ctaHeading`, `ctaIntro`                   |

`faqHeading` defaults to “A few things worth knowing.” and `faqIntro` defaults to “Answers to the questions that come up before your first install.” Other fields are required, even if their collection is empty.

## Repeatable collections

Each entry needs a nonnegative integer `order`. Use distinct numbers for predictable ordering. Filenames identify entries; the homepage sorts by `order`, not filename. Keep JSON entries directly inside their collection folder.

### Features: `src/content/features/*.json`

```json
{
  "title": "Simple setup",
  "description": "Start with one command.",
  "icon": "code",
  "order": 0
}
```

All four fields are required. Supported icons: `key`, `globe`, `apps`, `shield`, `users`, `code`, `activity`, `palette`, `book`. To add an icon, extend both the schema enum and the path map in `ContentProjectFeatures.astro`.

### Setup steps: `src/content/steps/*.json`

```json
{
  "title": "Install the package",
  "description": "Add it to your project.",
  "command": "npm install your-package\nnpm run dev",
  "order": 0
}
```

All four fields are required. JSON uses `\n` for line breaks. Step numbers are generated from the sorted position; they are independent of the numeric `order`. Commands are displayed/copied, never run by the landing page.

### Integrations: `src/content/integrations/*.json`

```json
{
  "title": "JavaScript",
  "description": "Import the client and configure your endpoint.",
  "icon": "nodejs",
  "language": "javascript",
  "code": "import { client } from 'your-package';",
  "package": "your-package",
  "source": "https://example.com/library",
  "href": "https://example.com/guide",
  "order": 0
}
```

| Field                           | Purpose                                                                                |
| ------------------------------- | -------------------------------------------------------------------------------------- |
| `title`, `description`, `order` | Required tab label, explanation, and position                                          |
| `language`                      | Required syntax-highlighting language                                                  |
| `code`                          | Required excerpt; escape newlines/quotes as JSON                                       |
| `href`                          | Required integration-guide URL                                                         |
| `icon`                          | Optional: `laravel`, `nodejs`, `python`, `go`, `openid`; defaults visually to `openid` |
| `package`                       | Optional dependency or protocol label                                                  |
| `source`                        | Optional library reference; separate link omitted when equal to `href`                 |

Supported languages: `php`, `javascript`, `typescript`, `python`, `go`, `bash`, `json`, `text`, `ruby`, `rust`, `java`, `csharp`. Extend the enum for additional Shiki-supported languages.

Examples use GitHub light/dark highlighting. The code area has a 14rem minimum and 22rem maximum height; long examples scroll, and the explanation stays at the bottom. Shared panel sizing avoids abrupt jumps between tabs.

Tab titles become URL slugs: “Any OIDC client” becomes `?tab=any-oidc-client`. Use distinct titles that also produce distinct slugs. A matching URL opens and scrolls to that tab. Without JavaScript, all examples remain visible.

The supplied Laravel example uses [SocialiteProviders OpenID Connect](https://socialiteproviders.com/OpenIDConnect/). Examples show configuration excerpts; they are not a complete authentication application or a live credential test. Replace packages, code, and destination links when showcasing a different project.

Brand SVGs and their credits live in `src/assets/icons/brands/`. Add the asset, schema enum, and icon import/map together when extending that set.

### FAQ: `src/content/faq/*.md`

```md
---
question: Can I use this commercially?
order: 0
---

Yes. Explain your terms and link to the relevant documentation.
```

`question` and `order` are required frontmatter. The body is rendered as Markdown inside a native disclosure. Keep headings and links meaningful when writing longer answers.

## Hide, reorder, or add sections

- Remove `demo` to hide demo links.
- Remove `stamp` or disable it to hide the seal.
- Empty `stats` or `highlights` to hide those sections.
- Remove all matching content files from `features`, `steps`, `integrations`, or `faq` to hide that section. Move draft files outside the matching collection folder.
- Empty features/steps also hide the corresponding desktop and mobile navigation links.
- With no integrations, the setup section omits its “Then connect your first app” link.
- With no steps, the final “Get started” CTA links to `docs`.
- Hero and final CTA are always included by the homepage; remove their calls or use `render={false}` in `index.astro` if needed.

Reorder section calls in `src/pages/index.astro`. Keep the `features`, `get-started`, and `connect` IDs synchronized with internal links when renaming sections. Optional arrays/collections hide rendering; they do not make the associated project fields optional in the schema.

## Design, branding, and shared copy

### Colors and type

Edit [src/styles/base.css](../src/styles/base.css):

| Token / setting                                                    | Purpose                                                          |
| ------------------------------------------------------------------ | ---------------------------------------------------------------- |
| `--brand-500`                                                      | Accent; set both its root/light value and `.theme-dark` override |
| `--light-100` through `--light-300`                                | Light surface palette                                            |
| `--dark-700` through `--dark-900`                                  | Dark surface palette                                             |
| `--brand-text`                                                     | Text on accent buttons                                           |
| `--background`, `--background-2`, `--text`, `--text-2`, `--border` | Semantic colors mapped by theme                                  |
| `--code-background`, `--code-text`                                 | Code-panel surfaces and chrome; token colors come from Shiki     |
| `--primary-family`                                                 | Main font family                                                 |
| `--accent-family`                                                  | Hero italic font; Georgia by default                             |
| `--font-code`                                                      | Monospace family                                                 |
| `--display-*`, `--h1-*`…                                           | Fluid type sizes and typography settings                         |
| `--max-width-main`, `--site-margin`, `--section-space-*`           | Layout width and spacing                                         |
| `--hover-duration`, `--hover-ease`                                 | Shared interaction timing                                        |

Inter is bundled locally and configured in `astro.config.mjs`; update that font configuration and `BaseHead.astro`’s `Font` reference when replacing it. The supplied font is regular weight; add real variants if you need distinct weight files.

The root theme defaults to light in `BaseLayout.astro`. Change its `theme` default or pass a theme prop to set a different initial theme. A stored visitor choice takes precedence and is kept under `landpack-theme` in local storage. The final CTA explicitly uses the dark theme. The layout’s HTML language is `en`; `SITE_LOCALE` in `src/consts.ts` controls formatted dates. Translating the template also requires updating both and the shared UI labels below.

### Logos, wordmark, and shared labels

- Replace the inline mark in `Graphic/GraphicMark.astro`.
- Replace `public/favicon.svg` and `public/og-image.jpg`; the SVG is the favicon referenced by `BaseHead.astro`. An inherited `favicon.ico` is also present.
- The footer wordmark uses `shortName` and appends a period. Its size, mask, opacity, and blur live in `Global/Footer.astro`; use a short name that fits.
- Shared navigation labels live in `Global/Nav.astro`.
- Hero button/license text lives in `Content/SectionProjectHero.astro`.
- “THE TOOLKIT”, “GET STARTED”, and “SPEAKS YOUR LANGUAGE” live in their respective content components.
- Integration chrome/link labels live in `ContentProjectIntegrations.astro`; final CTA button labels live in `SectionProjectCta.astro`.
- Footer labels/license sentence live in `Global/Footer.astro`.
- Built-in dashboard, role, and SSO illustration labels are component content, not YAML fields.

Use `Button` with `variant="link"` for inline text links. `arrow="right"` and `arrow="up-right"` provide the same hover/focus animation on links and standard buttons.

### Motion and navigation

Component styles own their motion. `Nav.astro` handles scroll direction and opens the mobile sidebar with Lumos `Modal`. `ScrollBlur.astro` renders a fixed, pointer-transparent blur at the viewport bottom; remove its call from `BaseLayout.astro` to disable it. Browser frames, stamp, diagram, footer wordmark, and hero effects live beside their markup.

Preserve reduced-motion rules when editing transitions. Keep essential information visible without animation. The SSO graphic’s nodes are layered above its moving dot, so the dot passes behind each box.

## Metadata and production URLs

- `name` and `description` in project YAML provide the default metadata via `src/consts.ts`.
- Optional `seo` in project YAML selects the default social image. It requires `image` (a root-relative public path or HTTP(S) URL) and `imageAlt`; `imageWidth` and `imageHeight` are optional positive pixel dimensions.
- `PUBLIC_SITE_URL` sets Astro’s `site` in `astro.config.mjs` and must be the landing page’s production origin.
- `BaseLayout.astro` accepts `title`, `description`, `image`, `imageAlt`, `imageWidth`, `imageHeight`, `type`, and `noindex`; these flow into `BaseHead.astro`.
- `image` defaults to the project `seo.image`, or `/og-image.jpg` when omitted. Use `npm run og:generate` to regenerate that file from content/colors, or supply your own card. Update its alt text and dimensions when replacing it.
- Titles on additional pages become `Page title | Project name`.
- `NOINDEX_ROUTES` in `src/consts.ts` excludes `/404` and `/example-components` from indexing and the sitemap. Add other private/demo routes there when needed. This is indexing guidance, not access control.
- `robots.txt` publishes the sitemap location. Generated sitemap files use the configured production origin.

Use `.env` locally and the host’s build environment in production. Only `.env.example` should be committed. `PUBLIC_` variables are public configuration, not a place for secrets.

The [SEO guide](seo.md) includes the audit results, all social-image settings, page overrides, and sharing checks. To let an agent perform the customization, use the [included AI skill](ai-customization.md).

## Verify your changes

```sh
npm run check
npm run build
npm run seo:check
npm run preview
```

Check content, theme switching, mobile navigation, keyboard focus, copy controls, tab URLs, and image crops. Confirm the production URL and replace the stamp placeholder before publishing. For schema changes, test both valid content and omitted optional content, and update this guide alongside the schema.
