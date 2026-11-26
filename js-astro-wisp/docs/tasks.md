# 任务拆分与并行实施计划

> **历史文档**：本文是首个版本（模板分发形态）的实施计划，任务卡中的文件路径指当时的布局（`src/wisp/…`、`src/explainers/…`、`scripts/…`）。主题抽成 npm 包后（ADR D13），这些文件位于 `packages/astro-wisp/` 下，对应关系见 `architecture.md` §2。§0 的协作规则仍然适用。

## 0. 协作规则（所有子 Agent 必须遵守）

1. **开工前阅读**：`CLAUDE.md`、`docs/README.md`，以及任务卡中“必读”列出的文档章节。
2. **文件所有权**：每个任务只能创建或修改自己“拥有文件”列出的路径。需要改动别的文件时，**不要改**，在最终报告的“跨任务请求”一节中写明。
3. **依赖**：不要修改 `package.json`，不要安装依赖。依赖由编排者在 T0 统一安装；缺少依赖时在报告里提出。
4. **颜色**：禁止硬编码颜色，一律通过令牌引用（见 design-system.md，外观规范见 ../DESIGN.md）。
5. **自测**：每个任务结束前必须通过 `pnpm exec tsc --noEmit -p .`，以及本任务相关的 `pnpm exec vitest run <path>`。
6. **报告格式**（最终回复）：已完成 / 拥有文件清单 / 测试结果（贴出命令和输出摘要）/ 偏离设计之处及理由 / 跨任务请求 / 遗留问题。
7. **不提交 git**，由编排者统一提交。

模型分配原则：**opus** 负责设计判断多、跨模块、视觉质量敏感的任务；**sonnet** 负责边界清楚、需要中等推理的实现；**haiku** 负责模板化、低风险的任务（样例内容、文档、简单页面）。

## 1. 依赖图与波次

```
W0  T0 脚手架（编排者）
     │
W1  ├─ T1 令牌生成 ───────────────┐   (sonnet)
    ├─ T2 配置+内容模型+工具函数 ──┤   (sonnet)
    ├─ T3 remark 阅读时长/数学检测 ─┤   (haiku)
    ├─ T4 remark-pele ─────────────┤   (sonnet)
    ├─ T5a 图表 lint/映射/normalize ┤   (sonnet)
    ├─ T5b 图表导出器 + 骨架转换 ───┤   (opus)
    ├─ T6 示例内容 ────────────────┤   (haiku)
    └─ T7 讲解组件 core + MatMul 算法 (sonnet)
     │
W2  ├─ T8 布局、全局样式、字体、基础组件 (opus)       ← T1 T2
    ├─ T10 Shiki、代码块、复制按钮 (sonnet)           ← T1
    ├─ T11 remark-diagram + Diagram 组件 + 源文件下载 (opus) ← T1 T5a T5b
    ├─ T12 Player + MatMul React 组件 (sonnet)        ← T1 T7
    └─ T13 wisp-diagram SKILL.md + 参考文档 + 素材库 (sonnet) ← T1 T5a T5b
     │
W3  ├─ T9 页面路由、RSS、Sitemap、404 (sonnet)        ← T2 T8
    └─ T14 集成接线 astro.config / integration.ts（编排者）
     │
W4  ├─ T15 质量：a11y、对比度、视觉回归、Lighthouse (sonnet)
    └─ T16 README / 模板使用文档 (haiku)
```

## 2. 任务卡

### T0 脚手架（编排者自己完成）

- 初始化 Astro 7 项目（pnpm），安装 architecture.md §1 中的全部依赖，配置 tsconfig 路径别名 `@/* → src/*`，并配置 vitest。
- 创建目录骨架和空的占位导出，让并行任务可以独立编译。
- 拥有：`package.json`、`astro.config.ts`、`tsconfig.json`、`vitest.config.ts`、`src/wisp/integration.ts`、`.gitignore`、`CLAUDE.md`。
- 验收：`pnpm dev` 能启动，`pnpm build` 能通过（空站点）。

### T1 令牌生成（sonnet）

- 必读：design-system.md §1，../DESIGN.md（Colors、Do's and Don'ts）；diagrams.md §3.2–3.3、§7。
- 拥有：`scripts/gen-tokens.ts`、`scripts/check-contrast.ts`、`src/wisp/styles/{tokens.css,pele.css,diagram.css}`（生成文件）、`skills/wisp-diagram/palette.json`（同步副本）、`scripts/__tests__/tokens.test.ts`。
- 产出：
  - `tokens.css`：基础色、hue、语义色、字体变量，包含 light 和 dark 两套；
  - `pele.css`：`--pele-*` 映射，`--pele-series-1..8` 按 hue 顺序；
  - `diagram.css`：`[data-theme] .wisp-d { --wd-*: var(--wisp-*) }`；
  - 导出一个 TS 模块 `scripts/lib/palette.ts`：类型化的 palette、`resolveColor(name)`、`nearestToken(hex)`（基于 ΔE2000），供 T5a 使用。**该文件也归 T1 所有**。
