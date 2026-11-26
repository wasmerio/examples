"""draw.io 导出，按顺序探测三种方式（diagrams.md §6.3）：
  1. cli     —— draw.io desktop：`drawio -x -f svg`（Linux 无显示时自动套 xvfb-run，并加 --no-sandbox）
  2. docker  —— 本地**已存在**的镜像 rlespinasse/drawio-export（不会自动 pull）
  3. browser —— Playwright 加载 draw.io 官方 viewer-static.min.js，离线调用 Graph#getSvg
     viewer 脚本来源：$WISP_DRAWIO_VIEWER → 缓存 → 首次自动下载（$WISP_DIAGRAM_OFFLINE=1 时禁止下载）
可用 $WISP_DRAWIO_EXPORTER=cli|docker|browser 或 --drawio <method> 强制指定。
"""
from __future__ import annotations

import os
import re
import shutil
import subprocess
import sys
import tempfile
from dataclasses import dataclass
from pathlib import Path

from . import cdn
from .browser import INSTALL_HINT, ORIGIN, BrowserSession
from .env import WispError, cache_dir, log, offline
from .fonts import font_face_css
from .versions import DRAWIO_MATH_URL as MATH_URL
from .versions import DRAWIO_VIEWER_URL as VIEWER_URL

DRAWIO_METHODS = ("cli", "docker", "browser")
DOCKER_IMAGE = "rlespinasse/drawio-export"


@dataclass
class Probe:
    method: str
    ok: bool
    detail: str


@dataclass
class DrawioPageSvg:
    index: int
    name: str
    svg: str = ""


def find_drawio_binary() -> str | None:
    env = os.environ.get("WISP_DRAWIO_BIN")
    if env:
        return env if os.path.exists(env) else None
    for c in ("drawio", "draw.io"):
        p = shutil.which(c)
        if p:
            return p
    for p in ("/Applications/draw.io.app/Contents/MacOS/draw.io", "/opt/drawio/drawio", r"C:\Program Files\draw.io\draw.io.exe"):
        if os.path.exists(p):
            return p
    return None


def _docker_image_present() -> tuple[bool, str]:
    if not shutil.which("docker"):
        return False, "未安装 docker"
    try:
        r = subprocess.run(["docker", "image", "inspect", DOCKER_IMAGE], capture_output=True, text=True, timeout=15)
    except (subprocess.TimeoutExpired, OSError) as e:
        return False, f"docker 不可用（{e}）"
    if r.returncode == 0:
        return True, f"镜像 {DOCKER_IMAGE} 已存在"
    err = (r.stderr or "").lower()
    if "permission denied" in err:
        return False, "没有 docker 权限"
    if "cannot connect" in err:
        return False, "docker 守护进程未运行"
    return False, f"本地没有镜像 {DOCKER_IMAGE}（不会自动 pull，可手动 `docker pull {DOCKER_IMAGE}`）"


def viewer_cache_path() -> Path:
    return cache_dir() / "drawio-viewer-static.min.js"


def _viewer_availability() -> tuple[bool, str, Path | None]:
    env = os.environ.get("WISP_DRAWIO_VIEWER")
    if env:
        p = Path(env).expanduser()
        return (True, f"viewer：{env}", p) if p.exists() else (False, f"WISP_DRAWIO_VIEWER 指向的文件不存在：{env}", None)
    cached = viewer_cache_path()
    if cached.exists():
        return True, f"viewer 缓存：{cached}", cached
    if offline():
        return False, "没有 viewer 缓存且处于离线模式（WISP_DIAGRAM_OFFLINE）", None
    return True, f"首次使用时从 {VIEWER_URL} 下载到 {cached}", None


def probe_drawio(check_chromium: bool = True) -> list[Probe]:
    b = find_drawio_binary()
    probes = [Probe("cli", bool(b), f"draw.io CLI：{b}" if b else "PATH 中没有 drawio / draw.io")]
    ok, detail = _docker_image_present()
    probes.append(Probe("docker", ok, detail))
    vok, vdetail, _ = _viewer_availability()
    if check_chromium and vok:
        from .browser import chromium_status
        cok, cdetail = chromium_status()
        if not cok:
            probes.append(Probe("browser", False, cdetail))
            return probes
    probes.append(Probe("browser", vok, vdetail))
    return probes


def drawio_unavailable_message(probes: list[Probe]) -> str:
    return "\n".join([
        "[wisp-diagram] 没有可用的 draw.io 导出方式：",
        *[f"  - {p.method}: {p.detail}" for p in probes],
        "任选其一：",
        "  1. 安装 draw.io desktop（https://github.com/jgraph/drawio-desktop/releases），确保 `drawio` 在 PATH 中；Linux 无头环境还需 xvfb（apt install xvfb）。",
        f"  2. docker pull {DOCKER_IMAGE}",
        f"  3. 安装 Chromium（{INSTALL_HINT}），并允许联网下载一次 viewer，或手动下载 {VIEWER_URL} 后设置 WISP_DRAWIO_VIEWER=<路径>。",
    ])


