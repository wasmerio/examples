# 语言与多语言内容

BlogGPT 原生支持多语言内容管理与国际化界面（i18n）。你既可以将其作为纯粹的中文或英文单语博客使用，也可以轻松搭建中英双语（或多语种）站点。

## 启用语言

在 `blog.config.ts` 的 `site` 字段中配置站点支持的语言列表与默认语言：

```ts
export default {
  site: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    localePrefixPolicy: 'omit-default-prefix',
  },
};
```

### 网址语言前缀策略（`localePrefixPolicy`）

- **`'omit-default-prefix'`** _(推荐)_：默认语言不带前缀（如 `/posts/hello`），其他语言自动带上语言前缀（如 `/en/posts/hello`）。
- **`'redirect-to-default'`**：访问根路径 `/` 时自动跳转到 `/${defaultLocale}/`，所有语言均带前缀（`/zh/...`、`/en/...`）。
- **`'require-prefix'`**：强制所有语言路径均包含语言前缀。

## 多语言文件命名方式

你可以通过以下方式指定 Markdown 文件所属的语言：

1. **文件名后缀** _(推荐)_：在 `.md` 前添加 `.zh` 或 `.en` 后缀：
   - 单文件模式：`content/posts/hello.zh.md` 与 `content/posts/hello.en.md`
   - 内容包（Bundle）模式：`content/posts/hello/index.zh.md` 与 `content/posts/hello/index.en.md`
2. **无后缀内容**：不带语言后缀的文件（如 `content/posts/hello.md`）作为该组内容的共用版本，在缺少目标语言译文时优先使用。

## 关联不同语言的文章

为了让读者在阅读某篇文章时点击语言切换按钮即可直接跳转到对应译文，请将各语言文件放在同一目录，使用相同的基础文件名（如 `hello.zh.md` 与 `hello.en.md`，或同一内容包下的 `index.zh.md` 与 `index.en.md`）。同组内容的 `slug` 必须一致；若手动设置了 `slug`，请同步修改所有译文。

关联依据是文件路径与文件名，不支持通过 Frontmatter 自定义关联标识。

## 缺失翻译时的回退机制

你不需要强求每一篇文章都翻译成所有语言。当读者在英文界面（`/en/`）下点开一篇只有中文版本的文章时：

- BlogGPT 会依次查找目标语言、无后缀版本、默认语言，再按 `site.locales` 的顺序查找可用正文，避免缺少译文时直接出现 404。
- 页面顶部会展示友好的提示条，告知读者当前内容正在以原始语言显示。

## 自定义多语言界面文案

主题内置的导航、按钮与提示语均已自带简体中文（`zh`）与英文（`en`）翻译。如果你想在 `blog.config.ts` 中为不同语言设置不同的站点标题、首页问候语或搜索框占位提示，只需传入按语言区分的对象（`Localized` 类型）：

```ts
export default {
  site: {
    title: {
      zh: '我的技术博客',
      en: 'My Tech Blog',
    },
  },
  text: {
    homeHeading: {
      zh: '今天想读点什么？',
      en: 'What would you like to read today?',
    },
    searchPlaceholder: {
      zh: '搜索文章、标题或正文...',
      en: 'Search posts, titles, or full text...',
    },
  },
};
```