- 验收：`pnpm tokens` 的输出是确定的（运行两次得到相同结果）；`check-contrast` 对 fg、muted、accent、8 个 hue stroke 在两种主题下都满足 ≥ 4.5:1，不达标时退出码非 0 并打印清单；有单测。

### T2 配置、内容模型、工具函数（sonnet）

- 必读：architecture.md §3、§7。
- 拥有：`src/wisp/config.ts`、`src/wisp.config.ts`、`src/content.config.ts`、`src/wisp/utils/{posts,taxonomy,date}.ts` 及其测试。
- 产出：`defineWispConfig`（zod 校验 + 深度合并默认值）；`getPosts({ includeDrafts? })`；`getTags()` / `getCategories()`（返回 name、slug、count、posts）；`slugify`（带 slugMap 和冲突检测）；`groupByYear`；`formatDate(date, lang)`。
- 验收：单测覆盖 draft 过滤、中文 slug、slug 冲突报错、年份分组。

### T3 remark 阅读时长 / 数学检测（haiku）

- 必读：architecture.md §4。
- 拥有：`src/wisp/plugins/{remark-reading-time,remark-has-math}.ts` 及其测试。
- 验收：纯中文 700 字约 2 分钟；纯英文 400 词约 2 分钟；代码块按 0.3 权重计入；最少 1 分钟。has-math 能识别行内和块级公式。

### T4 remark-pele（sonnet）

- 必读：architecture.md §4，diagrams.md §7，`node_modules/pele/README.md`。
- 拥有：`src/wisp/plugins/remark-pele.ts` 及其测试、`tests/fixtures/mermaid/*`。
- 验收：flowchart、sequence、class、state、gantt、pie 各一个 fixture 能渲染，并做快照测试；包含一张中文标签较多的流程图，在报告中描述其宽度表现；语法错误时，dev 模式退化为代码块，strict 模式抛错；aria-label 规则符合设计。

### T5a 图表 lint / 颜色映射 / normalize（sonnet）

- 必读：diagrams.md §2、§3、§6。
- 依赖：使用 T1 的 `scripts/lib/palette.ts`。如果 T1 尚未完成，先写一个本地桩，并在报告中注明。
- 拥有：`skills/wisp-diagram/scripts/{lint,normalize,map-colors}.ts`、`skills/wisp-diagram/scripts/lib/*`（不包括 export 相关文件）及其测试。
- 产出：drawio 解压/压缩互转；`.excalidraw` 规范化（排序、去掉无关 appState）；`mapSvgColors(svg)` → 可移植 SVG（var + fallback + 内嵌 style + 选择器作用域）；lint 规则：非调色板颜色、字号、网格对齐、阴影/渐变、文件大小，`--fix` 可自动吸附颜色。
- 验收：fixture 快照；带有非法颜色的 fixture 能被 lint 报出并 fix 到最近的令牌。

### T5b 图表导出器 + 骨架转换（opus）

- 必读：diagrams.md 全文。
- 拥有：`skills/wisp-diagram/scripts/{build,export-png,skeleton-to-excalidraw}.ts`、`skills/wisp-diagram/scripts/exporters/*`、`skills/wisp-diagram/scripts/package.json`、`scripts/diagram/*`（站点侧的 CLI 包装，加上 manifest 哈希的 build/check）。
- 产出：Excalidraw 导出（Playwright + exportToSvg）；draw.io 导出（CLI → Docker 回退，探测逻辑）；骨架 → excalidraw；SVG 后处理串联 T5a 的 `mapSvgColors`、svgo、a11y 注入、可选的字体子集嵌入；PNG 导出（light/dark）。
- 验收：`tests/fixtures/diagrams/` 中的 hand 和 clean 样例都能生成 `.wisp.svg`；生成的 SVG 作为 `<img>` 打开时随系统主题切换；内联到 `data-theme=dark` 的页面时跟随站点主题（用 Playwright 截图验证，截图附在报告中）。draw.io 导出方式全部不可用时，给出清晰的报错。

### T6 示例内容（haiku）

- 必读：architecture.md §3，../DESIGN.md（Typography）。
- 拥有：`src/content/posts/**`（示例文章）、`src/content/pages/about.md`。
- 产出：至少 6 篇文章，覆盖：中英混排长文、代码块（多种语言、长行）、行内和块级公式、每种类型的 Mermaid 各一个、表格、引用、脚注、草稿一篇、featured 两篇、多个标签和分类（含中文标签）；一篇 `kitchen-sink.mdx` 汇总全部元素（图表引用暂时写成注释形式，T11 完成后启用）。

### T7 讲解组件 core + MatMul 算法（sonnet）

- 必读：explainers.md §1、§4。
- 拥有：`src/explainers/core/**` 及其测试。
- 验收：`matmul(A, B)` 的步骤数为 m·n·k（再加上起止帧）；caption 正确；非法尺寸会抛错；在 node 环境下运行，不依赖 DOM。

