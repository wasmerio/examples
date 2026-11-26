"""骨架 JSON → .excalidraw（diagrams.md §6.2）。

骨架只写 type、位置、尺寸、label、语义色名、箭头起止 id；完整元素（seed、boundElements、文本测量…）
由 Excalidraw 自己的 convertToExcalidrawElements 在 Playwright 中生成。随机数被种子化，同一骨架多次
转换得到相同结果。
"""
from __future__ import annotations

import json
import math
import re
from typing import Any

from .browser import BrowserSession
from .env import WispError
from .excalidraw import normalize_excalidraw
from .jsjson import js_number
from .palette import palette

SHAPE = {"rect": "rectangle", "ellipse": "ellipse", "diamond": "diamond"}
#: Excalidraw FONT_FAMILY.Excalifont
EXCALIFONT = 5
#: ROUNDNESS.ADAPTIVE_RADIUS
ADAPTIVE_RADIUS = 3
#: 箭头端点与节点边缘的间隙（px），与 Excalidraw 编辑器中绑定箭头的观感一致
ARROW_GAP = 6


def resolve_skeleton_color(name: str | None) -> dict[str, str]:
    """hue / 语义名 / 基础色 → 浅色 stroke + fill（导出时再由 to_portable_svg 变量化）。"""
    p = palette()["color"]
    if name == "neutral":
        return {"stroke": p["base"]["muted"]["light"], "fill": p["base"]["surface"]["light"]}
    if not name or name == "fg":
        return {"stroke": p["base"]["fg"]["light"], "fill": "transparent"}
    if name == "muted":
        return {"stroke": p["base"]["muted"]["light"], "fill": "transparent"}
    hue = name if name in p["hue"] else p["semantic"].get(name)
    h = p["hue"].get(hue) if isinstance(hue, str) else None
    if not isinstance(h, dict) or "stroke" not in h:
        valid = [*p["hue"].keys(), *[k for k in p["semantic"] if not k.startswith("$")], "neutral", "fg", "muted"]
        raise WispError(f'[wisp-diagram] 未知颜色名 "{name}"。可用：{", ".join(valid)}')
    return {"stroke": h["stroke"]["light"], "fill": h["fill"]["light"]}


def distance_to_edge(n: dict, ux: float, uy: float) -> float:
    """从节点中心沿方向 (ux, uy)（单位向量）到形状边缘的距离。"""
    hw, hh = n["w"] / 2, n["h"] / 2
    ax, ay = abs(ux), abs(uy)
    shape = n.get("shape") or "rect"
    if shape == "ellipse":
        return 1 / math.sqrt((ax / hw) ** 2 + (ay / hh) ** 2)
    if shape == "diamond":
        return 1 / (ax / hw + ay / hh)
    return min(hw / ax if ax > 1e-9 else math.inf, hh / ay if ay > 1e-9 else math.inf)


def _round2(v: float) -> float:
    return math.floor(v * 100 + 0.5) / 100


#: 两个节点在某一轴上的投影至少重叠这么多（px）时，箭头画成正对的水平 / 竖直线，而不是中心连线上的斜线
AXIS_SNAP_OVERLAP = 16


def _anchor(n: dict, tx: float, ty: float) -> tuple[float, float]:
    """节点 n 朝向点 (tx, ty) 的出线点：中心连线与形状边缘的交点再向外 ARROW_GAP。"""
    cx, cy = n["x"] + n["w"] / 2, n["y"] + n["h"] / 2
    ln = math.hypot(tx - cx, ty - cy)
    if ln < 1e-6:
        raise WispError(f"[wisp-diagram] 连线的拐点落在节点 {n['id']} 的中心")
    ux, uy = (tx - cx) / ln, (ty - cy) / ln
    s = distance_to_edge(n, ux, uy) + ARROW_GAP
    if s >= ln:
        raise WispError(f"[wisp-diagram] 连线的拐点离节点 {n['id']} 太近，放不下箭头")
    return cx + ux * s, cy + uy * s


def _axis_aligned(a: dict, b: dict) -> tuple[float, float, float, float] | None:
    """两节点正对（一条轴上投影重叠、另一条轴上分开）时，返回一条水平或竖直的线段。"""
    lo, hi = max(a["x"], b["x"]), min(a["x"] + a["w"], b["x"] + b["w"])
    if hi - lo >= AXIS_SNAP_OVERLAP:  # 上下排列：竖直线，落在重叠区间的中点
        x = (lo + hi) / 2
        if a["y"] + a["h"] + 2 * ARROW_GAP < b["y"]:
            return x, a["y"] + a["h"] + ARROW_GAP, x, b["y"] - ARROW_GAP
        if b["y"] + b["h"] + 2 * ARROW_GAP < a["y"]:
            return x, a["y"] - ARROW_GAP, x, b["y"] + b["h"] + ARROW_GAP
    lo, hi = max(a["y"], b["y"]), min(a["y"] + a["h"], b["y"] + b["h"])
    if hi - lo >= AXIS_SNAP_OVERLAP:  # 左右排列：水平线
        y = (lo + hi) / 2
        if a["x"] + a["w"] + 2 * ARROW_GAP < b["x"]:
            return a["x"] + a["w"] + ARROW_GAP, y, b["x"] - ARROW_GAP, y
        if b["x"] + b["w"] + 2 * ARROW_GAP < a["x"]:
            return a["x"] - ARROW_GAP, y, b["x"] + b["w"] + ARROW_GAP, y
    return None