def choose_drawio_method(prefer: str | None = None) -> str:
    want = prefer or os.environ.get("WISP_DRAWIO_EXPORTER") or None
    if want and want not in DRAWIO_METHODS:
        raise WispError(f"[wisp-diagram] 未知的 draw.io 导出方式：{want}（可选 {'/'.join(DRAWIO_METHODS)}）")
    probes = probe_drawio()
    if want:
        p = next(x for x in probes if x.method == want)
        if not p.ok:
            raise WispError(f"[wisp-diagram] 指定的 draw.io 导出方式 {want} 不可用：{p.detail}\n{drawio_unavailable_message(probes)}")
        return want
    hit = next((p for p in probes if p.ok), None)
    if not hit:
        raise WispError(drawio_unavailable_message(probes))
    return hit.method


# ---------------------------------------------------------------- 页面信息

def _decode_xml(s: str) -> str:
    def repl(m: re.Match) -> str:
        e = m.group(1)
        low = e.lower()
        if low == "lt":
            return "<"
        if low == "gt":
            return ">"
        if low == "quot":
            return '"'
        if low == "apos":
            return "'"
        if low == "amp":
            return "&"
        return chr(int(e[2:], 16) if e[1] in "xX" else int(e[1:]))

    return re.sub(r"&(lt|gt|quot|apos|amp|#\d+|#x[0-9a-f]+);", repl, s, flags=re.I)


def drawio_pages(xml: str) -> list[DrawioPageSvg]:
    out = []
    for i, m in enumerate(re.finditer(r"<diagram\b([^>]*)>", xml)):
        nm = re.search(r'\sname="([^"]*)"', m.group(1))
        out.append(DrawioPageSvg(i, _decode_xml(nm.group(1)) if nm else f"Page-{i + 1}"))
    return out


def drawio_page_labels(xml: str, index: int) -> list[str]:
    """某一页所有 cell 的文字（去 HTML），用于 <desc> 默认值。"""
    bodies = [m.group(1) for m in re.finditer(r"<diagram\b[^>]*>([\s\S]*?)</diagram>", xml)]
    body = bodies[index] if index < len(bodies) else ""
    labels = []
    for m in re.finditer(r'<(?:mxCell|UserObject|object)\b[^>]*?\s(?:value|label)="([^"]*)"', body):
        t = _decode_xml(m.group(1))
        t = re.sub(r"<br\s*/?>", " ", t, flags=re.I)
        t = re.sub(r"<[^>]+>", "", t)
        t = t.replace("&nbsp;", " ")
        clean = re.sub(r"\s+", " ", _decode_xml(t)).strip()
        if clean:
            labels.append(clean)
    return labels


# ---------------------------------------------------------------- 输出清洗

def strip_light_dark(s: str) -> str:
    """把 light-dark(A, B) 替换为 A（支持 A 内含括号）。"""
    out = []
    i = 0
    n = len(s)
    key = "light-dark("
    while i < n:
        j = s.find(key, i)
        if j < 0:
            out.append(s[i:])
            break
        out.append(s[i:j])
        k = j + len(key)
        depth = 0
        first = []
        end = -1
        first_done = False
        while k < n:
            c = s[k]
            if c == "(":
                depth += 1
            elif c == ")":
                if depth == 0:
                    end = k
                    break
                depth -= 1
            elif c == "," and depth == 0 and not first_done:
                first_done = True
                k += 1
                continue
            if not first_done:
                first.append(c)
            k += 1
        if end < 0:
            out.append(s[j:])
            break
        out.append("".join(first).strip())
        i = end + 1
    return "".join(out)


