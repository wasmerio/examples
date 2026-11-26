import sys
from pathlib import Path

import pytest

SCRIPTS = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(SCRIPTS))

GOOD = """---
title: "缩放点积的方差"
description: "说明为什么点积注意力要除以 √d。"
pubDate: 2026-11-06
tags: [LLM, 注意力]
category: 机器学习
---

开头一段，直接给出结论。

## 直觉

行内公式 $d_k = 64$ 和 `code,x` 不应误报。

$$
y = f(x, z)
$$

## 实现

```python
print("a,b")
```

```mermaid
flowchart LR
    A["输入"] --> B["输出"]
```
"""


@pytest.fixture
def site(tmp_path):
    """最小 Wisp 站点：astro.config.mjs + src/content/posts。"""
    (tmp_path / "astro.config.mjs").write_text("export default {};\n")
    posts = tmp_path / "src" / "content" / "posts"
    posts.mkdir(parents=True)
    return tmp_path


@pytest.fixture
def write_post(site):
    def _w(slug, text, ext="mdx", files=()):
        d = site / "src" / "content" / "posts" / slug
        d.mkdir(parents=True, exist_ok=True)
        for rel in files:
            f = d / rel
            f.parent.mkdir(parents=True, exist_ok=True)
            f.write_text("{}")
        p = d / f"index.{ext}"
        p.write_text(text, encoding="utf-8")
        return p

    return _w


def run_check(path, root, *extra):
    import check_post

    chk = check_post.Checker(path, str(path), root)
    return chk.run()


def rules(findings):
    return {f.rule for f in findings}


@pytest.fixture
def check():
    return run_check