def edge_geometry(a: dict, b: dict, via: list | None = None) -> dict[str, Any]:
    """两节点之间箭头的几何，端点都在形状边缘外 ARROW_GAP 处。

    - 给了 via（绝对坐标的拐点列表）：折线 a → 拐点… → b；
    - 两节点正对（矩形，投影重叠）：水平或竖直的直线；
    - 否则：中心连线上的斜线。
    返回 x / y（起点）、dx / dy（终点相对起点）和 points（相对起点的全部顶点）。"""
    if via:
        pts = [(float(p[0]), float(p[1])) for p in via]
        sx, sy = _anchor(a, *pts[0])
        ex, ey = _anchor(b, *pts[-1])
        chain = [(sx, sy), *pts, (ex, ey)]
    else:
        ax, ay = a["x"] + a["w"] / 2, a["y"] + a["h"] / 2
        bx, by = b["x"] + b["w"] / 2, b["y"] + b["h"] / 2
        ln = math.hypot(bx - ax, by - ay)
        if ln < 1e-6:
            raise WispError(f"[wisp-diagram] 连线 {a['id']} → {b['id']} 的两个节点中心重合")
        rect = (a.get("shape") or "rect") == "rect" and (b.get("shape") or "rect") == "rect"
        snapped = _axis_aligned(a, b) if rect else None
        if snapped:
            chain = [(snapped[0], snapped[1]), (snapped[2], snapped[3])]
        else:
            ux, uy = (bx - ax) / ln, (by - ay) / ln
            s = distance_to_edge(a, ux, uy) + ARROW_GAP
            t = distance_to_edge(b, -ux, -uy) + ARROW_GAP
            if s + t >= ln:
                raise WispError(f"[wisp-diagram] 节点 {a['id']} 与 {b['id']} 距离太近，放不下箭头")
            chain = [(ax + ux * s, ay + uy * s), (bx - ux * t, by - uy * t)]
    x, y = _round2(chain[0][0]), _round2(chain[0][1])
    points = [[_round2(px - x), _round2(py - y)] for px, py in chain]
    points[0] = [0, 0]
    return {"x": x, "y": y, "dx": points[-1][0], "dy": points[-1][1], "points": points}


def _is_num(v: Any) -> bool:
    return isinstance(v, (int, float)) and not isinstance(v, bool)


