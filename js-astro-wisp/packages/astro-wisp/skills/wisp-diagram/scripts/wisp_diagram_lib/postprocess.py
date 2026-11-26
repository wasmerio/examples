"""SVG 后处理串联（diagrams.md §3）：
  导出器原始 SVG → 预清理 → to_portable_svg（颜色变量化 + 作用域 style + 字体变量）
  → svgo（在 Chromium 中运行 svgo 4.1.0 的浏览器构建；保留 viewBox / style / var()，id 加文件名前缀）
  → a11y 注入 → 可选字体子集嵌入

svgo 用与 TS 版完全相同的版本和配置，所以输出与 T5b 逐字节一致。
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field

from .browser import ORIGIN, BrowserSession, WispPage
from .env import WispError
from .portable_svg import to_portable_svg
from .versions import SVGO_BROWSER


def escape_xml(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def sanitize_id_prefix(name: str) -> str:
    """id 前缀：只保留字母数字和连字符，首字符必须是字母。"""
    s = re.sub(r"[^a-z0-9-]+", "-", name.lower())
    s = re.sub(r"^-+|-+$", "", s) or "diagram"
    return s if re.match(r"^[a-z]", s) else f"d-{s}"


def preclean(svg: str) -> str:
    """导出器自带、与 Wisp 无关的内容。"""
    s = re.sub(r"<\?xml[^>]*>\s*", "", svg)
    s = re.sub(r"<!DOCTYPE[^>]*>\s*", "", s, flags=re.I)
    s = re.sub(r"<!--[\s\S]*?-->", "", s)
    s = re.sub(r"<metadata\b[\s\S]*?</metadata>|<metadata\b[^>]*/>", "", s)
    s = re.sub(r'<style\b[^>]*class="style-fonts"[^>]*>\s*</style>', "", s)
    s = re.sub(r"<defs>\s*</defs>|<defs/>", "", s)
    s = re.sub(r"<(title|desc)\b[\s\S]*?</\1>", "", s)
    return s


#: 与 TS 版 svgoConfig() 相同（在浏览器里按 prefix 生成）
SVGO_CONFIG_JS = """(prefix) => ({
  multipass: false,
  js2svg: { pretty: false },
  plugins: [
    { name: 'preset-default', params: { overrides: {
      cleanupIds: false, inlineStyles: false, minifyStyles: false, mergeStyles: false, convertColors: false,
      removeUnknownsAndDefaults: false, removeUselessStrokeAndFill: false, removeDesc: false, removeHiddenElems: false,
    } } },
    { name: 'prefixIds', params: { prefix, delim: '-', prefixIds: true, prefixClassNames: false } },
  ],
})"""


def _svgo_page(session: BrowserSession) -> WispPage:
    def make() -> WispPage:
        wp = session.open_page()
        try:
            ok = _load_svgo(wp)
        except Exception as e:
            raise WispError(f"[wisp-diagram] svgo 加载失败：{str(e).splitlines()[0]}；{wp.failures()}") from e
        if not ok:
            raise WispError(f"[wisp-diagram] svgo 加载失败：{wp.failures()}")
        return wp

    return session.cached("svgo", make)


def _load_svgo(wp: WispPage) -> bool:
    return wp.page.evaluate(
            """async ([url, cfg]) => {
                const m = await import(url);
                const mk = eval(cfg);
                window.__wispSvgo = (svg, prefix) => m.optimize(svg, mk(prefix)).data;
                return typeof m.optimize === 'function';
            }""",
            [ORIGIN + SVGO_BROWSER, SVGO_CONFIG_JS],
        )


def svgo_optimize(session: BrowserSession, svg: str, id_prefix: str) -> str:
    wp = _svgo_page(session)
    try:
        return wp.page.evaluate("([svg, prefix]) => window.__wispSvgo(svg, prefix)", [svg, id_prefix])
    except Exception as e:
        raise WispError(f"[wisp-diagram] svgo 处理失败：{str(e).splitlines()[0]}") from e


def _root_attr(svg: str, name: str) -> str | None:
    m = re.search(r"<svg\b[^>]*>", svg)
    open_tag = m.group(0) if m else ""
    mm = re.search(rf'\s{name}="([^"]*)"', open_tag)
    return mm.group(1) if mm else None


def _fmt2(v: float) -> str:
    """JS 的 `+v.toFixed(2)` 再转字符串。"""
    from .color import to_fixed
    from .jsjson import js_number
    return js_number(float(to_fixed(v, 2)))


def inject_a11y(svg: str, *, style: str, source: str, id_prefix: str, title: str, desc: str | None = None,
                page: str | None = None) -> str:
    """注入 role / aria / data-* / <title> / <desc>，并保证有 width/height（取自 viewBox）。"""
    tid = f"{id_prefix}-title"
    did = f"{id_prefix}-desc"
    has_desc = bool(desc and desc.strip())
    vb_raw = _root_attr(svg, "viewBox")
    vb = None
    if vb_raw is not None:
        vb = []
        for part in re.split(r"[\s,]+", vb_raw.strip()):
            try:
                vb.append(float(part) if part else 0.0)
            except ValueError:
                vb.append(float("nan"))

    def repl(m: re.Match) -> str:
        a = re.sub(r'\s(role|aria-labelledby|aria-label|aria-describedby|data-wisp-diagram|data-source|data-style|data-page)="[^"]*"', "", m.group(1))
        if vb and len(vb) == 4 and all(v == v and abs(v) != float("inf") for v in vb):
            a = re.sub(r'\s(width|height)="[^"]*"', "", a)
            a += f' width="{_fmt2(vb[2])}" height="{_fmt2(vb[3])}"'
        a += f' role="img" aria-labelledby="{f"{tid} {did}" if has_desc else tid}"'
        a += f' data-wisp-diagram="1" data-source="{escape_xml(source)}" data-style="{style}"'
        if page is not None:
            a += f' data-page="{escape_xml(page)}"'
        head = f'<title id="{tid}">{escape_xml(title)}</title>' + (f'<desc id="{did}">{escape_xml(desc.strip())}</desc>' if has_desc else "")  # type: ignore[union-attr]
        return f"<svg{a}>{head}"

    return re.sub(r"<svg\b([^>]*)>", repl, svg, count=1)


def protect_masks(svg: str):
    """<mask> 里的黑白是亮度通道，不是“颜色”：映射成主题变量会让暗色下遮罩反转。先摘出来，映射后再放回。"""
    saved: list[str] = []

    def repl(m: re.Match) -> str:
        saved.append(m.group(0))
        return f'<wisp-protect n="{len(saved) - 1}"/>'

    out = re.sub(r"<mask\b[^>]*/>|<mask\b[^>]*>[\s\S]*?</mask>", repl, svg)

    def restore(s: str) -> str:
        return re.sub(r'<wisp-protect n="(\d+)"\s*/>', lambda m: saved[int(m.group(1))], s)

    return out, restore


#: 箭头标签的遮罩（Excalidraw 导出时按文字的精确外框挖空线条）四周多留的空隙，px
LABEL_MASK_PAD = 4
_NUM = r"(-?\d*\.?\d+)"
_MASK_RECT_RE = re.compile(rf'(<path fill="#000" d=")M{_NUM}[ ,]?{_NUM}h{_NUM}v{_NUM}h-{_NUM}z(")')


def pad_label_masks(svg: str, pad: float = LABEL_MASK_PAD) -> str:
    """把连线标签遮罩的黑色矩形向四周各扩 pad：线条在文字前后留出空隙，而不是贴着字的边。"""
    def num(v: float) -> str:
        return f"{v:.2f}".rstrip("0").rstrip(".")

    def rect(m: re.Match) -> str:
        x, y, w, h = (float(m.group(i)) for i in (2, 3, 4, 5))
        return f"{m.group(1)}M{num(x - pad)} {num(y - pad)}h{num(w + 2 * pad)}v{num(h + 2 * pad)}h-{num(w + 2 * pad)}z{m.group(7)}"

    return re.sub(r"<mask\b[^>]*>[\s\S]*?</mask>", lambda m: _MASK_RECT_RE.sub(rect, m.group(0)), svg)


@dataclass
class PostprocessResult:
    svg: str
    warnings: list[str] = field(default_factory=list)
    unknown_colors: list[str] = field(default_factory=list)
    font_bytes: int = 0


def postprocess(session: BrowserSession, raw: str, *, style: str, source: str, id_prefix: str, title: str,
                desc: str | None = None, page: str | None = None, embed_fonts: bool = False,
                fix: bool = False) -> PostprocessResult:
    masked, restore = protect_masks(preclean(raw))
    portable = to_portable_svg(masked, style=style, fix=fix)
    svg = restore(portable.svg)
    svg = svgo_optimize(session, svg, id_prefix)
    svg = pad_label_masks(svg)
    svg = inject_a11y(svg, style=style, source=source, id_prefix=id_prefix, title=title, desc=desc, page=page)
    font_bytes = 0
    if embed_fonts:
        from .fonts import embed_fonts as _embed
        r = _embed(svg)
        svg = r.svg
        font_bytes = r.bytes
    if not svg.endswith("\n"):
        svg += "\n"
    return PostprocessResult(svg, list(portable.warnings), portable.unknown_colors, font_bytes)
