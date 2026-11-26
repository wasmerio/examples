# Configure Constructa

For normal content, copy, SEO, navigation, palette, and supported presentation
changes, edit **`cv.json` only**. No component edits are needed. Custom layouts
and new application features still require code; the configuration is not an
arbitrary page builder.

`cv.schema.json` provides editor completion and field validation. The runtime
schema in `src/data/schema.ts` validates the same content during development and
build. Read the checked-in example alongside this guide, and retain fields you
are not changing.

## Field map

| Group | What it controls |
| --- | --- |
| `site` | Deployment address, language, timezone, SEO, entrance loader, feature choices, and footer settings. |
| `hero` | Opening name lines, role, description, location, call to action, metrics, typography, and globe. |
| `sections` | Chapter order, visibility, navigation inclusion, labels, headings, and tones. |
| `ui` | Flat string overrides for interface and component copy. |
| `basics` | Profile, contact links, portrait, default palette, and biography. |
| `work` | Experience records, dates, responsibilities, achievements, and tools. |
| `projects` | Work titles, descriptions, images, highlights, live URLs, and source URLs. |
| `education`, `certificates` | Education and certification records. |
| `skills` | Names, categories, proficiency labels, and icons. |
| `images` | Gallery introduction and images with alternative text and captions. |
| Other CV lists | Optional supporting records accepted by the schema. |

## Site address and SEO

The public deployment address is separate from a profile link such as
`basics.url`. Set `site.url` to the public origin and `site.base` to the pathname
where the site is hosted.

For a GitHub Pages project:

```json
{
  "site": {
    "url": "https://your-name.github.io",
    "base": "/your-repository/",
    "lang": "en",
    "locale": "en_US",
    "timeZone": "Europe/London",
    "seo": {
      "title": "Alex Morgan - Developer & Designer",
      "description": "Selected projects, experience, and experiments by Alex Morgan.",
      "keywords": ["portfolio", "developer", "designer"],
      "image": "/images/social-card.png",
      "imageAlt": "Alex Morgan portfolio preview",
      "twitterHandle": "",
      "noIndex": false
    }
  }
}
```

Examples in this guide are **partial fragments to merge into the existing
configuration**, not replacements for the entire file. Use your real details.

For a custom domain or a `your-name.github.io` repository, the base is normally
`/`. Set `lang` for the document language, `locale` for social metadata, and an
IANA timezone such as `Asia/Shanghai` for the local clock. SEO descriptions
should summarize the real page, not promise unmeasured performance or awards.

`site.favicon` points to your favicon asset. `site.appleTouchIcon` controls the
Apple touch icon and defaults to `/apple-touch-icon.png`; a public path or trusted
HTTP(S) URL is accepted and local paths respect the deployment base.
`site.seo.noIndex` is useful for a preview deployment you do not want indexed.
Check the built page and crawler metadata before publishing; a local setting is
not a guarantee that a previously indexed URL disappears from search results.

CI/showcase builds can override the origin and base with `SITE_URL` and
`BASE_PATH`. Normal site customization still belongs in `cv.json`; see the
[deployment guide](DEPLOYMENT.md) for these overrides and GitHub Pages crawler
limitations.

## Profile and palette

Edit `basics.name`, `basics.label`, `basics.email`, `basics.summary`, location,
profiles, and biography to describe the owner of the site. Delete inapplicable
demo records rather than turning them into invented accomplishments.

`basics.theme` accepts six palette IDs:

| ID | Palette |
| --- | --- |
| `red` | Signal |
| `pink` | Rose |
| `orange` | Ember |
| `cyber` | Acid |
| `green` | Field |
| `blue` | Cobalt |

Each includes a dark variant. Visitor preferences override the configured
default when saved storage is available. Test a fresh browser profile to see
the default you just changed.

## Hero composition

