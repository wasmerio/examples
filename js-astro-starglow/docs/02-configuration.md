# Configuring starglow

All site settings live in one typed file, `starglow.config.ts`, at the root of the repository. It is wrapped in `defineStarglowConfig()`, so your editor completes the keys and `astro check` reports a wrong type. The types and their comments are in `src/types/config.ts`, and the defaults are applied in `src/config.ts`.

The site URL is not in this file. It comes from `SITE_URL`, see [Getting started](./01-getting-started.md).

## site

| Key                | Required | Default         | What it does                                                                           |
| :----------------- | :------- | :-------------- | :------------------------------------------------------------------------------------- |
| `title`            | yes      |                 | Site title in the header, page titles and meta tags.                                   |
| `description`      | yes      |                 | Default meta description and RSS description.                                          |
| `author`           | yes      |                 | Default author of posts.                                                               |
| `profile`          | no       | none            | Author profile URL, used in structured data.                                           |
| `sourceUrl`        | no       | none            | Source repository of the site, linked from the footer. Empty means no link.            |
| `wordmark`         | no       | `title`         | Text of the header wordmark, set in the pixel font.                                    |
| `sourceBanner`     | no       | none            | An HTML comment with `art` and `message` lines, printed at the top of every page.      |
| `ogImage`          | no       | generated image | Fallback social image filename in `public/`. Only needed with `dynamicOgImage: false`. |
| `lang`             | no       | `"en"`          | The `lang` attribute of every page.                                                    |
| `timezone`         | no       | `"UTC"`         | IANA zone used to read and show post dates.                                            |
| `dir`              | no       | `"ltr"`         | Text direction: `ltr`, `rtl` or `auto`.                                                |
| `fediverseCreator` | no       | none            | Handle as `@user@instance`. Adds the `fediverse:creator` meta tag.                     |

The `sourceBanner` text ends up inside an HTML comment, so it must not contain two hyphens in a row, start with `>` or end with `-`. The build fails with a clear message if it does.

## person

Optional `Person` structured data on the homepage: `jobTitle` and `description`. Empty fields are left out. Placeholder text fails the build, because structured data should only carry real information.

## posts

| Key        | Default | What it does                                                                                      |
| :--------- | :------ | :------------------------------------------------------------------------------------------------ |
| `perPage`  | `4`     | Posts per page on paginated lists.                                                                |
| `perIndex` | `4`     | Featured projects on the homepage. The latest-writing list (posts and notes) shows twice as many. |

## features

| Key                | Default      | What it does                                                                                   |
| :----------------- | :----------- | :--------------------------------------------------------------------------------------------- |
| `lightAndDarkMode` | `true`       | The light and dark toggle. The first visit follows the system preference.                      |
| `dynamicOgImage`   | `true`       | Generated social images per post, note and project, plus `/og.png`.                            |
| `showBackButton`   | `true`       | The back link on posts and inner pages.                                                        |
| `editPost`         | disabled     | `{ enabled: true, url: "https://github.com/you/repo/edit/main/" }` adds an edit link to posts. |
| `search`           | `"pagefind"` | Full-text search on `/search/`. `false` removes it.                                            |
| `toc`              | `true`       | A table of contents on posts with two or more `h2` or `h3` headings.                           |

## appearance

These keys control the small amount of motion and decoration in the theme. All motion stops under `prefers-reduced-motion`.

| Key            | Default                                   | What it does                                                                                       |
| :------------- | :---------------------------------------- | :------------------------------------------------------------------------------------------------- |
| `ambient`      | `"none"`                                  | Inner light of the header band: `none`, `light` (static), `breathe` (slow pulse), `dawn`.          |
| `wordmarkGlow` | `false`                                   | A soft pulsing glow on the header wordmark.                                                        |
| `statusline`   | `false`                                   | A vim-style status bar on post and note pages: source path, file type and scroll position.         |
| `palette`      | `{ dark: "starglow", light: "starglow" }` | The dark and light colour palettes, see [Customising](./05-customising.md).                        |
| `palettes`     | none                                      | Your own palettes by name, usable in `palette`.                                                    |
| `preview`      | `false`                                   | A floating panel to switch palettes and effects live, for demos. Changes last one browser session. |

The demo site uses `ambient: "breathe"`, `wordmarkGlow: true`, `statusline: true` and `preview: true`. Turn `preview` off on your own site.

## links

Small 88x31 badges under the footer, one line of text and an icon each:

```ts
links: [
  { type: "rss", url: "/rss.xml" },
  { type: "github", url: "https://github.com/you" },
  { type: "email", url: "mailto:you@example.com" },
],
```

Known types with their own icon: `github`, `gitlab`, `codeberg`, `srht`, `linkedin`, `mastodon`, `bluesky`, `stack`, `hackaday`, `crates`, `email`, `rss` and `sparkle`. Any other type gets a generic link icon. A `url` may be `http(s)`, `mailto:` or a site path starting with `/`. Optional `label` and `title` override the badge text and the tooltip.

Every configured social profile without a badge of its own gets one automatically.

## socials

```ts
socials: [
  { name: "github", label: "GitHub", url: "https://github.com/you" },
  { name: "mastodon", label: "Mastodon", url: "" },
],
```

Profiles appear on `/contact/`, in the footer badges and in the homepage structured data (`sameAs`). An empty `url` renders nowhere, so you can keep unused slots in the file. Supported names: `github`, `linkedin`, `mastodon`, `bluesky`, `lemmy`, `x`, `reddit`, `devto` and `medium`.

## footer

`footer.credit` shows "powered by `starglow`" in the footer, linked to the theme repository. It is on by default. Set it to `false` to remove the line. Keeping it is a nice way to say thanks.

## Environment variables

| Variable                          | What it does                                                                                 |
| :-------------------------------- | :------------------------------------------------------------------------------------------- |
| `SITE_URL`                        | The site origin.                                                                             |
| `BASE_PATH`                       | Subpath for a project site, e.g. `/repo` for `https://<user>.github.io/repo/`. Unset = root. |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Optional Search Console token, used when `site.googleVerification` is empty.                 |
| `MARKERS_STRICT`                  | `true` makes the placeholder check fail instead of warn.                                     |

Set a variable in the shell (`SITE_URL=https://example.org ./dev.sh build`) or copy `.env.example` to `.env` and uncomment or add the line (copying alone changes nothing, because the lines ship commented out). A variable set in the shell wins over `.env`.

- `SITE_URL` must be an origin only. A value with a path, query or hash fails the build with an error message. Put a subpath in `BASE_PATH` instead.
- `BASE_PATH` is a path such as `/repo`. Links in Markdown should be relative (`../other-post/`) or start with the base, because root links like `/blog/` are not rewritten.
- `PUBLIC_GOOGLE_SITE_VERIFICATION` is public by design, because it ends up in the HTML, but it belongs in the environment and never in a committed file. An empty value renders no meta tag. Compose forwards it, like `SITE_URL`, into the container.
- `MARKERS_STRICT` is not forwarded into the container, and `scripts/check-markers.ts` never reads `.env`. Locally, use `./dev.sh pnpm markers --strict` instead.
- The marker check also reads `GITHUB_ACTIONS`, which GitHub sets on its runners, to print one annotation per marker.
