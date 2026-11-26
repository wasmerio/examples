"""wisp-writer 脚本共用的工具：站点根目录查找、frontmatter 解析、文章枚举。

只依赖标准库。被 new_post.py 和 check_post.py 导入，不单独运行。
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from pathlib import Path

POSTS_REL = Path("src") / "content" / "posts"
ASTRO_CONFIGS = ("astro.config.mjs", "astro.config.ts", "astro.config.js", "astro.config.cjs", "astro.config.mts")

NO_SITE_HINT = (
    "找不到 Wisp 站点：从当前目录向上没有发现 astro.config.* 或 src/content。\n"
    "请在站点根目录运行，或用 --root <站点根目录> 指定。"
)


def is_site_root(p: Path) -> bool:
    return any((p / n).is_file() for n in ASTRO_CONFIGS) or (p / "src" / "content").is_dir()


def find_root(explicit: str | None = None, start: Path | None = None) -> Path | None:
    """依次尝试：--root、当前目录向上、脚本所在目录向上。"""
    if explicit:
        p = Path(explicit).expanduser().resolve()
        return p if is_site_root(p) else None
    for base in (start or Path.cwd(), Path(__file__).resolve().parent):
        base = base.resolve()
        for cand in (base, *base.parents):
            if is_site_root(cand):
                return cand
    return None


def posts_dir(root: Path) -> Path:
    return root / POSTS_REL


def list_post_files(root: Path) -> list[Path]:
    """与 content.config.ts 的 glob 一致：**/index.{md,mdx} 和顶层 *.{md,mdx}。"""
    d = posts_dir(root)
    if not d.is_dir():
        return []
    out = set(d.glob("*.md")) | set(d.glob("*.mdx"))
    out |= set(d.rglob("index.md")) | set(d.rglob("index.mdx"))
    return sorted(out)


# ---------------------------------------------------------------- frontmatter


@dataclass
class Frontmatter:
    data: dict[str, object] = field(default_factory=dict)
    lines: dict[str, int] = field(default_factory=dict)  # 键 -> 行号（1 起）
    end_line: int = 0  # 结束 --- 所在行；没有 frontmatter 时为 0
    error: str | None = None
    error_line: int = 1


def _strip_comment(s: str) -> str:
    q = None
    for i, ch in enumerate(s):
        if q:
            if ch == q:
                q = None
        elif ch in "\"'":
            q = ch
        elif ch == "#" and (i == 0 or s[i - 1].isspace()):
            return s[:i].rstrip()
    return s.rstrip()


def _split_flow(s: str) -> list[str]:
    parts, cur, q = [], "", None
    for ch in s:
        if q:
            cur += ch
            if ch == q:
                q = None
        elif ch in "\"'":
            q = ch
            cur += ch
        elif ch == ",":
            parts.append(cur)
            cur = ""
        else:
            cur += ch
    if cur.strip():
        parts.append(cur)
    return [p.strip() for p in parts]


def _scalar(s: str):
    s = s.strip()
    if len(s) >= 2 and s[0] == '"' and s[-1] == '"':
        try:
            return json.loads(s)
        except ValueError:
            return s[1:-1]
    if len(s) >= 2 and s[0] == "'" and s[-1] == "'":
        return s[1:-1].replace("''", "'")
    if s in ("true", "True"):
        return True
    if s in ("false", "False"):
        return False
    if s in ("null", "~", ""):
        return None
    if s.startswith("[") and s.endswith("]"):
        return [_scalar(x) for x in _split_flow(s[1:-1])]
    return s


def parse_frontmatter(lines: list[str]) -> Frontmatter:
    fm = Frontmatter()
    if not lines or lines[0].strip() != "---":
        fm.error = "文件开头没有 frontmatter（需要以 --- 开始）"
        return fm
    end = next((i for i in range(1, len(lines)) if lines[i].strip() == "---"), None)
    if end is None:
        fm.error = "frontmatter 没有结束的 ---"
        return fm
    fm.end_line = end + 1
    i = 1
    while i < end:
        raw = lines[i]
        if not raw.strip() or raw.lstrip().startswith("#"):
            i += 1
            continue
        m = re.match(r"^([A-Za-z_][\w-]*)\s*:(?:\s+(.*)|\s*)$", raw)
        if not m or raw[0].isspace():
            fm.error, fm.error_line = f"无法解析的 frontmatter 行：{raw.strip()}", i + 1
            i += 1
            continue
        key, rest = m.group(1), _strip_comment(m.group(2) or "")
        fm.lines[key] = i + 1
        if rest in (">", "|", ">-", "|-"):
            buf = []
            i += 1
            while i < end and (lines[i].startswith((" ", "\t")) or not lines[i].strip()):
                buf.append(lines[i].strip())
                i += 1
            fm.data[key] = (" " if rest.startswith(">") else "\n").join(buf).strip()
            continue
        if rest == "":
            items, j = [], i + 1
            while j < end and re.match(r"^\s+-\s+", lines[j]):
                items.append(_scalar(_strip_comment(re.sub(r"^\s+-\s+", "", lines[j]))))
                j += 1
            if items:
                fm.data[key] = items
                i = j
                continue
            fm.data[key] = None
            i += 1
            continue
        fm.data[key] = _scalar(rest)
        i += 1
    return fm


def utf16_len(s: str) -> int:
    """zod 的 .max() 按 UTF-16 码元计数。"""
    return len(s.encode("utf-16-le")) // 2


# ---------------------------------------------------------------- 标签 / 分类


def norm_key(s: str) -> str:
    return re.sub(r"[\s_\-]+", "", s).casefold()


def similar_names(name: str, existing: dict[str, int]) -> list[str]:
    """返回与 name 仅大小写、空格、下划线或连字符不同的已有名字（不含完全相同的）。"""
    if name in existing:
        return []
    return [e for e in existing if norm_key(e) == norm_key(name)]


def collect_taxonomy(root: Path, exclude: Path | None = None) -> tuple[dict[str, int], dict[str, int]]:
    tags: dict[str, int] = {}
    cats: dict[str, int] = {}
    for f in list_post_files(root):
        if exclude and f.resolve() == exclude.resolve():
            continue
        try:
            fm = parse_frontmatter(f.read_text(encoding="utf-8").splitlines())
        except OSError:
            continue
        t = fm.data.get("tags")
        if isinstance(t, list):
            for x in t:
                if isinstance(x, str):
                    tags[x] = tags.get(x, 0) + 1
        c = fm.data.get("category")
        if isinstance(c, str) and c:
            cats[c] = cats.get(c, 0) + 1
    return tags, cats