def clean_drawio_svg(svg: str) -> str:
    """draw.io（新版本）导出的 SVG 带有自适应暗色：light-dark()、--ge-adaptive-* 变量、随机根 id。
    Wisp 用自己的 --wd-* 机制做暗色，这里统一还原成浅色字面量，交给 to_portable_svg 映射。"""
    s = re.sub(r"<\?xml[^>]*>\s*", "", svg)
    s = re.sub(r"<!DOCTYPE[^>]*>\s*", "", s, flags=re.I)
    s = re.sub(r"<style\b[^>]*>[^<]*--ge-adaptive[^<]*</style>", "", s)
    # MathJax 的全局样式表（含 ::before 等伪元素选择器，svgo 无法处理）：公式是自带尺寸的内联 SVG，不依赖它
    s = re.sub(r'<style\b[^>]*\bid="MJX-SVG-styles"[^>]*>[\s\S]*?</style>', "", s)
    # draw.io 桌面端（CLI / Docker）会注入 `.MathJax svg{shape-rendering:crispEdges}`，关闭抗锯齿会让公式笔画断裂发虚，且内联进页面后污染全页
    s = re.sub(r"\.MathJax[\w-]*\s+svg\s*\{\s*shape-rendering\s*:\s*crispEdges\s*;?\s*\}", "", s, flags=re.I)
    s = re.sub(r"<style\b[^>]*>\s*</style>", "", s, flags=re.I)
    s = re.sub(r"<defs\b[^>]*>\s*</defs>", "", s, flags=re.I)
    # 公式的排版样式直接写在元素上，不依赖宿主页面的 CSS（Tailwind preflight 会把所有 svg 设成 display:block，
    # 公式就会一个一行）；行内公式两侧留 0.2em，因为紧挨行内块的空格会被折叠掉。<img> 引用时同样生效。
    def mjx(m: re.Match) -> str:
        attrs, svg_attrs = m.group(1), m.group(2)
        if re.search(r'\bstyle="[^"]*display:', attrs):
            return m.group(0)
        block = re.search(r'\bdisplay="true"', attrs) is not None
        box = "display:block;margin:0.5em 0;text-align:center;line-height:0" if block else "display:inline-block;margin:0 0.2em;line-height:0"
        if re.search(r'\sstyle="', svg_attrs):
            svg_attrs = re.sub(r'\sstyle="([^"]*)"', lambda t: f' style="display:inline;overflow:visible;{t.group(1)}"', svg_attrs, count=1)
        else:
            svg_attrs += ' style="display:inline;overflow:visible"'
        return f'<mjx-container{attrs} style="{box}"><svg{svg_attrs}>'

    s = re.sub(r"<mjx-container\b([^>]*)>\s*<svg\b([^>]*)>", mjx, s)
    s = strip_light_dark(s)
    s = re.sub(r"var\(--ge-[\w-]+,\s*([^()]+?|[a-z]+\([^)]*\))\)", r"\1", s)

    def root(m: re.Match) -> str:
        a = re.sub(r'\sid="ge-svg-[^"]*"', "", m.group(1), count=1)
        a = re.sub(r'\scontent="[^"]*"', "", a, count=1)
        return f"<svg{a}>"

    s = re.sub(r"<svg\b([^>]*)>", root, s, count=1)

    def dedupe(m: re.Match) -> str:
        tag, attrs, style = m.group(1), m.group(2), m.group(3)

        def has(p: str) -> bool:
            return re.search(rf'\s{p}="', attrs) is not None

        kept = []
        for d in style.split(";"):
            prop = d.split(":")[0].strip().lower()
            if not prop:
                continue
            if prop in ("fill", "stroke") and has(prop):
                continue
            kept.append(d)
        return f'<{tag}{attrs} style="{";".join(kept).strip()}"' if kept else f"<{tag}{attrs}"

    return re.sub(r'<([a-zA-Z]+)\b([^>]*?)\sstyle="([^"]*)"', dedupe, s)


# ---------------------------------------------------------------- 三种实现

def _export_via_cli(xml: str, pages: list[DrawioPageSvg], border: int) -> None:
    b = find_drawio_binary()
    assert b
    with tempfile.TemporaryDirectory(prefix="wisp-drawio-") as d:
        src = os.path.join(d, "in.drawio")
        Path(src).write_text(xml, "utf-8")
        for p in pages:
            out = os.path.join(d, f"p{p.index}.svg")
            cmd = [b, "-x", "-f", "svg", "--embed-svg-fonts", "false", "-b", str(border), "-p", str(p.index + 1), "-o", out, src]
            if sys.platform.startswith("linux"):
                cmd.append("--no-sandbox")
                if not os.environ.get("DISPLAY") and shutil.which("xvfb-run"):
                    cmd = ["xvfb-run", "-a", *cmd]
            r = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
            if r.returncode != 0 or not os.path.exists(out):
                raise WispError(f"[wisp-diagram] drawio CLI 导出失败（page {p.name}）：{r.stderr}")
            p.svg = Path(out).read_text("utf-8")


