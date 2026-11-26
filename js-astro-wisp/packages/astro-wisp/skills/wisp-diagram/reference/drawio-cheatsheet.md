# draw.io 速查（Wisp 预设）

draw.io 用于**精确排版的结构图**（模型结构、分层架构）。源文件是**未压缩**的 mxGraph XML（`.drawio`），样式字符串只使用本页预设，颜色只用调色板的**浅色值**（build 会映射为随主题切换的变量）。

## 硬规则

- 8px 网格：`mxGeometry` 的 x/y/width/height 取 8 的倍数（`gridSize="8"`）。
- 字号只用 12 / 14 / 18；字体 `fontFamily=Inter`（中文自动回落到 Noto Sans SC）。
- 线宽：中性节点 `strokeWidth=1`，hue 节点与连线 `1.25`，强调 `2`。
- 圆角 4px：`rounded=1;absoluteArcSize=1;arcSize=8`。`absoluteArcSize=1` 时 `arcSize` 是圆角**直径**（px），所以 8 → 4px；不写 `absoluteArcSize` 时 `arcSize` 是短边的百分比，圆角随节点大小变化，不要用。
- 颜色：默认中性节点；hue 只给语义角色，一张图最多 3 种 hue（slate 不计，lint `hue-count` 警告）；节点文字 `fontColor=#1d1d1f`。
- 禁止 `shadow=1`、`gradientColor`、`sketch=1`；不用 `glass`。
- 未压缩：File → Properties → 取消勾选 Compressed。若拿到压缩文件，运行 `uv run skills/wisp-diagram/scripts/wisp_diagram.py normalize file.drawio` 解压（路径按 skill 实际位置调整）。
- 标签里的换行用 `&lt;br&gt;`，`&` 写成 `&amp;amp;`（`html=1` 时 value 是 HTML，再经 XML 转义）。

## 节点（vertex）

**中性节点（默认）**：输入、LayerNorm、Add、普通步骤都用它。

```
rounded=1;absoluteArcSize=1;arcSize=8;whiteSpace=wrap;html=1;fillColor=#f4f4f2;strokeColor=#5c6067;strokeWidth=1;fontFamily=Inter;fontSize=14;fontColor=#1d1d1f;
```

强调的中性节点：`strokeColor=#1d1d1f;strokeWidth=1.25`。

**语义角色节点**（`F`、`S` 替换成下表的颜色）：

```
rounded=1;absoluteArcSize=1;arcSize=8;whiteSpace=wrap;html=1;fillColor=F;strokeColor=S;strokeWidth=1.25;fontFamily=Inter;fontSize=14;fontColor=#1d1d1f;
```

各 hue 的 `fillColor` / `strokeColor`（括号内是语义名）：

| hue                     | 颜色片段                                 |
| ----------------------- | ---------------------------------------- |
| `blue` (q, active)      | `fillColor=#e9f2fb;strokeColor=#2f5783;` |
| `amber` (k, highlight)  | `fillColor=#fbf2df;strokeColor=#7b5518;` |
| `green` (v, done)       | `fillColor=#e9f5e9;strokeColor=#2c522d;` |
| `rose` (grad, error)    | `fillColor=#fcedec;strokeColor=#984646;` |
| `violet` (weight)       | `fillColor=#f5eef9;strokeColor=#4d335c;` |
| `teal` (activation)     | `fillColor=#e3f5f3;strokeColor=#0f766e;` |
| `orange` (bias)         | `fillColor=#fceee4;strokeColor=#762f06;` |
| `slate` (mask, visited) | `fillColor=#eaedf2;strokeColor=#464e57;` |

- 强调节点：把 `strokeWidth=1.25` 换成 `strokeWidth=2`。强调不靠换颜色。
- `slate`（mask、visited）是中性灰，用于掩码、已访问等**有含义**的灰；没有含义的节点用上面的中性节点。
- 节点文字统一 `fontColor=#1d1d1f`（正文黑）。彩色文字只用于独立标签（连线标签、图例），取该 hue 的 stroke 值。

## 分组容器

```
rounded=1;absoluteArcSize=1;arcSize=8;whiteSpace=wrap;html=1;fillColor=#f4f4f2;strokeColor=#e2e2dd;strokeWidth=1;dashed=1;verticalAlign=top;align=left;spacingLeft=12;spacingTop=4;fontFamily=Inter;fontSize=12;fontColor=#5c6067;container=0;
```

先在 XML 中写容器（它在最底层），再写内部节点；子节点保持 `parent="1"` 并用绝对坐标即可（不需要真正的父子关系）。

## 连线（edge）

| 用途                  | 样式                                                                                                                                                            |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 实线                  | `endArrow=classic;html=1;strokeColor=#1d1d1f;strokeWidth=1.25;`                                                                                                 |
| 带标签                | 在实线样式后加 `fontFamily=Inter;fontSize=12;fontColor=#1d1d1f;`，`value="标签"`                                                                                |
| 虚线/可选             | `endArrow=classic;html=1;strokeColor=#5c6067;strokeWidth=1.25;dashed=1;`                                                                                        |
| 残差/梯度（玫红虚线） | `edgeStyle=orthogonalEdgeStyle;rounded=1;endArrow=classic;html=1;strokeColor=#984646;strokeWidth=1.25;dashed=1;fontFamily=Inter;fontSize=12;fontColor=#984646;` |
| 直角折线              | 加 `edgeStyle=orthogonalEdgeStyle;rounded=1;`                                                                                                                   |

