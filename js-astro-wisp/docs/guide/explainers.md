# 交互讲解组件

交互讲解用于逐步演示算法和数学过程，例如矩阵乘法乘加、哈希分桶寻址或注意力权重演化。主题提供**通用积木**（`astro-wisp/explainers`）：步骤协议、`Explainer` 外壳、SVG / 公式原语。具体讲解由站点组合这些积木实现，**随文章目录就近存放**（如 `src/content/posts/<slug>/explainers/<name>/`）。

它们是 React 19 组件，以 Astro island 的形式嵌入 MDX，只在用到的文章中加载（包含样式与按需 KaTeX）。

## 一、准备

```bash
pnpm astro add react   # Astro 官方 React 集成
pnpm add motion        # Motion 对象连续性与路径动画（≥ 14）
```

只有 `.mdx` 文件可以使用组件，`.md` 文件请改名为 `.mdx`。

## 二、积木

| 导出                                                   | 层           | 用途                                                                                      |
| ------------------------------------------------------ | ------------ | ----------------------------------------------------------------------------------------- |
| `Step<S>`、`Timeline<S>`                               | core         | 一帧 `{ state, caption, label?, duration?, focus? }`；`label` 显示在顶部阶段标签栏        |
| `record(initial, (state, emit) => …)`                  | core         | 把命令式算法录成时间线：`emit(caption, { label, duration, focus })`，每次保存深拷贝       |
| `cellId(m, r, c)`、`itemId(m, i)`、`focusOf(focus, m)` | core         | 高亮 id 约定（`'a:1,0'`、`'arr:3'`）与按前缀取出                                          |
| `formatNumber`、`formatMatrix`                         | core         | 数字格式化（真正的减号、去掉多余的 0）                                                    |
| `Tone`、`toneStroke`、`toneFill`                       | core         | 色调：调色板中的语义色（`q`、`k`、`v`、`active`、`done`、`highlight`…）或 hue             |
| `Explainer`、`useExplainer`                            | react        | 外壳：`<figure>` + 标题工具条（步进/重播/演示/全屏 `<dialog>`）+ 顶部阶段栏/刻度条 + 图注 |
| `RichText`、`Tex`、`TexLabel`、`parseInlineMath`       | react / core | 行内公式：说明与HTML舞台里的 `$…$` 自动排版（KaTeX 按需与 SSR 采集缓存）                  |
| `Stage`、`Matrix`、`Cell`、`Label`                     | react        | SVG 舞台与矩阵格子原语（viewBox 自适应、窄屏横向滚动）                                    |
| `labelsFor`、`ZH`、`EN`、`ExplainerIcon`               | react        | 多语言界面标签与 Lucide 内联图标                                                          |

`core` 层是纯 TypeScript（`astro-wisp/explainers/core`），不依赖 React / DOM，可以在 vitest 中直接单测。

## 三、写一个讲解

- 简单矩阵类（如 `src/content/posts/matrix-multiplication/`）可单文件组合 `matmul.ts` + `MatMul.tsx`；超过 8 步时顶部自动显示发丝线进度刻度条。
- 多阶段推演（≤ 8 步，推荐）建议拆成 `explainers/<name>/`：
  - `steps.ts` + `steps.test.ts`：定义每步语义 `label`（3–8 字）、`duration`、`caption`（含 `$…$`）与计算逻辑。
  - 按阶段拆出 2–3 个展示组件（如 `PhaseAStage.tsx`、`PhaseBStage.tsx`），用 HTML Flex/Grid + `<RichText>` 渲染数据块，仅用内联 SVG 绘制连接线或括号，并用 `motion/react`（`AnimatePresence`、`layoutId`、`pathLength`）做步内聚焦与步间对象过渡。
  - `index.tsx`：组合 `<Explainer steps={steps} title="图 1：…">{(step, index, { replayKey, expanded }) => …}</Explainer>`；交互筛选 state 写在 `Explainer` 外层，切换 `<dialog>` 全屏时不丢失。

### 在文章中使用

```mdx
import EngramHashExplainer from './explainers/engram-hash';

<EngramHashExplainer client:visible title="图 2：多头质数建桶与滚动异或寻址" />
```

## 四、交互方式

| 操作            | 鼠标 / 触控                    | 键盘（组件聚焦时） |
| --------------- | ------------------------------ | ------------------ |
| 切换阶段（≤8）  | 顶部阶段标签（底部 accent 条） | ← / → / Home / End |
| 进度条（>8）    | 标题栏下缘刻度条               | ← / → / Home / End |
| 上 / 下一步     | 标题栏 ‹ / ›                   | ← / →              |
| 重播本步动画    | 标题栏重播按钮                 | R                  |
| 自动演示 / 停止 | 标题栏演示按钮（3.6s/步）      | Space              |
| 全屏放大 / 关闭 | 标题栏展开按钮 / 遮罩 / ×      | F / Esc            |

## 五、规范边界

| 层            | 允许                                                 | 禁止                                                        |
| ------------- | ---------------------------------------------------- | ----------------------------------------------------------- |
| 算法（core）  | 纯 TS、类型、算术                                    | React、DOM、颜色、Motion                                    |
| 画面（React） | 原生 Motion、HTML + SVG、令牌（`Tone` / `--wisp-*`） | 硬编码十六进制颜色、渐变、阴影、Tailwind 色阶、`dark:` 变体 |
| 样式（CSS）   | `@layer utilities { … }`                             | 未分层覆盖 `.prose`、圆角 > `4px`、负字距                   |

- SSR 阶段（Step 0，`replayKey === 0`）避免用随机/仅客户端可见状态或会改动首帧属性的值，以保持 Astro SSR 与 React 19 水合零警告。
- 不要编写复杂动画 hook 包装层，直接调用 `motion/react`；通用 SVG 原语可在多个讲解共享时再沉淀到 `astro-wisp/explainers`。
