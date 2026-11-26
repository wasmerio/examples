"""Excalidraw 导出：在 Playwright 页面里加载 @excalidraw/excalidraw@0.18.1，调用 exportToSvg /
convertToExcalidrawElements。

模块来源（按优先级）：
1. $WISP_EXCALIDRAW_BUNDLE=<本地 JS>：可以是定义了 window.__wisp 的 IIFE（如 T5b 用 esbuild 打的包），
   也可以是导出 exportToSvg 等函数的 ES 模块；
2. 默认：jsDelivr 上的 dist/prod/index.js + import map（依赖用 jsDelivr 的 +esm 构建，版本见 versions.py），
   首次运行下载约 110 个文件（≈1.6 MB）到 ~/.cache/wisp-diagram/cdn/，之后离线可用。

字体：注册 Excalifont、Inter、Noto Sans SC，并把 Noto Sans SC 另注册为 "Xiaolai"（Excalidraw 内置的 CJK
回退族），中文按 Noto SC 测量——与站点最终渲染一致（diagrams.md §3.4）。
"""
from __future__ import annotations

import json
import os
from pathlib import Path

from .browser import ORIGIN, BrowserSession, WispPage
from .env import WispError, log, offline
from .fonts import font_face_css
from .versions import EXCALIDRAW, EXCALIDRAW_DIST, excalidraw_import_map
from . import cdn


def determinism_script(seed: int) -> str:
    """页面级随机源固定：Math.random / crypto.getRandomValues 用种子化 PRNG；Excalidraw 内部的 Random
    在模块加载时以 Date.now() 为种子，所以加载期间冻结 Date.now。与 TS 版逐字相同。"""
    s = int(seed) & 0xFFFFFFFF
    if s >= 2**31:
        s -= 2**32
    return f"""
(() => {{
  let s = {s};
  const rnd = () => {{ s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }};
  Math.random = rnd;
  const orig = crypto.getRandomValues.bind(crypto);
  crypto.getRandomValues = (arr) => {{ if (!arr || !arr.length) return orig(arr);
    for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(rnd() * 256); return arr; }};
  const realNow = Date.now;
  Date.now = () => {1_700_000_000_000 + s};
  window.__wispUnfreeze = () => {{ Date.now = realNow; }};
}})();
"""


def _font_url(s) -> str:
    return ORIGIN + s.path


def bundle_override() -> Path | None:
    v = os.environ.get("WISP_EXCALIDRAW_BUNDLE")
    if not v:
        return None
    p = Path(v).expanduser()
    if not p.is_file():
        raise WispError(f"[wisp-diagram] WISP_EXCALIDRAW_BUNDLE 指向的文件不存在：{v}")
    return p


ENTRY_URL = ORIGIN + EXCALIDRAW_DIST + "index.js"


def excalidraw_status() -> tuple[bool, str]:
    b = os.environ.get("WISP_EXCALIDRAW_BUNDLE")
    if b:
        return (Path(b).is_file(), f"WISP_EXCALIDRAW_BUNDLE：{b}" + ("" if Path(b).is_file() else "（文件不存在）"))
    url = cdn.jsdelivr(EXCALIDRAW_DIST + "index.js")
    if cdn.is_cached(url):
        return True, f"@excalidraw/excalidraw@{EXCALIDRAW}（已缓存）"
    from .env import offline
    if offline():
        return False, f"离线模式且没有缓存 @excalidraw/excalidraw@{EXCALIDRAW}"
    return True, f"@excalidraw/excalidraw@{EXCALIDRAW}（首次使用时从 jsDelivr 下载并缓存）"


def prefetch_excalidraw() -> int:
    """并行预取 Excalidraw 的模块图与 Excalifont（首次运行 / cache warm）。"""
    from .browser import dedupe_js
    from .fonts import shards_for

    imap = {k: v[len(ORIGIN):] for k, v in excalidraw_import_map(ORIGIN)["imports"].items()}
    n = cdn.prefetch_module_graph([EXCALIDRAW_DIST + "index.js"], imap, rewrite=dedupe_js)
    n += cdn.prefetch_module_graph([s.path for s in shards_for("Excalifont")], {})
    return n


