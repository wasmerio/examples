---
title: "Site and Navigation"
description: "Identity, navigation links, home page sections, and pagination in site.ts."
date: 2026-06-27
order: 1
tags: ["Guide", "Configuration"]
toc: true
---

`src/config/site.ts` is the one file most sites need to touch.

## Identity

```ts
export const siteConfig = {
  name: 'Astro Narrow',
  shortName: 'Narrow',
  description: 'A content-focused Astro theme.',
  contentWidth: '56rem',
  author: {
    name: 'Your Name',
    title: { en: 'A line under your name', 'zh-cn': '名字下的一句话' },
    description: { en: '…', 'zh-cn': '…' },
    avatar: '/avatar.png',
    social: [
      { name: 'GitHub', url: 'https://github.com/you', icon: 'simple-icons:github' },
      { name: 'Email', url: 'mailto:you@example.com', icon: 'lucide:mail' }
    ]
  }
}
```

`author` fills the home profile card. `contentWidth` sets the default column width; visitors can adjust it from the Dock.

## Navigation

`nav` fills the Dock's menu panel. Items are registered route ids (`posts`, `projects`, `archives`) or inline links; inline links work with internal paths and external URLs:

```ts
nav: [
  'posts',
  'projects',
  'archives',
  { label: 'GitHub', href: 'https://github.com/', icon: 'simple-icons:github' },
  { label: { en: 'About', 'zh-cn': '关于' }, href: '/about/' }
]
```

`label` is a plain string or a per-locale record; `icon` is optional. External URLs open in a new tab with a small arrow marker. The footer is copyright-only.

## Home page and pagination

```ts
home: {
  recentPosts: { enabled: true, limit: 3 }
},
list: {
  pageSize: 10
}
```

The home page shows the profile card and the most recent posts. `/posts/` paginates with `pageSize`; page two and later live at `/posts/page/2/`.

## Comments and analytics

Fill in the `comments` block with your [giscus](https://giscus.app) repository ids and set `enabled: true`; `analytics` works the same way for Umami. Both stay off until enabled.
