# Excalidraw 骨架格式

骨架是一个只含“意图”的 JSON：节点的位置/尺寸/文字/语义色，以及连线的起止 id。
`wisp_diagram.py new` 用 Excalidraw 自己的 `convertToExcalidrawElements` 生成完整元素（seed、boundElements、文本测量等），所以**不要手写完整的 Excalidraw 元素**。

```bash
W="uv run skills/wisp-diagram/scripts/wisp_diagram.py"   # 按 skill 实际位置调整
$W new attention.skeleton.json -o attention.excalidraw [--seed N] [--build]
```

- 不给 `-o` 时输出到同目录、去掉 `.skeleton.json` / `.json` 后缀再加 `.excalidraw`。
- `--seed` 默认 1，同一骨架多次转换结果完全相同（可复现、diff 干净）。
- 不在 8px 网格上的数值会输出 `warning:`（不会失败）。
- `--build` 转换后立即生成 `.wisp.svg`。
- 需要 Chromium（`uv run --with playwright==1.64.1 playwright install chromium`）；Excalidraw 0.18.1 与字体首次使用时从 jsDelivr 下载并缓存到 `~/.cache/wisp-diagram/`，离线前先 `$W cache warm`（见 SKILL.md「一次性准备」）。

## 顶层字段

| 字段    | 类型               | 说明                                             |
| ------- | ------------------ | ------------------------------------------------ |
| `style` | `"hand"`（可省略） | 骨架只支持手绘风格；规整风格请直接写 draw.io XML |
| `nodes` | `Node[]`           | 形状节点                                         |
| `edges` | `Edge[]`           | 连线（箭头）                                     |
| `texts` | `Text[]`           | 独立文字（标题、注释、符号）                     |

## Node

| 字段            | 必填 | 说明                                                                           |
| --------------- | ---- | ------------------------------------------------------------------------------ |
| `id`            | 是   | 唯一，供 edges 引用；重复会报错                                                |
| `shape`         | 否   | `rect`（默认，圆角矩形）、`ellipse`、`diamond`                                 |
| `x` `y` `w` `h` | 是   | 数值，左上角坐标与宽高；取 8 的倍数                                            |
| `label`         | 否   | 节点内文字，`\n` 换行；水平垂直居中                                            |
| `color`         | 否   | hue 名、语义名或基础色（见下）；省略时为中性节点（surface 底、muted 1px 描边） |
| `labelColor`    | 否   | 文字色，默认 `fg`（节点里的字不跟描边同色）                                    |
| `size`          | 否   | 文字字号：`label`(14，默认) / `title`(18) / `note`(12)                         |
| `emphasis`      | 否   | `true` 时线宽 2（默认 1.25）；中性节点改为 `fg` 描边、线宽 1.25（默认 1）      |
| `dashed`        | 否   | `true` 时虚线边框                                                              |

## Edge

| 字段        | 必填 | 说明                                                                               |
| ----------- | ---- | ---------------------------------------------------------------------------------- |
| `from` `to` | 是   | 节点 id；引用不存在的节点会报错                                                    |
| `id`        | 否   | 默认 `edge-<序号>-<from>-<to>`                                                     |
| `label`     | 否   | 箭头中点处的标签（12px，与箭头同色）                                               |
| `color`     | 否   | 默认 `fg`（黑）；常用 `muted`、语义色                                              |
| `dashed`    | 否   | 虚线                                                                               |
| `emphasis`  | 否   | 线宽 2（默认 1.25）                                                                |
| `arrow`     | 否   | `end`（默认，终点箭头）、`both`（双向）、`none`（无箭头线段）                      |
| `via`       | 否   | 拐点列表 `[[x, y], …]`（绝对坐标）：箭头画成经过这些点的折线，用来走直角或绕开节点 |

箭头怎么走（起止点都落在形状边缘外 6px 处）：

1. **两个矩形正对时画成水平或竖直的直线**：上下排列且左右投影重叠 ≥ 16px → 竖直线，落在重叠区间的中点；左右排列且上下投影重叠 ≥ 16px → 水平线。所以把节点摆在行、列上，箭头自然就是横平竖直的，不需要中心对齐。
2. 其余情况（错开的矩形、椭圆、菱形）是**两节点中心连线上的直线**。它不会绕开别的节点。
3. 需要拐弯时写 `via`：`{"from": "softmax", "to": "out", "via": [[204, 432]]}` 表示先从 softmax 竖直走到 (204, 432)，再水平进入 out。拐点的 x 取起点节点的中心 x、y 取终点节点的中心 y（或反过来），就是一个直角。
4. 两节点中心重合或离得太近放不下箭头时会报错。

连线标签放在线的中点，线条会在标签四周留出空隙。**带 `via` 的折线不要写 `label`**（中点常常落在拐角上）：改成一个独立的 `texts` 条目，放在某一段线的旁边。

## Text

| 字段    | 必填 | 说明                                         |
| ------- | ---- | -------------------------------------------- |
| `x` `y` | 是   | 左上角                                       |
| `text`  | 是   | 文字，可含 `\n`                              |
| `size`  | 否   | `label`(14，默认) / `title`(18) / `note`(12) |
| `color` | 否   | 默认 `fg`；`size: "note"` 时默认 `muted`     |
| `id`    | 否   | 默认 `text-<序号>`                           |

标题：放进文章的图**不写标题**（题注承担，alt 在引用处给出）；单独使用的图（README、幻灯片）写一个 `size: "title"` 的 text，build 会把它作为 `<title>`。

## 颜色名

- 8 个 hue：`blue` `amber` `green` `rose` `violet` `teal` `orange` `slate`
- 语义名（见 SKILL.md 的语义色表）：`q` `k` `v` `weight` `activation` `grad` `bias` `mask` `highlight` `visited` `active` `done` `error`
- 中性：`neutral`（节点默认值：surface 底 + muted 描边）
- 基础色：`fg`（正文黑）、`muted`（次要灰）
- 一张图最多用 3 种 hue（`slate`/`mask` 不计），其余节点保持中性；见 SKILL.md「颜色怎么用」。
- 其他名字会报错并列出可用名字。

## 固定的样式参数（不可在骨架里改）

线宽 1 / 1.25 / 2、roughness 1、solid 填充、4px 圆角（`roundness: {type: 3, value: 4}`）、字体 Excalifont（中文回落 Noto Sans SC）、字号 12/14/18，全部来自 palette.json。

## 完整示例

```json
{
  "style": "hand",
  "nodes": [
    { "id": "q", "shape": "rect", "x": 0, "y": 64, "w": 96, "h": 48, "label": "Q", "color": "q" },
    { "id": "k", "shape": "rect", "x": 0, "y": 160, "w": 96, "h": 48, "label": "Kᵀ", "color": "k" },
    {
      "id": "s",
      "shape": "ellipse",
      "x": 224,
      "y": 104,
      "w": 144,
      "h": 56,
      "label": "softmax",
      "color": "activation",
      "emphasis": true
    }
  ],
  "edges": [
    { "from": "q", "to": "s" },
    { "from": "k", "to": "s", "label": "QKᵀ/√d" }
  ],
  "texts": [
    { "x": 0, "y": 0, "text": "自注意力打分", "size": "title" },
    { "x": 0, "y": 256, "text": "注：softmax 在 K 的维度上归一化", "size": "note" }
  ]
}
```

更多图式见 `ml-patterns.md`。

## 转换之后

`.excalidraw` 是普通 Excalidraw 场景，可以在 excalidraw.com 打开微调（只用调色板颜色，网格 8px），保存后再运行 lint。
不要把调整后的文件再反向改回骨架；骨架只是生成起点。
