"""锁定的第三方前端资源版本（全部从 jsDelivr 的 npm 镜像获取并缓存）。

与 T5b 的 TS 实现所用 node_modules 版本一致，保证导出结果逐字节一致：
@excalidraw/excalidraw 0.18.1、svgo 4.1.0、@fontsource-variable/inter 5.3.0、
@fontsource-variable/noto-sans-sc 5.3.1、react / react-dom 19.3.1。
"""
from __future__ import annotations

JSDELIVR = "https://cdn.jsdelivr.net"

EXCALIDRAW = "0.18.1"
SVGO = "4.1.0"
INTER = "5.3.0"
NOTO_SC = "5.3.1"
REACT = "19.3.1"

#: @excalidraw/excalidraw@0.18.1 dist/prod 的裸模块依赖 → 精确版本（取自其 package.json）
EXCALIDRAW_DEPS = {
    "@braintree/sanitize-url": "6.0.2",
    "@excalidraw/laser-pointer": "1.3.1",
    "@excalidraw/mermaid-to-excalidraw": "2.2.2",
    "@radix-ui/react-popover": "1.1.6",
    "@radix-ui/react-tabs": "1.0.2",
    "browser-fs-access": "0.29.1",
    "canvas-roundrect-polyfill": "0.0.1",
    "clsx": "1.1.1",
    "es6-promise-pool": "2.5.0",
    "fractional-indexing": "3.2.0",
    "fuzzy": "0.1.3",
    "image-blob-reduce": "3.0.1",
    "jotai": "2.11.0",
    "jotai-scope": "0.7.2",
    "lodash.debounce": "4.0.8",
    "lodash.throttle": "4.1.1",
    "nanoid": "3.3.3",
    "open-color": "1.9.1",
    "pako": "2.0.3",
    "perfect-freehand": "1.2.0",
    "pica": "7.1.1",
    "png-chunk-text": "1.0.0",
    "png-chunks-encode": "1.0.0",
    "png-chunks-extract": "1.0.0",
    "points-on-curve": "1.0.1",
    "tunnel-rat": "0.1.2",
    "react": REACT,
    "react-dom": REACT,
}
ROUGHJS = "4.6.4"


def npm_path(pkg: str, version: str, path: str = "") -> str:
    """jsDelivr 上的路径（不含域名），如 /npm/svgo@4.1.0/dist/svgo.browser.js"""
    return f"/npm/{pkg}@{version}" + (f"/{path.lstrip('/')}" if path else "")


def excalidraw_import_map(base: str) -> dict:
    """浏览器 import map：excalidraw 的裸模块名 → jsDelivr 的 +esm 构建。base 为虚拟源（如 http://wisp.local）。"""
    imports = {k: base + npm_path(k, v, "+esm") for k, v in EXCALIDRAW_DEPS.items()}
    imports["react/jsx-runtime"] = base + npm_path("react", REACT, "jsx-runtime/+esm")
    for sub in ("rough", "math", "generator"):
        imports[f"roughjs/bin/{sub}"] = base + npm_path("roughjs", ROUGHJS, f"bin/{sub}.js/+esm")
    return {"imports": imports}


EXCALIDRAW_DIST = npm_path("@excalidraw/excalidraw", EXCALIDRAW, "dist/prod/")
SVGO_BROWSER = npm_path("svgo", SVGO, "dist/svgo.browser.js")
INTER_CSS = npm_path("@fontsource-variable/inter", INTER, "index.css")
NOTO_SC_CSS = npm_path("@fontsource-variable/noto-sans-sc", NOTO_SC, "index.css")

#: Excalifont 分片（文件名, unicode-range），取自 @excalidraw/excalidraw@0.18.1 dist/prod
EXCALIFONT_SHARDS = [
    ("Excalifont-Regular-a88b72a24fb54c9f94e3b5fdaa7481c9.woff2", "U+20-7e,U+a0-a3,U+a5-a6,U+a8-ab,U+ad-b1,U+b4,U+b6-b8,U+ba-ff,U+131,U+152-153,U+2bc,U+2c6,U+2da,U+2dc,U+304,U+308,U+2013-2014,U+2018-201a,U+201c-201e,U+2020,U+2022,U+2024-2026,U+2030,U+2039-203a,U+20ac,U+2122,U+2212"),
    ("Excalifont-Regular-be310b9bcd4f1a43f571c46df7809174.woff2", "U+100-130,U+132-137,U+139-149,U+14c-151,U+154-17e,U+192,U+1fc-1ff,U+218-21b,U+237,U+1e80-1e85,U+1ef2-1ef3,U+2113"),
    ("Excalifont-Regular-b9dcf9d2e50a1eaf42fc664b50a3fd0d.woff2", "U+400-45f,U+490-491,U+2116"),
    ("Excalifont-Regular-41b173a47b57366892116a575a43e2b6.woff2", "U+37e,U+384-38a,U+38c,U+38e-393,U+395-3a1,U+3a3-3a8,U+3aa-3cf,U+3d7"),
    ("Excalifont-Regular-3f2c5db56cc93c5a6873b1361d730c16.woff2", "U+2c7,U+2d8-2d9,U+2db,U+2dd,U+302,U+306-307,U+30a-30c,U+326-328,U+212e,U+2211,U+fb01-fb02"),
    ("Excalifont-Regular-349fac6ca4700ffec595a7150a0d1e1d.woff2", "U+462-463,U+472-475,U+4d8-4d9,U+4e2-4e3,U+4e6-4e9,U+4ee-4ef"),
    ("Excalifont-Regular-623ccf21b21ef6b3a0d87738f77eb071.woff2", "U+300-301,U+303"),
]

#: draw.io 官方 viewer（无版本号的 URL；首次下载后缓存，可用 WISP_DRAWIO_VIEWER 指定本地文件）
DRAWIO_VIEWER_URL = "https://viewer.diagrams.net/js/viewer-static.min.js"
#: draw.io 的 MathJax 构建（标签里有公式、且页面 math="1" 时由 browser 导出方式加载；按文件缓存）
DRAWIO_MATH_URL = "https://viewer.diagrams.net/math4/es5"
