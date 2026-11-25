# 阅读界面、分享与统计

本节介绍如何控制文章详情页的元信息显示开关、调整列表分页数量、自定义一键复制分享文案，以及配置全站写作统计面板。

## 文章元信息显示开关（`article.display`）

通过 `blog.config.ts` 中的 `article.display`，你可以精细控制文章页面上各个元素的显示与隐藏（默认全部为 `true`）：

```ts
export default {
  article: {
    display: {
      title: true, // 文章顶部主标题
      author: true, // 作者头像与署名
      published: true, // 发布日期
      updated: true, // 最后更新日期
      readingTime: true, // 字数统计与预计阅读时长
      tags: true, // 文末标签列表
      share: true, // 文末分享按钮栏
      navigation: true, // 文末上一篇 / 下一篇导航卡片
    },
  },
};
```

你也可以在单篇文章或独立页面的 Frontmatter 中传入 `display` 进行局部覆盖（例如在“关于我”页面隐藏 `readingTime` 和 `navigation`）。

## 文章列表与分页数量（`posts`）

在 `posts` 下调整首页、侧栏和归档列表展示的文章条数：

| 配置项                  | 默认值                                                | 说明                                                              |
| ----------------------- | ----------------------------------------------------- | ----------------------------------------------------------------- |
| `posts.perPage`         | `5`                                                   | 文章列表（`/posts/`）每页显示的文章数量，不影响年度归档或分类页。 |
| `posts.homeLimit`       | `4`                                                   | 首页欢迎区下方展示的最新/置顶文章数量。                           |
| `posts.menuLimit`       | `12`                                                  | 输入框文章标题补全菜单中的候选数量；侧栏仍展示全部非置顶文章。    |
| `posts.randomLimit`     | `12`                                                  | 参与随机文章选择的候选数量。                                      |
| `posts.showDraftsInDev` | `true`                                                | 是否在 `pnpm dev` 本地开发模式下显示草稿（`draft: true`）。       |
| `posts.dateFormat`      | `{ year: 'numeric', month: 'short', day: 'numeric' }` | 日期格式化选项（遵循标准 `Intl.DateTimeFormatOptions`）。         |

## 分享文案与社交平台（`sharing`）

读者点击文章底部的分享按钮时，可以一键复制带格式的推荐语，或直接跳转到社交平台。你可以在 `sharing.copyFormat` 中使用 `{title}`、`{description}`、`{author}`、`{blog}` 和 `{url}` 占位符自定义复制模板：

```ts
export default {
  sharing: {
    copyFormat: {
      zh: '《{title}》 - {author} · {blog}\n{url}',
      en: '"{title}" by {author} · {blog}\n{url}',
    },
    platforms: [
      {
        name: 'X',
        icon: 'x',
        href: 'https://x.com/intent/tweet?text={title}&url={url}',
      },
    ],
  },
};
```

## 写作统计与热力图（`statistics`）

BlogGPT 内置了全站数据统计视图，可自动汇总总文章数、总字数、运营天数、多语言占比、平均篇幅、更新频率以及类似 GitHub 的年度发文热力图。所有指标均可在 `statistics` 中按需开关：

```ts
export default {
  statistics: {
    enabled: true,
    articleCount: true,
    wordCount: true,
    days: true,
    languages: true,
    averageWords: true,
    updateFrequency: true,
    firstPublication: true,
    lastUpdate: true,
    heatmap: true,
    recentWords: true,
    recentLimit: 12,
  },
};
```
