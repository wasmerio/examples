<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Mello](https://github.com/Almango/Mello) Astro theme by Almango, copied from commit `183a4e0919682e6895d97ea1603fbab03841976c` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-mello.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: netlify.toml, vercel.json.
- **Environment variables:** None.
- **Credit:** theme by [Almango](https://github.com/Almango), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

### 🍃 Astro Theme Mello

Astro Theme Mello 是基于上一代博客主题设计思路，重新设计的新一代博客主题。它更加极简、优雅、高性能，以阅读体验为核心，专注于内容本身，回归文字最本真的状态。没有冗余装饰，没有复杂交互，只保留最纯粹的阅读与写作环境。

[![](https://img.shields.io/badge/Astro-v6-BC52EE?logo=astro)](https://astro.build)
[![](https://img.shields.io/badge/Node.js->=22-5FA04E?logo=nodedotjs)](https://nodejs.org)
[![](https://img.shields.io/badge/pnpm-v12-F69220?logo=pnpm)](https://pnpm.io)
[![](https://img.shields.io/badge/许可-MIT-D1AB66)](./LICENSE.txt)

### ✨ 特性

**三套配色**：paper 取宣纸、墨色与灰绿；mono 偏学术科普，使用墨蓝、学术蓝与图表橙；normal 为纯灰阶单色极简。三套都支持亮色与暗色。

**阅读优先**：768px 单栏版心，衬线排版、克制的分隔线和充足留白，没有侧栏与多余组件。

**首页**：站点介绍、头像、写作热力图和最近四篇文章；热力图桌面显示 53 周，移动端显示 26 周。

**文章页**：右侧浮动目录、Expressive Code 代码高亮、MathJax 数学公式、GitHub Alerts、隐藏文字和图片点击缩放。

**聚合页面**：归档、分类、友链和关于，全部静态生成；自动生成 RSS 与 Sitemap。导航对应 `归档 / 分类 / 朋友 / 关于` 四项。

**评论系统**：可选接入 Waline，默认关闭；内置评论列表、输入框和暗色模式的深度样式适配。

**轻量实现**：基于 Astro 6 与原生 CSS/TypeScript，不依赖 React、Vue 等 UI 框架，没有 Tailwind 或客户端路由；默认只加载主题切换和图片缩放两个小脚本。

**配置集中**：站点信息、导航、页脚、评论与配色方案选择都在 `src/config.ts`，配色和版式变量分别在 `theme.css` 与 `global.css`。

### ⚙️ 配置

```ts
// src/config.ts
export const BASE_CONFIG = {
  title: 'Mello',
  subtitle: 'Mello',
  description: '简约、高效、优雅。',
  author: 'Mello',
  favicon: '/favicon.svg',
  avatar: '/avatar.svg',
  site_url: 'https://example.com',
}

export const THEME_CONFIG = {
  palette: 'paper', // 'paper' | 'mono' | 'normal'
}

export const HEADER_CONFIG = {
  nav: [
    { label: '归档', href: '/archive' },
    { label: '分类', href: '/category' },
    { label: '朋友', href: '/link' },
    { label: '关于', href: '/about' },
  ],
}

```


### 🛠️ 安装

```bash
# 克隆仓库
git clone https://github.com/yourname/mello.git

# 进入项目目录
cd mello

# 安装依赖
pnpm i

# 启动开发服务器
pnpm dev
```

### 🚀 构建

```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

### 📁 项目结构

```
.
├── public/                  # 静态资源
│   ├── avatar.svg           # 占位头像
│   ├── favicon.svg          # 站点图标
│   └── demo-image.svg       # 示例图片
├── src/
│   ├── components/          # 组件
│   │   ├── Header.astro     # 顶部导航栏
│   │   ├── Footer.astro     # 页脚
│   │   ├── ThemeToggle.astro# 主题切换按钮
│   │   ├── ThemeInit.astro  # 初始化主题状态
│   │   ├── Intro.astro      # 首页介绍
│   │   ├── HeatChart.astro  # 写作热力图
│   │   ├── PageHeader.astro # 页面标题头
│   │   ├── PostTOC.astro    # 文章浮动目录
│   │   ├── Recent.astro     # 首页文章列表
│   │   └── Comment.astro    # 评论组件（Waline）
│   ├── content/             # 内容数据
│   │   ├── posts/           # Markdown 文章
│   │   ├── about.md         # 关于页面内容
│   │   └── link.md          # 友链申请说明
│   ├── data/
│   │   └── links.json       # 友链集合
│   ├── layouts/
│   │   └── Layout.astro     # 基础布局
│   ├── pages/               # 页面路由
│   │   ├── index.astro      # 首页
│   │   ├── archive.astro    # 归档
│   │   ├── category.astro   # 分类
│   │   ├── link.astro       # 友链
│   │   ├── about.astro      # 关于
│   │   ├── rss.xml.ts       # RSS 订阅
│   │   ├── post/[id].astro  # 文章详情
│   │   └── category/[name].astro# 分类聚合
│   ├── scripts/
│   │   └── image-zoom.ts    # 图片放大
│   ├── styles/
│   │   ├── theme.css        # 配色变量
│   │   ├── global.css       # 全局样式
│   │   ├── markdown.css     # Markdown 正文样式
│   │   └── waline.css       # 评论区定制样式
│   ├── config.ts            # 站点配置（唯一需要改的配置文件）
│   └── content.config.ts    # 内容集合配置
├── astro.config.ts          # Astro 配置
└── package.json
```

### 📣 许可证

MIT
