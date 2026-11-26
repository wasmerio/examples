"""wisp_diagram.py 的命令实现。"""
from __future__ import annotations

import argparse
import json
import os
import shutil
import sys
from pathlib import Path

from .cli_util import expand_args, kind_of
from .env import GENERATOR, WispError, cache_dir

USAGE = """用法：uv run <skill>/scripts/wisp_diagram.py <命令> [...]

命令：
  lint <文件|glob>... [--fix] [--strict]     颜色 / 字号 / 网格 / 阴影 / 渐变 / 文件大小检查
  normalize <文件|glob>... [--check]         解压 drawio、格式化 JSON、精简 Excalidraw appState
  migrate --from <旧palette.json> <文件|glob>... [--check]   调色板换代：按令牌名改写颜色、线宽、圆角
  build <文件|目录>... [选项]                源文件 → 可移植 .wisp.svg
  export <文件> [--theme light|dark] [--scale 2] [-o out.png]   导出 PNG（源文件或 .wisp.svg）
  new <skeleton.json> [-o out.excalidraw] [--seed N] [--build]   骨架 → .excalidraw
  check [--root DIR] [--manifest PATH]       只校验 manifest 哈希（CI 用，不需要浏览器）
  probe                                      打印 draw.io / Excalidraw / Chromium 可用性
  cache [status|warm|clear]                  查看 / 预热（离线前）/ 清空下载缓存

每个命令加 -h 查看完整选项。
"""


def _out(s: str = "") -> None:
    sys.stdout.write(s + "\n")
    sys.stdout.flush()


def _err(s: str) -> None:
    sys.stderr.write(s + "\n")
    sys.stderr.flush()


def _js_str(v) -> str:
    from .jsjson import js_string
    return js_string(v)


# ---------------------------------------------------------------- lint / normalize

def cmd_lint(files: list[str], fix: bool = False, strict: bool = False, log=_out) -> int:
    """退出码：0 无 error；1 有 error（--strict 时 warn 也算）；2 用法或读写错误。"""
    from .lint import apply_fixes, lint_drawio, lint_excalidraw

    targets = expand_args(files)
    if not targets:
        log("usage: wisp_diagram.py lint <file|glob>... [--fix] [--strict]")
        return 2
    errors = warns = 0
    failed = False
    for f in targets:
        kind = kind_of(f)
        if not kind:
            log(f"{f}: skipped (not .excalidraw or .drawio)")
            continue
        try:
            src = Path(f).read_text("utf-8")
            run = lint_excalidraw if kind == "excalidraw" else lint_drawio
            issues = run(src)
            if fix and any(i.fix for i in issues):
                nxt = apply_fixes(kind, src, issues)
                Path(f).write_text(nxt, "utf-8", newline="\n")
                log(f"{f}: applied {sum(1 for i in issues if i.fix)} fix(es)")
                src = nxt
                issues = run(src)
            for i in issues:
                eid = f" #{_js_str(i.element_id)}" if i.element_id not in (None, "") else ""
                log(f"{f}: {i.level} [{i.rule}]{eid} {i.message}{' (fixable)' if i.fix else ''}")
                if i.level == "error":
                    errors += 1
                else:
                    warns += 1
        except Exception as e:  # noqa: BLE001
            log(f"{f}: failed: {e}")
            failed = True
    log(f"{len(targets)} file(s), {errors} error(s), {warns} warning(s)")
    if failed:
        return 2
    return 1 if errors > 0 or (strict and warns > 0) else 0


