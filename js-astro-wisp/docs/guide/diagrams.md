# 图表指南

Wisp 支持三类图表。本文说明如何选择、如何放置源文件、如何引用，以及如何构建、检查和下载。

## 一、选择图表工具

| 场景                                           | 工具       | 源文件                         | 产物                                 |
| ---------------------------------------------- | ---------- | ------------------------------ | ------------------------------------ |
| 流程图、时序图、状态图、类图、甘特图等结构化图 | Mermaid    | 正文中的 ` ```mermaid ` 代码块 | 构建期生成的内联 SVG，不单独保存文件 |
| 概念图、示意图、手绘风格                       | Excalidraw | `*.excalidraw`（JSON）         | `*.wisp.svg`                         |
| 精确排版的模型结构图、多页架构图               | draw.io    | `*.drawio`（未压缩 XML）       | `*.wisp.svg`                         |

原则：能用 Mermaid 讲清楚就用 Mermaid。Excalidraw 适合手绘风格的概念图，不超过约 12 个节点；draw.io 适合需要直角折线、分组和多页的结构图。同一篇文章尽量只用一种风格。

Mermaid 不需要额外工具，见 [写作指南](./writing.md) 中的示例。下面主要讲 Excalidraw 和 draw.io。

## 二、目录约定

源文件与文章放在一起，生成的 `.wisp.svg` 放在源文件旁边，两者都提交进仓库：

```text
src/content/posts/attention-explained/
├─ index.mdx
└─ diagrams/
   ├─ attention-flow.excalidraw      # 源文件（JSON）
   ├─ attention-flow.wisp.svg        # 生成文件（提交）
   ├─ transformer-block.drawio       # 源文件（未压缩 XML）
   └─ transformer-block.wisp.svg     # 生成文件（提交，多页时还有 .page-2.wisp.svg）
