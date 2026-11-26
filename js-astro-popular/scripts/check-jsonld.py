#!/usr/bin/env python3
"""Validate every <script type="application/ld+json"> block in built HTML.

Usage: python3 scripts/check-jsonld.py <built-dir> [<built-dir> ...]

Fails if any block is not valid JSON or lacks @context/@type. On a subpath
build, also asserts every url/image/logo value is absolute. Shared between
hugo-theme-popular and astro-theme-popular (PARITY.md Tier 1)."""
import json
import re
import sys
import pathlib

BLOCK = re.compile(
    r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', re.S)
URL_KEYS = ("url", "image", "logo")


def abs_ok(value):
    return isinstance(value, str) and (
        value.startswith("http://") or value.startswith("https://"))


def walk_urls(obj, problems, where):
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k in URL_KEYS and isinstance(v, str) and not abs_ok(v):
                problems.append(f"{where}: non-absolute {k}={v!r}")
            walk_urls(v, problems, where)
    elif isinstance(obj, list):
        for v in obj:
            walk_urls(v, problems, where)


def main(dirs):
    errors = []
    checked = 0
    for d in dirs:
        for html in pathlib.Path(d).rglob("*.html"):
            text = html.read_text(encoding="utf-8")
            for raw in BLOCK.findall(text):
                checked += 1
                try:
                    data = json.loads(raw)
                except json.JSONDecodeError as e:
                    errors.append(f"{html}: invalid JSON: {e}")
                    continue
                blocks = data if isinstance(data, list) else [data]
                for b in blocks:
                    if not isinstance(b, dict) or "@context" not in b or "@type" not in b:
                        errors.append(f"{html}: missing @context/@type")
                    walk_urls(b, errors, str(html))
    if errors:
        print("\n".join(errors))
        print(f"FAIL: {len(errors)} problem(s) in {checked} JSON-LD block(s)")
        return 1
    print(f"OK: {checked} JSON-LD block(s) valid")
    return 0


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit("usage: check-jsonld.py <built-dir> [...]")
    sys.exit(main(sys.argv[1:]))