def cmd_normalize(files: list[str], check: bool = False, log=_out) -> int:
    """退出码：0 无变化/已写入；1 --check 发现需要规范化；2 错误。"""
    from .drawio import normalize_drawio
    from .excalidraw import normalize_excalidraw

    targets = expand_args(files)
    if not targets:
        log("usage: wisp_diagram.py normalize <file|glob>... [--check]")
        return 2
    dirty = 0
    failed = False
    for f in targets:
        kind = kind_of(f)
        if not kind:
            log(f"{f}: skipped (not .excalidraw or .drawio)")
            continue
        try:
            src = Path(f).read_text("utf-8")
            nxt = normalize_drawio(src) if kind == "drawio" else normalize_excalidraw(src)
            if nxt == src:
                continue
            dirty += 1
            if check:
                log(f"{f}: needs normalize")
            else:
                Path(f).write_text(nxt, "utf-8", newline="\n")
                log(f"{f}: normalized")
        except Exception as e:  # noqa: BLE001
            log(f"{f}: failed: {e}")
            failed = True
    if failed:
        return 2
    return 1 if check and dirty > 0 else 0


def cmd_migrate(files: list[str], old_palette: str, check: bool = False, log=_out) -> int:
    """退出码：0 无变化/已写入；1 --check 发现需要迁移；2 用法或读写错误。"""
    from .migrate import Migration, load_palette

    targets = expand_args(files)
    if not targets:
        log("usage: wisp_diagram.py migrate --from <old-palette.json> <file|glob>... [--check]")
        return 2
    mig = Migration.from_palettes(load_palette(old_palette))
    dirty = 0
    failed = False
    for f in targets:
        try:
            mig.stats = {}
            src = Path(f).read_text("utf-8")
            nxt = mig.file(f)
            if nxt is None:
                log(f"{f}: skipped (not .excalidraw / .excalidrawlib / .drawio / mxlibrary .xml / drawio-config .json)")
                continue
            if nxt == src:
                continue
            dirty += 1
            what = ", ".join(f"{k} {v}" for k, v in sorted(mig.stats.items())) or "reformatted"
            if check:
                log(f"{f}: needs migrate ({what})")
            else:
                Path(f).write_text(nxt, "utf-8", newline="\n")
                log(f"{f}: migrated ({what})")
        except Exception as e:  # noqa: BLE001
            log(f"{f}: failed: {e}")
            failed = True
    if failed:
        return 2
    return 1 if check and dirty > 0 else 0


# ---------------------------------------------------------------- 项目（manifest）

class Project:
    def __init__(self, root: str, manifest: str):
        self.root = os.path.abspath(root)
        self.manifest_path = os.path.abspath(manifest)

    def rel(self, p: str) -> str:
        from .manifest import repo_rel
        return repo_rel(os.path.abspath(p), self.root)

    def scan(self) -> list[str]:
        from .manifest import scan_sources
        return scan_sources(self.root)


def _project(args) -> Project | None:
    root = getattr(args, "root", None)
    manifest = getattr(args, "manifest", None)
    if not manifest:
        return None
    return Project(root or os.getcwd(), manifest)


def _expand_targets(proj: Project, paths: list[str]) -> list[str]:
    scanned = [os.path.join(proj.root, r) for r in proj.scan()]
    out: set[str] = set()
    for p in paths:
        a = os.path.abspath(p)
        if not os.path.exists(a):
            raise WispError(f"路径不存在：{p}")
        if os.path.isdir(a):
            for s in scanned:
                if s == a or s.startswith(a.rstrip(os.sep) + os.sep):
                    out.add(os.path.normpath(s))
        elif kind_of(a):
            out.add(a)
        else:
            raise WispError(f"不是图表源文件：{p}")
    return sorted(out)