### T8 布局、全局样式、字体、基础组件（opus）

- 必读：design-system.md 全文，../DESIGN.md 全文，architecture.md §6、§8。
- 拥有：`src/layouts/**`、`src/wisp/styles/{global,prose,katex}.css`、`src/wisp/components/{Header,Footer,ThemeToggle,PostCard,PostMeta,TagList,Toc,SkipLink,Pagination,Figure}.astro`。
- 产出：Base 布局（head 中的主题脚本、字体导入、meta/OG 标签、`lang` 属性）；Post 布局（TOC 的两种形态、上一篇/下一篇、按需引入 katex.css）；DESIGN.md Typography 的全部中文排版规则；组件的 props 接口写在文件顶部，并带 JSDoc。
- 验收：在 light、dark、system 三种主题下首屏无闪烁（Playwright 测试：禁用 JS 缓存后读取首帧的背景色）；375px、768px、1280px 三个宽度的截图附在报告中；键盘能完成整页导航。

### T9 页面路由、RSS、Sitemap、404（sonnet）

- 必读：architecture.md §5。
- 拥有：`src/pages/**`。
- 验收：architecture.md §5 中的所有路由都能构建出来；rss.xml 能通过校验（使用 W3C feed validator 的离线规则或 `fast-xml-parser` 检查结构）；中文标签页面能访问。

### T10 Shiki、代码块、复制按钮（sonnet）

- 必读：design-system.md §1.3，../DESIGN.md（Components）。
- 拥有：`src/wisp/shiki.ts`、`src/wisp/styles/code.css`、`src/wisp/components/CopyButton.astro`（或内联脚本）。
- 验收：双主题切换不需要重新渲染；行号不会被选中或复制；复制按钮有键盘焦点和 aria-live 反馈；`features.lineNumbers` 和 `features.codeCopy` 开关生效；注释颜色对比度 ≥ 4.5:1。

### T11 remark-diagram + Diagram 组件 + 源文件下载（opus）

- 必读：diagrams.md §4、§5。
- 拥有：`src/wisp/plugins/remark-diagram.ts`、`src/wisp/lib/render-diagram.ts`、`src/wisp/components/Diagram.astro`、`src/wisp/lib/diagram-assets.ts`（供 integration 调用的 dev middleware 和 build 复制函数），以及相关测试。
- 注意：`integration.ts` 归 T0/T14 所有。本任务只导出函数，并在报告中给出接线方式。
- 验收：标准图片语法和 MDX 组件两种写法渲染结果一致；SVG 中的 id 在页面内唯一；下载链接在 dev 和 build 中都可用；缺少 `.wisp.svg` 时，dev 显示占位块，build 报错；`#page=` 能选择 draw.io 页面。

### T12 Player + MatMul React 组件（sonnet）

- 必读：explainers.md 全文，../DESIGN.md（Components、Do's and Don'ts）。
- 拥有：`src/explainers/react/**`、`src/explainers/explainers.css`。
- 验收：SSR 输出第一帧；键盘操作完整；reduced-motion 下不自动播放；只使用令牌颜色；375px 宽度下可用。

### T13 wisp-diagram skill 文档与素材库（sonnet）

- 必读：diagrams.md 全文。
- 拥有：`skills/wisp-diagram/SKILL.md`、`skills/wisp-diagram/reference/**`、`skills/wisp-diagram/assets/**`。
- 验收：SKILL.md 的 frontmatter 中 description 写明触发场景；工作流的命令与 T5a/T5b 的 CLI 一致；ml-patterns.md 至少包含 5 种图式的骨架示例；素材库可以被 Excalidraw 和 draw.io 导入（文件结构合法，用脚本校验）；skill 目录可以单独复制到别处使用（不引用仓库中的其他路径）。

### T14 集成接线（编排者）

- 在 `integration.ts` 中注册全部 remark 插件、Shiki 配置、图表源文件的 dev middleware 和 build 复制；在 `astro.config.ts` 中接入 MDX、React、Sitemap、Tailwind；启用 kitchen-sink 中的图表引用。
- 验收：`pnpm build` 零警告；kitchen-sink 页面完整渲染。

### T15 质量（sonnet）

- 拥有：`tests/e2e/**`、`playwright.config.ts`、`.github/workflows/ci.yml`。
- 产出：axe 扫描（首页、文章页、标签页）；视觉回归（kitchen-sink 页面 × light/dark × 375/1280）；Lighthouse 预算；CI 中运行 `pnpm check`、`pnpm build`、`diagram check`。

### T16 文档（haiku）

- 拥有：`README.md`、`docs/guide/*.md`（面向主题使用者：快速开始、配置、写作、图表、交互组件）。

## 3. 编排者的检查点

- 每一波结束后：合并跨任务请求 → 统一安装缺少的依赖 → 运行 `pnpm check` → 进行 git 提交（需要用户同意后才提交）。
- W2 结束后：人工审视 kitchen-sink 页面的视觉效果，由用户确认风格，再进入 W3。
