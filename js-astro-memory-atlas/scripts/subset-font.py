#!/usr/bin/env python3
"""Build the self-hosted Noto Sans SC subsets used by the site.

The full variable font is about 7.5MB. Visitors only need the characters on
the page, so this writes two WOFF2 files:

- NotoSansSC-base.woff2: characters used in the repository, plus Latin and
  common punctuation. This is the file pages preload.
- NotoSansSC-common.woff2: the rest of GB2312, requested only when a page
  contains one of those characters.

Characters outside those sets fall back to a system CJK font. Re-run this
after adding a large amount of copy if you want those characters in the base
file. Pass --source to a local full variable font, or let the script download
the upstream TTF from the Google Fonts repository.
"""

from __future__ import annotations

import argparse
import re
import tempfile
import urllib.request
from io import BytesIO
from pathlib import Path

from fontTools.subset import Options, Subsetter
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
FONT_DIR = ROOT / 'src' / 'assets' / 'fonts'
BASE_PATH = FONT_DIR / 'NotoSansSC-base.woff2'
COMMON_PATH = FONT_DIR / 'NotoSansSC-common.woff2'
CSS_PATH = ROOT / 'src' / 'styles' / 'font-face.css'
UPSTREAM = 'https://github.com/google/fonts/raw/main/ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf'
TEXT_SUFFIXES = {'.js', '.astro', '.css', '.md', '.svg', '.mjs', '.yml', '.txt', '.html'}


def repo_text() -> str:
    chunks = []
    for path in ROOT.rglob('*'):
        if any(part in {'.git', 'node_modules', 'dist', 'src/assets/fonts'} for part in path.parts):
            continue
        if path.suffix.lower() not in TEXT_SUFFIXES or not path.is_file():
            continue
        chunks.append(path.read_text(encoding='utf-8', errors='ignore'))
    return ''.join(chunks)


def gb2312_characters() -> set[str]:
    characters = set()
    for high in range(0xA1, 0xF8):
        for low in range(0xA1, 0xFF):
            try:
                characters.add(bytes([high, low]).decode('gb2312'))
            except UnicodeDecodeError:
                continue
    return characters


def extra_characters() -> str:
    codepoints = (
        list(range(0x20, 0x7F))
        + list(range(0xA0, 0x100))
        + list(range(0x2000, 0x206F))
        + list(range(0x3000, 0x303F))
        + list(range(0xFF00, 0xFFEF))
    )
    return ''.join(chr(value) for value in codepoints)


def unicode_range(codepoints: set[int]) -> str:
    ordered = sorted(codepoints)
    if not ordered:
        return 'U+0'
    ranges = []
    start = previous = ordered[0]
    for value in ordered[1:]:
        if value == previous + 1:
            previous = value
            continue
        ranges.append((start, previous))
        start = previous = value
    ranges.append((start, previous))
    return ', '.join(f'U+{start:X}' if start == end else f'U+{start:X}-{end:X}' for start, end in ranges)


def subset_font(source: TTFont, text: str) -> tuple[bytes, set[int]]:
    font = clone_font(source)
    options = Options()
    options.flavor = 'woff2'
    options.layout_features = ['*']
    options.recommended_glyphs = True
    options.notdef_outline = True
    options.name_IDs = ['*']
    options.name_legacy = True
    options.name_languages = ['*']
    options.hinting = True
    options.desubroutinize = False
    subsetter = Subsetter(options=options)
    subsetter.populate(text=text)
    subsetter.subset(font)
    buffer = BytesIO()
    font.flavor = 'woff2'
    font.save(buffer)
    return buffer.getvalue(), set(font.getBestCmap())


def clone_font(font: TTFont) -> TTFont:
    buffer = BytesIO()
    font.save(buffer)
    buffer.seek(0)
    return TTFont(buffer)


def load_source(path: Path | None) -> TTFont:
    if path:
        return TTFont(path)
    local = FONT_DIR / 'NotoSansSC-VF.woff2'
    if local.exists():
        return TTFont(local)
    destination = Path(tempfile.gettempdir()) / 'NotoSansSC-source.ttf'
    if not destination.exists() or destination.stat().st_size < 1_000_000:
        print(f'Downloading {UPSTREAM}')
        urllib.request.urlretrieve(UPSTREAM, destination)
    return TTFont(destination)


