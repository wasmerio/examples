# 常用 ML 图式

每个图式都已用 `wisp_diagram.py new` → `lint` → `build` → `export` 真实跑通（light 与 dark），可直接复制后改文字和坐标。
骨架字段说明见 `excalidraw-skeleton.md`，draw.io 样式见 `drawio-cheatsheet.md`。

通用约定：

- 语义色固定：Q = 蓝（`q`）、K = 琥珀（`k`）、V = 绿（`v`）、权重 = 紫（`weight`）、激活/softmax = 青（`activation`）、梯度/损失 = 玫红（`grad`/`error`）、偏置 = 橙（`bias`）、掩码/输入 = 灰（`mask`）。
- **一张图最多 3 种 hue**（`slate`/`mask` 是中性灰，不计）。只给图要讲的那几个语义角色上色，其余节点写 `"color": "neutral"`（或不写 color）：surface 底、muted 1px 细线、正文色文字。
- 最终输出节点用 `"emphasis": true`（hue 节点线宽 2；中性节点改为墨色描边、线宽 1.25），不要为强调再换一个颜色；可选/未选中的路径用 `"dashed": true`。
- **总宽不超过 700px**（正文栏约 710px），节点摆在行、列上：正对的矩形之间箭头是水平 / 竖直的直线，错开时是中心连线上的斜线，需要拐弯用 `via`。箭头不会自动绕开其他节点，布局时要保证连线不穿过第三个节点。
- 连线标签放在线段中点，**线段太短（节点间距小于约 96px）时不要加标签**，否则标签会压住箭头头部。
- 节点文字用 `\n` 换行；每行中文不超过 8–10 个字。

## 1. 自注意力（Self-Attention）

Q 与 K 做缩放点积，softmax 归一化成注意力权重，再对 V 加权求和。**纵向排布，总宽 640px**：三路输入在第一行并排，
正对的节点之间自动画成竖直 / 水平箭头；softmax → 输出要拐弯，用 `via` 给一个拐点；拐弯的线不放标签，说明文字写成旁边的独立 `texts`。
正文里的图不写标题（题注承担），alt 文本在引用处给出。

```json
{
  "style": "hand",
  "nodes": [
    {
      "id": "q",
      "shape": "rect",
      "x": 0,
      "y": 0,
      "w": 176,
      "h": 56,
      "label": "查询 Q",
      "color": "q"
    },
    {
      "id": "k",
      "shape": "rect",
      "x": 232,
      "y": 0,
      "w": 176,
      "h": 56,
      "label": "键 Kᵀ",
      "color": "k"
    },
    {
      "id": "v",
      "shape": "rect",
      "x": 464,
      "y": 0,
      "w": 176,
      "h": 56,
      "label": "值 V",
      "color": "v"
    },
    {
      "id": "score",
      "shape": "rect",
      "x": 96,
      "y": 128,
      "w": 216,
      "h": 64,
      "label": "缩放点积\nQ·Kᵀ/√d",
      "color": "neutral"
    },
    {
      "id": "softmax",
      "shape": "ellipse",
      "x": 96,
      "y": 264,
      "w": 216,
      "h": 64,
      "label": "softmax",
      "color": "neutral"
    },
    {
      "id": "mask",
      "shape": "rect",
      "x": 368,
      "y": 272,
      "w": 128,
      "h": 48,
      "label": "掩码 mask",
      "color": "mask",
      "dashed": true
    },
    {
      "id": "out",
      "shape": "rect",
      "x": 336,
      "y": 400,
      "w": 304,
      "h": 64,
      "label": "输出 O",
      "color": "neutral",
      "emphasis": true
    },
    {
      "id": "bias",
      "shape": "diamond",
      "x": 416,
      "y": 528,
      "w": 144,
      "h": 72,
      "label": "偏置 b",
      "color": "neutral",
      "dashed": true
    }
  ],
  "edges": [
    { "from": "q", "to": "score" },
    { "from": "k", "to": "score" },
    { "from": "score", "to": "softmax" },
    { "from": "mask", "to": "softmax", "color": "muted", "dashed": true },
    { "from": "softmax", "to": "out", "via": [[204, 432]] },
    { "from": "v", "to": "out", "color": "v", "label": "加权求和" },
    { "from": "bias", "to": "out", "color": "muted", "dashed": true }
  ],
  "texts": [
    { "x": 216, "y": 352, "text": "注意力权重", "size": "note", "color": "fg" },
    { "x": 0, "y": 568, "text": "注：虚线是可选步骤（掩码、偏置）", "size": "note" }
  ]
}
```

