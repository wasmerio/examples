---
title: The sixty-six character line
description: Why the width of a paragraph matters more than the font you spent a week choosing.
date: 2026-10-27
tags: [Typography, CSS]
---

Most of the pages I am asked to fix have the same problem, and it is not the typeface. It is the width. Somebody chose a lovely serif, set it at a sensible size, and then let each paragraph run from one edge of a wide monitor to the other. The eye reaches the end of a line and has to travel so far back that it loses its place. Readers do not describe this as a line length problem. They say the site feels tiring and then they leave.

Printers settled this long ago. A comfortable line of body text holds somewhere between 45 and 75 characters, spaces included, and 66 is the number that gets quoted most often. Shorter than that and the eye is forever turning corners. Longer and the return trip gets risky.

On the web the fix is one declaration:

```css
.prose {
  max-width: 60ch;
}
```

The `ch` unit is the width of the zero in the current font. Because most letters are narrower than a zero, `60ch` lands close to 66 real characters in a typical serif. Test it by counting an actual line instead of trusting the arithmetic.

## Two things follow

The first is that line height depends on line length. A longer line needs more space between lines so the eye can find its way home. Around 1.6 suits a 66 character measure. A narrow caption can sit at 1.35 and look better for it.

The second is that a narrow column leaves room to spare on a large screen, and that room is a gift. Put dates, notes and small navigation in the margin. Let a figure break out wider than the text when it has earned the attention.

Set the measure first. Every other decision on the page gets easier once the paragraph is the right width.