def face(family: str, filename: str, codepoints: set[int]) -> str:
    return (
        '@font-face {\n'
        f'  font-family: "{family}";\n'
        f'  src: url("../assets/fonts/{filename}") format("woff2");\n'
        '  font-style: normal;\n'
        '  font-weight: 100 900;\n'
        '  font-display: swap;\n'
        f'  unicode-range: {unicode_range(codepoints)};\n'
        '}\n'
    )


def parse_unicode_range(value: str) -> set[int]:
    codepoints = set()
    for part in value.split(','):
        match = re.fullmatch(r'U\+([0-9A-F]+)(?:-([0-9A-F]+))?', part.strip(), re.IGNORECASE)
        if not match:
            continue
        start = int(match.group(1), 16)
        end = int(match.group(2), 16) if match.group(2) else start
        codepoints.update(range(start, end + 1))
    return codepoints


def css_ranges(css: str) -> dict[str, set[int]]:
    ranges = {}
    for filename, value in re.findall(r'url\("\.\./assets/fonts/([^"]+)"\).*?unicode-range:\s*([^;]+);', css, re.S):
        ranges[filename] = parse_unicode_range(value)
    return ranges


def check_subsets() -> None:
    ranges = css_ranges(CSS_PATH.read_text(encoding='utf-8'))
    base_cmap = set(TTFont(BASE_PATH).getBestCmap())
    common_cmap = set(TTFont(COMMON_PATH).getBestCmap())
    if ranges.get(BASE_PATH.name) != base_cmap or ranges.get(COMMON_PATH.name) != common_cmap:
        raise SystemExit('font-face.css unicode-range does not match the subset files. Re-run python3 scripts/subset-font.py')
    used = {ord(character) for character in repo_text()}
    leaked = sorted(codepoint for codepoint in used if codepoint in common_cmap and codepoint not in base_cmap)
    if leaked:
        sample = ''.join(chr(codepoint) for codepoint in leaked[:12])
        raise SystemExit(f'{len(leaked)} source characters would download the large font, including {sample!r}. Re-run python3 scripts/subset-font.py')
    print(f'font subsets cover the source copy; base {BASE_PATH.stat().st_size} bytes')


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--source', type=Path)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    if args.check:
        check_subsets()
        return
    source = load_source(args.source)
    source_cmap = set(source.getBestCmap())
    used = {character for character in repo_text() if ord(character) in source_cmap}
    base_text = ''.join(sorted(used)) + extra_characters()
    base_bytes, base_cmap = subset_font(source, base_text)
    missing = sorted(character for character in used if ord(character) not in base_cmap)
    if missing:
        raise SystemExit(f'Base subset is missing {len(missing)} source characters, including {missing[:8]!r}')
    common_text = ''.join(sorted(character for character in gb2312_characters() if ord(character) in source_cmap and ord(character) not in base_cmap))
    common_bytes, common_cmap = subset_font(source, common_text)
    overlap = base_cmap & common_cmap
    if overlap:
        raise SystemExit(f'Font subsets overlap at {len(overlap)} codepoints')
    FONT_DIR.mkdir(parents=True, exist_ok=True)
    BASE_PATH.write_bytes(base_bytes)
    COMMON_PATH.write_bytes(common_bytes)
    CSS_PATH.write_text(
        '/* Generated by scripts/subset-font.py. Ranges match glyphs actually in each file. */\n'
        + face('Noto Sans SC', BASE_PATH.name, base_cmap)
        + '\n'
        + face('Noto Sans SC', COMMON_PATH.name, common_cmap),
        encoding='utf-8',
    )
    print(f'base {len(base_bytes)} bytes, {len(base_cmap)} codepoints')
    print(f'common {len(common_bytes)} bytes, {len(common_cmap)} codepoints')


if __name__ == '__main__':
    main()
