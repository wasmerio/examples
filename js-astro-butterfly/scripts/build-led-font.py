"""
Build src/assets/fonts/unidream-led.woff2 for the aside clock.

  pip install fonttools brotli
  python scripts/build-led-font.py

- Subsets UnidreamLED (free LED font, scripts/assets/UnidreamLED.ttf) to the
  characters the clock prints.
- Makes the digits tabular: the font has proportional figures (`1` is 344
  units, the rest 948) and no `tnum` feature, so the ticking clock changed
  width every time a 1 appeared. `1` is widened to the common advance and its
  outline centred in it (standard tabular-figure behaviour).
  The colon and space keep their width (they never swap with a digit).
"""
from pathlib import Path

from fontTools.subset import Options, Subsetter
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "scripts/assets/UnidreamLED.ttf"
OUT = ROOT / "src/assets/fonts/unidream-led.woff2"
TEXT = "0123456789:-./ %°CAPMSUNMOTUEWEDTHUFRISAT"

font = TTFont(SRC)
cmap = font.getBestCmap()
glyf, hmtx = font["glyf"], font["hmtx"]

digits = [cmap[ord(c)] for c in "0123456789"]
advance = max(hmtx[g][0] for g in digits)
for name in digits:
    adv, lsb = hmtx[name]
    dx = (advance - adv) // 2  # centre the narrow `1` in the common advance
    if not dx:
        continue
    glyph = glyf[name]
    if glyph.isComposite():
        for comp in glyph.components:
            comp.x += dx
    else:
        coords = glyph.coordinates
        coords.translate((dx, 0))
    glyph.recalcBounds(glyf)
    hmtx[name] = (advance, lsb + dx)

# The font maps U+00B0 to an empty glyph (no outline, 851 wide), so "-15°C"
# showed a blank gap. Draw a seven-segment style degree: a small ring of four
# separate bars at cap height, with the digits' side bearing and a narrow advance.
from fontTools.pens.ttGlyphPen import TTGlyphPen

SIDE, TOP, BOX, BAR, GAP = 57, 1434, 520, 170, 40
x0, x1, y0, y1 = SIDE, SIDE + BOX, TOP - BOX, TOP
pen = TTGlyphPen(None)
for (left, bottom, right, top) in (
    (x0 + GAP, y1 - BAR, x1 - GAP, y1),  # top bar
    (x0 + GAP, y0, x1 - GAP, y0 + BAR),  # bottom bar
    (x0, y0 + BAR + GAP, x0 + BAR, y1 - BAR - GAP),  # left bar
    (x1 - BAR, y0 + BAR + GAP, x1, y1 - BAR - GAP),  # right bar
):
    # clockwise = filled outline in TrueType
    pen.moveTo((left, bottom))
    pen.lineTo((left, top))
    pen.lineTo((right, top))
    pen.lineTo((right, bottom))
    pen.closePath()
degree = cmap[0xB0]
glyf[degree] = pen.glyph()
glyf[degree].recalcBounds(glyf)
hmtx[degree] = (x1 + SIDE, SIDE)

options = Options()
options.flavor = "woff2"
options.layout_features = []
options.name_IDs = [1, 2]
subsetter = Subsetter(options)
subsetter.populate(text=TEXT)
subsetter.subset(font)
OUT.parent.mkdir(parents=True, exist_ok=True)
font.flavor = "woff2"
font.save(OUT)
print(f"{OUT.relative_to(ROOT)}: {OUT.stat().st_size} bytes, digit advance {advance}")
