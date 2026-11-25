+++
title = 'Math Test'
date = 2025-02-06T19:33:00+08:00
lastmodified = ""
author = ""
authorList = ""
license = "CC BY-NC-SA 4.0"
license_url = "https://creativecommons.org/licenses/by-nc-sa/4.0/"
cover = "./cover.jpg"
math = true
draft = false
+++

This is an example article showcasing mathematical formulas, including inline formulas and standalone formula blocks.

Since Markdown uses escape characters like ```\```, which can cause conflicts and lead to rendering errors in formulas, we replace ```\\(...\\)``` with ```$...$```, ```\\[...\\]``` with ```$$...$$```, and manually change the matrix line break symbol from ```\\``` to ```\\\\```.

Here are some configurations for MathJax.js:

```javascript
MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']]
  },
  svg: {
    fontCache: 'global'
  },
  options: {
    enableMenu: false
  }
};
```

## Inline Formulas

Einstein's mass-energy equation: $E = mc^2$, Pythagorean theorem: $a^2 + b^2 = c^2$

```latex
$E = mc^2$