def skeleton_to_element_skeletons(sk: dict) -> tuple[list[dict], list[str]]:
    """骨架 → ExcalidrawElementSkeleton[]（纯函数）。"""
    d = palette()["diagram"]
    grid = d["grid-px"]
    warnings: list[str] = []
    common = {"roughness": d["excalidraw"]["roughness"], "fillStyle": d["excalidraw"]["fillStyle"]}

    def sw(emph: Any) -> float:
        return d["stroke-width"]["bold"] if emph else d["stroke-width"]["normal"]

    by_id: dict[str, dict] = {}
    out: list[dict] = []
    for n in sk.get("nodes") or []:
        if not n.get("id"):
            raise WispError("[wisp-diagram] 节点缺少 id")
        if n["id"] in by_id:
            raise WispError(f"[wisp-diagram] 节点 id 重复：{n['id']}")
        by_id[n["id"]] = n
        for k in ("x", "y", "w", "h"):
            if not _is_num(n.get(k)):
                raise WispError(f"[wisp-diagram] 节点 {n['id']} 缺少数值字段 {k}")
            if math.fmod(n[k], grid) != 0:
                warnings.append(f"节点 {n['id']} 的 {k}={js_number(n[k])} 不在 {js_number(grid)}px 网格上")
        # 没写 color 的节点是中性节点：surface 底、muted 细线（强调时 fg、常规线宽）
        neutral = (n.get("color") or "neutral") == "neutral"
        c = resolve_skeleton_color(n.get("color") or "neutral")
        if neutral and n.get("emphasis"):
            c = {**c, "stroke": resolve_skeleton_color("fg")["stroke"]}
        width = (d["stroke-width"]["normal"] if n.get("emphasis") else d["stroke-width"]["thin"]) if neutral else sw(n.get("emphasis"))
        shape = SHAPE.get(n.get("shape") or "rect")
        if not shape:
            raise WispError(f"[wisp-diagram] 节点 {n['id']} 的 shape 无效：{n.get('shape')}")
        el: dict[str, Any] = {
            "type": shape, "id": n["id"], "x": n["x"], "y": n["y"], "width": n["w"], "height": n["h"],
            "strokeColor": c["stroke"], "backgroundColor": c["fill"], "strokeWidth": width,
            "strokeStyle": "dashed" if n.get("dashed") else d["excalidraw"]["strokeStyle"], **common,
        }
        if shape in ("rectangle", "diamond"):
            el["roundness"] = {"type": ADAPTIVE_RADIUS, "value": d["corner-radius"]}
        if n.get("label"):
            el["label"] = {
                "text": n["label"], "fontSize": d["font-size-px"][n.get("size") or "label"], "fontFamily": EXCALIFONT,
                # 节点里的字一律 fg（颜色由描边和底色表达）；labelColor 可以覆盖
                "strokeColor": resolve_skeleton_color(n.get("labelColor") or "fg")["stroke"],
                "textAlign": "center", "verticalAlign": "middle",
            }
        out.append(el)

    for i, e in enumerate(sk.get("edges") or []):
        a = by_id.get(e.get("from"))
        b = by_id.get(e.get("to"))
        if not a or not b:
            raise WispError(f"[wisp-diagram] 连线 {e.get('from')} → {e.get('to')} 引用了不存在的节点")
        c = resolve_skeleton_color(e.get("color") or "fg")
        via = e.get("via")
        if via is not None and not (isinstance(via, list) and via and all(
                isinstance(p, list) and len(p) == 2 and _is_num(p[0]) and _is_num(p[1]) for p in via)):
            raise WispError(f"[wisp-diagram] 连线 {e['from']} → {e['to']} 的 via 应为 [[x, y], …]")
        g = edge_geometry(a, b, via)
        xs = [p[0] for p in g["points"]]
        ys = [p[1] for p in g["points"]]
        el = {
            "type": "arrow", "id": e.get("id") or f"edge-{i + 1}-{e['from']}-{e['to']}",
            "x": g["x"], "y": g["y"], "width": max(xs) - min(xs), "height": max(ys) - min(ys), "points": g["points"],
            "strokeColor": c["stroke"], "backgroundColor": "transparent", "strokeWidth": sw(e.get("emphasis")),
            "strokeStyle": "dashed" if e.get("dashed") else d["excalidraw"]["strokeStyle"], **common,
            "roundness": None,
            "start": {"id": e["from"]}, "end": {"id": e["to"]},
            "startArrowhead": "arrow" if e.get("arrow") == "both" else None,
            "endArrowhead": None if e.get("arrow") == "none" else "arrow",
        }
        if e.get("label"):
            el["label"] = {"text": e["label"], "fontSize": d["font-size-px"]["note"], "fontFamily": EXCALIFONT, "strokeColor": c["stroke"]}
        out.append(el)

    for i, t in enumerate(sk.get("texts") or []):
        size = t.get("size") or "label"
        color = t.get("color") or ("muted" if size == "note" else "fg")
        out.append({
            "type": "text", "id": t.get("id") or f"text-{i + 1}", "x": t["x"], "y": t["y"], "text": t["text"],
            "fontSize": d["font-size-px"][size], "fontFamily": EXCALIFONT,
            "strokeColor": resolve_skeleton_color(color)["stroke"], **common,
        })
    return out, warnings


def skeleton_to_excalidraw(session: BrowserSession, sk: dict, seed: int = 1) -> tuple[str, list[str]]:
    """骨架 → 完整 .excalidraw 文档（字符串，已规范化）。"""
    from .excalidraw_export import convert_skeleton_in_browser

    if sk.get("style") and sk["style"] != "hand":
        raise WispError("[wisp-diagram] 骨架只支持 hand 风格（clean 风格请直接写 draw.io XML）")
    skel, warnings = skeleton_to_element_skeletons(sk)
    elements = json.loads(convert_skeleton_in_browser(session, skel, seed))
    for el in elements:
        el["updated"] = 1  # 去掉时间戳，保证可复现
    doc = {
        "type": "excalidraw", "version": 2, "source": "wisp-diagram", "elements": elements,
        "appState": {"gridSize": palette()["diagram"]["grid-px"], "viewBackgroundColor": "#ffffff"}, "files": {},
    }
    return normalize_excalidraw(doc), warnings


def default_skeleton_output(inp: str) -> str:
    return re.sub(r"(\.skeleton)?\.json$", "", inp, flags=re.I) + ".excalidraw"
