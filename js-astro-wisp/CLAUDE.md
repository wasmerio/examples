# astro-wisp

Wisp —— 专注中文长文阅读的技术博客主题（Astro 7 集成 + Tailwind 4 + MDX + Pele + React islands）。

## 仓库结构

- `packages/astro-wisp/`：主题包（npm `astro-wisp`）。集成入口 `index.ts` → `src/integration.ts`；注入的页面在 `src/routes/`，可覆盖的组件 / 布局在 `src/components/`、`src/layouts/`。
- 根目录：使用主题的演示站（`astro.config.ts` + `src/content/`），也是 e2e 测试对象。
- `template/`：starter，只有配置和内容，依赖 `astro-wisp`（工作区内链接到 packages/astro-wisp）。

## 开工前必读

- `DESIGN.md`：**外观规范**（字体、配色、圆角、间距、组件样式、品牌原则）。任何样式 / 组件改动先读它，改完如果改变了规范就同步更新它
- `PRODUCT.md`：读者、定位、约束
- `docs/README.md`：决策记录和环境前提
- `docs/architecture.md`：包结构、扩展点（虚拟模块、组件覆盖、路由开关）、样式分层
- `docs/tasks.md` §0：协作规则（文件所有权、报告格式）

## 硬性规则

- 颜色只能来自调色板生成的 CSS 变量（`--wisp-*`、图表中的 `--wd-*`；交互组件用 `Tone`）。禁止硬编码十六进制颜色，禁止 Tailwind 原始色阶，禁止 `dark:` 颜色变体。
- 默认调色板是 `packages/astro-wisp/design/palette.json`。`src/styles/{tokens,pele,diagram}.css`、`src/explainers/core/tones.generated.ts`、`skills/wisp-diagram/palette.json` 是生成文件，修改调色板后运行 `pnpm tokens`（有单测检查是否过期）。
- 主题内部互相引用组件 / 布局时必须经过 `virtual:wisp/components/<Name>`（否则站点无法覆盖）；读配置用 `virtual:wisp/config`；客户端代码只能用 `virtual:wisp/locale`，不要把整份配置打进浏览器。
- 样式分层：页面骨架与组件 → `@layer components`；正文内容（prose、代码块、图、公式、讲解组件）→ `@layer utilities`（与 typography 插件同层）。Astro 组件的 `<style>` 也要包在对应的层里。
- 优先使用框架能力（Astro 的 injectRoute / paginate / 内容集合 / container API、Vite 虚拟模块、Tailwind 插件、Motion），不要自行重复实现。
- 主题提供的是通用积木；具体讲解组件（如矩阵乘）放在站点或文章目录里，不进主题包。
- 所有页面都通过 `getPosts()`（`astro-wisp/utils`）取文章，不能直接调用 `getCollection('posts')`。
- 中文排版规则见 `DESIGN.md` Typography：禁止负字距，中文 `em` 不用斜体。
- 图标只用 Lucide（`virtual:wisp/components/Icon`，React 里内联 Lucide 路径），禁止 emoji 或 Unicode 字符当图标；不写眉题（eyebrow），不用阴影、毛玻璃、渐变、彩色粗竖条，圆角只有 3px / 4px。
- 图表源文件 `.excalidraw`（JSON）和 `.drawio`（未压缩 XML）与文章放在一起，生成的 `.wisp.svg` 和 `diagrams.manifest.json` 也要提交。
- Astro 7 的 API 以官方文档为准，docs 中的代码只表达意图。

## 常用命令

- `pnpm dev` / `pnpm build` / `pnpm check`（astro check + tsc + ESLint + Prettier + vitest + 对比度 + 图表校验）
- `pnpm lint`、`pnpm format`、`pnpm format:check`：代码质量检查与格式化；提交前 hook 只处理 staged 文件
- `pnpm build:template`：构建 starter
- `pnpm tokens`：根据默认调色板重新生成令牌
- `pnpm diagram build|check|lint [--fix]`（即 `wisp diagram`）
- `pnpm exec vitest run <path>`

## Agent skills（随主题包分发）

- 写文章：`packages/astro-wisp/skills/wisp-writer/SKILL.md`（`uv run packages/astro-wisp/skills/wisp-writer/scripts/new_post.py` / `check_post.py`）
- 画图：`packages/astro-wisp/skills/wisp-diagram/SKILL.md`（`pnpm diagram ...`）
