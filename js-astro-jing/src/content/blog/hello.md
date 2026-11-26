---
title: Welcome to Astro Jing
date: 2026-04-25T23:47:00+08:00
tags:
  - Docs
  - Astro
categories:
  - Astro Jing
featured: true
toc: true
comments: false
---

[**Astro Jing**](https://github.com/ziteh/astro-jing-theme) is a calm blog theme powered by [Astro](https://astro.build/). This post will show you how to use it.

<!-- more -->

Features:

- Auto-generate post descriptions based on character count or up to the `<!-- more -->` tag
- Auto-expanding & collapsing table of contents
- Open Graph image generation
- Full-text search
- Syntax highlighting
- Math equations
- Internationalization (i18n)
- Comment systems (Giscus / Disqus)
- Sitemap & RSS feed
- Static site
- View the post as Markdown

## Usage

```bash
git clone https://github.com/ziteh/astro-jing-theme.git
cd astro-jing-theme
pnpm i
pnpm dev
```

## Markdown

### Posts

By default, place your post `.md` files in the `src/content/blog/` directory. Set `CONTENT_DIR` to use a different content root.

#### Frontmatter

The YAML frontmatter format for posts broadly compatible with [Hexo](https://hexo.io/docs/front-matter), the default values for some fields can be changed in the [`site.ts`](#sitets) configuration (with `defaultFm` prefix).

| Field         | Description                                       | Type                                                |
| ------------- | ------------------------------------------------- | --------------------------------------------------- |
| **`title`\*** | Post title (h1), also used as the metadata title. | string                                              |
| `description` | Post summary, auto-generated if not given.        | string                                              |
| **`date`\***  | Publish date                                      | string in `YYYY-MM-DDTHH:mm:ss`                     |
| `updated`     | Updated date                                      | string in `YYYY-MM-DDTHH:mm:ss`                     |
| `tags`        | Post tags                                         | Array of strings, default: `SITE.defaultFmTag`      |
| `categories`  | Post categories                                   | Array of strings, default: `SITE.defaultFmCategory` |
| `draft`       | Mark as draft, excludes from production           | boolean, default: `false`                           |
| `featured`    | Mark as featured post                             | boolean, default: `false`                           |
| `toc`         | Enable table of contents                          | boolean, default: `SITE.defaultFmToc`               |
| `comments`    | Enable comments                                   | boolean, default: `SITE.defaultFmComments`          |
| `math`        | Enable math equations                             | boolean, default: `SITE.defaultFmMath`              |

> **\***: required

## About

The Markdown for [about page](/about) is: `src/content/about.md`.

`about.md` does not require frontmatter; it is recommended not to include an `h1` (i.e. `# Header`).

## Configuration

There are some settings that need to be adjusted before deployment.

### site.ts

> [`src/config/site.ts`](https://github.com/ziteh/astro-jing-theme/blob/main/src/config/site.ts)

Basic site information and feature toggles.

| Field                    | Description                                                                       | Example                        |
| ------------------------ | --------------------------------------------------------------------------------- | ------------------------------ |
| **`url`\***              | Your site's URL                                                                   | `https://username.github.io`   |
| **`title`\***            | Blog title                                                                        | `My Blog`                      |
| **`description`\***      | Blog description                                                                  | `A personal blog`              |
| **`author`\***           | Blog author name                                                                  | `ZiTe`                         |
| `postsPerHomepage`       | Posts to display per page ([home](/))                                             | `3`                            |
| `postsPerArchives`       | Posts to display per page ([archives](/archives))                                 | `10`                           |
| `postsPerAllPosts`       | Posts to display per page ([posts](/posts))                                       | `5`                            |
| `getDescriptionCount`    | Character count for auto-description                                              | `150`                          |
| `getDescriptionMaxLines` | Max lines to process for auto-description                                         | `10`                           |
| `defaultFmTag`           | Default tag for posts                                                             | `Others`                       |
| `defaultFmCategory`      | Default category for posts                                                        | `""`                           |
| `defaultFmToc`           | Enable table of contents by default                                               | `false`                        |
| `defaultFmComments`      | Enable comments by default                                                        | `false`                        |
| `defaultFmMath`          | Enable math equations by default                                                  | `false`                        |
| `transitions`            | Enable [view transitions][astro-vt]                                               | `true`                         |
| `ogFontPath`             | Path to a local font file for OG images, bypassing the Astro Fonts API            | `fonts/NotoSansTC-Regular.ttf` |
| `postMdUrl`              | Generate a Markdown version of your blog posts for LLMs to crawl                  | `true`                         |
| `llmsTxt`                | Generate llms.txt for LLMs to crawl your blog posts (need `postMdUrl` to be true) | `false`                        |
| `viewAsMD`               | Add a "View as Markdown" button to post (need `postMdUrl` to be true)             | `true`                         |
| `disqusShortname`        | Disqus shortname                                                                  | `your-disqus-shortname`        |
| `giscusRepo`             | Giscus repository                                                                 | `user/repo`                    |
| `giscusRepoId`           | Giscus repository ID                                                              |                                |
| `giscusCategory`         | Giscus category name                                                              |                                |
| `giscusCategoryId`       | Giscus category ID                                                                |                                |

> **\***: important

### lang.ts

> [`src/config/lang.ts`](https://github.com/ziteh/astro-jing-theme/blob/main/src/config/lang.ts)

Internationalization (i18n) language and locale settings.

Key settings:

- `lang`: [BCP 47][bcp47] language tag (e.g., `en`, `zh-TW`)
- `langOg`: [Open Graph][og-locale] locale tag (e.g., `en_US`, `zh_TW`)
- `timeZone`: [IANA][iana-tz] time zone (e.g., `America/New_York`, `Asia/Taipei`)

To add a new language, modify the `myLang` object following the `en` template and update the exported `_t` constant.

### socials.ts

> [`src/config/socials.ts`](https://github.com/ziteh/astro-jing-theme/blob/main/src/config/socials.ts)

Social media links displayed in the site footer.

Each social link object contains:

- `title`: Link display text
- `href`: URL to the social profile

Example:

```ts
{
  title: "My GitHub",
  href: "https://github.com/username",
}
```

### astro.config.ts

> [`astro.config.ts`](https://github.com/ziteh/astro-jing-theme/blob/main/astro.config.ts)

Astro config, please refer to [Configuration overview](https://docs.astro.build/en/guides/configuring-astro/) and [Configuration Reference](https://docs.astro.build/en/reference/configuration-reference/).

## Features

Details of each feature.

### Auto-generate Description

If there is no `description` in the frontmatter, one will be generated automatically. There are two ways this is done:

1. If there is a `<!-- more -->` tag, the description will be the content from the first line up to the `<!-- more -->` tag.
2. If there is no `<!-- more -->` tag, the first `getDescriptionCount` characters will be used.

For performance reasons, only the first `getDescriptionMaxLines` lines of each `.md` file will be processed.

You can adjust `getDescriptionCount` and `getDescriptionMaxLines` in [`site.ts`](#sitets).

### Fonts

By default, Astro Jing downloads **Geist** (body) and **Fira Mono** (code) at build time via [Astro's built-in font API](https://docs.astro.build/en/guides/fonts/).

If you prefer **system-native fonts** — for example, to use Traditional Chinese fonts like PingFang TC / Microsoft JhengHei without any web font download — you can switch manually:

1. `astro.config.ts` — Remove the `--font-body` and `--font-mono` entries from the `fonts` array. Keep `--font-og` (Satori needs it to generate OG images).

   ```ts
   fonts: [
     // Remove --font-body and --font-mono entries
     {
       cssVariable: "--font-og",
       name: "Noto Sans",
       weights: [400],
       styles: ["normal"],
       formats: ["woff"],
       provider: fontProviders.fontsource(),
     },
   ],
   ```

2. `src/layouts/BaseLayout.astro` — Replace the two `<Font>` tags with an inline style that defines the CSS variables directly:

   ```astro
   <!-- Replace: -->
   <Font cssVariable="--font-body" preload />
   <Font cssVariable="--font-mono" />

   <!-- With: -->
   <style is:inline>
     :root {
       --font-body:
         "PingFang TC", "Microsoft JhengHei", "Noto Sans TC", system-ui, -apple-system,
         BlinkMacSystemFont, "Segoe UI", sans-serif;
       --font-mono:
         ui-monospace, "Cascadia Code", Menlo, Monaco, Consolas, "Courier New", monospace;
     }
   </style>
   ```

> Use `is:inline` so Astro does not scope the `<style>` tag — scoped styles would prevent `:root` from applying globally.

All other CSS files (`global.css`, `post.css`, etc.) already use `var(--font-body)` and `var(--font-mono)` and require no changes.

#### OG image font

OG images are rendered by [Satori](https://github.com/vercel/satori), which relies solely on the `--font-og` font's glyphs — it does not fall back to system fonts. By default `--font-og` is fetched via the Astro Fonts API, whose default subset only covers Latin characters. If your post titles/tags contain non-Latin characters (e.g. Chinese, Japanese, and Korean) that aren't in that subset, they will render as missing-glyph boxes in OG images.

To fix this, set `ogFontPath` in [`site.ts`](#sitets) to the path (relative to the project root) of a local font file that covers the characters you need, e.g.:

```ts
ogFontPath: "fonts/NotoSansTC-Regular.ttf",
```

When `ogFontPath` is non-empty, that font file is read directly for OG image rendering, bypassing the Astro Fonts API and its subsetting entirely. Leave it as `""` to keep using the Astro Fonts API.

### Syntax highlighting

Astro Jing uses [Expressive Code](https://expressive-code.com/) for syntax highlighting.

You can adjust its config in [`astro.config.ts`](#astroconfigts). [Themes](https://expressive-code.com/guides/themes/#available-themes)

Example:

```ts
// astro.config.ts
export default defineConfig({
  // ...
  integrations: [
    expressiveCode({
      plugins: [pluginLineNumbers()],
      themes: ["catppuccin-latte", "one-dark-pro"],
      defaultProps: {
        wrap: false,
        showLineNumbers: false,
      },
    }),
    // ...
  ],
});
```

<!-- ### Disqus Comment -->

<!-- ### Giscus Comment -->

## Deploy

You can easily deploy Astro Jing to a variety of platforms, including GitHub Pages, Netlify, Cloudflare, Vercel, and more, please refer to [Deploy your Astro Site](https://docs.astro.build/en/guides/deploy/).

[astro-vt]: https://docs.astro.build/en/guides/view-transitions/
[bcp47]: https://developer.mozilla.org/en-US/docs/Glossary/BCP_47_language_tag
[og-locale]: https://ogp.me/#optional
[iana-tz]: https://timeapi.io/documentation/iana-timezones
