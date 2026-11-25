---
title: 'Configuration and extensions: make it yours'
slug: 'configuration'
date: 2026-08-15
description: 'Adjust appearance, copy, navigation, sharing and statistics, and add your own styles and scripts.'
categories: ['customization']
tags: ['astro', 'design']
updated: '2026-10-16'
---

Use `blog.config.ts` to adjust the site’s appearance, content and interactions. Manage friend links in `friends.config.ts`, and add custom styles or scripts through the files in `custom/`.

## Site and descriptive copy

`site` sets the name, production address, languages and timezone; `author` sets the name, biography, avatar and social links. Homepage headings, search prompts and footer copy live in `text`.

Display copy accepts plain strings or localized maps:

```ts
author: {
  name: { zh: '站点作者', en: 'Site author' },
  bio: {
    zh: '记录日常与想法。',
    en: 'Notes from everyday life.',
  },
}
```

Choose content languages through `site.locales`; missing interface translations fall back automatically. Contributors add translations under `src/i18n/`, register them in that directory’s `i18n.config.ts`, and contribute both to the repository.

## Appearance

```ts title="blog.config.ts"
appearance: {
  defaultTheme: 'system',
  pageTransition: 'fade',
  codeThemes: { light: 'github-light', dark: 'github-dark' },
  showCodeLineNumbers: false,
  categoryCoverStyle: 'thumbnail',
}
```

Choose light, dark or system appearance, content transitions and code themes. Category cards support thumbnail, right-fading and full-background covers. Adjust individual categories with `coverStyle`.

## Navigation, footer and friends

`sidebar.items` sets sidebar navigation, and `sidebar.menu` sets the top-left site-name menu. Entries open builtin pages, standalone pages or external links. Binding a builtin page with `page` uses the corresponding pages entry for its title, description and introduction.

`footer` sets the start date, copyright author, content license and theme attribution. Friend links support groups, avatars, descriptions and search.

## Sharing and statistics

`sharing.copyFormat` sets the copied sharing message; `sharing.platforms` sets platform names, icons and links. Use placeholders such as `{title}`, `{description}`, `{author}`, `{blog}` and `{url}`.

`article.shareCover` sets the dimensions, colors and font for automatic Satori share covers. `statistics` controls individual metrics, the publication heatmap and article-length bars.

## Global extensions

| File                     | Purpose                                     |
| ------------------------ | ------------------------------------------- |
| `custom/head.html`       | Add content to head                         |
| `custom/body-start.html` | Add content at the start of body            |
| `custom/body-end.html`   | Add content at the end of body              |
| `custom/styles.css`      | Custom styles                               |
| `custom/client.ts`       | Run scripts on page load and handle cleanup |
| `custom/components/`     | MDX components shared by multiple articles  |

See the [theme documentation](https://bloggpt.reincarnatey.net/en/config/reference) for all fields, defaults and examples.