def _build_project(proj: Project, positional: list[str], *, force: bool, embed_fonts: bool, fix: bool,
                   drawio: str | None) -> int:
    from .manifest import content_hash, entry_status, load_manifest, save_manifest

    manifest = load_manifest(proj.manifest_path)
    scanned = set(proj.scan())
    targets = _expand_targets(proj, positional) if positional else [os.path.join(proj.root, r) for r in sorted(scanned)]
    todo = []
    for a in targets:
        rel = proj.rel(a)
        if rel not in scanned or force:
            todo.append(a)
            continue
        st = entry_status(rel, manifest, proj.root)
        e = manifest["entries"].get(rel)
        opts_changed = bool(e) and e.get("embedFonts") != embed_fonts
        if st.kind != "ok" or opts_changed:
            todo.append(a)
    pruned = 0
    if not positional:
        for rel in list(manifest["entries"]):
            if rel not in scanned:
                del manifest["entries"][rel]
                pruned += 1
    if not todo:
        if pruned or not os.path.exists(proj.manifest_path):
            save_manifest(manifest, proj.manifest_path)
        _out(f"全部最新（{len(targets)} 个源文件）" + (f"，清理 {pruned} 条孤儿记录" if pruned else ""))
        return 0

    from .browser import BrowserSession
    from .build import build_diagram

    failures = unknown = 0
    session = BrowserSession()
    try:
        for a in todo:
            rel = proj.rel(a)
            try:
                r = build_diagram(a, session=session, embed_fonts=embed_fonts, fix=fix, drawio=drawio)
                for o in r.outputs:
                    _out(f"✓ {rel} → {proj.rel(o.path)}" + (f" [{o.page[1]}]" if o.page else ""))
                for w in r.warnings:
                    _out(f"  warning: {w}")
                if r.unknown_colors:
                    unknown += 1
                    _out(f"  ✗ 非调色板颜色：{', '.join(r.unknown_colors)}（运行 lint --fix）")
                if rel in scanned:
                    entry = {
                        "source": content_hash(Path(a).read_bytes()),
                        "style": r.style,
                        "exporter": r.exporter,
                        "embedFonts": embed_fonts,
                        "outputs": {proj.rel(o.path): content_hash(o.svg) for o in r.outputs},
                    }
                    if r.style == "clean":
                        entry["pages"] = [o.page[1] if o.page else "" for o in r.outputs]
                    manifest["entries"][rel] = entry
                else:
                    _out(f"  （{rel} 不在扫描范围内，未写入 manifest）")
            except WispError as e:
                failures += 1
                _err(f"✗ {rel}\n{e}")
    finally:
        session.close()
        manifest["generator"] = GENERATOR
        save_manifest(manifest, proj.manifest_path)
    _out(f"构建 {len(todo) - failures}/{len(todo)}" + (f"，清理 {pruned} 条孤儿记录" if pruned else "")
         + f"；manifest：{proj.rel(proj.manifest_path)}")
    return 1 if failures or unknown else 0


def cmd_build(args) -> int:
    proj = _project(args)
    if proj:
        if args.title or args.desc or args.out_dir:
            raise WispError("项目模式（--manifest）下不支持 --title / --desc / --out-dir")
        return _build_project(proj, args.files, force=args.force, embed_fonts=args.embed_fonts, fix=args.fix,
                              drawio=args.drawio)
    if args.probe:
        return cmd_probe()
    files = args.files
    if not files:
        _err("用法：wisp_diagram.py build <file.excalidraw|file.drawio>... [选项]（-h 查看）")
        return 2
    if len(files) > 1 and (args.title or args.desc):
        _err("--title/--desc 只能用于单个文件")
        return 2
    from .browser import BrowserSession
    from .build import build_diagram

    bad = False
    with BrowserSession() as session:
        for f in files:
            r = build_diagram(f, session=session, embed_fonts=args.embed_fonts, fix=args.fix, title=args.title,
                              desc=args.desc, drawio=args.drawio,
                              out_dir=os.path.abspath(args.out_dir) if args.out_dir else None)
            for o in r.outputs:
                _out(f"{os.path.basename(f)} → {o.path}" + (f" (page {o.page[1]})" if o.page else "") + f" [{r.exporter}]")
            for w in r.warnings:
                _err(f"  warning: {w}")
            if r.unknown_colors:
                bad = True
                _err(f"  非调色板颜色：{', '.join(r.unknown_colors)}（运行 lint --fix 或 build --fix）")
    return 1 if args.strict and bad else 0


