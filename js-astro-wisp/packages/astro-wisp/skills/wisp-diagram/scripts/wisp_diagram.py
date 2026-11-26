#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "playwright==1.64.1",
#   "fonttools[woff]>=4.53",
# ]
# ///
"""wisp-diagram 统一入口：lint / normalize / build / export / new / check / probe / cache。

    uv run scripts/wisp_diagram.py --help

首次运行时 uv 会按上面的内联依赖声明自动建好环境（无需 npm / pip install）。
导出用的 Chromium：`uv run --with playwright==1.64.1 playwright install chromium`。
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from wisp_diagram_lib.cli import main  # noqa: E402

if __name__ == "__main__":
    sys.exit(main())
