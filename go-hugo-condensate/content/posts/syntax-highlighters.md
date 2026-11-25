---
title: "Syntax Highlighters"
date: 2026-10-25T18:00:00
tags: ["Features", "Code"]
toc: true
---

Code blocks are highlighted at build time, so there is no script to load and no flash of unstyled text. Colors follow the light and dark setting.

<!--more-->

Each block below is tagged with its language. Use the name after the opening backticks, such as `python` or `nasm`, and the theme does the rest.

Line numbers are off by default. Add options after the language on the opening fence to turn them on and to highlight lines, as in the example below. Use `linenos=table` for a separate number column, and `hl_lines="2-4"` for a range. To number every block on the site, set `lineNos = true` under `[markup.highlight]` in your site config.

````text
```go {linenos=inline,hl_lines=[6]}
````

```go {linenos=inline,hl_lines=[6]}
package main

import "fmt"

func main() {
	fmt.Println("this line is highlighted")
	fmt.Println("this one is not")
}
```

## Python

```python
import base64
import re
from pathlib import Path

PATTERN = re.compile(
    r"powershell.*-enc\s+(?P<blob>[A-Za-z0-9+/=]+)",
    re.IGNORECASE,
)


class Finding(Exception):
    """Raised when an encoded command is found."""

