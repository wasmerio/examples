# Noto Sans SC variable font

The site self-hosts Noto Sans SC, subset from the official Google Fonts variable font:

- Font: https://github.com/google/fonts/tree/main/ofl/notosanssc
- Original variable TTF: https://github.com/google/fonts/raw/main/ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf
- License: SIL Open Font License 1.1, included as `OFL.txt`

`scripts/subset-font.py` writes two WOFF2 files:

- `NotoSansSC-base.woff2` contains the characters used in this repository, plus Latin and common punctuation. Pages preload this file.
- `NotoSansSC-common.woff2` contains the rest of GB2312. The browser downloads it only when a page uses one of those characters.

Characters outside those sets use the next installed CJK font. After adding a lot of new copy, run `python3 scripts/subset-font.py` to move those characters into the base file. `python3 scripts/subset-font.py --check` fails when source text would download the larger file, or when `font-face.css` no longer matches the font files. The script uses a local full font when one is present, and otherwise downloads the upstream TTF.