def _export_via_docker(xml: str, pages: list[DrawioPageSvg], border: int) -> None:
    with tempfile.TemporaryDirectory(prefix="wisp-drawio-") as d:
        Path(d, "in.drawio").write_text(xml, "utf-8")
        r = subprocess.run(["docker", "run", "--rm", "-v", f"{d}:/data", DOCKER_IMAGE, "--format", "svg",
                            "--embed-svg-fonts", "false", "--border", str(border), "--output", "out", "in.drawio"],
                           capture_output=True, text=True, timeout=300)
        if r.returncode != 0:
            raise WispError(f"[wisp-diagram] docker drawio-export 失败：{r.stderr or r.stdout}")
        out_dir = Path(d, "out")
        files = sorted(f.name for f in out_dir.glob("*.svg")) if out_dir.exists() else []
        for p in pages:
            f = next((x for x in files if x == f"in-{p.name}.svg"), None) or (files[0] if len(pages) == 1 and files else None)
            if not f:
                raise WispError(f"[wisp-diagram] docker 导出结果中找不到页面 {p.name}（得到 {', '.join(files)}）")
            p.svg = (out_dir / f).read_text("utf-8")


def ensure_viewer() -> Path:
    ok, detail, path = _viewer_availability()
    if not ok:
        raise WispError(f"[wisp-diagram] {detail}")
    if path:
        return path
    dest = viewer_cache_path()
    log(f"下载 draw.io viewer：{VIEWER_URL} → {dest}")
    tmp = dest.with_name(dest.name + ".download")
    body = cdn.download(VIEWER_URL, tmp)
    if b"GraphViewer" not in body:
        tmp.unlink(missing_ok=True)
        raise WispError("[wisp-diagram] 下载的 viewer 内容异常")
    os.replace(tmp, dest)
    return dest


_VIEWER_EXPORT_JS = """async ({ xml, index, border }) => {
  const g = window;
  const doc = g.mxUtils.parseXml(xml);
  const diagram = doc.documentElement.getElementsByTagName('diagram')[index];
  const inner = diagram.getElementsByTagName('mxGraphModel')[0];
  // 每页单独成文档：mxCodec 按整份文档建 id 索引，多页共用文档会出现 Duplicate ID
  const model = inner
    ? g.mxUtils.parseXml(g.mxUtils.getXml(inner)).documentElement
    : g.mxUtils.parseXml(g.Graph.decompress(diagram.textContent)).documentElement;
  // math="1" 的页面：先把 MathJax 加载完，getSvg 才会把标签里的 \\(...\\) / $$...$$ 排成公式
  const math = model.getAttribute('math') === '1';
  if (math) {
    g.Editor.initMath();
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('MathJax 加载超时')), 60000);
      g.Editor.loadMath(() => { clearTimeout(timer); resolve(); });
    });
  }
  const container = document.getElementById('c');
  container.innerHTML = '';
  const graph = new g.Graph(container);
  if (graph.setAdaptiveColors) graph.setAdaptiveColors('none');
  graph.mathEnabled = math;
  new g.mxCodec(model.ownerDocument).decode(model, graph.getModel());
  const svgEl = graph.getSvg(null, 1, border, false, null, true, null, null, null, false, false, 'light');
  const s = new XMLSerializer().serializeToString(svgEl);
  graph.destroy();
  return s;
}"""


def _export_via_browser(session: BrowserSession, xml: str, pages: list[DrawioPageSvg], border: int) -> None:
    viewer = ensure_viewer()
    css = font_face_css(["Inter", "Noto Sans SC"], lambda s: ORIGIN + s.path)
    html = (f'<!doctype html><html><head><meta charset="utf-8"><style>{css}</style>'
            f"<script>window.mxLoadResources=false;window.mxLoadStylesheets=false;window.DRAWIO_LIGHTBOX=false;window.DRAW_MATH_URL='{ORIGIN}/drawio-math';</script>"
            '</head><body><div id="c" style="position:absolute;left:0;top:0;width:4000px;height:4000px"></div></body></html>')
    wp = session.open_page(html=html, files={"/viewer.js": viewer.read_bytes()}, proxies={"/drawio-math/": MATH_URL})
    try:
        wp.page.add_script_tag(url=f"{ORIGIN}/viewer.js")
        for p in pages:
            p.svg = wp.page.evaluate(_VIEWER_EXPORT_JS, {"xml": xml, "index": p.index, "border": border})
        if wp.errors:
            log(f"viewer 警告：{'; '.join(wp.errors)}")
    finally:
        wp.close()


def export_drawio_svgs(session: BrowserSession, xml: str, *, method: str | None = None, border: int = 8,
                       only: list[int] | None = None) -> tuple[str, list[DrawioPageSvg]]:
    m = choose_drawio_method(method)
    pages = drawio_pages(xml)
    if not pages:
        raise WispError("[wisp-diagram] .drawio 中没有 <diagram> 页面")
    if only is not None:
        pages = [p for p in pages if p.index in only]
    if m == "cli":
        _export_via_cli(xml, pages, border)
    elif m == "docker":
        _export_via_docker(xml, pages, border)
    else:
        _export_via_browser(session, xml, pages, border)
    for p in pages:
        p.svg = clean_drawio_svg(p.svg)
    return m, pages
