#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
"""检查 Wisp 文章的 frontmatter、结构和写作规范。

    uv run skills/wisp-writer/scripts/check_post.py <slug|文件|目录>... [--strict] [--json]
    uv run skills/wisp-writer/scripts/check_post.py --all

输出：`文件:行号 级别 规则 说明`。级别为 error / warning / info。
退出码：0 无错误；1 有 error（--strict 时 warning 也算）；2 用法错误或找不到站点。
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import asdict, dataclass
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import _wisp  # noqa: E402

KNOWN_KEYS = {"title", "description", "pubDate", "updatedDate", "tags", "category", "draft", "featured", "cover", "lang", "toc", "series"}
BOOL_KEYS = ("draft", "featured", "toc")
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?)?$")
CJK = r"㐀-䶿一-鿿豈-﫿"
CJK_RE = re.compile(f"[{CJK}]")


@dataclass
class Finding:
    file: str
    line: int
    level: str
    rule: str
    message: str


def blank(m: re.Match) -> str:
    return re.sub(r"[^\n]", " ", m.group(0))


class Checker:
    def __init__(self, path: Path, display: str, root: Path | None):
        self.path = path
        self.display = display
        self.root = root
        self.findings: list[Finding] = []

    def add(self, line: int, level: str, rule: str, msg: str) -> None:
        self.findings.append(Finding(self.display, line, level, rule, msg))

    # ------------------------------------------------------------ 主流程
    def run(self) -> list[Finding]:
        try:
            text = self.path.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError) as e:
            self.add(1, "error", "read", f"无法读取文件：{e}")
            return self.findings
        lines = text.splitlines()
        fm = _wisp.parse_frontmatter(lines)
        self.is_mdx = self.path.suffix == ".mdx"
        self.check_frontmatter(fm)
        body = ["" for _ in range(fm.end_line)] + lines[fm.end_line :]
        self.fences = []
        self.unmasked_inline: list[str] = []
        masked = self.mask(body)
        self.check_headings(masked, body)
        self.check_images(masked)
        self.check_components(masked, body)
        self.check_fences()
        self.check_hardcoded(masked)
        self.check_punct(masked)
        self.check_style_warnings(masked, body)
        self.check_todo(masked)
        self.check_footnotes(masked)
        return sorted(self.findings, key=lambda f: (f.line, f.rule))

    # ------------------------------------------------------------ 遮罩
    def mask(self, lines: list[str]) -> list[str]:
        """去掉围栏代码块、注释、公式、行内代码，保留行数和列位置。"""
        out: list[str] = []
        cur = None  # (char, length, start_line, info, body_lines)
        for i, l in enumerate(lines, 1):
            if cur is None:
                m = re.match(r"^\s*(`{3,}|~{3,})\s*(.*)$", l)
                if m and not (m.group(1)[0] == "`" and "`" in m.group(2)):
                    cur = (m.group(1)[0], len(m.group(1)), i, m.group(2).strip(), [])
                    out.append("")
                else:
                    out.append(l)
            else:
                m = re.match(r"^\s*(`{3,}|~{3,})\s*$", l)
                if m and m.group(1)[0] == cur[0] and len(m.group(1)) >= cur[1]:
                    self.fences.append((cur[2], i, cur[3], cur[4]))
                    cur = None
                else:
                    cur[4].append(l)
                out.append("")
        if cur is not None:
            self.fences.append((cur[2], None, cur[3], cur[4]))
            self.add(cur[2], "error", "fence-unclosed", "代码块没有结束的围栏")
        t = "\n".join(out)
        t = re.sub(r"<!--.*?-->", blank, t, flags=re.S)
        t = re.sub(r"\{/\*.*?\*/\}", blank, t, flags=re.S)
        t = re.sub(r"\$\$.*?\$\$", blank, t, flags=re.S)
        self.unmasked_inline = t.split("\n")
        t = re.sub(r"(`+)(?!`).+?(?<!`)\1(?!`)", blank, t)
        t = re.sub(r"(?<![\\$\w])\$(?![\s$])[^$\n]+?(?<![\s\\])\$(?![\d$])", blank, t)
        return t.split("\n")

    def line_of(self, text: str, pos: int) -> int:
        return text.count("\n", 0, pos) + 1

    # ------------------------------------------------------------ frontmatter
    def check_frontmatter(self, fm: _wisp.Frontmatter) -> None:
        if fm.end_line == 0:
            self.add(1, "error", "fm-missing", fm.error or "缺少 frontmatter")
            return
        if fm.error:
            self.add(fm.error_line, "error", "fm-parse", fm.error)
        d, ln = fm.data, fm.lines
        for k in ("title", "description", "pubDate"):
            if k not in d or d[k] in (None, ""):
                self.add(ln.get(k, 1), "error", "fm-required", f"缺少必填字段 {k}")
        for k in d:
            if k not in KNOWN_KEYS:
                self.add(ln[k], "warning", "fm-unknown-key", f"未知字段 {k}（content.config.ts 中没有定义，会被忽略或导致构建失败）")
        for k, mx in (("title", 80), ("description", 200)):
            v = d.get(k)
            if isinstance(v, str):
                n = _wisp.utf16_len(v)
                if n > mx:
                    self.add(ln[k], "error", f"fm-{k}-length", f"{k} 有 {n} 个字符，超过上限 {mx}")
            elif v is not None:
                self.add(ln[k], "error", "fm-type", f"{k} 必须是字符串")
        pub = None
        for k in ("pubDate", "updatedDate"):
            v = d.get(k)
            if v is None:
                continue
            if not isinstance(v, str) or not DATE_RE.match(v):
                self.add(ln[k], "error", "fm-date", f"{k} 格式不对：{v!r}，应为 YYYY-MM-DD")
                continue
            try:
                dt = datetime.fromisoformat(v.replace("Z", "+00:00"))
            except ValueError:
                self.add(ln[k], "error", "fm-date", f"{k} 不是有效日期：{v}")
                continue
            if k == "pubDate":
                pub = dt
            elif pub and dt.replace(tzinfo=None) < pub.replace(tzinfo=None):
                self.add(ln[k], "warning", "fm-date-order", "updatedDate 早于 pubDate")
        for k in BOOL_KEYS:
            if k in d and not isinstance(d[k], bool):
                self.add(ln[k], "error", "fm-type", f"{k} 必须是 true 或 false")
        tags = d.get("tags")
        if "tags" in d and tags is not None and not (isinstance(tags, list) and all(isinstance(x, str) for x in tags)):
            self.add(ln["tags"], "error", "fm-type", "tags 必须是字符串数组，如 [LLM, Transformer]")
            tags = None
        if "category" in d and d["category"] is not None and not isinstance(d["category"], str):
            self.add(ln["category"], "error", "fm-type", "category 必须是字符串")
        if d.get("lang") is not None and not isinstance(d.get("lang"), str):
            self.add(ln["lang"], "error", "fm-type", "lang 必须是字符串")
        if isinstance(d.get("title"), str) and d["title"].lstrip().startswith("#"):
            self.add(ln["title"], "warning", "fm-title-hash", "标题以 # 开头，在 YAML 中需要加引号")
        # 标签 / 分类对照
        if isinstance(tags, list):
            seen: dict[str, str] = {}
            for t in tags:
                prev_t = seen.get(t.casefold())
                if prev_t is not None:
                    why = "重复" if prev_t == t else f"与 {prev_t!r} 仅大小写不同"
                    self.add(ln["tags"], "warning", "tag-duplicate", f"标签 {t!r} 在本文中{why}")
                else:
                    seen[t.casefold()] = t
        if self.root:
            ex_tags, ex_cats = _wisp.collect_taxonomy(self.root, exclude=self.path)
            if isinstance(tags, list):
                for t in tags:
                    sim = _wisp.similar_names(t, ex_tags)
                    if sim:
                        self.add(ln["tags"], "warning", "tag-similar", f"标签 {t!r} 与已有标签 {', '.join(map(repr, sim))} 写法相近或仅大小写不同，请统一为已有写法")
            c = d.get("category")
            if isinstance(c, str) and c:
                sim = _wisp.similar_names(c, ex_cats)
                if sim:
                    self.add(ln["category"], "warning", "category-similar", f"分类 {c!r} 与已有分类 {', '.join(map(repr, sim))} 写法相近或仅大小写不同，请统一为已有写法")

    # ------------------------------------------------------------ 标题
    def check_headings(self, masked: list[str], body: list[str]) -> None:
        prev = 1  # frontmatter 的 title 相当于 h1
        for i, l in enumerate(masked, 1):
            m = re.match(r"^(#{1,6})\s+\S", l)
            raw_line = body[i - 1] if i - 1 < len(body) else l
            m_hash = re.match(r"^(#{1,6})\s+", l)
            if m:
                n = len(m.group(1))
            elif m_hash and "`" in raw_line:
                n = len(m_hash.group(1))
                m = m_hash
            elif re.match(r"^\s*<h([1-6])\b", l):
                n = int(re.match(r"^\s*<h([1-6])", l).group(1))
            else:
                continue
            if m:
                raw_h = raw_line[m.end(1) :].strip()
                raw_no_math = re.sub(r"(?<![\\$\w])\$(?![\s$])[^$\n]+?(?<![\s\\])\$(?![\d$])", "", raw_h)
                if "`" in raw_h or re.search(r"(?<![A-Za-z0-9_])O\([^)\n]+\)", raw_no_math):
                    self.add(i, "warning", "heading-code", "小标题中不要包含行内代码或纯文本复杂度公式")
            if n == 1:
                self.add(i, "error", "heading-h1", "正文中不要使用一级标题，标题由 frontmatter 的 title 生成，正文从 h2 开始")
                continue
            if n > prev + 1:
                self.add(i, "error", "heading-skip", f"标题层级跳级：h{prev} 之后直接出现 h{n}")
            prev = n

    # ------------------------------------------------------------ 图片与图表
    def check_images(self, masked: list[str]) -> None:
        text = "\n".join(masked)
        for m in re.finditer(r"!\[([^\]\n]*)\]\(\s*<?([^)\s>]+)>?(?:\s+(?:\"([^\"]*)\"|'([^']*)'))?\s*\)", text):
            ln = self.line_of(text, m.start())
            alt, src = m.group(1), m.group(2)
            if not alt.strip():
                self.add(ln, "error", "img-alt", f"图片缺少 alt：{src}（描述图要表达的结论）")
            self.check_ref(ln, src)
        for m in re.finditer(r"<img\b[^>]*>", text, flags=re.S):
            if not re.search(r"\balt\s*=\s*(\"[^\"]+\"|'[^']+'|\{[^}]+\})", m.group(0)):
                self.add(self.line_of(text, m.start()), "error", "img-alt", "<img> 缺少非空 alt")
        for m in re.finditer(r"<(Diagram|Figure)\b(.*?)/?>", text, flags=re.S):
            attrs = m.group(2)
            ln = self.line_of(text, m.start())
            sm = re.search(r"\bsrc\s*=\s*\"([^\"]+)\"", attrs)
            if m.group(1) == "Diagram" and not re.search(r"\balt\s*=\s*(\"[^\"]+\"|\{[^}]+\})", attrs):
                self.add(ln, "error", "img-alt", "<Diagram> 缺少 alt")
            if m.group(1) == "Figure" and sm and not re.search(r"\balt\s*=", attrs):
                self.add(ln, "error", "img-alt", "<Figure> 传了 src 但缺少 alt")
            if sm:
                self.check_ref(ln, sm.group(1))

    def check_ref(self, ln: int, src: str) -> None:
        if re.match(r"^([a-z][a-z0-9+.-]*:|//|/|#)", src, re.I):
            return
        clean = re.split(r"[#?]", src, maxsplit=1)[0]
        target = (self.path.parent / clean).resolve()
        is_diagram = clean.endswith((".excalidraw", ".drawio"))
        if is_diagram or re.search(r"\.(png|jpe?g|gif|webp|avif|svg)$", clean, re.I):
            if not target.is_file():
                self.add(ln, "error", "diagram-missing" if is_diagram else "img-missing", f"引用的文件不存在：{clean}")
                return
        if is_diagram:
            stem = target.with_suffix("")
            svg = stem.with_name(stem.name + ".wisp.svg")
            if not svg.is_file():
                self.add(ln, "warning", "diagram-svg-missing", f"{svg.name} 不存在，请用 wisp-diagram skill 构建（wisp-diagram build）")

    # ------------------------------------------------------------ MDX 组件
    def check_components(self, masked: list[str], body: list[str]) -> None:
        text = "\n".join(masked)
        used: dict[str, int] = {}
        for m in re.finditer(r"<([A-Z][\w]*)(?:\.[\w.]+)?(?=[\s/>])", text):
            used.setdefault(m.group(1), self.line_of(text, m.start()))
        if not used:
            return
        if not self.is_mdx:
            for n, ln in used.items():
                self.add(ln, "error", "md-component", f"<{n}> 出现在 .md 文件中；.md 不能使用组件，请改名为 index.mdx")
            return
        names: set[str] = set()
        for m in re.finditer(r"^\s*import\s+(.+?)\s+from\s+['\"][^'\"]+['\"]", "\n".join(body), flags=re.M | re.S):
            spec = m.group(1)
            for b in re.findall(r"\{([^}]*)\}", spec):
                for part in b.split(","):
                    p = part.strip().split(" as ")[-1].strip()
                    if p:
                        names.add(p)
            spec = re.sub(r"\{[^}]*\}", "", spec)
            for part in spec.split(","):
                p = part.strip().replace("* as", "").strip()
                if p:
                    names.add(p)
        for m in re.finditer(r"^\s*export\s+(?:const|function|class)\s+(\w+)", "\n".join(body), flags=re.M):
            names.add(m.group(1))
        for n, ln in used.items():
            if n not in names and n != "Fragment":
                self.add(ln, "error", "mdx-import", f"使用了 <{n}> 但没有 import（例如 import {n} from './{n}'）")

    # ------------------------------------------------------------ 代码块
    def check_fences(self) -> None:
        for start, end, info, body in self.fences:
            lang = info.split()[0].split("{")[0] if info else ""
            if not lang:
                self.add(start, "warning", "code-lang", "代码块缺少语言标识（纯文本用 text）")

    # ------------------------------------------------------------ 硬编码颜色
    def check_hardcoded(self, masked: list[str]) -> None:
        for i, l in enumerate(masked, 1):
            s = re.sub(r"\]\([^)]*\)", "]()", l)  # 链接目标可能含 #anchor
            s = re.sub(r"<https?://[^>]*>|https?://\S+", "", s)
            for m in re.finditer(r"(?<![\w&/#])#([0-9a-fA-F]{3,8})(?![\w-])", s):
                h = m.group(1)
                if len(h) in (3, 4, 6, 8) and (len(h) >= 6 or re.search(r"[a-fA-F]", h)):
                    self.add(i, "warning", "hardcoded-color", f"正文中出现十六进制颜色 #{h}；颜色只能来自主题变量（var(--wisp-*)）")
            if re.search(r"\bstyle\s*=", s):
                self.add(i, "warning", "inline-style", "正文中使用了 style=；样式应由主题提供，不要内联")

    # ------------------------------------------------------------ 标点
    def check_punct(self, masked: list[str]) -> None:
        for i, l in enumerate(masked, 1):
            if not CJK_RE.search(l):
                continue
            s = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", l)
            s = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", s)
            s = re.sub(r"<[^>\n]*>", "", s)
            s = re.sub(r"^\s*(?:import|export)\s.*$", "", s)
            s = re.sub(r"\[\^[^\]]+\]", "", s)
            s = re.sub(r"\{[^{}\n]*\}", "", s)
            found = []
            for m in re.finditer(f"(?:(?<=[{CJK}])[,;:!?()](?!/)|[,;:!?()](?=[{CJK}])|(?<=[{CJK}])\\.(?=\\s|$))", s):
                found.append(m.group(0))
            if found:
                uniq = "".join(dict.fromkeys(found))
                self.add(i, "warning", "halfwidth-punct", f"中文语境中使用了半角标点 {uniq}，请改为全角")

    # ------------------------------------------------------------ 风格警告
    def check_style_warnings(self, masked: list[str], body: list[str]) -> None:
        text = "\n".join(masked)
        text = re.sub(r"^\s*(?:import|export)\s.*$", blank, text, flags=re.M)
        text = re.sub(r"<[A-Za-z][^>]*>", blank, text, flags=re.S)
        text = re.sub(r"!\[[^\]]*\]\([^)]*\)", blank, text)
        text = re.sub(r"\]\([^)]*\)", "]()", text)
        corner_line: int | None = None
        curly_line: int | None = None
        for i, l in enumerate(text.split("\n"), 1):
            if corner_line is None and re.search(r"[「」『』]", l):
                corner_line = i
            if curly_line is None and re.search(r"[“”]", l):
                curly_line = i
        if corner_line is not None and curly_line is not None:
            self.add(corner_line, "warning", "quote-mixed", "正文中同时使用了直角引号「」和弯引号“”，请统一为弯引号“”")

        for i, l in enumerate(masked, 1):
            if not re.match(r"^\s*[-*]\s+", l) or i - 1 >= len(body):
                continue
            raw_l = body[i - 1]
            if not re.match(r"^\s*[-*]\s+\*\*[^*]+\*\*[：:]", raw_l):
                continue
            vis = re.sub(r"\[\^[^\]]+\]", "", raw_l)
            vis = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", vis)
            vis = re.sub(r"(?<![\\$\w])\$(?![\s$])[^$\n]+?(?<![\s\\])\$(?![\d$])", "X", vis)
            vis = re.sub(r"^\s*[-*]\s+", "", vis).replace("**", "").replace("`", "").strip()
            if len(vis) > 80:
                self.add(i, "warning", "ppt-bold-bullet", f"避免使用「粗体词头+长段解释」的 PPT 列表（当前 {len(vis)} 字），请拆写为自然段落或短条目")

        inline_text = "\n".join(self.unmasked_inline)
        inline_text = re.sub(r"^\s*(?:import|export)\s.*$", blank, inline_text, flags=re.M)
        inline_text = re.sub(r"<[A-Za-z][^>]*>", blank, inline_text, flags=re.S)
        inline_text = re.sub(r"!\[[^\]]*\]\([^)]*\)", blank, inline_text)
        inline_text = re.sub(r"\]\([^)]*\)", "]()", inline_text)
        inline_text = re.sub(r"(?<![\\$\w])\$(?![\s$])[^$\n]+?(?<![\s\\])\$(?![\d$])", blank, inline_text)
        for i, l in enumerate(inline_text.split("\n"), 1):
            for m in re.finditer(r"(?<!`)(`+)([^`\n]+?)\1(?!`)", l):
                if len(m.group(1)) == 1 and re.fullmatch(r"\d+(?:\.\d+)?", m.group(2)):
                    self.add(i, "warning", "backtick-number", f"纯数字 {m.group(0)} 不要用反引号包裹")

    # ------------------------------------------------------------ TODO 占位
    def check_todo(self, masked: list[str]) -> None:
        for i, l in enumerate(masked, 1):
            if "TODO" in l:
                self.add(i, "warning", "todo", "还有未处理的 TODO 占位")


    def check_footnotes(self, masked: list[str]) -> None:
        """引用（GFM 脚注）：用到的 key 必须有定义，定义必须被用到，同一个 key 只定义一次。"""
        defs: dict[str, int] = {}
        refs: dict[str, int] = {}
        for i, l in enumerate(masked, 1):
            d = re.match(r"^\[\^([^\]\s]+)\]:", l)
            if d:
                key = d.group(1).lower()
                if key in defs:
                    self.add(i, "error", "fn-duplicate", f"引用 [^{d.group(1)}] 重复定义（第一次在第 {defs[key]} 行）")
                else:
                    defs[key] = i
                rest = l[d.end():]
            else:
                rest = l
            for m in re.finditer(r"\[\^([^\]\s]+)\](?!:)", rest):
                refs.setdefault(m.group(1).lower(), i)
        for key, ln in refs.items():
            if key not in defs:
                self.add(ln, "error", "fn-undefined", f"引用 [^{key}] 没有定义：在文末加 `[^{key}]: 出处`")
        for key, ln in defs.items():
            if key not in refs:
                self.add(ln, "warning", "fn-unused", f"引用 [^{key}] 有定义但正文里没有用到（不会显示）")


# ---------------------------------------------------------------- CLI


def resolve_targets(args: list[str], root: Path | None) -> tuple[list[Path], list[str]]:
    files: list[Path] = []
    errs: list[str] = []
    for a in args:
        p = Path(a)
        cands = [p]
        if root:
            cands += [_wisp.posts_dir(root) / a]
        hit = False
        for c in cands:
            if c.is_file():
                files.append(c)
                hit = True
            elif c.is_dir():
                found = sorted(list(c.glob("index.md")) + list(c.glob("index.mdx")))
                if found:
                    files += found
                else:
                    files += sorted(f for f in list(c.rglob("*.md")) + list(c.rglob("*.mdx")))
                hit = True
            else:
                for ext in (".md", ".mdx"):
                    q = Path(str(c) + ext)
                    if q.is_file():
                        files.append(q)
                        hit = True
            if hit:
                break
        if not hit:
            errs.append(f"找不到文章：{a}")
    seen, out = set(), []
    for f in files:
        r = f.resolve()
        if r not in seen:
            seen.add(r)
            out.append(f)
    return out, errs


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="检查 Wisp 文章")
    ap.add_argument("targets", nargs="*", help="slug、文件或目录")
    ap.add_argument("--all", action="store_true", help="检查 src/content/posts 下的全部文章")
    ap.add_argument("--strict", action="store_true", help="warning 也使退出码非零")
    ap.add_argument("--json", action="store_true", help="以 JSON 输出")
    ap.add_argument("--root", help="站点根目录，默认从当前目录向上查找")
    ap.add_argument("--quiet", action="store_true", help="不输出汇总行")
    a = ap.parse_args(argv)

    root = _wisp.find_root(a.root)
    if not a.targets and not a.all:
        ap.print_usage(sys.stderr)
        print("错误：请给出文章 slug/路径，或使用 --all", file=sys.stderr)
        return 2
    if (a.all or any(not Path(t).exists() for t in a.targets)) and root is None:
        print("错误：" + _wisp.NO_SITE_HINT, file=sys.stderr)
        return 2
    if a.all:
        files = _wisp.list_post_files(root)
        errs: list[str] = []
        if not files:
            print(f"错误：{_wisp.posts_dir(root)} 下没有文章", file=sys.stderr)
            return 2
    else:
        files, errs = resolve_targets(a.targets, root)
    if errs:
        for e in errs:
            print("错误：" + e, file=sys.stderr)
        return 2

    findings: list[Finding] = []
    for f in files:
        try:
            disp = str(f.resolve().relative_to(Path.cwd().resolve()))
        except ValueError:
            disp = str(f)
        findings += Checker(f, disp, root).run()

    counts = {lv: sum(1 for x in findings if x.level == lv) for lv in ("error", "warning", "info")}
    if a.json:
        print(json.dumps({"files": len(files), "summary": counts, "findings": [asdict(x) for x in findings]}, ensure_ascii=False, indent=2))
    else:
        for x in findings:
            print(f"{x.file}:{x.line} {x.level} {x.rule} {x.message}")
        if not a.quiet:
            print(f"检查了 {len(files)} 篇文章：{counts['error']} 个错误，{counts['warning']} 个警告，{counts['info']} 个提示", file=sys.stderr)
    bad = counts["error"] or (a.strict and counts["warning"])
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
