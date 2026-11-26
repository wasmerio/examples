---
name: wisp-diagram
description: 为博客、技术文档绘制 Wisp 风格的概念图、架构图、模型结构图、算法示意图（自注意力、Transformer、矩阵乘、KV cache、MoE、RAG、训练循环等）。当用户或 Agent 需要画图、生成 .excalidraw / .drawio 源文件、导出可移植 SVG/PNG，或提到 excalidraw、drawio、draw.io、Wisp 风格图表、语义色（Q/K/V）、图表调色板时使用。不适用于数据图表（折线图、柱状图等）。
---

# wisp-diagram：产出 Wisp 风格图表

目标：产出**风格一致、可主题化、可移植**的图表。源文件（`.excalidraw` / `.drawio`）+ 生成的 `*.wisp.svg`：同一个 SVG 在 Wisp 站点内联时跟随站点主题，在 GitHub README / 其他博客以 `<img>` 使用时跟随系统明暗。

本 skill 目录自包含，可整体复制到任何项目（`~/.claude/skills/` 或 `<项目>/.claude/skills/`）。脚本是 Python，用 [uv](https://docs.astral.sh/uv/) 运行：入口 `scripts/wisp_diagram.py` 头部用 PEP 723 声明了依赖（playwright、fonttools），`uv run` 会自动建好隔离环境，**不需要 npm / pip install**。

```
SKILL.md
palette.json          调色板（唯一的颜色来源）
reference/            style-guide.md  excalidraw-skeleton.md  drawio-cheatsheet.md  ml-patterns.md
assets/               wisp.excalidrawlib  wisp-drawio-library.xml  drawio-config.json  drawio-colors.txt
scripts/              wisp_diagram.py（统一入口）  wisp_diagram_lib/（实现）  tests/（pytest）
```

## 一次性准备

下文命令都在**项目根目录**运行，`$W` 代表 skill 的入口脚本（按 skill 实际位置调整路径）：

```bash
W="uv run skills/wisp-diagram/scripts/wisp_diagram.py"   # 例如 .claude/skills/wisp-diagram/... 或 ~/.claude/skills/wisp-diagram/...
uv run --with playwright==1.64.1 playwright install chromium   # 导出用的无头浏览器（已装过可跳过）
$W probe                                                       # 查看 Chromium、Excalidraw、draw.io 导出方式（cli / docker / browser）是否可用
```

**首次运行会下载并缓存**（之后离线可用）：

| 内容                                                                                       | 来源                                                          | 大小          |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------- | ------------- |
| Python 依赖 playwright 1.64.1、fonttools                                                   | PyPI（uv 管理，放在 uv 自己的缓存）                           | ≈ 55 MB       |
| Chromium（只在没装过时）                                                                   | `playwright install chromium`，放在 `~/.cache/ms-playwright/` | 数百 MB       |
| @excalidraw/excalidraw 0.18.1 及其依赖（≈110 个 ES 模块）                                  | jsDelivr，按锁定版本                                          | ≈ 1.6 MB      |
| svgo 4.1.0 浏览器构建（SVG 精简，在 Chromium 中运行）                                      | jsDelivr                                                      | 0.8 MB        |
| 字体：Excalifont、Inter 5.3.0、Noto Sans SC 5.3.1（按 unicode-range 分片，用到哪片下哪片） | jsDelivr                                                      | 全部 ≈ 4.5 MB |
| draw.io viewer（只在 browser 导出方式下）                                                  | viewer.diagrams.net                                           | ≈ 4.7 MB      |
| draw.io 的 MathJax 构建（只在 browser 导出方式下、图里有公式时）                           | viewer.diagrams.net                                           | ≈ 2 MB        |

除 Python 依赖与 Chromium 外，缓存都在 `~/.cache/wisp-diagram/`（可用 `WISP_DIAGRAM_CACHE` 改位置）。`$W cache status` 查看，`$W cache clear` 清空。

**离线使用**：先在联网环境运行一次 `$W cache warm`（下载上表全部前端资源，≈ 11 MB），之后设置 `WISP_DIAGRAM_OFFLINE=1` 即可完全离线；缓存缺文件时会报错并提示预热，不会静默联网。也可以用 `WISP_EXCALIDRAW_BUNDLE=<本地 JS>` 指定自己的 Excalidraw 构建（定义了 `window.__wisp` 的 IIFE，或导出 `exportToSvg` 等函数的 ES 模块），用 `WISP_DRAWIO_VIEWER=<本地文件>` 指定 draw.io viewer。

draw.io 导出按 cli → docker → browser 顺序自动回退。`new`、`build`、`export` 都需要 Chromium（Excalidraw 导出、svgo 精简都在无头浏览器里运行）；`lint`、`normalize`、`check` 不需要。

## 1. 先选工具

| 场景                                                     | 选择                                                                             | 源文件                          |
| -------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------- |
| 流程图、时序图、状态图、类图等**结构化**图，节点关系为主 | **Mermaid**（最省事，直接写进正文的 ` ```mermaid ` 代码块；Wisp 站点构建期渲染） | 无独立文件                      |
| 概念图、直觉示意、手绘风格、ML 算子数据流                | **Excalidraw**                                                                   | `name.excalidraw`（JSON）       |
| 精确对齐的模型结构图、分层架构图、需要直角折线和多页     | **draw.io**                                                                      | `name.drawio`（**未压缩** XML） |
| 逐步演示、可交互                                         | 不属于本 skill（React 组件）                                                     | —                               |

原则：能用 Mermaid 讲清楚就别画图；手绘风格不超过约 12 个节点；同一篇文章里风格统一。

**先定画布再动笔：宽 640px。** Wisp 的正文栏约 710px，图比它宽就会被等比缩小、字跟着变小。所以主流向从上到下，并列的分支排成 2–3 列（每列约 190–300px），长流程往下长而不是往右长。lint 会对超过 720px 的图给出 `width` 警告。

## 2. 工作流（5 步）

以下以 `diagrams/attention` 为例，路径按实际位置替换。

**① 判断类型**（见上表）。选定后读对应 reference：Excalidraw → `reference/excalidraw-skeleton.md`；draw.io → `reference/drawio-cheatsheet.md`；常见模型图式直接从 `reference/ml-patterns.md` 复制修改。布局原则见 `reference/style-guide.md`。

**② 生成源文件**

- Excalidraw：**写骨架 JSON**（位置、尺寸、label、语义色名、箭头起止 id），再转换。**禁止手写完整的 Excalidraw 元素**（seed、boundElements、version 等字段极易出错）。
  ```bash
  $W new diagrams/attention.skeleton.json -o diagrams/attention.excalidraw
  ```
  骨架文件转换后可以删除或留作生成脚本；之后以 `.excalidraw` 为准。
- draw.io：直接写未压缩 mxGraph XML，样式字符串只用 `reference/drawio-cheatsheet.md` 的预设。拿到压缩过的 `.drawio` 时先 `$W normalize diagrams/file.drawio` 解压。
- 手动在编辑器里画：导入 `assets/wisp.excalidrawlib`（Excalidraw 右侧 Library → Open）或 `assets/wisp-drawio-library.xml`（draw.io：File → Open Library from → Device），按 `assets/drawio-colors.txt` 配置调色板。

**③ lint（先修复）再 build**

```bash
$W lint diagrams/attention.excalidraw --fix      # 非调色板颜色吸附到最近令牌；无法自动修的会列出
$W lint diagrams/attention.excalidraw --strict   # 无任何 error/warn 才算通过
$W build diagrams/attention.excalidraw           # 生成 diagrams/attention.wisp.svg
```

build 常用参数：`--embed-fonts`（内嵌字体子集，发布到外部平台时用）、`--fix`、`--title T --desc D`（覆盖无障碍文本，仅单文件）、`--drawio cli|docker|browser`、`--out-dir DIR`、`--strict`。多页 draw.io 的第 2 页起输出为 `name.page-2.wisp.svg`。

**④ 自检：导出 light 与 dark 预览，用 Read 工具查看**

```bash
$W export diagrams/attention.wisp.svg --theme light -o /tmp/attention.light.png
$W export diagrams/attention.wisp.svg --theme dark  -o /tmp/attention.dark.png
```

检查：文字重叠、箭头穿过节点、标签压住箭头头部、暗色下看不清、中文被截断。发现问题改源文件，回到 ③ 重新 build。预览 PNG 放临时目录，不要提交。

**⑤ 引用并写 alt**：见下文「使用产物」。**必须提供有意义的 alt 文本**（描述图要表达的结论，而不是“图 1”）。

## 3. 调色板

颜色只能来自 `palette.json`。这 8 个 hue 按**印刷油墨**调：描边是低彩度的深色墨（钢蓝、赭石、苔绿、砖红、茄紫、手册 teal、铁锈橙、冷灰），填充是接近纸色的淡洗，和页面的墨色正文、单一 teal 强调色是一家人。作画时**只用浅色值**（下表左值）；build 会把它们映射成 `var(--wd-*)`（暗色值由 SVG 自动切换）。不要手选暗色值，不要用调色板之外的任何颜色（lint 报错，`--fix` 吸附到最近的令牌）。

| hue      | stroke（线条、文字）light / dark | fill（填充）light / dark | 语义名            |
| -------- | -------------------------------- | ------------------------ | ----------------- |
| `blue`   | `#2f5783` / `#a9cbef`            | `#e9f2fb` / `#1a2634`    | `q`、`active`     |
| `amber`  | `#7b5518` / `#f2c681`            | `#fbf2df` / `#2e2515`    | `k`、`highlight`  |
| `green`  | `#2c522d` / `#84b585`            | `#e9f5e9` / `#1a281c`    | `v`、`done`       |
| `rose`   | `#984646` / `#eda9aa`            | `#fcedec` / `#341f1f`    | `grad`、`error`   |
| `violet` | `#4d335c` / `#bb9ece`            | `#f5eef9` / `#291e2e`    | `weight`          |
| `teal`   | `#0f766e` / `#7fd3c5`            | `#e3f5f3` / `#112926`    | `activation`      |
| `orange` | `#762f06` / `#ce8d66`            | `#fceee4` / `#311f15`    | `bias`            |
| `slate`  | `#464e57` / `#9da7b3`            | `#eaedf2` / `#23272b`    | `mask`、`visited` |

基础色：正文 `fg` `#1d1d1f`（Excalidraw 默认黑 `#000000`/`#1e1e1e` 也会被视为 fg），次要 `muted` `#5c6067`，面 `surface` `#f4f4f2`，边框 `border` `#e2e2dd`，画布白 `#ffffff`（build 会去掉背景）。

### 颜色怎么用（比选哪个颜色更重要）

- **默认节点是中性的**：`surface` 底 + `muted`（或 `fg`）1px 描边 + `fg` 文字。骨架里不写 `color` 或写 `"color": "neutral"`；draw.io 用 cheatsheet 的「中性节点」预设。
- **颜色只给语义角色**（Q/K/V、权重、梯度……）。不要为了区分并列的兄弟节点、为了「好看」给节点换色。
- **一张图最多 3 种 hue**（`slate` 是中性灰，不计）。超过时 lint 给出 `hue-count` 警告：挑出这张图要讲的那几个角色上色，其余改回中性。
- **强调靠线宽或 `highlight`**，不靠再加一个颜色。
- **节点里的字用 `fg`**；只有独立的、和某个角色绑定的标签（连线标签、图例说明）才用该 hue 的 stroke 色。

### 语义色（所有文章、图表一致）

| 语义名       | 含义          | hue      |
| ------------ | ------------- | -------- |
| `q`          | 查询 Query    | `blue`   |
| `k`          | 键 Key        | `amber`  |
| `v`          | 值 Value      | `green`  |
| `weight`     | 权重、参数    | `violet` |
| `activation` | 激活、softmax | `teal`   |
| `grad`       | 梯度          | `rose`   |
| `bias`       | 偏置          | `orange` |
| `mask`       | 掩码、输入    | `slate`  |
| `highlight`  | 高亮          | `amber`  |
| `visited`    | 已访问        | `slate`  |
| `active`     | 当前/进行中   | `blue`   |
| `done`       | 完成          | `green`  |
| `error`      | 错误、损失    | `rose`   |

骨架的 `color` 字段可直接写语义名（`"color": "q"`）或 hue 名；draw.io 中查表取 hue 对应的 fill/stroke。

## 4. 风格硬规则

| 项目   | 规则                                                                                                                         |
| ------ | ---------------------------------------------------------------------------------------------------------------------------- |
| 网格   | 所有元素 x/y/宽/高取 **8px** 的倍数                                                                                          |
| 字号   | 只用 **12**（注释）/ **14**（标签）/ **18**（标题）；lint 容差 ±1                                                            |
| 线宽   | 中性节点 **1**；hue 节点和连线 **1.25**；强调 **2**（一张图一两处）                                                          |
| 圆角   | **4px**，与页面的 box 圆角一致：Excalidraw `roundness: {type: 3, value: 4}`，draw.io `rounded=1;absoluteArcSize=1;arcSize=8` |
| 颜色   | 默认中性节点；hue 只给语义角色，**一张图 ≤ 3 种 hue**（slate 不计）；节点内文字 `fg`                                         |
| 填充   | 纯色填充，使用 hue 的 fill 或 `surface`；**禁止渐变**                                                                        |
| 阴影   | **禁止**                                                                                                                     |
| 宽度   | 自然宽度 **640–700px**（正文栏宽）；超过 720px lint 警告，超过 1000px 字已看不清                                             |
| 流向   | 从上到下；连线横平竖直，拐弯走直角（骨架用 `via`，draw.io 用 `edgeStyle=orthogonalEdgeStyle`）                               |
| 公式   | 只在 draw.io 里用：页面 `math="1"`，标签写 `\(...\)`（见 drawio-cheatsheet「公式」）；Excalidraw 用 Unicode（Kᵀ、√d、Σ）     |
| 字体   | Excalidraw 用 Excalifont（中文回落 Noto Sans SC，**不用小赖体**）；draw.io 用 `Inter`                                        |
| 手绘   | `roughness: 1`；draw.io 不用 `sketch=1`                                                                                      |
| 背景   | 不画背景矩形，保持透明                                                                                                       |
| 源文件 | `.excalidraw` 为 JSON；`.drawio` 为**未压缩** XML；嵌入图片会使文件膨胀（>2MB 警告）                                         |

## 5. 自检清单

- [ ] lint `--strict` 通过：无非调色板颜色、无阴影/渐变、字号合规、元素在 8px 网格上、宽度不超过 720px
- [ ] 流程从上到下，连线横平竖直；没有一字排开被缩小的长流程
- [ ] 语义色用对：Q 蓝、K 琥珀、V 绿、权重紫、激活青、梯度/损失玫红、偏置橙、掩码/输入灰
- [ ] 一张图 ≤ 3 种 hue（lint 无 `hue-count`），其余节点是中性的；节点里的字是 `fg`
- [ ] 一张图只讲一件事，节点 ≤ 12（手绘）
- [ ] 连线不穿过节点、不交叉；短连线（间距 < 96px）上没有标签
- [ ] 中文标签每行 ≤ 8–10 个汉字，没有被截断
- [ ] 放进文章的图不在图里写标题（题注承担）；draw.io 页面名有意义；需要时在最下方加一两句注释
- [ ] light 和 dark 的预览 PNG 都用 Read 看过：公式排成了公式（不是 `\(...\)` 原文），标签没有溢出节点
- [ ] 已生成 `.wisp.svg`，且源文件修改后重新 build 过
- [ ] alt 文本有意义

## 6. 使用产物

### 在 Wisp 站点中（可选）

站点的 `pnpm diagram build|check|lint [--fix]`、`pnpm diagram new <skeleton.json> --build`、`pnpm diagram export <文件> --png --theme dark` 是本 skill 的薄包装（主题包的 `wisp diagram` 命令转调本 skill 的 `wisp_diagram.py`，并带上 `--root <站点根> --manifest <站点根>/diagrams.manifest.json` 做增量构建）。本 skill 随主题包分发，站点中位于 `node_modules/astro-wisp/skills/wisp-diagram/`（`pnpm exec wisp skills` 打印路径）。
源文件与文章放在一起（`diagrams/` 目录），`.wisp.svg` 也要提交。在 MDX/Markdown 中用标准图片语法引用**源文件**（站点会内联同名 `.wisp.svg`，并附源文件下载链接）：

```md
![自注意力：Q 与 K 打分后对 V 加权求和](./diagrams/attention.excalidraw '图 1：自注意力计算流程')
![Transformer Block 的残差结构](./diagrams/transformer-block.drawio#page=encoder)
```

alt 写入 SVG 的 `<title>`，引号中的说明成为图注；`#page=<页面名>` 选择 draw.io 的页面。`pnpm diagram check` 只校验内容哈希，CI 里不需要浏览器（但需要 uv）。

其他项目也可以用同样的“项目模式”：`$W build --root . --manifest diagrams.manifest.json` 只重建有变化的源文件（扫描 `<root>/src/content/**/diagrams/`），`$W check --root . --manifest diagrams.manifest.json` 在 CI 中校验哈希。

### 在其他地方（GitHub README、其他博客、IDE 预览）

直接引用生成的 `*.wisp.svg`：它自带 `<style>`，作为 `<img>` 时通过 `prefers-color-scheme` 跟随**系统**明暗，没有 CSS 变量支持的渲染器会使用属性里的浅色 fallback。

```md
![自注意力计算流程](diagrams/attention.wisp.svg)
```

- 发布到外部平台前用 `$W build <文件> --embed-fonts` 内嵌字体子集（每张图通常几十 KB），避免字体回落。
- 公众号、知乎等不支持 SVG 的平台：`$W export <文件> --theme light --scale 2 -o out.png`（`--transparent` 可得到透明背景；默认内嵌字体）。
- 源文件一并保存在仓库中，便于以后修改；`.excalidraw` 可在 excalidraw.com 打开，`.drawio` 可在 app.diagrams.net 打开。

## 7. 常见错误

| 错误                                         | 怎么避免                                                              |
| -------------------------------------------- | --------------------------------------------------------------------- |
| 手写完整 Excalidraw 元素                     | 只写骨架，用 `$W new` 转换                                            |
| 在编辑器里用了调色板外的颜色（吸管、默认色） | 用素材库；lint `--fix` 吸附；仍报错就改源文件                         |
| 每个节点一个颜色，一张图五六种 hue           | 默认中性节点，只给要讲的语义角色上色，≤ 3 种 hue                      |
| 调色板换代后旧源文件全是 lint 错误           | 用 `$W migrate --from <旧 palette.json>` 按令牌名改写（见下文）       |
| 手选暗色值作画                               | 只用浅色值，暗色靠 SVG 自动切换                                       |
| 图画成横向一长条，放进文章被缩到看不清       | 画布宽 640px，流程从上到下，分支并排成列                              |
| 图里的标题和题注重复                         | 文章里的图不写标题                                                    |
| 骨架箭头穿过第三个节点                       | 调整布局让节点正对，或用 `via` 给拐点；复杂走线改用 draw.io 折线      |
| 一堆斜线箭头，看着乱                         | 节点摆在行、列上（投影重叠即可），箭头自动横平竖直                    |
| draw.io 标签里的 `\(...\)` 原样显示          | 页面要写 `math="1"`（lint 的 `math` 规则会报错）                      |
| 公式把节点撑破                               | 公式不换行：加宽节点或拆成两行，写完看预览                            |
| 短连线加标签，标签压住箭头头部               | 节点间距 ≥ 96 再加标签，否则去掉标签，把说明写进最下方的注释          |
| 坐标不在 8px 网格上                          | 所有数值取 8 的倍数                                                   |
| `.drawio` 提交了压缩格式                     | `$W normalize` 解压；File → Properties 取消 Compressed                |
| draw.io 标签里的 `&` 没转义                  | `html=1` 时写成 `&amp;amp;`，换行写 `&lt;br&gt;`                      |
| 中文标签过长被截断                           | 每行 ≤ 8–10 个汉字，用 `\n` / `<br>` 换行，加宽节点                   |
| 改了源文件忘记重新 build                     | 修改后重跑 `$W build`（站点里 `pnpm diagram check` 会发现哈希不一致） |
| 没看暗色预览就交付                           | 步骤 ④ 的 dark 预览必须看                                             |
| 空洞的 alt（“图 1”“diagram”）                | alt 写图要说明的结论                                                  |
| 用图表工具画数据图                           | 折线/柱状等数据图不属于本 skill                                       |

## 8. 调色板换代（migrate）

`palette.json` 的 hue 值改了之后，旧源文件里的十六进制都不在新调色板里。**不要用 `lint --fix`**：它按 ΔE 吸附到最近的令牌，换代后最近的不一定是同名令牌（例如旧的紫会吸到新的灰）。用 `migrate` 按令牌名一一改写，同时把线宽（旧 thin/normal/bold → 新值）和圆角（draw.io 顶点改成 `absoluteArcSize=1;arcSize=<2×corner-radius>`，Excalidraw 写 `roundness.value`）一起换掉：

```bash
git show <旧版本>:packages/astro-wisp/design/palette.json > /tmp/old-palette.json   # 或 skill 自带 palette.json 的旧版本
# glob 用引号交给脚本展开（Python glob，支持 **，不支持 {a,b}）
$W migrate --from /tmp/old-palette.json 'src/content/**/diagrams/*.excalidraw' 'src/content/**/diagrams/*.drawio' --check   # 退出码 1 = 有文件要改
$W migrate --from /tmp/old-palette.json 'src/content/**/diagrams/*.excalidraw' 'src/content/**/diagrams/*.drawio'
$W lint 'src/content/**/diagrams/*.excalidraw' 'src/content/**/diagrams/*.drawio'   # 再看 hue-count 等警告，按「颜色怎么用」改图
$W build --root . --manifest diagrams.manifest.json --force
```

migrate 也认得素材库（`.excalidrawlib`、`<mxlibrary>` 的 `.xml`）和 `drawio-config.json`。已经是新值的文件再跑一遍不会变化。

## 9. 排错

- `uv: command not found`：安装 uv（`curl -LsSf https://astral.sh/uv/install.sh | sh`）。需要 Python ≥ 3.11，uv 会按需自动下载。
- `无法启动 Chromium`：`uv run --with playwright==1.64.1 playwright install chromium`（版本要与脚本锁定的 playwright 一致）。
- `下载失败` / `离线模式下缓存缺少 N 个文件`：联网运行一次 `$W cache warm`；缓存位置见 `$W cache status`。
- draw.io 导出失败：`$W probe` 看哪种方式可用；可用 `--drawio browser|cli|docker` 强制指定。
- 想看浏览器里的报错：设置 `WISP_DIAGRAM_DEBUG=1`。
- lint 报 `unrecognised color`：颜色不是十六进制（如 `rgb()` 之外的特殊值），手工改成调色板里的浅色值。
