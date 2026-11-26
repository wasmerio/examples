#!/usr/bin/env python3
"""Popular CI guard: every image must have alt text.

Checks two things across the directories passed as arguments:
  - built HTML: every <img> tag must carry a non-empty alt attribute
  - markdown/MDX sources: no image with empty alt text, i.e. ![](...)

Usage: check-image-alt.py <dir> [<dir> ...]
Exits 1 and lists offenders if any image is missing alt text.
"""
import pathlib
import re
import sys

IMG_TAG = re.compile(r"<img\b[^>]*>", re.I)
# Minifiers drop the quotes (alt=Popular), so accept an unquoted value too:
# a quoted-only pattern reports every image in a minified build as missing
# alt text, which reads as 61 real failures and is none.
ALT_ATTR = re.compile(
    r"""\balt\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))""", re.I)
MD_EMPTY_ALT = re.compile(r"!\[\s*\]\(")

bad = []
for root in sys.argv[1:]:
    for p in sorted(pathlib.Path(root).rglob("*")):
        if p.suffix == ".html":
            for tag in IMG_TAG.findall(p.read_text(errors="ignore")):
                m = ALT_ATTR.search(tag)
                if not m or not (m.group(2) or m.group(3) or m.group(4) or "").strip():
                    bad.append(f"{p}: {tag[:140]}")
        elif p.suffix in {".md", ".mdx"}:
            for i, line in enumerate(p.read_text(errors="ignore").splitlines(), 1):
                if MD_EMPTY_ALT.search(line):
                    bad.append(f"{p}:{i}: markdown image with empty alt text")

if bad:
    print(f"{len(bad)} image(s) missing alt text:")
    for b in bad:
        print(f"  {b}")
    sys.exit(1)
print("check-image-alt: all images have alt text")
