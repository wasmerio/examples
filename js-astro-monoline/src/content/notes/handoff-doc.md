---
title: The handoff doc
date: 2025-12-11
description: What goes in the one-page document I hand to engineers when a design is ready.
tags: [process]
---

I used to hand designs to engineers with a link and a hopeful message. Now I hand over one page of text beside the link, and the questions I get afterwards have dropped by about half. Dmitri, who builds most of what I design, says he reads the page first and the file second.

The page has five headings:

- What this is for, in two sentences
- What is decided, and what is still open
- Behaviour that the design does not show, such as loading, empty and error states
- Anything I would cut if time runs short
- Who to ask, and when I am out

The "would cut" section was Dmitri's idea. I resisted it because it felt like giving permission to ship less. It turned out to be the most used part. In November, a feature was two days late, and the engineers cut exactly the two things I had listed instead of guessing.

## Where it lives

In the same folder as the design file, named `handoff.txt`. I tried a shared document and found nobody could tell which version was current. A file in the folder, edited in place, is current by definition.

I review the page with the engineers in the same session as the [design review](/notes/design-review-rules), so the open questions get owners on the same afternoon. The weekly [update](/notes/status-updates) then links to the page instead of repeating it.