def cmd_check(args) -> int:
    from .manifest import check_all, scan_sources

    root = os.path.abspath(args.root or os.getcwd())
    manifest = os.path.abspath(args.manifest) if args.manifest else os.path.join(root, "diagrams.manifest.json")
    problems = check_all(root, manifest)
    n = len(scan_sources(root))
    if not problems:
        _out(f"diagram check：{n} 个源文件，全部与 manifest 一致")
        return 0
    _err(f"diagram check 失败（{len(problems)} 项）：")
    for src, msg in problems:
        _err(f"  ✗ {src}：{msg}")
    _err(f"请在本地运行 build 并提交生成的 .wisp.svg 与 {os.path.relpath(manifest, root)}。")
    return 1


def cmd_export(args) -> int:
    if args.theme not in ("light", "dark"):
        _err("--theme 只能是 light 或 dark")
        return 2
    if not (0 < args.scale <= 8):
        _err("--scale 需在 (0, 8] 之间")
        return 2
    from .browser import BrowserSession
    from .export_png import export_png

    with BrowserSession() as session:
        res = export_png(session, args.file, args.out, theme=args.theme, scale=args.scale,
                         transparent=args.transparent, embed_fonts=not args.no_embed_fonts, drawio=args.drawio)
    for r in res:
        _out(f"{r.path} ({r.bytes / 1024:.1f} KB)")
    return 0


def cmd_new(args) -> int:
    from .browser import BrowserSession
    from .skeleton import default_skeleton_output, skeleton_to_excalidraw

    inp = os.path.abspath(args.skeleton)
    out = os.path.abspath(args.out or default_skeleton_output(inp))
    sk = json.loads(Path(inp).read_text("utf-8"))
    with BrowserSession() as session:
        js, warnings = skeleton_to_excalidraw(session, sk, seed=args.seed)
    for w in warnings:
        _err(f"warning: {w}")
    Path(out).write_text(js, "utf-8", newline="\n")
    _out(f"{os.path.basename(inp)} → {out}")
    if args.build:
        proj = _project(args)
        if proj:
            return _build_project(proj, [out], force=False, embed_fonts=False, fix=False, drawio=None)
        ns = argparse.Namespace(files=[out], embed_fonts=False, fix=False, strict=False, title=None, desc=None,
                                drawio=None, out_dir=None, manifest=None, root=None, force=False, probe=False)
        return cmd_build(ns)
    return 0


def cmd_probe() -> int:
    from .browser import chromium_status
    from .drawio_export import probe_drawio
    from .excalidraw_export import excalidraw_status

    cok, cdetail = chromium_status()
    _out(f"{'✓' if cok else '✗'} chromium: {cdetail}")
    eok, edetail = excalidraw_status()
    _out(f"{'✓' if eok and cok else '✗'} excalidraw: {edetail}")
    for p in probe_drawio(check_chromium=False):
        ok = p.ok and (p.method != "browser" or cok)
        _out(f"{'✓' if ok else '✗'} drawio-{p.method}: {p.detail}")
    return 0


def _dir_size(p: Path) -> int:
    return sum(f.stat().st_size for f in p.rglob("*") if f.is_file()) if p.exists() else 0


def cmd_cache(action: str) -> int:
    d = cache_dir()
    if action == "status":
        cdn_d = d / "cdn"
        n = len(list(cdn_d.glob("*"))) if cdn_d.exists() else 0
        _out(f"缓存目录：{d}")
        _out(f"  cdn/（Excalidraw、svgo、字体）：{n} 个文件，{_dir_size(cdn_d) / 1048576:.1f} MB")
        v = d / "drawio-viewer-static.min.js"
        _out(f"  draw.io viewer：{f'{v.stat().st_size / 1048576:.1f} MB' if v.exists() else '未下载'}")
        _out(f"  合计：{_dir_size(d) / 1048576:.1f} MB")
        return 0
    if action == "clear":
        for child in d.iterdir():
            if child.is_dir():
                shutil.rmtree(child)
            else:
                child.unlink()
        _out(f"已清空 {d}")
        return 0
    if action == "warm":
        return _cache_warm()
    _err(f"未知的 cache 操作：{action}（status / warm / clear）")
    return 2