```

- 文件名使用 kebab-case，`<name>.wisp.svg` 与源文件一一对应。
- 多篇文章共用的图放在 `src/content/shared/diagrams/`，引用时用相对路径指向该目录。
- `diagrams.manifest.json`（站点根目录） 记录每个源文件的内容哈希，不要手动编辑。

## 三、引用语法

使用标准图片语法，引用源文件（不是 `.wisp.svg`）：

```markdown
![自注意力计算流程](./diagrams/attention-flow.excalidraw '图 1：Q·Kᵀ → softmax → ·V')
![Transformer Block](./diagrams/transformer-block.drawio#page=encoder)
```

| 部分                 | 作用                                                                                |
| -------------------- | ----------------------------------------------------------------------------------- |
| 方括号中的 alt       | 写入 SVG 的 `<title>`，是屏幕阅读器读到的名称。应描述图要表达的结论，不要只写“图 1” |
| 引号中的 title       | 成为图注（`<figcaption>`）                                                          |
| `#page=<名称或序号>` | 选择 draw.io 文件中的页面，默认第一页。序号从 1 开始                                |

在 MDX 中还可以使用组件写法，需要更多控制时（例如突破正文宽度）使用：

```mdx
import Diagram from 'astro-wisp/components/Diagram.astro';

<Diagram
  src="./diagrams/transformer-block.drawio"
  page="encoder"
  alt="Transformer Block 的残差结构"
  caption="图 2"
  wide
/>
```

`wide` 让图突破正文宽度；`download={false}` 隐藏下载链接。

## 四、构建与检查

修改源文件后，在项目根目录执行：

```bash
pnpm diagram build                 # 增量构建：只处理有变化的源文件
pnpm diagram build path/to/dir     # 只构建某个目录或文件
pnpm diagram build --force         # 忽略哈希，全部重建
pnpm diagram lint --fix            # 检查并自动修正调色板颜色
pnpm diagram check                 # 校验哈希是否与 .wisp.svg 一致（CI 用）
```

`pnpm diagram`（即主题包提供的 `wisp diagram` 命令）是 [`wisp-diagram` skill](../../packages/astro-wisp/skills/wisp-diagram/SKILL.md) 中 Python 脚本的薄包装，实际执行 `uv run node_modules/astro-wisp/skills/wisp-diagram/scripts/wisp_diagram.py … --root <站点根> --manifest <站点根>/diagrams.manifest.json`，因此需要先安装 [uv](https://docs.astral.sh/uv/)（`curl -LsSf https://astral.sh/uv/install.sh | sh`），不需要额外的 npm 或 pip 依赖。`build`、`export`、`new` 还需要 Chromium：

```bash
uv run --with playwright==1.64.1 playwright install chromium
```

首次构建时会把锁定版本的 Excalidraw 0.18.1、svgo 4.1.0 和字体（Excalifont、Inter、Noto Sans SC）从 jsDelivr 下载到 `~/.cache/wisp-diagram/`，以后可离线使用，详见下文“导出资源缓存”。

常用参数：

- `--embed-fonts`：把用到的字体切片嵌入 SVG，适合发布到外部平台。每张图通常增加几十 KB。
- `--fix`：构建时自动吸附非调色板颜色到最近的令牌。
- `--drawio cli|docker|browser`：指定 draw.io 的导出方式，见下文。

`lint` 检查的内容包括：颜色必须来自调色板、字号与网格、字体、源文件是否超过 2MB（嵌入大图会让文件膨胀）。它不会修改文件，除非加 `--fix`。

`check` 只比较哈希，不需要浏览器或 draw.io（只需要 uv），因此可以放进 CI。如果失败，在本地运行 `pnpm diagram build` 并提交生成的 `.wisp.svg` 与 `manifest.json`。

## 五、检查效果

生成后请分别检查浅色和深色两个主题下的效果，可以导出 PNG 预览：

```bash
pnpm diagram export src/content/posts/my-post/diagrams/flow.wisp.svg --png --theme light -o flow-light.png
pnpm diagram export src/content/posts/my-post/diagrams/flow.wisp.svg --png --theme dark -o flow-dark.png
```

检查文字是否重叠、箭头是否穿过节点、暗色下是否看得清。

## 六、源文件下载

每张图的题注行右端默认显示“源文件”链接（draw.io 图另有“draw.io”链接），读者可以下载 `.excalidraw` 或 `.drawio` 后再编辑。

- 下载地址为 `/diagrams/<文章 id>/<文件名>`，共用图为 `/diagrams/shared/<文件名>`。
- 构建时源文件会被复制到 `dist/diagrams/`。开发服务器也会直接提供这些地址。
- `.excalidraw` 以 `application/json` 提供，`.drawio` 以 `application/xml` 提供，两者都带 `download` 属性。
- 关闭：`features.diagramDownload: false`（见 [配置参考](./configuration.md)）。
- 对于 `.drawio`，如果 Astro 配置中的 `site` 设为真实域名，页面上还会出现“在 draw.io 中打开”的链接。正式发布前应把 `site` 改成正式域名。Excalidraw 没有可以直接打开远程文件的方式，因此不提供在线打开链接。

部署时可以设置响应头，见 [部署](./deployment.md)。

## 七、draw.io 导出方式

`pnpm diagram build` 需要把 draw.io 源文件导出为 SVG。按以下顺序自动选择，全部不可用时给出安装提示：

1. **cli**：本机安装 draw.io desktop，命令 `drawio` 在 PATH 中可用。Linux 无头环境需要 `xvfb-run` 并加上 `--no-sandbox`。也可以用环境变量 `WISP_DRAWIO_BIN` 指定可执行文件。
2. **docker**：使用 Docker 镜像 `rlespinasse/drawio-export`。
3. **browser**：用 Playwright 在 Chromium 中加载 draw.io 的 viewer 脚本并导出。需要已安装 Chromium（见上文）。

可以用 `pnpm diagram probe` 查看哪种方式可用，用 `--drawio <方式>` 或环境变量 `WISP_DRAWIO_EXPORTER=<方式>` 强制指定。

### 导出资源缓存

browser 方式需要 draw.io 的 `viewer-static.min.js`，它按以下顺序取得：

1. 环境变量 `WISP_DRAWIO_VIEWER` 指定的本地文件。
2. 缓存文件。默认位置为 `~/.cache/wisp-diagram/drawio-viewer-static.min.js`。缓存目录可以用 `WISP_DIAGRAM_CACHE` 修改，未设置时遵循 `XDG_CACHE_HOME`。
3. 首次使用时从 `https://viewer.diagrams.net/js/viewer-static.min.js` 下载并写入缓存。

Excalidraw（0.18.1 及其依赖）、svgo 和字体也缓存在同一目录的 `cdn/` 下，按锁定版本从 jsDelivr 下载。离线环境下，先在联网时运行一次 `pnpm diagram cache warm` 下载全部资源（约 11 MB），之后设置 `WISP_DIAGRAM_OFFLINE=1` 禁止下载；缓存不全时会报错并提示预热。`pnpm diagram cache status` 查看缓存，`WISP_EXCALIDRAW_BUNDLE=<本地 JS>` 可以指定自己的 Excalidraw 构建。

## 八、在站外使用 `.wisp.svg`

`.wisp.svg` 是可移植的，可以直接用于 GitHub README、其他博客或 IDE 预览：

```markdown
![自注意力计算流程](diagrams/attention-flow.wisp.svg)
```

- 文件自带 `<style>`，作为 `<img>` 使用时会通过 `prefers-color-scheme` 跟随**系统**的明暗。
- 不支持 CSS 变量的渲染器会使用属性中的浅色默认值。
- 外部发布前建议执行 `pnpm diagram build --embed-fonts`，避免字体回落。
- 源文件也要保存在仓库中，方便以后修改。

## 九、导出 PNG

公众号、知乎等平台对 SVG 支持不好时，导出 PNG：

```bash
pnpm diagram export path/to/flow.wisp.svg --png --theme light --scale 2 -o flow.png
pnpm diagram export path/to/flow.excalidraw --png --theme dark --transparent -o flow-dark.png
```

- `--theme light|dark`：选择主题，默认 `light`。
- `--scale`：倍率，默认 `2`，范围 (0, 8]。
- `--transparent`：透明背景。
- `--no-embed-fonts`：不嵌入字体（默认嵌入）。

`export` 接受 `.wisp.svg`、`.excalidraw` 和 `.drawio` 三种输入。

## 十、Agent 绘图

仓库的 [`skills/wisp-diagram`](../../packages/astro-wisp/skills/wisp-diagram/SKILL.md) 是给 AI Agent 使用的绘图 skill，包含调色板、风格规则、骨架格式、素材库和上述命令的实现。它也可以单独复制到其他项目，只需要 uv：

```bash
uv run node_modules/astro-wisp/skills/wisp-diagram/scripts/wisp_diagram.py --help   # 或 pnpm exec wisp skills 查看路径
```

## 相关链接

- [写作指南](./writing.md)
- [部署](./deployment.md)
- [配置参考](./configuration.md)
