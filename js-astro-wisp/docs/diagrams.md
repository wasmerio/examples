# Wisp 图表体系

## 1. 三类图表的分工

| 场景                             | 工具           | 源文件                         | 产物                                 |
| -------------------------------- | -------------- | ------------------------------ | ------------------------------------ |
| 流程图、时序图、状态图等结构化图 | Mermaid → Pele | 正文中的 ` ```mermaid ` 代码块 | 构建期生成的内联 SVG，不单独保存文件 |
| 概念图、示意图、手绘风格         | Excalidraw     | `*.excalidraw`（JSON）         | `*.wisp.svg`（可移植 SVG）           |
| 模型结构图、精确排版的架构图     | draw.io        | `*.drawio`（XML）              | `*.wisp.svg`                         |
| 逐步演示、可交互的原理讲解       | React island   | `.tsx`                         | 运行时组件，见 explainers.md         |

## 2. 源文件格式

### 2.1 Excalidraw：`.excalidraw` 是 JSON

```json
{
  "type": "excalidraw",
  "version": 2,
  "source": "https://excalidraw.com",
  "elements": [ { "id": "…", "type": "rectangle", "x": 0, "y": 0, "strokeColor": "#2f5783", "backgroundColor": "#e9f2fb", "roughness": 1, "fontFamily": 5, … } ],
  "appState": { "viewBackgroundColor": "#ffffff", "gridSize": 8 },
  "files": { "<fileId>": { "mimeType": "image/png", "dataURL": "data:image/png;base64,…" } }
}
```

- 嵌入的图片以 base64 形式存放在 `files` 中，会让文件膨胀。lint 在源文件超过 2MB 时给出警告。
- Excalidraw 还能导出 `.excalidraw.svg` / `.excalidraw.png`，把场景数据嵌在图片里，可以再次导入编辑。Wisp **不以这种格式作为源文件**，源文件一律使用纯 `.excalidraw`。

### 2.2 draw.io：`.drawio` 是 XML

```xml
<mxfile host="drawio" version="…">
  <diagram id="…" name="Page-1">
    <mxGraphModel dx="…" grid="1" gridSize="8" …>
      <root>
        <mxCell id="0"/><mxCell id="1" parent="0"/>
        <mxCell id="2" value="Attention" style="rounded=1;absoluteArcSize=1;arcSize=8;fillColor=#e9f2fb;strokeColor=#2f5783;fontFamily=Inter;" vertex="1" parent="1">
          <mxGeometry x="0" y="0" width="160" height="48" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

- `<diagram>` 的内容可能是**压缩格式**：deflate-raw，再 base64，再 URL 编码。Wisp 要求提交**未压缩的 XML**，便于 git diff 和 Agent 编辑。`wisp-diagram normalize` 会自动解压。（draw.io 中的设置位置：File → Properties → 取消勾选 Compressed。）
- 一个文件可以包含多个页面（多个 `<diagram>`）。在文章中引用时用 `#page=<name>` 指定页面，默认取第一页。
- `.drawio.svg` / `.drawio.png` 同样可以内嵌源数据，但也**不作为源文件**。

## 3. 可移植 SVG 规范（`*.wisp.svg`）

目标：同一个文件在以下环境里都能正确显示：Wisp 页面（内联，跟随站点主题）；GitHub README、其他博客、IDE 预览（`<img>`，跟随系统主题）；直接用浏览器打开。

