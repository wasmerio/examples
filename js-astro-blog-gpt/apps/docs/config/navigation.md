# 导航、作者和友链

本节介绍如何配置左侧边栏导航菜单（`sidebar`）、作者个人名片（`author`）、页脚版权信息（`footer`）以及友情链接页面（`friends.config.ts`）。

## 两处侧边栏导航（`sidebar`）

BlogGPT 的左侧边栏提供两个导航配置区，均位于 `blog.config.ts` 的 `sidebar` 字段下：

- **`sidebar.items`**：侧栏主导航入口（首项显示为独立入口，其余链接可放置归档、分类、标签和友链等页面）。
- **`sidebar.menu`**：站点名称下拉菜单中的链接（可放置关于页、外部链接或订阅入口）。

同时，你可以通过 `sidebar.width` 设置侧边栏的默认像素宽度以及拖拽调整的最小/最大范围：

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

导航项需要唯一的 `id` 与 `type`：内置页面使用 `type: 'builtin'` 和 `route`，独立页面使用 `type: 'page'` 和页面的 `slug`（填入 `page`），外部链接使用 `type: 'external'` 和 `href`。示例中的 `/zh/rss.xml` 对应默认语言为中文、保留语言前缀的站点，请按你的路由配置调整。上面的代码只展示 `sidebar` 的部分字段，请合并到现有配置。

## 作者简介与名片（`author`）

作者信息会展示在侧边栏底部名片和文章头部署名中：

```ts
export default {
  author: {
    name: { zh: 'Raincarnator', en: 'Raincarnator' },
    bio: {
      zh: '全栈开发者，记录技术与生活。',
      en: 'Full-stack developer writing about web tech and life.',
    },
    avatar: '/avatar.webp', // 将头像图片放在 public/ 目录下
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

## 友情链接配置（`friends.config.ts`）

BlogGPT 内置了支持分组展示的友情链接页面。直接编辑项目根目录下的 `friends.config.ts` 即可管理友链分组：

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
        name: 'Astro 官方博客',
        url: 'https://astro.build/blog/',
        avatar: 'https://astro.build/favicon.svg',
        description: '来自 Astro 团队的官方动态与技术文章。',
      },
    ],
  },
];
```

## 页脚与版权声明（`footer`）

在 `footer` 中配置站点底部的建站年份、版权署名以及文章默认许可协议：

```ts
export default {
  footer: {
    since: 2024,
    author: 'Raincarnator', // 注意：与 author.name 独立配置
    showAttribution: true, // 是否展示主题与框架致谢链接
    license: {
      label: 'CC BY-NC-SA 4.0',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
  },
};
```
