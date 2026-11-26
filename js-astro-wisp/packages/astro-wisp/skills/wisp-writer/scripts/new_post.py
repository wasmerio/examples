#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
"""创建一篇 Wisp 文章骨架。

    uv run skills/wisp-writer/scripts/new_post.py my-post --title "标题" --template deep-dive \
        --tags "LLM,Transformer" --category 机器学习 --description "一句话摘要"

生成 src/content/posts/<slug>/index.mdx（或 index.md）和空的 diagrams/ 目录。
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import _wisp  # noqa: E402

TEMPLATES_DIR = Path(__file__).resolve().parent.parent / "reference" / "templates"
SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
DESC_PLACEHOLDER = "TODO：用一两句话写清这篇文章解决什么问题（不超过 200 字）。"


def available_templates() -> dict[str, Path]:
    return {p.stem: p for p in sorted(TEMPLATES_DIR.glob("*.md*"))}


def yaml_str(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def split_list(s: str | None) -> list[str]:
    if not s:
        return []
    out = []
    for x in re.split(r"[,，、]", s):
        x = x.strip()
        if x and x not in out:
            out.append(x)
    return out


def render(template: str, *, title: str, description: str, pub: str, tags: list[str], category: str | None, draft: bool) -> str:
    tags_line = f"tags: [{', '.join(t if re.fullmatch(r'[\w一-鿿.+#-]+', t) else yaml_str(t) for t in tags)}]\n" if tags else ""
    subs = {
        "{{title}}": yaml_str(title),
        "{{description}}": yaml_str(description),
        "{{pubDate}}": pub,
        "{{tags_line}}": tags_line,
        "{{category_line}}": f"category: {yaml_str(category)}\n" if category else "",
        "{{draft_line}}": "draft: true\n" if draft else "",
    }
    for k, v in subs.items():
        template = template.replace(k, v)
    return template


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="创建 Wisp 文章骨架")
    ap.add_argument("slug", help="文章目录名，kebab-case，如 attention-explained")
    ap.add_argument("--title", help="标题（最多 80 字符），默认由 slug 生成")
    ap.add_argument("--template", default="note", help="模板：tutorial|deep-dive|algorithm|note|paper-reading（默认 note）")
    ap.add_argument("--tags", help="标签，逗号分隔，如 'LLM,Transformer'")
    ap.add_argument("--category", help="分类")
    ap.add_argument("--description", help="摘要（最多 200 字符）")
    ap.add_argument("--date", help="pubDate，YYYY-MM-DD，默认今天")
    ap.add_argument("--draft", action="store_true", help="标记为草稿（生产构建不包含）")
    g = ap.add_mutually_exclusive_group()
    g.add_argument("--mdx", action="store_true", help="生成 index.mdx（默认，note 模板默认为 index.md）")
    g.add_argument("--md", action="store_true", help="生成 index.md（模板含组件时不可用）")
    ap.add_argument("--root", help="站点根目录，默认从当前目录向上查找")
    ap.add_argument("--list-templates", action="store_true", help="列出可用模板后退出")
    a = ap.parse_args(argv)

    templates = available_templates()
    if a.list_templates:
        for n in templates:
            print(f"{n}\t{templates[n].suffix}")
        return 0
    if not templates:
        print(f"错误：找不到模板目录 {TEMPLATES_DIR}", file=sys.stderr)
        return 2
    if a.template not in templates:
        print(f"错误：未知模板 {a.template!r}，可选：{', '.join(templates)}", file=sys.stderr)
        return 2
    if not SLUG_RE.match(a.slug):
        print(f"错误：slug {a.slug!r} 不合法，请使用小写字母、数字和连字符（kebab-case），如 my-first-post", file=sys.stderr)
        return 2

    root = _wisp.find_root(a.root)
    if root is None:
        print("错误：" + _wisp.NO_SITE_HINT, file=sys.stderr)
        return 2

    title = a.title or a.slug.replace("-", " ").title()
    description = a.description or DESC_PLACEHOLDER
    if _wisp.utf16_len(title) > 80:
        print(f"错误：标题 {_wisp.utf16_len(title)} 个字符，超过 80", file=sys.stderr)
        return 2
    if _wisp.utf16_len(description) > 200:
        print(f"错误：description {_wisp.utf16_len(description)} 个字符，超过 200", file=sys.stderr)
        return 2
    pub = a.date or date.today().isoformat()
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", pub):
        print(f"错误：日期 {pub!r} 格式应为 YYYY-MM-DD", file=sys.stderr)
        return 2

    tpl_path = templates[a.template]
    tpl = tpl_path.read_text(encoding="utf-8")
    # 含 import 或交互组件（client:* 指令）的模板只能生成 .mdx
    needs_mdx = bool(re.search(r"^import\s|client:(load|idle|visible|media|only)", tpl, re.M))
    if a.md and needs_mdx:
        print(f"错误：模板 {a.template} 含交互组件，必须使用 MDX，请去掉 --md", file=sys.stderr)
        return 2
    ext = ".md" if a.md or (not a.mdx and tpl_path.suffix == ".md") else ".mdx"

    posts = _wisp.posts_dir(root)
    target_dir = posts / a.slug
    single = posts / f"{a.slug}.md"
    single_x = posts / f"{a.slug}.mdx"
    for p in (target_dir, single, single_x):
        if p.exists():
            print(f"错误：slug {a.slug!r} 已存在：{p.relative_to(root)}", file=sys.stderr)
            return 1

    tags = split_list(a.tags)
    category = a.category.strip() if a.category else None
    text = render(tpl, title=title, description=description, pub=pub, tags=tags, category=category, draft=a.draft)

    target_dir.mkdir(parents=True)
    (target_dir / "diagrams").mkdir()
    (target_dir / "diagrams" / ".gitkeep").write_text("", encoding="utf-8")
    out = target_dir / f"index{ext}"
    out.write_text(text, encoding="utf-8")

    print(f"已创建 {out.relative_to(root)}")
    print(f"已创建 {(target_dir / 'diagrams').relative_to(root)}/")

    # 标签与分类提示：尽量复用已有写法
    ex_tags, ex_cats = _wisp.collect_taxonomy(root, exclude=out)
    for t in tags:
        s = _wisp.similar_names(t, ex_tags)
        if s:
            print(f"提示：标签 {t!r} 与已有标签 {', '.join(map(repr, s))} 相近，建议复用已有写法")
    if category:
        s = _wisp.similar_names(category, ex_cats)
        if s:
            print(f"提示：分类 {category!r} 与已有分类 {', '.join(map(repr, s))} 相近，建议复用已有写法")
    if ex_tags:
        print("现有标签：" + "、".join(sorted(ex_tags)))
    if ex_cats:
        print("现有分类：" + "、".join(sorted(ex_cats)))
    print("下一步：填写正文（替换所有 TODO），然后运行 check_post.py 检查。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