def _cache_warm() -> int:
    """预热离线所需的全部资源：Excalidraw 模块图、svgo、全部字体分片、draw.io viewer 与 MathJax。"""
    from . import cdn
    from .browser import BrowserSession
    from .drawio_export import ensure_viewer
    from .excalidraw_export import open_excalidraw_page, prefetch_excalidraw
    from .fonts import shards_for
    from .postprocess import svgo_optimize

    pre = 0 if os.environ.get("WISP_EXCALIDRAW_BUNDLE") else prefetch_excalidraw()
    with BrowserSession() as session:
        wp = open_excalidraw_page(session)
        wp.close()
        svgo_optimize(session, '<svg xmlns="http://www.w3.org/2000/svg"/>', "warm")
        _out(f"✓ Excalidraw 与 svgo（本次新下载 {pre + session.downloads} 个文件）")
    paths = [s.path for fam in ("Excalifont", "Inter", "Noto Sans SC") for s in shards_for(fam)]
    n = cdn.prefetch_module_graph(paths, {})
    missing = [p for p in paths if not cdn.is_cached(cdn.jsdelivr(p))]
    if missing:
        raise WispError(f"[wisp-diagram] 有 {len(missing)} 个字体分片下载失败（如 {missing[0]}），请重试")
    _out(f"✓ 字体分片（本次新下载 {n} 个）")
    _out(f"✓ draw.io viewer：{ensure_viewer()}")
    from .versions import DRAWIO_MATH_URL
    cdn.fetch(f"{DRAWIO_MATH_URL}/drawio-mathjax.min.js", quiet=True)
    _out("✓ draw.io MathJax")
    return cmd_cache("status")


# ---------------------------------------------------------------- argparse

def _parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="wisp_diagram.py", description="wisp-diagram：Wisp 风格图表工具",
                                formatter_class=argparse.RawDescriptionHelpFormatter, usage=USAGE)
    sub = p.add_subparsers(dest="cmd")

    s = sub.add_parser("lint", help="lint 源文件")
    s.add_argument("files", nargs="*")
    s.add_argument("--fix", action="store_true", help="自动修正（颜色吸附到最近令牌、去阴影/渐变、解压 drawio）")
    s.add_argument("--strict", action="store_true", help="warn 也算失败")
    s.add_argument("--root", help="未给文件时扫描 <root>/src/content/**/diagrams/")

    s = sub.add_parser("normalize", help="规范化源文件")
    s.add_argument("files", nargs="*")
    s.add_argument("--check", action="store_true", help="只检查不写入（需要规范化时退出码 1）")

    s = sub.add_parser("migrate", help="调色板换代：按令牌名把旧调色板的值改写成当前值")
    s.add_argument("files", nargs="*")
    s.add_argument("--from", dest="old", required=True, help="旧的 palette.json（例如 git show <rev>:…/palette.json > old.json）")
    s.add_argument("--check", action="store_true", help="只检查不写入（需要迁移时退出码 1）")

    def build_opts(s: argparse.ArgumentParser) -> None:
        s.add_argument("--manifest", help="项目模式：增量构建并更新该 manifest（默认 <root>/diagrams.manifest.json）")
        s.add_argument("--root", help="项目根目录（默认当前目录）；扫描 <root>/src/content/**/diagrams/")

    s = sub.add_parser("build", help="源文件 → .wisp.svg")
    s.add_argument("files", nargs="*", help=".excalidraw / .drawio 文件（项目模式下也可以是目录）")
    s.add_argument("--embed-fonts", action="store_true", help="按实际字符裁剪 Inter / Noto Sans SC（hand 另加 Excalifont）并内嵌")
    s.add_argument("--fix", action="store_true", help="非调色板颜色吸附到最近令牌（默认只警告）")
    s.add_argument("--strict", action="store_true", help="出现非调色板颜色时退出码为 1")
    s.add_argument("--title", help="覆盖 <title>（仅单文件）")
    s.add_argument("--desc", help="覆盖 <desc>（仅单文件）")
    s.add_argument("--drawio", choices=["cli", "docker", "browser"], help="强制 draw.io 导出方式（默认自动探测）")
    s.add_argument("--out-dir", help="输出目录（默认与源文件同目录）")
    s.add_argument("--force", action="store_true", help="项目模式：忽略哈希，全部重建")
    s.add_argument("--probe", action="store_true", help=argparse.SUPPRESS)
    build_opts(s)

    s = sub.add_parser("export", help="导出 PNG")
    s.add_argument("file")
    s.add_argument("--png", action="store_true", help=argparse.SUPPRESS)
    s.add_argument("--theme", default="light", help="light | dark")
    s.add_argument("--scale", type=float, default=2)
    s.add_argument("-o", "--out", help="输出 PNG 路径（默认 <name>.<theme>.png，与输入同目录）")
    s.add_argument("--transparent", action="store_true")
    s.add_argument("--no-embed-fonts", action="store_true")
    s.add_argument("--drawio", choices=["cli", "docker", "browser"])

    s = sub.add_parser("new", help="骨架 → .excalidraw")
    s.add_argument("skeleton")
    s.add_argument("-o", "--out")
    s.add_argument("--seed", type=int, default=1)
    s.add_argument("--build", action="store_true", help="转换后立即 build")
    build_opts(s)

    s = sub.add_parser("check", help="校验 manifest 哈希（CI）")
    s.add_argument("--root")
    s.add_argument("--manifest")

    sub.add_parser("probe", help="打印导出环境探测结果")

    s = sub.add_parser("cache", help="下载缓存：status / warm / clear")
    s.add_argument("action", nargs="?", default="status", choices=["status", "warm", "clear"])
    return p