### 3.1 结构

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 W H" class="wisp-d" role="img" aria-labelledby="t d"
     data-wisp-diagram="1" data-source="attention.excalidraw" data-style="hand">
  <title id="t">自注意力计算流程</title>
  <desc id="d">Q 与 K 转置相乘、缩放、softmax，再与 V 相乘</desc>
  <style>
    .wisp-d{--wd-bg:transparent;--wd-fg:#1d1d1f;--wd-muted:#5c6067;--wd-border:#e2e2dd;--wd-surface:#f4f4f2;
            --wd-blue:#2f5783;--wd-blue-fill:#e9f2fb; … 8 个 hue … ;
            --wd-font-sans:Inter,"Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif;
            --wd-font-hand:Excalifont,Virgil,"Noto Sans SC","PingFang SC",sans-serif}
    @media (prefers-color-scheme:dark){.wisp-d{--wd-fg:#e6e6e3; … 暗色值 …}}
  </style>
  <!-- 图元：一律使用 var(--wd-*)，并带上浅色 fallback -->
  <rect fill="var(--wd-blue-fill, #e9f2fb)" stroke="var(--wd-blue, #2f5783)" … />
  <text fill="var(--wd-fg, #1d1d1f)" font-family="var(--wd-font-sans)">Q</text>
</svg>
```

### 3.2 三层优先级

1. **属性中的 fallback 值**：在不支持 CSS 变量的环境（部分渲染器、转 PNG 的工具）中使用浅色值。
2. **SVG 内部的 `<style>`**：作为 `<img>` 或独立文件打开时生效，通过 `prefers-color-scheme` 跟随系统主题。
3. **Wisp 页面内联时**：`diagram.css` 用更高优先级的选择器把 `--wd-*` 绑定到站点令牌，于是图表跟随站点的手动主题，而不是系统主题：

```css
/* astro-wisp 的 src/styles/diagram.css（由 gen-tokens 生成） */
[data-theme] .wisp-d { --wd-fg: var(--wisp-fg); --wd-blue: var(--wisp-hue-blue); … }
```

`[data-theme] .wisp-d` 的优先级是 (0,2,0)，高于 SVG 内的 `.wisp-d` 的 (0,1,0)，并且同时覆盖了 media query 分支，所以无论系统主题是什么，站点的选择都会生效。

**注意**：内联 SVG 内部的 `<style>` 会作用于整个页面，所以 SVG 里的所有选择器必须以 `.wisp-d` 为前缀，禁止出现裸的元素选择器。

### 3.3 颜色映射

导出得到的 SVG 中是十六进制颜色，`wisp-diagram build` 按 `palette.json` 映射：

| 源颜色（作者在编辑器里选的）                           | 替换为                                                                       |
| ------------------------------------------------------ | ---------------------------------------------------------------------------- |
| hue 的 light stroke，如 `#2f5783`                      | `var(--wd-blue, #2f5783)`                                                    |
| hue 的 light fill，如 `#e9f2fb`                        | `var(--wd-blue-fill, #e9f2fb)`                                               |
| `#1d1d1f` / `#000000` / `#1e1e1e`（Excalidraw 默认黑） | `var(--wd-fg, …)`                                                            |
| `#ffffff` / 画布背景                                   | 删除背景矩形，或改为 `var(--wd-bg)`                                          |
| 其他颜色                                               | **lint 报错**，并给出 ΔE 最接近的令牌建议；加 `--fix` 时自动吸附到最近的令牌 |

作者只能用调色板里的颜色作画，这样映射是确定的。为此提供两个素材库：`skills/wisp-diagram/assets/wisp.excalidrawlib`（随主题包分发） 和 `wisp-drawio-library.xml`（含预设颜色的形状、常用 ML 模块），以及 draw.io 的自定义调色板配置。

### 3.4 字体

- 默认**不嵌入字体**，只声明 `font-family` 栈。在 Wisp 页面里会直接使用站点已加载的 Inter 和 Noto SC。
- `--embed-fonts`：用 `fontTools（pyftsubset）` 按图中实际出现的字符，把 Inter、Noto SC（手绘风格时加 Excalifont）裁剪成子集，以 base64 woff2 嵌入。用于发布到外部平台或导出 PNG。通常每张图几十 KB。
- Excalidraw 中的中文**不使用小赖体**。手绘风格下中文回落到 Noto Sans SC，保证和正文风格一致。

### 3.5 两种风格的参数

| 参数       | hand（Excalidraw）              | clean（draw.io）                        |
| ---------- | ------------------------------- | --------------------------------------- |
| 线宽       | 1（中性节点）/ 1.25 / 2（强调） | 同左                                    |
| roughness  | 1                               | 不适用（sketch=0）                      |
| 圆角       | 4px（`roundness` 值 4）         | `rounded=1;absoluteArcSize=1;arcSize=8` |
| 填充       | solid，使用 hue fill            | 使用 hue fill                           |
| 文字       | 标签 14px，标题 18px，注释 12px | 同左                                    |
| 网格       | 8px 对齐                        | 8px 对齐                                |
| 阴影、渐变 | 禁止                            | 禁止                                    |

### 3.6 PNG 导出

公众号、知乎等平台对 SVG 支持不好，所以提供 `wisp-diagram export --png --theme light|dark --scale 2`，内部用 Playwright 截图并嵌入字体。

## 4. 存放路径

图表源文件**与文章放在一起**，生成的 SVG 放在源文件旁边，并提交进仓库：

```
src/content/posts/attention-explained/
├─ index.mdx
├─ diagrams/
│  ├─ attention-flow.excalidraw      # 源文件（JSON）
│  ├─ attention-flow.wisp.svg        # 生成文件（提交）
│  ├─ transformer-block.drawio       # 源文件（未压缩 XML）
│  └─ transformer-block.wisp.svg
└─ images/
```

- 文件名使用 kebab-case；`<name>.wisp.svg` 与源文件一一对应。
- 跨文章共用的图放在 `src/content/shared/diagrams/`。
- `diagrams.manifest.json`（站点根目录） 记录每个源文件的内容哈希。`wisp-diagram build` 只重建有变化的文件；`wisp-diagram check` 在 CI 中只校验哈希是否一致，**CI 不需要 Playwright 或 draw.io**。

## 5. 在 Markdown / MDX 中使用

### 5.1 标准图片语法（MD 和 MDX 都可用，推荐）

```md
![自注意力计算流程](./diagrams/attention-flow.excalidraw '图 1：Q·Kᵀ → softmax → ·V')
![Transformer Block](./diagrams/transformer-block.drawio#page=encoder)
```

`remark-diagram` 识别 `.excalidraw` / `.drawio` 结尾的图片节点后：

1. 读取同目录下对应的 `.wisp.svg`。如果不存在或哈希不一致，在 dev 环境中显示一个醒目的占位块，并提示运行 `pnpm diagram build`；在 build 环境中直接报错。
2. 把 alt 写入 `<title>`，把 title 写入 `<figcaption>`（开头的图号拆成 `.wisp-fig-no`）；题注独占全宽，动作（源文件 / draw.io）作为 `.wisp-fig-actions` 放在 `figure` 末尾（桌面端悬停浮现于图表右上角，窄屏与触屏回退在题注下方）。
3. 输出：

```html
<figure
  class="wisp-figure wisp-diagram"
  data-style="hand"
  aria-labelledby="attention-flow-caption-1"
  style="--wd-w:848px"
>
  <div class="wisp-diagram-body" tabindex="0" role="group" aria-label="自注意力计算流程">
    <svg class="wisp-d" …>…</svg>
  </div>
  <figcaption id="attention-flow-caption-1">
    <span class="wisp-fig-no">图 1：</span>Q·Kᵀ → softmax → ·V
  </figcaption>
  <span class="wisp-fig-actions">
    <a
      class="wisp-diagram-dl"
      href="/diagrams/attention-explained/attention-flow.excalidraw"
      download="attention-flow.excalidraw"
      title="下载源文件 attention-flow.excalidraw"
      >源文件</a
    >
  </span>
</figure>
```

图片 ID 需要做页面内唯一化：`<title id>` 加上文件名前缀，避免同一页多张图的 id 冲突。

### 5.2 MDX 组件（需要更多控制时）

```mdx
import Diagram from 'astro-wisp/components/Diagram.astro';

<Diagram
  src="./diagrams/transformer-block.drawio"
  page="encoder"
  alt="…"
  caption="…"
  wide
  download={false}
/>
```

`wide` 让图突破正文宽度。组件与 remark 插件共用同一个实现函数 `renderDiagram()`。

### 5.3 源文件下载

- `astro-wisp` 集成（`src/integration.ts`）：
  - dev 环境：注册 Vite middleware，把 `/diagrams/<post-id>/<file>` 映射到 `src/content/posts/<post-id>/diagrams/<file>`。
  - build 环境：在 `astro:build:done` 钩子中，把所有被引用的源文件复制到 `dist/diagrams/<post-id>/`。
- 响应头：`.excalidraw` 使用 `application/json`，`.drawio` 使用 `application/xml`，并带 `download` 属性。
- 可选的“在 draw.io 中打开”链接：`https://app.diagrams.net/#U<encodeURIComponent(绝对URL)>`（仅在 Astro 配置了真实 `site` 时显示）。Excalidraw 没有不经上传就能打开远程文件的方式，所以不提供在线打开链接。
- `features.diagramDownload` 可以关闭这个功能。

## 6. `wisp-diagram` skill（让 Agent 产出 Wisp 风格的图）

这个 skill 放在主题包的 `skills/wisp-diagram/`（站点中位于 `node_modules/astro-wisp/skills/wisp-diagram/`），**可以独立复制到任何项目**使用（`~/.claude/skills/` 或其他项目的 `.claude/skills/`）。它不依赖 Wisp 站点本身。

```
skills/wisp-diagram/
├─ SKILL.md                      # 触发条件、工作流、风格规则、语义色、禁止事项
├─ palette.json                  # 从主题的 design/palette.json 同步而来（gen-tokens 负责同步）
├─ reference/
│  ├─ style-guide.md             # 布局规则：8px 网格、留白、箭头、对齐、字号
│  ├─ excalidraw-skeleton.md     # 骨架格式说明与示例
│  ├─ drawio-cheatsheet.md       # mxCell 样式字符串示例、连线、分组
│  └─ ml-patterns.md             # 常用 ML 图式：注意力、Transformer block、矩阵乘、KV cache、MoE 路由
├─ assets/
│  ├─ wisp.excalidrawlib
│  └─ wisp-drawio-library.xml
└─ scripts/                      # Python + uv：依赖写在脚本头部（PEP 723），`uv run` 直接运行，无安装步骤
   ├─ wisp_diagram.py            # 统一入口：lint / normalize / build / export / new / check / probe / cache
   ├─ wisp_diagram_lib/          # 实现：骨架转换（convertToExcalidrawElements，在 Playwright 中运行）、
   │                             #   导出 + 颜色映射 + svgo + a11y、lint（--fix）、normalize、PNG、manifest
   ├─ tests/                     # pytest（端到端用例用 WISP_DIAGRAM_E2E=1 开启）
   └─ pyproject.toml             # 仅供开发期跑测试
```

站点的 `wisp diagram <命令>`（主题包 `bin/wisp.mjs` → `scripts/diagram/cli.ts`）是薄包装：转调包内 `uv run skills/wisp-diagram/scripts/wisp_diagram.py <命令> … --root <站点根> --manifest <站点根>/diagrams.manifest.json`。manifest 只由 Python 实现（`wisp_diagram_lib/manifest.py`）写入；页面渲染时 `src/lib/render-diagram.ts` 只读校验，哈希算法与之一致。

### 6.1 Agent 工作流（写在 SKILL.md 中）

1. **判断类型**：结构化的图优先用 Mermaid（直接写进正文，最省事）；概念图、示意图用 Excalidraw；精确的结构图用 draw.io。
2. **生成源文件**：
   - Excalidraw：**写骨架 JSON**（只含 type、位置、尺寸、label、语义色名、箭头的起止 id），再运行 `wisp_diagram.py new`。**禁止**手写完整的 Excalidraw 元素（version、seed、boundElements 等字段很容易出错）。
   - draw.io：直接写未压缩的 mxGraph XML，样式字符串只能使用 `drawio-cheatsheet.md` 中的预设。
   - 也可以先写 Mermaid，再用 `@excalidraw/mermaid-to-excalidraw` 转换成手绘风格作为起点。
3. **运行 `lint --fix`**，然后运行 `build`，生成 `.wisp.svg`。
4. **自检**：用 `wisp_diagram.py export --theme light` 和 `--theme dark` 各导出一张预览图，用 Read 工具查看。检查文字重叠、箭头穿过节点、在暗色下看不清的问题，修正后重新构建。
5. 在 Markdown 中用 §5.1 的语法引用，**必须提供有意义的 alt 文本**。

### 6.2 骨架格式（示意）

```json
{
  "style": "hand",
  "nodes": [
    { "id": "q", "shape": "rect", "x": 0, "y": 0, "w": 96, "h": 48, "label": "Q", "color": "q" },
    { "id": "k", "shape": "rect", "x": 0, "y": 80, "w": 96, "h": 48, "label": "Kᵀ", "color": "k" },
    {
      "id": "s",
      "shape": "ellipse",
      "x": 160,
      "y": 40,
      "w": 120,
      "h": 48,
      "label": "softmax",
      "color": "activation"
    }
  ],
  "edges": [
    { "from": "q", "to": "s" },
    { "from": "k", "to": "s", "label": "QKᵀ/√d" }
  ],
  "texts": [{ "x": 0, "y": -32, "text": "自注意力", "size": "title" }]
}
```

`color` 可以填 hue 名或语义名（q/k/v/weight…），由脚本解析为 stroke 和 fill。

### 6.3 导出依赖

| 源格式     | 导出方式                                                                                                                                                                                                    | 依赖                                                                                                   |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| excalidraw | Playwright（Python）打开一个本地页面，加载 `@excalidraw/excalidraw@0.18.1` 的 `exportToSvg`                                                                                                                 | Chromium；Excalidraw 及其依赖首次运行时从 jsDelivr 下载（锁定版本，import map 指向 `+esm` 构建）并缓存 |
| drawio     | 首选 `drawio -x -f svg --embed-svg-fonts false`（desktop CLI，Linux 无头环境要配合 `xvfb-run` 和 `--no-sandbox`）；其次 Docker 镜像 `rlespinasse/drawio-export`；最后在 Chromium 中加载 draw.io 官方 viewer | draw.io desktop、Docker 或 Chromium                                                                    |
| 后处理     | 可移植化（Python）→ svgo 4.1.0（浏览器构建，在 Chromium 中运行）→ a11y；`--embed-fonts` 用 fontTools 裁剪字体子集                                                                                           | Chromium、fonttools                                                                                    |

脚本自动探测可用的方式，按顺序回退；全部不可用时给出明确的安装提示。

前端资源（Excalidraw、svgo、Excalifont / Inter / Noto Sans SC 字体分片、draw.io viewer）缓存在 `~/.cache/wisp-diagram/`（`WISP_DIAGRAM_CACHE` 可改）。`wisp_diagram.py cache warm` 预先下载全部资源（约 11 MB），之后 `WISP_DIAGRAM_OFFLINE=1` 可完全离线；`WISP_EXCALIDRAW_BUNDLE`、`WISP_DRAWIO_VIEWER` 可指定本地文件。导出结果与此前的 Node 实现（T5b）逐字节一致。

## 7. Pele（Mermaid）

- 只在构建期运行 `render()`，Mermaid 代码不会出现在页面中。
- `pele.css` 由 gen-tokens 生成，按 design-system.md §1.3 映射 `--pele-*` 变量。
- 已知限制：布局与 Mermaid.js 不同；中文标签宽度的估算需要实测（任务 T-PELE 的验收项包含一张中文标签较多的流程图）。
- 宽度：SVG 只保留 viewBox，设 `max-width: 100%`，超宽时横向滚动，不缩小字号。

## 8. 测试

- 图表相关单元测试（`scripts/diagram/*.test.ts`、skill 的 pytest）：颜色映射、lint 规则、drawio 解压、骨架转换（用 fixture 做快照）。
- `tests/fixtures/diagrams/`：每种风格一张图，包含中文、全部 8 个 hue、箭头标签。
- 视觉回归：Playwright 对示例文章分别截取 light 和 dark 两张图，与基线比对，允许阈值 0.1%。