def open_excalidraw_page(session: BrowserSession, seed: int = 1) -> WispPage:
    css = font_face_css(["Excalifont", "Inter", "Noto Sans SC"], _font_url, {"Noto Sans SC": ["Xiaolai"]})
    bundle = bundle_override()
    importmap = "" if bundle else f'<script type="importmap">{json.dumps(excalidraw_import_map(ORIGIN))}</script>'
    html = f'<!doctype html><html><head><meta charset="utf-8"><style>{css}</style>{importmap}</head><body></body></html>'
    files = {}
    if bundle:
        files["/bundle/" + bundle.name] = bundle.read_bytes()
    entry_cached = cdn.is_cached(cdn.jsdelivr(EXCALIDRAW_DIST + "index.js"))
    if not bundle and not entry_cached and not offline():
        log(f"首次使用：下载 @excalidraw/excalidraw@{EXCALIDRAW} 及其依赖（约 110 个文件 / 1.6 MB，缓存后离线可用）…")
        prefetch_excalidraw()
    wp = session.open_page(
        html=html, files=files,
        init_script=f"window.EXCALIDRAW_ASSET_PATH={json.dumps(ORIGIN + EXCALIDRAW_DIST)};{determinism_script(seed)}",
    )
    try:
        if bundle and b"window.__wisp" in files["/bundle/" + bundle.name]:
            wp.page.add_script_tag(url=f"{ORIGIN}/bundle/{bundle.name}")
            ok = wp.page.evaluate("() => { window.__wispUnfreeze?.(); return typeof window.__wisp === 'object'; }")
        else:
            url = f"{ORIGIN}/bundle/{bundle.name}" if bundle else ENTRY_URL
            ok = wp.page.evaluate(
                """async (url) => {
                    const m = await import(url);
                    window.__wisp = { exportToSvg: m.exportToSvg, convertToExcalidrawElements: m.convertToExcalidrawElements,
                                      restore: m.restore, FONT_FAMILY: m.FONT_FAMILY };
                    window.__wispUnfreeze?.();
                    return typeof m.exportToSvg === 'function' && typeof m.convertToExcalidrawElements === 'function';
                }""",
                url,
            )
    except Exception as e:
        errs = wp.failures()
        wp.close()
        raise WispError(f"[wisp-diagram] Excalidraw 加载失败：{str(e).splitlines()[0]}{('；' + errs) if errs else ''}") from e
    if not ok:
        errs = wp.failures()
        wp.close()
        raise WispError(f"[wisp-diagram] Excalidraw 加载失败：{errs}")
    return wp


def export_excalidraw_svg(session: BrowserSession, scene_json: str, padding: int = 8) -> str:
    """.excalidraw 场景 JSON → Excalidraw 原生 SVG 字符串（未做可移植处理）。"""
    wp = session.cached("excalidraw", lambda: open_excalidraw_page(session))
    try:
        return _export(wp, scene_json, padding)
    except Exception as e:
        extra = wp.failures()
        raise WispError(f"[wisp-diagram] Excalidraw 导出失败：{str(e).splitlines()[0]}" + (f"\n{extra}" if extra else "")) from e


def _export(wp: WispPage, scene_json: str, padding: int) -> str:
    return wp.page.evaluate(
        """async ({ sceneJson, padding }) => {
            const w = window.__wisp;
            const data = JSON.parse(sceneJson);
            const restored = w.restore(data, null, null);
            const elements = restored.elements.filter((e) => !e.isDeleted);
            const svg = await w.exportToSvg({
              elements,
              appState: { ...restored.appState, exportBackground: false, exportWithDarkMode: false, exportEmbedScene: false },
              files: restored.files ?? data.files ?? {},
              exportPadding: padding,
              skipInliningFonts: true,
            });
            return new XMLSerializer().serializeToString(svg);
        }""",
        {"sceneJson": scene_json, "padding": padding},
    )


def convert_skeleton_in_browser(session: BrowserSession, skeleton: list, seed: int = 1) -> list:
    """ExcalidrawElementSkeleton[] → 完整元素（每次新页面，结果只取决于骨架和 seed）。"""
    wp = open_excalidraw_page(session, seed)
    try:
        return wp.page.evaluate(
            """async ({ skeleton }) => {
                const w = window;
                const text = JSON.stringify(skeleton).replace(/[{}[\\]":,]/g, ' ');
                await Promise.all(['Excalifont', 'Xiaolai', 'Inter', 'Noto Sans SC'].map((f) => document.fonts.load(`16px "${f}"`, text)));
                await document.fonts.ready;
                return JSON.stringify(w.__wisp.convertToExcalidrawElements(skeleton, { regenerateIds: false }));
            }""",
            {"skeleton": skeleton},
        )
    except Exception as e:
        if isinstance(e, WispError):
            raise
        extra = wp.failures()
        raise WispError(f"[wisp-diagram] 骨架转换失败：{str(e).splitlines()[0]}" + (f"\n{extra}" if extra else "")) from e
    finally:
        wp.close()
