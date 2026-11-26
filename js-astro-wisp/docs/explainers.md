# 交互式讲解组件（Explainers）

用于分步推导算法原理、张量映射、哈希分桶、注意力机制与推理调度。基于 React 19 + Motion（`motion/react`），以 Astro island 的形式嵌入 MDX。

**主题只提供通用积木**（`astro-wisp/explainers`），不内置具体讲解。文章私有的讲解组件直接放在文章目录的 `explainers/` 下，跨文章复用的领域原语留在站点公共目录，这样文章自包含，不用的讲解也不会进入其他页面包。React、react-dom、motion 是主题的可选 peer 依赖。

## 1. 分层与目录约定

```
packages/astro-wisp/src/explainers/
├─ index.ts                         # astro-wisp/explainers（core + React）
├─ core/                            # astro-wisp/explainers/core：纯 TS，不依赖 React 或 DOM
│  ├─ timeline.ts                   # Step<S> = { state; caption; label?; duration?; focus? }、record()
│  ├─ format.ts                     # 数字、矩阵格式化
│  ├─ tones.ts                      # Tone（语义色 | hue）→ var(--wisp-sem-*) / var(--wisp-hue-*)
│  └─ tones.generated.ts            # 由调色板生成（pnpm tokens）
├─ react/
│  ├─ Explainer.tsx                 # 外壳：header 工具条 + 顶部阶段 tab / 刻度条 + 舞台 + caption + 原生 dialog 全屏
│  ├─ useExplainer.ts               # 步进 / 重播（replayKey）/ 自动演示 / 全屏 / reduced-motion 状态机
│  ├─ ExplainerIcon.tsx             # Lucide 内联控制图标
│  ├─ labels.ts                     # 界面文字（中文 / 英文，随站点语言；可逐项覆盖）
│  ├─ RichText.tsx                  # KaTeX 行内公式渲染与 SSR 采集缓存
│  └─ primitives/                   # Stage、Matrix、Cell、Label、TexLabel
└─ explainers.css                   # 由 Explainer 引入，只在用到讲解的页面加载

文章私有目录（例：src/content/posts/<slug>/explainers/<name>/）
├─ index.tsx                        # 组装 <Explainer> 与阶段视图切换
├─ steps.ts + steps.test.ts         # 纯数据与步进状态生成 + vitest 校验
├─ *Stage.tsx                       # 按阶段拆分的 HTML + SVG + Motion 子组件（每文件 ~80–150 行）
└─ style.css                        # 文章讲解局部样式（@layer utilities）
```

## 2. 编排与设计规范

1. **算法与状态是纯函数**：通过 `(input) => Step<S>[]` 或 `record(initial, (state, emit) => …)` 预生成全部步骤。≤ 8 步时每步可提供 `label`（3–8 字），渲染为顶部语义阶段标签栏；还可设置 `duration` 控制自动演示停留毫秒数（默认 `3600ms`）。
2. **HTML + SVG 混合聚焦舞台（3Blue1Brown 思路）**：每一步只聚焦当前机理，用 Flex / Grid 与原生 `<RichText>` 排版公式与数据结构（随容器响应、零 KaTeX `<foreignObject>` 裁切），内联 SVG 仅承担括号、连线与 Lucide 图标；复杂多阶段讲解拆分成多个阶段子组件，避免把 4–6 个阶段硬塞进一张固定尺寸 SVG。
3. **Motion 对象连续性与水合安全**：直接用 `motion/react` 的 `<MotionConfig reducedMotion="user">`、`<LayoutGroup>`、`AnimatePresence`、`layoutId`、`pathLength`、`stagger` 编排因果推演（非活跃元素压暗、线条书写、元素从上一步滑入下一步），不自建动画 hook 封装。首屏 Step 0 默认静态直出或设置 `initial={false}`，保证 SSR 与客户端水合零偏差；通过 `ctx.replayKey > 0` 或切换步骤触发进场编排。
4. **颜色与几何硬约束**：只能使用 `Tone`（`toneStroke` / `toneFill`）或 `var(--wisp-*)` 语义令牌，单图非中性（slate）色调最多 3 种；禁止十六进制颜色、渐变、阴影、毛玻璃、胶囊圆角及 `rx="2"`；所有圆角只用 `3px` 或 `4px`。
5. **原生全屏推演**：外壳自带 `<dialog>` 全屏按钮（`F` 键触发，`Esc` 关闭并归还焦点），`children(step, index, { replayKey, expanded, reducedMotion, total })` 可感知 `expanded` 并在宽画布下展开多列布局，且保持当前步骤与组件状态不断开。

## 3. 交互与无障碍约定

| 操作              | 鼠标 / 触控                     | 键盘（Explainer 获得焦点时） |
| ----------------- | ------------------------------- | ---------------------------- |
| 切换阶段          | 点击顶部阶段标签（≤8 步）       | ← / →（标签栏内同步移焦）    |
| 拖动进度          | 标题栏下缘进度条（>8 步）       | ← / →                        |
| 上一步 / 下一步   | 标题栏 ‹ / › 按钮               | ← / →                        |
| 第一步 / 最后一步 | 顶部首/末标签或进度条           | Home / End                   |
| 重播本步动画      | 标题栏重播按钮（rotate-ccw）    | R                            |
| 自动演示 / 停止   | 标题栏演示按钮（play / square） | Space                        |
| 全屏查看 / 退出   | 标题栏全屏按钮 / 遮罩 / × 按钮  | F / Esc                      |

- 说明区置于 `aria-live="polite"` 容器中（自动演示开启时临时切为 `off` 避免朗读干扰），配合 `CaptionGhosts` 预留最长一步高度。
- `reduced-motion` 在 `useEffect` 内读取后写进演示按钮 `aria-description`，避免 SSR 与首帧属性不一致；`<MotionConfig reducedMotion="user">` 自动抑制位移/路径动画。
- **SSR 兜底**：无 JS 时依然静态呈现完整的第 1 步舞台与图注说明。推荐使用 `client:visible`。
