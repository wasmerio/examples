---
title: What I write down before every plot
description: Pen, paper and speed settings from a year of pen plotting, and the small script that sorts paths before they reach the machine.
pubDatetime: 2026-10-06T18:45:00+01:00
modDatetime: 2026-11-12T21:00:00+01:00
tags: [plotter, generative-art]
---

A pen plotter is slow and honest. A plot that takes forty minutes will show every mistake in the file. I started keeping a log after ruining the third sheet of good paper in one week.

## The log

Each plot gets one row. The wide columns are where the useful notes end up.

| Date   | Pen            | Paper            | Speed | Pen down |   Time | What went well                                                     | What went wrong                                                        |
| :----- | :------------- | :--------------- | ----: | -------: | -----: | :----------------------------------------------------------------- | :--------------------------------------------------------------------- |
| 03 Oct | Fineliner 0.3  | Bristol 250 g    |   25% |      40% | 38 min | Flow field lines stayed crisp even where they overlapped a lot     | The first few lines were faint because the pen had dried in the cap    |
| 05 Oct | Gel pen, white | Black card 300 g |   15% |      45% | 52 min | White on black hides small wobbles and looks good under a lamp     | Fast moves skipped ink, so I halved the speed halfway through the plot |
| 11 Oct | Brush pen      | Cartridge 160 g  |   10% |      55% | 1 h 20 | Line weight varies with direction, which suits the slower sketches | The paper buckled from the ink, tape all four edges next time          |

## Sorting the paths

Generative SVGs come out in the order the code made them. The pen then jumps from one side of the sheet to the other between every line. Sorting the paths by nearest neighbour cut one plot from 70 minutes to 31.

I run the sort and a simplify pass from a small shell script:

```bash
#!/usr/bin/env bash
set -euo pipefail

for svg in out/*.svg; do
  name="$(basename "$svg" .svg)"
  ./tools/penpath --sort nearest --merge 0.2mm --simplify 0.05mm \
    "$svg" > "plot/${name}.svg"
  echo "${name}: $(grep -c '<path' "plot/${name}.svg") paths"
done
```

> [!WARNING]
> Merging paths that end within 0.2 mm of each other saves a lot of pen lifts. Do not raise it much further: at 1 mm the plotter starts joining lines that were meant to stay apart.

## Update

I added the brush pen row in November. Brush pens need a lower speed than anything else I own, so the log now has a row per pen type instead of one per plot.
