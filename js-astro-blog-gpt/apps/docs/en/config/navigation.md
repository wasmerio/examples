# Navigation, Author, and Friends

This guide shows you how to customize the collapsible sidebar (`sidebar`), your author profile card (`author`), the footer (`footer`), and your blogroll (`friends.config.ts`).

## Two Navigation Areas (`sidebar`)

The left sidebar contains two configurable navigation zones in `blog.config.ts`:

- **`sidebar.items`**: Primary navigation links. The first item is a separate shortcut; the remaining items can link to Archives, Categories, Tags, or Friends.
- **`sidebar.menu`**: Links in the dropdown beneath the site name, such as an About page or external link.

You can also adjust the resizable sidebar's default and min/max pixel widths:

```ts
export default {
  sidebar: {
    width: {
      default: 340,
      min: 240,
      max: 480,
    },
    items: [
      {
        id: 'home',
        type: 'builtin',
        route: 'home',
        label: { zh: '首页', en: 'Home' },
        icon: 'square-pen',
      },
      {
        id: 'archives',
        type: 'builtin',
        route: 'archives',
        label: { zh: '归档', en: 'Archives' },
        icon: 'archive',
      },
      {
        id: 'categories',
        type: 'builtin',
        route: 'categories',
        label: { zh: '分类', en: 'Categories' },
        icon: 'folder',
      },
      {
        id: 'tags',
        type: 'builtin',
        route: 'tags',
        label: { zh: '标签', en: 'Tags' },
        icon: 'tag',
      },
      {
        id: 'about',
        type: 'page',
        page: 'about',
        label: { zh: '关于', en: 'About' },
        icon: 'user',
      },
    ],
  },
};
```

Every navigation item needs a unique `id` and a `type`: built-in pages use `type: 'builtin'` with `route`, standalone pages use `type: 'page'` with the page slug in `page`, and external links use `type: 'external'` with `href`. The `/zh/rss.xml` example assumes Chinese as the default language with language prefixes enabled; adjust it to match your routing settings. The snippet above shows part of `sidebar`; merge it into your existing configuration.

## Author Bio and Profile Card (`author`)

Your author profile appears in the sidebar footer and on article headers:

```ts
export default {
  author: {
    name: { zh: 'Raincarnator', en: 'Raincarnator' },
    bio: {
      zh: '全栈开发者，记录技术与生活。',
      en: 'Full-stack developer writing about web tech and life.',
    },
    avatar: '/avatar.webp', // Place avatar.webp inside public/
    socials: [
      {
        label: 'GitHub',
        icon: 'github',
        href: 'https://github.com/Raincarnator',
      },
      { label: 'RSS', icon: 'lucide:rss', href: '/zh/rss.xml' },
    ],
  },
};
```

## Friends Link Configuration (`friends.config.ts`)

BlogGPT includes a built-in blogroll page that organizes your friends' blogs into named groups. Edit `friends.config.ts` in your project root:

```ts
export default [
  {
    title: { zh: '技术伙伴', en: 'Tech Friends' },
    description: {
      zh: '常读的独立技术博客',
      en: 'Independent tech blogs I read regularly',
    },
    links: [
      {
        name: 'Astro Blog',
        url: 'https://astro.build/blog/',
        avatar: 'https://astro.build/favicon.svg',
        description: 'Official news and updates from the Astro team.',
      },
    ],
  },
];
```

## Footer and Copyright (`footer`)

Configure the copyright year, copyright holder name, and content license at the bottom of your site:

```ts
export default {
  footer: {
    since: 2024,
    author: 'Raincarnator', // Note: independent of author.name
    showAttribution: true, // Shows "Powered by Astro & BlogGPT"
    license: {
      label: 'CC BY-NC-SA 4.0',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
  },
};
```
