# 站点与外观

本节介绍如何在 `blog.config.ts` 中配置博客的基础身份信息（`site`）、视觉主题样式（`appearance`）以及界面提示文案（`text`）。

## 站点基础信息（`site`）

| 配置项                    | 类型                                                                 | 默认值                  | 说明                                                                                                    |
| ------------------------- | -------------------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------- |
| `site.title`              | `Localized`                                                          | _(必填)_                | 博客名称，显示在浏览器标签页、侧边栏顶部以及 RSS 订阅源中。                                             |
| `site.baseUrl`            | `string`                                                             | _(必填)_                | 线上正式域名（如 `'https://blog.example.com'`），用于生成 Canonical 链接、Sitemap、RSS 与分享卡片地址。 |
| `site.defaultLocale`      | `string`                                                             | `'zh'`                  | 站点默认语言代码。                                                                                      |
| `site.locales`            | `string[]`                                                           | `['zh', 'en']`          | 站点启用的语言列表。                                                                                    |
| `site.localePrefixPolicy` | `'redirect-to-default' \| 'omit-default-prefix' \| 'require-prefix'` | `'redirect-to-default'` | 多语言 URL 前缀策略。详见[语言与多语言内容](../content/languages.md)。                                  |
| `site.timezone`           | `string`                                                             | `'Asia/Shanghai'`       | 用于格式化文章日期与统计发文热力图的 IANA 时区。                                                        |

## 视觉与主题外观（`appearance`）

在 `appearance` 字段下管理深浅色模式、切页动画和分类卡片封面样式：

```ts
export default {
  appearance: {
    defaultTheme: 'system', // 'light' | 'dark' | 'system'
    pageTransition: 'fade', // 'fade' | 'none'
    codeThemes: {
      light: 'github-light',
      dark: 'github-dark',
    },
    showCodeLineNumbers: false,
    categoryCoverStyle: 'thumbnail', // 'thumbnail' | 'fade' | 'background'
  },
};
```

- **`defaultTheme`**：访客首次打开站点时的默认配色方案（浅色 `'light'`、深色 `'dark'` 或跟随系统 `'system'`）。
- **`pageTransition`**：切换页面时的过渡动画效果（`'fade'` 为平滑淡入淡出，`'none'` 为立即切换）。
- **`categoryCoverStyle`**：分类卡片封面的默认渲染方式（`'thumbnail'` 为缩略图、`'fade'` 为边缘渐变融合、`'background'` 为整卡背景图）。单篇文章或分类可通过 Frontmatter 中的 `coverStyle` 单独覆盖。

## 自定义界面提示文案（`text`）

通过 `text` 配置项，你可以轻松修改首页搜索框上方的 ChatGPT 风格问候语、搜索占位符和 404 提示文字：

| 配置项                                 | 说明                                                                      |
| -------------------------------------- | ------------------------------------------------------------------------- |
| `text.siteDescription`                 | 站点的默认 SEO 描述与 RSS 简介（当具体页面未填写 `description` 时使用）。 |
| `text.homeHeading`                     | 首页搜索框上方的主标题问候语（例如 `"今天想读点什么？"`）。               |
| `text.searchHeading`                   | 独立搜索页面顶部显示的标题。                                              |
| `text.searchPlaceholder`               | 搜索输入框内的占位提示文字。                                              |
| `text.notFoundMessage`                 | 404 页面显示的提示文案。                                                  |
| `text.footerDescription`               | 页脚额外展示的简短签名或说明。                                            |
| `text.tabs.search` / `text.tabs.posts` | 侧栏/移动端切换“搜索”与“文章”视图的标签文字。                             |
