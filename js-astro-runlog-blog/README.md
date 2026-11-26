<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Runlog Blog](https://github.com/dxer/astro-runlog-blog) Astro theme by dxer, copied from commit `f55842093c49e72605cdd60fa060c9e4d149f10a` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-runlog-blog.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** None.
- **Credit:** theme by [dxer](https://github.com/dxer), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# 📓 Astro Runlog Blog (astro-runlog-blog)

> **极客等宽审美 · 纯 YAML 配置驱动 · 面向投资复盘、系统架构与深度认知的结构化手记模板。**
> 
> 基于 Astro 7 + Tailwind CSS 4 + TypeScript 构建，零商业广告、无冗余推销，专为追求高信噪比思考沉淀的创作者与开发者设计。

---

## ✨ 核心特性

- ⚙️ **单一事实来源 (`config.yaml`)**：所有站点名称、Hero 文案、文章分类、模块开关与终端流全部收敛在根目录单个带详尽注释的 `config.yaml` 中，**改动无需碰任何代码**。
- 🎭 **开箱即用的三大领域预设 (`presets/`)**：
  - `investor`：价值投资、宏观复盘、心智模型与安全边际。
  - `developer`：全栈架构、AI 工具链、系统实战与 CI/CD 终端。
  - `garden`：数字花园、常青笔记、通识思考与读书随笔。
- 🌐 **界面 UI 语言一键切换 (`locale`)**：在 `config.yaml` 中支持 `zh-CN`（中文）与 `en`（英文）自由切换，海外开发者克隆即可无缝使用。
- 📝 **极简写作脚手架 (`pnpm new`)**：命令行一键创建规范 Frontmatter 文章，自动填充日期、作者与预设分类。
- 📡 **高质量读者分发**：内置标准 RSS 2.0 订阅源 (`/rss.xml`)，全站 `<head>` 自动嗅探，支持 Follow、NetNewsWire、Inoreader 等现代阅读器。
- 📋 **深度笔记交互**：
  - 文章页支持 **`[MD 引用]`** 一键复制为 `[标题](URL)`，方便读者粘贴至 Obsidian/Notion。
  - 代码块右上角悬浮一键复制 (`[copy]` -> `[copied!]`)。
  - 自动生成文章目录（TOC）与自适应阅读时间预估。
- 📊 **Google Analytics 4 条件化集成**：填入 ID 即开启统计，留空则完全不加载外部脚本，极致性能与隐私纯净。
- 🧮 **原生 LaTeX / KaTeX 数学公式支持**：内置 `remark-math` 与 `rehype-katex`，支持行内 `$E = mc^2$` 与居中块级 `$$...$$` 复杂数学公式渲染，字体本地打包，零外部 CDN 依赖，科研、算法与量化创作者开箱即用。
- 🔍 **现代化搜索引擎与 GEO 优化**：内建 Schema.org（`BlogPosting` 与 `BreadcrumbList`）结构化数据、OpenGraph/Twitter Card、多站长平台验证槽位，并附带 `./scripts/submit-indexnow.sh` 一键向 Bing / Copilot / Yandex 广播新内容。
- 🌓 **极客等宽设计**：全站 JetBrains Mono 等宽字体、硬核网格底纹、极简边框，支持明亮/暗黑（Light / Dark）无闪烁切换。

---

## 🚀 快速上手 (Quick Start)

### 1. 安装与本地预览

```bash
# 安装依赖 (推荐使用 pnpm)
pnpm install

# 启动本地开发服务
pnpm dev
```
本地浏览器打开：`http://localhost:4321`

### 2. 一键切换领域预设 (Presets)

无需从零手写配置，直接根据你的使用方向一键切换：

```bash
# 切换为投资复盘与商业思考版 (默认)
pnpm preset invest

# 切换为极客开发与开源系统版 (全英文 UI)
pnpm preset dev

# 切换为通识思考与个人数字花园版
pnpm preset garden
```
*提示：执行切换会自动将当前 `config.yaml` 备份为 `config.yaml.bak`。*

### 3. 一键创建新文章 (Authoring)

```bash
# 自动按日期与时间戳生成
pnpm new "2026年宏观周期与资产配置思考"

# 或者指定自定义英文 URL slug
pnpm new "为什么智能体都需要验证步骤" why-agents-need-verify-step
```
文件将自动生成至 `src/content/posts/` 目录下，直接在 VSCode 或 Obsidian 中敲字即可。

### 4. 构建与部署

```bash
# 静态构建产物生成至 dist/ 目录
pnpm build

# 本地预览静态产物
pnpm preview
```

---

## ⚙️ 配置文件一览 (`config.yaml`)

修改根目录下的 `config.yaml` 即可完成全站定制：

```yaml
# 站点基础信息
site:
  name: "Runlog"
  author: "Alex Chen"
  url: "https://dxer.github.io/astro-runlog-blog"
  description: "投资复盘、认知成长与技术系统的结构化日志。"
  locale: "zh-CN"                 # 支持 "zh-CN" 或 "en"
  googleAnalyticsId: ""           # GA4 衡量 ID，留空不开启

# 首页模块开关 (不需要的模块设为 false 自动优雅隐藏)
sections:
  terminal: true     # Hero 右侧极客终端控制台
  pillars: true      # 核心思考领域支柱
  framework: true    # 三步认知闭环 (INPUT -> ACT -> VERIFY)
  recentPosts: true  # 首页最新精选文章
  principles: true   # 底层心智模型与准则
  cta: true          # 底部行动条

# 文章分类体系 (修改此处全站导航、页脚与筛选器自动同步)
categories:
  - slug: "investment"
    label: "投资与商业"
    en: "Investment & Business"
    description: "价值投资、商业模式、周期律动与资产配置"
```

---

## 🗂️ 目录结构

```text
├── config.yaml          # 全站核心配置文件 (Single Source of Truth)
├── presets/             # 行业领域预设 (investor / developer / digital-garden)
├── scripts/             # 实用脚手架脚本 (new-post / use-preset)
├── src/
│   ├── content/
│   │   └── posts/       # 文章 Markdown / MDX 存放目录
│   ├── config.ts        # 配置解析与 Zod Schema 校验层
│   ├── i18n.ts          # UI 本地化字典 (zh-CN / en)
│   ├── layouts/         # 基础布局 (Base.astro)
│   ├── components/      # UI 组件 (Header, Footer, RunLog, Cover...)
│   └── pages/           # 页面路由 (/, /posts, /posts/[slug], /rss.xml)
└── public/              # 静态公共资源 (favicon, robots.txt, og.png)
```

---

## 📄 开源许可证 (License) & 致谢 (Credits)

- 基于 **MIT License** 开放源代码。你可以自由分发、修改、作为个人博客使用或二次开源。
- 视觉与样式底座致谢原版模板 [runlog-astro-lite](https://github.com/pasha2do-cyber/runlog-astro-lite) by [Pavlo Zhydkykh](https://pzhydkykh.com) (MIT License)。