def main(argv: list[str] | None = None) -> int:
    argv = list(sys.argv[1:] if argv is None else argv)
    if not argv or argv[0] in ("-h", "--help", "help"):
        _out(USAGE)
        return 0 if argv else 2
    p = _parser()
    known = {"lint", "normalize", "migrate", "build", "export", "new", "check", "probe", "cache"}
    if argv[0] not in known:
        _err(f"未知命令：{argv[0]}\n{USAGE}")
        return 2
    try:
        args = p.parse_args(argv)
    except SystemExit as e:
        return int(e.code or 0)
    try:
        if args.cmd == "lint":
            files = args.files
            if not files and args.root:
                from .manifest import scan_sources
                root = os.path.abspath(args.root)
                files = [os.path.join(root, r) for r in scan_sources(root)]
                if not files:
                    _out("没有找到图表源文件（src/content/**/diagrams/*.{excalidraw,drawio}）")
                    return 0
            return cmd_lint(files, args.fix, args.strict)
        if args.cmd == "normalize":
            return cmd_normalize(args.files, args.check)
        if args.cmd == "migrate":
            return cmd_migrate(args.files, args.old, args.check)
        if args.cmd == "build":
            return cmd_build(args)
        if args.cmd == "export":
            return cmd_export(args)
        if args.cmd == "new":
            return cmd_new(args)
        if args.cmd == "check":
            return cmd_check(args)
        if args.cmd == "probe":
            return cmd_probe()
        if args.cmd == "cache":
            return cmd_cache(args.action)
    except WispError as e:
        _err(str(e))
        return 1
    except KeyboardInterrupt:
        return 130
    except (OSError, json.JSONDecodeError) as e:
        _err(f"[wisp-diagram] {e}")
        return 1
    except Exception as e:  # noqa: BLE001
        if os.environ.get("WISP_DIAGRAM_DEBUG") or type(e).__module__.split(".")[0] != "playwright":
            raise
        _err(f"[wisp-diagram] 浏览器操作失败：{str(e).strip().splitlines()[0]}（设置 WISP_DIAGRAM_DEBUG=1 查看详情）")
        return 1
    return 2
