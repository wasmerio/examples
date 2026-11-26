"""导出 PNG（公众号、知乎等不支持 SVG 的平台；也用于 Agent 自检预览）。

渲染方式：把 SVG 内联进 Playwright 页面，用 color_scheme 触发 SVG 内置的 prefers-color-scheme 分支，
所以 PNG 与“作为 <img> 时随系统主题切换”的效果一致。默认嵌入字体子集（与运行环境装了哪些字体无关）；
背景取调色板 base.bg 的对应主题值。
"""
from __future__ import annotations

import os
import re
from dataclasses import dataclass
from pathlib import Path

from .browser import BrowserSession
from .env import WispError
from .palette import palette


def theme_background(theme: str) -> str:
    return palette()["color"]["base"]["bg"][theme]


def svg_to_png(session: BrowserSession, svg: str, *, theme: str = "light", scale: float = 2,
               transparent: bool = False, embed_fonts: bool = True) -> bytes:
    content = svg
    if embed_fonts and "data-wisp-fonts" not in content:
        from .fonts import embed_fonts as _embed
        content = _embed(content).svg
    bg = "transparent" if transparent else theme_background(theme)
    content = re.sub(r"<\?xml[^>]*>", "", content, count=1)
    html = f"""<!doctype html><html><head><meta charset="utf-8"><style>
      html,body{{margin:0;padding:0;background:{bg}}}
      #wrap{{display:inline-block;padding:16px;background:{bg}}}
      #wrap>svg{{display:block}}
    </style></head><body><div id="wrap">{content}</div></body></html>"""
    wp = session.open_page(html=html, color_scheme=theme, device_scale_factor=scale)
    try:
        wp.page.emulate_media(color_scheme=theme)
        wp.page.evaluate("() => document.fonts.ready.then(() => undefined)")
        el = wp.page.query_selector("#wrap")
        if not el:
            raise WispError("[wisp-diagram] 渲染失败：找不到 SVG")
        return el.screenshot(omit_background=transparent, type="png")
    finally:
        wp.close()


@dataclass
class PngResult:
    path: str
    bytes: int


def export_png(session: BrowserSession, file: str, out: str | None = None, *, theme: str = "light",
               scale: float = 2, transparent: bool = False, embed_fonts: bool = True,
               drawio: str | None = None) -> list[PngResult]:
    """文件 → PNG。输入为源文件时先在内存中构建（不写 .wisp.svg）。"""
    abs_ = os.path.abspath(file)
    if re.search(r"\.(excalidraw|drawio)$", abs_, re.I):
        from .build import build_diagram
        r = build_diagram(abs_, session=session, write=False, embed_fonts=embed_fonts, drawio=drawio)
        svgs = [(re.sub(r"\.wisp\.svg$", "", os.path.basename(o.path)), o.svg) for o in r.outputs]
    else:
        svgs = [(re.sub(r"(\.wisp)?\.svg$", "", os.path.basename(abs_), flags=re.I), Path(abs_).read_text("utf-8"))]
    results = []
    for i, (name, svg) in enumerate(svgs):
        png = svg_to_png(session, svg, theme=theme, scale=scale, transparent=transparent, embed_fonts=embed_fonts)
        if out and len(svgs) == 1:
            dest = os.path.abspath(out)
        elif out:
            dest = re.sub(r"\.png$", "", os.path.abspath(out), flags=re.I) + ("" if i == 0 else f".{i + 1}") + ".png"
        else:
            dest = os.path.join(os.path.dirname(abs_), f"{name}.{theme}.png")
        Path(dest).parent.mkdir(parents=True, exist_ok=True)
        Path(dest).write_bytes(png)
        results.append(PngResult(dest, len(png)))
    return results
