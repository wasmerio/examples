"""源文件 → 可移植 .wisp.svg（导出 + 颜色映射 + svgo + a11y [+ 字体子集]）。

输出命名：<name>.wisp.svg；多页 draw.io 的第 2 页起为 <name>.page-<N>.wisp.svg（N 从 1 计），
每个文件根元素带 data-page="<页面名>"。
"""
from __future__ import annotations

import json
import os
import re
from dataclasses import dataclass, field
from pathlib import Path

from .browser import BrowserSession
from .drawio import normalize_drawio
from .env import WispError
from .postprocess import postprocess, sanitize_id_prefix


@dataclass
class BuildOutput:
    path: str
    svg: str
    page: tuple[int, str] | None = None  # (index, name)


@dataclass
class BuildResult:
    source: str
    style: str
    exporter: str
    outputs: list[BuildOutput] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    unknown_colors: list[str] = field(default_factory=list)


def style_of(file: str) -> str:
    ext = os.path.splitext(file)[1].lower()
    if ext == ".excalidraw":
        return "hand"
    if ext == ".drawio":
        return "clean"
    raise WispError(f"[wisp-diagram] 不支持的源文件类型：{file}（只支持 .excalidraw / .drawio）")


def stem(file: str) -> str:
    return re.sub(r"\.(excalidraw|drawio)$", "", os.path.basename(file), flags=re.I)


def output_path_for(file: str, page_index: int = 0, out_dir: str | None = None) -> str:
    """源文件对应的输出路径。page_index 从 0 计；0 即 <name>.wisp.svg。"""
    d = out_dir if out_dir is not None else os.path.dirname(file)
    name = f"{stem(file)}.wisp.svg" if page_index == 0 else f"{stem(file)}.page-{page_index + 1}.wisp.svg"
    return os.path.join(d, name)


def _humanize(s: str) -> str:
    return re.sub(r"[-_]+", " ", s).strip()


def _clip(s: str, n: int = 300) -> str:
    """按 UTF-16 码元长度截断（与 JS 的 s.length / s.slice 一致）。"""
    u = s.encode("utf-16-le", "surrogatepass")
    if len(u) // 2 <= n:
        return s
    return u[: (n - 1) * 2].decode("utf-16-le", "ignore") + "…"


def _num(v) -> float:
    return v if isinstance(v, (int, float)) and not isinstance(v, bool) else 0


def excalidraw_title_desc(scene: dict, file: str) -> tuple[str, str]:
    """默认标题：最大字号的独立文本（≥18px），否则文件名；描述：其余文字按出现位置拼接。"""
    texts = [e for e in scene.get("elements") or []
             if isinstance(e, dict) and e.get("type") == "text" and not e.get("isDeleted")
             and isinstance(e.get("text"), str) and e["text"].strip()]
    free = sorted([e for e in texts if not e.get("containerId")], key=lambda e: -_num(e.get("fontSize")))
    title_el = free[0] if free and _num(free[0].get("fontSize")) >= 18 else None
    rest = sorted([e for e in texts if e is not title_el], key=lambda e: (_num(e.get("y")), _num(e.get("x"))))
    rest_txt = [re.sub(r"\s+", " ", e["text"]).strip() for e in rest]
    title = re.sub(r"\s+", " ", title_el["text"]).strip() if title_el else _humanize(stem(file))
    return title, _clip("；".join(dict.fromkeys(rest_txt)))


def build_diagram(file: str, *, session: BrowserSession, embed_fonts: bool = False, fix: bool = False,
                  title: str | None = None, desc: str | None = None, drawio: str | None = None,
                  out_dir: str | None = None, write: bool = True) -> BuildResult:
    from .drawio_export import drawio_page_labels, export_drawio_svgs
    from .excalidraw_export import export_excalidraw_svg

    abs_ = os.path.abspath(file)
    style = style_of(abs_)
    prefix = sanitize_id_prefix(stem(abs_))
    source = os.path.basename(abs_)
    res = BuildResult(abs_, style, "excalidraw-playwright")
    unknown: set[str] = set()
    raw = Path(abs_).read_text("utf-8")
    if style == "hand":
        scene = json.loads(raw)
        t, d = excalidraw_title_desc(scene, abs_)
        svg_raw = export_excalidraw_svg(session, raw)
        r = postprocess(session, svg_raw, style=style, source=source, id_prefix=prefix,
                        title=title if title is not None else t, desc=desc if desc is not None else d,
                        embed_fonts=embed_fonts, fix=fix)
        res.warnings += r.warnings
        unknown.update(r.unknown_colors)
        res.outputs.append(BuildOutput(output_path_for(abs_, 0, out_dir), r.svg))
    else:
        xml = normalize_drawio(raw)
        method, pages = export_drawio_svgs(session, xml, method=drawio)
        res.exporter = f"drawio-{method}"
        multi = len(pages) > 1
        for p in pages:
            default_name = re.match(r"^Page-\d+$", p.name) is not None
            t = title if title is not None else (
                _humanize(stem(abs_)) + (f" · {p.name}" if multi else "") if default_name else p.name)
            d = desc if desc is not None else _clip("；".join(dict.fromkeys(drawio_page_labels(xml, p.index))))
            r = postprocess(session, p.svg, style=style, source=source,
                            id_prefix=prefix if p.index == 0 else f"{prefix}-p{p.index + 1}",
                            title=t, desc=d, page=p.name, embed_fonts=embed_fonts, fix=fix)
            res.warnings += [f"[{p.name}] {w}" for w in r.warnings]
            unknown.update(r.unknown_colors)
            res.outputs.append(BuildOutput(output_path_for(abs_, p.index, out_dir), r.svg, (p.index, p.name)))
    if write:
        for o in res.outputs:
            Path(o.path).parent.mkdir(parents=True, exist_ok=True)
            Path(o.path).write_text(o.svg, "utf-8", newline="\n")
    res.unknown_colors = sorted(unknown)
    return res