`hero.nameLines` controls the explicit heading lines, independent of the
owner's machine-readable name. Keep them short enough for small viewports.
Use `role`, `description`, `location`, `availability`, `note`, and `scrollLabel`
for the surrounding copy. Up to three name lines and six metrics are supported;
fewer, shorter values are usually easier to read.

```json
{
  "hero": {
    "nameLines": ["Alex", "Morgan"],
    "description": "Interfaces with character. Systems with care.",
    "cta": { "label": "Explore my work", "href": "#projects" },
    "metrics": [
      { "value": "06", "label": "Selected projects" }
    ],
    "typography": { "mixed": true, "shuffle": true, "seed": 42 }
  }
}
```

`mixed` enables interleaved font treatments. `seed` gives the composition a
reproducible starting point; `shuffle` controls the optional rearrangement
behavior. Turning the effect off leaves an ordinary readable heading. Do not
infer accessibility or performance from an effect being decorative: check your
actual name, font combination, and target viewport.

`hero.globe` exposes `enabled`, `autoRotate`, `speed`, `dotSize`, `latitude`,
`longitude`, and `label`. Use these settings instead of changing the renderer.
The globe is original code-native artwork; no React Bits component is bundled.
Its label should describe your chosen location or concept without implying
live tracking. Reduced-motion preferences take precedence over animation.

Hero metrics are explicit content. They must be supported by your actual work;
the theme does not verify or manufacture them.

## Sections and navigation

`sections` is an ordered array. It controls chapter order and the corresponding
navigation. Use these IDs:

```text
top  about  experience  projects  education  skills  gallery  contact
```

Each section accepts `id`, `label`, `title`, `kicker`, `tagline`, optional `meta`,
`enabled`, `nav`, and `tone`. Index numbers are derived by the theme; do not maintain a
second numbering system in components. Retain the set of section records from
the example and change their settings as needed.

```json
{
  "id": "gallery",
  "label": "Sketchbook",
  "title": "Away from the screen",
  "kicker": "Field notes",
  "tagline": "Studies and observations",
  "enabled": true,
  "nav": false,
  "tone": "paper-2"
}
```

`enabled: false` omits a chapter; `nav: false` leaves it out of the primary
navigation while keeping the chapter. Tone values are `paper`, `paper-2`,
`ink`, and `accent`. Check links such as `hero.cta.href` when hiding a target
section. Reordering data is not permission to duplicate section IDs.

## Entrance loader

`site.loader` controls the color plates that assemble before the first view.
These are partial settings to merge into the existing `cv.json`:

```json
{
  "site": {
    "loader": {
      "enabled": true,
      "minimumDuration": 1800,
      "maxWait": 6000,
      "label": "Constructa",
      "colors": ["#f03a17", "#1d4ed8", "#d6e600", "#f2eadb", "#121110"]
    }
  }
}
```

| Setting | Accepted value | Behavior |
| --- | --- | --- |
| `enabled` | Boolean; default `true` | Set to `false` to omit the entrance entirely. |
| `minimumDuration` | Integer milliseconds, 0–3000; default 1800 | A visual duration floor; setting zero still retains the assembly and reveal animations. |
| `maxWait` | Integer milliseconds, 1000–10000; default 6000 | Bounds font readiness. The independent watchdog includes a short transition allowance and takes precedence over the visual floor. |
| `label` | 1–40 characters | The loader wordmark. |
| `colors` | 3–6 hexadecimal colors, `#RGB` or `#RRGGBB` | Plate colors in sequence. The first color becomes the final full-screen field. |

The entrance has a keyboard-accessible skip button. Reduced-motion visitors
and no-JavaScript visitors reach the document directly. A failed font or script
load cannot leave the page locked indefinitely. Loader status and skip wording
can be changed through `ui` keys `loader.loading`, `loader.fonts`,
`loader.ready`, and `loader.enter`.

## Feature choices

`site.features` contains boolean switches for:

```text
smoothScroll  scrollMotion  sectionTransitions  projectExhibition  cursor  blueprint
commandPalette  posterStudio  print  themeSwitch  marquee
```

Disable enhancements you do not need instead of deleting their code. Desktop
horizontal work also depends on viewport size and motion preferences; setting
`projectExhibition: true` does not force it onto a phone or a reduced-motion
visitor. Disabling `smoothScroll` keeps native page scrolling.

`sectionTransitions` adds a short visual bridge before each chapter after the
first. Disable it to keep only the sections. Its thought lines use `ui` keys
`story.top`, `story.about`, `story.experience`, `story.projects`,
`story.education`, `story.skills`, `story.gallery`, and `story.contact`.
The destination and numbering follow the configured chapter order. Disabling
`scrollMotion` keeps the bridges static while preserving their text.

`site.footer.copyrightStart` sets the first year of the footer date range.
`site.footer.showAttribution` controls the optional visible theme credit; it
does not remove the license-notice obligations of distributed code.

## Interface copy and localization

`ui` is a flat `Record<string, string>`. Use the keys present in the checked-in
example and schema to change button labels, instructions, captions, and other
interface copy. Do not translate implementation IDs such as `projects`, palette
IDs such as `red`, or icon names.

```json
{
  "ui": {
    "site.index": "Explore",
    "site.openIndex": "Open the site index",
    "hero.reroll": "Remix the letters",
    "common.caseLabel": "Read the case: {name}"
  }
}
```

Keep interpolation tokens such as `{name}` intact. `hero.marquee` configures the
opening moving text strip; disable it through `site.features.marquee` when it
does not suit your content.

To localize a site:

1. Set `site.lang`, `site.locale`, and the intended `site.timeZone`.
2. Translate profile and content fields, `hero`, and chapter labels/copy.
3. Translate the relevant values in `ui`, preserving any documented tokens.
4. Recheck heading lengths, buttons, dates, image alternative text, and print.

The English and Chinese README files document the theme; they do not themselves
make a deployed portfolio multilingual or add language routes.

## Images

Image fields accept a public path or a remote URL. For example, a file at
`public/images/project-cover.svg` is referenced as `/images/project-cover.svg`
in `cv.json`, not as `public/images/project-cover.svg`.

```json
{
  "projects": [
    {
      "name": "Your project",
      "description": "What it does and what you contributed.",
      "image": {
        "url": "/images/project-cover.svg",
        "position": "container"
      },
      "url": "https://example.com"
    }
  ]
}
```

The theme resolves local paths against its base path for deployment. Do not
hardcode `/astro-constructivist/` into every image field. An absolute HTTPS URL
can point to an image you control; verify that the host permits loading and
does not require a session or hotlink-referrer exception.

Use meaningful gallery alternative text and captions. Project `image.dark` can
provide a separate dark-theme preview. `position: "container"` preserves a
framed screenshot; `"background"` uses a cover-style treatment. The demo graphics
are original SVG examples, not proof of real client work.

Image output follows Astro's source-format inference. Local and remote SVGs
remain SVGs; supported raster sources use the default WebP output. The theme
does not force SVG rasterization. Wide Latin heading lines and Chinese
full-width glyphs have separate width estimates, but translated text still
needs visual inspection at the intended desktop and mobile sizes.

## Validate before publishing

```bash
pnpm check-config
pnpm typecheck
pnpm build
```

Then inspect the production preview at desktop and mobile widths. Check every
link, empty/disabled sections, a long project title, the lightbox, keyboard
navigation, reduced-motion, and both print modes. For a content-only edit,
`git diff --name-only` should normally show only `cv.json`.

For an application change that extends the schema, run `pnpm schema` and commit
the generated `cv.schema.json` too. Its UI hints come from the theme's defaults,
not your current translated values, so normal copy edits do not create schema
drift. `pnpm schema:check` verifies that contract in the quality gate.