- 连线必须带 `source` 和 `target`（节点 id），`<mxGeometry relative="1" as="geometry"/>`。
- 绕行的残差线：加 `exitX=1;exitY=0.5;entryX=1;entryY=0.5;`，并在 `mxGeometry` 里用 `<Array as="points">` 给出拐点（x 落在节点右侧 40px 处，如 296）。

## 文字

| 用途 | 样式                                                                                                                       |
| ---- | -------------------------------------------------------------------------------------------------------------------------- |
| 标题 | `text;html=1;align=left;verticalAlign=middle;fontFamily=Inter;fontSize=18;fontStyle=1;fontColor=#1d1d1f;`（宽 240、高 32） |
| 标签 | `text;html=1;align=left;verticalAlign=middle;fontFamily=Inter;fontSize=14;fontColor=#1d1d1f;`                              |
| 注释 | `text;html=1;align=left;verticalAlign=middle;fontFamily=Inter;fontSize=12;fontColor=#5c6067;`                              |

`<title>` 取自页面名（页面名是默认的 `Page-1` 时取文件名），`<desc>` 由图中所有文字标签拼成；可用 `wisp_diagram.py build <文件> --title ... --desc ...` 覆盖（仅单文件构建时可用）。所以**给页面起一个有意义的名字**。

## 公式

把 `<mxGraphModel … math="0">` 改成 `math="1"`，标签里用 `\(...\)` 写行内公式（MathJax / LaTeX 语法）：

```
value="内容 query \(\mathbf q_t^{C,h}\)&lt;br&gt;\(d_r=64\)"
```

- 只用行内的 `\(...\)`；需要大号求和号时写 `\(\displaystyle \sum_j …\)`，公式要单独占一行就在前后加 `&lt;br&gt;`。不要用 `$$...$$`。
- 公式和相邻文字之间不用手动加空格：导出时会在行内公式两侧留出 0.2em 的间距。
- 公式宽度不会自动换行，写之前估一下：14px 字号下每个符号约 8–10px，节点宽度要留够。
- cli / docker / browser 三种导出方式都支持公式；browser 方式首次使用时会下载并缓存 draw.io 的 MathJax 构建。

## 最小可用模板

```xml
<mxfile host="wisp-diagram">
  <diagram id="mini" name="Page-1">
    <mxGraphModel dx="800" dy="600" grid="1" gridSize="8" guides="1" page="0" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <mxCell id="title" value="最小示例" style="text;html=1;align=left;verticalAlign=middle;fontFamily=Inter;fontSize=18;fontStyle=1;fontColor=#1d1d1f;" vertex="1" parent="1">
          <mxGeometry x="0" y="0" width="240" height="32" as="geometry"/>
        </mxCell>
        <mxCell id="a" value="输入" style="rounded=1;absoluteArcSize=1;arcSize=8;whiteSpace=wrap;html=1;fillColor=#f4f4f2;strokeColor=#5c6067;strokeWidth=1;fontFamily=Inter;fontSize=14;fontColor=#1d1d1f;" vertex="1" parent="1">
          <mxGeometry x="0" y="64" width="128" height="48" as="geometry"/>
        </mxCell>
        <mxCell id="b" value="线性层" style="rounded=1;absoluteArcSize=1;arcSize=8;whiteSpace=wrap;html=1;fillColor=#f5eef9;strokeColor=#4d335c;strokeWidth=1.25;fontFamily=Inter;fontSize=14;fontColor=#1d1d1f;" vertex="1" parent="1">
          <mxGeometry x="224" y="64" width="128" height="48" as="geometry"/>
        </mxCell>
        <mxCell id="e1" value="" style="endArrow=classic;html=1;strokeColor=#1d1d1f;strokeWidth=1.25;" edge="1" parent="1" source="a" target="b">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="note" value="注：最小可用模板" style="text;html=1;align=left;verticalAlign=middle;fontFamily=Inter;fontSize=12;fontColor=#5c6067;" vertex="1" parent="1">
          <mxGeometry x="0" y="144" width="200" height="24" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

## 多页

每个 `<diagram>` 是一页，`name` 就是页面名。build 的输出：第 1 页为 `<name>.wisp.svg`，第 2 页起为 `<name>.page-2.wisp.svg`、`<name>.page-3.wisp.svg`……每个 SVG 根元素带 `data-page="<页面名>"`。在 Wisp 站点里用 `#page=<页面名>` 引用指定页面。

```xml
<mxfile host="wisp-diagram">
  <diagram id="overview" name="总览">
    <mxGraphModel dx="800" dy="600" grid="1" gridSize="8" guides="1" page="0" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <!-- 第 1 页的图元 -->
      </root>
    </mxGraphModel>
  </diagram>
  <diagram id="detail" name="细节">
    <mxGraphModel dx="800" dy="600" grid="1" gridSize="8" guides="1" page="0" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <!-- 第 2 页的图元（id 在每页内唯一即可） -->
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

## 在 draw.io 里作画

1. 导入素材库：File → Open Library from → Device → `assets/wisp-drawio-library.xml`（节点、强调节点、ML 模块、分组、连线、文字都带好了预设样式）。
2. 可选：Extras → Configuration 粘贴 `assets/drawio-config.json`，把颜色选择器限制为调色板（详见 `assets/drawio-colors.txt`）。
3. 保存前确认 File → Properties → Compressed 已取消。
4. 保存后运行 lint；非调色板颜色用 `--fix` 吸附。