## 2. Transformer Block（draw.io）

精确的纵向结构图用 draw.io：自下而上 LayerNorm → 多头自注意力 → Add → LayerNorm → FFN → Add，两条虚线是残差连接。这些模块都不是语义角色，所以全部用中性节点；要讲的 FFN 用墨色描边强调，颜色只留给残差线。
节点样式取自 `drawio-cheatsheet.md` 的预设。保存为 `transformer-block.drawio`。

```xml
<mxfile host="wisp-diagram">
  <diagram id="transformer-block" name="Transformer Block">
    <mxGraphModel dx="800" dy="600" grid="1" gridSize="8" guides="1" page="0" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <mxCell id="title" value="Transformer Block" style="text;html=1;align=left;verticalAlign=middle;fontFamily=Inter;fontSize=18;fontStyle=1;fontColor=#1d1d1f;" vertex="1" parent="1">
          <mxGeometry x="0" y="0" width="320" height="32" as="geometry"/>
        </mxCell>
        <mxCell id="grp" value="× N 层堆叠" style="rounded=1;absoluteArcSize=1;arcSize=8;whiteSpace=wrap;html=1;fillColor=#f4f4f2;strokeColor=#e2e2dd;strokeWidth=1.25;dashed=1;verticalAlign=top;align=left;spacingLeft=12;spacingTop=4;fontFamily=Inter;fontSize=12;fontColor=#5c6067;container=0;" vertex="1" parent="1">
          <mxGeometry x="0" y="64" width="320" height="432" as="geometry"/>
        </mxCell>
        <mxCell id="inp" value="输入 X" style="rounded=1;absoluteArcSize=1;arcSize=8;whiteSpace=wrap;html=1;fillColor=#f4f4f2;strokeColor=#5c6067;strokeWidth=1;fontFamily=Inter;fontSize=14;fontColor=#1d1d1f;" vertex="1" parent="1">
          <mxGeometry x="64" y="528" width="192" height="40" as="geometry"/>
        </mxCell>
        <mxCell id="ln1" value="LayerNorm" style="rounded=1;absoluteArcSize=1;arcSize=8;whiteSpace=wrap;html=1;fillColor=#f4f4f2;strokeColor=#5c6067;strokeWidth=1;fontFamily=Inter;fontSize=14;fontColor=#1d1d1f;" vertex="1" parent="1">
          <mxGeometry x="64" y="440" width="192" height="32" as="geometry"/>
        </mxCell>
        <mxCell id="mha" value="多头自注意力" style="rounded=1;absoluteArcSize=1;arcSize=8;whiteSpace=wrap;html=1;fillColor=#f4f4f2;strokeColor=#5c6067;strokeWidth=1;fontFamily=Inter;fontSize=14;fontColor=#1d1d1f;" vertex="1" parent="1">
          <mxGeometry x="64" y="360" width="192" height="48" as="geometry"/>
        </mxCell>
        <mxCell id="add1" value="Add 残差" style="rounded=1;absoluteArcSize=1;arcSize=8;whiteSpace=wrap;html=1;fillColor=#f4f4f2;strokeColor=#5c6067;strokeWidth=1;fontFamily=Inter;fontSize=14;fontColor=#1d1d1f;" vertex="1" parent="1">
          <mxGeometry x="64" y="296" width="192" height="32" as="geometry"/>
        </mxCell>
        <mxCell id="ln2" value="LayerNorm" style="rounded=1;absoluteArcSize=1;arcSize=8;whiteSpace=wrap;html=1;fillColor=#f4f4f2;strokeColor=#5c6067;strokeWidth=1;fontFamily=Inter;fontSize=14;fontColor=#1d1d1f;" vertex="1" parent="1">
          <mxGeometry x="64" y="232" width="192" height="32" as="geometry"/>
        </mxCell>
        <mxCell id="ffn" value="前馈网络 FFN" style="rounded=1;absoluteArcSize=1;arcSize=8;whiteSpace=wrap;html=1;fillColor=#f4f4f2;strokeColor=#1d1d1f;strokeWidth=1.25;fontFamily=Inter;fontSize=14;fontColor=#1d1d1f;" vertex="1" parent="1">
          <mxGeometry x="64" y="152" width="192" height="48" as="geometry"/>
        </mxCell>
        <mxCell id="add2" value="Add 残差" style="rounded=1;absoluteArcSize=1;arcSize=8;whiteSpace=wrap;html=1;fillColor=#f4f4f2;strokeColor=#5c6067;strokeWidth=1;fontFamily=Inter;fontSize=14;fontColor=#1d1d1f;" vertex="1" parent="1">
          <mxGeometry x="64" y="88" width="192" height="32" as="geometry"/>
        </mxCell>
        <mxCell id="e1" value="" style="endArrow=classic;html=1;strokeColor=#1d1d1f;strokeWidth=1.25;" edge="1" parent="1" source="inp" target="ln1">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="e2" value="" style="endArrow=classic;html=1;strokeColor=#1d1d1f;strokeWidth=1.25;" edge="1" parent="1" source="ln1" target="mha">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="e3" value="" style="endArrow=classic;html=1;strokeColor=#1d1d1f;strokeWidth=1.25;" edge="1" parent="1" source="mha" target="add1">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="e4" value="" style="endArrow=classic;html=1;strokeColor=#1d1d1f;strokeWidth=1.25;" edge="1" parent="1" source="add1" target="ln2">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="e5" value="" style="endArrow=classic;html=1;strokeColor=#1d1d1f;strokeWidth=1.25;" edge="1" parent="1" source="ln2" target="ffn">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="e6" value="" style="endArrow=classic;html=1;strokeColor=#1d1d1f;strokeWidth=1.25;" edge="1" parent="1" source="ffn" target="add2">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="r1" value="残差" style="endArrow=classic;html=1;strokeColor=#984646;strokeWidth=1.25;edgeStyle=orthogonalEdgeStyle;rounded=1;exitX=1;exitY=0.5;entryX=1;entryY=0.5;fontFamily=Inter;fontSize=12;fontColor=#984646;dashed=1;" edge="1" parent="1" source="inp" target="add1">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="296" y="548"/>
              <mxPoint x="296" y="312"/>
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="r2" value="残差" style="endArrow=classic;html=1;strokeColor=#984646;strokeWidth=1.25;edgeStyle=orthogonalEdgeStyle;rounded=1;exitX=1;exitY=0.5;entryX=1;entryY=0.5;fontFamily=Inter;fontSize=12;fontColor=#984646;dashed=1;" edge="1" parent="1" source="add1" target="add2">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="296" y="312"/>
              <mxPoint x="296" y="104"/>
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="note" value="输出送入下一层" style="text;html=1;align=left;verticalAlign=middle;fontFamily=Inter;fontSize=12;fontColor=#5c6067;" vertex="1" parent="1">
          <mxGeometry x="0" y="584" width="160" height="24" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

## 3. 矩阵乘法

A(m×k) × B(k×n) = C(m×n)；下排说明 C[i][j] 是 A 的第 i 行与 B 的第 j 列的点积。运算符 × 和 = 用 `texts` 而不是短箭头。

```json
{
  "style": "hand",
  "nodes": [
    {
      "id": "a",
      "shape": "rect",
      "x": 0,
      "y": 48,
      "w": 128,
      "h": 96,
      "label": "A\nm × k",
      "color": "blue"
    },
    {
      "id": "b",
      "shape": "rect",
      "x": 224,
      "y": 48,
      "w": 128,
      "h": 96,
      "label": "B\nk × n",
      "color": "amber"
    },
    {
      "id": "c",
      "shape": "rect",
      "x": 448,
      "y": 48,
      "w": 128,
      "h": 96,
      "label": "C\nm × n",
      "color": "green",
      "emphasis": true
    },
    {
      "id": "row",
      "shape": "rect",
      "x": 0,
      "y": 176,
      "w": 128,
      "h": 40,
      "label": "A 的第 i 行",
      "color": "blue",
      "size": "note"
    },
    {
      "id": "col",
      "shape": "rect",
      "x": 224,
      "y": 176,
      "w": 128,
      "h": 40,
      "label": "B 的第 j 列",
      "color": "amber",
      "size": "note"
    },
    {
      "id": "dot",
      "shape": "ellipse",
      "x": 96,
      "y": 288,
      "w": 192,
      "h": 56,
      "label": "点积 → C[i][j]",
      "color": "neutral"
    }
  ],
  "edges": [
    { "from": "row", "to": "dot", "dashed": true, "color": "blue" },
    { "from": "col", "to": "dot", "dashed": true, "color": "amber" }
  ],
  "texts": [
    { "x": 160, "y": 80, "text": "×", "size": "title" },
    { "x": 384, "y": 80, "text": "=", "size": "title" },
    { "x": 0, "y": 0, "text": "矩阵乘法", "size": "title" },
    { "x": 0, "y": 368, "text": "注：C 的每个元素是 A 的一行与 B 的一列的点积", "size": "note" }
  ]
}
```

## 4. KV 缓存

每个解码步只为新词元计算 Qₜ、Kₜ、Vₜ；Kₜ、Vₜ 追加进缓存，注意力读取缓存中全部历史 K、V。

```json
{
  "style": "hand",
  "nodes": [
    {
      "id": "tok",
      "shape": "rect",
      "x": 0,
      "y": 96,
      "w": 112,
      "h": 56,
      "label": "新词元 t",
      "color": "mask"
    },
    {
      "id": "qt",
      "shape": "rect",
      "x": 192,
      "y": 32,
      "w": 96,
      "h": 48,
      "label": "Qₜ",
      "color": "q"
    },
    {
      "id": "kt",
      "shape": "rect",
      "x": 192,
      "y": 168,
      "w": 96,
      "h": 48,
      "label": "Kₜ",
      "color": "k"
    },
    {
      "id": "vt",
      "shape": "rect",
      "x": 192,
      "y": 248,
      "w": 96,
      "h": 48,
      "label": "Vₜ",
      "color": "v"
    },
    {
      "id": "cache",
      "shape": "rect",
      "x": 376,
      "y": 160,
      "w": 160,
      "h": 136,
      "label": "KV 缓存\nK₁..Kₜ\nV₁..Vₜ",
      "color": "slate"
    },
    {
      "id": "attn",
      "shape": "rect",
      "x": 376,
      "y": 32,
      "w": 160,
      "h": 56,
      "label": "注意力",
      "color": "neutral"
    },
    {
      "id": "out",
      "shape": "rect",
      "x": 568,
      "y": 32,
      "w": 112,
      "h": 56,
      "label": "输出 oₜ",
      "color": "neutral",
      "emphasis": true
    }
  ],
  "edges": [
    { "from": "tok", "to": "qt" },
    { "from": "tok", "to": "kt" },
    { "from": "tok", "to": "vt" },
    { "from": "kt", "to": "cache", "label": "追加", "color": "k" },
    { "from": "vt", "to": "cache", "color": "v" },
    { "from": "qt", "to": "attn" },
    { "from": "cache", "to": "attn", "label": "读取全部 K、V", "dashed": true },
    { "from": "attn", "to": "out" }
  ],
  "texts": [
    { "x": 0, "y": 0, "text": "KV 缓存", "size": "title" },
    {
      "x": 0,
      "y": 328,
      "text": "注：历史词元的 K、V 只算一次，每步只为新词元计算 Q、K、V",
      "size": "note"
    }
  ]
}
```

## 5. MoE 路由（top-2）

路由器（菱形）给每个专家打分，选中的专家用实线 + 强调线宽，未选中的用虚线节点和虚线灰色箭头。

```json
{
  "style": "hand",
  "nodes": [
    {
      "id": "tok",
      "shape": "rect",
      "x": 0,
      "y": 136,
      "w": 96,
      "h": 56,
      "label": "词元 x",
      "color": "mask"
    },
    {
      "id": "router",
      "shape": "diamond",
      "x": 160,
      "y": 120,
      "w": 144,
      "h": 88,
      "label": "路由器",
      "color": "activation"
    },
    {
      "id": "e1",
      "shape": "rect",
      "x": 384,
      "y": 0,
      "w": 128,
      "h": 56,
      "label": "专家 1",
      "color": "weight",
      "emphasis": true
    },
    {
      "id": "e2",
      "shape": "rect",
      "x": 384,
      "y": 88,
      "w": 128,
      "h": 56,
      "label": "专家 2",
      "color": "weight",
      "dashed": true
    },
    {
      "id": "e3",
      "shape": "rect",
      "x": 384,
      "y": 176,
      "w": 128,
      "h": 56,
      "label": "专家 3",
      "color": "weight",
      "emphasis": true
    },
    {
      "id": "e4",
      "shape": "rect",
      "x": 384,
      "y": 264,
      "w": 128,
      "h": 56,
      "label": "专家 4",
      "color": "weight",
      "dashed": true
    },
    {
      "id": "sum",
      "shape": "ellipse",
      "x": 560,
      "y": 128,
      "w": 120,
      "h": 72,
      "label": "加权求和",
      "color": "neutral"
    }
  ],
  "edges": [
    { "from": "tok", "to": "router" },
    { "from": "router", "to": "e1", "label": "0.6" },
    { "from": "router", "to": "e2", "dashed": true, "color": "muted" },
    { "from": "router", "to": "e3", "label": "0.4" },
    { "from": "router", "to": "e4", "dashed": true, "color": "muted" },
    { "from": "e1", "to": "sum" },
    { "from": "e3", "to": "sum" }
  ],
  "texts": [
    { "x": 0, "y": -48, "text": "MoE 路由（top-2）", "size": "title" },
    { "x": 0, "y": 352, "text": "注：实线专家被选中，虚线专家本次不参与计算", "size": "note" }
  ]
}
```

## 6. RAG 流水线

上排离线建库（文档 → 切块 → 向量化 → 向量库），下排在线问答（问题 → 向量化 → 检索 → 大模型 → 回答）。
注意避免“用户问题 → 大模型”的长直线穿过中间节点；需要表达时改用文字注释。

```json
{
  "style": "hand",
  "nodes": [
    {
      "id": "doc",
      "shape": "rect",
      "x": 0,
      "y": 0,
      "w": 112,
      "h": 56,
      "label": "文档",
      "color": "slate"
    },
    {
      "id": "chunk",
      "shape": "rect",
      "x": 160,
      "y": 0,
      "w": 112,
      "h": 56,
      "label": "切块",
      "color": "slate"
    },
    {
      "id": "embed",
      "shape": "rect",
      "x": 320,
      "y": 0,
      "w": 112,
      "h": 56,
      "label": "向量化",
      "color": "neutral"
    },
    {
      "id": "db",
      "shape": "rect",
      "x": 480,
      "y": 0,
      "w": 128,
      "h": 56,
      "label": "向量库",
      "color": "neutral",
      "emphasis": true
    },
    {
      "id": "query",
      "shape": "rect",
      "x": 0,
      "y": 152,
      "w": 112,
      "h": 56,
      "label": "用户问题",
      "color": "q"
    },
    {
      "id": "qembed",
      "shape": "rect",
      "x": 160,
      "y": 152,
      "w": 112,
      "h": 56,
      "label": "向量化",
      "color": "neutral"
    },
    {
      "id": "retrieve",
      "shape": "ellipse",
      "x": 320,
      "y": 152,
      "w": 144,
      "h": 56,
      "label": "相似度检索",
      "color": "activation"
    },
    {
      "id": "llm",
      "shape": "rect",
      "x": 560,
      "y": 152,
      "w": 112,
      "h": 56,
      "label": "大模型",
      "color": "neutral",
      "emphasis": true
    },
    {
      "id": "ans",
      "shape": "rect",
      "x": 560,
      "y": 264,
      "w": 112,
      "h": 48,
      "label": "回答",
      "color": "green"
    }
  ],
  "edges": [
    { "from": "doc", "to": "chunk" },
    { "from": "chunk", "to": "embed" },
    { "from": "embed", "to": "db" },
    { "from": "query", "to": "qembed" },
    { "from": "qembed", "to": "retrieve" },
    { "from": "db", "to": "retrieve", "label": "候选片段", "dashed": true },
    { "from": "retrieve", "to": "llm" },
    { "from": "llm", "to": "ans" }
  ],
  "texts": [
    { "x": 0, "y": -48, "text": "RAG 流水线", "size": "title" },
    { "x": 0, "y": 344, "text": "注：上排为离线建库，下排为在线问答", "size": "note" }
  ]
}
```

## 7. 训练循环

前向 → 损失 → 反向（玫红表示梯度）→ 优化器 → 更新权重，虚线箭头回到前向形成闭环。

```json
{
  "style": "hand",
  "nodes": [
    {
      "id": "data",
      "shape": "rect",
      "x": 0,
      "y": 96,
      "w": 112,
      "h": 56,
      "label": "数据批次",
      "color": "slate"
    },
    {
      "id": "fwd",
      "shape": "rect",
      "x": 208,
      "y": 96,
      "w": 128,
      "h": 56,
      "label": "前向传播",
      "color": "neutral"
    },
    {
      "id": "loss",
      "shape": "ellipse",
      "x": 400,
      "y": 96,
      "w": 112,
      "h": 56,
      "label": "损失",
      "color": "error"
    },
    {
      "id": "bwd",
      "shape": "rect",
      "x": 400,
      "y": 216,
      "w": 112,
      "h": 56,
      "label": "反向传播",
      "color": "grad"
    },
    {
      "id": "opt",
      "shape": "rect",
      "x": 208,
      "y": 216,
      "w": 128,
      "h": 56,
      "label": "优化器",
      "color": "neutral"
    },
    {
      "id": "w",
      "shape": "rect",
      "x": 0,
      "y": 216,
      "w": 112,
      "h": 56,
      "label": "权重 W",
      "color": "weight",
      "emphasis": true
    }
  ],
  "edges": [
    { "from": "data", "to": "fwd" },
    { "from": "fwd", "to": "loss" },
    { "from": "loss", "to": "bwd", "label": "梯度", "color": "grad" },
    { "from": "bwd", "to": "opt", "color": "grad" },
    { "from": "opt", "to": "w", "label": "更新" },
    { "from": "w", "to": "fwd", "dashed": true, "color": "weight", "label": "下一步" }
  ],
  "texts": [
    { "x": 0, "y": 0, "text": "训练循环", "size": "title" },
    { "x": 0, "y": 312, "text": "注：每个批次重复一遍，直到损失收敛", "size": "note" }
  ]
}
```

## 选型提示

| 想表达               | 推荐图式                                |
| -------------------- | --------------------------------------- |
| 一个算子内部的数据流 | 自注意力、矩阵乘法                      |
| 一层网络的结构堆叠   | Transformer Block（draw.io）            |
| 推理时的状态/缓存    | KV 缓存                                 |
| 条件分支、稀疏计算   | MoE 路由                                |
| 端到端系统流程       | RAG、训练循环（流程简单时优先 Mermaid） |
