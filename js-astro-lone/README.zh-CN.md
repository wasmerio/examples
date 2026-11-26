# lone

Astro 博客主题。标题明朝、正文角哥、白纸。浅色 / 深色。

[English](README.md)

可以直接克隆当模板，或作为依赖安装，在站点根目录放自己的 `lone.config.ts`。

## 功能

- Markdown 文章，放在 `src/content/blog/`
- 首页一张全幅风景，下面是头条和带日期纵列的笔记流
- 笔记在 `/notes/<slug>/`，带照片、目录、上一篇 / 下一篇
- 按年归档、分类（`/categories/`）、标签、分页
- About、RSS、404、sitemap
- 一份配置：`lone.config.ts`
- 浅色 / 深色

## 快速开始

```bash
git clone https://github.com/iClew/lone.git
cd lone
npm install
npm run dev
```

Node 22+。

## 作为依赖

```json
{
  "dependencies": {
    "lone": "github:iClew/lone"
  }
}
```

在 `astro.config` 里从 `lone`（或 `lone/src`）引入。站点根目录放 `lone.config.ts`，主题以 `lone/config` 读取。文章写在站点自己的 `src/content/blog/`，照片放在站点自己的 `public/`。

## 目录

```text
/
├── lone.config.ts
├── src/
│   ├── content/blog/
│   ├── pages/
│   ├── layouts/
│   ├── components/
│   ├── lib/
│   └── styles/
│       ├── fonts.css
│       └── global.css
└── public/
    ├── fonts/
    └── images/
```

文章头需要 `title`、`date`、`description`、`category`（`note` 或 `travel`）。可选 `tags`、`lang`、`cover`、`images`、`toc`。

## 配置

改 [`lone.config.ts`](lone.config.ts)：

| 键 | |
|---|---|
| `site` | 站名、字标、网址、作者、邮箱、GitHub、favicon、年份 |
| `nav` | 顶栏 |
| `home` | 标题、导语、头图、流标题、每页条数、pin |
| `archive` / `tags` / `categories` | 归档、标签、分类 |
| `about` | 关于页 |
| `notFound` | 404 |
| `ui` | 固定界面文案 |

`home.hero` 和文章封面指向 `public/` 里的文件。换站点不要改主题源码。

颜色和字号在 `src/styles/global.css`。

## 命令

| 命令 | |
|---|---|
| `npm run dev` | 开发服务器 |
| `npm run build` | 生产构建 |
| `npm run check` | 类型检查 |
| `npm run preview` | 预览 `dist/` |

## 许可证

[MIT](LICENSE)
